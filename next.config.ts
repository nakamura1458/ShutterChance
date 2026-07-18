import type { NextConfig } from "next";


const nextConfig: NextConfig = {

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lmhvizecgztbrzdytkmp.supabase.co",
      },
    ],
  },

};


export default nextConfig;