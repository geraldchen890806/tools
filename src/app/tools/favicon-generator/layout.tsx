import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Favicon 生成 - 免费在线Favicon 生成",
  description: "免费在线 Favicon 生成工具，上传图片生成多尺寸 Favicon ICO 文件",
  keywords: ["Favicon生成","favicon generator","ICO生成","网站图标"],
  openGraph: {
    title: "Favicon 生成 - 免费在线Favicon 生成 | AnyFreeTools",
    description: "免费在线 Favicon 生成工具，上传图片生成多尺寸 Favicon ICO 文件",
    url: "https://anyfreetools.com/tools/favicon-generator",
    siteName: "AnyFreeTools",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Favicon 生成 - 免费在线Favicon 生成 | AnyFreeTools",
    description: "免费在线 Favicon 生成工具，上传图片生成多尺寸 Favicon ICO 文件",
  },
  alternates: {
    canonical: "https://anyfreetools.com/tools/favicon-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Favicon 生成",
          url: "https://anyfreetools.com/tools/favicon-generator",
          description: "免费在线 Favicon 生成工具，上传图片生成多尺寸 Favicon ICO 文件",
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
