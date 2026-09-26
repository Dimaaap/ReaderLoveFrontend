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
        hostname: "www.yakaboo.ua",
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
        hostname: "i.pinimg.com",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "s3.vcdn.biz",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "s7.vcdn.biz",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "media.istockphoto.com",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "s2.vcdn.biz",
        port: "",
        pathname: "/**"
      },
       {
        protocol: "https",
        hostname: "s8.vcdn.biz",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "s6.vcdn.biz",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8030",
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
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8030',
        pathname: '/media/**',
      },
    ]
  }
};

export default nextConfig;
