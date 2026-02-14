"use client";
import { ToolLayout } from "@/components/ToolLayout";
import { useTranslation } from "@/i18n";
import { useState } from "react";

const presets = [
  { label: "每分钟", values: ["*", "*", "*", "*", "*"] },
  { label: "每小时", values: ["0", "*", "*", "*", "*"] },
  { label: "每天 0:00", values: ["0", "0", "*", "*", "*"] },
  { label: "每周一", values: ["0", "0", "*", "*", "1"] },
  { label: "每月1号", values: ["0", "0", "1", "*", "*"] },
];

const fields = ["分", "时", "日", "月", "周"];
const weekNames = ["日", "一", "二", "三", "四", "五", "六"];
const monthNames = ["", "1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

function explain(v: string[]): string {
  const [min, hour, day, month, week] = v.map(s => s.trim() || "*");
  const parts: string[] = [];

  if (month !== "*") parts.push(`${month}月`);
  if (week !== "*") parts.push(`每周${weekNames[Number(week)] || week}`);
  else if (day !== "*") parts.push(`每月${day}号`);
  else if (month === "*" && hour !== "*") parts.push("每天");
  else if (month === "*" && hour === "*" && min !== "*") parts.push("每小时");

  if (hour !== "*" && min !== "*") parts.push(`${hour.padStart(2, "0")}:${min.padStart(2, "0")}`);
  else if (hour !== "*") parts.push(`${hour}时`);
  else if (min !== "*" && min !== "0") parts.push(`第${min}分钟`);

  if (parts.length === 0) {
    if (v.every(x => x.trim() === "*" || x.trim() === "")) return "每分钟执行";
  }
  return parts.join(" ") + " 执行";
}

export default function Page() {
  const { t } = useTranslation();
  const [vals, setVals] = useState(["*", "*", "*", "*", "*"]);
  const set = (i: number, v: string) => { const n = [...vals]; n[i] = v; setVals(n); };

  return (
    <ToolLayout toolId="cron-parser">
      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        {fields.map((f, i) => (
          <div key={f} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <label style={{ color: "var(--text-secondary)", fontSize: 13 }}>{f}</label>
            <input value={vals[i]} onChange={e => set(i, e.target.value)} style={{ width: 64, textAlign: "center", background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)", borderRadius: 8, padding: 12, fontFamily: "monospace" }} />
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {presets.map(p => (
          <button key={p.label} onClick={() => setVals([...p.values])} style={{ background: "var(--accent)", color: "white", padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13 }}>{p.label}</button>
        ))}
      </div>
      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 8, padding: 16 }}>
        <div style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 8 }}>Cron 表达式</div>
        <code style={{ color: "var(--accent)", fontSize: 18, fontWeight: 600 }}>{vals.join(" ")}</code>
        <div style={{ color: "var(--text-primary)", fontSize: 16, marginTop: 12 }}>📋 {explain(vals)}</div>
      </div>
    </ToolLayout>
  );
}
