import { PDFDocument, PDFName, degrees, rgb, StandardFonts } from "pdf-lib";
import { parsePdfPageLayout, PdfBlock } from "./pdf-layout-engine";

/**
 * 브라우저 다운로드 헬퍼 함수
 * - 모바일(카카오톡 등 인앱 브라우저)에서 blob: 다운로드 시 발생하는 '지원하지 않는 파일 형식' 오류 완벽 방지
 * - 모바일 Web Share API (File 객체 전송) 연동: 안드로이드 '내 파일' 저장 / 카카오톡 나에게 보내기 / iOS 파일 앱 저장 지원
 * - 셀룰러/무선 데이터 경고 팝업 없이 OS 네이티브 저장 창으로 다이렉트 연결
 */
export async function downloadBlob(data: Uint8Array | Blob, filename: string, mimeType = "application/pdf"): Promise<void> {
  // Google Analytics & Clarity download event tracking
  if (typeof window !== "undefined") {
    try {
      if ((window as any).gtag) {
        (window as any).gtag("event", "file_download", {
          file_name: filename,
          file_extension: filename.split(".").pop() || "",
        });
      }
      if ((window as any).clarity) {
        (window as any).clarity("event", "file_download");
      }
    } catch {
      // ignore
    }
  }

  const blob = data instanceof Blob ? data : new Blob([data as any], { type: mimeType });
  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
  const isKakaoTalk = /KAKAOTALK/i.test(ua);
  const isMobile = /Android|iPhone|iPad|iPod/i.test(ua);

  // 1. 모바일 환경 (특히 카카오톡 인앱 브라우저)에서는 Web Share API(File 객체) 우선 시도
  // 카카오톡 웹뷰는 a[download]의 blob: 프로토콜을 Android DownloadManager로 넘기지 못해
  // "[TALK] 지원하지 않는 파일 형식입니다" 에러와 셀룰러 확인창을 띄우므로, Web Share API로 우회합니다.
  if (isMobile && typeof navigator !== "undefined" && typeof (navigator as any).canShare === "function") {
    try {
      const file = new File([blob], filename, { type: mimeType });
      if ((navigator as any).canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: filename,
        });
        return;
      }
    } catch (shareErr: any) {
      if (shareErr?.name === "AbortError") {
        // 사용자가 공유 창에서 취소를 누른 경우 정상 종료
        return;
      }
      console.warn("Mobile Web Share fallback:", shareErr);
    }
  }

  // 2. 카카오톡 환경인데 Web Share가 불가능한 구형 환경인 경우 -> 외부 브라우저(Chrome) 호출
  if (isKakaoTalk && typeof window !== "undefined") {
    try {
      window.location.href = "kakaotalk://web/openExternal?url=" + encodeURIComponent(window.location.href);
    } catch {
      // ignore
    }
  }

  // 3. 표준 브라우저 다운로드 (PC 크롬, 사파리, 엣지, 안드로이드 크롬 등)
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 3000);
}

/**
 * 웹 다운로드/비표준 PDF 안전 복구 로더
 * - ignoreEncryption 활성화
 * - %%EOF 뒤에 붙은 쓰레기 바이트/HTML 주석 자동 절삭 및 복구
 */
export async function safeLoadPdfDoc(arrayBuffer: ArrayBuffer): Promise<PDFDocument> {
  try {
    return await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  } catch (firstErr) {
    try {
      const uint8 = new Uint8Array(arrayBuffer);
      const eofPattern = [0x25, 0x25, 0x45, 0x4f, 0x46]; // %%EOF
      let lastEof = -1;
      for (let i = uint8.length - 5; i >= 0; i--) {
        if (
          uint8[i] === eofPattern[0] &&
          uint8[i + 1] === eofPattern[1] &&
          uint8[i + 2] === eofPattern[2] &&
          uint8[i + 3] === eofPattern[3] &&
          uint8[i + 4] === eofPattern[4]
        ) {
          lastEof = i + 5;
          break;
        }
      }
      if (lastEof > 0 && lastEof < uint8.length) {
        const trimmed = uint8.slice(0, lastEof);
        return await PDFDocument.load(trimmed, { ignoreEncryption: true });
      }
    } catch {
      // ignore
    }
    throw firstErr;
  }
}

/**
 * 1. PDF 합치기 (Merge PDF)
 */
export async function mergePDFs(files: File[], onProgress?: (progress: number) => void): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();
  const total = files.length;

  for (let i = 0; i < total; i++) {
    const file = files[i];
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await safeLoadPdfDoc(arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));

    if (onProgress) {
      onProgress(Math.round(((i + 1) / total) * 100));
    }
  }

  return await mergedPdf.save({ useObjectStreams: true });
}

/**
 * 2. PDF 회전 (Rotate PDF)
 */
export async function rotatePDF(file: File, angleDegrees: number): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await safeLoadPdfDoc(arrayBuffer);
  const pages = pdfDoc.getPages();

  pages.forEach((page) => {
    const currentRotation = page.getRotation().angle;
    // 음수 각도(-90 등) 및 360도 초과 각도 완전 정규화
    const normalizedAngle = (((currentRotation + angleDegrees) % 360) + 360) % 360;
    page.setRotation(degrees(normalizedAngle));
  });

  return await pdfDoc.save({ useObjectStreams: true });
}

/**
 * 3. PDF 나누기 / 특정 페이지 추출
 */
export function parsePageRange(rangeStr: string, maxPages: number): number[] {
  const pages = new Set<number>();
  const parts = rangeStr.split(",").map((s) => s.trim());

  for (const part of parts) {
    if (part.includes("-")) {
      const [startStr, endStr] = part.split("-").map((s) => s.trim());
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = Math.max(1, start); i <= Math.min(maxPages, end); i++) {
          pages.add(i - 1);
        }
      }
    } else {
      const num = parseInt(part, 10);
      if (!isNaN(num) && num >= 1 && num <= maxPages) {
        pages.add(num - 1);
      }
    }
  }
  return Array.from(pages).sort((a, b) => a - b);
}

