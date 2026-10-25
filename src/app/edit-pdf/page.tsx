"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ToolHeader from "@/components/ToolHeader";
import FileDropzone from "@/components/FileDropzone";
import HowToSection from "@/components/HowToSection";
import FaqSection from "@/components/FaqSection";
import AdBanner from "@/components/AdBanner";
import ProcessingOverlay from "@/components/ProcessingOverlay";
import MascotActionNotice from "@/components/MascotActionNotice";
import UploadedFileCard from "@/components/UploadedFileCard";
import StepBadge from "@/components/StepBadge";
import RedPanda from "@/components/RedPanda";
import { 
  exportEditedPdf, 
  downloadBlob, 
  PageEdits, 
  TextAnnotation, 
  DrawingStroke, 
  ShapeAnnotation, 
  ImageAnnotation 
} from "@/lib/pdf-utils";
import { 
  PenTool, 
  Download, 
  Type, 
  Eraser, 
  Square, 
  Highlighter, 
  Image as ImageIcon, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Trash2, 
  Move, 
  Bold, 
  Undo,
  Maximize2,
  ScanText,
  MousePointer,
  Sparkles,
  Layers,
  Palette,
  RotateCcw,
  RotateCw,
  RefreshCw
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";

type ActiveTool = "select" | "editText" | "text" | "pen" | "highlighter" | "whiteout" | "rect" | "stamp";

interface DetectedTextItem {
  id: string;
  str: string;
  x: number;      // 0..1 ratio
  y: number;      // 0..1 ratio
  width: number;  // 0..1 ratio
  height: number; // 0..1 ratio
  fontSize: number;
}

type SelectedItem = 
  | { type: "shape"; id: string }
  | { type: "text"; id: string }
  | { type: "image"; id: string }
  | null;

const PRESET_STAMPS = [
  { key: "stamp_approved", label: "✅ 승인", en: "APPROVED", color: "#16a34a", bg: "#dcfce7" },
  { key: "stamp_confidential", label: "🔒 대외비", en: "CONFIDENTIAL", color: "#dc2626", bg: "#fee2e2" },
  { key: "stamp_signed", label: "✍ 서명완료", en: "SIGNED", color: "#2563eb", bg: "#dbeafe" },
  { key: "stamp_rejected", label: "❌ 반려", en: "REJECTED", color: "#e11d48", bg: "#ffe4e6" },
  { key: "stamp_original", label: "📋 원본대조필", en: "ORIGINAL", color: "#4f46e5", bg: "#e0e7ff" },
];

/**
 * Detects whether the text on a PDF page is visually inverted (180°) or tilted (90°/270°)
 * relative to the default page rendering, and returns the suggested user rotation delta (in degrees)
 * needed to bring the page upright (0° visual orientation).
 */
async function detectPageOrientation(page: any): Promise<number> {
  try {
    const textContent = await page.getTextContent();
    if (!textContent || !textContent.items || textContent.items.length === 0) {
      return 0;
    }

    const angleVotes: Record<number, number> = { 0: 0, 90: 0, 180: 0, 270: 0 };
    let totalChars = 0;
    const pageRot = page.rotate || 0;

    for (const item of textContent.items) {
      if (!item.str || !item.str.trim()) continue;
      const len = item.str.trim().length;
      const t = item.transform;
      if (!t || t.length < 4) continue;

      // Calculate angle of text baseline vector
      const angleRad = Math.atan2(t[1], t[0]);
      const rawDeg = ((Math.round((angleRad * 180) / Math.PI)) % 360 + 360) % 360;
      // Visual angle on screen when rendered with page.rotate
      const visualAngle = ((rawDeg - pageRot) % 360 + 360) % 360;

      // Quantize to nearest cardinal angle (0, 90, 180, 270)
      let nearest = 0;
      let minDiff = 360;
      for (const target of [0, 90, 180, 270]) {
        const diff = Math.min(Math.abs(visualAngle - target), 360 - Math.abs(visualAngle - target));
        if (diff < minDiff) {
          minDiff = diff;
          nearest = target;
        }
      }

      // Allow slight skew (up to 30 degrees for scanned text)
      if (minDiff <= 30) {
        angleVotes[nearest] = (angleVotes[nearest] || 0) + len;
        totalChars += len;
      }
    }

    if (totalChars < 6) {
      return 0; // Not enough characters to reliably judge
    }

    let dominantAngle = 0;
    let maxVotes = 0;
    for (const [angleStr, votes] of Object.entries(angleVotes)) {
      const angle = Number(angleStr);
      if (votes > maxVotes) {
        maxVotes = votes;
        dominantAngle = angle;
      }
    }

    // If more than 50% of text characters are oriented at an inverted/tilted angle
    if (dominantAngle !== 0 && (maxVotes / totalChars) >= 0.5) {
      // Calculate clockwise correction rotation to bring dominant visual angle back to 0°
      const correctionAngle = (360 - dominantAngle) % 360;
      return correctionAngle;
    }

    return 0;
  } catch (err) {
    console.warn("Auto orientation detection error:", err);
    return 0;
  }
}

export default function EditPdfPage() {
  const { t } = useLanguage();

  // File & Document State
  const [file, setFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(1.0);
  const [activeFitMode, setActiveFitMode] = useState<"width" | "page" | "custom">("width");
  const [isDocLoading, setIsDocLoading] = useState<boolean>(false);
  const pdfDocRef = useRef<any>(null);

  // Detected Texts for Current Page (Text Recognition & Editing)
  const [detectedTexts, setDetectedTexts] = useState<DetectedTextItem[]>([]);
  const [isDetectingText, setIsDetectingText] = useState<boolean>(false);

  // Editing Tool State
  const [activeTool, setActiveTool] = useState<ActiveTool>("select");
  const [penColor, setPenColor] = useState<string>("#ef4444");
  const [penWidth, setPenWidth] = useState<number>(3);
  const [highlighterColor, setHighlighterColor] = useState<string>("#facc15");
  const [fontSize, setFontSize] = useState<number>(18);
  const [textColor, setTextColor] = useState<string>("#000000");
  const [isBold, setIsBold] = useState<boolean>(true);
  const [rectBorderColor, setRectBorderColor] = useState<string>("#2563eb");
  const [rectStrokeWidth, setRectStrokeWidth] = useState<number>(2);

  // All annotations keyed by 0-indexed page
  const [editsByPage, setEditsByPage] = useState<Record<number, PageEdits>>({});

  // User Rotation State keyed by 0-indexed page (user delta in degrees: 0, 90, 180, 270)
  const [pageRotations, setPageRotations] = useState<Record<number, number>>({});

  // Selection & Manipulation State (Move & Resize)
  const [selectedItem, setSelectedItem] = useState<SelectedItem>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [resizingHandle, setResizingHandle] = useState<"nw" | "ne" | "sw" | "se" | null>(null);
  const [initialResizeBounds, setInitialResizeBounds] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [resizeStartPointer, setResizeStartPointer] = useState<{ x: number; y: number } | null>(null);

  // Interactive Shape Drawing State (Click-and-drag to draw box/whiteout)
  const [isDrawingShape, setIsDrawingShape] = useState<boolean>(false);
  const [shapeStartPoint, setShapeStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [liveShapePreview, setLiveShapePreview] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

  // Canvas Refs
  const bgCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const workspaceScrollRef = useRef<HTMLDivElement | null>(null);

  // Exact page dimensions in PDF points
  const [pageSize, setPageSize] = useState<{ width: number; height: number }>({ width: 595.28, height: 841.89 });
  const [hasAutoFitted, setHasAutoFitted] = useState<boolean>(false);

  // Interaction State for Freehand Pen/Highlighter
  const [isDrawing, setIsDrawing] = useState(false);
  const currentStrokeRef = useRef<{ x: number; y: number }[]>([]);

  // Export State
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [editedResult, setEditedResult] = useState<Uint8Array | null>(null);

  // Hidden File Input for Custom Stamp/Signature Image
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Initialize page edits helper
  const getPageEdits = useCallback((pageIdx: number): PageEdits => {
    return editsByPage[pageIdx] || {
      pageIndex: pageIdx,
      texts: [],
      strokes: [],
      shapes: [],
      images: [],
    };
  }, [editsByPage]);

  // Load PDF file via pdfjs-dist
  const handleFileSelected = async (files: File[]) => {
    const pdfFile = files.find((f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
    if (!pdfFile) return;

    setFile(pdfFile);
    setEditedResult(null);
    setEditsByPage({});
    setPageRotations({});
    setSelectedItem(null);
    setCurrentPage(1);
    setHasAutoFitted(false);
    setActiveFitMode("width");
    setIsDocLoading(true);

    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

      const arrayBuffer = await pdfFile.arrayBuffer();
      const loadedDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      pdfDocRef.current = loadedDoc;
      setPdfDoc(loadedDoc);
      setPageCount(loadedDoc.numPages);

      // Auto-detect orientation for initial pages (up to first 10 pages)
      const initialRotations: Record<number, number> = {};
      const numToCheck = Math.min(loadedDoc.numPages, 10);
      for (let i = 1; i <= numToCheck; i++) {
        const p = await loadedDoc.getPage(i);
        const correction = await detectPageOrientation(p);
        if (correction !== 0) {
          initialRotations[i - 1] = correction;
        }
      }
      setPageRotations(initialRotations);

      // Record page 1 size and set safe default initial zoom
      const p1 = await loadedDoc.getPage(1);
      const p1Rot = ((p1.rotate || 0) + (initialRotations[0] || 0) + 360) % 360;
      const vp1 = p1.getViewport({ scale: 1.0, rotation: p1Rot });
      setPageSize({ width: vp1.width, height: vp1.height });

      const clientW = typeof window !== "undefined" ? window.innerWidth : 1200;
      // Conservative initial zoom for studio left workspace column until container mounts
      const initialZoom = Math.min(1.0, Math.max(0.3, (clientW - 440) / vp1.width));
      setZoom(Math.round(initialZoom * 100) / 100);
    } catch (err) {
      console.error("PDF load error:", err);
      alert(t("edit_error_load"));
    } finally {
      setIsDocLoading(false);
    }
  };

  // Redraw freehand strokes for the current page onto drawCanvas
  const redrawStrokes = useCallback(() => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const pageIdx = currentPage - 1;
    const pageEdits = editsByPage[pageIdx];
    if (!pageEdits || !pageEdits.strokes) return;

    const dpr = typeof window !== "undefined" ? Math.max(1.5, Math.min(2.5, window.devicePixelRatio || 1.5)) : 1.5;

    for (const stroke of pageEdits.strokes) {
      if (!stroke.points || stroke.points.length === 0) continue;
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width * (zoom * dpr);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      if (stroke.isHighlighter) {
        ctx.globalAlpha = 0.45;
      }

      ctx.moveTo(stroke.points[0].x * canvas.width, stroke.points[0].y * canvas.height);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x * canvas.width, stroke.points[i].y * canvas.height);
      }
      ctx.stroke();
      ctx.restore();
    }
  }, [currentPage, editsByPage, zoom]);

  // Render current PDF page & Extract Text Items
  const renderPdfPage = useCallback(async () => {
    const currentDoc = pdfDocRef.current || pdfDoc;
    if (!currentDoc || !bgCanvasRef.current) return;

    try {
      setIsDetectingText(true);
      const page = await currentDoc.getPage(currentPage);
      const pageIdx = currentPage - 1;
      let userRot = pageRotations[pageIdx];
      if (userRot === undefined) {
        const detectedCorrection = await detectPageOrientation(page);
        if (detectedCorrection !== 0) {
          userRot = detectedCorrection;
          setPageRotations((prev) => ({ ...prev, [pageIdx]: detectedCorrection }));
        } else {
          userRot = 0;
        }
      }
      const totalRotation = ((page.rotate || 0) + userRot + 360) % 360;

      const unscaledViewport = page.getViewport({ scale: 1.0, rotation: totalRotation });
      const origW = unscaledViewport.width;
      const origH = unscaledViewport.height;

      setPageSize((prev) => (prev.width !== origW || prev.height !== origH ? { width: origW, height: origH } : prev));

      // Crisp rendering using Device Pixel Ratio for Retina/HiDPI screens
      const dpr = typeof window !== "undefined" ? Math.max(1.5, Math.min(2.5, window.devicePixelRatio || 1.5)) : 1.5;
      const renderScale = zoom * dpr;
      const viewport = page.getViewport({ scale: renderScale, rotation: totalRotation });

      const displayW = Math.round(origW * zoom);
      const displayH = Math.round(origH * zoom);

      const bgCanvas = bgCanvasRef.current;
      bgCanvas.width = viewport.width;
      bgCanvas.height = viewport.height;
      bgCanvas.style.width = `${displayW}px`;
      bgCanvas.style.height = `${displayH}px`;

      const ctx = bgCanvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
        await page.render({ canvasContext: ctx, viewport }).promise;
      }

      // Sync draw canvas dimensions
      if (drawCanvasRef.current) {
        const drawCanvas = drawCanvasRef.current;
        drawCanvas.width = viewport.width;
        drawCanvas.height = viewport.height;
        drawCanvas.style.width = `${displayW}px`;
        drawCanvas.style.height = `${displayH}px`;
        redrawStrokes();
      }

      // Extract text content items for text recognition & inline editing
      const textContent = await page.getTextContent();
      const detected: DetectedTextItem[] = [];

      for (let i = 0; i < textContent.items.length; i++) {
        const item = textContent.items[i] as any;
        if (!item.str || !item.str.trim()) continue;

        const tx = item.transform[4];
        const ty = item.transform[5];
        const fontSize = Math.hypot(item.transform[0], item.transform[1]);
        const [vx, vy] = viewport.convertToViewportPoint(tx, ty);

        const left = Math.max(0, vx / viewport.width);
        const top = Math.max(0, (vy - fontSize * renderScale) / viewport.height);
        const width = Math.min(1 - left, (item.width * renderScale) / viewport.width);
        const height = Math.min(1 - top, (fontSize * renderScale * 1.25) / viewport.height);

        detected.push({
          id: `det_${currentPage}_${i}`,
          str: item.str,
          x: left,
          y: top,
          width: Math.max(0.015, width),
          height: Math.max(0.015, height),
          fontSize: Math.round(fontSize),
        });
      }

      setDetectedTexts(detected);
    } catch (err) {
      console.error("Page render error:", err);
    } finally {
      setIsDetectingText(false);
    }
  }, [currentPage, zoom, pdfDoc, pageRotations, redrawStrokes]);

  // Trigger render when document, page, zoom, or rotation updates
  useEffect(() => {
    if (file && (pdfDoc || pdfDocRef.current)) {
      renderPdfPage();
    }
  }, [file, pdfDoc, currentPage, zoom, pageRotations, renderPdfPage]);

  // Re-draw strokes whenever edits change
  useEffect(() => {
    redrawStrokes();
  }, [editsByPage, redrawStrokes]);

  // 1. Text Recognition & Inline Modification Handler
  const handleEditDetectedText = (item: DetectedTextItem) => {
    const pageIdx = currentPage - 1;
    const whiteoutId = `wo_${Date.now()}`;
    const textId = `txt_${Date.now()}`;

    // Add whiteout rectangle directly covering the printed text
    const paddingX = 0.003;
    const paddingY = 0.002;
    const newWhiteout: ShapeAnnotation = {
      id: whiteoutId,
      type: "whiteout",
      x: Math.max(0, item.x - paddingX),
      y: Math.max(0, item.y - paddingY),
      width: Math.min(1, item.width + paddingX * 2),
      height: Math.min(1, item.height + paddingY * 2),
      color: "#ffffff",
      fillColor: "#ffffff",
    };

    // Add editable text annotation with original text prefilled
    const newText: TextAnnotation = {
      id: textId,
      type: "text",
      x: item.x,
      y: item.y,
      text: item.str,
      fontSize: Math.max(13, item.fontSize),
      color: "#000000",
      bold: false,
    };

    setEditsByPage((prev) => {
      const cur = prev[pageIdx] || { pageIndex: pageIdx, texts: [], strokes: [], shapes: [], images: [] };
      return {
        ...prev,
        [pageIdx]: {
          ...cur,
          shapes: [...cur.shapes, newWhiteout],
          texts: [...cur.texts, newText],
        },
      };
    });

    setSelectedItem({ type: "text", id: textId });
    setActiveTool("select");
  };

  // Pointer drawing handlers for Pen & Highlighter
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (activeTool !== "pen" && activeTool !== "highlighter") return;
    const canvas = drawCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setIsDrawing(true);
    currentStrokeRef.current = [{ x, y }];

    const ctx = canvas.getContext("2d");
    if (ctx) {
      const dpr = typeof window !== "undefined" ? Math.max(1.5, Math.min(2.5, window.devicePixelRatio || 1.5)) : 1.5;
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = activeTool === "highlighter" ? highlighterColor : penColor;
      ctx.lineWidth = (activeTool === "highlighter" ? 14 : penWidth) * (zoom * dpr);
      ctx.lineCap = "round";
      if (activeTool === "highlighter") ctx.globalAlpha = 0.45;
      ctx.moveTo(x * canvas.width, y * canvas.height);
      ctx.lineTo(x * canvas.width, y * canvas.height);
      ctx.stroke();
      ctx.restore();
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || (activeTool !== "pen" && activeTool !== "highlighter")) return;
    const canvas = drawCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const lastPoint = currentStrokeRef.current[currentStrokeRef.current.length - 1];
    currentStrokeRef.current.push({ x, y });

    const ctx = canvas.getContext("2d");
    if (ctx && lastPoint) {
      const dpr = typeof window !== "undefined" ? Math.max(1.5, Math.min(2.5, window.devicePixelRatio || 1.5)) : 1.5;
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = activeTool === "highlighter" ? highlighterColor : penColor;
      ctx.lineWidth = (activeTool === "highlighter" ? 14 : penWidth) * (zoom * dpr);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      if (activeTool === "highlighter") ctx.globalAlpha = 0.45;
      ctx.moveTo(lastPoint.x * canvas.width, lastPoint.y * canvas.height);
      ctx.lineTo(x * canvas.width, y * canvas.height);
      ctx.stroke();
      ctx.restore();
    }
  };

  const handlePointerUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (currentStrokeRef.current.length > 1) {
      const pageIdx = currentPage - 1;
      const newStroke: DrawingStroke = {
        points: currentStrokeRef.current,
        color: activeTool === "highlighter" ? highlighterColor : penColor,
        width: activeTool === "highlighter" ? 14 : penWidth,
        isHighlighter: activeTool === "highlighter",
      };

      setEditsByPage((prev) => {
        const cur = prev[pageIdx] || { pageIndex: pageIdx, texts: [], strokes: [], shapes: [], images: [] };
        return {
          ...prev,
          [pageIdx]: {
            ...cur,
            strokes: [...cur.strokes, newStroke],
          },
        };
      });
    }
    currentStrokeRef.current = [];
  };

  // Click on Canvas Container: Add Text or Deselect
  const handleContainerPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) / rect.width;
    const clickY = (e.clientY - rect.top) / rect.height;

    // A. Drawing Rectangles / Whiteouts by Dragging
    if (activeTool === "rect" || activeTool === "whiteout") {
      setIsDrawingShape(true);
      setShapeStartPoint({ x: clickX, y: clickY });
      setLiveShapePreview({ x: clickX, y: clickY, width: 0, height: 0 });
      return;
    }

    // B. Adding New Text
    if (activeTool === "text") {
      const pageIdx = currentPage - 1;
      const newText: TextAnnotation = {
        id: "text_" + Date.now(),
        type: "text",
        x: Math.max(0.02, Math.min(0.9, clickX)),
        y: Math.max(0.02, Math.min(0.9, clickY)),
        text: t("edit_prompt_text"),
        fontSize: fontSize,
        color: textColor,
        bold: isBold,
      };

      setEditsByPage((prev) => {
        const cur = prev[pageIdx] || { pageIndex: pageIdx, texts: [], strokes: [], shapes: [], images: [] };
        return {
          ...prev,
          [pageIdx]: {
            ...cur,
            texts: [...cur.texts, newText],
          },
        };
      });

      setSelectedItem({ type: "text", id: newText.id });
      setActiveTool("select");
      return;
    }

    // C. Click on Empty Area: Deselect
    if ((e.target as HTMLElement).tagName === "CANVAS" || e.target === containerRef.current) {
      setSelectedItem(null);
    }
  };

  const handleContainerPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const currentX = (e.clientX - rect.left) / rect.width;
    const currentY = (e.clientY - rect.top) / rect.height;

    // 1. Live Shape Drawing Preview
    if (isDrawingShape && shapeStartPoint) {
      const x = Math.min(shapeStartPoint.x, currentX);
      const y = Math.min(shapeStartPoint.y, currentY);
      const width = Math.abs(currentX - shapeStartPoint.x);
      const height = Math.abs(currentY - shapeStartPoint.y);
      setLiveShapePreview({ x, y, width, height });
      return;
    }

    // 2. Element Resizing
    if (resizingHandle && initialResizeBounds && resizeStartPointer && selectedItem) {
      const dx = currentX - resizeStartPointer.x;
      const dy = currentY - resizeStartPointer.y;
      const b = initialResizeBounds;

      let newX = b.x;
      let newY = b.y;
      let newW = b.width;
      let newH = b.height;

      if (resizingHandle === "se") {
        newW = Math.max(0.02, b.width + dx);
        newH = Math.max(0.02, b.height + dy);
      } else if (resizingHandle === "sw") {
        newW = Math.max(0.02, b.width - dx);
        newX = b.x + (b.width - newW);
        newH = Math.max(0.02, b.height + dy);
      } else if (resizingHandle === "ne") {
        newW = Math.max(0.02, b.width + dx);
        newH = Math.max(0.02, b.height - dy);
        newY = b.y + (b.height - newH);
      } else if (resizingHandle === "nw") {
        newW = Math.max(0.02, b.width - dx);
        newX = b.x + (b.width - newW);
        newH = Math.max(0.02, b.height - dy);
        newY = b.y + (b.height - newH);
      }

      updateSelectedElementBounds(newX, newY, newW, newH);
      return;
    }

    // 3. Element Dragging (Move)
    if (isDragging && selectedItem) {
      const pageIdx = currentPage - 1;
      const cur = getPageEdits(pageIdx);
      const targetX = Math.max(0, Math.min(0.95, currentX - dragOffset.x));
      const targetY = Math.max(0, Math.min(0.95, currentY - dragOffset.y));

      if (selectedItem.type === "shape") {
        setEditsByPage((prev) => ({
          ...prev,
          [pageIdx]: {
            ...cur,
            shapes: cur.shapes.map((s) => (s.id === selectedItem.id ? { ...s, x: targetX, y: targetY } : s)),
          },
        }));
      } else if (selectedItem.type === "text") {
        setEditsByPage((prev) => ({
          ...prev,
          [pageIdx]: {
            ...cur,
            texts: cur.texts.map((t) => (t.id === selectedItem.id ? { ...t, x: targetX, y: targetY } : t)),
          },
        }));
      } else if (selectedItem.type === "image") {
        setEditsByPage((prev) => ({
          ...prev,
          [pageIdx]: {
            ...cur,
            images: cur.images.map((i) => (i.id === selectedItem.id ? { ...i, x: targetX, y: targetY } : i)),
          },
        }));
      }
    }
  };

  const handleContainerPointerUp = () => {
    // 1. Finish Drawing Shape
    if (isDrawingShape && liveShapePreview && shapeStartPoint) {
      setIsDrawingShape(false);
      setShapeStartPoint(null);

      if (liveShapePreview.width > 0.015 && liveShapePreview.height > 0.015) {
        const pageIdx = currentPage - 1;
        const newShapeId = "shape_" + Date.now();
        const newShape: ShapeAnnotation = {
          id: newShapeId,
          type: activeTool === "whiteout" ? "whiteout" : "rect",
          x: liveShapePreview.x,
          y: liveShapePreview.y,
          width: liveShapePreview.width,
          height: liveShapePreview.height,
          color: activeTool === "whiteout" ? "#ffffff" : rectBorderColor,
          fillColor: activeTool === "whiteout" ? "#ffffff" : "transparent",
          strokeWidth: rectStrokeWidth,
        };

        setEditsByPage((prev) => {
          const cur = prev[pageIdx] || { pageIndex: pageIdx, texts: [], strokes: [], shapes: [], images: [] };
          return {
            ...prev,
            [pageIdx]: {
              ...cur,
              shapes: [...cur.shapes, newShape],
            },
          };
        });

        setSelectedItem({ type: "shape", id: newShapeId });
        setActiveTool("select");
      }
      setLiveShapePreview(null);
    }

    // 2. Finish Dragging / Resizing
    setIsDragging(false);
    setResizingHandle(null);
    setInitialResizeBounds(null);
    setResizeStartPointer(null);
  };

  // Helper to update bounds during resizing
  const updateSelectedElementBounds = (x: number, y: number, width: number, height: number) => {
    if (!selectedItem) return;
    const pageIdx = currentPage - 1;
    const cur = getPageEdits(pageIdx);

    if (selectedItem.type === "shape") {
      setEditsByPage((prev) => ({
        ...prev,
        [pageIdx]: {
          ...cur,
          shapes: cur.shapes.map((s) => (s.id === selectedItem.id ? { ...s, x, y, width, height } : s)),
        },
      }));
    } else if (selectedItem.type === "image") {
      setEditsByPage((prev) => ({
        ...prev,
        [pageIdx]: {
          ...cur,
          images: cur.images.map((img) => (img.id === selectedItem.id ? { ...img, x, y, width, height } : img)),
        },
      }));
    }
  };

  // Delete currently selected item
  const handleDeleteSelected = () => {
    if (!selectedItem) return;
    const pageIdx = currentPage - 1;
    const cur = getPageEdits(pageIdx);

    if (selectedItem.type === "shape") {
      setEditsByPage((prev) => ({
        ...prev,
        [pageIdx]: { ...cur, shapes: cur.shapes.filter((s) => s.id !== selectedItem.id) },
      }));
    } else if (selectedItem.type === "text") {
      setEditsByPage((prev) => ({
        ...prev,
        [pageIdx]: { ...cur, texts: cur.texts.filter((t) => t.id !== selectedItem.id) },
      }));
    } else if (selectedItem.type === "image") {
      setEditsByPage((prev) => ({
        ...prev,
        [pageIdx]: { ...cur, images: cur.images.filter((i) => i.id !== selectedItem.id) },
      }));
    }
    setSelectedItem(null);
  };

  // Add Preset Stamp
  const handleAddStamp = (stampItem: typeof PRESET_STAMPS[0]) => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="160" height="60" viewBox="0 0 160 60">
        <rect x="2" y="2" width="156" height="56" rx="8" fill="${stampItem.bg}" stroke="${stampItem.color}" stroke-width="3" stroke-dasharray="4,2"/>
        <text x="80" y="30" font-family="sans-serif" font-weight="900" font-size="20" fill="${stampItem.color}" text-anchor="middle" dominant-baseline="middle">${stampItem.label}</text>
        <text x="80" y="47" font-family="sans-serif" font-weight="bold" font-size="9" fill="${stampItem.color}" text-anchor="middle" dominant-baseline="middle" opacity="0.8">${stampItem.en}</text>
      </svg>
    `;
    const dataUrl = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);

    const pageIdx = currentPage - 1;
    const newImageId = "img_" + Date.now();
    const newImage: ImageAnnotation = {
      id: newImageId,
      type: "image",
      x: 0.38,
      y: 0.25,
      width: 0.24,
      height: 0.09,
      dataUrl,
    };

    setEditsByPage((prev) => {
      const cur = prev[pageIdx] || { pageIndex: pageIdx, texts: [], strokes: [], shapes: [], images: [] };
      return {
        ...prev,
        [pageIdx]: {
          ...cur,
          images: [...cur.images, newImage],
        },
      };
    });
    setSelectedItem({ type: "image", id: newImageId });
    setActiveTool("select");
  };

  // Upload Custom Image/Stamp
  const handleImageUploaded = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imgFile = e.target.files?.[0];
    if (!imgFile) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const pageIdx = currentPage - 1;
      const newImageId = "img_" + Date.now();
      const newImage: ImageAnnotation = {
        id: newImageId,
        type: "image",
        x: 0.35,
        y: 0.2,
        width: 0.3,
        height: 0.15,
        dataUrl,
      };

      setEditsByPage((prev) => {
        const cur = prev[pageIdx] || { pageIndex: pageIdx, texts: [], strokes: [], shapes: [], images: [] };
        return {
          ...prev,
          [pageIdx]: {
            ...cur,
            images: [...cur.images, newImage],
          },
        };
      });
      setSelectedItem({ type: "image", id: newImageId });
      setActiveTool("select");
    };
    reader.readAsDataURL(imgFile);
  };

  // Undo last action on current page
  const handleUndo = () => {
    const pageIdx = currentPage - 1;
    setEditsByPage((prev) => {
      const cur = prev[pageIdx];
      if (!cur) return prev;
      if (cur.strokes.length > 0) {
        return { ...prev, [pageIdx]: { ...cur, strokes: cur.strokes.slice(0, -1) } };
      }
      if (cur.texts.length > 0) {
        return { ...prev, [pageIdx]: { ...cur, texts: cur.texts.slice(0, -1) } };
      }
      if (cur.shapes.length > 0) {
        return { ...prev, [pageIdx]: { ...cur, shapes: cur.shapes.slice(0, -1) } };
      }
      if (cur.images.length > 0) {
        return { ...prev, [pageIdx]: { ...cur, images: cur.images.slice(0, -1) } };
      }
      return prev;
    });
  };

  // Clear current page annotations
  const handleClearPage = () => {
    if (!confirm(t("edit_confirm_clear"))) return;
    const pageIdx = currentPage - 1;
    setEditsByPage((prev) => ({
      ...prev,
      [pageIdx]: { pageIndex: pageIdx, texts: [], strokes: [], shapes: [], images: [] },
    }));
    setSelectedItem(null);
  };

  // Rotate current page (delta: 90, -90, 180) and transform existing annotations to stay aligned
  const handleRotateCurrentPage = (delta: number) => {
    const pageIdx = currentPage - 1;
    const prevRot = pageRotations[pageIdx] || 0;
    const nextRot = ((prevRot + delta) % 360 + 360) % 360;

    // Transform existing annotations on this page to match the new orientation
    setEditsByPage((prev) => {
      const cur = prev[pageIdx];
      if (!cur) return prev;

      const transformPoint = (pt: { x: number; y: number }) => {
        if (delta === 90 || delta === -270) {
          return { x: 1 - pt.y, y: pt.x };
        } else if (delta === -90 || delta === 270) {
          return { x: pt.y, y: 1 - pt.x };
        } else {
          return { x: 1 - pt.x, y: 1 - pt.y };
        }
      };

      const transformBox = (b: { x: number; y: number; width: number; height: number }) => {
        if (delta === 90 || delta === -270) {
          return {
            x: 1 - b.y - b.height,
            y: b.x,
            width: b.height,
            height: b.width,
          };
        } else if (delta === -90 || delta === 270) {
          return {
            x: b.y,
            y: 1 - b.x - b.width,
            width: b.height,
            height: b.width,
          };
        } else {
          return {
            x: 1 - b.x - b.width,
            y: 1 - b.y - b.height,
            width: b.width,
            height: b.height,
          };
        }
      };

      return {
        ...prev,
        [pageIdx]: {
          ...cur,
          shapes: cur.shapes.map((s) => ({ ...s, ...transformBox(s) })),
          images: cur.images.map((img) => ({ ...img, ...transformBox(img) })),
          texts: cur.texts.map((t) => {
            const pt = transformPoint({ x: t.x, y: t.y });
            return { ...t, x: pt.x, y: pt.y };
          }),
          strokes: cur.strokes.map((st) => ({
            ...st,
            points: st.points.map(transformPoint),
          })),
        },
      };
    });

    setPageRotations((prev) => ({
      ...prev,
      [pageIdx]: nextRot,
    }));
    setSelectedItem(null);
  };

  // Rotate all pages in document simultaneously (e.g. for batch upside-down scanned docs)
  const handleRotateAllPages = (delta: number) => {
    const count = pageCount || 1;
    if (count <= 1) {
      handleRotateCurrentPage(delta);
      return;
    }
    setPageRotations((prev) => {
      const updated = { ...prev };
      for (let i = 0; i < count; i++) {
        const curR = prev[i] || 0;
        updated[i] = ((curR + delta) % 360 + 360) % 360;
      }
      return updated;
    });
    setSelectedItem(null);
  };

  // Fit-to-Width Zoom Helper: Fits the exact width of the workspace with comfortable padding
  const handleFitWidth = useCallback(() => {
    const scrollEl = workspaceScrollRef.current;
    if (!scrollEl) return;
    const paddingX = 64; // container padding + scrollbar allowance + safety margin
    const availW = Math.max(260, scrollEl.clientWidth - paddingX);
    const origW = pageSize.width || 595.28;
    if (origW > 0) {
      const targetZoom = Math.max(0.3, Math.min(2.5, availW / origW));
      setZoom(Math.round(targetZoom * 100) / 100);
      setActiveFitMode("width");
      scrollEl.scrollLeft = 0;
    }
  }, [pageSize.width]);

  // Fit-to-Page Zoom Helper: Fits both width and height completely inside the view
  const handleFitPage = useCallback(() => {
    const scrollEl = workspaceScrollRef.current;
    if (!scrollEl) return;
    const paddingX = 64;
    const paddingY = 40;
    const availW = Math.max(260, scrollEl.clientWidth - paddingX);
    const availH = Math.max(360, (scrollEl.clientHeight || 650) - paddingY);
    const origW = pageSize.width || 595.28;
    const origH = pageSize.height || 841.89;
    if (origW > 0 && origH > 0) {
      const scaleW = availW / origW;
      const scaleH = availH / origH;
      const targetZoom = Math.max(0.25, Math.min(2.5, Math.min(scaleW, scaleH)));
      setZoom(Math.round(targetZoom * 100) / 100);
      setActiveFitMode("page");
      scrollEl.scrollLeft = 0;
      scrollEl.scrollTop = 0;
    }
  }, [pageSize.width, pageSize.height]);

  // Auto-fit to width by default on initial document load once workspaceScrollRef is mounted
  useEffect(() => {
    if (pdfDoc && workspaceScrollRef.current && !hasAutoFitted) {
      const timer = setTimeout(() => {
        handleFitWidth();
        setActiveFitMode("width");
        setHasAutoFitted(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [pdfDoc, hasAutoFitted, handleFitWidth]);

  // Dynamic resize handler: Maintain width or page fit when browser window resizes
  useEffect(() => {
    const handleResize = () => {
      if (activeFitMode === "width") {
        handleFitWidth();
      } else if (activeFitMode === "page") {
        handleFitPage();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeFitMode, handleFitWidth, handleFitPage]);

  // Re-adjust fit when page dimensions change (e.g. upon 90° rotation or page switch)
  useEffect(() => {
    if (hasAutoFitted) {
      if (activeFitMode === "width") {
        handleFitWidth();
      } else if (activeFitMode === "page") {
        handleFitPage();
      }
    }
  }, [pageSize.width, pageSize.height, activeFitMode, hasAutoFitted, handleFitWidth, handleFitPage]);

  // Export & Download Edited PDF
  const handleExport = async () => {
    if (!file) return;

    try {
      setIsProcessing(true);
      setProgress(10);

      // Merge user pageRotations into editsByPage
      const editsWithRotations: Record<number, PageEdits> = {};
      const count = pageCount || 1;
      for (let i = 0; i < count; i++) {
        const cur = editsByPage[i] || {
          pageIndex: i,
          texts: [],
          strokes: [],
          shapes: [],
          images: [],
        };
        editsWithRotations[i] = {
          ...cur,
          rotation: pageRotations[i] || 0,
        };
      }

      const editedBytes = await exportEditedPdf(file, editsWithRotations, (p) => {
        setProgress(p);
      });

      setEditedResult(editedBytes);
      downloadBlob(editedBytes, "edited_" + file.name);
    } catch (err) {
      console.error("Export error:", err);
      alert(t("edit_error_save"));
    } finally {
      setIsProcessing(false);
    }
  };

  const curEdits = getPageEdits(currentPage - 1);

  return (
    <div className="py-6 sm:py-10 px-3 sm:px-6 lg:px-8 max-w-[1600px] mx-auto">
      <ToolHeader
        toolKey="edit"
        tag={t("badge_local_edit")}
      />

      <AdBanner format="horizontal" />

      {/* Main Studio Card */}
      <div className="bg-white rounded-3xl p-3 sm:p-6 lg:p-7 border border-slate-200/80 shadow-sm my-6">
        {!file ? (
          <div>
            <div className="flex justify-center mb-6">
              <StepBadge step={1} label={t("step_select_edit_pdf")} />
            </div>
            <div className="max-w-xl mx-auto">
              <FileDropzone
                onFilesSelected={handleFileSelected}
                accept=".pdf,application/pdf"
                multiple={false}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-5 items-start">
            {/* LEFT COLUMN: Workspace Canvas + Compact Navigation Header */}
            <div className="flex-1 w-full min-w-0 flex flex-col space-y-3">
              {/* Compact Top Navigation & Quick Controls */}
              <div className="p-2 sm:p-2.5 bg-slate-50/95 backdrop-blur-xs rounded-2xl border border-slate-200/90 flex flex-wrap items-center justify-between gap-2 shadow-xs">
                {/* Page Navigation & Shortcuts */}
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => {
                      setCurrentPage((p) => Math.max(1, p - 1));
                      setSelectedItem(null);
                    }}
                    className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 disabled:opacity-40 flex items-center gap-1 transition-colors"
                    title={t("edit_prev_page")}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{t("edit_prev_page")}</span>
                  </button>

                  <span className="text-xs font-bold font-mono text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-xl">
                    {currentPage} / {pageCount || 1}
                  </span>

                  <button
                    disabled={currentPage >= pageCount}
                    onClick={() => {
                      setCurrentPage((p) => Math.min(pageCount, p + 1));
                      setSelectedItem(null);
                    }}
                    className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 disabled:opacity-40 flex items-center gap-1 transition-colors"
                    title={t("edit_next_page")}
                  >
                    <span className="hidden sm:inline">{t("edit_next_page")}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="h-5 w-px bg-slate-300 mx-1" />

                  {/* Page Rotation Controls with Explanations */}
                  <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 gap-1 shadow-2xs">
                    <button
                      onClick={() => handleRotateCurrentPage(-90)}
                      className="px-2 py-1 rounded-lg hover:bg-slate-100 text-slate-700 flex items-center gap-1 text-[11px] font-bold transition-colors"
                      title={t("edit_rotate_ccw_tip")}
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
                      <span>{t("edit_rotate_ccw")}</span>
                    </button>
                    <button
                      onClick={() => handleRotateCurrentPage(90)}
                      className="px-2 py-1 rounded-lg hover:bg-slate-100 text-slate-700 flex items-center gap-1 text-[11px] font-bold transition-colors"
                      title={t("edit_rotate_cw_tip")}
                    >
                      <RotateCw className="w-3.5 h-3.5 text-slate-600" />
                      <span>{t("edit_rotate_cw")}</span>
                    </button>
                    <button
                      onClick={() => handleRotateCurrentPage(180)}
                      className="px-2 py-1 rounded-lg hover:bg-slate-100 text-slate-700 flex items-center gap-1 text-[11px] font-bold transition-colors"
                      title={t("edit_rotate_180_tip")}
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
                      <span>{t("edit_rotate_180")}</span>
                    </button>
                    {pageCount > 1 && (
                      <button
                        onClick={() => handleRotateAllPages(90)}
                        className="px-2 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-700 hidden md:flex items-center gap-1 text-[11px] font-bold transition-colors"
                        title={t("edit_rotate_all_tip")}
                      >
                        <RotateCw className="w-3 h-3 text-slate-500" />
                        <span>{t("edit_rotate_all")}</span>
                      </button>
                    )}
                    {(pageRotations[currentPage - 1] || 0) !== 0 && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold ml-0.5 whitespace-nowrap">
                        {pageRotations[currentPage - 1]}° {t("edit_rotated_badge")}
                      </span>
                    )}
                  </div>
                </div>

                {/* Utility actions: Undo, Clear, Quick Fit, Zoom */}
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <button
                    onClick={handleUndo}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors"
                    title={t("edit_undo")}
                  >
                    <Undo className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleClearPage}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-rose-50 hover:text-rose-600 text-xs font-bold transition-colors"
                    title={t("edit_clear_page")}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="h-5 w-px bg-slate-300 mx-1 hidden sm:block" />

                  {/* Quick Fit Controls with Visual Active Highlight */}
                  <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 hidden sm:flex">
                    <button
                      onClick={handleFitWidth}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
                        activeFitMode === "width"
                          ? "bg-blue-600 text-white shadow-xs font-black ring-1 ring-blue-600"
                          : "text-slate-600 hover:text-slate-900 hover:bg-white/80"
                      }`}
                      title={t("edit_fit_width_tip")}
                    >
                      <Maximize2 className="w-3 h-3" />
                      <span>{t("edit_fit_width")}</span>
                    </button>
                    <button
                      onClick={handleFitPage}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
                        activeFitMode === "page"
                          ? "bg-blue-600 text-white shadow-xs font-black ring-1 ring-blue-600"
                          : "text-slate-600 hover:text-slate-900 hover:bg-white/80"
                      }`}
                      title={t("edit_fit_page_tip")}
                    >
                      <Layers className="w-3 h-3" />
                      <span>{t("edit_fit_page")}</span>
                    </button>
                  </div>

                  {/* Zoom in/out */}
                  <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5">
                    <button
                      onClick={() => {
                        setActiveFitMode("custom");
                        setZoom((z) => Math.max(0.3, Math.round((z - 0.15) * 100) / 100));
                      }}
                      className="p-1 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                      title={t("edit_zoom_out")}
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11px] font-mono text-slate-600 min-w-[38px] text-center font-bold">
                      {Math.round(zoom * 100)}%
                    </span>
                    <button
                      onClick={() => {
                        setActiveFitMode("custom");
                        setZoom((z) => Math.min(2.5, Math.round((z + 0.15) * 100) / 100));
                      }}
                      className="p-1 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                      title={t("edit_zoom_in")}
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Workspace Canvas with Interactive Editing */}
              <div
                ref={workspaceScrollRef}
                className="relative bg-slate-200/90 p-3 sm:p-5 rounded-2xl overflow-auto h-[620px] sm:h-[680px] lg:h-[730px] xl:h-[780px] shadow-inner select-none flex justify-center items-start"
              >
                <div className="w-full min-w-max flex justify-center items-start py-2">
                  <div
                    ref={containerRef}
                    onPointerDown={handleContainerPointerDown}
                    onPointerMove={handleContainerPointerMove}
                    onPointerUp={handleContainerPointerUp}
                    className="relative bg-white shadow-2xl rounded-sm transition-all select-none border border-slate-300 shrink-0"
                    style={{
                      width: `${Math.round(pageSize.width * zoom)}px`,
                      height: `${Math.round(pageSize.height * zoom)}px`,
                      cursor:
                        activeTool === "pen" || activeTool === "highlighter" || activeTool === "rect" || activeTool === "whiteout"
                          ? "crosshair"
                          : activeTool === "text"
                          ? "text"
                          : activeTool === "editText"
                          ? "pointer"
                          : "default",
                    }}
                  >
                    {/* PDF Page Background Canvas (Guaranteed Render) */}
                    <canvas ref={bgCanvasRef} className="block pointer-events-none w-full h-full" />

                    {/* Drawing Canvas for Strokes */}
                    <canvas
                      ref={drawCanvasRef}
                      onPointerDown={handlePointerDown}
                      onPointerMove={handlePointerMove}
                      onPointerUp={handlePointerUp}
                      className={`absolute inset-0 z-10 w-full h-full ${
                        activeTool === "pen" || activeTool === "highlighter" ? "pointer-events-auto" : "pointer-events-none"
                      }`}
                    />

                    {/* 1. PDF Detected Existing Text Overlay (Click to Edit) */}
                    {activeTool === "editText" && (
                      <div className="absolute inset-0 z-20 pointer-events-auto">
                        {detectedTexts.map((item) => (
                          <div
                            key={item.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditDetectedText(item);
                            }}
                            style={{
                              position: "absolute",
                              left: `${item.x * 100}%`,
                              top: `${item.y * 100}%`,
                              width: `${item.width * 100}%`,
                              height: `${item.height * 100}%`,
                            }}
                            className="border border-dashed border-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/25 cursor-pointer rounded-xs transition-colors group flex items-center"
                            title={`${t("edit_tip_modify")}: "${item.str}"`}
                          >
                            <span className="opacity-0 group-hover:opacity-100 text-[9px] bg-indigo-600 text-white px-1 py-0.2 rounded absolute -top-4 left-0 whitespace-nowrap shadow-xs pointer-events-none z-30">
                              {t("edit_click_to_modify")}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 2. Live Shape Drawing Preview */}
                    {isDrawingShape && liveShapePreview && (
                      <div
                        style={{
                          position: "absolute",
                          left: `${liveShapePreview.x * 100}%`,
                          top: `${liveShapePreview.y * 100}%`,
                          width: `${liveShapePreview.width * 100}%`,
                          height: `${liveShapePreview.height * 100}%`,
                          border: activeTool === "whiteout" ? "2px dashed #94a3b8" : `2px solid ${rectBorderColor}`,
                          backgroundColor: activeTool === "whiteout" ? "rgba(255,255,255,0.85)" : "rgba(37,99,235,0.1)",
                        }}
                        className="z-30 pointer-events-none flex items-center justify-center text-[10px] font-bold text-slate-700 bg-white/20"
                      >
                        <span>
                          {activeTool === "whiteout" ? t("edit_whiteout") : t("edit_rect_box")}
                        </span>
                      </div>
                    )}

                    {/* 3. Render Shapes (Border Boxes & Whiteouts) with Move and Resize Handles */}
                    {curEdits.shapes.map((shp) => {
                      const isSelected = selectedItem?.type === "shape" && selectedItem.id === shp.id;

                      return (
                        <div
                          key={shp.id}
                          onPointerDown={(e) => {
                            e.stopPropagation();
                            setSelectedItem({ type: "shape", id: shp.id });
                            if (!containerRef.current) return;
                            const rect = containerRef.current.getBoundingClientRect();
                            const pointerX = (e.clientX - rect.left) / rect.width;
                            const pointerY = (e.clientY - rect.top) / rect.height;
                            setIsDragging(true);
                            setDragOffset({ x: pointerX - shp.x, y: pointerY - shp.y });
                          }}
                          style={{
                            position: "absolute",
                            left: `${shp.x * 100}%`,
                            top: `${shp.y * 100}%`,
                            width: `${shp.width * 100}%`,
                            height: `${shp.height * 100}%`,
                            backgroundColor: shp.type === "whiteout" ? "#ffffff" : shp.fillColor || "transparent",
                            border: shp.type === "whiteout" ? "1px dashed #cbd5e1" : `${shp.strokeWidth || 2}px solid ${shp.color || "#2563eb"}`,
                          }}
                          className={`z-25 group cursor-move ${
                            isSelected ? "ring-2 ring-blue-500 ring-offset-1 shadow-md" : "hover:outline hover:outline-1 hover:outline-blue-300"
                          }`}
                        >
                          {isSelected && (
                            <>
                              <div className="absolute -top-6 -left-1 px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[9px] font-bold shadow-xs flex items-center gap-0.5 whitespace-nowrap pointer-events-none z-40">
                                <span>{t("edit_start_point")}</span>
                              </div>

                              <div className="absolute -bottom-6 -right-1 px-1.5 py-0.5 rounded bg-blue-600 text-white text-[9px] font-bold shadow-xs flex items-center gap-0.5 whitespace-nowrap pointer-events-none z-40">
                                <span>{t("edit_end_point")}</span>
                              </div>

                              <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-2 py-1 rounded-lg shadow-lg flex items-center gap-2 text-[11px] z-50 whitespace-nowrap">
                                <span className="font-bold text-slate-300">
                                  {shp.type === "whiteout" ? t("edit_whiteout") : t("edit_rect_box")}
                                </span>
                                <div className="h-3 w-px bg-slate-700" />
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteSelected();
                                  }}
                                  className="text-rose-400 hover:text-rose-300 flex items-center gap-0.5 font-bold"
                                  title={t("edit_delete")}
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>{t("edit_delete")}</span>
                                </button>
                              </div>

                              {(["nw", "ne", "sw", "se"] as const).map((handle) => {
                                const isNW = handle === "nw";
                                const isNE = handle === "ne";
                                const isSW = handle === "sw";
                                const isSE = handle === "se";

                                return (
                                  <div
                                    key={handle}
                                    onPointerDown={(e) => {
                                      e.stopPropagation();
                                      if (!containerRef.current) return;
                                      const rect = containerRef.current.getBoundingClientRect();
                                      setResizingHandle(handle);
                                      setInitialResizeBounds({ x: shp.x, y: shp.y, width: shp.width, height: shp.height });
                                      setResizeStartPointer({
                                        x: (e.clientX - rect.left) / rect.width,
                                        y: (e.clientY - rect.top) / rect.height,
                                      });
                                    }}
                                    style={{
                                      position: "absolute",
                                      top: isNW || isNE ? "-6px" : undefined,
                                      bottom: isSW || isSE ? "-6px" : undefined,
                                      left: isNW || isSW ? "-6px" : undefined,
                                      right: isNE || isSE ? "-6px" : undefined,
                                      cursor: isNW || isSE ? "nwse-resize" : "nesw-resize",
                                    }}
                                    className="w-3.5 h-3.5 bg-white border-2 border-blue-600 rounded-full shadow-sm z-40 hover:scale-125 transition-transform"
                                  />
                                );
                              })}
                            </>
                          )}
                        </div>
                      );
                    })}

                    {/* 4. Render Images & Stamps with Move and Resize Handles */}
                    {curEdits.images.map((img) => {
                      const isSelected = selectedItem?.type === "image" && selectedItem.id === img.id;

                      return (
                        <div
                          key={img.id}
                          onPointerDown={(e) => {
                            e.stopPropagation();
                            setSelectedItem({ type: "image", id: img.id });
                            if (!containerRef.current) return;
                            const rect = containerRef.current.getBoundingClientRect();
                            const pointerX = (e.clientX - rect.left) / rect.width;
                            const pointerY = (e.clientY - rect.top) / rect.height;
                            setIsDragging(true);
                            setDragOffset({ x: pointerX - img.x, y: pointerY - img.y });
                          }}
                          style={{
                            position: "absolute",
                            left: `${img.x * 100}%`,
                            top: `${img.y * 100}%`,
                            width: `${img.width * 100}%`,
                            height: `${img.height * 100}%`,
                          }}
                          className={`z-25 group cursor-move ${
                            isSelected ? "ring-2 ring-indigo-500 shadow-lg" : "hover:outline hover:outline-1 hover:outline-indigo-300"
                          }`}
                        >
                          <img
                            src={img.dataUrl}
                            alt="stamp"
                            className="w-full h-full object-contain pointer-events-none select-none"
                          />

                          {isSelected && (
                            <>
                              <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-2 py-1 rounded-lg shadow-lg flex items-center gap-2 text-[11px] z-50 whitespace-nowrap">
                                <span className="font-bold text-slate-300">{t("edit_stamp_image")}</span>
                                <div className="h-3 w-px bg-slate-700" />
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteSelected();
                                  }}
                                  className="text-rose-400 hover:text-rose-300 flex items-center gap-0.5 font-bold"
                                  title={t("edit_delete")}
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>{t("edit_delete")}</span>
                                </button>
                              </div>

                              {(["nw", "ne", "sw", "se"] as const).map((handle) => {
                                const isNW = handle === "nw";
                                const isNE = handle === "ne";
                                const isSW = handle === "sw";
                                const isSE = handle === "se";

                                return (
                                  <div
                                    key={handle}
                                    onPointerDown={(e) => {
                                      e.stopPropagation();
                                      if (!containerRef.current) return;
                                      const rect = containerRef.current.getBoundingClientRect();
                                      setResizingHandle(handle);
                                      setInitialResizeBounds({ x: img.x, y: img.y, width: img.width, height: img.height });
                                      setResizeStartPointer({
                                        x: (e.clientX - rect.left) / rect.width,
                                        y: (e.clientY - rect.top) / rect.height,
                                      });
                                    }}
                                    style={{
                                      position: "absolute",
                                      top: isNW || isNE ? "-6px" : undefined,
                                      bottom: isSW || isSE ? "-6px" : undefined,
                                      left: isNW || isSW ? "-6px" : undefined,
                                      right: isNE || isSE ? "-6px" : undefined,
                                      cursor: isNW || isSE ? "nwse-resize" : "nesw-resize",
                                    }}
                                    className="w-3.5 h-3.5 bg-white border-2 border-indigo-600 rounded-full shadow-sm z-40 hover:scale-125 transition-transform"
                                  />
                                );
                              })}
                            </>
                          )}
                        </div>
                      );
                    })}

                    {/* 5. Render Texts with Inline Modification & Drag Move */}
                    {curEdits.texts.map((txt) => {
                      const isSelected = selectedItem?.type === "text" && selectedItem.id === txt.id;

                      return (
                        <div
                          key={txt.id}
                          onPointerDown={(e) => {
                            e.stopPropagation();
                            setSelectedItem({ type: "text", id: txt.id });
                            if (!containerRef.current) return;
                            const rect = containerRef.current.getBoundingClientRect();
                            const pointerX = (e.clientX - rect.left) / rect.width;
                            const pointerY = (e.clientY - rect.top) / rect.height;
                            setIsDragging(true);
                            setDragOffset({ x: pointerX - txt.x, y: pointerY - txt.y });
                          }}
                          style={{
                            position: "absolute",
                            left: `${txt.x * 100}%`,
                            top: `${txt.y * 100}%`,
                          }}
                          className={`z-30 group cursor-move ${
                            isSelected ? "ring-2 ring-rose-500 rounded-lg p-1 bg-white/95 shadow-lg" : "hover:outline hover:outline-1 hover:outline-rose-300"
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute -top-9 left-0 bg-slate-900 text-white px-2 py-1 rounded-lg shadow-lg flex items-center gap-2 text-[11px] z-50 whitespace-nowrap">
                              <span className="font-bold text-slate-300">{t("edit_text_item")}</span>
                              <div className="h-3 w-px bg-slate-700" />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteSelected();
                                }}
                                className="text-rose-400 hover:text-rose-300 flex items-center gap-0.5 font-bold"
                                title={t("edit_delete")}
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>{t("edit_delete")}</span>
                              </button>
                            </div>
                          )}

                          <div
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => {
                              const newStr = e.currentTarget.innerText;
                              const pageIdx = currentPage - 1;
                              setEditsByPage((prev) => ({
                                ...prev,
                                [pageIdx]: {
                                  ...curEdits,
                                  texts: curEdits.texts.map((t) => (t.id === txt.id ? { ...t, text: newStr } : t)),
                                },
                              }));
                            }}
                            style={{
                              fontSize: `${txt.fontSize * zoom}px`,
                              color: txt.color,
                              fontWeight: txt.bold ? "bold" : "normal",
                              lineHeight: 1.25,
                            }}
                            className="outline-none min-w-[20px] whitespace-pre cursor-text select-text"
                          >
                            {txt.text}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom Security / Tip Info */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-2 py-1 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{t("edit_memory_safe_notice")}</span>
                </div>
                <div className="text-[11px] text-slate-400 font-medium">
                  {t("edit_canvas_interaction_hint")}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Dedicated Editing Tools Sidebar */}
            <div className="w-full lg:w-80 xl:w-96 shrink-0 flex flex-col space-y-3.5">
              {/* Card 1: Document Info & Download CTA */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold shrink-0">
                      <PenTool className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate" title={file.name}>
                        {file.name}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 font-bold">
                          {t("pages_total_count").replace("{count}", String(pageCount))}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {currentPage} / {pageCount} {t("edit_editing_page")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setFile(null);
                      setPdfDoc(null);
                      setEditsByPage({});
                      setPageRotations({});
                      setSelectedItem(null);
                      setHasAutoFitted(false);
                    }}
                    className="text-xs text-slate-500 hover:text-slate-800 underline shrink-0 font-medium"
                  >
                    {t("edit_other_file")}
                  </button>
                </div>

                {/* Primary Download Button */}
                <button
                  onClick={handleExport}
                  disabled={isProcessing}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  <Download className="w-4 h-4" />
                  <span>{isProcessing ? t("edit_exporting") : t("edit_finish_download")}</span>
                </button>
              </div>

              {/* Card 2: Tool Palette */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-600" />
                    {t("edit_tools_title")}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {activeTool === "select"
                      ? t("edit_tool_select")
                      : activeTool === "editText"
                      ? t("edit_tool_edit_text")
                      : activeTool === "text"
                      ? t("edit_tool_add_text")
                      : activeTool === "rect"
                      ? t("edit_tool_rect")
                      : activeTool === "whiteout"
                      ? t("edit_tool_whiteout")
                      : activeTool === "pen"
                      ? t("edit_tool_pen")
                      : activeTool === "highlighter"
                      ? t("edit_tool_highlighter")
                      : t("edit_tool_selected")}
                  </span>
                </div>

                {/* 2-Column Grid of Tools */}
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => setActiveTool("select")}
                    className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                      activeTool === "select"
                        ? "bg-slate-900 text-white shadow-xs"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/60"
                    }`}
                  >
                    <MousePointer className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{t("edit_tool_select")}</span>
                  </button>

                  <button
                    onClick={() => setActiveTool("editText")}
                    className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-between gap-1 transition-all ${
                      activeTool === "editText"
                        ? "bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-300"
                        : "bg-indigo-50/70 text-indigo-700 hover:bg-indigo-100/70 border border-indigo-200/70"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <ScanText className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{t("edit_tool_edit_text")}</span>
                    </div>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-indigo-200/80 text-indigo-800 font-bold shrink-0">{t("edit_badge_popular")}</span>
                  </button>

                  <button
                    onClick={() => setActiveTool("text")}
                    className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                      activeTool === "text"
                        ? "bg-rose-600 text-white shadow-xs"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/60"
                    }`}
                  >
                    <Type className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{t("edit_tool_add_text")}</span>
                  </button>

                  <button
                    onClick={() => setActiveTool("rect")}
                    className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                      activeTool === "rect"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/60"
                    }`}
                  >
                    <Square className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{t("edit_tool_rect")}</span>
                  </button>

                  <button
                    onClick={() => setActiveTool("whiteout")}
                    className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                      activeTool === "whiteout"
                        ? "bg-slate-700 text-white shadow-xs"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/60"
                    }`}
                  >
                    <Eraser className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{t("edit_tool_whiteout")}</span>
                  </button>

                  <button
                    onClick={() => setActiveTool("pen")}
                    className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                      activeTool === "pen"
                        ? "bg-rose-600 text-white shadow-xs"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/60"
                    }`}
                  >
                    <PenTool className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{t("edit_tool_pen")}</span>
                  </button>

                  <button
                    onClick={() => setActiveTool("highlighter")}
                    className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all col-span-2 ${
                      activeTool === "highlighter"
                        ? "bg-amber-500 text-white shadow-xs"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/60"
                    }`}
                  >
                    <Highlighter className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{t("edit_tool_highlighter")}</span>
                  </button>
                </div>
              </div>

              {/* Card 3: Contextual Tool Settings */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-rose-500" />
                    {t("edit_tool_settings_title")}
                  </span>
                  {selectedItem && (
                    <button
                      onClick={handleDeleteSelected}
                      className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      {t("edit_delete_selected")}
                    </button>
                  )}
                </div>

                {/* A. When editText is active */}
                {activeTool === "editText" && (
                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-indigo-50/80 rounded-xl border border-indigo-200 text-indigo-900 space-y-1">
                      <div className="font-bold flex items-center gap-1.5">
                        <ScanText className="w-4 h-4 text-indigo-600" />
                        <span>{detectedTexts.length} {t("edit_detected_count")}</span>
                      </div>
                      <p className="text-[11px] text-indigo-700 leading-relaxed">
                        {t("edit_detected_guide")}
                      </p>
                    </div>
                  </div>
                )}

                {/* B. When text is active or a text item is selected */}
                {(activeTool === "text" || selectedItem?.type === "text") && (
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1.5">{t("edit_font_color")}</label>
                      <div className="flex items-center gap-2">
                        {["#000000", "#2563eb", "#dc2626", "#16a34a", "#9333ea"].map((c) => (
                          <button
                            key={c}
                            onClick={() => setTextColor(c)}
                            style={{ backgroundColor: c }}
                            className={`w-6 h-6 rounded-full border-2 transition-transform ${
                              textColor === c ? "scale-110 border-slate-900 shadow-sm" : "border-white"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1.5">{t("edit_font_size_style")}</label>
                      <div className="flex items-center gap-1 flex-wrap">
                        {[12, 14, 18, 24, 32].map((sz) => (
                          <button
                            key={sz}
                            onClick={() => setFontSize(sz)}
                            className={`px-2.5 py-1 rounded-lg border text-xs font-bold ${
                              fontSize === sz ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            {sz}px
                          </button>
                        ))}
                        <button
                          onClick={() => setIsBold((b) => !b)}
                          className={`px-2.5 py-1 rounded-lg border text-xs font-bold flex items-center gap-1 ${
                            isBold ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <Bold className="w-3 h-3" />
                          {t("edit_bold")}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* C. When rect is active or a shape is selected */}
                {(activeTool === "rect" || (selectedItem?.type === "shape" && activeTool !== "whiteout")) && (
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1.5">{t("edit_border_color")}</label>
                      <div className="flex items-center gap-2">
                        {["#2563eb", "#ef4444", "#000000", "#16a34a", "#9333ea"].map((c) => (
                          <button
                            key={c}
                            onClick={() => setRectBorderColor(c)}
                            style={{ backgroundColor: c }}
                            className={`w-6 h-6 rounded-full border-2 transition-transform ${
                              rectBorderColor === c ? "scale-110 border-slate-900 shadow-sm" : "border-white"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1.5">{t("edit_border_width")}</label>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4].map((w) => (
                          <button
                            key={w}
                            onClick={() => setRectStrokeWidth(w)}
                            className={`flex-1 py-1 rounded-lg border text-xs font-bold text-center ${
                              rectStrokeWidth === w ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            {w}px
                          </button>
                        ))}
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {t("edit_rect_guide")}
                    </p>
                  </div>
                )}

                {/* D. When whiteout is active */}
                {activeTool === "whiteout" && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                    <span className="font-bold flex items-center gap-1.5">
                      <Eraser className="w-4 h-4 text-slate-600" />
                      {t("edit_whiteout")}
                    </span>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {t("edit_whiteout_guide")}
                    </p>
                  </div>
                )}

                {/* E. When pen is active */}
                {activeTool === "pen" && (
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1.5">{t("edit_pen_color")}</label>
                      <div className="flex items-center gap-2">
                        {["#ef4444", "#2563eb", "#000000", "#16a34a", "#9333ea"].map((c) => (
                          <button
                            key={c}
                            onClick={() => setPenColor(c)}
                            style={{ backgroundColor: c }}
                            className={`w-6 h-6 rounded-full border-2 transition-transform ${
                              penColor === c ? "scale-110 border-slate-900 shadow-sm" : "border-white"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1.5">{t("edit_pen_width")}</label>
                      <div className="flex items-center gap-1.5">
                        {[2, 3, 5, 8].map((w) => (
                          <button
                            key={w}
                            onClick={() => setPenWidth(w)}
                            className={`flex-1 py-1 rounded-lg border text-xs font-bold text-center ${
                              penWidth === w ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            {w}px
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* F. When highlighter is active */}
                {activeTool === "highlighter" && (
                  <div className="space-y-3 text-xs">
                    <label className="text-[11px] font-bold text-slate-600 block mb-1.5">{t("edit_highlighter_color")}</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { color: "#facc15", name: t("edit_color_yellow") },
                        { color: "#4ade80", name: t("edit_color_green") },
                        { color: "#f472b6", name: t("edit_color_pink") },
                        { color: "#38bdf8", name: t("edit_color_cyan") },
                      ].map((item) => (
                        <button
                          key={item.color}
                          onClick={() => setHighlighterColor(item.color)}
                          style={{ backgroundColor: item.color }}
                          className={`py-1.5 rounded-xl border text-xs font-bold text-slate-800 transition-all ${
                            highlighterColor === item.color ? "ring-2 ring-slate-900 font-black shadow-xs" : "border-slate-200"
                          }`}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* G. Default select mode with nothing selected */}
                {activeTool === "select" && !selectedItem && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 space-y-1">
                    <span className="font-bold text-slate-700 block">{t("edit_select_guide_title")}</span>
                    <p className="text-[11px] leading-relaxed">
                      {t("edit_select_guide_desc")}
                    </p>
                  </div>
                )}
              </div>

              {/* Card 4: Stamps & Signature Images */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    {t("edit_stamps_title")}
                  </span>
                </div>

                {/* Preset Stamps */}
                <div className="grid grid-cols-3 gap-1.5">
                  {PRESET_STAMPS.map((st) => (
                    <button
                      key={st.en}
                      onClick={() => handleAddStamp(st)}
                      className="px-2 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 text-[11px] font-bold text-slate-700 hover:bg-slate-100 transition-colors truncate"
                      title={(t(st.key as any) || st.label) + " " + t("edit_tool_selected")}
                    >
                      {t(st.key as any) || st.label}
                    </button>
                  ))}
                </div>

                {/* Custom Stamp Upload */}
                <button
                  onClick={() => imageInputRef.current?.click()}
                  className="w-full py-2.5 px-3 rounded-xl bg-indigo-50/70 border border-indigo-200 text-xs font-bold text-indigo-700 hover:bg-indigo-100/70 flex items-center justify-center gap-1.5 transition-colors"
                  title={t("edit_upload_stamp_tip")}
                >
                  <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{t("edit_upload_stamp")}</span>
                </button>
                <input
                  type="file"
                  ref={imageInputRef}
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleImageUploaded}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Processing Modal Overlay */}
      <ProcessingOverlay
        isProcessing={isProcessing}
        progress={progress}
        message={t("edit_processing_overlay_msg")}
      />

      {/* Mascot Notice */}
      <div className="my-8">
        <MascotActionNotice
          mood="ready"
          title={t("edit_mascot_title")}
          description={t("edit_mascot_desc")}
          actionHint={t("edit_mascot_hint")}
        />
      </div>

      <HowToSection
        toolName="PDF"
        steps={[
          {
            step: 1,
            title: t("edit_howto_step1_title"),
            desc: t("edit_howto_step1_desc"),
          },
          {
            step: 2,
            title: t("edit_howto_step2_title"),
            desc: t("edit_howto_step2_desc"),
          },
          {
            step: 3,
            title: t("edit_howto_step3_title"),
            desc: t("edit_howto_step3_desc"),
          },
          {
            step: 4,
            title: t("edit_howto_step4_title"),
            desc: t("edit_howto_step4_desc"),
          },
        ]}
      />

      <FaqSection
        items={[
          {
            question: t("edit_faq_q1"),
            answer: t("edit_faq_a1"),
          },
          {
            question: t("edit_faq_q2"),
            answer: t("edit_faq_a2"),
          },
          {
            question: t("edit_faq_q3"),
            answer: t("edit_faq_a3"),
          },
          {
            question: t("edit_faq_q4"),
            answer: t("edit_faq_a4"),
          },
        ]}
      />

      <AdBanner format="horizontal" />
    </div>
  );
}
