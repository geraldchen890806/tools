import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Lorem Ipsum - 免费在线Lorem Ipsum",
  description: "免费在线 Lorem Ipsum 占位文本生成工具，支持中英文假文生成，自定义段落数",
  keywords: ["Lorem Ipsum","占位文本","假文生成","placeholder text"],
  openGraph: {
    title: "Lorem Ipsum - 免费在线Lorem Ipsum | AnyFreeTools",
    description: "免费在线 Lorem Ipsum 占位文本生成工具，支持中英文假文生成，自定义段落数",
    url: "https://anyfreetools.com/tools/lorem-ipsum",
    siteName: "AnyFreeTools",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Lorem Ipsum - 免费在线Lorem Ipsum | AnyFreeTools",
    description: "免费在线 Lorem Ipsum 占位文本生成工具，支持中英文假文生成，自定义段落数",
  },
  alternates: {
    canonical: "https://anyfreetools.com/tools/lorem-ipsum",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Lorem Ipsum",
          url: "https://anyfreetools.com/tools/lorem-ipsum",
          description: "免费在线 Lorem Ipsum 占位文本生成工具，支持中英文假文生成，自定义段落数",
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
