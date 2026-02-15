"use client";
import { ToolLayout } from "@/components/ToolLayout";
import { useTranslation } from "@/i18n";
import { useState } from "react";

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let current = "";
  let inQuotes = false;
  let row: string[] = [];
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"' && text[i + 1] === '"') { current += '"'; i++; }
      else if (ch === '"') inQuotes = false;
      else current += ch;
    } else {
      if (ch === '"') inQuotes = true;
      else if (ch === ",") { row.push(current); current = ""; }
      else if (ch === "\n" || (ch === "\r" && text[i + 1] === "\n")) {
        if (ch === "\r") i++;
        row.push(current); current = "";
        if (row.some(c => c.trim())) rows.push(row);
        row = [];
      } else current += ch;
    }
  }
  row.push(current);
  if (row.some(c => c.trim())) rows.push(row);
  return rows;
}

export default function Page() {
  const { t } = useTranslation();
  const [csv, setCsv] = useState("");
  const [json, setJson] = useState("");

  const convert = () => {
    try {
      const rows = parseCSV(csv.trim());
      if (rows.length < 2) { setJson(t("toolPages.csv-to-json.errorMinRows")); return; }
      const headers = rows[0].map(h => h.trim());
      const result = rows.slice(1).map(row => {
        const obj: Record<string, string> = {};
        headers.forEach((h, i) => { obj[h] = (row[i] || "").trim(); });
        return obj;
      });
      setJson(JSON.stringify(result, null, 2));
    } catch { setJson(t("toolPages.csv-to-json.errorParse")); }
  };

  const copy = () => { navigator.clipboard.writeText(json); };

  return (
    <ToolLayout toolId="csv-to-json">
      <div style={{ display: "flex", gap: 16, minHeight: 400 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <label style={{ color: "var(--text-secondary)", marginBottom: 8 }}>CSV 输入（第一行为表头）</label>
          <textarea value={csv} onChange={e => setCsv(e.target.value)} placeholder={"name,age,city\nAlice,30,Beijing\nBob,25,Shanghai"} style={{ flex: 1, background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)", borderRadius: 8, padding: 12, resize: "none", fontFamily: "monospace" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, justifyContent: "center" }}>
          <button onClick={convert} style={{ background: "var(--accent)", color: "white", padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer" }}>转换 →</button>
          <button onClick={copy} style={{ background: "var(--accent)", color: "white", padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer" }}>{t("common.copy")}</button>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <label style={{ color: "var(--text-secondary)", marginBottom: 8 }}>JSON 输出</label>
          <pre style={{ flex: 1, background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)", borderRadius: 8, padding: 12, overflow: "auto", margin: 0, fontFamily: "monospace", fontSize: 13 }}>{json}</pre>
        </div>
      </div>
    </ToolLayout>
  );
}
