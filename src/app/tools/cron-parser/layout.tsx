import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Cron 表达式 - 免费在线Cron 表达式",
  description: "免费在线 Cron 表达式解析工具，可视化编辑和解读 Cron 定时任务表达式",
  keywords: ["Cron表达式","cron parser","定时任务","crontab"],
  openGraph: {
    title: "Cron 表达式 - 免费在线Cron 表达式 | AnyFreeTools",
    description: "免费在线 Cron 表达式解析工具，可视化编辑和解读 Cron 定时任务表达式",
    url: "https://anyfreetools.com/tools/cron-parser",
    siteName: "AnyFreeTools",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Cron 表达式 - 免费在线Cron 表达式 | AnyFreeTools",
    description: "免费在线 Cron 表达式解析工具，可视化编辑和解读 Cron 定时任务表达式",
  },
  alternates: {
    canonical: "https://anyfreetools.com/tools/cron-parser",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Cron 表达式",
          url: "https://anyfreetools.com/tools/cron-parser",
          description: "免费在线 Cron 表达式解析工具，可视化编辑和解读 Cron 定时任务表达式",
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
