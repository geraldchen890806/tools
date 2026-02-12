import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "世界时钟 - 免费在线世界时钟",
  description: "免费在线世界时钟工具，全球主要城市实时时间对照，支持时区转换",
  keywords: ["世界时钟","world clock","时区转换","全球时间"],
  openGraph: {
    title: "世界时钟 - 免费在线世界时钟 | AnyFreeTools",
    description: "免费在线世界时钟工具，全球主要城市实时时间对照，支持时区转换",
    url: "https://anyfreetools.com/tools/world-clock",
    siteName: "AnyFreeTools",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "世界时钟 - 免费在线世界时钟 | AnyFreeTools",
    description: "免费在线世界时钟工具，全球主要城市实时时间对照，支持时区转换",
  },
  alternates: {
    canonical: "https://anyfreetools.com/tools/world-clock",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "世界时钟",
          url: "https://anyfreetools.com/tools/world-clock",
          description: "免费在线世界时钟工具，全球主要城市实时时间对照，支持时区转换",
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
