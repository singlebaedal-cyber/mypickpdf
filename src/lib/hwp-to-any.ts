import { PDFDocument } from "pdf-lib";

export interface HwpTableCell {
  text: string;
  colAddr?: number;
  colSpan: number;
  rowSpan: number;
  isHeader?: boolean;
  align?: "left" | "center" | "right";
  bgColor?: string;
}

export interface HwpBlock {
  type: "paragraph" | "table" | "image" | "pageBreak";
  text?: string;
  fontSizePt?: number;
  bold?: boolean;
  align?: "left" | "center" | "right" | "justify";
  rows?: HwpTableCell[][];
  colCount?: number;
  imageDataUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
}

export interface HwpSection {
  index: number;
  landscape: boolean;
  blocks: HwpBlock[];
}

export interface ParsedHwpDocument {
  format: "hwpx" | "hwp";
  title: string;
  sections: HwpSection[];
  stats: {
    sectionCount: number;
    paragraphCount: number;
    tableCount: number;
    imageCount: number;
    charCount: number;
  };
  previewLines: string[];
}

export type HwpOutputFormat = "pdf" | "docx" | "xlsx" | "txt";

const KOREAN_FONT_STACK =
  '"Pretendard", "Malgun Gothic", "Apple SD Gothic Neo", "Noto Sans KR", "Nanum Gothic", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

function sanitizeXmlString(str: string): string {
  return (str || "").replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\uFFFE\uFFFF]/g, "");
}

function uint8ToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...Array.from(chunk));
  }
  return btoa(binary);
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

function guessImageMime(path: string): string {
  const lower = path.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".bmp")) return "image/bmp";
  if (lower.endsWith(".gif")) return "image/gif";
  if (lower.endsWith(".webp")) return "image/webp";
  return "image/png";
}

function getLocalName(el: Element): string {
  return el.localName || el.nodeName.split(":").pop() || "";
}

function getDirectChildrenByLocalName(parent: Element, localName: string): Element[] {
  const out: Element[] = [];
  for (let i = 0; i < parent.children.length; i++) {
    const child = parent.children[i];
    if (getLocalName(child) === localName) out.push(child);
  }
  return out;
}

function findFirstDescendantByLocalName(parent: Element, localName: string): Element | null {
  const queue: Element[] = Array.from(parent.children);
  while (queue.length > 0) {
    const cur = queue.shift()!;
    if (getLocalName(cur) === localName) return cur;
    for (let i = 0; i < cur.children.length; i++) {
      queue.push(cur.children[i]);
    }
  }
  return null;
}

/**
 * Extract pure text from a <hp:p> paragraph element WITHOUT descending into nested tables or headers/footers
 */
function extractParagraphTextOnly(pEl: Element): string {
  let out = "";
  const walk = (el: Element) => {
    const name = getLocalName(el);
    if (name === "tbl" || name === "header" || name === "footer" || name === "footNote" || name === "endNote") {
      return;
    }
    if (name === "t") {
      for (let i = 0; i < el.childNodes.length; i++) {
        const cn = el.childNodes[i];
        if (cn.nodeType === Node.TEXT_NODE) {
          out += cn.textContent || "";
        } else if (cn.nodeType === Node.ELEMENT_NODE) {
          const cname = getLocalName(cn as Element);
          if (cname === "tab") out += "  ";
          else if (cname === "lineBreak") out += "\n";
          else if (cname === "nbSpace" || cname === "fwSpace") out += " ";
        }
      }
      return;
    }
    for (let i = 0; i < el.children.length; i++) {
      walk(el.children[i]);
    }
  };
  walk(pEl);
  return sanitizeXmlString(out).replace(/\r\n/g, "\n").trim();
}

/**
 * Parse HWPX (OWPML XML ZIP) with full multi-section, landscape, table, style, and image support
 */