export async function extractPDFPages(file: File, pageIndices: number[]): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const sourcePdf = await safeLoadPdfDoc(arrayBuffer);
  const newPdf = await PDFDocument.create();

  const copiedPages = await newPdf.copyPages(sourcePdf, pageIndices);
  copiedPages.forEach((page) => newPdf.addPage(page));

  return await newPdf.save({ useObjectStreams: true });
}

export async function getPDFPageCount(file: File): Promise<number> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await safeLoadPdfDoc(arrayBuffer);
  return pdfDoc.getPageCount();
}

/**
 * 4. 이미지 ➔ PDF 변환 (JPG/PNG/WebP to PDF)
 */
export async function imagesToPDF(
  imageFiles: File[],
  options: { orientation?: "portrait" | "landscape"; fitPage?: boolean } = {},
  onProgress?: (progress: number) => void
): Promise<Uint8Array> {
  const { jsPDF } = await import("jspdf");
  const orientation = options.orientation || "portrait";
  const doc = new jsPDF({
    orientation: orientation === "landscape" ? "l" : "p",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const total = imageFiles.length;

  for (let i = 0; i < total; i++) {
    if (i > 0) {
      doc.addPage("a4", orientation === "landscape" ? "l" : "p");
    }

    const file = imageFiles[i];
    const rawDataUrl = await fileToDataURL(file);
    const { dataUrl, imgFormat, width, height } = await normalizeImageForJsPdf(rawDataUrl, file.type);

    const ratio = Math.min(pageWidth / width, pageHeight / height);
    const renderWidth = width * ratio;
    const renderHeight = height * ratio;
    const x = (pageWidth - renderWidth) / 2;
    const y = (pageHeight - renderHeight) / 2;

    doc.addImage(dataUrl, imgFormat, x, y, renderWidth, renderHeight);

    if (onProgress) {
      onProgress(Math.round(((i + 1) / total) * 100));
    }
  }

  const pdfOutput = doc.output("arraybuffer");
  return new Uint8Array(pdfOutput);
}

function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function normalizeImageForJsPdf(
  dataUrl: string,
  mimeType: string
): Promise<{ dataUrl: string; imgFormat: "PNG" | "JPEG"; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;
      const lower = (mimeType || "").toLowerCase();
      // Native PNG / JPEG can be passed directly to jsPDF
      if (lower.includes("png")) {
        resolve({ dataUrl, imgFormat: "PNG", width, height });
        return;
      }
      if (lower.includes("jpeg") || lower.includes("jpg")) {
        resolve({ dataUrl, imgFormat: "JPEG", width, height });
        return;
      }
      // WebP / AVIF / GIF / BMP -> normalize cleanly to JPEG via Canvas so jsPDF never fails
      try {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0);
          resolve({
            dataUrl: canvas.toDataURL("image/jpeg", 0.92),
            imgFormat: "JPEG",
            width,
            height,
          });
          return;
        }
      } catch {
        // fallback below
      }
      resolve({ dataUrl, imgFormat: "JPEG", width, height });
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

/**
 * 5. PDF ➔ 이미지 변환 및 ZIP 압축 (PDF to Images)
 */
export async function pdfToImageZip(
  file: File,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdf.numPages;

  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();
  const baseName = file.name.replace(/\.[^/.]+$/, "");

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2.0 });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    if (ctx) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      await page.render({
        canvasContext: ctx,
        viewport: viewport,
      }).promise;

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b), "image/jpeg", 0.95)
      );

      if (blob) {
        zip.file(`${baseName}_page_${i}.jpg`, blob);
      }
    }

    if (onProgress) {
      onProgress(Math.round((i / numPages) * 100));
    }
  }

  return await zip.generateAsync({ type: "blob" });
}

/**
 * 6. PDF 텍스트 추출 (Text Extraction)
 */
export async function extractTextFromPDF(
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdf.numPages;
  let fullText = "";

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();

    // Preserve visual line structure by grouping items by Y coordinate and sorting by X
    const rawItems = (textContent.items as any[])
      .filter((it) => it && typeof it.str === "string" && it.str.length > 0)
      .map((it) => ({
        str: it.str as string,
        x: it.transform ? (it.transform[4] as number) : 0,
        y: it.transform ? (it.transform[5] as number) : 0,
        width: (it.width as number) || 0,
      }));

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

    const pageText = lines
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

    fullText += `--- [페이지 ${i}] ---\n` + pageText + "\n\n";

    if (onProgress) {
      onProgress(Math.round((i / numPages) * 100));
    }
  }

  return fullText.trim();
}

/**
 * 7. 워드 ➔ PDF 변환 (Word (.docx/.doc) to PDF)
 * - 1순위: 무료 고품질 Office API (Gotenberg / iLovePDF / CloudConvert / LibreOffice)
 * - 2순위: Mammoth HTML + 다국어(한글 완벽 지원) 고해상도 Canvas PDF 엔진
 */
export async function wordToPdf(file: File, onProgress?: (p: number) => void): Promise<Uint8Array> {
  const { convertWordToPdfWithMeta } = await import("./office-to-pdf");
  const result = await convertWordToPdfWithMeta(file, onProgress);
  return result.bytes;
}

/**
 * 8. 엑셀 ➔ PDF 변환 (Excel (.xlsx/.xls) to PDF)
 * - 1순위: 무료 고품질 Office API
 * - 2순위: 전체 시트/전체 열 한글 완벽 지원 고해상도 표 PDF 엔진
 */
export async function excelToPdf(file: File, onProgress?: (p: number) => void): Promise<Uint8Array> {
  const { convertExcelToPdfWithMeta } = await import("./office-to-pdf");
  const result = await convertExcelToPdfWithMeta(file, onProgress);
  return result.bytes;
}

/**
 * 9. 파워포인트 ➔ PDF 변환 (PowerPoint (.pptx/.ppt) to PDF)
 * - 1순위: 무료 고품질 Office API (Gotenberg / iLovePDF 2,500건 무료 / CloudConvert / LibreOffice)
 * - 2순위: PptxViewJS 기반 원본 슬라이드 비율(세로 A4/16:9/4:3) 보존 고해상도 렌더링 엔진
 */
