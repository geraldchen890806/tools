"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";

function toCamelCase(s: string) {
  return s.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase());
}
function toSnakeCase(s: string) {
  return s.replace(/([a-z])([A-Z])/g, "$1_$2").replace(/[\s\-]+/g, "_").toLowerCase();
}
function toKebabCase(s: string) {
  return s.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[\s_]+/g, "-").toLowerCase();
}
function toTitleCase(s: string) {
  return s.replace(/\b\w/g, c => c.toUpperCase());
}

const converters = [
  { label: "大写", fn: (s: string) => s.toUpperCase() },
  { label: "小写", fn: (s: string) => s.toLowerCase() },
  { label: "首字母大写", fn: toTitleCase },
  { label: "camelCase", fn: toCamelCase },
  { label: "snake_case", fn: toSnakeCase },
  { label: "kebab-case", fn: toKebabCase },
];

export default function CaseConverter() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const copy = () => navigator.clipboard.writeText(result);

  return (
    <ToolLayout title="大小写转换" description="支持多种大小写和命名格式转换">
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="输入要转换的文本..."
        rows={6}
        className="w-full rounded-lg p-3"
        style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
      />
      <div className="flex flex-wrap gap-2 mt-4">
        {converters.map(c => (
          <button key={c.label} onClick={() => setResult(c.fn(input))} className="px-4 py-2 rounded-lg text-white text-sm" style={{ background: "var(--accent)" }}>
            {c.label}
          </button>
        ))}
      </div>
      {result && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>结果</span>
            <button onClick={copy} className="px-4 py-2 rounded-lg text-white text-sm" style={{ background: "var(--accent)" }}>复制</button>
          </div>
          <pre className="w-full rounded-lg p-3 whitespace-pre-wrap" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" }}>{result}</pre>
        </div>
      )}
    </ToolLayout>
  );
}
