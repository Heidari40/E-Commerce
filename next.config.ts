import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // next.config.js
  images: {
    remotePatterns: [{
      protocol: "https",
      hostname: "firebasestorage.googleapis.com",
      port: "",
      pathname: "/v0/b/**",
    },
    {
      protocol: "https",
      hostname: "via.placeholder.com",
      port: "",
      pathname: "/**",
    }
    ],
          //  domains: ["firebasestorage.googleapis.com"],
  },
};



export default nextConfig;
