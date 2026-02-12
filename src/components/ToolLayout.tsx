"use client";

import Link from "next/link";
import { useTranslation } from "@/i18n";

export function ToolLayout({
  title,
  description,
  toolId,
  children,
}: {
  title?: string;
  description?: string;
  toolId?: string;
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const displayTitle = toolId ? t(`tools.${toolId}.name`) : title || "";
  const displayDesc = toolId ? t(`tools.${toolId}.description`) : description || "";

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm mb-6 hover:opacity-80 transition-opacity"
        style={{ color: "var(--accent-light)" }}
      >
        {t("common.backToHome")}
      </Link>
      <h1 className="text-3xl font-bold mb-2">{displayTitle}</h1>
      <p className="mb-8" style={{ color: "var(--text-secondary)" }}>
        {displayDesc}
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
