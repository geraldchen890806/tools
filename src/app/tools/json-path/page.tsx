"use client";
import { ToolLayout } from "@/components/ToolLayout";
import { useTranslation } from "@/i18n";
import { useState } from "react";

function queryPath(obj: unknown, path: string): unknown {
  let p = path.replace(/^\$\.?/, "");
  if (!p) return obj;
  const parts: string[] = [];
  for (const seg of p.split(".")) {
    const m = seg.match(/^([^\[]*)\[(\d+)\]$/);
    if (m) { if (m[1]) parts.push(m[1]); parts.push(`[${m[2]}]`); }
    else if (seg) parts.push(seg);
  }
  let cur: unknown = obj;
  for (const part of parts) {
    if (cur == null) return undefined;
    const idx = part.match(/^\[(\d+)\]$/);
    if (idx) cur = (cur as unknown[])[Number(idx[1])];
    else cur = (cur as Record<string, unknown>)[part];
  }
  return cur;
}

export default function Page() {
  const { t } = useTranslation();
  const [json, setJson] = useState("");
  const [path, setPath] = useState("$.");
  const [result, setResult] = useState("");

  const query = () => {
    try {
      const obj = JSON.parse(json);
      const r = queryPath(obj, path);
      setResult(r === undefined ? t("toolPages.json-path.notFound") : JSON.stringify(r, null, 2));
    } catch (e) { setResult(t("toolPages.json-path.error") + ": " + (e as Error).message); }
  };

  return (
    <ToolLayout toolId="json-path">
      <textarea value={json} onChange={e => setJson(e.target.value)} placeholder='{"store":{"book":[{"title":"Hello"}]}}' rows={10} style={{ width: "100%", background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)", borderRadius: 8, padding: 12, fontFamily: "monospace", resize: "vertical" }} />
      <div style={{ display: "flex", gap: 8, margin: "12px 0" }}>
        <input value={path} onChange={e => setPath(e.target.value)} placeholder="$.store.book[0].title" style={{ flex: 1, background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)", borderRadius: 8, padding: 12, fontFamily: "monospace" }} />
        <button onClick={query} style={{ background: "var(--accent)", color: "white", padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer" }}>{t("toolPages.json-path.query")}</button>
        <button onClick={() => navigator.clipboard.writeText(result)} style={{ background: "var(--accent)", color: "white", padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer" }}>{t("common.copy")}</button>
      </div>
      <pre style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)", borderRadius: 8, padding: 12, minHeight: 100, fontFamily: "monospace", fontSize: 13 }}>{result}</pre>
    </ToolLayout>
  );
}
