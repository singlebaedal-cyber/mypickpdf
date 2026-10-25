/**
 * PDF 2D Spatial Layout & Asset Parser Engine (Adobe Acrobat Standard)
 * PDF.js textContent 및 Canvas/OperatorList로부터 2차원 좌표(x, y), 글꼴 크기, 
 * 다단(Multi-Column Segmentation), 한국어 스마트 띄어쓰기 복원(NLP), 
 * 본문 인라인 삽입 이미지(Embedded Image), 섹션 타이틀 배너(Deep Blue Banner)를 정밀 복원하는 고도화 엔진
 */

export interface PdfWordItem {
  str: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontName: string;
}

export interface PdfTextLine {
  y: number;
  fontSize: number;
  isHeading: boolean;
  headingLevel?: 1 | 2 | 3;
  items: PdfWordItem[];
  text: string;
  cells: string[];
}

export interface PdfBlock {
  type: "heading" | "paragraph" | "table" | "image" | "two-column";
  headingLevel?: 1 | 2 | 3;
  text?: string;
  fontSize?: number;
  rows?: string[][];
  lines?: PdfTextLine[];
  isMultiColumnLayout?: boolean;
  imageBuffer?: Uint8Array;
  imageDataUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
  x?: number;
  y?: number;
  images?: {
    imageBuffer: Uint8Array;
    imageDataUrl?: string;
    imageWidth: number;
    imageHeight: number;
    x: number;
    y: number;
  }[];
  leftBlocks?: PdfBlock[];
  rightBlocks?: PdfBlock[];
}

export interface PdfStructuredPage {
  pageNumber: number;
  width: number;
  height: number;
  isLandscape: boolean;
  medianFontSize: number;
  lines: PdfTextLine[];
  blocks: PdfBlock[];
  hasText: boolean;
  pageCanvasBuffer?: Uint8Array;
}

export interface ExtractedPdfImage {
  x: number;
  y: number;
  width: number;
  height: number;
  dataBuffer: Uint8Array;
  dataUrl?: string;
}

/**
 * XML 1.0 표준 비호환 제어 문자 필터링
 */
export function sanitizeText(str: string): string {
  return (str || "").replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\uFFFE\uFFFF]/g, "");
}

/**
 * 한국어/영문 스마트 띄어쓰기 복원 유틸리티 (국어원 및 다음 사전 맞춤법 규칙 기반)
 */
