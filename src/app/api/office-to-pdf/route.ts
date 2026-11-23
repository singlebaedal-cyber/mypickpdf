import { NextRequest, NextResponse } from "next/server";
import { execFile } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";
import os from "os";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const execFileAsync = promisify(execFile);

type OfficeProvider = "gotenberg" | "ilovepdf" | "cloudconvert" | "libreoffice";

interface ProviderStatus {
  available: boolean;
  provider: OfficeProvider | null;
  providers: OfficeProvider[];
  directUploadSupported: boolean;
  maxServerProxyBytes: number;
}

const ALLOWED_OFFICE_EXTS = new Set(["pptx", "ppt", "docx", "doc", "xlsx", "xls", "odp", "odt", "ods"]);
const MAX_SERVER_PROXY_BYTES = 4 * 1024 * 1024; // Safe under Vercel's 4.5MB body limit

let cachedLibreOfficePath: string | null | undefined = undefined;

async function findLocalLibreOffice(): Promise<string | null> {
  if (cachedLibreOfficePath !== undefined) return cachedLibreOfficePath;

  const candidates =
    process.platform === "win32"
      ? [
          "C:\\Program Files\\LibreOffice\\program\\soffice.exe",
          "C:\\Program Files (x86)\\LibreOffice\\program\\soffice.exe",
          "soffice",
        ]
      : ["/usr/bin/soffice", "/usr/local/bin/soffice", "/usr/bin/libreoffice", "soffice"];

  for (const bin of candidates) {
    try {
      if (bin.includes("/") || bin.includes("\\")) {
        await fs.access(bin);
        cachedLibreOfficePath = bin;
        return bin;
      } else {
        await execFileAsync(bin, ["--version"], { timeout: 3000 });
        cachedLibreOfficePath = bin;
        return bin;
      }
    } catch {
      // try next
    }
  }

  cachedLibreOfficePath = null;
  return null;
}

async function detectAvailableProviders(): Promise<ProviderStatus> {
  const providers: OfficeProvider[] = [];

  if (process.env.GOTENBERG_URL?.trim()) {
    providers.push("gotenberg");
  }
  if (process.env.ILOVEPDF_PUBLIC_KEY?.trim() || process.env.ILOVEPDF_SECRET_KEY?.trim()) {
    providers.push("ilovepdf");
  }
  if (process.env.CLOUDCONVERT_API_KEY?.trim()) {
    providers.push("cloudconvert");
  }
  const localBin = await findLocalLibreOffice();
  if (localBin) {
    providers.push("libreoffice");
  }

  const primary = providers[0] ?? null;
  const directUploadSupported =
    providers.includes("ilovepdf") ||
    providers.includes("cloudconvert") ||
    Boolean(process.env.NEXT_PUBLIC_GOTENBERG_URL?.trim());

  return {
    available: providers.length > 0,
    provider: primary,
    providers,
    directUploadSupported,
    maxServerProxyBytes: MAX_SERVER_PROXY_BYTES,
  };
}

function getExt(filename: string): string {
  const m = filename.toLowerCase().match(/\.([a-z0-9]+)$/);
  return m ? m[1] : "";
}

function sanitizeDownloadName(filename: string): string {
  const base = filename.replace(/\.[^/.]+$/, "").replace(/[^\w\-.가-힣\s]/g, "_");
  return `${base || "converted"}.pdf`;
}

/**
 * 1. Gotenberg (Self-hosted 100% Free & Unlimited LibreOffice Docker API)
 */
