import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "图片拼接 - 免费在线图片拼接",
  description: "免费在线图片拼接工具，多张图片横向或纵向拼接合并，本地处理",
  keywords: ["图片拼接","image merge","图片合并","拼图工具"],
  openGraph: {
    title: "图片拼接 - 免费在线图片拼接 | AnyFreeTools",
    description: "免费在线图片拼接工具，多张图片横向或纵向拼接合并，本地处理",
    url: "https://anyfreetools.com/tools/image-merge",
    siteName: "AnyFreeTools",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "图片拼接 - 免费在线图片拼接 | AnyFreeTools",
    description: "免费在线图片拼接工具，多张图片横向或纵向拼接合并，本地处理",
  },
  alternates: {
    canonical: "https://anyfreetools.com/tools/image-merge",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "图片拼接",
          url: "https://anyfreetools.com/tools/image-merge",
          description: "免费在线图片拼接工具，多张图片横向或纵向拼接合并，本地处理",
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
