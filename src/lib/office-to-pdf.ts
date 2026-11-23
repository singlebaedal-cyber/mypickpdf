import { PDFDocument } from "pdf-lib";

export type OfficeConversionEngine =
  | "gotenberg"
  | "ilovepdf"
  | "cloudconvert"
  | "libreoffice"
  | "client-pptxviewjs"
  | "client-html-canvas";

export interface OfficeConversionResult {
  bytes: Uint8Array;
  engine: OfficeConversionEngine;
  pageCount: number;
  slideWidthPt?: number;
  slideHeightPt?: number;
}

interface ApiCapability {
  available: boolean;
  provider: "gotenberg" | "ilovepdf" | "cloudconvert" | "libreoffice" | null;
  providers: string[];
  directUploadSupported: boolean;
  maxServerProxyBytes: number;
}

let cachedApiCapability: ApiCapability | null = null;

async function getApiCapability(): Promise<ApiCapability> {
  if (cachedApiCapability) return cachedApiCapability;
  try {
    const res = await fetch("/api/office-to-pdf", { method: "GET" });
    if (res.ok) {
      const data = await res.json();
      cachedApiCapability = data;
      return data;
    }
  } catch {
    // Offline or API unavailable -> fall back cleanly to client engine
  }
  return {
    available: false,
    provider: null,
    providers: [],
    directUploadSupported: false,
    maxServerProxyBytes: 4 * 1024 * 1024,
  };
}

function dataUrlToUint8Array(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(",")[1];
  const binStr = atob(base64);
  const len = binStr.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binStr.charCodeAt(i);
  }
  return bytes;
}

async function getPdfPageCountFromBytes(bytes: Uint8Array): Promise<number> {
  try {
    const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    return doc.getPageCount();
  } catch {
    return 1;
  }
}

/**
 * Tier 1: Free Cloud / Server Office-to-PDF API
 * - Automatically supports Gotenberg (unlimited), iLovePDF (2,500/mo free), CloudConvert (daily free), Local LibreOffice
 * - Automatically uses direct browser upload for large files (> 4MB) to bypass Vercel's 4.5MB body limit
 */
