import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "文本对比 - 免费在线文本对比",
  description: "免费在线文本对比工具，对比两段文本的差异并高亮显示不同之处，支持逐行对比",
  keywords: ["文本对比","text diff","文本差异","对比工具"],
  openGraph: {
    title: "文本对比 - 免费在线文本对比 | AnyFreeTools",
    description: "免费在线文本对比工具，对比两段文本的差异并高亮显示不同之处，支持逐行对比",
    url: "https://anyfreetools.com/tools/text-diff",
    siteName: "AnyFreeTools",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "文本对比 - 免费在线文本对比 | AnyFreeTools",
    description: "免费在线文本对比工具，对比两段文本的差异并高亮显示不同之处，支持逐行对比",
  },
  alternates: {
    canonical: "https://anyfreetools.com/tools/text-diff",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "文本对比",
          url: "https://anyfreetools.com/tools/text-diff",
          description: "免费在线文本对比工具，对比两段文本的差异并高亮显示不同之处，支持逐行对比",
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
