import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "大小写转换 - 免费在线大小写转换",
  description: "免费在线大小写转换工具，支持大写、小写、驼峰命名、下划线命名等多种格式转换",
  keywords: ["大小写转换","case converter","驼峰转换","文本格式转换"],
  openGraph: {
    title: "大小写转换 - 免费在线大小写转换 | AnyFreeTools",
    description: "免费在线大小写转换工具，支持大写、小写、驼峰命名、下划线命名等多种格式转换",
    url: "https://anyfreetools.com/tools/case-converter",
    siteName: "AnyFreeTools",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "大小写转换 - 免费在线大小写转换 | AnyFreeTools",
    description: "免费在线大小写转换工具，支持大写、小写、驼峰命名、下划线命名等多种格式转换",
  },
  alternates: {
    canonical: "https://anyfreetools.com/tools/case-converter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "大小写转换",
          url: "https://anyfreetools.com/tools/case-converter",
          description: "免费在线大小写转换工具，支持大写、小写、驼峰命名、下划线命名等多种格式转换",
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
