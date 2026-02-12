import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "正则测试 - 免费在线正则测试",
  description: "免费在线正则表达式测试工具，实时匹配高亮，支持常用正则模板",
  keywords: ["正则表达式","正则测试","regex tester","正则匹配"],
  openGraph: {
    title: "正则测试 - 免费在线正则测试 | AnyFreeTools",
    description: "免费在线正则表达式测试工具，实时匹配高亮，支持常用正则模板",
    url: "https://anyfreetools.com/tools/regex-tester",
    siteName: "AnyFreeTools",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "正则测试 - 免费在线正则测试 | AnyFreeTools",
    description: "免费在线正则表达式测试工具，实时匹配高亮，支持常用正则模板",
  },
  alternates: {
    canonical: "https://anyfreetools.com/tools/regex-tester",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "正则测试",
          url: "https://anyfreetools.com/tools/regex-tester",
          description: "免费在线正则表达式测试工具，实时匹配高亮，支持常用正则模板",
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
