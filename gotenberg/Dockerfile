# 100% Free & Unlimited Self-Hosted Gotenberg (LibreOffice + Korean Fonts)
# Deploy free on Hugging Face Spaces, Render, Railway, Fly.io, or any Docker VPS.
# Then set GOTENBERG_URL=https://your-gotenberg-url in Vercel Environment Variables.

FROM gotenberg/gotenberg:8

USER root

# Install full Korean (CJK) fonts so PPTX/DOCX/XLSX Korean text renders with 100% accuracy
RUN apt-get update && apt-get install -y --no-install-recommends \
    fonts-noto-cjk \
    fonts-nanum \
    fonts-nanum-coding \
    fonts-unfonts-core \
    fonts-unfonts-extra \
    fontconfig \
    && fc-cache -fv \
    && rm -rf /var/lib/apt/lists/*

USER gotenberg

EXPOSE 3000
