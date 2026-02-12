import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "UUID 生成器 - 免费在线UUID 生成器",
  description: "免费在线 UUID 生成工具，批量生成 UUID v4，一键复制，安全随机",
  keywords: ["UUID生成","uuid generator","GUID生成","唯一标识符"],
  openGraph: {
    title: "UUID 生成器 - 免费在线UUID 生成器 | AnyFreeTools",
    description: "免费在线 UUID 生成工具，批量生成 UUID v4，一键复制，安全随机",
    url: "https://anyfreetools.com/tools/uuid-generator",
    siteName: "AnyFreeTools",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "UUID 生成器 - 免费在线UUID 生成器 | AnyFreeTools",
    description: "免费在线 UUID 生成工具，批量生成 UUID v4，一键复制，安全随机",
  },
  alternates: {
    canonical: "https://anyfreetools.com/tools/uuid-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "UUID 生成器",
          url: "https://anyfreetools.com/tools/uuid-generator",
          description: "免费在线 UUID 生成工具，批量生成 UUID v4，一键复制，安全随机",
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