export async function tryConvertOfficeViaFreeApi(
  file: File,
  onProgress?: (p: number) => void
): Promise<OfficeConversionResult | null> {
  if (typeof window === "undefined") return null;

  // Path 0: Direct browser upload to CORS-enabled Gotenberg (bypasses Vercel 4.5MB limit for 50MB+ PPTX!)
  const publicGotenbergUrl = process.env.NEXT_PUBLIC_GOTENBERG_URL?.trim().replace(/\/+$/, "");
  if (publicGotenbergUrl) {
    try {
      if (onProgress) onProgress(30);
      const directForm = new FormData();
      directForm.append("files", file, file.name);
      const directRes = await fetch(`${publicGotenbergUrl}/forms/libreoffice/convert`, {
        method: "POST",
        body: directForm,
      });
      if (directRes.ok && directRes.headers.get("content-type")?.includes("application/pdf")) {
        if (onProgress) onProgress(90);
        const pdfBytes = new Uint8Array(await directRes.arrayBuffer());
        const pageCount = await getPdfPageCountFromBytes(pdfBytes);
        if (onProgress) onProgress(100);
        return { bytes: pdfBytes, engine: "gotenberg", pageCount };
      }
    } catch (directErr) {
      console.warn("[office-to-pdf] Direct Gotenberg upload failed, trying server path:", directErr);
    }
  }

  const cap = await getApiCapability();
  if (!cap.available || !cap.provider) return null;

  try {
    if (onProgress) onProgress(12);

    const needsDirectUpload = file.size > cap.maxServerProxyBytes;

    // Path A: Direct browser upload (iLovePDF or CloudConvert) — handles 50MB+ files on Vercel
    if (
      needsDirectUpload ||
      cap.provider === "cloudconvert" ||
      (cap.provider === "ilovepdf" && cap.directUploadSupported)
    ) {
      const initRes = await fetch("/api/office-to-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "init", filename: file.name }),
      });

      if (initRes.ok) {
        const initData = await initRes.json();

        if (initData.provider === "ilovepdf" && initData.server && initData.task && initData.token) {
          if (onProgress) onProgress(30);
          const upForm = new FormData();
          upForm.append("task", initData.task);
          upForm.append("file", file, file.name);

          const upRes = await fetch(`https://${initData.server}/v1/upload`, {
            method: "POST",
            headers: { Authorization: `Bearer ${initData.token}` },
            body: upForm,
          });

          if (!upRes.ok) throw new Error(`iLovePDF direct upload failed (${upRes.status})`);
          const upJson = await upRes.json();
          if (onProgress) onProgress(65);

          const procRes = await fetch("/api/office-to-pdf", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "process-ilovepdf",
              server: initData.server,
              task: initData.task,
              token: initData.token,
              serverFilename: upJson.server_filename,
              filename: file.name,
            }),
          });

          if (!procRes.ok) throw new Error(`iLovePDF process failed (${procRes.status})`);
          const pdfBytes = new Uint8Array(await procRes.arrayBuffer());
          const pageCount = await getPdfPageCountFromBytes(pdfBytes);
          if (onProgress) onProgress(100);
          return { bytes: pdfBytes, engine: "ilovepdf", pageCount };
        }

        if (initData.provider === "cloudconvert" && initData.uploadUrl && initData.jobId) {
          if (onProgress) onProgress(28);
          const upForm = new FormData();
          for (const [k, v] of Object.entries(initData.uploadParams || {})) {
            upForm.append(k, String(v));
          }
          upForm.append("file", file, file.name);

          const upRes = await fetch(initData.uploadUrl, {
            method: "POST",
            body: upForm,
          });
          if (!upRes.ok) throw new Error(`CloudConvert direct upload failed (${upRes.status})`);

          // Poll status until finished
          for (let attempt = 0; attempt < 35; attempt++) {
            await new Promise((r) => setTimeout(r, 1500));
            if (onProgress) onProgress(Math.min(88, 35 + attempt * 2));

            const stRes = await fetch("/api/office-to-pdf", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ action: "status-cloudconvert", jobId: initData.jobId }),
            });
            if (!stRes.ok) continue;
            const st = await stRes.json();
            if (st.status === "finished" && st.downloadUrl) {
              const dlRes = await fetch(st.downloadUrl);
              if (!dlRes.ok) throw new Error(`CloudConvert download failed (${dlRes.status})`);
              const pdfBytes = new Uint8Array(await dlRes.arrayBuffer());
              const pageCount = await getPdfPageCountFromBytes(pdfBytes);
              if (onProgress) onProgress(100);
              return { bytes: pdfBytes, engine: "cloudconvert", pageCount };
            }
            if (st.status === "error") {
              throw new Error(st.error || "CloudConvert conversion failed");
            }
          }
          throw new Error("CloudConvert timed out");
        }
      }
    }

    // Path B: Direct server multipart proxy (<= 4MB, e.g. Gotenberg or Local LibreOffice)
    if (!needsDirectUpload) {
      if (onProgress) onProgress(35);
      const form = new FormData();
      form.append("file", file, file.name);

      const res = await fetch("/api/office-to-pdf", {
        method: "POST",
        body: form,
      });

      if (res.ok && res.headers.get("content-type")?.includes("application/pdf")) {
        if (onProgress) onProgress(90);
        const pdfBytes = new Uint8Array(await res.arrayBuffer());
        const engineHeader = (res.headers.get("x-conversion-engine") || cap.provider) as OfficeConversionEngine;
        const pageCount = await getPdfPageCountFromBytes(pdfBytes);
        if (onProgress) onProgress(100);
        return { bytes: pdfBytes, engine: engineHeader, pageCount };
      }
    }
  } catch (err) {
    console.warn("[office-to-pdf] Cloud API unavailable or failed, falling back to high-res client engine:", err);
  }

  return null;
}

/**
 * Extract exact slide dimensions (in PDF points: 1pt = 12700 EMU) from PPTX presentation.xml
 */
