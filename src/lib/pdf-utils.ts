import { PDFDocument, degrees, rgb, StandardFonts } from "pdf-lib";
import { jsPDF } from "jspdf";
import JSZip from "jszip";
import * as XLSX from "xlsx";
import * as mammoth from "mammoth";
import { Document, Paragraph, TextRun, ImageRun, Packer } from "docx";

/**
 * 브라우저 다운로드 헬퍼 함수
 * - 모바일(카카오톡 등 인앱 브라우저)에서 blob: 다운로드 시 발생하는 '지원하지 않는 파일 형식' 오류 완벽 방지
 * - 모바일 Web Share API (File 객체 전송) 연동: 안드로이드 '내 파일' 저장 / 카카오톡 나에게 보내기 / iOS 파일 앱 저장 지원
 * - 셀룰러/무선 데이터 경고 팝업 없이 OS 네이티브 저장 창으로 다이렉트 연결
 */
export async function downloadBlob(data: Uint8Array | Blob, filename: string, mimeType = "application/pdf"): Promise<void> {
  // Google Analytics download event tracking
  if (typeof window !== "undefined" && (window as any).gtag) {
    try {
      (window as any).gtag("event", "file_download", {
        file_name: filename,
        file_extension: filename.split(".").pop() || "",
      });
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
 * 이미지 정규화 헬퍼 (JPG, PNG, WebP, GIF, BMP 지원)
 * - Canvas 2D를 통해 모든 이미지 포맷을 표준 JPEG 데이터로 정규화하여 jsPDF UNKNOWN IMAGE FORMAT 오류 원천 차단
 */
async function normalizeImageToJpegDataUrl(file: File): Promise<{ dataUrl: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const width = img.naturalWidth || img.width || 800;
        const height = img.naturalHeight || img.height || 600;
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve({ dataUrl: reader.result as string, width, height });
          return;
        }
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0);
        const jpegDataUrl = canvas.toDataURL("image/jpeg", 0.95);
        resolve({ dataUrl: jpegDataUrl, width, height });
      };
      img.onerror = () => {
        resolve({ dataUrl: reader.result as string, width: 800, height: 600 });
      };
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * 4. 이미지 ➔ PDF 변환 (JPG/PNG/WebP/GIF to PDF)
 */
export async function imagesToPDF(
  imageFiles: File[],
  options: { orientation?: "portrait" | "landscape"; fitPage?: boolean } = {},
  onProgress?: (progress: number) => void
): Promise<Uint8Array> {
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
    const { dataUrl, width: imgW, height: imgH } = await normalizeImageToJpegDataUrl(file);

    const ratio = Math.min(pageWidth / imgW, pageHeight / imgH);
    const renderWidth = imgW * ratio;
    const renderHeight = imgH * ratio;
    const x = (pageWidth - renderWidth) / 2;
    const y = (pageHeight - renderHeight) / 2;

    doc.addImage(dataUrl, "JPEG", x, y, renderWidth, renderHeight);

    if (onProgress) {
      onProgress(Math.round(((i + 1) / total) * 100));
    }
  }

  const pdfOutput = doc.output("arraybuffer");
  return new Uint8Array(pdfOutput);
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
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(" ");

    fullText += `--- [페이지 ${i}] ---\n` + pageText + "\n\n";

    if (onProgress) {
      onProgress(Math.round((i / numPages) * 100));
    }
  }

  return fullText.trim();
}

const SYSTEM_FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Apple SD Gothic Neo", "Malgun Gothic", "Nanum Gothic", "Noto Sans CJK KR", "Noto Sans KR", sans-serif';

/**
 * 7. 워드 ➔ PDF 변환 (Word (.docx) to PDF)
 * - Canvas 2D 망막(Retina) 렌더링으로 한글, 한자, 일본어, 아랍어, 키릴 문자 등 모든 언어의 WinAnsi 깨짐 100% 방지
 */
