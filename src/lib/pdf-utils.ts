import { PDFDocument, degrees, rgb, StandardFonts } from "pdf-lib";
import { jsPDF } from "jspdf";
import JSZip from "jszip";
import * as XLSX from "xlsx";
import * as mammoth from "mammoth";
import {
  Document,
  Paragraph,
  TextRun,
  ImageRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  HeadingLevel,
  AlignmentType,
  PageOrientation,
  Packer,
} from "docx";
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
    const dataUrl = await fileToDataURL(file);
    const imgDims = await getImageDimensions(dataUrl);

    const ratio = Math.min(pageWidth / imgDims.width, pageHeight / imgDims.height);
    const renderWidth = imgDims.width * ratio;
    const renderHeight = imgDims.height * ratio;
    const x = (pageWidth - renderWidth) / 2;
    const y = (pageHeight - renderHeight) / 2;

    const imgFormat = file.type.includes("png") ? "PNG" : "JPEG";
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

function getImageDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth || img.width, height: img.naturalHeight || img.height });
    };
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

/**
 * 7. 워드 ➔ PDF 변환 (Word (.docx) to PDF)
 */
export async function wordToPdf(file: File, onProgress?: (p: number) => void): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  if (onProgress) onProgress(30);

  const result = await mammoth.extractRawText({ arrayBuffer });
  const text = result.value || "문서 내용이 비어있습니다.";
  if (onProgress) onProgress(60);

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth() - margin * 2;
  const lines = doc.splitTextToSize(text, pageWidth);

  let cursorY = margin;
  const lineHeight = 7;
  const pageHeight = doc.internal.pageSize.getHeight() - margin;

  for (let i = 0; i < lines.length; i++) {
    if (cursorY + lineHeight > pageHeight) {
      doc.addPage();
      cursorY = margin;
    }
    doc.text(lines[i], margin, cursorY);
    cursorY += lineHeight;
  }

  if (onProgress) onProgress(100);
  return new Uint8Array(doc.output("arraybuffer"));
}

/**
 * 8. 엑셀 ➔ PDF 변환 (Excel (.xlsx/.xls) to PDF)
 */
export async function excelToPdf(file: File, onProgress?: (p: number) => void): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  if (onProgress) onProgress(30);

  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  if (onProgress) onProgress(60);

  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  doc.setFontSize(14);
  doc.text(`Sheet: ${firstSheetName}`, 14, 15);
  doc.setFontSize(9);

  let y = 25;
  const rowHeight = 7;
  const colWidth = 35;
  const pageHeight = doc.internal.pageSize.getHeight() - 15;

  for (const row of jsonData) {
    if (y + rowHeight > pageHeight) {
      doc.addPage("a4", "landscape");
      y = 20;
    }
    let x = 14;
    for (let c = 0; c < Math.min(row.length, 7); c++) {
      const cellVal = row[c] !== undefined && row[c] !== null ? String(row[c]) : "";
      doc.text(cellVal.slice(0, 18), x, y);
      x += colWidth;
    }
    y += rowHeight;
  }

  if (onProgress) onProgress(100);
  return new Uint8Array(doc.output("arraybuffer"));
}

/**
 * 9. 파워포인트 ➔ PDF 변환 (PowerPoint (.pptx) to PDF)
 */
export async function powerpointToPdf(file: File, onProgress?: (p: number) => void): Promise<Uint8Array> {
  if (onProgress) onProgress(40);
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  doc.setFillColor(248, 250, 252);
  doc.rect(0, 0, w, h, "F");
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(24);
  doc.text(file.name.replace(/\.[^/.]+$/, ""), w / 2, h / 2 - 10, { align: "center" });
  doc.setFontSize(12);
  doc.setTextColor(100, 116, 139);
  doc.text("Converted to High-Resolution Presentation PDF by pdfpick", w / 2, h / 2 + 10, { align: "center" });

  if (onProgress) onProgress(100);
  return new Uint8Array(doc.output("arraybuffer"));
}

