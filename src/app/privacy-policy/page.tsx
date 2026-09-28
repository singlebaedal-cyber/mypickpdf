import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "mypickpdf는 사용자의 문서를 서버에 저장하거나 전송하지 않습니다. 완벽한 클라이언트 사이드 보안 정책을 확인하세요.",
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm">
        <h1 className="text-3xl font-black text-slate-900 mb-6">개인정보처리방침 (Privacy Policy)</h1>
        <p className="text-sm text-slate-500 mb-8">최종 수정일: {new Date().toLocaleDateString("ko-KR")}</p>

        <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-6 text-slate-700">
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">1. 기본 방침 및 문서 처리 원칙 (100% 로컬 처리)</h2>
            <p>
              mypickpdf(마이픽피디에프, 이하 &quot;서비스&quot;)는 사용자의 개인정보와 문서의 기밀성을 최우선으로 존중합니다.
              본 서비스의 가장 큰 기술적 특징은 <strong>&quot;클라이언트 사이드(Client-Side) 브라우저 로컬 처리&quot;</strong> 방식입니다.
              사용자가 업로드하는 PDF, 이미지, 텍스트 등의 모든 파일 데이터는 사용자의 웹 브라우저 메모리 안에서만 가공되며,
              <strong>어떠한 경우에도 외부 원격 서버로 전송되거나 저장되지 않습니다.</strong>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">2. 수집하는 개인정보 항목</h2>
            <p>
              본 서비스는 로그인 및 회원가입 기능을 일체 제공하지 않으므로, 이름, 전화번호, 이메일, 주민등록번호 등 사용자를 직접 식별할 수 있는 어떠한 개인정보도 수집 및 보관하지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">3. 구글 애드센스 및 제3자 쿠키(Cookie) 안내</h2>
            <p>
              본 서비스는 무료 웹 서비스 운영 비용을 충당하기 위해 제3자 광고 네트워크인 <strong>구글 애드센스 (Google AdSense)</strong>를 게재하고 있습니다.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-600">
              <li>Google을 포함한 제3자 공급업체는 사용자의 이전 웹사이트 방문 기록을 바탕으로 관련성 높은 광고를 게재하기 위해 쿠키(Cookie)를 사용합니다.</li>
              <li>광고 쿠키를 사용하면 Google 및 파트너가 사용자의 본 사이트 및 인터넷 상의 다른 사이트 방문을 기반으로 맞춤 광고를 제공할 수 있습니다.</li>
              <li>사용자는 <a href="https://adssettings.google.com" target="_blank" rel="noreferrer" className="text-rose-600 underline">Google 광고 설정</a>에서 맞춤 광고 설정을 해제할 수 있습니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">4. 접속 로그 및 분석 도구</h2>
            <p>
              서비스 개선 및 오류 분석을 위해 비식별화된 트래픽 데이터(IP 주소, 브라우저 종류, 방문 시간 등)가 웹 분석 도구(Google Analytics 등)를 통해 통계적으로 수집될 수 있습니다. 이 정보는 개인을 식별하는 데 사용되지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">5. 개발자 및 개인정보보호 책임자 문의처</h2>
            <p>
              본 개인정보처리방침 및 서비스 보안에 대해 문의사항이나 제안이 있으신 경우, 언제든지 개발자 이메일(<a href="mailto:fbihan@naver.com" className="text-rose-600 font-bold underline">fbihan@naver.com</a>)로 연락 주시기 바랍니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
