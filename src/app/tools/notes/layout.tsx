import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "备忘提醒 - 免费在线备忘录",
  description: "免费在线备忘提醒工具，创建备忘录、设置提醒时间，支持浏览器通知",
  keywords: ["备忘录","提醒","待办事项","notes","reminder"],
  openGraph: {
    title: "备忘提醒 - 免费在线备忘录 | AnyFreeTools",
    description: "免费在线备忘提醒工具，创建备忘录、设置提醒时间，支持浏览器通知",
    url: "https://anyfreetools.com/tools/notes",
    siteName: "AnyFreeTools",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "备忘提醒 - 免费在线备忘录 | AnyFreeTools",
    description: "免费在线备忘提醒工具，创建备忘录、设置提醒时间，支持浏览器通知",
  },
  alternates: { canonical: "https://anyfreetools.com/tools/notes" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebApplication", name: "备忘提醒", url: "https://anyfreetools.com/tools/notes", description: "免费在线备忘提醒工具，创建备忘录、设置提醒时间，支持浏览器通知", applicationCategory: "UtilitiesApplication", operatingSystem: "All", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, browserRequirements: "Requires a modern web browser" }} />
      {children}
    </>
  );
}
