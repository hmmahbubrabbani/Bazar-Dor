import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // যদি গুগলের সোশ্যাল প্রোফাইল পিকচার ব্যবহার করেন
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com', // যদি গিটহাবের সোশ্যাল প্রোফাইল পিকচার ব্যবহার করেন
      },
    ],
  },
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