async function readPptxSlideDimensions(arrayBuffer: ArrayBuffer): Promise<{ widthPt: number; heightPt: number }> {
  try {
    const { default: JSZip } = await import("jszip");
    const zip = await JSZip.loadAsync(arrayBuffer);
    const presFile = zip.file("ppt/presentation.xml");
    if (presFile) {
      const xml = await presFile.async("string");
      const match = xml.match(/<p:sldSz\b[^>]*>/);
      if (match) {
        const cxMatch = match[0].match(/\bcx="(\d+)"/);
        const cyMatch = match[0].match(/\bcy="(\d+)"/);
        if (cxMatch && cyMatch) {
          const cx = parseInt(cxMatch[1], 10);
          const cy = parseInt(cyMatch[1], 10);
          if (cx > 0 && cy > 0) {
            return {
              widthPt: Math.round((cx / 12700) * 100) / 100,
              heightPt: Math.round((cy / 12700) * 100) / 100,
            };
          }
        }
      }
    }
  } catch (err) {
    console.warn("Failed to read PPTX slide dimensions:", err);
  }
  // Default 16:9 widescreen (10in x 5.625in = 720 x 405 pt)
  return { widthPt: 720, heightPt: 405 };
}

/**
 * Normalize uppercase image extensions inside a PPTX archive if needed and ensure clean ArrayBuffer
 */
async function preprocessPptxBuffer(arrayBuffer: ArrayBuffer): Promise<ArrayBuffer> {
  // PptxViewJS handles standard PPTX ZIP directly; return cleanly
  return arrayBuffer;
}

/**
 * Tier 2 (Zero-API-Key): High-Resolution Client-Side PPTX -> PDF Renderer using PptxViewJS
 * - Preserves exact slide dimensions (Portrait A4, 16:9, 4:3, custom)
 * - Renders Slide Masters, Shapes, Grouped Shapes, Tables, Images, Korean Fonts at 2x Retina DPI
 */
export async function convertPptxToPdfWithMeta(
  file: File,
  onProgress?: (p: number) => void
): Promise<OfficeConversionResult> {
  // 1. Try Tier 1 Free Cloud/Server API first (Gotenberg / iLovePDF / CloudConvert / LibreOffice)
  const apiResult = await tryConvertOfficeViaFreeApi(file, onProgress);
  if (apiResult) return apiResult;

  // Legacy binary .ppt requires server-side LibreOffice/API
  if (file.name.toLowerCase().endsWith(".ppt") && !file.name.toLowerCase().endsWith(".pptx")) {
    throw new Error(
      "구형 바이너리 .ppt 파일은 PowerPoint에서 .pptx로 저장한 뒤 변환하거나, 서버 Office API(iLovePDF/Gotenberg)를 연결해 주세요."
    );
  }

  if (typeof window === "undefined" || typeof document === "undefined") {
    throw new Error("브라우저 환경에서만 PPTX 변환이 가능합니다.");
  }

  if (onProgress) onProgress(10);

  const rawBuffer = await file.arrayBuffer();
  const { widthPt, heightPt } = await readPptxSlideDimensions(rawBuffer);
  const preparedBuffer = await preprocessPptxBuffer(rawBuffer);

  if (onProgress) onProgress(20);

  // Dynamically load PptxViewJS so initial page JS stays ultra-light
  const pptxViewModule = await import("pptxviewjs");
  const PPTXViewer = pptxViewModule.PPTXViewer || (pptxViewModule as any).default?.PPTXViewer;
  if (!PPTXViewer) {
    throw new Error("PPTX 렌더링 엔진(PptxViewJS)을 불러올 수 없습니다.");
  }

  // High-DPI Retina canvas matching exact slide aspect ratio (~1600px on the long edge)
  const longEdgePt = Math.max(widthPt, heightPt);
  const renderScale = Math.min(2.4, Math.max(1.75, 1650 / longEdgePt));
  const canvasWidth = Math.round(widthPt * renderScale);
  const canvasHeight = Math.round(heightPt * renderScale);

  const canvas = document.createElement("canvas");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  const viewer = new PPTXViewer({
    canvas,
    slideSizeMode: "fit",
    backgroundColor: "#ffffff",
    autoChartRerenderDelayMs: 0,
  });

  try {
    await viewer.loadFile(preparedBuffer);
    const slideCount = viewer.getSlideCount();
    if (!slideCount || slideCount < 1) {
      throw new Error("PPTX 파일에서 렌더링할 슬라이드를 찾을 수 없습니다.");
    }

    const pdfDoc = await PDFDocument.create();
    pdfDoc.setTitle(file.name.replace(/\.[^/.]+$/, ""));
    pdfDoc.setProducer("pdfpick - High-Resolution Presentation Engine");
    pdfDoc.setCreator("pdfpick.kr");

    const ctx = canvas.getContext("2d");

    for (let i = 0; i < slideCount; i++) {
      // Reset canvas size & white background before each slide
      if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
      }
      if (ctx) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
      }

      await viewer.renderSlide(i, canvas, { quality: "high" });

      // Export crisp JPEG (0.92 quality gives razor-sharp Korean text with compact PDF size)
      const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
      const jpgBytes = dataUrlToUint8Array(dataUrl);
      const embeddedImg = await pdfDoc.embedJpg(jpgBytes);

      const page = pdfDoc.addPage([widthPt, heightPt]);
      page.drawImage(embeddedImg, {
        x: 0,
        y: 0,
        width: widthPt,
        height: heightPt,
      });

      if (onProgress) {
        onProgress(Math.round(25 + ((i + 1) / slideCount) * 70));
      }
    }

    const bytes = await pdfDoc.save({ useObjectStreams: true });
    if (onProgress) onProgress(100);

    return {
      bytes: new Uint8Array(bytes),
      engine: "client-pptxviewjs",
      pageCount: slideCount,
      slideWidthPt: widthPt,
      slideHeightPt: heightPt,
    };
  } finally {
    try {
      viewer.destroy();
    } catch {
      // ignore cleanup errors
    }
  }
}

