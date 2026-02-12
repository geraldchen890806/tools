import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Markdown 预览 - 免费在线Markdown 预览",
  description: "免费在线 Markdown 编辑预览工具，实时渲染 Markdown 语法，所见即所得",
  keywords: ["Markdown预览","markdown editor","Markdown编辑器","MD预览"],
  openGraph: {
    title: "Markdown 预览 - 免费在线Markdown 预览 | AnyFreeTools",
    description: "免费在线 Markdown 编辑预览工具，实时渲染 Markdown 语法，所见即所得",
    url: "https://anyfreetools.com/tools/markdown-preview",
    siteName: "AnyFreeTools",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Markdown 预览 - 免费在线Markdown 预览 | AnyFreeTools",
    description: "免费在线 Markdown 编辑预览工具，实时渲染 Markdown 语法，所见即所得",
  },
  alternates: {
    canonical: "https://anyfreetools.com/tools/markdown-preview",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Markdown 预览",
          url: "https://anyfreetools.com/tools/markdown-preview",
          description: "免费在线 Markdown 编辑预览工具，实时渲染 Markdown 语法，所见即所得",
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