async function parseHwpxFile(
  file: File,
  onProgress?: (p: number) => void
): Promise<ParsedHwpDocument> {
  const { default: JSZip } = await import("jszip");
  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);

  if (onProgress) onProgress(10);

  const parser = new DOMParser();

  // 1. Parse Contents/header.xml for font sizes, bold, paragraph alignment, and table cell fills
  const charPrMap = new Map<string, { fontSizePt: number; bold: boolean }>();
  const paraPrMap = new Map<string, { align: "left" | "center" | "right" | "justify" }>();
  const borderFillMap = new Map<string, { bgColor?: string }>();

  const headerFile = zip.file("Contents/header.xml");
  if (headerFile) {
    try {
      const hdrXml = await headerFile.async("string");
      const hdrDoc = parser.parseFromString(hdrXml, "application/xml");

      const charNodes = hdrDoc.getElementsByTagName("*");
      for (let i = 0; i < charNodes.length; i++) {
        const el = charNodes[i];
        const ln = getLocalName(el);
        if (ln === "charPr") {
          const id = el.getAttribute("id");
          if (id !== null) {
            const h = parseInt(el.getAttribute("height") || "1000", 10);
            const bold = Boolean(findFirstDescendantByLocalName(el, "bold"));
            charPrMap.set(id, { fontSizePt: Math.max(7, Math.min(48, h / 100)), bold });
          }
        } else if (ln === "paraPr") {
          const id = el.getAttribute("id");
          if (id !== null) {
            const alignEl = findFirstDescendantByLocalName(el, "align");
            const horiz = (alignEl?.getAttribute("horizontal") || "LEFT").toUpperCase();
            let align: "left" | "center" | "right" | "justify" = "left";
            if (horiz === "CENTER") align = "center";
            else if (horiz === "RIGHT") align = "right";
            else if (horiz === "JUSTIFY") align = "justify";
            paraPrMap.set(id, { align });
          }
        } else if (ln === "borderFill") {
          const id = el.getAttribute("id");
          if (id !== null) {
            const winBrush = findFirstDescendantByLocalName(el, "winBrush");
            const faceColor = winBrush?.getAttribute("faceColor");
            if (faceColor && faceColor !== "none" && faceColor.toLowerCase() !== "#ffffff") {
              borderFillMap.set(id, { bgColor: faceColor });
            }
          }
        }
      }
    } catch (e) {
      console.warn("HWPX header.xml parse warning:", e);
    }
  }

  // 2. Load embedded images from content.hpf + BinData/*
  const imageMap = new Map<string, string>();
  const contentHpf = zip.file("Contents/content.hpf");
  const idToHref = new Map<string, string>();
  if (contentHpf) {
    try {
      const hpfXml = await contentHpf.async("string");
      const matches = Array.from(hpfXml.matchAll(/<[^>]*item\b[^>]*>/g));
      for (const m of matches) {
        const tag = m[0];
        const idM = tag.match(/\bid="([^"]+)"/);
        const hrefM = tag.match(/\bhref="([^"]+)"/);
        if (idM && hrefM && hrefM[1].toLowerCase().startsWith("bindata/")) {
          idToHref.set(idM[1], hrefM[1]);
        }
      }
    } catch {
      // ignore
    }
  }

  for (const zipPath of Object.keys(zip.files)) {
    if (zipPath.toLowerCase().startsWith("bindata/") && !zip.files[zipPath].dir) {
      try {
        const bytes = await zip.files[zipPath].async("uint8array");
        const mime = guessImageMime(zipPath);
        const dataUrl = `data:${mime};base64,${uint8ToBase64(bytes)}`;
        const baseId = zipPath.replace(/^BinData\//i, "").replace(/\.[^.]+$/, "");
        imageMap.set(baseId, dataUrl);
        imageMap.set(zipPath, dataUrl);
      } catch {
        // skip unreadable image
      }
    }
  }
  for (const [id, href] of Array.from(idToHref.entries())) {
    const found = imageMap.get(href);
    if (found) imageMap.set(id, found);
  }

  if (onProgress) onProgress(25);

  // 3. Find and sort all Contents/section*.xml files
  const sectionPaths = Object.keys(zip.files)
    .filter((n) => /^Contents\/section\d+\.xml$/i.test(n))
    .sort((a, b) => {
      const na = parseInt(a.match(/section(\d+)/i)?.[1] || "0", 10);
      const nb = parseInt(b.match(/section(\d+)/i)?.[1] || "0", 10);
      return na - nb;
    });

  const sections: HwpSection[] = [];
  let paragraphCount = 0;
  let tableCount = 0;
  let imageCount = 0;
  let charCount = 0;
  const previewLines: string[] = [];

  const parseTableElement = (tblEl: Element): HwpBlock | null => {
    const colCntAttr = parseInt(tblEl.getAttribute("colCnt") || "0", 10);
    const trEls = getDirectChildrenByLocalName(tblEl, "tr");
    if (trEls.length === 0) return null;

    const rows: HwpTableCell[][] = [];
    let detectedCols = colCntAttr || 1;

    for (let rIdx = 0; rIdx < trEls.length; rIdx++) {
      const tcEls = getDirectChildrenByLocalName(trEls[rIdx], "tc");
      const rowCells: HwpTableCell[] = [];
      let rowSpanSum = 0;

      for (const tc of tcEls) {
        const addrEl = getDirectChildrenByLocalName(tc, "cellAddr")[0];
        const colAddr = addrEl ? parseInt(addrEl.getAttribute("colAddr") || "0", 10) : undefined;
        const spanEl = getDirectChildrenByLocalName(tc, "cellSpan")[0];
        const colSpan = Math.max(1, parseInt(spanEl?.getAttribute("colSpan") || "1", 10));
        const rowSpan = Math.max(1, parseInt(spanEl?.getAttribute("rowSpan") || "1", 10));
        rowSpanSum = colAddr !== undefined ? Math.max(rowSpanSum, colAddr + colSpan) : rowSpanSum + colSpan;

        const bfId = tc.getAttribute("borderFillIDRef");
        const bgColor = bfId ? borderFillMap.get(bfId)?.bgColor : undefined;

        const subList = getDirectChildrenByLocalName(tc, "subList")[0];
        const cellLines: string[] = [];
        let cellAlign: "left" | "center" | "right" = "left";

        if (subList) {
          const cellPs = getDirectChildrenByLocalName(subList, "p");
          for (const cp of cellPs) {
            const txt = extractParagraphTextOnly(cp);
            if (txt) cellLines.push(txt);
            if (cellLines.length === 1) {
              const pPrId = cp.getAttribute("paraPrIDRef");
              const pAlign = pPrId ? paraPrMap.get(pPrId)?.align : undefined;
              if (pAlign === "center" || pAlign === "right") cellAlign = pAlign;
            }
          }
        }

        const cellText = cellLines.join("\n").trim();
        charCount += cellText.length;

        rowCells.push({
          text: cellText,
          colAddr,
          colSpan,
          rowSpan,
          isHeader: rIdx === 0 || Boolean(bgColor),
          align: cellAlign,
          bgColor,
        });
      }

      if (rowSpanSum > detectedCols) detectedCols = rowSpanSum;
      if (rowCells.length > 0) rows.push(rowCells);
    }

    if (rows.length === 0) return null;
    tableCount++;
    return {
      type: "table",
      rows,
      colCount: detectedCols,
    };
  };

  for (let sIdx = 0; sIdx < sectionPaths.length; sIdx++) {
    const xmlStr = await zip.files[sectionPaths[sIdx]].async("string");
    const doc = parser.parseFromString(xmlStr, "application/xml");
    const root = doc.documentElement;

    // Detect section orientation: in OWPML, landscape="NARROWLY" means Landscape (wide horizontal)
    const pagePrEl = findFirstDescendantByLocalName(root, "pagePr");
    const landscapeAttr = (pagePrEl?.getAttribute("landscape") || "WIDELY").toUpperCase();
    const pageW = parseInt(pagePrEl?.getAttribute("width") || "59528", 10);
    const pageH = parseInt(pagePrEl?.getAttribute("height") || "84188", 10);
    const isLandscape = landscapeAttr === "NARROWLY" || pageW > pageH;

    const blocks: HwpBlock[] = [];
    const topParagraphs = getDirectChildrenByLocalName(root, "p");

    for (const pEl of topParagraphs) {
      if (pEl.getAttribute("pageBreak") === "1" && blocks.length > 0) {
        blocks.push({ type: "pageBreak" });
      }

      const paraPrId = pEl.getAttribute("paraPrIDRef");
      const align = (paraPrId ? paraPrMap.get(paraPrId)?.align : undefined) || "left";

      const runs = getDirectChildrenByLocalName(pEl, "run");
      let paraMaxSize = 10;
      let paraBold = false;
      let paraTextAcc = "";

      const flushParaText = () => {
        const clean = sanitizeXmlString(paraTextAcc).trim();
        if (clean) {
          paragraphCount++;
          charCount += clean.length;
          if (previewLines.length < 20) previewLines.push(clean);
          blocks.push({
            type: "paragraph",
            text: clean,
            fontSizePt: paraMaxSize,
            bold: paraBold,
            align,
          });
        }
        paraTextAcc = "";
      };

      for (const runEl of runs) {
        const cPrId = runEl.getAttribute("charPrIDRef");
        const cPr = cPrId ? charPrMap.get(cPrId) : undefined;
        if (cPr) {
          if (cPr.fontSizePt > paraMaxSize) paraMaxSize = cPr.fontSizePt;
          if (cPr.bold) paraBold = true;
        }

        for (let ci = 0; ci < runEl.children.length; ci++) {
          const child = runEl.children[ci];
          const cname = getLocalName(child);

          if (cname === "t") {
            for (let ti = 0; ti < child.childNodes.length; ti++) {
              const cn = child.childNodes[ti];
              if (cn.nodeType === Node.TEXT_NODE) {
                paraTextAcc += cn.textContent || "";
              } else if (cn.nodeType === Node.ELEMENT_NODE) {
                const tn = getLocalName(cn as Element);
                if (tn === "tab") paraTextAcc += "  ";
                else if (tn === "lineBreak") paraTextAcc += "\n";
                else if (tn === "nbSpace" || tn === "fwSpace") paraTextAcc += " ";
              }
            }
          } else if (cname === "tbl") {
            flushParaText();
            const tblBlock = parseTableElement(child);
            if (tblBlock) blocks.push(tblBlock);
          } else if (cname === "pic") {
            flushParaText();
            const imgEl = findFirstDescendantByLocalName(child, "img");
            const ref = imgEl?.getAttribute("binaryItemIDRef");
            if (ref && imageMap.has(ref)) {
              imageCount++;
              blocks.push({
                type: "image",
                imageDataUrl: imageMap.get(ref),
              });
            }
          }
        }
      }

      flushParaText();
    }

    sections.push({
      index: sIdx,
      landscape: isLandscape,
      blocks,
    });

    if (onProgress) {
      onProgress(Math.round(25 + ((sIdx + 1) / Math.max(1, sectionPaths.length)) * 30));
    }
  }

  return {
    format: "hwpx",
    title: file.name.replace(/\.[^/.]+$/, ""),
    sections,
    stats: {
      sectionCount: sections.length,
      paragraphCount,
      tableCount,
      imageCount,
      charCount,
    },
    previewLines,
  };
}

