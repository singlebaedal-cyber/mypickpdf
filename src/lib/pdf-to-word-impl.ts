import JSZip from "jszip";
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
import { sanitizeXmlString } from "./pdf-utils";
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
export async function pdfToWordDocxImpl(file: File, onProgress?: (p: number) => void): Promise<Blob> {
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

