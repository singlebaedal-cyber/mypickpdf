import { PDFDocument } from "pdf-lib";
import { Document, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, HeadingLevel, Packer } from "docx";

export interface TranslatedPage {
  pageNumber: number;
  originalText: string;
  translatedText: string;
}

export interface TranslationMeta {
  sourceLang: string;
  targetLang: string;
  sourceLangLabel: string;
  targetLangLabel: string;
  filename: string;
}

/**
 * 1. PDF 텍스트 추출 (pdfjs-dist 활용)
 * - 줄바꿈 및 문단 구조를 최대한 보존하여 번역 엔진에 전달
 */
export async function extractPdfPages(
  file: File,
  onProgress?: (progress: number, message: string) => void
): Promise<{ pageNumber: number; text: string }[]> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdf.numPages;
  const extractedPages: { pageNumber: number; text: string }[] = [];

  for (let i = 1; i <= numPages; i++) {
    if (onProgress) {
      onProgress(
        Math.round((i / numPages) * 30),
        `PDF 텍스트 추출 중 (${i} / ${numPages} 페이지)...`
      );
    }

    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    
    // Y축 좌표 기반으로 같은 줄과 새 문단을 감지하여 텍스트 복원
    const items = textContent.items as any[];
    if (items.length === 0) {
      extractedPages.push({
        pageNumber: i,
        text: "[이 페이지에는 텍스트가 없거나 이미지/스캔 문서입니다]",
      });
      continue;
    }

    let pageLines: string[] = [];
    let currentLine = "";
    let lastY: number | null = null;

    for (const item of items) {
      const text = item.str;
      if (!text || text.trim() === "") continue;

      const currentY = item.transform ? Math.round(item.transform[5]) : null;

      if (lastY !== null && currentY !== null && Math.abs(currentY - lastY) > 8) {
        // 줄바꿈 발생
        if (currentLine.trim()) {
          pageLines.push(currentLine.trim());
        }
        currentLine = text;
      } else {
        // 같은 줄
        currentLine += (currentLine ? " " : "") + text;
      }
      lastY = currentY;
    }

    if (currentLine.trim()) {
      pageLines.push(currentLine.trim());
    }

    const fullPageText = pageLines.join("\n\n");
    extractedPages.push({
      pageNumber: i,
      text: fullPageText.trim() || "[추출 가능한 텍스트가 없습니다]",
    });
  }

  return extractedPages;
}

/**
 * 2. 페이지별 번역 API 호출 (/api/translate)
 */
export async function translatePdfPages(
  pages: { pageNumber: number; text: string }[],
  sourceLang: string,
  targetLang: string,
  onProgress?: (progress: number, message: string) => void
): Promise<TranslatedPage[]> {
  const total = pages.length;
  const results: TranslatedPage[] = [];

  for (let i = 0; i < total; i++) {
    const p = pages[i];
    const progressPercent = 30 + Math.round(((i + 1) / total) * 50);

    if (onProgress) {
      onProgress(
        progressPercent,
        `AI 실시간 번역 진행 중 (${i + 1} / ${total} 페이지)...`
      );
    }

    if (p.text.startsWith("[이 페이지") || p.text.startsWith("[추출 가능한")) {
      results.push({
        pageNumber: p.pageNumber,
        originalText: p.text,
        translatedText: p.text,
      });
      continue;
    }

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: p.text,
          sourceLang,
          targetLang,
        }),
      });

      if (!response.ok) {
        throw new Error(`번역 서버 응답 실패 (${response.status})`);
      }

      const data = await response.json();
      results.push({
        pageNumber: p.pageNumber,
        originalText: p.text,
        translatedText: data.translatedText || p.text,
      });
    } catch (err: any) {
      console.warn(`Page ${p.pageNumber} translation fallback:`, err);
      results.push({
        pageNumber: p.pageNumber,
        originalText: p.text,
        translatedText: `[번역 실패 - 원문 유지]\n${p.text}`,
      });
    }
  }

  return results;
}

/**
 * 텍스트 줄바꿈 계산 도우미 (Canvas 폰트 측정 기준)
 */
