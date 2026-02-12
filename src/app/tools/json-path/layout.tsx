import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "JSON Path 查询 - 免费在线JSON Path 查询",
  description: "免费在线 JSONPath 查询工具，使用 JSONPath 语法查询和提取 JSON 数据",
  keywords: ["JSONPath","JSON查询","json path","JSON数据提取"],
  openGraph: {
    title: "JSON Path 查询 - 免费在线JSON Path 查询 | AnyFreeTools",
    description: "免费在线 JSONPath 查询工具，使用 JSONPath 语法查询和提取 JSON 数据",
    url: "https://anyfreetools.com/tools/json-path",
    siteName: "AnyFreeTools",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "JSON Path 查询 - 免费在线JSON Path 查询 | AnyFreeTools",
    description: "免费在线 JSONPath 查询工具，使用 JSONPath 语法查询和提取 JSON 数据",
  },
  alternates: {
    canonical: "https://anyfreetools.com/tools/json-path",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "JSON Path 查询",
          url: "https://anyfreetools.com/tools/json-path",
          description: "免费在线 JSONPath 查询工具，使用 JSONPath 语法查询和提取 JSON 数据",
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
