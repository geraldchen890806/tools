import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "密码生成器 - 免费在线密码生成器",
  description: "免费在线密码生成工具，自定义长度和字符类型，生成高强度安全密码",
  keywords: ["密码生成","password generator","随机密码","安全密码"],
  openGraph: {
    title: "密码生成器 - 免费在线密码生成器 | AnyFreeTools",
    description: "免费在线密码生成工具，自定义长度和字符类型，生成高强度安全密码",
    url: "https://anyfreetools.com/tools/password-generator",
    siteName: "AnyFreeTools",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "密码生成器 - 免费在线密码生成器 | AnyFreeTools",
    description: "免费在线密码生成工具，自定义长度和字符类型，生成高强度安全密码",
  },
  alternates: {
    canonical: "https://anyfreetools.com/tools/password-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "密码生成器",
          url: "https://anyfreetools.com/tools/password-generator",
          description: "免费在线密码生成工具，自定义长度和字符类型，生成高强度安全密码",
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
