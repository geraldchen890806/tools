import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "字数统计 - 免费在线字数统计",
  description: "免费在线字数统计工具，支持中英文字符数、单词数、行数统计，实时计算文本长度",
  keywords: ["字数统计","字符计数","单词计数","word counter","在线字数统计"],
  openGraph: {
    title: "字数统计 - 免费在线字数统计 | AnyFreeTools",
    description: "免费在线字数统计工具，支持中英文字符数、单词数、行数统计，实时计算文本长度",
    url: "https://anyfreetools.com/tools/word-counter",
    siteName: "AnyFreeTools",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "字数统计 - 免费在线字数统计 | AnyFreeTools",
    description: "免费在线字数统计工具，支持中英文字符数、单词数、行数统计，实时计算文本长度",
  },
  alternates: {
    canonical: "https://anyfreetools.com/tools/word-counter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "字数统计",
          url: "https://anyfreetools.com/tools/word-counter",
          description: "免费在线字数统计工具，支持中英文字符数、单词数、行数统计，实时计算文本长度",
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
