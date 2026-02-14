"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { useTranslation } from "@/i18n";

export default function RegexTester() {
  const { t } = useTranslation();
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("");

  const { matches, highlighted, error } = useMemo(() => {
    if (!pattern) return { matches: [], highlighted: "", error: "" };
    try {
      const re = new RegExp(pattern, flags);
      const ms: string[] = [];
      let m;
      const reCopy = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
      while ((m = reCopy.exec(text)) !== null) {
        ms.push(m[0]);
        if (!reCopy.global) break;
      }
      const hl = text.replace(new RegExp(pattern, flags.includes("g") ? flags : flags + "g"), match =>
        `<mark style="background:var(--accent);color:white;padding:1px 2px;border-radius:2px">${match}</mark>`
      );
      return { matches: ms, highlighted: hl, error: "" };
    } catch (e: any) {
      return { matches: [], highlighted: "", error: e.message };
    }
  }, [pattern, flags, text]);

  const inputStyle = { background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" };

  return (
    <ToolLayout toolId="regex-tester">
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="text-sm mb-1 block" style={{ color: "var(--text-secondary)" }}>正则表达式</label>
          <input value={pattern} onChange={e => setPattern(e.target.value)} placeholder={t("toolPages.regex-tester.patternPlaceholder")} className="w-full rounded-lg p-3" style={inputStyle} />
        </div>
        <div className="w-24">
          <label className="text-sm mb-1 block" style={{ color: "var(--text-secondary)" }}>{t("toolPages.regex-tester.flags")}</label>
          <input value={flags} onChange={e => setFlags(e.target.value)} className="w-full rounded-lg p-3" style={inputStyle} />
        </div>
      </div>
      {error && <div className="mt-2 text-sm" style={{ color: "#ef4444" }}>{error}</div>}
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder={t("toolPages.regex-tester.textPlaceholder")} rows={8} className="w-full rounded-lg p-3 mt-4" style={inputStyle} />
      {pattern && text && !error && (
        <div className="mt-4 space-y-4">
          <div className="rounded-lg p-3" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
            <div className="text-sm mb-2" style={{ color: "var(--text-secondary)" }}>{t("toolPages.regex-tester.highlightResult")}</div>
            <div className="font-mono text-sm whitespace-pre-wrap" style={{ color: "var(--text-primary)" }} dangerouslySetInnerHTML={{ __html: highlighted }} />
          </div>
          <div className="rounded-lg p-3" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
            <div className="text-sm mb-2" style={{ color: "var(--text-secondary)" }}>匹配项 ({matches.length})</div>
            {matches.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {matches.map((m, i) => (
                  <span key={i} className="px-2 py-1 rounded text-sm font-mono" style={{ background: "var(--accent)", color: "white" }}>{m}</span>
                ))}
              </div>
            ) : <div className="text-sm" style={{ color: "var(--text-secondary)" }}>{t("toolPages.regex-tester.noMatch")}</div>}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
