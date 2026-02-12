import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "颜色转换 - 免费在线颜色转换",
  description: "免费在线颜色转换工具，HEX、RGB、HSL 颜色格式互转，带实时颜色预览",
  keywords: ["颜色转换","color converter","HEX转RGB","HSL转换","颜色选择器"],
  openGraph: {
    title: "颜色转换 - 免费在线颜色转换 | AnyFreeTools",
    description: "免费在线颜色转换工具，HEX、RGB、HSL 颜色格式互转，带实时颜色预览",
    url: "https://anyfreetools.com/tools/color-converter",
    siteName: "AnyFreeTools",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "颜色转换 - 免费在线颜色转换 | AnyFreeTools",
    description: "免费在线颜色转换工具，HEX、RGB、HSL 颜色格式互转，带实时颜色预览",
  },
  alternates: {
    canonical: "https://anyfreetools.com/tools/color-converter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "颜色转换",
          url: "https://anyfreetools.com/tools/color-converter",
          description: "免费在线颜色转换工具，HEX、RGB、HSL 颜色格式互转，带实时颜色预览",
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
