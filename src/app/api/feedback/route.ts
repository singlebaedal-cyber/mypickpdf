import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export interface FeedbackEntry {
  id: string;
  timestamp: string;
  category: string;
  message: string;
  screenshot?: string;
  imageCategory?: string;
  isErrorScreenshot?: boolean;
  userEmail?: string;
  currentUrl?: string;
  resolvedOnSpot: boolean;
  needsOwnerDecision: boolean;
  aiDiagnosticSummary?: string;
}

const CRITICAL_KEYWORDS = [
  "유료", "결제", "제휴", "비즈니스", "광고문의", "법적", "저작권", 
  "계약", "사업", "운영자", "개발자", "partnership", "business", "legal"
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { category, message, screenshot, imageCategory, isErrorScreenshot, userEmail, currentUrl, resolvedOnSpot, aiDiagnosticSummary } = body;

    const trimmedMsg = typeof message === "string" ? message.trim() : "";
    if (!trimmedMsg && !screenshot) {
      return NextResponse.json({ error: "의견 내용이나 캡쳐 사진을 등록해 주세요." }, { status: 400 });
    }

    const ticketId = `TKT-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;
    const lowerMessage = (trimmedMsg || "").toLowerCase();
    
    // Check if owner intervention is required
    const needsOwnerDecision = CRITICAL_KEYWORDS.some((kw) => lowerMessage.includes(kw));

    const feedbackEntry: FeedbackEntry = {
      id: ticketId,
      timestamp: new Date().toISOString(),
      category: category || (screenshot ? "screenshot_analysis" : "general"),
      message: trimmedMsg || "📸 [캡쳐 화면 첨부] 스크린샷 비전 정밀 분석 요청",
      screenshot: screenshot ? String(screenshot) : undefined,
      imageCategory: imageCategory ? String(imageCategory) : undefined,
      isErrorScreenshot: typeof isErrorScreenshot === "boolean" ? isErrorScreenshot : undefined,
      userEmail: userEmail ? userEmail.trim() : undefined,
      currentUrl: currentUrl || "/",
      resolvedOnSpot: Boolean(resolvedOnSpot),
      needsOwnerDecision,
      aiDiagnosticSummary: aiDiagnosticSummary || (screenshot ? "캡쳐 이미지 비전 정밀 분석 완료" : "사용자 의견 접수됨"),
    };

    // Log to server console / storage
    console.log("[AI Feedback Logged]", JSON.stringify(feedbackEntry, null, 2));

    // Optional: write to feedback backlog if running in environment with filesystem
    try {
      const backlogDir = path.join(process.cwd(), "data");
      if (!fs.existsSync(backlogDir)) {
        fs.mkdirSync(backlogDir, { recursive: true });
      }
      const filePath = path.join(backlogDir, "feedback_backlog.json");
      let currentLogs: FeedbackEntry[] = [];
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        currentLogs = JSON.parse(fileContent);
      }
      currentLogs.unshift(feedbackEntry);
      // Keep recent 200 logs
      fs.writeFileSync(filePath, JSON.stringify(currentLogs.slice(0, 200), null, 2), "utf-8");
    } catch (fsErr) {
      // In read-only serverless environments, fs error is safely ignored
      console.warn("Backlog file write skipped in serverless environment:", fsErr);
    }

    return NextResponse.json({
      success: true,
      ticketId,
      needsOwnerDecision,
      ownerEmail: needsOwnerDecision ? "fbihan@naver.com" : undefined,
      message: needsOwnerDecision
        ? "운영자(fbihan@naver.com)의 검토가 필요한 중요 내용으로 분류되어 전달되었습니다."
        : "AI 피드백 백로그에 정상 등록되었습니다. 프로그램 개선에 반영됩니다!",
    });
  } catch (err: any) {
    console.error("Feedback API error:", err);
    return NextResponse.json({ error: "피드백 처리 중 오류가 발생했습니다." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "feedback_backlog.json");
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      return NextResponse.json(JSON.parse(fileContent));
    }
    return NextResponse.json([]);
  } catch {
    return NextResponse.json([]);
  }
}
