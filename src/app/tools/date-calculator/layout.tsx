import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "日期计算器 - 免费在线日期计算",
  description: "免费在线日期计算器，支持日期差计算、加减天数、星期查询、倒计时等功能",
  keywords: ["日期计算器","日期差","天数计算","倒计时","date calculator"],
  openGraph: {
    title: "日期计算器 - 免费在线日期计算 | AnyFreeTools",
    description: "免费在线日期计算器，支持日期差计算、加减天数、星期查询、倒计时等功能",
    url: "https://anyfreetools.com/tools/date-calculator",
    siteName: "AnyFreeTools",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "日期计算器 - 免费在线日期计算 | AnyFreeTools",
    description: "免费在线日期计算器，支持日期差计算、加减天数、星期查询、倒计时等功能",
  },
  alternates: { canonical: "https://anyfreetools.com/tools/date-calculator" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebApplication", name: "日期计算器", url: "https://anyfreetools.com/tools/date-calculator", description: "免费在线日期计算器，支持日期差计算、加减天数、星期查询、倒计时等功能", applicationCategory: "UtilitiesApplication", operatingSystem: "All", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, browserRequirements: "Requires a modern web browser" }} />
      {children}
    </>
  );
}