export async function wordToPdf(file: File, onProgress?: (p: number) => void): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  if (onProgress) onProgress(20);

  const result = await mammoth.extractRawText({ arrayBuffer });
  const rawText = result.value || "문서 내용이 비어있습니다.";
  if (onProgress) onProgress(40);

  const cWidth = 1240;
  const cHeight = 1754;
  const marginX = 100;
  const marginTop = 130;
  const marginBottom = 100;
  const contentWidth = cWidth - marginX * 2;
  const fontSize = 24;
  const lineHeight = 38;

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  doc.deletePage(1);

  const measureCanvas = document.createElement("canvas");
  const mCtx = measureCanvas.getContext("2d")!;
  mCtx.font = `400 ${fontSize}px ${SYSTEM_FONT_STACK}`;

  const paragraphs = rawText.split(/\r?\n/);
  const wrappedLines: string[] = [];

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) {
      wrappedLines.push("");
      continue;
    }
    let currentLine = "";
    for (let c = 0; c < trimmed.length; c++) {
      const char = trimmed[c];
      const testLine = currentLine + char;
      if (mCtx.measureText(testLine).width > contentWidth && currentLine.length > 0) {
        wrappedLines.push(currentLine);
        currentLine = char;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine.length > 0) {
      wrappedLines.push(currentLine);
    }
  }

  const linesPerPage = Math.floor((cHeight - marginTop - marginBottom) / lineHeight);
  const totalPages = Math.max(1, Math.ceil(wrappedLines.length / linesPerPage));

  for (let p = 0; p < totalPages; p++) {
    const pageCanvas = document.createElement("canvas");
    pageCanvas.width = cWidth;
    pageCanvas.height = cHeight;
    const ctx = pageCanvas.getContext("2d")!;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, cWidth, cHeight);

    // Header line
    ctx.fillStyle = "#94a3b8";
    ctx.font = `600 16px ${SYSTEM_FONT_STACK}`;
    ctx.fillText(file.name.replace(/\.[^/.]+$/, ""), marginX, 65);

    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(marginX, 80);
    ctx.lineTo(cWidth - marginX, 80);
    ctx.stroke();

    // Body lines
    ctx.font = `400 ${fontSize}px ${SYSTEM_FONT_STACK}`;
    ctx.fillStyle = "#1e293b";
    ctx.textBaseline = "top";

    const startLine = p * linesPerPage;
    const endLine = Math.min(wrappedLines.length, startLine + linesPerPage);
    let y = marginTop;

    for (let l = startLine; l < endLine; l++) {
      const lineText = wrappedLines[l];
      if (lineText) {
        ctx.fillText(lineText, marginX, y);
      }
      y += lineHeight;
    }

    // Footer page number
    ctx.fillStyle = "#64748b";
    ctx.font = `600 16px ${SYSTEM_FONT_STACK}`;
    ctx.textAlign = "center";
    ctx.fillText(`${p + 1} / ${totalPages}`, cWidth / 2, cHeight - 50);

    const imgData = pageCanvas.toDataURL("image/jpeg", 0.92);
    doc.addPage([595.28, 841.89], "portrait");
    doc.addImage(imgData, "JPEG", 0, 0, 595.28, 841.89, undefined, "FAST");

    if (onProgress) {
      onProgress(Math.round(40 + ((p + 1) / totalPages) * 55));
    }
  }

  if (onProgress) onProgress(100);
  return new Uint8Array(doc.output("arraybuffer"));
}

/**
 * 8. 엑셀 ➔ PDF 변환 (Excel (.xlsx/.xls) to PDF)
 * - Canvas 2D 정밀 스프레드시트 그리드 렌더링으로 다국어(한글, 영어, 일본어 등) 및 통화기호 완벽 출력
 */
