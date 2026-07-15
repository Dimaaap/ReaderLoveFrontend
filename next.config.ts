import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "content1.rozetka.com.ua",
        port: "",
        pathname: "/**"
      }, 
      {
        protocol: "https",
        hostname: "s1.vcdn.biz",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "content2.rozetka.com.ua",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "static.yakaboo.ua",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "s5.vcdn.biz",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "s4.vcdn.biz",
        port: "",
        pathname: "/**"
      }
    ]
  }
};

export default nextConfig;