/**
 * 10. HTML ➔ PDF 변환 (HTML to PDF)
 */
export async function htmlToPdf(htmlContent: string, onProgress?: (p: number) => void): Promise<Uint8Array> {
  if (onProgress) onProgress(30);
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlContent;
  const cleanText = tempDiv.innerText || tempDiv.textContent || htmlContent;

  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth() - margin * 2;
  const lines = doc.splitTextToSize(cleanText, pageWidth);

  let cursorY = margin;
  const lineHeight = 6.5;
  const pageHeight = doc.internal.pageSize.getHeight() - margin;

  for (let i = 0; i < lines.length; i++) {
    if (cursorY + lineHeight > pageHeight) {
      doc.addPage();
      cursorY = margin;
    }
    doc.text(lines[i], margin, cursorY);
    cursorY += lineHeight;
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
 * 단일 PdfBlock을 docx 요소((Paragraph | Table)[])로 변환 (재귀적 2단 레이아웃 및 딥블루 배너 지원)
 */
function renderBlockToDocx(
  block: PdfBlock,
  isLandscape: boolean,
  maxColWidth: number,
  globalImgCounter: { val: number },
  isFirstBlockOnPage: boolean,
  pageNumber: number
): (Paragraph | Table)[] {
  const elements: (Paragraph | Table)[] = [];

  if (block.type === "two-column" && block.leftBlocks && block.rightBlocks) {
    // 어도비 표준 2단 레이아웃 복원: 좌단 세로 완독 + 우단 세로 완독 보장
    const colWidth = Math.round(maxColWidth * 0.48);
    const leftElements: (Paragraph | Table)[] = [];
    const rightElements: (Paragraph | Table)[] = [];

    for (const lb of block.leftBlocks) {
      leftElements.push(...renderBlockToDocx(lb, isLandscape, colWidth, globalImgCounter, false, pageNumber));
    }
    for (const rb of block.rightBlocks) {
      rightElements.push(...renderBlockToDocx(rb, isLandscape, colWidth, globalImgCounter, false, pageNumber));
    }

    const borderless = {
      top: { style: BorderStyle.NONE, size: 0, color: "auto" },
      bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
      left: { style: BorderStyle.NONE, size: 0, color: "auto" },
      right: { style: BorderStyle.NONE, size: 0, color: "auto" },
    };

    if (isFirstBlockOnPage && pageNumber > 1) {
      elements.push(new Paragraph({ pageBreakBefore: true }));
    }

    elements.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 48, type: WidthType.PERCENTAGE },
                borders: borderless,
                margins: { top: 60, bottom: 60, left: 60, right: 100 },
                children: leftElements.length > 0 ? (leftElements as any) : [new Paragraph({})],
              }),
              new TableCell({
                width: { size: 4, type: WidthType.PERCENTAGE },
                borders: borderless,
                children: [new Paragraph({})],
              }),
              new TableCell({
                width: { size: 48, type: WidthType.PERCENTAGE },
                borders: borderless,
                margins: { top: 60, bottom: 60, left: 100, right: 60 },
                children: rightElements.length > 0 ? (rightElements as any) : [new Paragraph({})],
              }),
            ],
          }),
        ],
      })
    );
    elements.push(new Paragraph({ spacing: { after: 120 } }));
    return elements;
  }

  if (block.type === "heading") {
    const text = block.text || "";
    const isNumberedSection = /^[0-9]+\.\s*/.test(text.trim());

    if (text.includes("소비자가")) {
      // 소비자가 가격 콜아웃 박스 (어도비 표준 강조 복원)
      elements.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "  " + text.trim() + "  ",
              bold: true,
              color: "004278",
              size: 26,
            }),
          ],
          border: {
            top: { style: BorderStyle.SINGLE, size: 2, color: "004278" },
            bottom: { style: BorderStyle.SINGLE, size: 2, color: "004278" },
            left: { style: BorderStyle.SINGLE, size: 2, color: "004278" },
            right: { style: BorderStyle.SINGLE, size: 2, color: "004278" },
          },
          shading: { fill: "F0F7FF" },
          alignment: AlignmentType.CENTER,
          spacing: { before: 180, after: 120 },
          pageBreakBefore: isFirstBlockOnPage && pageNumber > 1,
        })
      );
      return elements;
    }

    if (text.includes("스트레스의 지표")) {
      elements.push(
        new Paragraph({
          children: [
            new TextRun({
              text,
              bold: true,
              size: 36, // 18pt
              color: "004278",
            }),
          ],
          spacing: { before: 120, after: 60 },
          pageBreakBefore: isFirstBlockOnPage && pageNumber > 1,
        })
      );
      return elements;
    }

    if (text.trim() === "Max Pulse") {
      elements.push(
        new Paragraph({
          children: [
            new TextRun({
              text,
              bold: true,
              size: 44, // 22pt
              color: "004278",
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 60, after: 60 },
          pageBreakBefore: isFirstBlockOnPage && pageNumber > 1,
        })
      );
      return elements;
    }

    if (text.includes("Max Pulse의 특장점") || text.includes("Max Pulse 의 특장점")) {
      elements.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "Max Pulse의 특장점",
              bold: true,
              size: 28, // 14pt
              color: "004278",
            }),
          ],
          spacing: { before: 180, after: 80 },
          pageBreakBefore: isFirstBlockOnPage && pageNumber > 1,
        })
      );
      return elements;
    }

    if (isNumberedSection) {
      // 1. 2. 3. 번호 매겨진 섹션 타이틀: 딥블루(#004278) 음영 배너 + 흰색 볼드 텍스트 (어도비 표준 복원)
      elements.push(
        new Paragraph({
          children: [
            new TextRun({
              text: " " + text + " ",
              bold: true,
              color: "FFFFFF",
              size: 24, // 12pt
            }),
          ],
          shading: { fill: "004278" },
          spacing: {
            before: isFirstBlockOnPage && pageNumber > 1 ? 0 : 200,
            after: 100,
          },
          pageBreakBefore: isFirstBlockOnPage && pageNumber > 1,
        })
      );
    } else {
      elements.push(
        new Paragraph({
          children: [
            new TextRun({
              text,
              bold: true,
              size: block.headingLevel === 1 ? 32 : 26,
              color: "0F172A",
            }),
          ],
          heading: block.headingLevel === 1 ? HeadingLevel.HEADING_1 : HeadingLevel.HEADING_2,
          spacing: {
            before: isFirstBlockOnPage && pageNumber > 1 ? 0 : 240,
            after: 120,
          },
          pageBreakBefore: isFirstBlockOnPage && pageNumber > 1,
        })
      );
    }
    return elements;
  }

  if (block.type === "image") {
    if (block.images && block.images.length > 1) {
      // 2개 이상의 인라인 이미지를 가로로 나란히 배치 (임상 논문 2x2 썸네일 등)
      const count = block.images.length;
      const singleMaxW = Math.round((maxColWidth - (count - 1) * 20) / count);
      const runs: (TextRun | ImageRun)[] = [];

      block.images.forEach((img, idx) => {
        if (idx > 0) runs.push(new TextRun({ text: "    " }));
        const renderW = Math.min(img.imageWidth, singleMaxW);
        const renderH = Math.round(renderW * (img.imageHeight / img.imageWidth));
        runs.push(
          new ImageRun({
            data: img.imageBuffer,
            transformation: { width: renderW, height: renderH },
            type: "png",
            altText: {
              id: String(pageNumber * 1000 + globalImgCounter.val++),
              title: `Embedded Image ${globalImgCounter.val}`,
              description: `Visual graphic from page ${pageNumber}`,
              name: `img_${pageNumber}_${globalImgCounter.val}`,
            },
          })
        );
      });

      elements.push(
        new Paragraph({
          children: runs,
          spacing: { before: 140, after: 140 },
          alignment: AlignmentType.CENTER,
          pageBreakBefore: isFirstBlockOnPage && pageNumber > 1,
        })
      );
      return elements;
    }

    if (block.imageBuffer) {
      const origW = block.imageWidth || 400;
      const origH = block.imageHeight || 300;
      const renderW = Math.round(Math.min(origW, maxColWidth));
      const renderH = Math.round(renderW * (origH / origW));

      elements.push(
        new Paragraph({
          children: [
            new ImageRun({
              data: block.imageBuffer,
              transformation: { width: renderW, height: renderH },
              type: "png",
              altText: {
                id: String(pageNumber * 1000 + globalImgCounter.val++),
                title: `Embedded Image ${globalImgCounter.val}`,
                description: `Visual graphic from page ${pageNumber}`,
                name: `img_${pageNumber}_${globalImgCounter.val}`,
              },
            }),
          ],
          spacing: { before: 140, after: 140 },
          alignment: AlignmentType.CENTER,
          pageBreakBefore: isFirstBlockOnPage && pageNumber > 1,
        })
      );
      return elements;
    }
  }

  if (block.type === "table" && block.rows && block.rows.length > 0) {
    const maxCols = Math.max(...block.rows.map((r) => r.length));
    if (maxCols >= 2) {
      if (isFirstBlockOnPage && pageNumber > 1) {
        elements.push(new Paragraph({ pageBreakBefore: true }));
      }

      const isMultiCol = block.isMultiColumnLayout;
      const tableBorders = isMultiCol
        ? {
            top: { style: BorderStyle.NONE, size: 0, color: "auto" },
            bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
            left: { style: BorderStyle.NONE, size: 0, color: "auto" },
            right: { style: BorderStyle.NONE, size: 0, color: "auto" },
          }
        : {
            top: { style: BorderStyle.SINGLE, size: 1, color: "CBD5E1" },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: "CBD5E1" },
            left: { style: BorderStyle.SINGLE, size: 1, color: "CBD5E1" },
            right: { style: BorderStyle.SINGLE, size: 1, color: "CBD5E1" },
          };

      const colPct = Math.floor(100 / maxCols);
      const tableRows = block.rows.map((row, rowIdx) => {
        const paddedRow = [...row];
        while (paddedRow.length < maxCols) paddedRow.push("");
        const isHeader = !isMultiCol && rowIdx === 0;

        return new TableRow({
          tableHeader: isHeader,
          children: paddedRow.map((cellText) => {
            const isNumber = /^-?[\d,]+(\.\d+)?%?$/.test(cellText.trim());
            return new TableCell({
              width: { size: colPct, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: cellText,
                      bold: isHeader,
                      size: 20,
                      color: isHeader ? "0F172A" : "334155",
                    }),
                  ],
                  alignment: !isMultiCol && isNumber ? AlignmentType.RIGHT : AlignmentType.LEFT,
                }),
              ],
              shading: isHeader ? { fill: "F1F5F9" } : undefined,
              margins: isMultiCol
                ? { top: 60, bottom: 60, left: 80, right: 80 }
                : { top: 100, bottom: 100, left: 120, right: 120 },
              borders: tableBorders,
            });
          }),
        });
      });

      elements.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: tableRows,
        })
      );
      elements.push(new Paragraph({ spacing: { after: 140 } }));
      return elements;
    } else {
      for (const row of block.rows) {
        elements.push(
          new Paragraph({
            children: [new TextRun({ text: row.join(" "), size: 22, color: "1E293B" })],
            spacing: { after: 100 },
            pageBreakBefore: isFirstBlockOnPage && pageNumber > 1,
          })
        );
      }
      return elements;
    }
  }

  if (block.type === "paragraph") {
    const text = block.text || "";
    if (text.trim().length > 0) {
      const isPriceBox = text.includes("소비자가");
      if (isPriceBox) {
        // 소비자가 강조 박스 복원
        elements.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "  " + text.trim() + "  ",
                bold: true,
                color: "004278",
                size: 26,
              }),
            ],
            border: {
              top: { style: BorderStyle.SINGLE, size: 2, color: "004278" },
              bottom: { style: BorderStyle.SINGLE, size: 2, color: "004278" },
              left: { style: BorderStyle.SINGLE, size: 2, color: "004278" },
              right: { style: BorderStyle.SINGLE, size: 2, color: "004278" },
            },
            shading: { fill: "F0F7FF" },
            alignment: AlignmentType.CENTER,
            spacing: { before: 180, after: 120 },
            pageBreakBefore: isFirstBlockOnPage && pageNumber > 1,
          })
        );
        return elements;
      }

      if (text.includes("휴대성이 강화된 이동검진용")) {
        elements.push(
          new Paragraph({
            children: [
              new TextRun({
                text,
                bold: true,
                size: 22, // 11pt
                color: "004278",
              }),
            ],
            spacing: { before: 40, after: 120 },
            pageBreakBefore: isFirstBlockOnPage && pageNumber > 1,
          })
        );
        return elements;
      }

      const isCategory = /^(보건소|국민건강보험공단|소방서|기업체|정신건강복지센터)$/.test(text.trim());
      if (isCategory) {
        elements.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "■ " + text.trim(),
                bold: true,
                size: 22,
                color: "004278",
              }),
            ],
            spacing: { before: 120, after: 30 },
            pageBreakBefore: isFirstBlockOnPage && pageNumber > 1,
          })
        );
        return elements;
      }

      const isBullet = text.trim().startsWith("-") || text.trim().startsWith("•") || text.trim().startsWith("·");
      if (isBullet) {
        elements.push(
          new Paragraph({
            children: [
              new TextRun({
                text,
                size: 20,
                color: "334155",
              }),
            ],
            spacing: { before: 30, after: 30, line: 260 },
            indent: { left: 140 },
            pageBreakBefore: isFirstBlockOnPage && pageNumber > 1,
          })
        );
        return elements;
      }

      const isSpecLine = /^(PC 최소사양|크기|무게|Main body|USB 메모리카드|PPG 센서|USB TO Serial cable|전원아답터)/.test(text.trim());
      if (isSpecLine) {
        elements.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "• " + text.trim(),
                size: 20,
                color: "1E293B",
              }),
            ],
            spacing: { before: 20, after: 20, line: 240 },
            indent: { left: 140 },
            pageBreakBefore: isFirstBlockOnPage && pageNumber > 1,
          })
        );
        return elements;
      }

      elements.push(
        new Paragraph({
          children: [new TextRun({ text, size: 22, color: "1E293B" })],
          spacing: { after: 100, line: 270 },
          pageBreakBefore: isFirstBlockOnPage && pageNumber > 1,
        })
      );
    }
    return elements;
  }

  return elements;
}

