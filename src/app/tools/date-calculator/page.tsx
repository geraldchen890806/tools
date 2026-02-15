"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { useTranslation } from "@/i18n";

const inputStyle: React.CSSProperties = { background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)", padding: "8px 12px", borderRadius: 6, width: "100%" };
const btnStyle: React.CSSProperties = { background: "var(--accent)", color: "white", padding: "8px 20px", borderRadius: 6, border: "none", cursor: "pointer", fontWeight: 500 };
const cardStyle: React.CSSProperties = { background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 };
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function fmt(d: Date) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; }
function today() { return fmt(new Date()); }

function dateDiff(a: Date, b: Date) {
  const ms = Math.abs(b.getTime() - a.getTime());
  const days = Math.floor(ms / 86400000);
  const weeks = Math.floor(days / 7);
  let y = b.getFullYear() - a.getFullYear();
  let m = b.getMonth() - a.getMonth();
  if (b < a) { y = -y; m = -m; }
  const totalMonths = Math.abs(y * 12 + m);
  return { days, weeks, months: totalMonths, years: Math.floor(totalMonths / 12), remMonths: totalMonths % 12 };
}

export default function DateCalculatorPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<"diff" | "add" | "weekday" | "countdown">("diff");
  const [d1, setD1] = useState(today());
  const [d2, setD2] = useState(today());
  const [addBase, setAddBase] = useState(today());
  const [addDays, setAddDays] = useState("0");
  const [wdInput, setWdInput] = useState(today());

  const tabs = [
    { key: "diff" as const, label: "日期差" },
    { key: "add" as const, label: "加减天数" },
    { key: "weekday" as const, label: "星期几" },
    { key: "countdown" as const, label: "倒计时" },
  ];

  const shortcuts = [
    { label: "距今年结束", date: `${new Date().getFullYear()}-12-31` },
    { label: "距春节", date: getNextCNY() },
    { label: "距国庆", date: getNextDate(10, 1) },
    { label: "距元旦", date: `${new Date().getFullYear() + 1}-01-01` },
    { label: "距中秋", date: getNextDate(9, 15) },
  ];

  function getNextDate(m: number, d: number) {
    const now = new Date();
    const y = now.getFullYear();
    const t = new Date(y, m - 1, d);
    return fmt(t >= now ? t : new Date(y + 1, m - 1, d));
  }

  function getNextCNY() {
    // Approximate Chinese New Year dates
    const cny: Record<number, string> = { 2025: "2025-01-29", 2026: "2026-02-17", 2027: "2027-02-06", 2028: "2028-01-26", 2029: "2029-02-13", 2030: "2030-02-03" };
    const now = new Date();
    for (const [, d] of Object.entries(cny)) { if (new Date(d) >= now) return d; }
    return `${now.getFullYear() + 1}-02-01`;
  }

  const diffResult = (() => {
    const a = new Date(d1), b = new Date(d2);
    if (isNaN(a.getTime()) || isNaN(b.getTime())) return null;
    return dateDiff(a, b);
  })();

  const addResult = (() => {
    const base = new Date(addBase);
    const n = parseInt(addDays);
    if (isNaN(base.getTime()) || isNaN(n)) return null;
    const r = new Date(base);
    r.setDate(r.getDate() + n);
    return { date: fmt(r), weekday: weekdays[r.getDay()] };
  })();

  const countdownDays = (target: string) => {
    const t = new Date(target), n = new Date();
    n.setHours(0, 0, 0, 0);
    return Math.ceil((t.getTime() - n.getTime()) / 86400000);
  };

  return (
    <ToolLayout toolId="date-calculator">
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{ ...btnStyle, background: tab === t.key ? "var(--accent)" : "var(--bg-card)", color: tab === t.key ? "white" : "var(--text-primary)", border: "1px solid var(--border)" }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "diff" && (
        <div style={cardStyle}>
          <h3 style={{ color: "var(--text-primary)", marginBottom: 16, fontSize: 16, fontWeight: 600 }}>计算两个日期的差距</h3>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <input type="date" value={d1} onChange={e => setD1(e.target.value)} style={{ ...inputStyle, width: "auto", flex: 1, minWidth: 150 }} />
            <span style={{ color: "var(--text-secondary)" }}>至</span>
            <input type="date" value={d2} onChange={e => setD2(e.target.value)} style={{ ...inputStyle, width: "auto", flex: 1, minWidth: 150 }} />
          </div>
          {diffResult && (
            <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 12 }}>
              {[
                { label: "天", value: diffResult.days },
                { label: "周", value: diffResult.weeks },
                { label: "月", value: diffResult.months },
                { label: "年+月", value: `${diffResult.years}年${diffResult.remMonths}月` },
              ].map(i => (
                <div key={i.label} style={{ background: "var(--bg-primary)", borderRadius: 8, padding: 16, textAlign: "center" }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: "var(--accent)" }}>{i.value}</div>
                  <div style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 4 }}>{i.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "add" && (
        <div style={cardStyle}>
          <h3 style={{ color: "var(--text-primary)", marginBottom: 16, fontSize: 16, fontWeight: 600 }}>日期加减天数</h3>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <input type="date" value={addBase} onChange={e => setAddBase(e.target.value)} style={{ ...inputStyle, width: "auto", flex: 1, minWidth: 150 }} />
            <span style={{ color: "var(--text-secondary)" }}>+</span>
            <input type="number" value={addDays} onChange={e => setAddDays(e.target.value)} style={{ ...inputStyle, width: 100, flex: "none" }} placeholder={t("toolPages.date-calculator.daysPlaceholder")} />
            <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>（负数为减）</span>
          </div>
          {addResult && (
            <div style={{ marginTop: 20, background: "var(--bg-primary)", borderRadius: 8, padding: 16, textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: "var(--accent)" }}>{addResult.date}</div>
              <div style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 4 }}>{addResult.weekday}</div>
            </div>
          )}
        </div>
      )}

      {tab === "weekday" && (
        <div style={cardStyle}>
          <h3 style={{ color: "var(--text-primary)", marginBottom: 16, fontSize: 16, fontWeight: 600 }}>查询星期几</h3>
          <input type="date" value={wdInput} onChange={e => setWdInput(e.target.value)} style={inputStyle} />
          {wdInput && !isNaN(new Date(wdInput).getTime()) && (
            <div style={{ marginTop: 20, background: "var(--bg-primary)", borderRadius: 8, padding: 16, textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: "var(--accent)" }}>{weekdays[new Date(wdInput).getDay()]}</div>
            </div>
          )}
        </div>
      )}

      {tab === "countdown" && (
        <div style={cardStyle}>
          <h3 style={{ color: "var(--text-primary)", marginBottom: 16, fontSize: 16, fontWeight: 600 }}>常用倒计时</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
            {shortcuts.map(s => {
              const d = countdownDays(s.date);
              return (
                <div key={s.label} style={{ background: "var(--bg-primary)", borderRadius: 8, padding: 16, textAlign: "center" }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: d <= 0 ? "var(--text-secondary)" : "var(--accent)" }}>{d <= 0 ? "已过" : `${d}天`}</div>
                  <div style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 4 }}>{s.label}</div>
                  <div style={{ color: "var(--text-secondary)", fontSize: 11, marginTop: 2 }}>{s.date}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