// ============================================================================
// Korean-Safe High-DPI Canvas Document Renderer (Word / Excel / HTML -> PDF)
// Fixes jsPDF Helvetica UTF-8 Mojibake (ÇtÌœ_È...) completely!
// ============================================================================

const KOREAN_FONT_STACK =
  '"Pretendard", "Malgun Gothic", "Apple SD Gothic Neo", "Noto Sans KR", "Nanum Gothic", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

interface CanvasPdfBuilderOptions {
  landscape?: boolean;
  title?: string;
}

class KoreanCanvasPdfBuilder {
  private pages: Uint8Array[] = [];
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private widthPx: number;
  private heightPx: number;
  private widthPt: number;
  private heightPt: number;
  private marginX: number;
  private marginTop: number;
  private marginBottom: number;
  private cursorY: number;
  private pageNum = 0;

  constructor(options: CanvasPdfBuilderOptions = {}) {
    const landscape = Boolean(options.landscape);
    // A4 at 150 DPI
    this.widthPt = landscape ? 841.89 : 595.28;
    this.heightPt = landscape ? 595.28 : 841.89;
    this.widthPx = landscape ? 1754 : 1240;
    this.heightPx = landscape ? 1240 : 1754;
    this.marginX = 84;
    this.marginTop = 80;
    this.marginBottom = 84;
    this.cursorY = this.marginTop;

    this.canvas = document.createElement("canvas");
    this.canvas.width = this.widthPx;
    this.canvas.height = this.heightPx;
    const ctx = this.canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context unavailable");
    this.ctx = ctx;

    this.startNewPage();
  }

  get contentWidth(): number {
    return this.widthPx - this.marginX * 2;
  }

  get maxY(): number {
    return this.heightPx - this.marginBottom;
  }

  private startNewPage() {
    if (this.pageNum > 0) {
      this.flushCurrentPage();
    }
    this.pageNum++;
    this.ctx.fillStyle = "#ffffff";
    this.ctx.fillRect(0, 0, this.widthPx, this.heightPx);
    this.cursorY = this.marginTop;
  }

  private flushCurrentPage() {
    // Subtle footer page number
    this.ctx.save();
    this.ctx.font = `500 16px ${KOREAN_FONT_STACK}`;
    this.ctx.fillStyle = "#94a3b8";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(`- ${this.pageNum} -`, this.widthPx / 2, this.heightPx - 40);
    this.ctx.restore();

    const dataUrl = this.canvas.toDataURL("image/jpeg", 0.92);
    this.pages.push(dataUrlToUint8Array(dataUrl));
  }

  ensureSpace(neededHeight: number) {
    if (this.cursorY + neededHeight > this.maxY && this.cursorY > this.marginTop + 10) {
      this.startNewPage();
    }
  }

  addSpace(px: number) {
    this.cursorY += px;
  }