/**
 * Parse legacy HWP 5.0 binary file (OLE/CFB container) using cfb + pako
 */
async function parseLegacyHwpFile(
  file: File,
  onProgress?: (p: number) => void
): Promise<ParsedHwpDocument> {
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  // Some ".hwp" files are actually HWPX ZIP archives saved with .hwp extension (PK\x03\x04)
  if (bytes.length >= 4 && bytes[0] === 0x50 && bytes[1] === 0x4b && bytes[2] === 0x03 && bytes[3] === 0x04) {
    return parseHwpxFile(file, onProgress);
  }

  if (onProgress) onProgress(15);

  const CFBModule = await import("cfb");
  const CFB = CFBModule.default || CFBModule;
  const pakoModule = await import("pako");
  const pako = pakoModule.default || pakoModule;

  const container = CFB.read(bytes, { type: "array" });
  const fileHeader = CFB.find(container, "/FileHeader");
  if (!fileHeader || !fileHeader.content || fileHeader.content.length < 40) {
    throw new Error("유효한 HWP 5.0 문서가 아닙니다. 한컴오피스에서 .hwpx로 다시 저장해 보세요.");
  }

  const hdrBytes = new Uint8Array(fileHeader.content as any);
  const flags =
    hdrBytes[36] | (hdrBytes[37] << 8) | (hdrBytes[38] << 16) | (hdrBytes[39] << 24);
  const isCompressed = (flags & 1) !== 0;
  const isEncrypted = (flags & 2) !== 0;

  if (isEncrypted) {
    throw new Error("암호가 설정된 HWP 파일입니다. 한컴오피스에서 암호를 해제한 뒤 변환해 주세요.");
  }

  // Find BodyText/Section0, Section1, ...
  const sectionEntries: { idx: number; content: Uint8Array }[] = [];
  for (const fullPath of container.FullPaths) {
    const m = fullPath.match(/BodyText\/Section(\d+)$/i);
    if (m) {
      const entry = CFB.find(container, fullPath);
      if (entry?.content) {
        sectionEntries.push({
          idx: parseInt(m[1], 10),
          content: new Uint8Array(entry.content as any),
        });
      }
    }
  }
  sectionEntries.sort((a, b) => a.idx - b.idx);

  const sections: HwpSection[] = [];
  let paragraphCount = 0;
  let charCount = 0;
  const previewLines: string[] = [];

  for (let s = 0; s < sectionEntries.length; s++) {
    const raw: Uint8Array = isCompressed
      ? pako.inflateRaw(sectionEntries[s].content)
      : sectionEntries[s].content;

    const blocks: HwpBlock[] = [];
    let pos = 0;

    while (pos + 4 <= raw.length) {
      const header =
        (raw[pos] | (raw[pos + 1] << 8) | (raw[pos + 2] << 16) | (raw[pos + 3] << 24)) >>> 0;
      pos += 4;
      const tagId = header & 0x3ff;
      let size = (header >>> 20) & 0xfff;
      if (size === 0xfff) {
        if (pos + 4 > raw.length) break;
        size =
          (raw[pos] | (raw[pos + 1] << 8) | (raw[pos + 2] << 16) | (raw[pos + 3] << 24)) >>> 0;
        pos += 4;
      }

      if (tagId === 67 && pos + size <= raw.length) {
        // HWPTAG_PARA_TEXT (UTF-16LE with HWP control codes)
        let text = "";
        for (let i = 0; i + 1 < size; i += 2) {
          const code = raw[pos + i] | (raw[pos + i + 1] << 8);
          if (code === 13 || code === 10) {
            text += "\n";
          } else if (code === 9) {
            text += "  ";
          } else if (code === 30 || code === 31) {
            text += " ";
          } else if (code >= 1 && code <= 23) {
            if ([1, 2, 3, 11, 12, 14, 15, 16, 17, 18, 21, 22, 23].includes(code)) {
              i += 14; // Extended inline/object control occupies 16 bytes total
            }
          } else if (code >= 32) {
            text += String.fromCharCode(code);
          }
        }
        const clean = sanitizeXmlString(text).trim();
        if (clean) {
          paragraphCount++;
          charCount += clean.length;
          if (previewLines.length < 20) previewLines.push(clean);
          const isHeading = /^(Ⅰ|Ⅱ|Ⅲ|Ⅳ|Ⅴ|【|□|■|[0-9]+\.\s)/.test(clean) && clean.length < 70;
          blocks.push({
            type: "paragraph",
            text: clean,
            fontSizePt: isHeading ? 13 : 10.5,
            bold: isHeading,
            align: "left",
          });
        }
      }

      pos += size;
    }

    sections.push({ index: s, landscape: false, blocks });
    if (onProgress) onProgress(Math.round(20 + ((s + 1) / Math.max(1, sectionEntries.length)) * 35));
  }

  // Fallback to PrvText if BodyText produced nothing
  if (paragraphCount === 0) {
    const prv = CFB.find(container, "/PrvText");
    if (prv?.content) {
      const prvBytes = new Uint8Array(prv.content as any);
      let decoded = "";
      for (let i = 0; i + 1 < prvBytes.length; i += 2) {
        decoded += String.fromCharCode(prvBytes[i] | (prvBytes[i + 1] << 8));
      }
      const lines = sanitizeXmlString(decoded)
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);
      const blocks: HwpBlock[] = lines.map((line) => ({
        type: "paragraph",
        text: line,
        fontSizePt: 10.5,
        align: "left",
      }));
      paragraphCount = blocks.length;
      charCount = decoded.length;
      previewLines.push(...lines.slice(0, 20));
      sections.push({ index: 0, landscape: false, blocks });
    }
  }

  return {
    format: "hwp",
    title: file.name.replace(/\.[^/.]+$/, ""),
    sections,
    stats: {
      sectionCount: sections.length,
      paragraphCount,
      tableCount: 0,
      imageCount: 0,
      charCount,
    },
    previewLines,
  };
}