function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const lines: string[] = [];
  const paragraphs = text.split("\n");

  for (const para of paragraphs) {
    if (!para.trim()) {
      lines.push("");
      continue;
    }

    const words = para.split(" ");
    let currentLine = "";

    for (const word of words) {
      const testLine = currentLine ? currentLine + " " + word : word;
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      // 긴 단어가 단독으로 maxWidth를 넘는 경우 글자 단위 강제 분할
      if (ctx.measureText(currentLine).width > maxWidth) {
        let sub = "";
        for (const char of currentLine) {
          if (ctx.measureText(sub + char).width > maxWidth) {
            lines.push(sub);
            sub = char;
          } else {
            sub += char;
          }
        }
        if (sub) lines.push(sub);
      } else {
        lines.push(currentLine);
      }
    }
  }

  return lines;
}

/**
 * 3. Canvas 기반 다국어 번역본 PDF 생성
 * - 모든 언어(한국어, 영어, 일본어, 중국어, 아랍어, 키릴 등)를 브라우저 네이티브 폰트로 깨짐 없이 렌더링
 * - A4 150 DPI 해상도 (1240 x 1754) 지원
 * - "translated" (단일 번역본) 또는 "comparison" (원문-번역 좌우 대조본) 지원
 */
export async function generateTranslatedPdf(
  pages: TranslatedPage[],
  mode: "translated" | "comparison",
  meta: TranslationMeta,
  onProgress?: (progress: number, message: string) => void
): Promise<Uint8Array> {
  if (typeof window === "undefined") {
    throw new Error("PDF 생성을 위해 브라우저 환경이 필요합니다.");
  }

  const canvasWidth = 1240;
  const canvasHeight = 1754;
  const marginTop = 120;
  const marginBottom = 100;
  const marginLeft = 90;
  const marginRight = 90;
  const contentWidth = canvasWidth - marginLeft - marginRight; // 1060px

  const canvas = document.createElement("canvas");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context를 생성할 수 없습니다.");

  const pdfDoc = await PDFDocument.create();
  const renderedImages: Uint8Array[] = [];

  const fontFamily = "'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans KR', 'Noto Sans', sans-serif";

  // 페이지 템플릿 헤더/푸터 그리기 함수
  const drawPageTemplate = (canvasPageNum: number, totalCanvasPages: number) => {
    // 배경
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // 상단 브랜딩 바
    ctx.fillStyle = "#2563eb";
    ctx.fillRect(0, 0, canvasWidth, 10);

    // 상단 헤더
    ctx.font = `bold 20px ${fontFamily}`;
    ctx.fillStyle = "#1e293b";
    ctx.fillText("PDFPick AI 번역 문서", marginLeft, 55);

    // 번역 정보 뱃지
    ctx.font = `600 16px ${fontFamily}`;
    ctx.fillStyle = "#64748b";
    const badgeText = `${meta.sourceLangLabel} ➔ ${meta.targetLangLabel}  |  ${meta.filename}`;
    ctx.fillText(badgeText, marginLeft, 82);

    // 구분선
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(marginLeft, 95);
    ctx.lineTo(canvasWidth - marginRight, 95);
    ctx.stroke();

    // 하단 푸터 & 페이지 번호
    ctx.strokeStyle = "#f1f5f9";
    ctx.beginPath();
    ctx.moveTo(marginLeft, canvasHeight - 60);
    ctx.lineTo(canvasWidth - marginRight, canvasHeight - 60);
    ctx.stroke();

    ctx.font = `500 15px ${fontFamily}`;
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("pdfpick.kr - 무료 & 보안 웹 PDF 솔루션", marginLeft, canvasHeight - 35);

    const pageStr = `${canvasPageNum}`;
    const pageMetrics = ctx.measureText(pageStr);
    ctx.fillText(pageStr, canvasWidth - marginRight - pageMetrics.width, canvasHeight - 35);
  };

  const snapshotCanvas = (): Uint8Array => {
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    const base64 = dataUrl.split(",")[1];
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  };

  let currentCanvasPage = 1;

  if (mode === "translated") {
    // === 단일 번역본 렌더링 ===
    let cursorY = marginTop;
    drawPageTemplate(currentCanvasPage, 1);

    for (let pIdx = 0; pIdx < pages.length; pIdx++) {
      const p = pages[pIdx];

      if (onProgress) {
        onProgress(
          80 + Math.round(((pIdx + 1) / pages.length) * 15),
          `번역본 PDF 페이지 구성 중 (${pIdx + 1} / ${pages.length})...`
        );
      }

      // 원본 PDF 페이지 구분 헤더
      if (cursorY + 60 > canvasHeight - marginBottom) {
        renderedImages.push(snapshotCanvas());
        currentCanvasPage++;
        drawPageTemplate(currentCanvasPage, 1);
        cursorY = marginTop;
      }

      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(marginLeft, cursorY - 10, contentWidth, 38);
      ctx.fillStyle = "#3b82f6";
      ctx.fillRect(marginLeft, cursorY - 10, 4, 38);

      ctx.font = `bold 18px ${fontFamily}`;
      ctx.fillStyle = "#1e40af";
      ctx.fillText(`[페이지 ${p.pageNumber}]`, marginLeft + 16, cursorY + 15);
      cursorY += 48;

      ctx.font = `normal 18px ${fontFamily}`;
      const lineHeight = 30;
      const lines = wrapLines(ctx, p.translatedText, contentWidth);

      for (const line of lines) {
        if (cursorY + lineHeight > canvasHeight - marginBottom) {
          renderedImages.push(snapshotCanvas());
          currentCanvasPage++;
          drawPageTemplate(currentCanvasPage, 1);
          cursorY = marginTop;
        }

        if (line === "") {
          cursorY += lineHeight * 0.6;
        } else {
          ctx.fillStyle = "#1e293b";
          ctx.fillText(line, marginLeft, cursorY);
          cursorY += lineHeight;
        }
      }

      cursorY += 25; // 다음 페이지 사이 여백
    }

    renderedImages.push(snapshotCanvas());
  } else {
    // === 좌우 원문/번역 대조본 렌더링 (Side-by-side Dual Comparison) ===
    const colWidth = (contentWidth - 40) / 2; // 510px
    const leftX = marginLeft;
    const rightX = marginLeft + colWidth + 40;
    const dividerX = marginLeft + colWidth + 20;

    let cursorY = marginTop;
    drawPageTemplate(currentCanvasPage, 1);

    for (let pIdx = 0; pIdx < pages.length; pIdx++) {
      const p = pages[pIdx];

      if (onProgress) {
        onProgress(
          80 + Math.round(((pIdx + 1) / pages.length) * 15),
          `원문/번역 대조본 구성 중 (${pIdx + 1} / ${pages.length})...`
        );
      }

      if (cursorY + 70 > canvasHeight - marginBottom) {
        renderedImages.push(snapshotCanvas());
        currentCanvasPage++;
        drawPageTemplate(currentCanvasPage, 1);
        cursorY = marginTop;
      }

      // 페이지 헤더 바
      ctx.fillStyle = "#f1f5f9";
      ctx.fillRect(marginLeft, cursorY - 10, contentWidth, 36);

      ctx.font = `bold 17px ${fontFamily}`;
      ctx.fillStyle = "#475569";
      ctx.fillText(`원문 [${meta.sourceLangLabel}] - P.${p.pageNumber}`, leftX + 10, cursorY + 14);

      ctx.fillStyle = "#2563eb";
      ctx.fillText(`번역문 [${meta.targetLangLabel}] - P.${p.pageNumber}`, rightX + 10, cursorY + 14);

      cursorY += 46;

      ctx.font = `normal 16px ${fontFamily}`;
      const lineHeight = 27;

      const origLines = wrapLines(ctx, p.originalText, colWidth);
      const transLines = wrapLines(ctx, p.translatedText, colWidth);
      const maxLinesCount = Math.max(origLines.length, transLines.length);

      for (let l = 0; l < maxLinesCount; l++) {
        if (cursorY + lineHeight > canvasHeight - marginBottom) {
          // 중앙 구분선 그리기
          ctx.strokeStyle = "#e2e8f0";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(dividerX, marginTop - 10);
          ctx.lineTo(dividerX, canvasHeight - marginBottom);
          ctx.stroke();

          renderedImages.push(snapshotCanvas());
          currentCanvasPage++;
          drawPageTemplate(currentCanvasPage, 1);
          cursorY = marginTop;
        }

        const oLine = origLines[l];
        const tLine = transLines[l];

        if (oLine) {
          ctx.fillStyle = "#475569";
          ctx.fillText(oLine, leftX, cursorY);
        }

        if (tLine) {
          ctx.fillStyle = "#0f172a";
          ctx.fillText(tLine, rightX, cursorY);
        }

        cursorY += lineHeight;
      }

      // 중앙 구분선 추가
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(dividerX, cursorY - maxLinesCount * lineHeight - 20);
      ctx.lineTo(dividerX, cursorY + 10);
      ctx.stroke();

      cursorY += 30; // 문단 간격
    }

    renderedImages.push(snapshotCanvas());
  }

  if (onProgress) onProgress(98, "PDF 파일 인코딩 및 완성 중...");

  // PDF 문서로 취합
  for (const imgBytes of renderedImages) {
    const embeddedImg = await pdfDoc.embedJpg(imgBytes);
    // A4 규격 (595.28 x 841.89 points)
    const pdfPage = pdfDoc.addPage([595.28, 841.89]);
    pdfPage.drawImage(embeddedImg, {
      x: 0,
      y: 0,
      width: 595.28,
      height: 841.89,
    });
  }

  const pdfBytes = await pdfDoc.save();
  if (onProgress) onProgress(100, "완료!");
  return pdfBytes;
}

