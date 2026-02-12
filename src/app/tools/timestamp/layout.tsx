import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "时间戳转换 - 免费在线时间戳转换",
  description: "免费在线时间戳转换工具，Unix 时间戳与日期时间互转，支持毫秒级精度",
  keywords: ["时间戳转换","timestamp converter","Unix时间戳","日期转换"],
  openGraph: {
    title: "时间戳转换 - 免费在线时间戳转换 | AnyFreeTools",
    description: "免费在线时间戳转换工具，Unix 时间戳与日期时间互转，支持毫秒级精度",
    url: "https://anyfreetools.com/tools/timestamp",
    siteName: "AnyFreeTools",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "时间戳转换 - 免费在线时间戳转换 | AnyFreeTools",
    description: "免费在线时间戳转换工具，Unix 时间戳与日期时间互转，支持毫秒级精度",
  },
  alternates: {
    canonical: "https://anyfreetools.com/tools/timestamp",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "时间戳转换",
          url: "https://anyfreetools.com/tools/timestamp",
          description: "免费在线时间戳转换工具，Unix 时间戳与日期时间互转，支持毫秒级精度",
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
