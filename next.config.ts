import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // next.config.js
  images: {
    remotePatterns: [{
      protocol: "https",
      hostname: "firebasestorage.googleapis.com",
    },
    {
      protocol: "https",
      hostname: "via.placeholder.com",
    }
    ],
          //  domains: ["firebasestorage.googleapis.com"],
  },


};



export default nextConfig;
