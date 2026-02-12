import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Hash 计算 - 免费在线Hash 计算",
  description: "免费在线 Hash 计算工具，支持 MD5、SHA-1、SHA-256、SHA-512 等哈希算法",
  keywords: ["Hash计算","SHA256","MD5","hash calculator","哈希值"],
  openGraph: {
    title: "Hash 计算 - 免费在线Hash 计算 | AnyFreeTools",
    description: "免费在线 Hash 计算工具，支持 MD5、SHA-1、SHA-256、SHA-512 等哈希算法",
    url: "https://anyfreetools.com/tools/hash",
    siteName: "AnyFreeTools",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Hash 计算 - 免费在线Hash 计算 | AnyFreeTools",
    description: "免费在线 Hash 计算工具，支持 MD5、SHA-1、SHA-256、SHA-512 等哈希算法",
  },
  alternates: {
    canonical: "https://anyfreetools.com/tools/hash",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Hash 计算",
          url: "https://anyfreetools.com/tools/hash",
          description: "免费在线 Hash 计算工具，支持 MD5、SHA-1、SHA-256、SHA-512 等哈希算法",
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