export async function parseHwpOrHwpx(
  file: File,
  onProgress?: (p: number) => void
): Promise<ParsedHwpDocument> {
  const lower = file.name.toLowerCase();
  if (lower.endsWith(".hwpx")) {
    return parseHwpxFile(file, onProgress);
  }
  return parseLegacyHwpFile(file, onProgress);
}

// ============================================================================
// Exporter 1: High-DPI Multi-Orientation Korean PDF (Per-section Portrait/Landscape)
// ============================================================================

async function loadImageElement(src: string): Promise<HTMLImageElement | null> {
  try {
    return await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  } catch {
    return null;
  }
}

export async function exportHwpToPdf(
  doc: ParsedHwpDocument,
  onProgress?: (p: number) => void
): Promise<{ blob: Blob; pageCount: number }> {
  const renderedPages: { jpgBytes: Uint8Array; widthPt: number; heightPt: number }[] = [];

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  let pageNumber = 0;

  for (let sIdx = 0; sIdx < doc.sections.length; sIdx++) {
    const section = doc.sections[sIdx];
    const landscape = section.landscape;

    const widthPt = landscape ? 841.89 : 595.28;
    const heightPt = landscape ? 595.28 : 841.89;
    const widthPx = landscape ? 1754 : 1240;
    const heightPx = landscape ? 1240 : 1754;
    const marginX = 78;
    const marginTop = 76;
    const marginBottom = 78;
    const contentWidth = widthPx - marginX * 2;
    const maxY = heightPx - marginBottom;

    canvas.width = widthPx;
    canvas.height = heightPx;

    let cursorY = marginTop;
    let pageHasContent = false;

    const startPage = () => {
      pageNumber++;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, widthPx, heightPx);
      cursorY = marginTop;
      pageHasContent = false;
    };

    const flushPage = () => {
      if (!pageHasContent && renderedPages.length > 0) return;
      ctx.save();
      ctx.font = `500 15px ${KOREAN_FONT_STACK}`;
      ctx.fillStyle = "#94a3b8";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`- ${pageNumber} -`, widthPx / 2, heightPx - 36);
      ctx.restore();

      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      renderedPages.push({
        jpgBytes: dataUrlToUint8Array(dataUrl),
        widthPt,
        heightPt,
      });
    };

    const ensureSpace = (needed: number) => {
      if (cursorY + needed > maxY && cursorY > marginTop + 10) {
        flushPage();
        startPage();
      }
    };

    const wrapText = (text: string, maxW: number, font: string): string[] => {
      ctx.font = font;
      const lines: string[] = [];
      const paras = (text || "").split("\n");
      for (const para of paras) {
        if (!para.trim()) {
          lines.push("");
          continue;
        }
        let cur = "";
        for (const ch of para) {
          if (ctx.measureText(cur + ch).width > maxW && cur.length > 0) {
            lines.push(cur);
            cur = ch;
          } else {
            cur += ch;
          }
        }
        if (cur) lines.push(cur);
      }
      return lines;
    };

    startPage();

    const blocks = section.blocks;
    for (let bIdx = 0; bIdx < blocks.length; bIdx++) {
      const block = blocks[bIdx];

      if (block.type === "pageBreak") {
        if (pageHasContent) {
          flushPage();
          startPage();
        }
        continue;
      }

      if (block.type === "paragraph" && block.text) {
        const pt = block.fontSizePt || 10.5;
        const fontSizePx = Math.round(Math.max(15, Math.min(44, pt * 1.9)));
        const lineHeight = Math.round(fontSizePx * 1.52);
        const isBold = Boolean(block.bold || pt >= 13);
        const font = `${isBold ? "700" : "400"} ${fontSizePx}px ${KOREAN_FONT_STACK}`;
        const lines = wrapText(block.text, contentWidth, font);

        if (pt >= 13 && cursorY > marginTop + 12) {
          cursorY += 12;
        }

        ctx.save();
        ctx.font = font;
        ctx.fillStyle = pt >= 14 ? "#0f172a" : "#1e293b";
        ctx.textBaseline = "top";
        const align = block.align === "center" ? "center" : block.align === "right" ? "right" : "left";
        ctx.textAlign = align;
        const drawX =
          align === "center" ? widthPx / 2 : align === "right" ? widthPx - marginX : marginX;

        for (const line of lines) {
          ensureSpace(lineHeight);
          if (line) {
            ctx.fillText(line, drawX, cursorY);
            pageHasContent = true;
          }
          cursorY += lineHeight;
        }
        cursorY += Math.round(fontSizePx * 0.32);
        ctx.restore();
      } else if (block.type === "image" && block.imageDataUrl) {
        const img = await loadImageElement(block.imageDataUrl);
        if (img && img.naturalWidth > 0 && img.naturalHeight > 0) {
          const maxImgH = (maxY - marginTop) * 0.6;
          const scale = Math.min(contentWidth / img.naturalWidth, maxImgH / img.naturalHeight, 1.5);
          const drawW = Math.round(img.naturalWidth * scale);
          const drawH = Math.round(img.naturalHeight * scale);
          ensureSpace(drawH + 16);
          const ix = marginX + Math.round((contentWidth - drawW) / 2);
          ctx.drawImage(img, ix, cursorY, drawW, drawH);
          cursorY += drawH + 16;
          pageHasContent = true;
        }
      } else if (block.type === "table" && block.rows && block.rows.length > 0) {
        const totalCols = Math.max(
          block.colCount || 1,
          ...block.rows.map((r) => r.reduce((acc, c) => acc + c.colSpan, 0))
        );
        const fontSizePx = totalCols > 8 ? 13 : totalCols > 5 ? 15 : 17;
        const lineHeight = Math.round(fontSizePx * 1.38);
        const padX = totalCols > 8 ? 6 : 10;
        const padY = totalCols > 8 ? 6 : 8;
        const unitColW = contentWidth / totalCols;

        cursorY += 6;

        for (let rIdx = 0; rIdx < block.rows.length; rIdx++) {
          const row = block.rows[rIdx];
          const hasExplicitAddr = row.every((c) => c.colAddr !== undefined);
          const rowSpanTotal = row.reduce((acc, c) => acc + c.colSpan, 0);
          const rowScale = !hasExplicitAddr && rowSpanTotal > 0 ? totalCols / rowSpanTotal : 1;

          // Build grid-aligned cells (inserting empty continuation cells where rowSpan occupies a column)
          const alignedCells: { cell: HwpTableCell; colIdx: number; cw: number; font: string; wrapped: string[] }[] = [];
          let fallbackCol = 0;

          for (const cell of row) {
            const colIdx = hasExplicitAddr ? (cell.colAddr ?? fallbackCol) : fallbackCol;
            const cw = unitColW * cell.colSpan * rowScale;
            const font = `${cell.isHeader ? "700" : "400"} ${fontSizePx}px ${KOREAN_FONT_STACK}`;
            const wrapped = wrapText(cell.text, Math.max(20, cw - padX * 2), font);
            alignedCells.push({ cell, colIdx, cw, font, wrapped });
            fallbackCol = colIdx + cell.colSpan;
          }

          const maxLines = Math.max(1, ...alignedCells.map((cl) => cl.wrapped.length));
          const rowH = Math.min(maxY - marginTop - 8, maxLines * lineHeight + padY * 2);

          ensureSpace(rowH);

          // Draw full row background & outer side borders so vertically merged columns stay neat
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(marginX, cursorY, contentWidth, rowH);
          ctx.strokeStyle = "#94a3b8";
          ctx.lineWidth = 1;
          ctx.strokeRect(marginX, cursorY, contentWidth, rowH);

          for (const cl of alignedCells) {
            const cx = marginX + cl.colIdx * unitColW * rowScale;
            const bg = cl.cell.bgColor
              ? cl.cell.bgColor
              : cl.cell.isHeader
                ? "#f1f5f9"
                : "#ffffff";
            ctx.fillStyle = bg;
            ctx.fillRect(cx, cursorY, cl.cw, rowH);

            ctx.strokeStyle = "#94a3b8";
            ctx.lineWidth = 1;
            ctx.strokeRect(cx, cursorY, cl.cw, rowH);

            ctx.save();
            ctx.beginPath();
            ctx.rect(cx + 2, cursorY + 2, Math.max(1, cl.cw - 4), Math.max(1, rowH - 4));
            ctx.clip();

            ctx.font = cl.font;
            ctx.fillStyle = cl.cell.isHeader ? "#0f172a" : "#1e293b";
            ctx.textBaseline = "top";
            const cAlign =
              cl.cell.align === "center" ? "center" : cl.cell.align === "right" ? "right" : "left";
            ctx.textAlign = cAlign;
            const tx =
              cAlign === "center"
                ? cx + cl.cw / 2
                : cAlign === "right"
                  ? cx + cl.cw - padX
                  : cx + padX;

            for (let li = 0; li < cl.wrapped.length; li++) {
              ctx.fillText(cl.wrapped[li], tx, cursorY + padY + li * lineHeight);
            }
            ctx.restore();
          }

          cursorY += rowH;
          pageHasContent = true;
        }

        cursorY += 14;
      }

      if (onProgress && bIdx % 25 === 0) {
        const secFrac = (sIdx + bIdx / Math.max(1, blocks.length)) / Math.max(1, doc.sections.length);
        onProgress(Math.round(55 + secFrac * 35));
      }
    }

    flushPage();
  }

  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle(doc.title);
  pdfDoc.setProducer("pdfpick - HWP/HWPX Multi-Orientation PDF Engine");
  pdfDoc.setCreator("pdfpick.kr");

  for (const p of renderedPages) {
    const img = await pdfDoc.embedJpg(p.jpgBytes);
    const page = pdfDoc.addPage([p.widthPt, p.heightPt]);
    page.drawImage(img, { x: 0, y: 0, width: p.widthPt, height: p.heightPt });
  }

  const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
  if (onProgress) onProgress(100);
  return {
    blob: new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" }),
    pageCount: renderedPages.length,
  };
}