async function convertWithGotenberg(fileBuffer: Buffer, filename: string): Promise<Uint8Array> {
  const baseUrl = process.env.GOTENBERG_URL!.trim().replace(/\/+$/, "");
  const form = new FormData();
  const blob = new Blob([new Uint8Array(fileBuffer)]);
  form.append("files", blob, filename);

  const headers: Record<string, string> = {};
  if (process.env.GOTENBERG_API_KEY) {
    headers["Authorization"] = `Bearer ${process.env.GOTENBERG_API_KEY}`;
  }

  const res = await fetch(`${baseUrl}/forms/libreoffice/convert`, {
    method: "POST",
    headers,
    body: form,
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Gotenberg conversion failed (${res.status}): ${errText.slice(0, 200)}`);
  }

  return new Uint8Array(await res.arrayBuffer());
}

/**
 * 2. iLovePDF API (2,500 Free Conversions / Month Forever, No Credit Card)
 * Supports both Public Key (/v1/auth -> JWT) and Secret Key (X-Api-Key).
 */
async function getILovePdfToken(): Promise<string> {
  const publicKey = process.env.ILOVEPDF_PUBLIC_KEY?.trim();
  if (publicKey) {
    const authRes = await fetch("https://api.ilovepdf.com/v1/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ public_key: publicKey }),
    });
    if (!authRes.ok) {
      const errText = await authRes.text().catch(() => "");
      throw new Error(`iLovePDF auth failed (${authRes.status}): ${errText.slice(0, 200)}`);
    }
    const data = await authRes.json();
    if (!data?.token) throw new Error("iLovePDF auth response missing token");
    return data.token;
  }

  throw new Error("ILOVEPDF_PUBLIC_KEY is required for token authentication");
}

async function getILovePdfHeaders(): Promise<{ headers: Record<string, string>; token?: string }> {
  if (process.env.ILOVEPDF_PUBLIC_KEY?.trim()) {
    const token = await getILovePdfToken();
    return {
      headers: { Authorization: `Bearer ${token}` },
      token,
    };
  }
  const secretKey = process.env.ILOVEPDF_SECRET_KEY?.trim();
  if (secretKey) {
    return {
      headers: { "X-Api-Key": secretKey },
    };
  }
  throw new Error("iLovePDF credentials not configured");
}

async function startILovePdfTask(): Promise<{ server: string; task: string; token?: string; headers: Record<string, string> }> {
  const { headers, token } = await getILovePdfHeaders();
  const startRes = await fetch("https://api.ilovepdf.com/v1/start/officepdf", {
    method: "GET",
    headers,
  });
  if (!startRes.ok) {
    const errText = await startRes.text().catch(() => "");
    throw new Error(`iLovePDF start failed (${startRes.status}): ${errText.slice(0, 200)}`);
  }
  const data = await startRes.json();
  if (!data?.server || !data?.task) {
    throw new Error("iLovePDF start response invalid");
  }
  return { server: data.server, task: data.task, token, headers };
}

async function processAndDownloadILovePdf(
  server: string,
  task: string,
  serverFilename: string,
  originalFilename: string,
  headers: Record<string, string>
): Promise<Uint8Array> {
  // Validate server domain to prevent SSRF
  if (!/^[a-z0-9.-]+\.ilovepdf\.com$/i.test(server)) {
    throw new Error("Invalid iLovePDF server hostname");
  }

  const processRes = await fetch(`https://${server}/v1/process`, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      task,
      tool: "officepdf",
      files: [
        {
          server_filename: serverFilename,
          filename: originalFilename,
        },
      ],
    }),
  });

  if (!processRes.ok) {
    const errText = await processRes.text().catch(() => "");
    throw new Error(`iLovePDF process failed (${processRes.status}): ${errText.slice(0, 200)}`);
  }

  const downloadRes = await fetch(`https://${server}/v1/download/${encodeURIComponent(task)}`, {
    method: "GET",
    headers,
  });

  if (!downloadRes.ok) {
    const errText = await downloadRes.text().catch(() => "");
    throw new Error(`iLovePDF download failed (${downloadRes.status}): ${errText.slice(0, 200)}`);
  }

  return new Uint8Array(await downloadRes.arrayBuffer());
}

async function convertWithILovePdfServerSide(fileBuffer: Buffer, filename: string): Promise<Uint8Array> {
  const { server, task, headers } = await startILovePdfTask();

  const uploadForm = new FormData();
  uploadForm.append("task", task);
  uploadForm.append("file", new Blob([new Uint8Array(fileBuffer)]), filename);

  const uploadRes = await fetch(`https://${server}/v1/upload`, {
    method: "POST",
    headers,
    body: uploadForm,
  });

  if (!uploadRes.ok) {
    const errText = await uploadRes.text().catch(() => "");
    throw new Error(`iLovePDF upload failed (${uploadRes.status}): ${errText.slice(0, 200)}`);
  }

  const uploadData = await uploadRes.json();
  if (!uploadData?.server_filename) {
    throw new Error("iLovePDF upload missing server_filename");
  }

  return await processAndDownloadILovePdf(server, task, uploadData.server_filename, filename, headers);
}

/**
 * 3. CloudConvert REST API v2 (Daily Free Quota, Native MS Office / LibreOffice Engine)
 */
