"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";

const inputStyle: React.CSSProperties = { background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" };
const btnStyle: React.CSSProperties = { background: "var(--accent)", color: "white" };

export default function UUIDGeneratorPage() {
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>([]);

  const generate = () => setUuids(Array.from({ length: count }, () => crypto.randomUUID()));
  const copy = (t: string) => navigator.clipboard.writeText(t);

  return (
    <ToolLayout title="UUID 生成器" description="批量生成 UUID v4">
      <div className="space-y-4">
        <div className="flex gap-2 items-center">
          <label className="text-sm" style={{ color: "var(--text-secondary)" }}>数量</label>
          <input type="number" min={1} max={100} value={count} onChange={e => setCount(Number(e.target.value))} className="w-24 rounded-lg p-3" style={inputStyle} />
          <button onClick={generate} className="px-4 py-2 rounded-lg" style={btnStyle}>生成</button>
          {uuids.length > 0 && <button onClick={() => copy(uuids.join("\n"))} className="px-4 py-2 rounded-lg" style={btnStyle}>全部复制</button>}
        </div>
        <div className="space-y-2">
          {uuids.map((u, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
              <span className="flex-1 font-mono text-sm" style={{ color: "var(--text-primary)" }}>{u}</span>
              <button onClick={() => copy(u)} className="px-3 py-1 rounded text-sm" style={btnStyle}>复制</button>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
