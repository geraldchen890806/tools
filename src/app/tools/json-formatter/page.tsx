"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const format = () => {
    try { setOutput(JSON.stringify(JSON.parse(input), null, 2)); setError(""); } catch (e: any) { setError(e.message); }
  };
  const minify = () => {
    try { setOutput(JSON.stringify(JSON.parse(input))); setError(""); } catch (e: any) { setError(e.message); }
  };
  const copy = () => navigator.clipboard.writeText(output);

  return (
    <ToolLayout title="JSON 格式化" description="格式化、压缩和验证 JSON 数据">
      <div className="grid grid-cols-2 gap-4">
        <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="粘贴 JSON..." rows={16} className="w-full rounded-lg p-3 font-mono text-sm" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
        <pre className="w-full rounded-lg p-3 overflow-auto font-mono text-sm" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)", minHeight: "400px", whiteSpace: "pre-wrap" }}>{output || "格式化结果将显示在这里..."}</pre>
      </div>
      <div className="flex gap-2 mt-4">
        <button onClick={format} className="px-4 py-2 rounded-lg text-white" style={{ background: "var(--accent)" }}>格式化</button>
        <button onClick={minify} className="px-4 py-2 rounded-lg text-white" style={{ background: "var(--accent)" }}>压缩</button>
        <button onClick={copy} className="px-4 py-2 rounded-lg text-white" style={{ background: "var(--accent)" }}>复制</button>
      </div>
      {error && <div className="mt-3 text-sm p-3 rounded-lg" style={{ color: "#ef4444", background: "#ef444420" }}>{error}</div>}
    </ToolLayout>
  );
}