/**
 * 4. Word (.docx) 다운로드 생성
 */
export async function generateTranslatedDocx(
  pages: TranslatedPage[],
  mode: "translated" | "comparison",
  meta: TranslationMeta
): Promise<Blob> {
  const children: any[] = [];

  // 문서 타이틀
  children.push(
    new Paragraph({
      text: `PDFPick 번역 문서 (${meta.sourceLangLabel} ➔ ${meta.targetLangLabel})`,
      heading: HeadingLevel.HEADING_1,
    }),
    new Paragraph({
      text: `원본 파일명: ${meta.filename} | 생성일시: ${new Date().toLocaleDateString()}`,
    }),
    new Paragraph({ text: "" })
  );

  if (mode === "translated") {
    for (const p of pages) {
      children.push(
        new Paragraph({
          text: `[ 페이지 ${p.pageNumber} ]`,
          heading: HeadingLevel.HEADING_2,
        })
      );
      const paragraphs = p.translatedText.split("\n\n");
      for (const para of paragraphs) {
        if (para.trim()) {
          children.push(
            new Paragraph({
              children: [new TextRun({ text: para.trim(), size: 24 })],
            })
          );
        }
      }
      children.push(new Paragraph({ text: "" }));
    }
  } else {
    // 2열 대조표 생성
    const rows = [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `원문 [${meta.sourceLangLabel}]`,
                    bold: true,
                    size: 24,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `번역문 [${meta.targetLangLabel}]`,
                    bold: true,
                    color: "2563EB",
                    size: 24,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ];

    for (const p of pages) {
      rows.push(
        new TableRow({
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  children: [new TextRun({ text: `[P.${p.pageNumber}]`, bold: true, size: 20 })],
                }),
                ...p.originalText.split("\n\n").map(
                  (text) =>
                    new Paragraph({
                      children: [new TextRun({ text, size: 22 })],
                    })
                ),
              ],
            }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  children: [new TextRun({ text: `[P.${p.pageNumber}]`, bold: true, color: "2563EB", size: 20 })],
                }),
                ...p.translatedText.split("\n\n").map(
                  (text) =>
                    new Paragraph({
                      children: [new TextRun({ text, size: 22 })],
                    })
                ),
              ],
            }),
          ],
        })
      );
    }

    const table = new Table({
      rows,
      width: { size: 100, type: WidthType.PERCENTAGE },
    });
    children.push(table);
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  return await Packer.toBlob(doc);
}

/**
 * 5. 텍스트 (.txt) 파일 다운로드 생성
 */
export function generateTranslatedTxt(
  pages: TranslatedPage[],
  mode: "translated" | "comparison",
  meta: TranslationMeta
): string {
  let content = `========================================================\n`;
  content += `PDFPick 번역 문서 (${meta.sourceLangLabel} ➔ ${meta.targetLangLabel})\n`;
  content += `원본 파일명: ${meta.filename}\n`;
  content += `========================================================\n\n`;

  if (mode === "translated") {
    for (const p of pages) {
      content += `[페이지 ${p.pageNumber}]\n`;
      content += `${p.translatedText}\n\n`;
    }
  } else {
    for (const p of pages) {
      content += `--------------------------------------------------------\n`;
      content += `[페이지 ${p.pageNumber}]\n`;
      content += `--- [원문 (${meta.sourceLangLabel})] ---\n${p.originalText}\n\n`;
      content += `--- [번역문 (${meta.targetLangLabel})] ---\n${p.translatedText}\n\n`;
    }
  }

  return content;
}
