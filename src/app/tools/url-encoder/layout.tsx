import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "URL 编解码 - 免费在线URL 编解码",
  description: "免费在线 URL 编码解码工具，URL encode 和 decode 转换，处理特殊字符",
  keywords: ["URL编码","URL解码","url encoder","url decoder","encodeURIComponent"],
  openGraph: {
    title: "URL 编解码 - 免费在线URL 编解码 | AnyFreeTools",
    description: "免费在线 URL 编码解码工具，URL encode 和 decode 转换，处理特殊字符",
    url: "https://anyfreetools.com/tools/url-encoder",
    siteName: "AnyFreeTools",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "URL 编解码 - 免费在线URL 编解码 | AnyFreeTools",
    description: "免费在线 URL 编码解码工具，URL encode 和 decode 转换，处理特殊字符",
  },
  alternates: {
    canonical: "https://anyfreetools.com/tools/url-encoder",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "URL 编解码",
          url: "https://anyfreetools.com/tools/url-encoder",
          description: "免费在线 URL 编码解码工具，URL encode 和 decode 转换，处理特殊字符",
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
