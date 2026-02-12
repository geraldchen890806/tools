import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "万年历 - 免费在线万年历",
  description: "免费在线万年历，公历农历对照，显示中国传统节日、二十四节气、公历节日",
  keywords: ["万年历","农历","节气","日历","chinese calendar"],
  openGraph: {
    title: "万年历 - 免费在线万年历 | AnyFreeTools",
    description: "免费在线万年历，公历农历对照，显示中国传统节日、二十四节气、公历节日",
    url: "https://anyfreetools.com/tools/calendar",
    siteName: "AnyFreeTools",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "万年历 - 免费在线万年历 | AnyFreeTools",
    description: "免费在线万年历，公历农历对照，显示中国传统节日、二十四节气、公历节日",
  },
  alternates: { canonical: "https://anyfreetools.com/tools/calendar" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebApplication", name: "万年历", url: "https://anyfreetools.com/tools/calendar", description: "免费在线万年历，公历农历对照，显示中国传统节日、二十四节气、公历节日", applicationCategory: "UtilitiesApplication", operatingSystem: "All", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, browserRequirements: "Requires a modern web browser" }} />
      {children}
    </>
  );
}