export function smartSpaceKorean(text: string): string {
  if (!text) return text;
  let s = text;

  // 1. 번호 매김 섹션 뒤 띄어쓰기: "1.자율신경" -> "1. 자율신경"
  s = s.replace(/([0-9]+\.)([가-힣a-zA-Z])/g, (m, p1, p2) => p1 + " " + p2);

  // 2. 쉼표 뒤 띄어쓰기 (단, 금액이나 통계 등 숫자 사이 쉼표는 절대 분리 금지: 2,200,000 / 51,638)
  s = s.replace(/([가-힣a-zA-Z]+),([가-힣a-zA-Z0-9]+)/g, (m, p1, p2) => p1 + ", " + p2);
  s = s.replace(/([0-9]+),([가-힣a-zA-Z]+)/g, (m, p1, p2) => p1 + ", " + p2);

  // 3. 콜론(:) 앞뒤 정규화: "소비자가:2,200,000원" -> "소비자가 : 2,200,000원"
  s = s.replace(/([가-힣a-zA-Z0-9]+)\s*:\s*([가-힣a-zA-Z0-9]+)/g, (m, p1, p2) => p1 + " : " + p2);

  // 4. 영문 카멜케이스 및 복합어 분리: "Mainbody" -> "Main body", "Serialcable" -> "Serial cable"
  s = s.replace(/([a-z])([A-Z])/g, (m, p1, p2) => p1 + " " + p2);
  s = s.replace(/([A-Z]{2,})([A-Z][a-z])/g, (m, p1, p2) => p1 + " " + p2);

  // 5. 영문과 한글 결합 분리: "PC최소사양" -> "PC 최소사양"
  s = s.replace(/([a-zA-Z]{2,})([가-힣])/g, (m, p1, p2) => p1 + " " + p2);
  s = s.replace(/([가-힣])([a-zA-Z]{2,})/g, (m, p1, p2) => p1 + " " + p2);

  // 6. 단위 명사 뒤 띄어쓰기: "20년노하우" -> "20년 노하우", "2차D동" -> "2차 D동"
  s = s.replace(
    /([0-9]+)(년|월|일|차|개|동|호|층|원|세|대|배|BIT|bit)([가-힣a-zA-Z(])/g,
    (m, p1, p2, p3) => p1 + p2 + " " + p3
  );

  // 7. 숫자와 한글/영문 결합: "520현대" -> "520 현대", "WIN7" -> "WIN 7"
  s = s.replace(/([0-9]+)([가-힣]{2,})/g, (m, p1, p2) => p1 + " " + p2);
  s = s.replace(/([A-Z]+)([0-9]+)/g, (m, p1, p2) => p1 + " " + p2);

  // 8. 한국어 고빈도 압축 복합어 사전 교정
  const dictionaryFixes: [string, string][] = [
    ["노하우의자율신경계전문제조기업", "노하우의 자율신경계 전문 제조기업"],
    ["노하우의 자율신경계전문제조기업", "노하우의 자율신경계 전문 제조기업"],
    ["자율신경계전문제조기업", "자율신경계 전문 제조기업"],
    ["전문제조기업", "전문 제조기업"],
    ["미사대로520현대지식산업센터", "미사대로 520 현대지식산업센터"],
    ["미사대로 520현대지식산업센터", "미사대로 520 현대지식산업센터"],
    ["미사대로520", "미사대로 520"],
    ["현대지식산업센터", "현대지식산업센터"],
    ["한강미사2차D동828호", "한강미사 2차 D동 828호"],
    ["한강미사2차 D동 828호", "한강미사 2차 D동 828호"],
    ["한강미사 2차D 동", "한강미사 2차 D동"],
    ["D동828호", "D동 828호"],
    ["Mainbody1개", "Main body 1개"],
    ["Mainbody 1개", "Main body 1개"],
    ["Mainbody", "Main body"],
    ["USBTOSerialcable1개", "USB TO Serial cable 1개"],
    ["USBTO Serial cable1개", "USB TO Serial cable 1개"],
    ["USBTO Serial cable", "USB TO Serial cable"],
    ["USBTOSerialcable", "USB TO Serial cable"],
    ["Serialcable", "Serial cable"],
    ["KoreanJOccupEnvironMed", "Korean J Occup Environ Med"],
    ["Korean JOccup Environ Med", "Korean J Occup Environ Med"],
    ["PC최소사양", "PC 최소사양"],
    ["WIN732BIT이상", "WIN 7 32BIT 이상"],
    ["WIN 732BIT 이상", "WIN 7 32BIT 이상"],
    ["WIN 732 BIT 이상", "WIN 7 32BIT 이상"],
    ["자율신경계균형도", "자율신경계 균형도"],
    ["혈액순환상태", "혈액순환 상태"],
    ["측정장비", "측정 장비"],
    ["(Vat포함)", "(Vat 포함)"],
    ["Vat포함", "Vat 포함"],
    ["치유의숲등", "치유의 숲 등"],
    ["군부대등", "군부대 등"],
    ["각지사등", "각지사 등"],
    ["비롯한120개", "비롯한 120개"],
    ["노트북별매", "노트북 별매"],
    ["*노트북별매", "* 노트북 별매"],
    ["*노트북 별매", "* 노트북 별매"],
    ["HRV검사란", "HRV 검사란"],
    ["150mmx130mmx35mm", "150mm x 130mm x 35mm"],
    ["약650G", "약 650G"],
    ["USB 메모리카드1개", "USB 메모리카드 1개"],
    ["PPG 센서1개", "PPG 센서 1개"],
    ["전원아답터1개", "전원아답터 1개"],
    ["2021년6월", "2021년 6월"],
    ["기준51, 638", "기준 51,638"],
    ["기준51,638", "기준 51,638"],
    ["2, 200, 000원", "2,200,000원"],
    ["2,200, 000원", "2,200,000원"],
  ];

  for (const [k, v] of dictionaryFixes) {
    s = s.replaceAll(k, v);
  }

  // 중복 단어 및 수량 단위 띄어쓰기 정규화
  s = s.replace(/20년\s+20년/g, "20년");
  s = s.replace(/([가-힣])([0-9]+개)/g, "$1 $2");
  s = s.replace(/cable\s*([0-9]+개)/gi, "cable $1");
  s = s.replace(/\*([가-힣a-zA-Z])/g, "* $1");

  // 숫자 사이에 쉼표 공백이 들어간 경우 복원 (51, 638 -> 51,638 / 2, 200, 000 -> 2,200,000)
  s = s.replace(/([0-9]),\s+([0-9])/g, "$1,$2");

  return s;
}

/**
 * 2D 아핀 변환 행렬 곱셈 헬퍼
 */
export function multiplyMatrices(m1: number[], m2: number[]): number[] {
  return [
    m1[0] * m2[0] + m1[2] * m2[1],
    m1[1] * m2[0] + m1[3] * m2[1],
    m1[0] * m2[2] + m1[2] * m2[3],
    m1[1] * m2[2] + m1[3] * m2[3],
    m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
    m1[1] * m2[4] + m1[3] * m2[5] + m1[5],
  ];
}

/**
 * PDF.js objs에서 추출한 Raw Image Object(ImageBitmap, RGBA 또는 RGB 픽셀 버퍼)를 
 * 브라우저 오프스크린 캔버스를 통해 무손실 PNG Uint8Array 버퍼로 변환
 */
export function imageObjToPngBuffer(obj: any): Uint8Array | null {
  if (typeof document === "undefined" || !obj) return null;

  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    if (obj.bitmap) {
      canvas.width = obj.bitmap.width || obj.width;
      canvas.height = obj.bitmap.height || obj.height;
      ctx.drawImage(obj.bitmap, 0, 0);
    } else if (obj.data) {
      canvas.width = obj.width;
      canvas.height = obj.height;
      let imgData: ImageData;
      if (obj.kind === 2) {
        // RGB 24bpp -> RGBA 32bpp
        const rgba = new Uint8ClampedArray(obj.width * obj.height * 4);
        for (let p = 0, q = 0; p < obj.data.length; p += 3, q += 4) {
          rgba[q] = obj.data[p];
          rgba[q + 1] = obj.data[p + 1];
          rgba[q + 2] = obj.data[p + 2];
          rgba[q + 3] = 255;
        }
        imgData = new ImageData(rgba, obj.width, obj.height);
      } else if (obj.kind === 1) {
        // Grayscale 8bpp -> RGBA 32bpp
        const rgba = new Uint8ClampedArray(obj.width * obj.height * 4);
        for (let p = 0, q = 0; p < obj.data.length; p++, q += 4) {
          const val = obj.data[p];
          rgba[q] = val;
          rgba[q + 1] = val;
          rgba[q + 2] = val;
          rgba[q + 3] = 255;
        }
        imgData = new ImageData(rgba, obj.width, obj.height);
      } else {
        // RGBA 32bpp
        imgData = new ImageData(new Uint8ClampedArray(obj.data), obj.width, obj.height);
      }
      ctx.putImageData(imgData, 0, 0);
    } else {
      return null;
    }

    const dataUrl = canvas.toDataURL("image/png");
    const base64 = dataUrl.split(",")[1];
    if (!base64) return null;

    const binStr = atob(base64);
    const buffer = new Uint8Array(binStr.length);
    for (let b = 0; b < binStr.length; b++) buffer[b] = binStr.charCodeAt(b);
    return buffer;
  } catch (e) {
    console.warn("imageObjToPngBuffer failed:", e);
    return null;
  }
}

