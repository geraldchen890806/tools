import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "日志高亮 - 免费在线日志高亮",
  description: "免费在线日志高亮工具，粘贴日志自动识别 ERROR、WARN、INFO 等级别并着色显示",
  keywords: ["日志高亮","log highlighter","日志查看","日志分析"],
  openGraph: {
    title: "日志高亮 - 免费在线日志高亮 | AnyFreeTools",
    description: "免费在线日志高亮工具，粘贴日志自动识别 ERROR、WARN、INFO 等级别并着色显示",
    url: "https://anyfreetools.com/tools/log-highlighter",
    siteName: "AnyFreeTools",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "日志高亮 - 免费在线日志高亮 | AnyFreeTools",
    description: "免费在线日志高亮工具，粘贴日志自动识别 ERROR、WARN、INFO 等级别并着色显示",
  },
  alternates: {
    canonical: "https://anyfreetools.com/tools/log-highlighter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "日志高亮",
          url: "https://anyfreetools.com/tools/log-highlighter",
          description: "免费在线日志高亮工具，粘贴日志自动识别 ERROR、WARN、INFO 等级别并着色显示",
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
