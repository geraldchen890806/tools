"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";

export default function WordCounter() {
  const [text, setText] = useState("");

  const chars = text.length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chinese = (text.match(/[\u4e00-\u9fff]/g) || []).length;
  const lines = text ? text.split("\n").length : 0;
  const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(p => p.trim()).length : 0;

  const stats = [
    { label: "字符数", value: chars },
    { label: "单词数", value: words },
    { label: "中文字符", value: chinese },
    { label: "行数", value: lines },
    { label: "段落数", value: paragraphs },
  ];

  return (
    <ToolLayout title="字数统计" description="实时统计字符数、单词数、中文字符数、行数和段落数">
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="在此输入或粘贴文本..."
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
