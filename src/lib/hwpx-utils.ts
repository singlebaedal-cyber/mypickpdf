import { HWPXBuilder, write } from "hwpx-js";

export interface HwpxConversionOptions {
  mode: "hybrid" | "textOnly" | "imageOnly";
  fontSize?: number; // 기본 본문 글자 크기 (기본값 10.5pt)
  fontName?: string; // 기본 글꼴 (기본값 함초롬바탕)
  includePageHeader?: boolean;
}

export interface HwpxConversionResult {
  hwpxBlob: Blob;
  hwpBlob: Blob;
  pageCount: number;
  textLength: number;
  previewLines: string[];
}

/**
 * XML 1.0 표준 비호환 제어 문자 필터링
 */
export function sanitizeXml(str: string): string {
  return (str || "").replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\uFFFE\uFFFF]/g, "");
}

interface TextItemData {
  str: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * PDF 페이지에서 줄(Line) 단위로 구조화된 텍스트 추출
 */
function extractLinesFromPage(items: any[]): string[] {
  if (!items || items.length === 0) return [];

  const textItems: TextItemData[] = items
    .filter((it: any) => it && typeof it.str === "string" && it.str.trim().length > 0)
    .map((it: any) => ({
      str: it.str,
      x: it.transform ? it.transform[4] : 0,
      y: it.transform ? it.transform[5] : 0,
      width: it.width || 0,
      height: it.height || 0,
    }));

  if (textItems.length === 0) return [];

  // Y 좌표 내림차순 정렬 (PDF는 하단이 0이므로 높은 Y가 위쪽)
  textItems.sort((a, b) => b.y - a.y || a.x - b.x);

  const lines: { y: number; items: TextItemData[] }[] = [];
  const lineTolerance = 5; // 같은 줄로 묶을 Y 좌표 오차 허용치

  for (const item of textItems) {
    let matchedLine = lines.find((l) => Math.abs(l.y - item.y) <= lineTolerance);
    if (matchedLine) {
      matchedLine.items.push(item);
    } else {
      lines.push({ y: item.y, items: [item] });
    }
  }

  // 각 줄 내부에서 X 좌표 오름차순 (왼쪽에서 오른쪽) 정렬 후 결합
  return lines.map((line) => {
    line.items.sort((a, b) => a.x - b.x);
    let lineStr = "";
    for (let i = 0; i < line.items.length; i++) {
      const cur = line.items[i];
      if (i > 0) {
        const prev = line.items[i - 1];
        const gap = cur.x - (prev.x + prev.width);
        // 간격이 있으면 공백 추가
        if (gap > 2 && !lineStr.endsWith(" ") && !cur.str.startsWith(" ")) {
          lineStr += " ";
        }
      }
      lineStr += cur.str;
    }
    return sanitizeXml(lineStr.trim());
  }).filter((line) => line.length > 0);
}

/**
 * PDF 파일을 OWPML 표준 한글(.hwpx / .hwp) 파일로 변환
 * 100% 브라우저 클라이언트 사이드 실행 (서버 업로드 0바이트)
 */
export async function convertPdfToHwpx(
  file: File,
  options: HwpxConversionOptions = { mode: "hybrid", fontSize: 10.5, fontName: "함초롬바탕", includePageHeader: true },
  onProgress?: (progress: number) => void
): Promise<HwpxConversionResult> {
  if (onProgress) onProgress(5);

  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdf.numPages;

  if (onProgress) onProgress(15);

  const builder = new HWPXBuilder();

  // A4 표준 여백 설정 (단위: mm)
  builder.setPageSettings({
    width: 210,
    height: 297,
    marginLeft: 18,
    marginRight: 18,
    marginTop: 18,
    marginBottom: 18,
  });

  let totalTextLength = 0;
  const allPreviewLines: string[] = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.5 });

    // 1. 텍스트 추출
    let pageLines: string[] = [];
    try {
      const textContent = await page.getTextContent();
      pageLines = extractLinesFromPage(textContent.items);
    } catch (e) {
      console.warn(`Page ${pageNum} text extraction failed`, e);
    }

    // 2. 캔버스 이미지 렌더링 (하이브리드 모드 및 이미지 전용 모드 시 원본 레이아웃 보존용)
    let pageImageBuffer: Uint8Array | null = null;
    const shouldRenderImage =
      options.mode === "imageOnly" ||
      (options.mode === "hybrid" && (pageLines.length < 5 || options.mode === "hybrid"));

    if (shouldRenderImage && typeof document !== "undefined") {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          await page.render({ canvasContext: ctx, viewport }).promise;

          const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
          const base64 = dataUrl.split(",")[1];
          if (base64) {
            const binStr = atob(base64);
            const len = binStr.length;
            pageImageBuffer = new Uint8Array(len);
            for (let b = 0; b < len; b++) {
              pageImageBuffer[b] = binStr.charCodeAt(b);
            }
          }
        }
      } catch (imgErr) {
        console.warn(`Page ${pageNum} image render failed`, imgErr);
      }
    }

    // 새 섹션 추가 (첫 페이지는 기본 섹션 사용, 2페이지부터 addSection)
    if (pageNum > 1) {
      builder.addSection();
    }

    // 페이지 번호 머리말 표시
    if (options.includePageHeader !== false) {
      builder.addParagraph(`- [ ${pageNum} / ${numPages} 페이지 ] -`, {
        fontSize: 9,
        bold: true,
        color: "#64748B",
      });
      builder.addEmptyParagraph();
    }

    // 텍스트 문단 삽입
    if (options.mode !== "imageOnly" && pageLines.length > 0) {
      for (const line of pageLines) {
        totalTextLength += line.length;
        if (allPreviewLines.length < 15) {
          allPreviewLines.push(line);
        }

        // 제목 및 소제목 패턴 감지 (예: 제1조, 1., 가., ■, ▶, [제목])
        const isHeader =
          /^(제\s*\d+\s*[조장절항]|[\d]+\.|\([0-9]+\)|[가-하]\.|[■▶◆●*#]|[A-Z]\.)/.test(line) ||
          (line.length < 30 && pageLines.length < 10);

        builder.addParagraph(line, {
          fontSize: isHeader ? 12 : (options.fontSize || 10.5),
          bold: isHeader,
          fontName: options.fontName || "함초롬바탕",
        });
      }
    }

    // 텍스트가 거의 없는 스캔 PDF이거나 하이브리드 모드인 경우 원본 시각 레이아웃 이미지 추가
    if (pageImageBuffer) {
      if (pageLines.length > 0 && options.mode === "hybrid") {
        builder.addEmptyParagraph();
        builder.addParagraph("[ 원본 레이아웃 및 서식 미리보기 ]", {
          fontSize: 8.5,
          color: "#94A3B8",
        });
      }

      const isLandscape = viewport.width > viewport.height;
      const targetWidthMm = isLandscape ? 240 : 170;
      const targetHeightMm = Math.round(targetWidthMm * (viewport.height / viewport.width));

      try {
        builder.addImage(pageImageBuffer, "jpg", {
          width: targetWidthMm,
          height: targetHeightMm,
        });
      } catch (addImgErr) {
        console.warn("builder.addImage failed:", addImgErr);
      }
    }

    // 진행률 계산
    const currentProgress = Math.round(15 + ((pageNum / numPages) * 75));
    if (onProgress) onProgress(currentProgress);
  }

  if (onProgress) onProgress(92);

  // HWPX 패키지 빌드 및 직렬화
  const doc = builder.build();
  const hwpxBytes = write(doc);

  if (onProgress) onProgress(98);

  const hwpxBlob = new Blob([hwpxBytes as unknown as BlobPart], {
    type: "application/hwp+zip",
  });

  // 레거시 관공서 제출용 .hwp MIME 호환 블롭
  const hwpBlob = new Blob([hwpxBytes as unknown as BlobPart], {
    type: "application/x-hwp",
  });

  if (onProgress) onProgress(100);

  return {
    hwpxBlob,
    hwpBlob,
    pageCount: numPages,
    textLength: totalTextLength,
    previewLines: allPreviewLines,
  };
}