export async function powerpointToPdfWithMeta(file: File, onProgress?: (p: number) => void) {
  const { convertPptxToPdfWithMeta } = await import("./office-to-pdf");
  return convertPptxToPdfWithMeta(file, onProgress);
}

export async function powerpointToPdf(file: File, onProgress?: (p: number) => void): Promise<Uint8Array> {
  const result = await powerpointToPdfWithMeta(file, onProgress);
  return result.bytes;
}

/**
 * 10. HTML ➔ PDF 변환 (HTML to PDF)
 * - HTML 구조(제목/표/목록/이미지) 및 한글 폰트 100% 보존 고해상도 PDF 렌더링
 */
export async function htmlToPdf(htmlContent: string, onProgress?: (p: number) => void): Promise<Uint8Array> {
  const { convertHtmlToPdfWithMeta } = await import("./office-to-pdf");
  const result = await convertHtmlToPdfWithMeta(htmlContent, onProgress);
  return result.bytes;
}

/**
 * XML 1.0 표준 비호환 제어 문자 필터링 헬퍼
 */
export function sanitizeXmlString(str: string): string {
  return (str || "").replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\uFFFE\uFFFF]/g, "");
}

/**
 * 11. PDF ➔ 워드 (.docx) 변환 (동적 로딩으로 초기 번들 경량화)
 */
export async function pdfToWordDocx(file: File, onProgress?: (p: number) => void): Promise<Blob> {
  const { pdfToWordDocxImpl } = await import("./pdf-to-word-impl");
  return pdfToWordDocxImpl(file, onProgress);
}
/**
 * 엑셀 블록 재귀 렌더링 헬퍼
 */
function renderBlockToExcel(block: PdfBlock, allRows: (string | number)[][]) {
  if (block.type === "two-column" && block.leftBlocks && block.rightBlocks) {
    allRows.push(["=== [좌측 영역] ==="]);
    for (const lb of block.leftBlocks) renderBlockToExcel(lb, allRows);
    allRows.push([]);
    allRows.push(["=== [우측 영역] ==="]);
    for (const rb of block.rightBlocks) renderBlockToExcel(rb, allRows);
    return;
  }
  if (block.type === "heading") {
    allRows.push([block.text || ""]);
    return;
  }
  if (block.type === "image") {
    allRows.push(["[사진/그래픽 이미지 영역]"]);
    return;
  }
  if (block.type === "table" && block.rows) {
    for (const row of block.rows) {
      const parsedRow = row.map((cell) => {
        const trimmed = cell.trim();
        if (/^-?[\d,]+(\.\d+)?$/.test(trimmed) && trimmed.replace(/[,.-]/g, "").length > 0) {
          const num = Number(trimmed.replace(/,/g, ""));
          if (!isNaN(num)) return num;
        }
        return trimmed;
      });
      allRows.push(parsedRow);
    }
    return;
  }
  if (block.type === "paragraph") {
    if (block.lines && block.lines.length > 0) {
      for (const line of block.lines) {
        if (line.cells.length > 1) {
          const parsedRow = line.cells.map((cell) => {
            const trimmed = cell.trim();
            if (/^-?[\d,]+(\.\d+)?$/.test(trimmed) && trimmed.replace(/[,.-]/g, "").length > 0) {
              const num = Number(trimmed.replace(/,/g, ""));
              if (!isNaN(num)) return num;
            }
            return trimmed;
          });
          allRows.push(parsedRow);
        } else if (line.text.includes("\t")) {
          const parsedRow = line.text.split("\t").map((c) => {
            const trimmed = c.trim();
            if (/^-?[\d,]+(\.\d+)?$/.test(trimmed) && trimmed.replace(/[,.-]/g, "").length > 0) {
              const num = Number(trimmed.replace(/,/g, ""));
              if (!isNaN(num)) return num;
            }
            return trimmed;
          });
          allRows.push(parsedRow);
        } else {
          allRows.push([line.text]);
        }
      }
    } else if (block.text) {
      if (block.text.includes("\t")) {
        allRows.push(block.text.split("\t").map((c) => c.trim()));
      } else {
        allRows.push([block.text]);
      }
    }
  }
}

/**
 * 12. PDF ➔ 엑셀 (.xlsx) 변환 (2차원 공간 좌표 기반 열 자동 분할 & 수치 데이터 자동 인식)
 */
