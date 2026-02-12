import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "HTTP 状态码 - 免费在线HTTP 状态码",
  description: "免费 HTTP 状态码速查表，包含所有状态码的说明、使用场景和示例",
  keywords: ["HTTP状态码","HTTP status code","状态码查询","HTTP响应码"],
  openGraph: {
    title: "HTTP 状态码 - 免费在线HTTP 状态码 | AnyFreeTools",
    description: "免费 HTTP 状态码速查表，包含所有状态码的说明、使用场景和示例",
    url: "https://anyfreetools.com/tools/http-status",
    siteName: "AnyFreeTools",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "HTTP 状态码 - 免费在线HTTP 状态码 | AnyFreeTools",
    description: "免费 HTTP 状态码速查表，包含所有状态码的说明、使用场景和示例",
  },
  alternates: {
    canonical: "https://anyfreetools.com/tools/http-status",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "HTTP 状态码",
          url: "https://anyfreetools.com/tools/http-status",
          description: "免费 HTTP 状态码速查表，包含所有状态码的说明、使用场景和示例",
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