// ============================================================================
// Exporter 2: Editable MS Word (.docx) with Sections, Tables, and Images
// ============================================================================

async function normalizeImageToPngBytes(
  dataUrl: string
): Promise<{ bytes: Uint8Array; width: number; height: number } | null> {
  const img = await loadImageElement(dataUrl);
  if (!img || !img.naturalWidth || !img.naturalHeight) return null;
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);
  const pngUrl = canvas.toDataURL("image/png");
  return {
    bytes: dataUrlToUint8Array(pngUrl),
    width: img.naturalWidth,
    height: img.naturalHeight,
  };
}

export async function exportHwpToWord(
  doc: ParsedHwpDocument,
  onProgress?: (p: number) => void
): Promise<Blob> {
  const docxLib = await import("docx");
  const {
    Document,
    Paragraph,
    TextRun,
    ImageRun,
    Table,
    TableRow,
    TableCell,
    WidthType,
    BorderStyle,
    AlignmentType,
    PageOrientation,
    Packer,
  } = docxLib;

  const docxSections: any[] = [];
  let imgCounter = 1;

  for (let sIdx = 0; sIdx < doc.sections.length; sIdx++) {
    const section = doc.sections[sIdx];
    const children: any[] = [];
    const maxImgW = section.landscape ? 680 : 460;

    for (const block of section.blocks) {
      if (block.type === "pageBreak") {
        children.push(new Paragraph({ pageBreakBefore: true }));
        continue;
      }

      if (block.type === "paragraph" && block.text) {
        const alignMap = {
          left: AlignmentType.LEFT,
          center: AlignmentType.CENTER,
          right: AlignmentType.RIGHT,
          justify: AlignmentType.JUSTIFIED,
        };
        const pt = block.fontSizePt || 10.5;
        children.push(
          new Paragraph({
            alignment: alignMap[block.align || "left"],
            spacing: { after: pt >= 13 ? 120 : 60, line: 260 },
            children: [
              new TextRun({
                text: sanitizeXmlString(block.text),
                bold: Boolean(block.bold || pt >= 13),
                size: Math.round(Math.max(16, Math.min(52, pt * 2))),
                font: "Malgun Gothic",
              }),
            ],
          })
        );
      } else if (block.type === "image" && block.imageDataUrl) {
        const norm = await normalizeImageToPngBytes(block.imageDataUrl);
        if (norm) {
          const w = Math.min(norm.width, maxImgW);
          const h = Math.round(w * (norm.height / norm.width));
          children.push(
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 100, after: 100 },
              children: [
                new ImageRun({
                  data: norm.bytes,
                  transformation: { width: w, height: h },
                  type: "png",
                  altText: {
                    id: String(imgCounter),
                    name: `hwp_img_${imgCounter}`,
                    title: `Image ${imgCounter}`,
                    description: `Embedded image ${imgCounter++}`,
                  },
                }),
              ],
            })
          );
        }
      } else if (block.type === "table" && block.rows && block.rows.length > 0) {
        const border = { style: BorderStyle.SINGLE, size: 1, color: "94A3B8" };
        const tableRows = block.rows.map((row) => {
          return new TableRow({
            children: row.map((cell) => {
              const fillHex = cell.bgColor?.startsWith("#")
                ? cell.bgColor.slice(1)
                : cell.isHeader
                  ? "F1F5F9"
                  : undefined;
              const lines = sanitizeXmlString(cell.text).split("\n");
              return new TableCell({
                columnSpan: cell.colSpan > 1 ? cell.colSpan : undefined,
                shading: fillHex ? { fill: fillHex } : undefined,
                borders: { top: border, bottom: border, left: border, right: border },
                margins: { top: 60, bottom: 60, left: 90, right: 90 },
                children: lines.map(
                  (line) =>
                    new Paragraph({
                      alignment:
                        cell.align === "center"
                          ? AlignmentType.CENTER
                          : cell.align === "right"
                            ? AlignmentType.RIGHT
                            : AlignmentType.LEFT,
                      children: [
                        new TextRun({
                          text: line,
                          bold: Boolean(cell.isHeader),
                          size: 19,
                          font: "Malgun Gothic",
                        }),
                      ],
                    })
                ),
              });
            }),
          });
        });

        children.push(
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: tableRows,
          })
        );
        children.push(new Paragraph({ spacing: { after: 120 } }));
      }
    }

    docxSections.push({
      properties: {
        page: {
          size: {
            orientation: section.landscape ? PageOrientation.LANDSCAPE : PageOrientation.PORTRAIT,
          },
          margin: { top: 720, bottom: 720, left: 720, right: 720 },
        },
      },
      children: children.length > 0 ? children : [new Paragraph({ text: "" })],
    });

    if (onProgress) onProgress(Math.round(55 + ((sIdx + 1) / Math.max(1, doc.sections.length)) * 35));
  }

  const wordDoc = new Document({ sections: docxSections });
  const blob = await Packer.toBlob(wordDoc);
  if (onProgress) onProgress(100);
  return blob;
}

