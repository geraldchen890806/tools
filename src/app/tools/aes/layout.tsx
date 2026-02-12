import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "AES 加密解密 - 免费在线AES 加密解密",
  description: "免费在线 AES 加密解密工具，支持 AES-CBC 模式，自定义 Key 和 IV",
  keywords: ["AES加密","AES解密","aes encryption","在线加密"],
  openGraph: {
    title: "AES 加密解密 - 免费在线AES 加密解密 | AnyFreeTools",
    description: "免费在线 AES 加密解密工具，支持 AES-CBC 模式，自定义 Key 和 IV",
    url: "https://anyfreetools.com/tools/aes",
    siteName: "AnyFreeTools",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "AES 加密解密 - 免费在线AES 加密解密 | AnyFreeTools",
    description: "免费在线 AES 加密解密工具，支持 AES-CBC 模式，自定义 Key 和 IV",
  },
  alternates: {
    canonical: "https://anyfreetools.com/tools/aes",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "AES 加密解密",
          url: "https://anyfreetools.com/tools/aes",
          description: "免费在线 AES 加密解密工具，支持 AES-CBC 模式，自定义 Key 和 IV",
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