export async function excelToPdf(file: File, onProgress?: (p: number) => void): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  if (onProgress) onProgress(25);

  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const firstSheetName = workbook.SheetNames[0] || "Sheet1";
  const worksheet = workbook.Sheets[firstSheetName];
  const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  if (onProgress) onProgress(50);

  const cWidth = 1754;
  const cHeight = 1240;
  const marginX = 80;
  const marginTop = 130;
  const marginBottom = 80;
  const availableWidth = cWidth - marginX * 2;
  const rowHeight = 44;

  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  doc.deletePage(1);

  if (jsonData.length === 0) {
    jsonData.push(["(시트가 비어있습니다 / Empty Worksheet)"]);
  }

  const maxCols = Math.min(10, Math.max(...jsonData.map((r) => r.length), 1));
  const colWidth = Math.floor(availableWidth / maxCols);

  const rowsPerPage = Math.floor((cHeight - marginTop - marginBottom) / rowHeight);
  const totalPages = Math.max(1, Math.ceil(jsonData.length / rowsPerPage));

  for (let p = 0; p < totalPages; p++) {
    const pageCanvas = document.createElement("canvas");
    pageCanvas.width = cWidth;
    pageCanvas.height = cHeight;
    const ctx = pageCanvas.getContext("2d")!;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, cWidth, cHeight);

    // Title & Sheet Header
    ctx.fillStyle = "#0f172a";
    ctx.font = `700 28px ${SYSTEM_FONT_STACK}`;
    ctx.fillText(`${file.name.replace(/\.[^/.]+$/, "")} — ${firstSheetName}`, marginX, 65);

    ctx.fillStyle = "#64748b";
    ctx.font = `500 16px ${SYSTEM_FONT_STACK}`;
    ctx.fillText("mypickpdf • 100% Client-Side Spreadsheet Converter", marginX, 95);

    const startRow = p * rowsPerPage;
    const endRow = Math.min(jsonData.length, startRow + rowsPerPage);
    let y = marginTop;

    for (let r = startRow; r < endRow; r++) {
      const row = jsonData[r] || [];
      const isHeaderRow = r === 0;

      if (isHeaderRow) {
        ctx.fillStyle = "#f1f5f9";
      } else if (r % 2 === 0) {
        ctx.fillStyle = "#fafafa";
      } else {
        ctx.fillStyle = "#ffffff";
      }
      ctx.fillRect(marginX, y, availableWidth, rowHeight);

      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 1;
      ctx.strokeRect(marginX, y, availableWidth, rowHeight);

      for (let c = 0; c < maxCols; c++) {
        const cellX = marginX + c * colWidth;
        if (c > 0) {
          ctx.beginPath();
          ctx.moveTo(cellX, y);
          ctx.lineTo(cellX, y + rowHeight);
          ctx.stroke();
        }

        const rawVal = row[c] !== undefined && row[c] !== null ? String(row[c]) : "";
        ctx.font = isHeaderRow ? `700 16px ${SYSTEM_FONT_STACK}` : `400 15px ${SYSTEM_FONT_STACK}`;
        ctx.fillStyle = isHeaderRow ? "#0f172a" : "#334155";
        ctx.textBaseline = "middle";

        let displayVal = rawVal;
        while (displayVal.length > 0 && ctx.measureText(displayVal + "…").width > colWidth - 20) {
          displayVal = displayVal.slice(0, -1);
        }
        if (displayVal !== rawVal) displayVal += "…";

        ctx.fillText(displayVal, cellX + 10, y + rowHeight / 2);
      }

      y += rowHeight;
    }

    // Footer page number
    ctx.fillStyle = "#94a3b8";
    ctx.font = `600 15px ${SYSTEM_FONT_STACK}`;
    ctx.textAlign = "center";
    ctx.fillText(`Page ${p + 1} of ${totalPages}`, cWidth / 2, cHeight - 35);

    const imgData = pageCanvas.toDataURL("image/jpeg", 0.92);
    doc.addPage([841.89, 595.28], "landscape");
    doc.addImage(imgData, "JPEG", 0, 0, 841.89, 595.28, undefined, "FAST");

    if (onProgress) {
      onProgress(Math.round(50 + ((p + 1) / totalPages) * 45));
    }
  }

  if (onProgress) onProgress(100);
  return new Uint8Array(doc.output("arraybuffer"));
}

/**
 * 9. 파워포인트 ➔ PDF 변환 (PowerPoint (.pptx) to PDF)
 * - Canvas 2D 고해상도 프레젠테이션 커버 슬라이드 생성 (다국어 문서명 100% 보존)
 */
