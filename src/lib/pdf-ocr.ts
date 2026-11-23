/**
 * Hybrid PDF OCR Engine (Native Text Layer + Tesseract.js v7 WASM Image OCR)
 * - 100% Free, Unlimited, Apache-2.0 Commercial-Safe, Browser-Local (Zero Server Upload)
 * - Supports Korean + English (kor+eng), Japanese, Chinese
 * - Smart mode automatically detects scanned pages AND pages with large embedded images (e.g. certificates)
 */

export type OcrMode = "smart" | "ocr" | "text";
export type OcrLanguage = "kor+eng" | "kor" | "eng" | "jpn+eng" | "chi_sim+eng";

export interface PdfOcrOptions {
  mode: OcrMode;
  language: OcrLanguage;
  pageIndices?: number[]; // 0-based page indices; if omitted, process all pages
}

export interface PdfOcrPageResult {
  pageNumber: number;
  text: string;
  method: "text-layer" | "ocr" | "hybrid";
  confidence?: number;
}

export interface PdfOcrResult {
  fullText: string;
  pages: PdfOcrPageResult[];
  totalPagesProcessed: number;
  ocrPageCount: number;
  textLayerPageCount: number;
  avgConfidence?: number;
}

export interface PdfOcrProgress {
  percent: number;
  message: string;
}

/**
 * Extract native PDF text layer while preserving visual line breaks and X-coordinate word spacing
 */
function extractStructuredPageText(items: any[]): string {
  const rawItems = (items || [])
    .filter((it) => it && typeof it.str === "string" && it.str.length > 0)
    .map((it) => ({
      str: it.str as string,
      x: it.transform ? (it.transform[4] as number) : 0,
      y: it.transform ? (it.transform[5] as number) : 0,
      width: (it.width as number) || 0,
    }));

  if (rawItems.length === 0) return "";

  rawItems.sort((a, b) => b.y - a.y || a.x - b.x);

  const lines: { y: number; items: typeof rawItems }[] = [];
  for (const item of rawItems) {
    const existing = lines.find((l) => Math.abs(l.y - item.y) <= 4.5);
    if (existing) {
      existing.items.push(item);
    } else {
      lines.push({ y: item.y, items: [item] });
    }
  }

  return lines
    .map((line) => {
      line.items.sort((a, b) => a.x - b.x);
      let out = "";
      for (let k = 0; k < line.items.length; k++) {
        const cur = line.items[k];
        if (k > 0) {
          const prev = line.items[k - 1];
          const gap = cur.x - (prev.x + prev.width);
          if (gap > 2 && !out.endsWith(" ") && !cur.str.startsWith(" ")) {
            out += " ";
          }
        }
        out += cur.str;
      }
      return out.trim();
    })
    .filter((l) => l.length > 0)
    .join("\n");
}

/**
 * Detect whether a PDF page contains large embedded raster images (e.g. scanned certificates, photos)
 * by inspecting the PDF operator list transform matrices.
 */
async function detectPageImageCoverage(page: any, pdfjsLib: any): Promise<{ imageCount: number; coverageRatio: number }> {
  try {
    const ops = await page.getOperatorList();
    const OPS = pdfjsLib.OPS;
    const viewport = page.getViewport({ scale: 1.0 });
    const pageArea = Math.max(1, viewport.width * viewport.height);

    let m = [1, 0, 0, 1, 0, 0];
    const stack: number[][] = [];
    let imageCount = 0;
    let totalImageArea = 0;

    const mul = (a: number[], b: number[]) => [
      a[0] * b[0] + a[2] * b[1],
      a[1] * b[0] + a[3] * b[1],
      a[0] * b[2] + a[2] * b[3],
      a[1] * b[2] + a[3] * b[3],
      a[0] * b[4] + a[2] * b[5] + a[4],
      a[1] * b[4] + a[3] * b[5] + a[5],
    ];

    for (let i = 0; i < ops.fnArray.length; i++) {
      const fn = ops.fnArray[i];
      const args = ops.argsArray[i];
      if (fn === OPS.save) {
        stack.push([...m]);
      } else if (fn === OPS.restore) {
        if (stack.length > 0) m = stack.pop()!;
      } else if (fn === OPS.transform && Array.isArray(args)) {
        m = mul(m, args);
      } else if (
        fn === OPS.paintImageXObject ||
        fn === OPS.paintInlineImageXObject ||
        fn === OPS.paintJpegXObject
      ) {
        const w = Math.hypot(m[0], m[1]);
        const h = Math.hypot(m[2], m[3]);
        const area = w * h;
        // Ignore tiny decorative icons/bullets (< 1.5% of page area)
        if (area / pageArea >= 0.015) {
          imageCount++;
          totalImageArea += area;
        }
      }
    }

    return {
      imageCount,
      coverageRatio: Math.min(1, totalImageArea / pageArea),
    };
  } catch {
    return { imageCount: 0, coverageRatio: 0 };
  }
}