// ============================================================================
// Exporter 3: Excel (.xlsx) — Full Document + Extracted Tables Sheet
// ============================================================================

export async function exportHwpToExcel(
  doc: ParsedHwpDocument,
  onProgress?: (p: number) => void
): Promise<Blob> {
  const XLSX = await import("xlsx");
  const wb = XLSX.utils.book_new();

  const allRows: (string | number)[][] = [];
  const tableOnlyRows: (string | number)[][] = [];
  let tableIdx = 0;

  for (const section of doc.sections) {
    if (doc.sections.length > 1) {
      allRows.push([`=== [구역 ${section.index + 1}] ===`]);
    }

    for (const block of section.blocks) {
      if (block.type === "paragraph" && block.text) {
        allRows.push([block.text]);
      } else if (block.type === "table" && block.rows) {
        tableIdx++;
        if (tableOnlyRows.length > 0) tableOnlyRows.push([]);
        tableOnlyRows.push([`--- [표 ${tableIdx} (구역 ${section.index + 1})] ---`]);

        for (const row of block.rows) {
          const vals: (string | number)[] = [];
          let nextCol = 0;
          for (const c of row) {
            const col = c.colAddr !== undefined ? c.colAddr : nextCol;
            while (vals.length < col) vals.push("");
            const t = c.text.trim();
            if (/^-?[\d,]+(\.\d+)?$/.test(t) && t.replace(/[,.-]/g, "").length > 0) {
              const num = Number(t.replace(/,/g, ""));
              vals[col] = !isNaN(num) ? num : t;
            } else {
              vals[col] = t;
            }
            nextCol = col + Math.max(1, c.colSpan);
          }
          allRows.push(vals);
          tableOnlyRows.push(vals);
        }
        allRows.push([]);
      }
    }
  }

  const autoFit = (rows: (string | number)[][]) => {
    const widths: number[] = [];
    for (const row of rows) {
      row.forEach((cell, ci) => {
        const s = String(cell ?? "");
        const len = Math.min(60, s.split("").reduce((a, ch) => a + (ch.charCodeAt(0) > 255 ? 2 : 1), 0) + 2);
        widths[ci] = Math.max(widths[ci] || 10, len);
      });
    }
    return widths.map((w) => ({ wch: w }));
  };

  if (tableOnlyRows.length > 0) {
    const wsTables = XLSX.utils.aoa_to_sheet(tableOnlyRows);
    wsTables["!cols"] = autoFit(tableOnlyRows);
    XLSX.utils.book_append_sheet(wb, wsTables, "표_데이터_모음");
  }

  const wsAll = XLSX.utils.aoa_to_sheet(allRows.length > 0 ? allRows : [["추출된 내용이 없습니다."]]);
  wsAll["!cols"] = autoFit(allRows);
  XLSX.utils.book_append_sheet(wb, wsAll, "문서_전체");

  if (onProgress) onProgress(95);
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  if (onProgress) onProgress(100);
  return new Blob([wbout], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

// ============================================================================
// Exporter 4: Clean Structured Plain Text (.txt)
// ============================================================================

export function exportHwpToText(doc: ParsedHwpDocument): Blob {
  const parts: string[] = [];

  for (const section of doc.sections) {
    if (doc.sections.length > 1) {
      parts.push(`\n========== [구역 ${section.index + 1}${section.landscape ? " (가로)" : ""}] ==========\n`);
    }
    for (const block of section.blocks) {
      if (block.type === "paragraph" && block.text) {
        parts.push(block.text);
      } else if (block.type === "table" && block.rows) {
        parts.push("");
        for (const row of block.rows) {
          parts.push(row.map((c) => c.text.replace(/\n/g, " / ")).join("\t"));
        }
        parts.push("");
      }
    }
  }

  return new Blob([parts.join("\n").trim()], { type: "text/plain;charset=utf-8" });
}