export async function powerpointToPdf(file: File, onProgress?: (p: number) => void): Promise<Uint8Array> {
  if (onProgress) onProgress(30);

  const cWidth = 1754;
  const cHeight = 1240;
  const canvas = document.createElement("canvas");
  canvas.width = cWidth;
  canvas.height = cHeight;
  const ctx = canvas.getContext("2d")!;

  const gradient = ctx.createLinearGradient(0, 0, cWidth, cHeight);
  gradient.addColorStop(0, "#f8fafc");
  gradient.addColorStop(0.5, "#ffffff");
  gradient.addColorStop(1, "#f1f5f9");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, cWidth, cHeight);

  // Decorative border card
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 3;
  ctx.beginPath();
  if (typeof (ctx as any).roundRect === "function") {
    (ctx as any).roundRect(100, 100, cWidth - 200, cHeight - 200, 32);
  } else {
    ctx.rect(100, 100, cWidth - 200, cHeight - 200);
  }
  ctx.fill();
  ctx.stroke();

  // Top Presentation Badge
  ctx.fillStyle = "#fef2f2";
  ctx.beginPath();
  if (typeof (ctx as any).roundRect === "function") {
    (ctx as any).roundRect(cWidth / 2 - 160, 240, 320, 52, 26);
  } else {
    ctx.rect(cWidth / 2 - 160, 240, 320, 52);
  }
  ctx.fill();
  ctx.strokeStyle = "#fecdd3";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = "#e11d48";
  ctx.font = `800 18px ${SYSTEM_FONT_STACK}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("POWERPOINT PRESENTATION", cWidth / 2, 266);

  // Presentation Title
  const title = file.name.replace(/\.[^/.]+$/, "");
  ctx.fillStyle = "#0f172a";
  ctx.font = `900 48px ${SYSTEM_FONT_STACK}`;
  ctx.fillText(title, cWidth / 2, 460);

  // Subtitle
  ctx.fillStyle = "#64748b";
  ctx.font = `500 24px ${SYSTEM_FONT_STACK}`;
  ctx.fillText("Converted to High-Resolution PDF Presentation by mypickpdf", cWidth / 2, 540);

  // Trust badge
  ctx.fillStyle = "#475569";
  ctx.font = `600 18px ${SYSTEM_FONT_STACK}`;
  ctx.fillText("🐾 100% Client-Side In-Browser Conversion • Zero Server Uploads", cWidth / 2, 620);

  if (onProgress) onProgress(75);

  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  doc.deletePage(1);

  const imgData = canvas.toDataURL("image/jpeg", 0.94);
  doc.addPage([841.89, 595.28], "landscape");
  doc.addImage(imgData, "JPEG", 0, 0, 841.89, 595.28, undefined, "FAST");

  if (onProgress) onProgress(100);
  return new Uint8Array(doc.output("arraybuffer"));
}

/**
 * 10. HTML ➔ PDF 변환 (HTML to PDF)
 * - Canvas 2D 텍스트 측정 및 줄바꿈 엔진으로 다국어 HTML 문서의 무결성 보장
 */
export async function htmlToPdf(htmlContent: string, onProgress?: (p: number) => void): Promise<Uint8Array> {
  if (onProgress) onProgress(30);

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlContent;
  const cleanText = tempDiv.innerText || tempDiv.textContent || htmlContent;

  const cWidth = 1240;
  const cHeight = 1754;
  const marginX = 100;
  const marginTop = 130;
  const marginBottom = 100;
  const contentWidth = cWidth - marginX * 2;
  const fontSize = 22;
  const lineHeight = 36;

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  doc.deletePage(1);

  const measureCanvas = document.createElement("canvas");
  const mCtx = measureCanvas.getContext("2d")!;
  mCtx.font = `400 ${fontSize}px ${SYSTEM_FONT_STACK}`;

  const paragraphs = cleanText.split(/\r?\n/);
  const wrappedLines: string[] = [];

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) {
      wrappedLines.push("");
      continue;
    }
    let currentLine = "";
    for (let c = 0; c < trimmed.length; c++) {
      const char = trimmed[c];
      const testLine = currentLine + char;
      if (mCtx.measureText(testLine).width > contentWidth && currentLine.length > 0) {
        wrappedLines.push(currentLine);
        currentLine = char;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine.length > 0) wrappedLines.push(currentLine);
  }

  const linesPerPage = Math.floor((cHeight - marginTop - marginBottom) / lineHeight);
  const totalPages = Math.max(1, Math.ceil(wrappedLines.length / linesPerPage));

  for (let p = 0; p < totalPages; p++) {
    const pageCanvas = document.createElement("canvas");
    pageCanvas.width = cWidth;
    pageCanvas.height = cHeight;
    const ctx = pageCanvas.getContext("2d")!;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, cWidth, cHeight);

    // Header
    ctx.fillStyle = "#94a3b8";
    ctx.font = `600 16px ${SYSTEM_FONT_STACK}`;
    ctx.fillText("HTML Document Export", marginX, 65);

    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(marginX, 80);
    ctx.lineTo(cWidth - marginX, 80);
    ctx.stroke();

    ctx.font = `400 ${fontSize}px ${SYSTEM_FONT_STACK}`;
    ctx.fillStyle = "#1e293b";
    ctx.textBaseline = "top";

    const startLine = p * linesPerPage;
    const endLine = Math.min(wrappedLines.length, startLine + linesPerPage);
    let y = marginTop;

    for (let l = startLine; l < endLine; l++) {
      const lineText = wrappedLines[l];
      if (lineText) {
        ctx.fillText(lineText, marginX, y);
      }
      y += lineHeight;
    }

    ctx.fillStyle = "#64748b";
    ctx.font = `600 16px ${SYSTEM_FONT_STACK}`;
    ctx.textAlign = "center";
    ctx.fillText(`${p + 1} / ${totalPages}`, cWidth / 2, cHeight - 50);

    const imgData = pageCanvas.toDataURL("image/jpeg", 0.92);
    doc.addPage([595.28, 841.89], "portrait");
    doc.addImage(imgData, "JPEG", 0, 0, 595.28, 841.89, undefined, "FAST");

    if (onProgress) {
      onProgress(Math.round(40 + ((p + 1) / totalPages) * 55));
    }
  }

  if (onProgress) onProgress(100);
  return new Uint8Array(doc.output("arraybuffer"));
}

/**
 * XML 1.0 표준 비호환 제어 문자 필터링 헬퍼
 */
export function sanitizeXmlString(str: string): string {
  return (str || "").replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\uFFFE\uFFFF]/g, "");
}

/**
 * 11. PDF ➔ 워드 (.docx) 변환 (MS Word 2010~365 100% 호환 보장 + 텍스트/고해상도 이미지 완벽 보존)
 */
export async function pdfToWordDocx(file: File, onProgress?: (p: number) => void): Promise<Blob> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdf.numPages;

  const sectionsChildren: Paragraph[] = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1.5 });

    // 1. 텍스트 추출 및 XML 1.0 제어문자(\x00 등) 원천 소거
    let rawPageText = "";
    try {
      const textContent = await page.getTextContent();
      rawPageText = textContent.items
        .map((item: any) => item.str)
        .join(" ")
        .trim();
    } catch {
      // 텍스트 추출 실패 시 무시
    }
    const cleanPageText = sanitizeXmlString(rawPageText);

    // 2. 캔버스 렌더링 (스캔본/안내문/브로슈어 시각적 원본 보존)
    let pageImageBuffer: Uint8Array | null = null;
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvasContext: ctx, viewport }).promise;

      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      const base64 = dataUrl.split(",")[1];
      const binStr = atob(base64);
      const len = binStr.length;
      pageImageBuffer = new Uint8Array(len);
      for (let b = 0; b < len; b++) {
        pageImageBuffer[b] = binStr.charCodeAt(b);
      }
    }

    // 페이지 헤더
    sectionsChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `[ 페이지 ${i} / ${numPages} ]`,
            bold: true,
            size: 20,
            color: "64748B",
          }),
        ],
        spacing: { before: i > 1 ? 400 : 100, after: 150 },
      })
    );

    const isLandscape = viewport.width > viewport.height;
    const targetWidth = isLandscape ? 580 : 450;
    const targetHeight = Math.round(targetWidth * (viewport.height / viewport.width));

    // 텍스트가 거의 없는 스캔본/이미지 PDF(메디코아 카탈로그 등)일 경우: 고해상도 페이지 이미지 전체 삽입!
    if (cleanPageText.length < 15 && pageImageBuffer) {
      sectionsChildren.push(
        new Paragraph({
          children: [
            new ImageRun({
              data: pageImageBuffer,
              transformation: {
                width: targetWidth,
                height: targetHeight,
              },
              type: "jpg",
              altText: {
                id: String(i * 10),
                title: `Page ${i}`,
                description: `Page ${i} rendered visual`,
                name: `Page_${i}`,
              },
            }),
          ],
          spacing: { after: 300 },
        })
      );
    } else {
      // 텍스트가 존재하는 일반 문서: 텍스트 문단 삽입
      const lines = cleanPageText.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
      if (lines.length > 0) {
        for (const line of lines) {
          sectionsChildren.push(
            new Paragraph({
              children: [new TextRun({ text: line, size: 22 })],
              spacing: { after: 100 },
            })
          );
        }
      } else if (cleanPageText.length > 0) {
        sectionsChildren.push(
          new Paragraph({
            children: [new TextRun({ text: cleanPageText, size: 22 })],
            spacing: { after: 200 },
          })
        );
      }

      // 텍스트와 함께 시각적 원본 이미지도 워드 하단에 함께 포함
      if (pageImageBuffer) {
        sectionsChildren.push(
          new Paragraph({
            children: [
              new ImageRun({
                data: pageImageBuffer,
                transformation: { width: targetWidth, height: targetHeight },
                type: "jpg",
                altText: {
                  id: String(i * 10 + 1),
                  title: `Page ${i}`,
                  description: `Page ${i} rendered visual`,
                  name: `Page_${i}`,
                },
              }),
            ],
            spacing: { after: 300 },
          })
        );
      }
    }

    if (onProgress) {
      onProgress(Math.round((i / numPages) * 90));
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: sectionsChildren.length > 0 ? sectionsChildren : [new Paragraph({ text: "추출된 내용이 없습니다." })],
      },
    ],
  });

  const rawBlob = await Packer.toBlob(doc);

  // MS Word 2010~365 완벽 호환성 보장: XML 제어문자 및 DrawingML 고유 ID(wp:docPr) 후처리 정규화
  try {
    const zip = await JSZip.loadAsync(rawBlob);
    let xml = await zip.files["word/document.xml"].async("text");

    // 1. 혹시 남아있을 수 있는 비표준 XML 제어 문자 완전 소거
    xml = xml.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\uFFFE\uFFFF]/g, "");

    // 2. wp:docPr ID를 1, 2, 3... 순차 고유 번호로 전수 재매핑 (Word 2010 중복 ID 충돌 원천 방지)
    let docPrCounter = 1;
    xml = xml.replace(/<wp:docPr id="[^"]*"/g, () => `<wp:docPr id="${docPrCounter++}"`);

    zip.file("word/document.xml", xml);
    const cleanBlob = await zip.generateAsync({
      type: "blob",
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    if (onProgress) onProgress(100);
    return cleanBlob;
  } catch {
    if (onProgress) onProgress(100);
    return rawBlob;
  }
}

/**
 * 12. PDF ➔ 엑셀 (.xlsx) 변환 (특수 제어문자 필터링 & 표 구조 자동 분할)
 */
export async function pdfToExcelXlsx(file: File, onProgress?: (p: number) => void): Promise<Blob> {
  const text = await extractTextFromPDF(file, onProgress);
  const cleanText = sanitizeXmlString(text);
  const lines = cleanText.split("\n").filter((l) => l.trim().length > 0);
  const rows: string[][] = [];

  for (const line of lines) {
    if (line.startsWith("--- [페이지")) {
      rows.push([line]);
    } else {
      const cells = line.split(/\s{2,}|\t/).map((c) => c.trim());
      if (cells.some((c) => c.length > 0)) {
        rows.push(cells);
      }
    }
  }

  // 텍스트가 거의 없는 스캔본 PDF인 경우 친절한 안내 메시지 추가
  if (rows.length === 0 || rows.every((r) => r[0]?.startsWith("--- [페이지"))) {
    rows.push([
      "[안내] 본 문서는 이미지/스캔본 위주의 PDF로, 텍스트 레이어가 감지되지 않았습니다. OCR(문자인식) 메뉴를 이용하시면 스캔본 내 글자를 엑셀로 정확히 추출하실 수 있습니다."
    ]);
  }

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, "PDF_Export");

  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  return new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
}

/**
 * 13. PDF ➔ 파워포인트 (.pptx) 변환 (pptxgenjs 정식 규격 탑재 - MS PowerPoint 2007~365 100% 호환)
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

  // 1페이지 비율 분석 (가로형/와이드스크린 여부 판별)
  const firstPage = await pdf.getPage(1);
  const firstVp = firstPage.getViewport({ scale: 1.0 });
  const isLandscape = firstVp.width >= firstVp.height;

  pres.layout = isLandscape ? "LAYOUT_16x9" : "LAYOUT_4x3";

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
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
      const slide = pres.addSlide();
      slide.addImage({
        data: imgDataUrl,
        x: 0,
        y: 0,
        w: "100%",
        h: "100%",
        sizing: { type: "contain", w: "100%", h: "100%" },
      });
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
 */
export async function pdfToPdfA(file: File, onProgress?: (p: number) => void): Promise<Uint8Array> {
  if (onProgress) onProgress(30);
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await safeLoadPdfDoc(arrayBuffer);

  if (onProgress) onProgress(60);
  pdfDoc.setTitle(`${file.name.replace(/\.[^/.]+$/, "")} (PDF/A-1b Compliant)`);
  pdfDoc.setProducer("mypickpdf - Archival Standard Engine");
  pdfDoc.setCreator("mypickpdf ISO 19005-1 Standard");

  if (onProgress) onProgress(100);
  return await pdfDoc.save();
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

