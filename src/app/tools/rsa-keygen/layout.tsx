import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "RSA 密钥生成 - 免费在线RSA 密钥生成",
  description: "免费在线 RSA 密钥对生成工具，一键生成 RSA 公钥和私钥，支持多种长度",
  keywords: ["RSA密钥","RSA keygen","公钥私钥","密钥生成"],
  openGraph: {
    title: "RSA 密钥生成 - 免费在线RSA 密钥生成 | AnyFreeTools",
    description: "免费在线 RSA 密钥对生成工具，一键生成 RSA 公钥和私钥，支持多种长度",
    url: "https://anyfreetools.com/tools/rsa-keygen",
    siteName: "AnyFreeTools",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "RSA 密钥生成 - 免费在线RSA 密钥生成 | AnyFreeTools",
    description: "免费在线 RSA 密钥对生成工具，一键生成 RSA 公钥和私钥，支持多种长度",
  },
  alternates: {
    canonical: "https://anyfreetools.com/tools/rsa-keygen",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "RSA 密钥生成",
          url: "https://anyfreetools.com/tools/rsa-keygen",
          description: "免费在线 RSA 密钥对生成工具，一键生成 RSA 公钥和私钥，支持多种长度",
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