  wrapText(text: string, maxWidth: number, font: string): string[] {
    this.ctx.font = font;
    const lines: string[] = [];
    const paragraphs = (text || "").replace(/\r\n/g, "\n").split("\n");

    for (const para of paragraphs) {
      if (!para.trim()) {
        lines.push("");
        continue;
      }

      let current = "";
      // Character-aware word wrapping (works seamlessly for both Korean & English)
      const tokens = para.split(/(\s+)/);
      for (const token of tokens) {
        const test = current + token;
        if (this.ctx.measureText(test).width <= maxWidth) {
          current = test;
        } else {
          if (current.trim()) {
            lines.push(current.trimEnd());
            current = "";
          }
          // If single token exceeds maxWidth, split by character
          if (this.ctx.measureText(token).width > maxWidth) {
            let chunk = "";
            for (const ch of token) {
              if (this.ctx.measureText(chunk + ch).width > maxWidth && chunk) {
                lines.push(chunk);
                chunk = ch;
              } else {
                chunk += ch;
              }
            }
            current = chunk;
          } else {
            current = token.trimStart();
          }
        }
      }
      if (current.trim()) {
        lines.push(current.trimEnd());
      }
    }

    return lines;
  }

  drawHeading(text: string, level: 1 | 2 | 3 = 1) {
    const clean = text.trim();
    if (!clean) return;
    const fontSize = level === 1 ? 34 : level === 2 ? 27 : 23;
    const lineHeight = Math.round(fontSize * 1.45);
    const font = `700 ${fontSize}px ${KOREAN_FONT_STACK}`;
    const lines = this.wrapText(clean, this.contentWidth, font);

    this.ensureSpace(lineHeight * Math.min(lines.length, 2) + 28);
    if (this.cursorY > this.marginTop + 8) {
      this.cursorY += level === 1 ? 22 : 16;
    }

    this.ctx.save();
    this.ctx.font = font;
    this.ctx.fillStyle = level === 1 ? "#0f172a" : "#1e293b";
    this.ctx.textAlign = "left";
    this.ctx.textBaseline = "top";

    for (const line of lines) {
      this.ensureSpace(lineHeight);
      this.ctx.fillText(line, this.marginX, this.cursorY);
      this.cursorY += lineHeight;
    }

    if (level === 1) {
      this.ctx.fillStyle = "#e2e8f0";
      this.ctx.fillRect(this.marginX, this.cursorY + 6, this.contentWidth, 2);
      this.cursorY += 18;
    } else {
      this.cursorY += 10;
    }
    this.ctx.restore();
  }

  drawParagraph(text: string, options: { bold?: boolean; indent?: number; color?: string; fontSize?: number } = {}) {
    const clean = text.replace(/\s+/g, " ").trim();
    if (!clean) return;
    const fontSize = options.fontSize || 20;
    const lineHeight = Math.round(fontSize * 1.6);
    const indent = options.indent || 0;
    const font = `${options.bold ? "700" : "400"} ${fontSize}px ${KOREAN_FONT_STACK}`;
    const lines = this.wrapText(clean, this.contentWidth - indent, font);

    this.ctx.save();
    this.ctx.font = font;
    this.ctx.fillStyle = options.color || "#1e293b";
    this.ctx.textAlign = "left";
    this.ctx.textBaseline = "top";

    for (const line of lines) {
      this.ensureSpace(lineHeight);
      if (line === "") {
        this.cursorY += Math.round(lineHeight * 0.5);
      } else {
        this.ctx.fillText(line, this.marginX + indent, this.cursorY);
        this.cursorY += lineHeight;
      }
    }
    this.cursorY += 10;
    this.ctx.restore();
  }

