import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "JSON 格式化 - 免费在线JSON 格式化",
  description: "免费在线 JSON 格式化工具，支持 JSON 美化、压缩、校验，带语法高亮显示",
  keywords: ["JSON格式化","JSON美化","JSON校验","json formatter","json validator"],
  openGraph: {
    title: "JSON 格式化 - 免费在线JSON 格式化 | AnyFreeTools",
    description: "免费在线 JSON 格式化工具，支持 JSON 美化、压缩、校验，带语法高亮显示",
    url: "https://anyfreetools.com/tools/json-formatter",
    siteName: "AnyFreeTools",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "JSON 格式化 - 免费在线JSON 格式化 | AnyFreeTools",
    description: "免费在线 JSON 格式化工具，支持 JSON 美化、压缩、校验，带语法高亮显示",
  },
  alternates: {
    canonical: "https://anyfreetools.com/tools/json-formatter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "JSON 格式化",
          url: "https://anyfreetools.com/tools/json-formatter",
          description: "免费在线 JSON 格式化工具，支持 JSON 美化、压缩、校验，带语法高亮显示",
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
