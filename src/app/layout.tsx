import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "AnyFreeTools - 免费在线工具箱",
  description:
    "免费在线工具集合：JSON 格式化、Base64 编解码、颜色转换、UUID 生成、文本处理等开发者常用工具，无需安装，打开即用。",
  keywords: [
    "在线工具",
    "开发者工具",
    "JSON格式化",
    "Base64",
    "免费工具",
    "online tools",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
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