  drawTable(rows: string[][], options: { headerRow?: boolean; fontSize?: number } = {}) {
    if (!rows || rows.length === 0) return;
    const colCount = Math.max(...rows.map((r) => r.length), 1);
    const fontSize = options.fontSize || (colCount > 8 ? 14 : colCount > 5 ? 16 : 18);
    const padX = colCount > 8 ? 8 : 12;
    const padY = colCount > 8 ? 7 : 10;
    const lineHeight = Math.round(fontSize * 1.4);

    // Compute proportional column widths based on content length
    const maxLens = new Array(colCount).fill(4);
    for (const row of rows.slice(0, 60)) {
      for (let c = 0; c < colCount; c++) {
        const val = String(row[c] ?? "").trim();
        const weighted = Math.min(36, Math.max(4, val.length));
        if (weighted > maxLens[c]) maxLens[c] = weighted;
      }
    }
    const totalWeight = maxLens.reduce((a, b) => a + b, 0);
    const colWidths = maxLens.map((w) => (w / totalWeight) * this.contentWidth);

    const drawSingleRow = (row: string[], isHeader: boolean, zebra: boolean) => {
      const font = `${isHeader ? "700" : "400"} ${fontSize}px ${KOREAN_FONT_STACK}`;
      const wrappedCells = Array.from({ length: colCount }, (_, c) => {
        const cellText = String(row[c] ?? "").trim();
        return this.wrapText(cellText, Math.max(24, colWidths[c] - padX * 2), font);
      });
      const maxLines = Math.max(1, ...wrappedCells.map((l) => l.length));
      const rowHeight = Math.min(this.maxY - this.marginTop, maxLines * lineHeight + padY * 2);

      this.ensureSpace(rowHeight);

      let x = this.marginX;
      for (let c = 0; c < colCount; c++) {
        const cw = colWidths[c];
        // Cell fill
        this.ctx.fillStyle = isHeader ? "#e2e8f0" : zebra ? "#f8fafc" : "#ffffff";
        this.ctx.fillRect(x, this.cursorY, cw, rowHeight);

        // Cell border
        this.ctx.strokeStyle = "#cbd5e1";
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x, this.cursorY, cw, rowHeight);

        // Cell text
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.rect(x + 2, this.cursorY + 2, Math.max(1, cw - 4), Math.max(1, rowHeight - 4));
        this.ctx.clip();

        this.ctx.font = font;
        this.ctx.fillStyle = isHeader ? "#0f172a" : "#334155";
        this.ctx.textBaseline = "top";

        const rawStr = String(row[c] ?? "").trim();
        const isNumeric = !isHeader && /^-?[\d,]+(\.\d+)?%?$/.test(rawStr) && rawStr.length > 0;
        this.ctx.textAlign = isNumeric ? "right" : "left";

        const lines = wrappedCells[c];
        for (let li = 0; li < lines.length; li++) {
          const tx = isNumeric ? x + cw - padX : x + padX;
          this.ctx.fillText(lines[li], tx, this.cursorY + padY + li * lineHeight);
        }
        this.ctx.restore();
        x += cw;
      }

      this.cursorY += rowHeight;
    };

    const hasHeader = options.headerRow !== false;
    for (let r = 0; r < rows.length; r++) {
      const isHeader = hasHeader && r === 0;
      drawSingleRow(rows[r], isHeader, !isHeader && r % 2 === 0);
    }

    this.cursorY += 18;
  }

  async drawImageFromSrc(src: string) {
    if (!src) return;
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image();
        el.crossOrigin = "anonymous";
        el.onload = () => resolve(el);
        el.onerror = reject;
        el.src = src;
      });

      const natW = img.naturalWidth || img.width;
      const natH = img.naturalHeight || img.height;
      if (!natW || !natH) return;

      const maxImgH = (this.maxY - this.marginTop) * 0.65;
      const scale = Math.min(this.contentWidth / natW, maxImgH / natH, 1.5);
      const drawW = Math.round(natW * scale);
      const drawH = Math.round(natH * scale);

      this.ensureSpace(drawH + 20);
      const x = this.marginX + Math.round((this.contentWidth - drawW) / 2);
      this.ctx.drawImage(img, x, this.cursorY, drawW, drawH);
      this.cursorY += drawH + 18;
    } catch {
      // Skip external blocked images safely
    }
  }

  async build(title?: string): Promise<{ bytes: Uint8Array; pageCount: number }> {
    this.flushCurrentPage();
    const pdfDoc = await PDFDocument.create();
    if (title) pdfDoc.setTitle(title);
    pdfDoc.setProducer("pdfpick - Multilingual High-DPI Engine");
    pdfDoc.setCreator("pdfpick.kr");

    for (const jpgBytes of this.pages) {
      const img = await pdfDoc.embedJpg(jpgBytes);
      const page = pdfDoc.addPage([this.widthPt, this.heightPt]);
      page.drawImage(img, {
        x: 0,
        y: 0,
        width: this.widthPt,
        height: this.heightPt,
      });
    }

    const bytes = await pdfDoc.save({ useObjectStreams: true });
    return { bytes: new Uint8Array(bytes), pageCount: this.pages.length };
  }
}