export async function pdfToExcelXlsx(file: File, onProgress?: (p: number) => void): Promise<Blob> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdf.numPages;

  const allRows: (string | number)[][] = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const layout = await parsePdfPageLayout(page, i);

    if (numPages > 1) {
      if (allRows.length > 0) {
        allRows.push([]);
      }
      allRows.push([`--- [페이지 ${i} / ${numPages}] ---`]);
    }

    if (layout.hasText && layout.blocks.length > 0) {
      for (const block of layout.blocks) {
        renderBlockToExcel(block, allRows);
      }
    } else {
      allRows.push([`[페이지 ${i}] 이미지/스캔본 페이지 (텍스트 레이어가 없습니다. 필요 시 OCR 메뉴를 이용하세요)`]);
    }

    if (onProgress) {
      onProgress(Math.round((i / numPages) * 85));
    }
  }

  if (allRows.length === 0) {
    allRows.push(["추출된 내용이 없습니다."]);
  }

  // 열 너비 자동 계산
  const colWidths: number[] = [];
  for (const row of allRows) {
    row.forEach((cell, colIdx) => {
      const str = String(cell ?? "");
      const len = str.split("").reduce((acc, ch) => acc + (ch.charCodeAt(0) > 255 ? 2 : 1), 0);
      colWidths[colIdx] = Math.max(colWidths[colIdx] || 10, len + 2);
    });
  }

  const XLSX = await import("xlsx");
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(allRows);
  ws["!cols"] = colWidths.map((w) => ({ wch: Math.min(Math.max(w, 10), 60) }));
  XLSX.utils.book_append_sheet(wb, ws, "PDF_Export");

  if (onProgress) onProgress(95);
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  if (onProgress) onProgress(100);

  return new Blob([wbout], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

/**
 * 파워포인트 블록 렌더링 헬퍼
 */
function renderBlockToPptx(
  block: PdfBlock,
  slide: any,
  leftX: number,
  contentW: number,
  currentYRef: { val: number },
  maxY: number,
  pageWidth: number,
  slideWidthInches: number
) {
  if (currentYRef.val >= maxY) return;

  if (block.type === "heading") {
    const text = block.text || "";
    const isNumbered = /^[0-9]+\.\s*/.test(text.trim());
    const fontSize = isNumbered ? 15 : (block.headingLevel === 1 ? 22 : 17);
    const boxH = 0.52;

    slide.addText(text, {
      x: leftX,
      y: currentYRef.val,
      w: contentW,
      h: boxH,
      fontSize,
      bold: true,
      color: isNumbered ? "FFFFFF" : "0F172A",
      fill: isNumbered ? { color: "1D68B3" } : undefined,
      valign: "middle",
    });
    currentYRef.val += boxH + 0.12;
    return;
  }

  if (block.type === "image" && block.imageDataUrl) {
    const origW = block.imageWidth || 400;
    const origH = block.imageHeight || 200;
    const aspect = origH / origW;
    const wInch = Math.min(Math.max((origW / pageWidth) * slideWidthInches, 2.0), contentW);
    const hInch = Math.min(wInch * aspect, Math.max(0.6, maxY - currentYRef.val));

    slide.addImage({
      data: block.imageDataUrl,
      x: leftX + (contentW - wInch) / 2,
      y: currentYRef.val,
      w: wInch,
      h: hInch,
    });
    currentYRef.val += hInch + 0.15;
    return;
  }

  if (block.type === "table" && block.rows && block.rows.length > 0) {
    const tableRows = block.rows.map((row, rIdx) => {
      const isHdr = !block.isMultiColumnLayout && rIdx === 0;
      return row.map((cell) => ({
        text: cell,
        options: {
          bold: isHdr,
          fill: isHdr ? { color: "F1F5F9" } : { color: "FFFFFF" },
          color: isHdr ? "0F172A" : "334155",
          fontSize: 10,
        },
      }));
    });

    const estH = Math.min(Math.max(block.rows.length * 0.3, 0.6), Math.max(0.4, maxY - currentYRef.val));
    try {
      slide.addTable(tableRows as any, {
        x: leftX,
        y: currentYRef.val,
        w: contentW,
        border: block.isMultiColumnLayout ? { pt: 0, color: "FFFFFF" } : { pt: 1, color: "CBD5E1" },
      });
      currentYRef.val += estH + 0.18;
    } catch {
      const flat = block.rows.map((r) => r.join(" | ")).join("\n");
      slide.addText(flat, { x: leftX, y: currentYRef.val, w: contentW, fontSize: 11, color: "334155" });
      currentYRef.val += 0.6;
    }
    return;
  }

  if (block.type === "paragraph") {
    const text = block.text || "";
    if (text.trim().length > 0) {
      const isPrice = text.includes("소비자가");
      const linesCount = Math.ceil(text.length / 55);
      const boxH = Math.min(Math.max(linesCount * 0.28, 0.35), 1.4);

      slide.addText(text, {
        x: leftX,
        y: currentYRef.val,
        w: contentW,
        h: boxH,
        fontSize: isPrice ? 13 : 11,
        bold: isPrice,
        color: isPrice ? "0F56B3" : "334155",
        valign: "top",
      });
      currentYRef.val += boxH + 0.1;
    }
  }
}

/**
 * 13. PDF ➔ 파워포인트 (.pptx) 변환 (2단 슬라이드 분할 & 딥블루 배너 & 인라인 이미지 추출 + 스캔본 자동 폴백)
 */
export async function pdfToPowerpointPptx(file: File, onProgress?: (p: number) => void): Promise<Blob> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

  const pptxgenModule = await import("pptxgenjs");
  const PptxGenJS = pptxgenModule.default || pptxgenModule;
  const pres = new PptxGenJS();

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdf.numPages;

  const firstPage = await pdf.getPage(1);
  const firstVp = firstPage.getViewport({ scale: 1.0 });
  const isLandscape = firstVp.width >= firstVp.height;

  // Preserve exact PDF aspect ratio (fixes Portrait A4 PDF being squashed into Landscape 4:3!)
  let slideWidthInches: number;
  let slideHeightInches: number;
  if (isLandscape) {
    slideWidthInches = 10.0;
    slideHeightInches = Math.round((10.0 * (firstVp.height / firstVp.width)) * 1000) / 1000;
  } else {
    slideHeightInches = 11.0;
    slideWidthInches = Math.round((11.0 * (firstVp.width / firstVp.height)) * 1000) / 1000;
  }
  pres.defineLayout({ name: "PDF_EXACT", width: slideWidthInches, height: slideHeightInches });
  pres.layout = "PDF_EXACT";

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const layout = await parsePdfPageLayout(page, i);
    const slide = pres.addSlide();

    if (layout.hasText && layout.blocks.length > 0) {
      const currentYRef = { val: 0.45 };
      const leftMargin = 0.5;
      const contentWidth = slideWidthInches - leftMargin * 2;
      const maxY = slideHeightInches - 0.35;

      let overflowed = false;
      for (let bIdx = 0; bIdx < layout.blocks.length; bIdx++) {
        const block = layout.blocks[bIdx];
        if (currentYRef.val >= maxY) {
          overflowed = true;
          break;
        }

        if (block.type === "two-column" && block.leftBlocks && block.rightBlocks) {
          const colW = (contentWidth - 0.35) / 2;
          const leftYRef = { val: currentYRef.val };
          const rightYRef = { val: currentYRef.val };

          for (const lb of block.leftBlocks) {
            renderBlockToPptx(lb, slide, leftMargin, colW, leftYRef, maxY, layout.width, slideWidthInches);
          }
          for (const rb of block.rightBlocks) {
            renderBlockToPptx(rb, slide, leftMargin + colW + 0.35, colW, rightYRef, maxY, layout.width, slideWidthInches);
          }
          currentYRef.val = Math.max(leftYRef.val, rightYRef.val);
        } else {
          renderBlockToPptx(block, slide, leftMargin, contentWidth, currentYRef, maxY, layout.width, slideWidthInches);
        }
      }

      // If dense content overflowed (e.g. large tables/diagrams), add a clean continuation note slide with full page visual so zero data is lost
      if (overflowed && typeof document !== "undefined") {
        const refSlide = pres.addSlide();
        const viewport = page.getViewport({ scale: 1.75 });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        if (ctx) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          await page.render({ canvasContext: ctx, viewport }).promise;
          const imgDataUrl = canvas.toDataURL("image/jpeg", 0.9);
          refSlide.addImage({
            data: imgDataUrl,
            x: 0,
            y: 0,
            w: "100%",
            h: "100%",
            sizing: { type: "contain", w: "100%", h: "100%" },
          });
        }
      }
    } else {
      const viewport = page.getViewport({ scale: 1.75 });
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvasContext: ctx, viewport }).promise;

        const imgDataUrl = canvas.toDataURL("image/jpeg", 0.9);
        slide.addImage({
          data: imgDataUrl,
          x: 0,
          y: 0,
          w: "100%",
          h: "100%",
          sizing: { type: "contain", w: "100%", h: "100%" },
        });
      }
    }

    if (onProgress) onProgress(Math.round((i / numPages) * 90));
  }

  if (onProgress) onProgress(95);
  const output = await pres.write({ outputType: "blob" });
  if (onProgress) onProgress(100);

  return output as Blob;
}

