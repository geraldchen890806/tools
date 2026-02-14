"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { useTranslation } from "@/i18n";

function toCamelCase(s: string) {
  return s.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase());
}
function toSnakeCase(s: string) {
  return s.replace(/([a-z])([A-Z])/g, "$1_$2").replace(/[\s\-]+/g, "_").toLowerCase();
}
function toKebabCase(s: string) {
  return s.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[\s_]+/g, "-").toLowerCase();
}
function toTitleCase(s: string) {
  return s.replace(/\b\w/g, c => c.toUpperCase());
}

const useCaseConverters = (t: any) => [
  { label: t("toolPages.case-converter.uppercase"), fn: (s: string) => s.toUpperCase() },
  { label: t("toolPages.case-converter.lowercase"), fn: (s: string) => s.toLowerCase() },
  { label: t("toolPages.case-converter.titleCase"), fn: toTitleCase },
  { label: "camelCase", fn: toCamelCase },
  { label: "snake_case", fn: toSnakeCase },
  { label: "kebab-case", fn: toKebabCase },
];

export default function CaseConverter() {
  const { t } = useTranslation();
  const converters = useCaseConverters(t);
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const copy = () => navigator.clipboard.writeText(result);

  return (
    <ToolLayout toolId="case-converter">
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={t("common.inputPlaceholder")}
        rows={6}
        className="w-full rounded-lg p-3"
        style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
      />
      <div className="flex flex-wrap gap-2 mt-4">
        {converters.map(c => (
          <button key={c.label} onClick={() => setResult(c.fn(input))} className="px-4 py-2 rounded-lg text-white text-sm" style={{ background: "var(--accent)" }}>
            {c.label}
          </button>
        ))}
      </div>
      {result && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{t("common.result")}</span>
            <button onClick={copy} className="px-4 py-2 rounded-lg text-white text-sm" style={{ background: "var(--accent)" }}>{t("common.copy")}</button>
          </div>
          <pre className="w-full rounded-lg p-3 whitespace-pre-wrap" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" }}>{result}</pre>
        </div>
      )}
    </ToolLayout>
  );
}
