"use client";

import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { useTranslation } from "@/i18n";

const inputStyle: React.CSSProperties = { background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" };
const btnStyle: React.CSSProperties = { background: "var(--accent)", color: "white" };

export default function TimestampPage() {
  const { t } = useTranslation();
  const [now, setNow] = useState(Date.now());
  const [tsInput, setTsInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [tsResult, setTsResult] = useState("");
  const [dateResult, setDateResult] = useState("");

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const convertTs = () => {
    const n = Number(tsInput);
    if (isNaN(n)) { setTsResult("无效时间戳"); return; }
    const ms = tsInput.length > 10 ? n : n * 1000;
    const d = new Date(ms);
    setTsResult(d.toLocaleString() + `\nISO: ${d.toISOString()}\n{t("toolPages.timestamp.seconds")}: ${Math.floor(ms / 1000)}\n毫{t("toolPages.timestamp.seconds")}: ${ms}`);
  };

  const convertDate = () => {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) { setDateResult("无效日期"); return; }
    setDateResult(`{t("toolPages.timestamp.seconds")}: ${Math.floor(d.getTime() / 1000)}\n毫{t("toolPages.timestamp.seconds")}: ${d.getTime()}`);
  };

  const copy = (t: string) => navigator.clipboard.writeText(t);
  const nowDate = new Date(now);

  return (
    <ToolLayout toolId="timestamp">
      <div className="space-y-6">
        <div className="rounded-lg p-4" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
          <div className="text-sm mb-1" style={{ color: "var(--text-secondary)" }}>{t("toolPages.timestamp.currentTime")}</div>
          <div className="text-xl font-mono" style={{ color: "var(--text-primary)" }}>{nowDate.toLocaleString()}</div>
          <div className="flex gap-4 mt-1 text-sm font-mono" style={{ color: "var(--text-secondary)" }}>
            <span>{t("toolPages.timestamp.seconds")}: {Math.floor(now / 1000)}</span>
            <span>{t("toolPages.timestamp.milliseconds")}: {now}</span>
            <button onClick={() => copy(String(Math.floor(now / 1000)))} className="px-2 py-0.5 rounded text-xs" style={btnStyle}>{t("toolPages.timestamp.copySeconds")}</button>
            <button onClick={() => copy(String(now))} className="px-2 py-0.5 rounded text-xs" style={btnStyle}>{t("toolPages.timestamp.copyMilliseconds")}</button>
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>时间戳 → 日期</label>
          <div className="flex gap-2">
            <input value={tsInput} onChange={e => setTsInput(e.target.value)} placeholder="输入时间戳（秒或毫秒）" className="flex-1 rounded-lg p-3" style={inputStyle} />
            <button onClick={convertTs} className="px-4 py-2 rounded-lg" style={btnStyle}>转换</button>
          </div>
          {tsResult && <pre className="mt-2 p-3 rounded-lg text-sm font-mono whitespace-pre-wrap" style={{ background: "var(--bg-secondary)", color: "var(--text-primary)" }}>{tsResult}</pre>}
        </div>

        <div>
          <label className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>日期 → 时间戳</label>
          <div className="flex gap-2">
            <input value={dateInput} onChange={e => setDateInput(e.target.value)} placeholder="如 2024-01-01 12:00:00" className="flex-1 rounded-lg p-3" style={inputStyle} />
            <button onClick={convertDate} className="px-4 py-2 rounded-lg" style={btnStyle}>转换</button>
          </div>
          {dateResult && <pre className="mt-2 p-3 rounded-lg text-sm font-mono whitespace-pre-wrap" style={{ background: "var(--bg-secondary)", color: "var(--text-primary)" }}>{dateResult}</pre>}
        </div>
      </div>
    </ToolLayout>
  );
}