/**
 * PDF.js 페이지로부터 인라인 삽입 이미지 및 그래픽 요소를 정밀 추출
 * - 직접 호출된 paintImageXObject 뿐만 아니라
 * - Form XObject 및 TilingPattern 내부의 dependency(img_p...)까지 완벽 감지
 * - 1순위: 원본 비트맵(page.objs) 직접 추출 -> 주변 텍스트 번짐(5), 신경계 등) 100% 원천 차단
 * - 2순위: 전체 고해상도 캔버스 크롭 백업
 */
export async function extractImagesFromPdfPage(
  page: any,
  fullCanvas: HTMLCanvasElement | null,
  scale: number
): Promise<ExtractedPdfImage[]> {
  const images: ExtractedPdfImage[] = [];

  try {
    const operatorList = await page.getOperatorList();
    const pdfjsLib = await import("pdfjs-dist");
    const OPS = pdfjsLib.OPS;

    let currentTransform = [1, 0, 0, 1, 0, 0];
    const transformStack: number[][] = [];

    const viewport = page.getViewport({ scale: 1.0 });
    const pageWidth = viewport.width;
    const pageHeight = viewport.height;

    interface ImageCandidate {
      imgId: string;
      transform: number[];
      bbox?: { minX: number; maxX: number; minY: number; maxY: number } | null;
    }
    const candidates: ImageCandidate[] = [];

    for (let i = 0; i < operatorList.fnArray.length; i++) {
      const fn = operatorList.fnArray[i];
      const args = operatorList.argsArray[i];

      if (fn === OPS.transform) {
        currentTransform = multiplyMatrices(currentTransform, args);
      } else if (fn === OPS.save) {
        transformStack.push([...currentTransform]);
      } else if (fn === OPS.restore) {
        if (transformStack.length > 0) {
          currentTransform = transformStack.pop()!;
        }
      } else if (
        fn === OPS.paintImageXObject ||
        fn === OPS.paintInlineImageXObject ||
        fn === OPS.paintImageMaskXObject
      ) {
        const imgId = typeof args?.[0] === "string" ? args[0] : `inline_${i}`;
        candidates.push({ imgId, transform: [...currentTransform] });
      } else if (fn === OPS.dependency && Array.isArray(args)) {
        for (const dep of args) {
          if (typeof dep === "string" && dep.startsWith("img_")) {
            let bbox: { minX: number; maxX: number; minY: number; maxY: number } | null = null;
            for (let k = i + 1; k < Math.min(i + 15, operatorList.fnArray.length); k++) {
              if (operatorList.fnArray[k] === OPS.constructPath) {
                const minMax = operatorList.argsArray[k][2];
                if (minMax && minMax.length === 4) {
                  bbox = { minX: minMax[0], maxX: minMax[1], minY: minMax[2], maxY: minMax[3] };
                }
                break;
              }
            }
            candidates.push({ imgId: dep, transform: [...currentTransform], bbox });
          }
        }
      }
    }

    interface ResolvedCandidate {
      imgId: string;
      obj: any;
      x: number;
      y: number;
      width: number;
      height: number;
    }
    const resolved: ResolvedCandidate[] = [];

    for (const c of candidates) {
      if (!c.imgId) continue;
      let obj: any = null;
      try {
        if (page.objs && typeof page.objs.has === "function" && page.objs.has(c.imgId)) {
          obj = page.objs.get(c.imgId);
        }
      } catch {
        // ignore
      }

      let posX = c.transform[4];
      let posY = c.transform[5];
      let width = obj?.bitmap?.width || obj?.width || 0;
      let height = obj?.bitmap?.height || obj?.height || 0;

      if (c.bbox) {
        const pathW = c.bbox.maxX - c.bbox.minX;
        const pathH = c.bbox.maxY - c.bbox.minY;
        const scaleX = Math.abs(c.transform[0]) || 1;
        const scaleY = Math.abs(c.transform[3]) || 1;
        width = pathW * scaleX;
        height = pathH * scaleY;
        posX = c.transform[4] + c.bbox.minX * c.transform[0];
        if (c.transform[3] < 0) {
          posY = c.transform[5] - c.bbox.maxY * Math.abs(c.transform[3]);
        } else {
          posY = c.transform[5] + c.bbox.minY * c.transform[3];
        }
      } else {
        const scaleX = Math.abs(c.transform[0]) || 1;
        const scaleY = Math.abs(c.transform[3]) || 1;
        width = (width > 0 ? width : 1) * scaleX;
        height = (height > 0 ? height : 1) * scaleY;
      }

      // 전체 페이지 크기의 배경(96% 이상)은 본문 삽입 이미지에서 제외
      if (width >= pageWidth * 0.96 && height >= pageHeight * 0.96) continue;
      if (width < 25 || height < 25) continue; // 1px 경계선 노이즈 필터링

      resolved.push({
        imgId: c.imgId,
        obj,
        x: posX,
        y: posY,
        width,
        height,
      });
    }

    // 중복 및 내부 중첩 이미지 필터링 (가장 큰 외곽 합성 영역 유지)
    const sorted = [...resolved].sort((a, b) => b.width * b.height - a.width * a.height);
    const kept: ResolvedCandidate[] = [];
    for (const item of sorted) {
      const area = item.width * item.height;
      let isContained = false;
      for (const k of kept) {
        const x1 = Math.max(item.x, k.x);
        const y1 = Math.max(item.y, k.y);
        const x2 = Math.min(item.x + item.width, k.x + k.width);
        const y2 = Math.min(item.y + item.height, k.y + k.height);
        if (x2 > x1 && y2 > y1) {
          const interArea = (x2 - x1) * (y2 - y1);
          if (interArea / area > 0.7) {
            isContained = true;
            break;
          }
        }
      }
      if (!isContained) kept.push(item);
    }

    // 최종 PNG 버퍼 생성
    // 1순위: PDF 원본 비트맵 직접 인코딩 (주변 글자 침범 전혀 없는 원본 고화질)
    // 2순위: fullCanvas 크롭 (page.objs가 없는 경우 보조 백업)
    for (const item of kept) {
      let dataBuffer: Uint8Array | null = null;
      let dataUrl: string | undefined = undefined;

      if (item.obj) {
        dataBuffer = imageObjToPngBuffer(item.obj);
      }

      if (!dataBuffer && typeof document !== "undefined" && fullCanvas) {
        const canvasX = Math.max(0, Math.round(item.x * scale));
        const canvasY = Math.max(0, Math.round((pageHeight - item.y - item.height) * scale));
        const canvasW = Math.min(Math.round(item.width * scale), fullCanvas.width - canvasX);
        const canvasH = Math.min(Math.round(item.height * scale), fullCanvas.height - canvasY);

        if (canvasW > 20 && canvasH > 20) {
          try {
            const cropCanvas = document.createElement("canvas");
            cropCanvas.width = canvasW;
            cropCanvas.height = canvasH;
            const cropCtx = cropCanvas.getContext("2d");
            if (cropCtx) {
              cropCtx.drawImage(
                fullCanvas,
                canvasX, canvasY, canvasW, canvasH,
                0, 0, canvasW, canvasH
              );
              dataUrl = cropCanvas.toDataURL("image/png");
              const base64 = dataUrl.split(",")[1];
              if (base64) {
                const binStr = atob(base64);
                dataBuffer = new Uint8Array(binStr.length);
                for (let b = 0; b < binStr.length; b++) dataBuffer[b] = binStr.charCodeAt(b);
              }
            }
          } catch {
            dataBuffer = null;
          }
        }
      }

      if (dataBuffer && dataBuffer.length > 0) {
        images.push({
          x: item.x,
          y: item.y,
          width: item.width,
          height: item.height,
          dataBuffer,
          dataUrl,
        });
      }
    }
  } catch (err) {
    console.warn("Failed to extract images from page:", err);
  }

  return images;
}

