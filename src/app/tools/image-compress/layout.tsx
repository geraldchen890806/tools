import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "图片压缩 - 免费在线图片压缩",
  description: "免费在线图片压缩工具，支持无损和有损压缩，不上传服务器，本地浏览器处理",
  keywords: ["图片压缩","image compress","图片优化","压缩图片"],
  openGraph: {
    title: "图片压缩 - 免费在线图片压缩 | AnyFreeTools",
    description: "免费在线图片压缩工具，支持无损和有损压缩，不上传服务器，本地浏览器处理",
    url: "https://anyfreetools.com/tools/image-compress",
    siteName: "AnyFreeTools",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "图片压缩 - 免费在线图片压缩 | AnyFreeTools",
    description: "免费在线图片压缩工具，支持无损和有损压缩，不上传服务器，本地浏览器处理",
  },
  alternates: {
    canonical: "https://anyfreetools.com/tools/image-compress",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "图片压缩",
          url: "https://anyfreetools.com/tools/image-compress",
          description: "免费在线图片压缩工具，支持无损和有损压缩，不上传服务器，本地浏览器处理",
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "All",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
          browserRequirements: "Requires a modern web browser",
        }}
      />
      {children}
    </>
  );
}