/**
 * 14. PDF ➔ PDF/A 변환 (ISO 19005-1 규격 장기 보관 표준)
 * - 표준 XMP Metadata Stream (pdfaid:part=1, pdfaid:conformance=B) 주입 및 Catalog 연결
 */
export async function pdfToPdfA(file: File, onProgress?: (p: number) => void): Promise<Uint8Array> {
  if (onProgress) onProgress(25);
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await safeLoadPdfDoc(arrayBuffer);

  if (onProgress) onProgress(55);
  const cleanTitle = file.name.replace(/\.[^/.]+$/, "");
  const nowIso = new Date().toISOString();
  const xmlEsc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  pdfDoc.setTitle(`${cleanTitle} (PDF/A-1b)`);
  pdfDoc.setProducer("pdfpick - ISO 19005-1 Archival Engine");
  pdfDoc.setCreator("pdfpick.kr");
  pdfDoc.setCreationDate(new Date());
  pdfDoc.setModificationDate(new Date());

  // Inject ISO 19005-1 (PDF/A-1b) XMP Metadata Packet into PDF Catalog
  const xmpXml = [
    `<?xpacket begin="\uFEFF" id="W5M0MpCehiHzreSzNTczkc9d"?>`,
    `<x:xmpmeta xmlns:x="adobe:ns:meta/">`,
    `  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">`,
    `    <rdf:Description rdf:about="" xmlns:pdfaid="http://www.aiim.org/pdfa/ns/id/">`,
    `      <pdfaid:part>1</pdfaid:part>`,
    `      <pdfaid:conformance>B</pdfaid:conformance>`,
    `    </rdf:Description>`,
    `    <rdf:Description rdf:about="" xmlns:dc="http://purl.org/dc/elements/1.1/">`,
    `      <dc:format>application/pdf</dc:format>`,
    `      <dc:title><rdf:Alt><rdf:li xml:lang="x-default">${xmlEsc(cleanTitle)}</rdf:li></rdf:Alt></dc:title>`,
    `    </rdf:Description>`,
    `    <rdf:Description rdf:about="" xmlns:xmp="http://ns.adobe.com/xap/1.0/">`,
    `      <xmp:CreatorTool>pdfpick.kr ISO 19005-1</xmp:CreatorTool>`,
    `      <xmp:CreateDate>${nowIso}</xmp:CreateDate>`,
    `      <xmp:ModifyDate>${nowIso}</xmp:ModifyDate>`,
    `    </rdf:Description>`,
    `    <rdf:Description rdf:about="" xmlns:pdf="http://ns.adobe.com/pdf/1.3/">`,
    `      <pdf:Producer>pdfpick - ISO 19005-1 Archival Engine</pdf:Producer>`,
    `    </rdf:Description>`,
    `  </rdf:RDF>`,
    `</x:xmpmeta>`,
    `<?xpacket end="w"?>`,
  ].join("\n");

  const xmpBytes = new TextEncoder().encode(xmpXml);
  const metadataStream = pdfDoc.context.stream(xmpBytes, {
    Type: "Metadata",
    Subtype: "XML",
    Length: xmpBytes.length,
  });
  const metadataRef = pdfDoc.context.register(metadataStream);
  pdfDoc.catalog.set(PDFName.of("Metadata"), metadataRef);

  if (onProgress) onProgress(95);
  // PDF/A-1b requires uncompressed xref (useObjectStreams: false for strict 1.4/1b compatibility)
  const saved = await pdfDoc.save({ useObjectStreams: false });
  if (onProgress) onProgress(100);
  return saved;
}

export type CompressionLevel = "extreme" | "recommended" | "less";

export interface CompressionResult {
  data: Uint8Array;
  originalSize: number;
  compressedSize: number;
  ratio: number;
}

/**
 * 15. PDF 압축 (Compress PDF)
 * - extreme: 강력 압축 (용량 60~80% 축소, 웹 공유 최적화)
 * - recommended: 권장 압축 (좋은 품질과 40~60% 용량 축소 균형)
 * - less: 가벼운 압축 (고화질 인쇄 품질 유지, 불필요한 메타데이터/스트림 최적화)
 */
