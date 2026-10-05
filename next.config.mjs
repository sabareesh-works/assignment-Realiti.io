/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  output: "export",
  basePath: isProd ? "/assignment-Realiti.io" : "",
  assetPrefix: isProd ? "/assignment-Realiti.io/" : "",
  trailingSlash: true,
  images: { unoptimized: true },
  staticPageGenerationTimeout: 300,
};

export default nextConfig;
