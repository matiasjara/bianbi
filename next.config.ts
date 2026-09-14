import type { NextConfig } from "next";
import path from "path";
import { NOINDEX_ROBOTS_TAG } from "./src/lib/site/indexing";

const noindexHeaders = [{ key: "X-Robots-Tag", value: NOINDEX_ROBOTS_TAG }];

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  async headers() {
    return [
      {
        source: "/kitchencare-demo/:path*",
        headers: noindexHeaders,
      },
      {
        source: "/campaigns/:path*",
        headers: noindexHeaders,
      },
      {
        source: "/p/:path*",
        headers: noindexHeaders,
      },
      {
        source: "/login",
        headers: noindexHeaders,
      },
    ];
  },
};

export default nextConfig;
