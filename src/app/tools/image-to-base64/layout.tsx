import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "图片转 Base64 - 免费在线图片转 Base64",
  description: "免费在线图片转 Base64 工具，图片与 Base64 字符串互转，支持多种图片格式",
  keywords: ["图片转Base64","image to base64","图片编码","base64图片"],
  openGraph: {
    title: "图片转 Base64 - 免费在线图片转 Base64 | AnyFreeTools",
    description: "免费在线图片转 Base64 工具，图片与 Base64 字符串互转，支持多种图片格式",
    url: "https://anyfreetools.com/tools/image-to-base64",
    siteName: "AnyFreeTools",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "图片转 Base64 - 免费在线图片转 Base64 | AnyFreeTools",
    description: "免费在线图片转 Base64 工具，图片与 Base64 字符串互转，支持多种图片格式",
  },
  alternates: {
    canonical: "https://anyfreetools.com/tools/image-to-base64",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "图片转 Base64",
          url: "https://anyfreetools.com/tools/image-to-base64",
          description: "免费在线图片转 Base64 工具，图片与 Base64 字符串互转，支持多种图片格式",
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