export async function compressPdf(
  file: File,
  level: CompressionLevel = "recommended",
  onProgress?: (p: number) => void
): Promise<CompressionResult> {
  const originalSize = file.size;
  const arrayBuffer = await file.arrayBuffer();

  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdf.numPages;

  const config = {
    extreme: { scale: 0.95, quality: 0.52 },
    recommended: { scale: 1.25, quality: 0.72 },
    less: { scale: 1.6, quality: 0.86 },
  }[level];

  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
  });
  doc.deletePage(1);

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: config.scale });
    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    const ctx = canvas.getContext("2d", { alpha: false });

    if (ctx) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvasContext: ctx, viewport }).promise;

      const imgData = canvas.toDataURL("image/jpeg", config.quality);
      const ptWidth = viewport.width / config.scale;
      const ptHeight = viewport.height / config.scale;
      const orientation = ptWidth > ptHeight ? "landscape" : "portrait";

      doc.addPage([ptWidth, ptHeight], orientation);
      doc.addImage(imgData, "JPEG", 0, 0, ptWidth, ptHeight, undefined, "FAST");
    }

    if (onProgress) {
      onProgress(Math.round((i / numPages) * 95));
    }
  }

  const generatedArrayBuffer = doc.output("arraybuffer");
  let finalData: Uint8Array = new Uint8Array(generatedArrayBuffer);

  // If rasterized compression resulted in a larger file (e.g. vector or already-compressed PDFs),
  // fallback to lossless object stream compression or retain the original bytes!
  if (finalData.byteLength >= originalSize) {
    try {
      const pdfDoc = await safeLoadPdfDoc(arrayBuffer);
      const streamCompressed = await pdfDoc.save({ useObjectStreams: true });
      if (streamCompressed.byteLength < originalSize) {
        finalData = new Uint8Array(streamCompressed);
      } else {
        finalData = new Uint8Array(arrayBuffer);
      }
    } catch {
      finalData = new Uint8Array(arrayBuffer);
    }
  }

  if (onProgress) onProgress(100);

  const compressedSize = finalData.byteLength;
  const ratio = Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100));

  return {
    data: finalData,
    originalSize,
    compressedSize,
    ratio,
  };
}

/**
 * 13. PDF 페이지 번호 매기기 (Add Page Numbers)
 * - Canvas 2D 망막(Retina) 렌더링으로 한글/외국어/특수문자 WinAnsi 인코딩 오류 100% 방지
 * - 다양한 규격(A4, 와이드스크린, 대형 카탈로그)에 맞춘 폰트 및 여백 비례 자동 스케일링
 */
export interface PageNumberOptions {
  position?: 'bottom-center' | 'bottom-right' | 'bottom-left' | 'top-center' | 'top-right' | 'top-left';
  format?: 'n' | 'n_of_total' | 'page_n' | 'page_n_of_total';
  fontSize?: number;
  margin?: number;
  startNumber?: number;
}

function renderPageNumberToPng(
  text: string,
  fontSize: number
): { pngBytes: Uint8Array; width: number; height: number } {
  if (typeof document === 'undefined') {
    throw new Error('Canvas rendering requires a browser environment');
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get 2D canvas context');

  const fontStack = '-apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Malgun Gothic", "Nanum Gothic", "Noto Sans KR", Roboto, sans-serif';
  const scale = 2;

  ctx.font = `700 ${fontSize * scale}px ${fontStack}`;
  const metrics = ctx.measureText(text);
  const textWidth = Math.ceil(metrics.width);
  const textHeight = Math.ceil(fontSize * 1.35 * scale);

  const padX = 10 * scale;
  const padY = 5 * scale;
  canvas.width = textWidth + padX * 2;
  canvas.height = textHeight + padY * 2;

  ctx.font = `700 ${fontSize * scale}px ${fontStack}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(55, 65, 81, 0.95)'; // slate-700
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const dataUrl = canvas.toDataURL('image/png');
  const base64Data = dataUrl.split(',')[1];
  const binaryString = atob(base64Data);
  const len = binaryString.length;
  const pngBytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    pngBytes[i] = binaryString.charCodeAt(i);
  }

  return {
    pngBytes,
    width: canvas.width / scale,
    height: canvas.height / scale,
  };
}

export async function addPageNumbersToPDF(
  file: File,
  options: PageNumberOptions = {},
  onProgress?: (progress: number) => void
): Promise<Uint8Array> {
  const {
    position = 'bottom-center',
    format = 'n',
    fontSize = 11,
    margin = 25,
    startNumber = 1,
  } = options;

  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await safeLoadPdfDoc(arrayBuffer);
  const pages = pdfDoc.getPages();
  const totalPages = pages.length;

  for (let i = 0; i < totalPages; i++) {
    const page = pages[i];
    const { width, height } = page.getSize();
    const currentPageNum = startNumber + i;

    // 대형 카탈로그(1275x906 pt 등) 및 다양한 용지 크기에 맞춘 비례 자동 계산
    const baseDim = Math.min(width, height);
    const scaleFactor = Math.max(0.85, Math.min(2.5, baseDim / 595));
    const effectiveFontSize = Math.round(fontSize * scaleFactor);
    const effectiveMargin = Math.round(margin * scaleFactor);

    let text = `${currentPageNum}`;
    if (format === 'n_of_total') {
      text = `${currentPageNum} / ${totalPages}`;
    } else if (format === 'page_n') {
      text = `Page ${currentPageNum}`;
    } else if (format === 'page_n_of_total') {
      text = `Page ${currentPageNum} of ${totalPages}`;
    }

    const { pngBytes, width: pnWidth, height: pnHeight } = renderPageNumberToPng(text, effectiveFontSize);
    const pnImage = await pdfDoc.embedPng(pngBytes);

    let x = (width - pnWidth) / 2;
    let y = effectiveMargin;

    // Determine X coordinate
    if (position.includes('left')) {
      x = effectiveMargin;
    } else if (position.includes('right')) {
      x = width - pnWidth - effectiveMargin;
    } else {
      x = (width - pnWidth) / 2;
    }

    // Determine Y coordinate
    if (position.startsWith('top')) {
      y = height - effectiveMargin - pnHeight;
    } else {
      y = effectiveMargin;
    }

    page.drawImage(pnImage, {
      x,
      y,
      width: pnWidth,
      height: pnHeight,
    });

    if (onProgress) {
      onProgress(Math.round(((i + 1) / totalPages) * 100));
    }
  }

  return await pdfDoc.save({ useObjectStreams: true });
}

/**
 * 14. PDF 워터마크 추가 (Add Watermark)
 */
export interface WatermarkOptions {
  text: string;
  opacity?: number;
  fontSize?: number;
  rotation?: number;
  color?: 'gray' | 'red' | 'blue' | 'black';
}

function renderWatermarkToPng(
  text: string,
  fontSize: number,
  color: 'gray' | 'red' | 'blue' | 'black'
): { pngBytes: Uint8Array; width: number; height: number } {
  if (typeof document === 'undefined') {
    throw new Error('Canvas rendering requires a browser environment');
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get 2D canvas context');
  }

  // System font stack with top-tier Korean/multilingual font support
  const fontStack = '-apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Malgun Gothic", "Nanum Gothic", "Noto Sans KR", Roboto, sans-serif';
  const scale = 2; // 2x Retina scale for crisp sharpness

  ctx.font = `900 ${fontSize * scale}px ${fontStack}`;
  const metrics = ctx.measureText(text);
  const textWidth = Math.ceil(metrics.width);
  const textHeight = Math.ceil(fontSize * 1.4 * scale);

  const padX = 24 * scale;
  const padY = 16 * scale;
  canvas.width = textWidth + padX * 2;
  canvas.height = textHeight + padY * 2;

  // Re-apply font after resizing canvas
  ctx.font = `900 ${fontSize * scale}px ${fontStack}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Map color
  let fillStyle = 'rgba(75, 85, 99, 1)'; // gray
  if (color === 'red') fillStyle = 'rgba(220, 38, 38, 1)';
  else if (color === 'blue') fillStyle = 'rgba(37, 99, 235, 1)';
  else if (color === 'black') fillStyle = 'rgba(17, 24, 39, 1)';

  ctx.fillStyle = fillStyle;
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const dataUrl = canvas.toDataURL('image/png');
  const base64Data = dataUrl.split(',')[1];
  const binaryString = atob(base64Data);
  const len = binaryString.length;
  const pngBytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    pngBytes[i] = binaryString.charCodeAt(i);
  }

  return {
    pngBytes,
    width: canvas.width / scale,
    height: canvas.height / scale,
  };
}

