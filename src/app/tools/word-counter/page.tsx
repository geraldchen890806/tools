"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { useTranslation } from "@/i18n";

export default function WordCounter() {
  const { t } = useTranslation();
  const [text, setText] = useState("");

  const chars = text.length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chinese = (text.match(/[\u4e00-\u9fff]/g) || []).length;
  const lines = text ? text.split("\n").length : 0;
  const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(p => p.trim()).length : 0;

  const stats = [
    { label: t("toolPages.word-counter.characters"), value: chars },
    { label: t("toolPages.word-counter.words"), value: words },
    { label: t("toolPages.word-counter.chineseChars"), value: chinese },
    { label: t("toolPages.word-counter.lines"), value: lines },
    { label: t("toolPages.word-counter.paragraphs"), value: paragraphs },
  ];

  return (
    <ToolLayout toolId="word-counter">
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder={t("toolPages.word-counter.placeholder")}
        rows={10}
        className="w-full rounded-lg p-3"
        style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
      />
      <div className="grid grid-cols-5 gap-4 mt-6">
        {stats.map(s => (
          <div key={s.label} className="text-center p-4 rounded-lg" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
            <div className="text-2xl font-bold" style={{ color: "var(--accent)" }}>{s.value}</div>
            <div className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>{s.label}</div>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}
