# Gotenberg (LibreOffice + 한글 폰트) 100% 무료·상업용 무제한 배포 가이드

이 폴더의 `Dockerfile`은 **Gotenberg 8 (MIT 라이선스) + LibreOffice (MPL-2.0 라이선스) + 한글 폰트(`Noto Sans CJK`, `나눔고딕`, `은글꼴`)**가 모두 포함된 컨테이너입니다.

- **라이선스**: 100% 오픈소스 — 공개 PDF 변환 사이트(`pdfpick.kr`), AdSense 수익화, 상업적 서비스 모두 **법적/약관 제한 없이 무제한 무료**로 사용 가능합니다.
- **변환 품질**: 복잡한 한글 표, 그룹 도형, 세로 A4 제안서 PPTX, DOCX, XLSX를 **MS Office / LibreOffice 원본 수준(98~100%)**으로 PDF 변환합니다.

---

## 방법 1: Render.com 무료 Docker 배포 (가장 간단 · 3분)

1. [render.com](https://render.com) 무료 회원가입 (GitHub 연동)
2. **New +** → **Web Service** → `mypickpdf` 저장소 선택
3. 설정값 입력:
   - **Runtime**: `Docker`
   - **Root Directory**: `gotenberg`
   - **Instance Type**: `Free` ($0/월)
4. **Create Web Service** 클릭 → 배포 완료 후 생성된 URL 복사 (예: `https://pdfpick-gotenberg.onrender.com`)
5. **Vercel 대시보드** → `Settings` → `Environment Variables`에 추가:
   ```
   GOTENBERG_URL=https://pdfpick-gotenberg.onrender.com
   ```
6. Vercel 재배포(Redeploy)하면 즉시 **PPT/Word/Excel → PDF**가 Gotenberg 고정밀 엔진으로 자동 전환됩니다.

> 💡 Render 무료 플랜은 15분 미사용 시 슬립(첫 요청 약 30초 지연)됩니다. 무료 UptimeRobot 등으로 10분마다 `https://your-url/health`를 핑하거나, 슬립 없는 아래 **방법 2 / 3**을 사용하시면 항상 1초 응답을 유지할 수 있습니다.

---

## 방법 2: Hugging Face Spaces 무료 Docker 배포 (16GB RAM 무료!)

1. [huggingface.co/spaces](https://huggingface.co/spaces) → **Create new Space**
2. **Space SDK**: `Docker (Blank)` / **Hardware**: `CPU basic (2 vCPU · 16GB RAM · Free)` 선택
3. 이 폴더의 `Dockerfile`을 업로드하고 마지막 `EXPOSE 3000` 대신 아래 2줄을 추가:
   ```dockerfile
   EXPOSE 7860
   CMD ["gotenberg", "--api-port=7860"]
   ```
4. 배포 완료 후 Space Direct URL (`https://<유저명>-<스페이스명>.hf.space`)을 Vercel 환경변수 `GOTENBERG_URL`에 등록합니다.

---

## 방법 3: Oracle Cloud Always Free (평생 무료 VPS · 24GB RAM · 슬립 없음)

Oracle Cloud 평생 무료 인스턴스(Ubuntu)에서 Docker로 실행:

```bash
cd gotenberg
docker build -t pdfpick-gotenberg .
docker run -d --restart always --name gotenberg -p 3000:3000 pdfpick-gotenberg
```

HTTPS 도메인(예: Cloudflare Tunnel 또는 Nginx + Let's Encrypt)을 연결한 뒤 Vercel 환경변수 `GOTENBERG_URL`에 등록하세요.

---

## 대용량 파일 (4.5MB 초과, 예: 6~50MB PPTX) 안내

Vercel Serverless Function은 요청 본문이 **4.5MB**로 제한됩니다.
- `<= 4MB` 파일: Vercel `/api/office-to-pdf`가 Gotenberg로 안전하게 중계합니다.
- `> 4MB` 파일 (예: 6.61MB 제안서 PPTX):
  - 기본값: 브라우저 내 **무제한 로컬 고해상도 엔진(`pptxviewjs`)**으로 자동 전환되어 끊김 없이 변환됩니다.
  - 4.5MB 초과 파일까지 Gotenberg로 직접 변환하려면: Gotenberg 앞단(Nginx / Cloudflare Worker 등)에 `Access-Control-Allow-Origin: https://pdfpick.kr` CORS 헤더를 추가하고 Vercel 환경변수에 `NEXT_PUBLIC_GOTENBERG_URL=https://your-gotenberg-url`을 함께 설정하면 브라우저에서 Gotenberg로 **직접 업로드(50MB+ 지원)**됩니다.