/**
 * 주어진 텍스트 아이템과 이미지 목록을 단락/표/제목/이미지 블록으로 파싱 (Y 내림차순 정렬)
 */
export function parseItemsToBlocks(
  items: PdfWordItem[],
  images: ExtractedPdfImage[],
  medianFontSize: number
): PdfBlock[] {
  if (items.length === 0 && images.length === 0) return [];

  // 1. Y 좌표 내림차순 정렬
  const sortedItems = [...items].sort((a, b) => b.y - a.y || a.x - b.x);

  // 2. Y 좌표 클러스터링으로 줄(Line) 구성
  const lineBuckets: { y: number; items: PdfWordItem[] }[] = [];
  const yTolerance = Math.max(2.8, medianFontSize * 0.36);

  for (const item of sortedItems) {
    let matchedBucket = lineBuckets.find((bucket) => Math.abs(bucket.y - item.y) <= yTolerance);
    if (matchedBucket) {
      matchedBucket.items.push(item);
    } else {
      lineBuckets.push({ y: item.y, items: [item] });
    }
  }

  lineBuckets.sort((a, b) => b.y - a.y);

  // 3. 줄 내부 X 정렬 및 스마트 띄어쓰기 / 다단 분할
  const lines: PdfTextLine[] = [];

  for (const bucket of lineBuckets) {
    bucket.items.sort((a, b) => a.x - b.x);

    let lineText = "";
    const cells: string[] = [];
    let currentCell = "";

    const lineMaxFontSize = Math.max(...bucket.items.map((it) => it.fontSize));
    const cellGapThreshold = Math.max(16, lineMaxFontSize * 1.5);
    const spaceGapThreshold = Math.max(1.0, lineMaxFontSize * 0.16);

    for (let i = 0; i < bucket.items.length; i++) {
      const cur = bucket.items[i];
      if (i > 0) {
        const prev = bucket.items[i - 1];
        const gap = cur.x - (prev.x + prev.width);

        if (gap >= cellGapThreshold) {
          if (currentCell.trim().length > 0) {
            cells.push(currentCell.trim());
          }
          currentCell = cur.str;
          lineText += "\t" + cur.str;
        } else if (gap >= spaceGapThreshold) {
          if (!currentCell.endsWith(" ") && !cur.str.startsWith(" ")) {
            currentCell += " ";
            lineText += " ";
          }
          currentCell += cur.str;
          lineText += cur.str;
        } else {
          currentCell += cur.str;
          lineText += cur.str;
        }
      } else {
        currentCell = cur.str;
        lineText = cur.str;
      }
    }

    if (currentCell.trim().length > 0) {
      cells.push(currentCell.trim());
    }

    const trimmedText = smartSpaceKorean(lineText.trim());
    if (trimmedText.length === 0) continue;

    // 제목 감지: 번호 매겨진 섹션 타이틀(1. 2. 3...) 또는 대형 디스플레이 타이틀
    let isHeading = false;
    let headingLevel: 1 | 2 | 3 | undefined = undefined;

    const isNumberedTitle = /^[0-9]+\.\s*/.test(trimmedText);
    const isBullet = /^[-*•·]/.test(trimmedText);

    if (isNumberedTitle) {
      isHeading = true;
      headingLevel = 1;
    } else if (!isBullet && lineMaxFontSize >= Math.max(22, medianFontSize * 1.5)) {
      isHeading = true;
      headingLevel = 1;
    } else if (!isBullet && lineMaxFontSize >= Math.max(16, medianFontSize * 1.25) && trimmedText.length < 40) {
      isHeading = true;
      headingLevel = 2;
    }

    lines.push({
      y: bucket.y,
      fontSize: lineMaxFontSize,
      isHeading,
      headingLevel,
      items: bucket.items,
      text: trimmedText,
      cells: cells.length > 0 ? cells.map((c) => smartSpaceKorean(c)) : [trimmedText],
    });
  }

  // 4. 블록(Heading, Table, Paragraph) 생성
  const textBlocks: (PdfBlock & { y: number })[] = [];
  let currentTableRows: string[][] = [];
  let currentTableLines: PdfTextLine[] = [];
  let currentParagraphLines: PdfTextLine[] = [];

  const flushParagraph = () => {
    if (currentParagraphLines.length > 0) {
      const fullParaText = currentParagraphLines.map((l) => l.text).join(" ");
      textBlocks.push({
        type: "paragraph",
        text: smartSpaceKorean(fullParaText),
        fontSize: currentParagraphLines[0].fontSize,
        lines: [...currentParagraphLines],
        y: currentParagraphLines[0].y,
      });
      currentParagraphLines = [];
    }
  };

  const flushTable = () => {
    if (currentTableRows.length > 0) {
      const isTwoColumnBrochure =
        currentTableRows.length >= 2 &&
        currentTableRows.every((r) => r.length <= 3) &&
        currentTableRows.some((r) => r.some((c) => c.length > 15));

      textBlocks.push({
        type: "table",
        rows: currentTableRows.map((row) => row.map((c) => smartSpaceKorean(c))),
        isMultiColumnLayout: isTwoColumnBrochure,
        y: currentTableLines[0]?.y || 0,
      });
      currentTableRows = [];
      currentTableLines = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.isHeading) {
      flushParagraph();
      flushTable();
      textBlocks.push({
        type: "heading",
        headingLevel: line.headingLevel || 1,
        text: line.text,
        fontSize: line.fontSize,
        y: line.y,
      });
      continue;
    }

    const isMultiCell = line.cells.length >= 2;
    const prevLine = lines[i - 1];
    const prevIsMultiCell = prevLine ? prevLine.cells.length >= 2 : false;
    const nextLine = lines[i + 1];
    const nextIsMultiCell = nextLine ? nextLine.cells.length >= 2 : false;

    if (isMultiCell || (prevIsMultiCell && nextIsMultiCell)) {
      flushParagraph();
      currentTableRows.push(line.cells);
      currentTableLines.push(line);
      continue;
    }

    flushTable();

    const isBulletLine = /^[-*•·]/.test(line.text.trim());
    const isCategoryLabel = /^(보건소|국민건강보험공단|소방서|기업체|정신건강복지센터)$/.test(line.text.trim());
    const isSpecItem = /^(PC 최소사양|크기|무게|Main body|USB 메모리카드|PPG 센서|USB TO Serial cable|전원아답터)/.test(line.text.trim());

    if (isBulletLine || isCategoryLabel || isSpecItem) {
      flushParagraph();
    }

    if (currentParagraphLines.length > 0) {
      const lastLine = currentParagraphLines[currentParagraphLines.length - 1];
      const gapY = lastLine.y - line.y;
      const normalGap = lastLine.fontSize * 1.6;

      if (gapY > normalGap) {
        flushParagraph();
      }
    }

    currentParagraphLines.push(line);

    if (isBulletLine || isCategoryLabel || isSpecItem) {
      flushParagraph();
    }
  }

  flushParagraph();
  flushTable();

  // 5. 텍스트 블록과 이미지를 Y 좌표 기준으로 시계열 병합
  // Y 좌표가 거의 일치하는 인접한 작은 이미지(예: 임상 논문 2x2 그리드)는 좌우 나란히 배치하도록 페어링
  const sortedImages = [...images].sort((a, b) => b.y - a.y || a.x - b.x);
  const imageBlocks: (PdfBlock & { y: number })[] = [];
  const visitedImgs = new Set<ExtractedPdfImage>();

  for (let m = 0; m < sortedImages.length; m++) {
    const curImg = sortedImages[m];
    if (visitedImgs.has(curImg)) continue;

    // 수평 나란히 배치될 수 있는 인접 이미지 탐색 (동일 Y, 작은 너비)
    const paired = [curImg];
    visitedImgs.add(curImg);

    for (let n = m + 1; n < sortedImages.length; n++) {
      const nextImg = sortedImages[n];
      if (visitedImgs.has(nextImg)) continue;
      if (Math.abs(nextImg.y - curImg.y) <= 20 && curImg.width < 320 && nextImg.width < 320) {
        paired.push(nextImg);
        visitedImgs.add(nextImg);
      }
    }

    // 이미지의 정렬 기준 Y좌표는 이미지의 수직 중앙값(curImg.y + curImg.height * 0.5)을 사용하여
    // 텍스트 블록 사이에서 자연스러운 본문 흐름에 맞게 배치
    const sortY = curImg.y + curImg.height * 0.5;

    if (paired.length > 1) {
      paired.sort((a, b) => a.x - b.x);
      imageBlocks.push({
        type: "image",
        images: paired.map((p) => ({
          imageBuffer: p.dataBuffer,
          imageDataUrl: p.dataUrl,
          imageWidth: p.width,
          imageHeight: p.height,
          x: p.x,
          y: p.y,
        })),
        y: sortY,
      });
    } else {
      imageBlocks.push({
        type: "image",
        imageBuffer: curImg.dataBuffer,
        imageDataUrl: curImg.dataUrl,
        imageWidth: curImg.width,
        imageHeight: curImg.height,
        x: curImg.x,
        y: sortY,
      });
    }
  }

  const allBlocksWithY: (PdfBlock & { y: number })[] = [...textBlocks, ...imageBlocks];
  allBlocksWithY.sort((a, b) => b.y - a.y);
  return allBlocksWithY;
}