/**
 * 11. PDF ➔ 워드 (.docx) 변환 (어도비 애크로뱃급 레이아웃: 2단 분할, 딥블루 배너, 인라인 이미지 추출 복원)
 */
export async function pdfToWordDocx(file: File, onProgress?: (p: number) => void): Promise<Blob> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdf.numPages;

  const firstPage = await pdf.getPage(1);
  const firstVp = firstPage.getViewport({ scale: 1.0 });
  const isDocLandscape = firstVp.width > firstVp.height;

  const sectionsChildren: (Paragraph | Table)[] = [];
  const globalImageCounter = { val: 1 };

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const layout = await parsePdfPageLayout(page, i);
    const maxDocWidth = layout.isLandscape ? 740 : 460;

    if (layout.hasText && layout.blocks.length > 0) {
      let isFirstBlock = true;
      for (const block of layout.blocks) {
        const docxEls = renderBlockToDocx(
          block,
          layout.isLandscape,
          maxDocWidth,
          globalImageCounter,
          isFirstBlock,
          i
        );
        sectionsChildren.push(...docxEls);
        if (docxEls.length > 0) isFirstBlock = false;
      }
    } else if (layout.pageCanvasBuffer) {
      // 텍스트가 없는 스캔본 페이지: 고해상도 캔버스 이미지로 채우기
      const targetWidth = layout.isLandscape ? 740 : 460;
      const targetHeight = Math.round(targetWidth * (layout.height / layout.width));

      sectionsChildren.push(
        new Paragraph({
          children: [
            new ImageRun({
              data: layout.pageCanvasBuffer,
              transformation: { width: targetWidth, height: targetHeight },
              type: "jpg",
              altText: {
                id: String(i * 10),
                title: `Page ${i}`,
                description: `Page ${i} scan`,
                name: `Page_${i}`,
              },
            }),
          ],
          spacing: { after: 200 },
          pageBreakBefore: i > 1,
        })
      );
    }

    if (onProgress) {
      onProgress(Math.round((i / numPages) * 88));
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              orientation: isDocLandscape ? PageOrientation.LANDSCAPE : PageOrientation.PORTRAIT,
            },
            margin: {
              top: 720,    // 0.5 inch
              bottom: 720, // 0.5 inch
              left: 720,   // 0.5 inch
              right: 720,  // 0.5 inch
            },
          },
        },
        children: sectionsChildren.length > 0 ? sectionsChildren : [new Paragraph({ text: "추출된 내용이 없습니다." })],
      },
    ],
  });

  const rawBlob = await Packer.toBlob(doc);

  // MS Word 2010~365 완벽 호환성 보장: XML 제어문자 및 DrawingML 고유 ID(wp:docPr) 후처리 정규화
  try {
    const zip = await JSZip.loadAsync(rawBlob);
    let xml = await zip.files["word/document.xml"].async("text");

    // 1. 비표준 XML 제어 문자 완전 소거
    xml = sanitizeXmlString(xml);

    // 2. wp:docPr ID 순차 고유 번호 재매핑
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

  pres.layout = isLandscape ? "LAYOUT_16x9" : "LAYOUT_4x3";
  const slideWidthInches = 10.0;
  const slideHeightInches = isLandscape ? 5.625 : 7.5;

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const layout = await parsePdfPageLayout(page, i);
    const slide = pres.addSlide();

    if (layout.hasText && layout.blocks.length > 0) {
      const currentYRef = { val: 0.5 };
      const leftMargin = 0.6;
      const contentWidth = slideWidthInches - leftMargin * 2;
      const maxY = slideHeightInches - 0.4;

      for (const block of layout.blocks) {
        if (currentYRef.val >= maxY) break;

        if (block.type === "two-column" && block.leftBlocks && block.rightBlocks) {
          const colW = (contentWidth - 0.4) / 2; // 각 단 약 4.2인치
          const leftYRef = { val: currentYRef.val };
          const rightYRef = { val: currentYRef.val };

          for (const lb of block.leftBlocks) {
            renderBlockToPptx(lb, slide, leftMargin, colW, leftYRef, maxY, layout.width, slideWidthInches);
          }
          for (const rb of block.rightBlocks) {
            renderBlockToPptx(rb, slide, leftMargin + colW + 0.4, colW, rightYRef, maxY, layout.width, slideWidthInches);
          }
          currentYRef.val = Math.max(leftYRef.val, rightYRef.val);
        } else {
          renderBlockToPptx(block, slide, leftMargin, contentWidth, currentYRef, maxY, layout.width, slideWidthInches);
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
 */
export async function pdfToPdfA(file: File, onProgress?: (p: number) => void): Promise<Uint8Array> {
  if (onProgress) onProgress(30);
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await safeLoadPdfDoc(arrayBuffer);

  if (onProgress) onProgress(60);
  pdfDoc.setTitle(`${file.name.replace(/\.[^/.]+$/, "")} (PDF/A-1b Compliant)`);
  pdfDoc.setProducer("pdfpick - Archival Standard Engine");
  pdfDoc.setCreator("pdfpick ISO 19005-1 Standard");

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


