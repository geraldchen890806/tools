import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "图片水印 - 免费在线图片水印",
  description: "免费在线图片水印工具，给图片添加自定义文字水印，支持调整位置和透明度",
  keywords: ["图片水印","image watermark","添加水印","文字水印"],
  openGraph: {
    title: "图片水印 - 免费在线图片水印 | AnyFreeTools",
    description: "免费在线图片水印工具，给图片添加自定义文字水印，支持调整位置和透明度",
    url: "https://anyfreetools.com/tools/image-watermark",
    siteName: "AnyFreeTools",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "图片水印 - 免费在线图片水印 | AnyFreeTools",
    description: "免费在线图片水印工具，给图片添加自定义文字水印，支持调整位置和透明度",
  },
  alternates: {
    canonical: "https://anyfreetools.com/tools/image-watermark",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "图片水印",
          url: "https://anyfreetools.com/tools/image-watermark",
          description: "免费在线图片水印工具，给图片添加自定义文字水印，支持调整位置和透明度",
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