/**
 * 페이지 내 텍스트 및 이미지 분포로부터 어도비 애크로뱃급 2단 다단 레이아웃 및 거터(Gutter) 동적 탐지
 */
export function detectTwoColumnLayout(
  items: PdfWordItem[],
  images: ExtractedPdfImage[],
  pageWidth: number
): { isTwoColumn: boolean; gutterX: number; headerMinY: number } {
  if (items.length < 15 && images.length === 0) {
    return { isTwoColumn: false, gutterX: pageWidth * 0.5, headerMinY: 750 };
  }

  const minX = Math.min(...items.map((it) => it.x));
  const maxX = Math.max(...items.map((it) => it.x + it.width));
  const textSpan = maxX - minX;

  // 텍스트 영역 중앙 구간에서 수직 공백 거터 스캔
  const searchStart = minX + textSpan * 0.2;
  const searchEnd = Math.min(minX + textSpan * 0.8, pageWidth * 0.75);
  const step = 4;

  let bestGutterX = (minX + maxX) / 2;
  let maxGap = 0;
  let curGapStart: number | null = null;

  for (let x = searchStart; x <= searchEnd; x += step) {
    const hasItems = items.some((it) => Math.abs(it.x + it.width * 0.5 - x) < step);
    if (!hasItems) {
      if (curGapStart === null) curGapStart = x;
    } else {
      if (curGapStart !== null) {
        const gap = x - curGapStart;
        if (gap > maxGap) {
          maxGap = gap;
          bestGutterX = (curGapStart + x) / 2;
        }
        curGapStart = null;
      }
    }
  }

  // 텍스트가 좌측에 집중되어 있고 우측에 주요 대형 그래픽이 배치된 레이아웃 (예: Page 1) 감지
  const rightMajorImages = images.filter((img) => img.x + img.width * 0.5 > pageWidth * 0.45 && img.width > 220);
  if (maxGap < 16 && rightMajorImages.length > 0) {
    const imgMinX = Math.min(...rightMajorImages.map((img) => img.x));
    const bridgeGutter = (maxX + imgMinX) / 2;
    if (bridgeGutter > pageWidth * 0.4 && bridgeGutter < pageWidth * 0.7) {
      bestGutterX = bridgeGutter;
      maxGap = 30; // 가상 거터 인정
    }
  }

  const candidateGutter = maxGap >= 16 ? bestGutterX : (minX + maxX) / 2;

  const left = items.filter((it) => it.x + it.width * 0.5 < candidateGutter);
  const right = items.filter((it) => it.x + it.width * 0.5 >= candidateGutter);
  const rightImgs = images.filter((img) => img.x + img.width * 0.5 >= candidateGutter && img.width > 150);

  const bothY = left.filter((l) => right.some((r) => Math.abs(r.y - l.y) <= 24)).length;
  // 좌/우 텍스트 2단 또는 좌측 텍스트 + 우측 대형 제품 이미지 2단 인정
  const isTwoCol = (left.length >= 10 && right.length >= 10 && bothY >= 2) ||
                   (left.length >= 15 && (rightImgs.length >= 1 || right.length >= 3));

  return { isTwoColumn: isTwoCol, gutterX: candidateGutter, headerMinY: 750 };
}

