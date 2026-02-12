import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "图片格式转换 - 免费在线图片格式转换",
  description: "免费在线图片格式转换工具，JPG、PNG、WebP 格式互转，批量转换",
  keywords: ["图片格式转换","image converter","JPG转PNG","WebP转换"],
  openGraph: {
    title: "图片格式转换 - 免费在线图片格式转换 | AnyFreeTools",
    description: "免费在线图片格式转换工具，JPG、PNG、WebP 格式互转，批量转换",
    url: "https://anyfreetools.com/tools/image-convert",
    siteName: "AnyFreeTools",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "图片格式转换 - 免费在线图片格式转换 | AnyFreeTools",
    description: "免费在线图片格式转换工具，JPG、PNG、WebP 格式互转，批量转换",
  },
  alternates: {
    canonical: "https://anyfreetools.com/tools/image-convert",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "图片格式转换",
          url: "https://anyfreetools.com/tools/image-convert",
          description: "免费在线图片格式转换工具，JPG、PNG、WebP 格式互转，批量转换",
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
