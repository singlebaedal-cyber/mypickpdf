import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "서비스 이용약관",
  description: "mypickpdf의 무료 온라인 서비스 이용 규정 및 책임 한계 안내입니다.",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm">
        <h1 className="text-3xl font-black text-slate-900 mb-6">서비스 이용약관 (Terms of Service)</h1>
        <p className="text-sm text-slate-500 mb-8">시행일자: {new Date().toLocaleDateString("ko-KR")}</p>

        <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-6 text-slate-700">
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">제1조 (목적)</h2>
            <p>
              본 약관은 mypickpdf(마이픽피디에프, 이하 &quot;서비스&quot;)가 제공하는 모든 웹 기반 PDF 편집 및 변환 유틸리티 도구의 이용 조건 및 절차에 관한 기본적인 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">제2조 (서비스의 무료 제공 원칙)</h2>
            <p>
              1. 본 서비스는 모든 이용자에게 회원가입이나 로그인 없이 100% 무료로 제공됩니다.<br />
              2. 개인, 학생, 공공기관, 기업 등 상업적 및 비상업적 용도에 관계없이 자유롭게 활용할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">제3조 (사용자의 권리 및 데이터 소유권)</h2>
            <p>
              사용자가 본 서비스를 통해 가공, 병합, 변환하는 모든 원본 문서 및 생성된 파일에 대한 저작권 및 소유권은 전적으로 사용자 본인에게 있습니다.
              본 서비스는 가공된 문서 데이터에 대한 어떠한 권리도 주장하지 않으며, 서버에 저장하지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">제4조 (면책 조항)</h2>
            <p>
              1. 본 서비스는 소프트웨어 사용으로 인해 발생할 수 있는 데이터 손실, 호환성 오류, 브라우저 메모리 한계로 인한 비정상 종료 등에 대해 법적 책임을 지지 않습니다.<br />
              2. 중요한 원본 문서는 작업 전 반드시 별도의 백업을 유지하시기 바랍니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">제5조 (운영자 정보 및 문의처)</h2>
            <p>
              서비스 이용 중 발생하는 건의사항, 제휴, 오류 제보는 개발자 공식 이메일(<a href="mailto:fbihan@naver.com" className="text-rose-600 font-bold underline">fbihan@naver.com</a>)을 통해 언제든지 접수하실 수 있습니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
