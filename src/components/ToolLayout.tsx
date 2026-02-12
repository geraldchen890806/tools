"use client";

import Link from "next/link";

export function ToolLayout({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm mb-6 hover:opacity-80 transition-opacity"
        style={{ color: "var(--accent-light)" }}
      >
        ← 返回首页
      </Link>
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <p className="mb-8" style={{ color: "var(--text-secondary)" }}>
        {description}
      </p>
      <div
        className="rounded-xl border p-6"
        style={{
          background: "var(--bg-card)",
          borderColor: "var(--border)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
