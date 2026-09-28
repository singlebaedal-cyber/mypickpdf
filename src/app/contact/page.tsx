import type { Metadata } from "next";
import { Mail, MessageSquare, ShieldCheck, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "문의하기 & 서비스 소개",
  description: "mypickpdf 서비스 소개 및 기술 문의, 기능 건의, 버그 제보 안내입니다.",
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm">
        <h1 className="text-3xl font-black text-slate-900 mb-4">문의하기 & 서비스 소개</h1>
        <p className="text-base text-slate-600 mb-8 leading-relaxed">
          mypickpdf(마이픽피디에프)는 복잡한 소프트웨어 설치나 유료 구독 없이도, 누구나 웹 브라우저에서 안전하고 빠르게 PDF를 다룰 수 있도록 개발된 무료 오픈 웹 유틸리티 서비스입니다.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">개발자 문의 및 건의사항</h3>
              <p className="text-xs text-slate-500 mb-2">기능 제안, 버그 리포트, 사용 의견, 제휴 문의</p>
              <a href="mailto:fbihan@naver.com" className="text-sm font-bold text-rose-600 hover:underline">
                fbihan@naver.com
              </a>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">개인정보보호 및 보안 책임자</h3>
              <p className="text-xs text-slate-500 mb-2">클라이언트 데이터 로컬 처리 기술 및 프라이버시 문의</p>
              <a href="mailto:fbihan@naver.com" className="text-sm font-bold text-emerald-600 hover:underline">
                fbihan@naver.com
              </a>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-rose-50/50 border border-rose-100">
          <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-rose-600" /> 자주 묻는 질문 빠른 확인
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            &quot;파일 용량 제한이 있나요?&quot;, &quot;모바일에서도 작동하나요?&quot; 등의 일반적인 질문은 각 도구 페이지 하단의 [자주 묻는 질문(FAQ)] 섹션에서 바로 확인하실 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