/**
 * Render PDF page to high-DPI canvas with mild contrast enhancement for crisp Korean OCR
 */
async function renderPageForOcr(page: any): Promise<HTMLCanvasElement> {
  const baseVp = page.getViewport({ scale: 1.0 });
  // Target ~1800-2200px on the long edge (optimal ~250-300 DPI for Tesseract Korean recognition)
  const targetScale = Math.min(2.6, Math.max(1.8, 2000 / Math.max(baseVp.width, baseVp.height)));
  const viewport = page.getViewport({ scale: targetScale });

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(viewport.width);
  canvas.height = Math.round(viewport.height);

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  await page.render({ canvasContext: ctx, viewport }).promise;

  // Mild grayscale + contrast boost improves Korean stroke clarity on scanned stamps/watermarks
  try {
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    const contrast = 1.18;
    const intercept = 128 * (1 - contrast);

    for (let i = 0; i < data.length; i += 4) {
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      const enhanced = Math.max(0, Math.min(255, gray * contrast + intercept));
      data[i] = enhanced;
      data[i + 1] = enhanced;
      data[i + 2] = enhanced;
    }
    ctx.putImageData(imgData, 0, 0);
  } catch {
    // Proceed with original RGB canvas if getImageData fails
  }

  return canvas;
}

function cleanOcrText(raw: string): string {
  return (raw || "")
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.replace(/\s{2,}/g, " ").trim())
    .filter((line) => line.length > 0)
    .join("\n")
    .trim();
}

/**
 * Run Hybrid OCR on a PDF file (or direct image file)
 */
