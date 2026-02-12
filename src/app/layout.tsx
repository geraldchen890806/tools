import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563eb",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://anyfreetools.com"),
  title: {
    default: "AnyFreeTools - 免费在线工具箱",
    template: "%s | AnyFreeTools",
  },
  description:
    "免费在线工具集合：JSON 格式化、Base64 编解码、颜色转换、UUID 生成、文本处理、图片压缩等开发者常用工具，无需安装，打开即用，所有计算在浏览器本地完成。",
  keywords: [
    "在线工具",
    "开发者工具",
    "JSON格式化",
    "Base64",
    "免费工具",
    "online tools",
    "工具箱",
    "程序员工具",
  ],
  authors: [{ name: "AnyFreeTools" }],
  creator: "AnyFreeTools",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://anyfreetools.com",
    siteName: "AnyFreeTools",
    title: "AnyFreeTools - 免费在线工具箱",
    description:
      "免费在线工具集合：JSON 格式化、Base64 编解码、颜色转换、UUID 生成、图片处理等，无需安装，打开即用。",
  },
  twitter: {
    card: "summary_large_image",
    title: "AnyFreeTools - 免费在线工具箱",
    description:
      "免费在线工具集合：JSON 格式化、Base64 编解码、颜色转换、UUID 生成、图片处理等，无需安装，打开即用。",
  },
  alternates: {
    canonical: "https://anyfreetools.com",
  },
  icons: {
    icon: "/favicon.svg",
  },
  verification: {
    google: "", // TODO: Add Google Search Console verification code
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-H7J9JEMQXT"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-H7J9JEMQXT');`}
        </Script>
      </head>
      <body className="antialiased min-h-screen">
        <ThemeProvider>
          <Navbar />
          <main className="pt-16">{children}</main>
          <footer
            className="border-t py-8 mt-20 text-center text-sm"
            style={{
              borderColor: "var(--border)",
              color: "var(--text-secondary)",
            }}
          >
            <p>
              © {new Date().getFullYear()} AnyFreeTools.
              免费开源，所有计算均在浏览器本地完成。
            </p>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