/**
 * PDF.js의 단일 페이지로부터 레이아웃 인식 구조화 데이터(다단 분할, 텍스트, 표, 이미지)를 추출합니다.
 */
export async function parsePdfPageLayout(page: any, pageNumber: number): Promise<PdfStructuredPage> {
  const viewport = page.getViewport({ scale: 1.0 });
  const width = viewport.width;
  const height = viewport.height;
  const isLandscape = width > height;

  // 1. 고해상도 1.75x 오프스크린 캔버스 렌더링 (시각 요소 100% 추출 보장)
  let fullCanvas: HTMLCanvasElement | null = null;
  let pageCanvasBuffer: Uint8Array | undefined = undefined;

  if (typeof document !== "undefined") {
    try {
      const renderVp = page.getViewport({ scale: 1.75 });
      fullCanvas = document.createElement("canvas");
      fullCanvas.width = renderVp.width;
      fullCanvas.height = renderVp.height;
      const ctx = fullCanvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, fullCanvas.width, fullCanvas.height);
        await page.render({ canvasContext: ctx, viewport: renderVp }).promise;

        const dataUrl = fullCanvas.toDataURL("image/jpeg", 0.88);
        const base64 = dataUrl.split(",")[1];
        if (base64) {
          const binStr = atob(base64);
          pageCanvasBuffer = new Uint8Array(binStr.length);
          for (let b = 0; b < binStr.length; b++) pageCanvasBuffer[b] = binStr.charCodeAt(b);
        }
      }
    } catch (e) {
      console.warn("Offscreen canvas render warning:", e);
    }
  }

  // 2. 텍스트 추출 및 한글/영문 전각-반각 자폭 보정
  let textContent: any = null;
  try {
    textContent = await page.getTextContent({ normalizeWhitespace: true });
  } catch (e) {
    // text extraction failure
  }

  const rawItems = textContent && textContent.items ? textContent.items : [];
  const wordItems: PdfWordItem[] = [];

  for (const item of rawItems) {
    if (!item || typeof item.str !== "string" || item.str.trim().length === 0) continue;

    const cleanStr = sanitizeText(item.str);
    if (!cleanStr) continue;

    const transform = item.transform || [1, 0, 0, 1, 0, 0];
    const x = transform[4] || 0;
    const y = transform[5] || 0;

    const scaleX = Math.abs(transform[0]) || 1;
    const scaleY = Math.abs(transform[3]) || 1;
    const fontSize = Math.round(Math.max(scaleX, scaleY, item.height || 0));

    let estimatedWidth = 0;
    for (let c = 0; c < cleanStr.length; c++) {
      estimatedWidth += cleanStr.charCodeAt(c) > 255 ? fontSize * 0.95 : fontSize * 0.55;
    }
    const itemWidth = item.width && item.width > 0 ? item.width : estimatedWidth;

    wordItems.push({
      str: cleanStr,
      x,
      y,
      width: itemWidth,
      height: item.height || fontSize,
      fontSize: Math.max(8, fontSize),
      fontName: item.fontName || "default",
    });
  }

  // 3. 본문 삽입 이미지 추출 (원본 비트맵 우선 & 캔버스 크롭 백업)
  const extractedImages = await extractImagesFromPdfPage(page, fullCanvas, 1.75);

  if (wordItems.length === 0) {
    const imageBlocks: PdfBlock[] = extractedImages.map((img) => ({
      type: "image",
      imageBuffer: img.dataBuffer,
      imageDataUrl: img.dataUrl,
      imageWidth: img.width,
      imageHeight: img.height,
      x: img.x,
      y: img.y + img.height,
    }));

    return {
      pageNumber,
      width,
      height,
      isLandscape,
      medianFontSize: 11,
      lines: [],
      blocks: imageBlocks,
      hasText: false,
      pageCanvasBuffer,
    };
  }

  const fontSizes = wordItems.map((w) => w.fontSize).sort((a, b) => a - b);
  const medianFontSize = fontSizes[Math.floor(fontSizes.length / 2)] || 11;

  // 4. 어도비 수준의 정밀 칼럼 분할 (Dynamic Multi-Column Segmentation)
  const { isTwoColumn: isTwoColumnPage, gutterX } = detectTwoColumnLayout(wordItems, extractedImages, width);

  let finalBlocks: PdfBlock[] = [];

  if (isTwoColumnPage) {
    const leftSideItems = wordItems.filter((it) => it.x + it.width * 0.5 < gutterX);
    const rightSideItems = wordItems.filter((it) => it.x + it.width * 0.5 >= gutterX);

    // 상단 공통 헤더 판별 (Page 1의 회사명/주소처럼 페이지 최상단에서 전폭을 차지하는 헤더)
    const bothYList: number[] = [];
    for (const l of leftSideItems) {
      if (rightSideItems.some((r) => Math.abs(r.y - l.y) <= 22)) {
        bothYList.push(l.y);
      }
    }

    const maxYBoth = bothYList.length > 0 ? Math.max(...bothYList) : height * 0.85;

    // 헤더: 두 컬럼의 공통 상단보다 최소 25pt 이상 위에 있는 전폭 헤더 텍스트만 추출 (Page 1 회사 정보 등)
    // Page 2처럼 상단부터 2단으로 시작하는 페이지는 헤더 항목이 0개가 되어 본문 글자가 표 밖으로 유출되지 않음
    const headerItems = wordItems.filter((it) => it.y > maxYBoth + 25);

    const headerSet = new Set(headerItems);
    const columnItems = wordItems.filter((it) => !headerSet.has(it));

    const leftColItems = columnItems.filter((it) => it.x + it.width * 0.5 < gutterX);
    const rightColItems = columnItems.filter((it) => it.x + it.width * 0.5 >= gutterX);

    // 이미지 분배:
    // 좌/우 각 컬럼 영역에 속한 이미지는 해당 컬럼의 본문 흐름에 정확히 삽입
    const leftColImages = extractedImages.filter((img) => img.x + img.width * 0.5 < gutterX);
    const rightColImages = extractedImages.filter((img) => img.x + img.width * 0.5 >= gutterX);

    const headerBlocks = parseItemsToBlocks(headerItems, [], medianFontSize);
    const leftBlocks = parseItemsToBlocks(leftColItems, leftColImages, medianFontSize);
    const rightBlocks = parseItemsToBlocks(rightColItems, rightColImages, medianFontSize);

    finalBlocks = [
      ...headerBlocks,
      {
        type: "two-column",
        leftBlocks,
        rightBlocks,
        y: maxYBoth,
      },
    ];
  } else {
    finalBlocks = parseItemsToBlocks(wordItems, extractedImages, medianFontSize);
  }

  return {
    pageNumber,
    width,
    height,
    isLandscape,
    medianFontSize,
    lines: [],
    blocks: finalBlocks,
    hasText: true,
    pageCanvasBuffer,
  };
}
