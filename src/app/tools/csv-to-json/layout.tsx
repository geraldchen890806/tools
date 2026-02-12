import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "CSV 转 JSON - 免费在线CSV 转 JSON",
  description: "免费在线 CSV 转 JSON 工具，粘贴 CSV 文本快速转换为 JSON 格式，支持自定义分隔符",
  keywords: ["CSV转JSON","csv to json","格式转换","数据转换"],
  openGraph: {
    title: "CSV 转 JSON - 免费在线CSV 转 JSON | AnyFreeTools",
    description: "免费在线 CSV 转 JSON 工具，粘贴 CSV 文本快速转换为 JSON 格式，支持自定义分隔符",
    url: "https://anyfreetools.com/tools/csv-to-json",
    siteName: "AnyFreeTools",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "CSV 转 JSON - 免费在线CSV 转 JSON | AnyFreeTools",
    description: "免费在线 CSV 转 JSON 工具，粘贴 CSV 文本快速转换为 JSON 格式，支持自定义分隔符",
  },
  alternates: {
    canonical: "https://anyfreetools.com/tools/csv-to-json",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "CSV 转 JSON",
          url: "https://anyfreetools.com/tools/csv-to-json",
          description: "免费在线 CSV 转 JSON 工具，粘贴 CSV 文本快速转换为 JSON 格式，支持自定义分隔符",
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
