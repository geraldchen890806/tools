"use client";
import { ToolLayout } from "@/components/ToolLayout";
import { useState } from "react";

const levels = ["ERROR", "FATAL", "WARN", "INFO", "DEBUG"] as const;
const bgMap: Record<string, string> = { ERROR: "#fecaca", FATAL: "#fecaca", WARN: "#fef9c3", INFO: "#dbeafe", DEBUG: "#f3f4f6" };

function getLevel(line: string): string | null {
  const upper = line.toUpperCase();
  for (const l of levels) if (upper.includes(l)) return l;
  return null;
}

export default function Page() {
  const [text, setText] = useState("");
  const [filters, setFilters] = useState<Record<string, boolean>>({ ERROR: true, FATAL: true, WARN: true, INFO: true, DEBUG: true });

  const toggle = (l: string) => setFilters(f => ({ ...f, [l]: !f[l] }));
  const lines = text.split("\n");

  return (
    <ToolLayout title="日志高亮" description="按日志级别高亮显示，支持筛选">
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="粘贴日志内容..." rows={10} style={{ width: "100%", background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)", borderRadius: 8, padding: 12, fontFamily: "monospace", resize: "vertical" }} />
      <div style={{ display: "flex", gap: 16, margin: "12px 0", flexWrap: "wrap" }}>
        {levels.map(l => (
          <label key={l} style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--text-primary)", cursor: "pointer" }}>
            <input type="checkbox" checked={filters[l]} onChange={() => toggle(l)} />
            <span style={{ background: bgMap[l], padding: "2px 8px", borderRadius: 4, fontSize: 13 }}>{l}</span>
          </label>
        ))}
      </div>
      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 8, padding: 12, fontFamily: "monospace", fontSize: 13, maxHeight: 500, overflow: "auto" }}>
        {lines.map((line, i) => {
          const level = getLevel(line);
          if (level && !filters[level]) return null;
          return (
            <div key={i} style={{ display: "flex", background: level ? bgMap[level] : "transparent", padding: "2px 8px", borderRadius: 4, marginBottom: 1 }}>
              <span style={{ color: "#999", minWidth: 40, textAlign: "right", marginRight: 12, userSelect: "none" }}>{i + 1}</span>
              <span style={{ color: level ? "#1a1a1a" : "var(--text-primary)", whiteSpace: "pre-wrap" }}>{line}</span>
            </div>
          );
        })}
      </div>
    </ToolLayout>
  );
}