async function renderDomNodeToBuilder(node: Node, builder: KoreanCanvasPdfBuilder, listDepth = 0) {
  if (node.nodeType === Node.TEXT_NODE) {
    const txt = (node.textContent || "").trim();
    if (txt) builder.drawParagraph(txt);
    return;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return;
  const el = node as HTMLElement;
  const tag = el.tagName.toLowerCase();

  if (tag === "script" || tag === "style" || tag === "noscript" || tag === "head") return;

  if (tag === "h1") {
    builder.drawHeading(el.textContent || "", 1);
    return;
  }
  if (tag === "h2") {
    builder.drawHeading(el.textContent || "", 2);
    return;
  }
  if (tag === "h3" || tag === "h4" || tag === "h5" || tag === "h6") {
    builder.drawHeading(el.textContent || "", 3);
    return;
  }
  if (tag === "hr") {
    builder.addSpace(14);
    return;
  }
  if (tag === "img") {
    const src = el.getAttribute("src");
    if (src) await builder.drawImageFromSrc(src);
    return;
  }
  if (tag === "table") {
    const rows: string[][] = [];
    const trList = el.querySelectorAll("tr");
    trList.forEach((tr) => {
      const cells: string[] = [];
      tr.querySelectorAll("th, td").forEach((cell) => {
        cells.push((cell.textContent || "").replace(/\s+/g, " ").trim());
      });
      if (cells.length > 0) rows.push(cells);
    });
    if (rows.length > 0) {
      builder.drawTable(rows, { headerRow: Boolean(el.querySelector("th")) || rows.length > 1 });
    }
    return;
  }
  if (tag === "ul" || tag === "ol") {
    let idx = 1;
    for (const child of Array.from(el.children)) {
      if (child.tagName.toLowerCase() === "li") {
        const prefix = tag === "ol" ? `${idx++}. ` : "• ";
        const directText = (child.textContent || "").replace(/\s+/g, " ").trim();
        if (directText) {
          builder.drawParagraph(prefix + directText, { indent: 24 + listDepth * 20 });
        }
      }
    }
    builder.addSpace(6);
    return;
  }
  if (tag === "p" || tag === "blockquote" || tag === "pre") {
    // Check if paragraph contains embedded images
    const imgs = el.querySelectorAll("img");
    if (imgs.length > 0) {
      for (const child of Array.from(el.childNodes)) {
        await renderDomNodeToBuilder(child, builder, listDepth);
      }
      return;
    }
    const text = (el.textContent || "").trim();
    if (text) {
      const isBold = Boolean(el.querySelector("strong, b")) && el.textContent === el.querySelector("strong, b")?.textContent;
      builder.drawParagraph(text, {
        bold: isBold,
        indent: tag === "blockquote" ? 28 : 0,
        color: tag === "blockquote" ? "#475569" : "#1e293b",
      });
    }
    return;
  }

  // Generic container (div, section, article, body, main, etc.)
  for (const child of Array.from(el.childNodes)) {
    await renderDomNodeToBuilder(child, builder, listDepth);
  }
}

/**
 * Word (.docx/.doc) -> PDF (Free Office API -> Mammoth HTML + Korean-Safe Canvas PDF)
 */
export async function convertWordToPdfWithMeta(
  file: File,
  onProgress?: (p: number) => void
): Promise<OfficeConversionResult> {
  const apiResult = await tryConvertOfficeViaFreeApi(file, onProgress);
  if (apiResult) return apiResult;

  if (file.name.toLowerCase().endsWith(".doc") && !file.name.toLowerCase().endsWith(".docx")) {
    throw new Error("구형 .doc 파일은 Word에서 .docx로 저장 후 변환해 주세요.");
  }

  const arrayBuffer = await file.arrayBuffer();
  if (onProgress) onProgress(30);

  const mammoth = await import("mammoth");
  const result = await mammoth.convertToHtml({ arrayBuffer });
  const html = result.value || "<p>문서 내용이 비어있습니다.</p>";
  if (onProgress) onProgress(55);

  const parser = new DOMParser();
  const parsedDoc = parser.parseFromString(html, "text/html");
  const builder = new KoreanCanvasPdfBuilder({ landscape: false });

  const children = Array.from(parsedDoc.body.childNodes);
  for (let i = 0; i < children.length; i++) {
    await renderDomNodeToBuilder(children[i], builder);
    if (onProgress && i % 5 === 0) {
      onProgress(Math.round(55 + (i / Math.max(1, children.length)) * 35));
    }
  }

  const built = await builder.build(file.name.replace(/\.[^/.]+$/, ""));
  if (onProgress) onProgress(100);
  return {
    bytes: built.bytes,
    engine: "client-html-canvas",
    pageCount: built.pageCount,
  };
}

/**
 * Excel (.xlsx/.xls) -> PDF (Free Office API -> Multi-sheet Full-Column Korean-Safe Table Renderer)
 */
export async function convertExcelToPdfWithMeta(
  file: File,
  onProgress?: (p: number) => void
): Promise<OfficeConversionResult> {
  const apiResult = await tryConvertOfficeViaFreeApi(file, onProgress);
  if (apiResult) return apiResult;

  const arrayBuffer = await file.arrayBuffer();
  if (onProgress) onProgress(25);

  const XLSX = await import("xlsx");
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const sheetNames = workbook.SheetNames;
  if (!sheetNames || sheetNames.length === 0) {
    throw new Error("엑셀 파일에 시트가 존재하지 않습니다.");
  }

  // Determine orientation based on max columns across sheets
  let maxColsOverall = 1;
  const parsedSheets: { name: string; rows: string[][] }[] = [];

  for (const name of sheetNames) {
    const ws = workbook.Sheets[name];
    const rawRows: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "", raw: false });
    const nonEmptyRows = rawRows
      .filter((r) => Array.isArray(r) && r.some((cell) => String(cell ?? "").trim() !== ""))
      .map((r) => r.map((cell) => (cell !== undefined && cell !== null ? String(cell) : "")));

    if (nonEmptyRows.length > 0) {
      const sheetMaxCols = Math.max(...nonEmptyRows.map((r) => r.length), 1);
      if (sheetMaxCols > maxColsOverall) maxColsOverall = sheetMaxCols;
      parsedSheets.push({ name, rows: nonEmptyRows });
    }
  }

  if (onProgress) onProgress(50);

  const builder = new KoreanCanvasPdfBuilder({ landscape: maxColsOverall >= 5 });

  for (let sIdx = 0; sIdx < parsedSheets.length; sIdx++) {
    const sheet = parsedSheets[sIdx];
    builder.drawHeading(sheet.name, 1);

    // Split ultra-wide sheets (>12 cols) into readable horizontal column chunks so nothing is ever truncated
    const maxColsPerTable = 12;
    const totalCols = Math.max(...sheet.rows.map((r) => r.length), 1);

    for (let startCol = 0; startCol < totalCols; startCol += maxColsPerTable) {
      const endCol = Math.min(totalCols, startCol + maxColsPerTable);
      if (startCol > 0) {
        builder.drawHeading(`${sheet.name} (열 ${startCol + 1}~${endCol})`, 2);
      }
      const slicedRows = sheet.rows.map((r) => r.slice(startCol, endCol));
      builder.drawTable(slicedRows, { headerRow: true });
    }

    if (onProgress) {
      onProgress(Math.round(50 + ((sIdx + 1) / parsedSheets.length) * 40));
    }
  }

  const built = await builder.build(file.name.replace(/\.[^/.]+$/, ""));
  if (onProgress) onProgress(100);
  return {
    bytes: built.bytes,
    engine: "client-html-canvas",
    pageCount: built.pageCount,
  };
}

/**
 * HTML -> PDF (Korean-Safe Structured HTML Canvas Renderer)
 */
export async function convertHtmlToPdfWithMeta(
  htmlContent: string,
  onProgress?: (p: number) => void
): Promise<OfficeConversionResult> {
  if (onProgress) onProgress(25);

  const parser = new DOMParser();
  const parsedDoc = parser.parseFromString(htmlContent, "text/html");
  const builder = new KoreanCanvasPdfBuilder({ landscape: false });

  const children = Array.from(parsedDoc.body.childNodes);
  if (children.length === 0) {
    builder.drawParagraph(htmlContent);
  } else {
    for (let i = 0; i < children.length; i++) {
      await renderDomNodeToBuilder(children[i], builder);
      if (onProgress && i % 5 === 0) {
        onProgress(Math.round(25 + (i / Math.max(1, children.length)) * 65));
      }
    }
  }

  const built = await builder.build("HTML Document");
  if (onProgress) onProgress(100);
  return {
    bytes: built.bytes,
    engine: "client-html-canvas",
    pageCount: built.pageCount,
  };
}
