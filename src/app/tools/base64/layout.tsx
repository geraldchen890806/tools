import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Base64 编解码 - 免费在线Base64 编解码",
  description: "免费在线 Base64 编码解码工具，支持文本和文件的 Base64 编码与解码转换",
  keywords: ["Base64编码","Base64解码","base64 encoder","base64 decoder"],
  openGraph: {
    title: "Base64 编解码 - 免费在线Base64 编解码 | AnyFreeTools",
    description: "免费在线 Base64 编码解码工具，支持文本和文件的 Base64 编码与解码转换",
    url: "https://anyfreetools.com/tools/base64",
    siteName: "AnyFreeTools",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Base64 编解码 - 免费在线Base64 编解码 | AnyFreeTools",
    description: "免费在线 Base64 编码解码工具，支持文本和文件的 Base64 编码与解码转换",
  },
  alternates: {
    canonical: "https://anyfreetools.com/tools/base64",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Base64 编解码",
          url: "https://anyfreetools.com/tools/base64",
          description: "免费在线 Base64 编码解码工具，支持文本和文件的 Base64 编码与解码转换",
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
