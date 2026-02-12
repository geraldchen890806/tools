import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "图片裁剪 - 免费在线图片裁剪",
  description: "免费在线图片裁剪工具，自定义尺寸和比例裁剪图片，本地处理不上传",
  keywords: ["图片裁剪","image crop","在线裁剪","图片编辑"],
  openGraph: {
    title: "图片裁剪 - 免费在线图片裁剪 | AnyFreeTools",
    description: "免费在线图片裁剪工具，自定义尺寸和比例裁剪图片，本地处理不上传",
    url: "https://anyfreetools.com/tools/image-crop",
    siteName: "AnyFreeTools",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "图片裁剪 - 免费在线图片裁剪 | AnyFreeTools",
    description: "免费在线图片裁剪工具，自定义尺寸和比例裁剪图片，本地处理不上传",
  },
  alternates: {
    canonical: "https://anyfreetools.com/tools/image-crop",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "图片裁剪",
          url: "https://anyfreetools.com/tools/image-crop",
          description: "免费在线图片裁剪工具，自定义尺寸和比例裁剪图片，本地处理不上传",
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
