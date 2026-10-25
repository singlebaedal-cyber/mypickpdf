/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.pdfpick.kr" }],
        destination: "https://pdfpick.kr/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "mypickpdf.vercel.app" }],
        destination: "https://pdfpick.kr/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "quickpdfbuild.vercel.app" }],
        destination: "https://pdfpick.kr/:path*",
        permanent: true,
      },
    ];
  },
  webpack: (config, { webpack }) => {
    config.resolve.alias.canvas = false;
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      https: false,
      http: false,
      child_process: false,
    };
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
        resource.request = resource.request.replace(/^node:/, "");
      })
    );
    return config;
  },
};

export default nextConfig;