async function initCloudConvertJob(inputFormat: string): Promise<{
  jobId: string;
  uploadUrl: string;
  uploadParams: Record<string, string>;
}> {
  const apiKey = process.env.CLOUDCONVERT_API_KEY!.trim();
  const res = await fetch("https://api.cloudconvert.com/v2/jobs", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tasks: {
        "import-file": {
          operation: "import/upload",
        },
        "convert-pdf": {
          operation: "convert",
          input: "import-file",
          input_format: inputFormat,
          output_format: "pdf",
          engine: "office",
        },
        "export-pdf": {
          operation: "export/url",
          input: "convert-pdf",
        },
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`CloudConvert job creation failed (${res.status}): ${errText.slice(0, 200)}`);
  }

  const json = await res.json();
  const jobId = json?.data?.id;
  const tasks = json?.data?.tasks || [];
  const importTask = tasks.find((t: any) => t.name === "import-file");
  const form = importTask?.result?.form;

  if (!jobId || !form?.url) {
    throw new Error("CloudConvert job did not return upload form");
  }

  return {
    jobId,
    uploadUrl: form.url,
    uploadParams: form.parameters || {},
  };
}

async function getCloudConvertJobStatus(jobId: string): Promise<{
  status: string;
  downloadUrl?: string;
  error?: string;
}> {
  const apiKey = process.env.CLOUDCONVERT_API_KEY!.trim();
  const res = await fetch(`https://api.cloudconvert.com/v2/jobs/${encodeURIComponent(jobId)}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`CloudConvert status failed (${res.status}): ${errText.slice(0, 200)}`);
  }

  const json = await res.json();
  const status = json?.data?.status || "unknown";
  const tasks = json?.data?.tasks || [];

  if (status === "finished") {
    const exportTask = tasks.find((t: any) => t.name === "export-pdf");
    const fileUrl = exportTask?.result?.files?.[0]?.url;
    return { status: "finished", downloadUrl: fileUrl };
  }

  if (status === "error") {
    const failedTask = tasks.find((t: any) => t.status === "error");
    return { status: "error", error: failedTask?.message || "Conversion failed" };
  }

  return { status };
}

/**
 * 4. Local LibreOffice CLI (soffice --headless --convert-to pdf)
 */
async function convertWithLocalLibreOffice(fileBuffer: Buffer, filename: string): Promise<Uint8Array> {
  const bin = await findLocalLibreOffice();
  if (!bin) throw new Error("LibreOffice binary not found");

  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "pdfpick-office-"));
  try {
    const ext = getExt(filename) || "pptx";
    const inPath = path.join(tmpDir, `input.${ext}`);
    const outPath = path.join(tmpDir, "input.pdf");

    await fs.writeFile(inPath, fileBuffer);
    await execFileAsync(bin, ["--headless", "--convert-to", "pdf", "--outdir", tmpDir, inPath], {
      timeout: 45000,
    });

    const pdfBytes = await fs.readFile(outPath);
    return new Uint8Array(pdfBytes);
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true }).catch(() => {});
  }
}

/**
 * GET /api/office-to-pdf
 * Lightweight capability discovery (zero cost, lets client choose best path immediately)
 */
export async function GET() {
  const status = await detectAvailableProviders();
  return NextResponse.json(status);
}

/**
 * POST /api/office-to-pdf
 * Mode A (application/json): Direct-upload orchestration for large files (> 4MB, bypasses Vercel 4.5MB limit)
 * Mode B (multipart/form-data): Direct server-side conversion for files <= 4MB
 */
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    // === Mode A: JSON Direct-Upload Orchestration (iLovePDF / CloudConvert) ===
    if (contentType.includes("application/json")) {
      const body = await req.json();
      const { action } = body;

      if (action === "init") {
        const filename = String(body.filename || "document.pptx");
        const ext = getExt(filename);
        if (!ALLOWED_OFFICE_EXTS.has(ext)) {
          return NextResponse.json({ error: `Unsupported file extension: .${ext}` }, { status: 400 });
        }

        // Prefer iLovePDF (2,500 free/mo) when Public Key is set for direct browser upload
        if (process.env.ILOVEPDF_PUBLIC_KEY?.trim()) {
          const { server, task, token } = await startILovePdfTask();
          return NextResponse.json({
            provider: "ilovepdf",
            server,
            task,
            token,
          });
        }

        // Next: CloudConvert v2 (daily free tier, native MS Office engine, direct S3 upload)
        if (process.env.CLOUDCONVERT_API_KEY?.trim()) {
          const job = await initCloudConvertJob(ext);
          return NextResponse.json({
            provider: "cloudconvert",
            ...job,
          });
        }

        return NextResponse.json(
          { error: "No direct-upload cloud API configured", fallbackToClient: true },
          { status: 501 }
        );
      }

      if (action === "process-ilovepdf") {
        const { server, task, token, serverFilename, filename } = body;
        if (!server || !task || !serverFilename) {
          return NextResponse.json({ error: "Missing required iLovePDF task parameters" }, { status: 400 });
        }
        const headers: Record<string, string> = token
          ? { Authorization: `Bearer ${token}` }
          : (await getILovePdfHeaders()).headers;

        const pdfBytes = await processAndDownloadILovePdf(
          String(server),
          String(task),
          String(serverFilename),
          String(filename || "document.pptx"),
          headers
        );

        return new NextResponse(Buffer.from(pdfBytes), {
          status: 200,
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${encodeURIComponent(sanitizeDownloadName(String(filename || "document.pptx")))}"`,
            "X-Conversion-Engine": "ilovepdf-officepdf",
          },
        });
      }

      if (action === "status-cloudconvert") {
        const { jobId } = body;
        if (!jobId) {
          return NextResponse.json({ error: "Missing jobId" }, { status: 400 });
        }
        const st = await getCloudConvertJobStatus(String(jobId));
        return NextResponse.json(st);
      }

      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }

    // === Mode B: Multipart File Upload (Gotenberg / iLovePDF / CloudConvert / Local LibreOffice) ===
    const formData = await req.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const ext = getExt(file.name);
    if (!ALLOWED_OFFICE_EXTS.has(ext)) {
      return NextResponse.json({ error: `Unsupported format: .${ext}` }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const status = await detectAvailableProviders();

    if (!status.available) {
      return NextResponse.json(
        { error: "No server Office-to-PDF API configured", fallbackToClient: true },
        { status: 501 }
      );
    }

    const errors: string[] = [];

    for (const provider of status.providers) {
      try {
        let pdfBytes: Uint8Array;
        if (provider === "gotenberg") {
          pdfBytes = await convertWithGotenberg(fileBuffer, file.name);
        } else if (provider === "ilovepdf") {
          pdfBytes = await convertWithILovePdfServerSide(fileBuffer, file.name);
        } else if (provider === "cloudconvert") {
          const job = await initCloudConvertJob(ext);
          const upForm = new FormData();
          for (const [k, v] of Object.entries(job.uploadParams)) {
            upForm.append(k, String(v));
          }
          upForm.append("file", new Blob([new Uint8Array(fileBuffer)]), file.name);
          const upRes = await fetch(job.uploadUrl, { method: "POST", body: upForm });
          if (!upRes.ok) throw new Error(`CloudConvert upload failed (${upRes.status})`);

          // Poll up to 45 seconds
          let downloadUrl: string | undefined;
          for (let attempt = 0; attempt < 30; attempt++) {
            await new Promise((r) => setTimeout(r, 1500));
            const st = await getCloudConvertJobStatus(job.jobId);
            if (st.status === "finished" && st.downloadUrl) {
              downloadUrl = st.downloadUrl;
              break;
            }
            if (st.status === "error") {
              throw new Error(st.error || "CloudConvert error");
            }
          }
          if (!downloadUrl) throw new Error("CloudConvert timed out");
          const dlRes = await fetch(downloadUrl);
          if (!dlRes.ok) throw new Error(`CloudConvert download failed (${dlRes.status})`);
          pdfBytes = new Uint8Array(await dlRes.arrayBuffer());
        } else {
          pdfBytes = await convertWithLocalLibreOffice(fileBuffer, file.name);
        }

        return new NextResponse(Buffer.from(pdfBytes), {
          status: 200,
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${encodeURIComponent(sanitizeDownloadName(file.name))}"`,
            "X-Conversion-Engine": provider,
          },
        });
      } catch (err: any) {
        console.warn(`[office-to-pdf] Provider ${provider} failed:`, err?.message || err);
        errors.push(`${provider}: ${err?.message || "failed"}`);
      }
    }

    return NextResponse.json(
      {
        error: "All configured Office-to-PDF providers failed",
        details: errors,
        fallbackToClient: true,
      },
      { status: 502 }
    );
  } catch (err: any) {
    console.error("[office-to-pdf] Unexpected error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error", fallbackToClient: true },
      { status: 500 }
    );
  }
}
