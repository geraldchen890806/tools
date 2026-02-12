import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "进制转换 - 免费在线进制转换",
  description: "免费在线进制转换工具，二进制、八进制、十进制、十六进制数值互转",
  keywords: ["进制转换","二进制转换","十六进制","number base converter"],
  openGraph: {
    title: "进制转换 - 免费在线进制转换 | AnyFreeTools",
    description: "免费在线进制转换工具，二进制、八进制、十进制、十六进制数值互转",
    url: "https://anyfreetools.com/tools/number-base",
    siteName: "AnyFreeTools",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "进制转换 - 免费在线进制转换 | AnyFreeTools",
    description: "免费在线进制转换工具，二进制、八进制、十进制、十六进制数值互转",
  },
  alternates: {
    canonical: "https://anyfreetools.com/tools/number-base",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "进制转换",
          url: "https://anyfreetools.com/tools/number-base",
          description: "免费在线进制转换工具，二进制、八进制、十进制、十六进制数值互转",
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