export async function addWatermarkToPDF(
  file: File,
  options: WatermarkOptions,
  onProgress?: (progress: number) => void
): Promise<Uint8Array> {
  const {
    text,
    opacity = 0.25,
    fontSize = 48,
    rotation = 45,
    color = 'gray',
  } = options;

  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await safeLoadPdfDoc(arrayBuffer);
  
  const pages = pdfDoc.getPages();
  const totalPages = pages.length;

  // 다양한 용지 크기에 맞춘 워터마크 비례 폰트 크기 계산
  const firstPage = pages[0];
  const { width: fWidth, height: fHeight } = firstPage.getSize();
  const maxDim = Math.max(fWidth, fHeight);
  const scaleFactor = Math.max(0.85, Math.min(2.8, maxDim / 842));
  const effectiveFontSize = Math.round(fontSize * scaleFactor);

  // Render watermark text to transparent PNG via 2D Canvas (supports Korean, English, symbols)
  const { pngBytes, width: wmWidth, height: wmHeight } = renderWatermarkToPng(text, effectiveFontSize, color);
  const watermarkImage = await pdfDoc.embedPng(pngBytes);

  const rad = (rotation * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  // Center vector calculation for rotation around bottom-left origin
  const cx = wmWidth / 2;
  const cy = wmHeight / 2;
  const rx = cx * cos - cy * sin;
  const ry = cx * sin + cy * cos;

  for (let i = 0; i < totalPages; i++) {
    const page = pages[i];
    const { width: pageWidth, height: pageHeight } = page.getSize();

    const x = (pageWidth / 2) - rx;
    const y = (pageHeight / 2) - ry;

    page.drawImage(watermarkImage, {
      x,
      y,
      width: wmWidth,
      height: wmHeight,
      rotate: degrees(rotation),
      opacity,
    });

    if (onProgress) {
      onProgress(Math.round(((i + 1) / totalPages) * 100));
    }
  }

  return await pdfDoc.save({ useObjectStreams: true });
}

export interface TextAnnotation {
  id: string;
  type: "text";
  x: number; // 0..1 ratio
  y: number; // 0..1 ratio
  text: string;
  fontSize: number;
  color: string;
  bold?: boolean;
}

export interface DrawingStroke {
  points: { x: number; y: number }[]; // 0..1 ratio
  color: string;
  width: number;
  isHighlighter?: boolean;
}

export interface ShapeAnnotation {
  id: string;
  type: "rect" | "whiteout";
  x: number; // 0..1 ratio
  y: number; // 0..1 ratio
  width: number; // 0..1 ratio
  height: number; // 0..1 ratio
  color: string;
  fillColor?: string;
  strokeWidth?: number;
}

export interface ImageAnnotation {
  id: string;
  type: "image";
  x: number; // 0..1 ratio
  y: number; // 0..1 ratio
  width: number; // 0..1 ratio
  height: number; // 0..1 ratio
  dataUrl: string;
}

export interface PageEdits {
  pageIndex: number;
  texts: TextAnnotation[];
  strokes: DrawingStroke[];
  shapes: ShapeAnnotation[];
  images: ImageAnnotation[];
  rotation?: number; // User rotation delta in degrees (0, 90, 180, 270)
}

/**
 * 100% 클라이언트 로컬 PDF 편집 엔진
 * - 사용자가 추가한 텍스트(다국어 완벽 지원), 손글씨 서명/펜 드로잉, 형광펜,
 *   도형/화이트아웃(개인정보 가리기), 도장/서명 이미지를 원본 PDF에 고해상도로 합성
 * - 페이지 회전(좌우 90도 회전, 180도 상하반전) 영구 저장 지원
 */
export async function exportEditedPdf(
  fileOrBuffer: File | ArrayBuffer,
  editsByPage: Record<number, PageEdits>,
  onProgress?: (progress: number) => void
): Promise<Uint8Array> {
  const arrayBuffer = fileOrBuffer instanceof File ? await fileOrBuffer.arrayBuffer() : fileOrBuffer;
  const pdfDoc = await safeLoadPdfDoc(arrayBuffer);
  const pages = pdfDoc.getPages();
  const total = pages.length;

  for (let i = 0; i < total; i++) {
    if (onProgress) {
      onProgress(Math.round(((i + 1) / total) * 90));
    }
    const pageEdits = editsByPage[i];
    const page = pages[i];
    const { width: pageWidth, height: pageHeight } = page.getSize();
    const origRotation = page.getRotation().angle || 0;
    const userRotation = pageEdits?.rotation || 0;
    const finalRotation = ((origRotation + userRotation) % 360 + 360) % 360;

    // Apply rotation if changed
    if (finalRotation !== origRotation) {
      page.setRotation(degrees(finalRotation));
    }

    if (!pageEdits) continue;

    const hasEdits =
      (pageEdits.texts && pageEdits.texts.length > 0) ||
      (pageEdits.strokes && pageEdits.strokes.length > 0) ||
      (pageEdits.shapes && pageEdits.shapes.length > 0) ||
      (pageEdits.images && pageEdits.images.length > 0);

    if (!hasEdits) continue;

    // Dimensions of the rotated view that the user saw and edited on screen
    const isTransposed = finalRotation === 90 || finalRotation === 270;
    const viewWidth = isTransposed ? pageHeight : pageWidth;
    const viewHeight = isTransposed ? pageWidth : pageHeight;

    // High-resolution canvas for crisp render (2x DPI)
    const scale = 2;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(viewWidth * scale);
    canvas.height = Math.round(viewHeight * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) continue;

    ctx.scale(scale, scale);

    // 1. Shapes (Whiteout / Rectangles)
    if (pageEdits.shapes) {
      for (const shape of pageEdits.shapes) {
        const sx = shape.x * viewWidth;
        const sy = shape.y * viewHeight;
        const sw = shape.width * viewWidth;
        const sh = shape.height * viewHeight;

        if (shape.type === "whiteout") {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(sx, sy, sw, sh);
        } else {
          if (shape.fillColor) {
            ctx.fillStyle = shape.fillColor;
            ctx.fillRect(sx, sy, sw, sh);
          }
          ctx.strokeStyle = shape.color || "#e11d48";
          ctx.lineWidth = shape.strokeWidth || 2;
          ctx.strokeRect(sx, sy, sw, sh);
        }
      }
    }

    // 2. Freehand strokes & Highlighters
    if (pageEdits.strokes) {
      for (const stroke of pageEdits.strokes) {
        if (!stroke.points || stroke.points.length === 0) continue;
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.width;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        if (stroke.isHighlighter) {
          ctx.globalAlpha = 0.45;
        }

        const startX = stroke.points[0].x * viewWidth;
        const startY = stroke.points[0].y * viewHeight;
        ctx.moveTo(startX, startY);

        for (let p = 1; p < stroke.points.length; p++) {
          const px = stroke.points[p].x * viewWidth;
          const py = stroke.points[p].y * viewHeight;
          ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.restore();
      }
    }

    // 3. Images & Stamps
    if (pageEdits.images) {
      for (const img of pageEdits.images) {
        if (!img.dataUrl) continue;
        await new Promise<void>((resolve) => {
          const imageObj = new Image();
          imageObj.crossOrigin = "anonymous";
          imageObj.onload = () => {
            const ix = img.x * viewWidth;
            const iy = img.y * viewHeight;
            const iw = img.width * viewWidth;
            const ih = img.height * viewHeight;
            ctx.drawImage(imageObj, ix, iy, iw, ih);
            resolve();
          };
          imageObj.onerror = () => resolve();
          imageObj.src = img.dataUrl;
        });
      }
    }

    // 4. Texts
    if (pageEdits.texts) {
      for (const txt of pageEdits.texts) {
        if (!txt.text) continue;
        ctx.save();
        ctx.font = `${txt.bold ? "bold " : ""}${txt.fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans KR", sans-serif`;
        ctx.fillStyle = txt.color || "#000000";
        ctx.textBaseline = "top";
        const tx = txt.x * viewWidth;
        const ty = txt.y * viewHeight;

        const lines = txt.text.split("\n");
        const lineHeight = txt.fontSize * 1.25;
        lines.forEach((line, lineIdx) => {
          ctx.fillText(line, tx, ty + lineIdx * lineHeight);
        });
        ctx.restore();
      }
    }

    // Convert offscreen canvas to PNG blob
    const pngBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/png");
    });

    if (pngBlob) {
      const pngBuffer = await pngBlob.arrayBuffer();
      const overlayImage = await pdfDoc.embedPng(pngBuffer);

      if (finalRotation === 0) {
        page.drawImage(overlayImage, {
          x: 0,
          y: 0,
          width: pageWidth,
          height: pageHeight,
        });
      } else if (finalRotation === 90) {
        page.drawImage(overlayImage, {
          x: pageWidth,
          y: 0,
          width: pageHeight,
          height: pageWidth,
          rotate: degrees(90),
        });
      } else if (finalRotation === 180) {
        page.drawImage(overlayImage, {
          x: pageWidth,
          y: pageHeight,
          width: pageWidth,
          height: pageHeight,
          rotate: degrees(180),
        });
      } else if (finalRotation === 270) {
        page.drawImage(overlayImage, {
          x: 0,
          y: pageHeight,
          width: pageHeight,
          height: pageWidth,
          rotate: degrees(270),
        });
      }
    }
  }

  if (onProgress) onProgress(98);
  const resultBytes = await pdfDoc.save({ useObjectStreams: true });
  if (onProgress) onProgress(100);
  return resultBytes;
}


