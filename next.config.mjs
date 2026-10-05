/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  output: "export",
  basePath: isProd ? "/realiti.io-assignment" : "",
  assetPrefix: isProd ? "/realiti.io-assignment/" : "",
  trailingSlash: true,
  images: { unoptimized: true },
  staticPageGenerationTimeout: 300,
};

export default nextConfig;