export async function runPdfOcr(
  file: File,
  options: PdfOcrOptions,
  onProgress?: (progress: PdfOcrProgress) => void
): Promise<PdfOcrResult> {
  const { mode, language, pageIndices } = options;

  // Direct image upload support (JPG / PNG / WebP)
  if (file.type.startsWith("image/") || /\.(png|jpe?g|webp|bmp)$/i.test(file.name)) {
    if (onProgress) onProgress({ percent: 10, message: `AI OCR 엔진(${language}) 초기화 중...` });
    const { createWorker } = await import("tesseract.js");
    const worker = await createWorker(language, 1, {
      logger: (m) => {
        if (m.status === "recognizing text" && onProgress) {
          onProgress({
            percent: Math.round(25 + (m.progress || 0) * 70),
            message: `이미지 글자 인식 중 (${Math.round((m.progress || 0) * 100)}%)...`,
          });
        }
      },
    });
    try {
      await worker.setParameters({ user_defined_dpi: "300" });
      const { data } = await worker.recognize(file);
      const cleaned = cleanOcrText(data.text);
      const conf = Math.round(data.confidence || 0);
      if (onProgress) onProgress({ percent: 100, message: "이미지 OCR 인식 완료!" });
      return {
        fullText: `--- [이미지 OCR | 신뢰도 ${conf}%] ---\n${cleaned}`,
        pages: [{ pageNumber: 1, text: cleaned, method: "ocr", confidence: conf }],
        totalPagesProcessed: 1,
        ocrPageCount: 1,
        textLayerPageCount: 0,
        avgConfidence: conf,
      };
    } finally {
      await worker.terminate();
    }
  }

  // PDF Processing
  if (onProgress) onProgress({ percent: 5, message: "PDF 문서 분석 중..." });

  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const totalDocPages = pdf.numPages;

  const targetPages =
    pageIndices && pageIndices.length > 0
      ? pageIndices.filter((idx) => idx >= 0 && idx < totalDocPages).map((idx) => idx + 1)
      : Array.from({ length: totalDocPages }, (_, i) => i + 1);

  if (targetPages.length === 0) {
    throw new Error("유효한 페이지 범위를 입력해 주세요.");
  }

  // Pass 1: Extract native text layer and detect which pages require Tesseract OCR
  const pagePlans: {
    pageNum: number;
    pageObj: any;
    nativeText: string;
    needsOcr: boolean;
  }[] = [];

  for (let i = 0; i < targetPages.length; i++) {
    const pageNum = targetPages[i];
    const page = await pdf.getPage(pageNum);
    const tc = await page.getTextContent();
    const nativeText = extractStructuredPageText(tc.items);

    let needsOcr = false;
    if (mode === "ocr") {
      needsOcr = true;
    } else if (mode === "smart") {
      if (nativeText.length < 80) {
        needsOcr = true;
      } else {
        const imgInfo = await detectPageImageCoverage(page, pdfjsLib);
        // Trigger OCR automatically if large raster images cover >= 22% of the page (e.g. scanned certificates)
        if (imgInfo.imageCount > 0 && imgInfo.coverageRatio >= 0.22 && nativeText.length < 700) {
          needsOcr = true;
        }
      }
    }

    pagePlans.push({ pageNum, pageObj: page, nativeText, needsOcr });

    if (onProgress) {
      onProgress({
        percent: Math.round(5 + ((i + 1) / targetPages.length) * (mode === "text" ? 90 : 15)),
        message: `페이지 구조 분석 중 (${i + 1} / ${targetPages.length})...`,
      });
    }
  }

  const pagesNeedingOcr = pagePlans.filter((p) => p.needsOcr);
  let worker: any = null;

  try {
    if (pagesNeedingOcr.length > 0) {
      if (onProgress) {
        onProgress({
          percent: 22,
          message: `Tesseract AI OCR 언어 모델(${language}) 로딩 중... (최초 1회 자동 캐시)`,
        });
      }

      const { createWorker } = await import("tesseract.js");
      worker = await createWorker(language, 1, {
        logger: (m) => {
          if (m.status === "loading language traineddata" && onProgress) {
            onProgress({
              percent: Math.min(32, Math.round(22 + (m.progress || 0) * 10)),
              message: `OCR 언어 데이터 다운로드 중 (${Math.round((m.progress || 0) * 100)}%)...`,
            });
          }
        },
      });
      await worker.setParameters({ user_defined_dpi: "300" });
    }

    const pageResults: PdfOcrPageResult[] = [];
    let ocrDoneCount = 0;
    const confidences: number[] = [];

    for (const plan of pagePlans) {
      if (!plan.needsOcr || !worker) {
        pageResults.push({
          pageNumber: plan.pageNum,
          text: plan.nativeText,
          method: "text-layer",
        });
        continue;
      }

      if (onProgress) {
        const pct = Math.round(32 + (ocrDoneCount / Math.max(1, pagesNeedingOcr.length)) * 64);
        onProgress({
          percent: pct,
          message: `스캔/이미지 OCR 글자 인식 중 (${plan.pageNum}페이지 • ${ocrDoneCount + 1}/${pagesNeedingOcr.length})...`,
        });
      }

      const canvas = await renderPageForOcr(plan.pageObj);
      const { data } = await worker.recognize(canvas);
      const ocrText = cleanOcrText(data.text);
      const conf = Math.round(data.confidence || 0);
      confidences.push(conf);
      ocrDoneCount++;

      if (mode === "smart" && plan.nativeText.length >= 80 && ocrText.length > 0) {
        pageResults.push({
          pageNumber: plan.pageNum,
          text: `${plan.nativeText}\n\n[스캔 이미지 OCR 인식 내용]\n${ocrText}`,
          method: "hybrid",
          confidence: conf,
        });
      } else {
        pageResults.push({
          pageNumber: plan.pageNum,
          text: ocrText || plan.nativeText,
          method: "ocr",
          confidence: conf,
        });
      }
    }

    const fullText = pageResults
      .map((r) => {
        const tag =
          r.method === "ocr"
            ? `스캔 OCR • 신뢰도 ${r.confidence ?? 0}%`
            : r.method === "hybrid"
              ? `텍스트 + 이미지 OCR • 신뢰도 ${r.confidence ?? 0}%`
              : "텍스트 레이어";
        return `--- [페이지 ${r.pageNumber} | ${tag}] ---\n${r.text || "(인식된 텍스트 없음)"}`;
      })
      .join("\n\n");

    const avgConfidence =
      confidences.length > 0
        ? Math.round(confidences.reduce((a, b) => a + b, 0) / confidences.length)
        : undefined;

    if (onProgress) onProgress({ percent: 100, message: "텍스트 추출 및 OCR 완료!" });

    return {
      fullText: fullText.trim(),
      pages: pageResults,
      totalPagesProcessed: pageResults.length,
      ocrPageCount: pageResults.filter((p) => p.method === "ocr" || p.method === "hybrid").length,
      textLayerPageCount: pageResults.filter((p) => p.method === "text-layer").length,
      avgConfidence,
    };
  } finally {
    if (worker) {
      try {
        await worker.terminate();
      } catch {
        // ignore cleanup
      }
    }
  }
}
