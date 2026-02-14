"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { useTranslation } from "@/i18n";

const inputStyle: React.CSSProperties = { background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" };
const btnStyle: React.CSSProperties = { background: "var(--accent)", color: "white" };

const bases = [
  { label: "二进制 (2)", base: 2 },
  { label: "八进制 (8)", base: 8 },
  { label: "十进制 (10)", base: 10 },
  { label: "十六进制 (16)", base: 16 },
];

export default function NumberBasePage() {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [srcBase, setSrcBase] = useState(10);
  const [results, setResults] = useState<{ label: string; value: string }[]>([]);
  const [error, setError] = useState("");

  const convert = () => {
    setError("");
    const n = parseInt(input, srcBase);
    if (isNaN(n)) { setError("无效输入"); setResults([]); return; }
    setResults(bases.map(b => ({ label: b.label, value: n.toString(b.base).toUpperCase() })));
  };

  return (
    <ToolLayout toolId="number-base">
      <div className="space-y-4">
        <div className="flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="输入数字" className="flex-1 rounded-lg p-3" style={inputStyle} />
          <select value={srcBase} onChange={e => setSrcBase(Number(e.target.value))} className="rounded-lg p-3" style={inputStyle}>
            {bases.map(b => <option key={b.base} value={b.base}>{b.label}</option>)}
          </select>
          <button onClick={convert} className="px-4 py-2 rounded-lg" style={btnStyle}>{t("toolPages.number-base.convert")}</button>
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {results.map(r => (
          <div key={r.label} className="flex items-center gap-2 p-3 rounded-lg" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
            <span className="text-sm w-32" style={{ color: "var(--text-secondary)" }}>{r.label}</span>
            <span className="flex-1 font-mono" style={{ color: "var(--text-primary)" }}>{r.value}</span>
            <button onClick={() => navigator.clipboard.writeText(r.value)} className="px-3 py-1 rounded text-sm" style={btnStyle}>{t("common.copy")}</button>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}
