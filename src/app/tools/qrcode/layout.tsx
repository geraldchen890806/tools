import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "二维码生成 - 免费在线二维码生成",
  description: "免费在线二维码生成工具，输入文本或 URL 快速生成二维码图片，支持下载",
  keywords: ["二维码生成","QR code generator","二维码制作","qrcode"],
  openGraph: {
    title: "二维码生成 - 免费在线二维码生成 | AnyFreeTools",
    description: "免费在线二维码生成工具，输入文本或 URL 快速生成二维码图片，支持下载",
    url: "https://anyfreetools.com/tools/qrcode",
    siteName: "AnyFreeTools",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "二维码生成 - 免费在线二维码生成 | AnyFreeTools",
    description: "免费在线二维码生成工具，输入文本或 URL 快速生成二维码图片，支持下载",
  },
  alternates: {
    canonical: "https://anyfreetools.com/tools/qrcode",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "二维码生成",
          url: "https://anyfreetools.com/tools/qrcode",
          description: "免费在线二维码生成工具，输入文本或 URL 快速生成二维码图片，支持下载",
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
