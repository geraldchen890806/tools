import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "JWT 解析 - 免费在线JWT 解析",
  description: "免费在线 JWT 解码工具，解析查看 JWT Token 的 Header、Payload 和签名信息",
  keywords: ["JWT解析","JWT decoder","token解码","JSON Web Token"],
  openGraph: {
    title: "JWT 解析 - 免费在线JWT 解析 | AnyFreeTools",
    description: "免费在线 JWT 解码工具，解析查看 JWT Token 的 Header、Payload 和签名信息",
    url: "https://anyfreetools.com/tools/jwt-decoder",
    siteName: "AnyFreeTools",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "JWT 解析 - 免费在线JWT 解析 | AnyFreeTools",
    description: "免费在线 JWT 解码工具，解析查看 JWT Token 的 Header、Payload 和签名信息",
  },
  alternates: {
    canonical: "https://anyfreetools.com/tools/jwt-decoder",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "JWT 解析",
          url: "https://anyfreetools.com/tools/jwt-decoder",
          description: "免费在线 JWT 解码工具，解析查看 JWT Token 的 Header、Payload 和签名信息",
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
