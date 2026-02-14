"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { useTranslation } from "@/i18n";

export default function Base64Tool() {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const encode = () => { try { setOutput(btoa(unescape(encodeURIComponent(input)))); setError(""); } catch (e: any) { setError(e.message); } };
  const decode = () => { try { setOutput(decodeURIComponent(escape(atob(input)))); setError(""); } catch (e: any) { setError(e.message); } };
  const copy = () => navigator.clipboard.writeText(output);

  const inputStyle = { background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" };

  return (
    <ToolLayout toolId="base64">
      <textarea value={input} onChange={e => setInput(e.target.value)} placeholder={t("toolPages.base64.inputPlaceholder")} rows={6} className="w-full rounded-lg p-3" style={inputStyle} />
      <div className="flex gap-2 mt-4">
        <button onClick={encode} className="px-4 py-2 rounded-lg text-white" style={{ background: "var(--accent)" }}>{t("common.encode")}</button>
        <button onClick={decode} className="px-4 py-2 rounded-lg text-white" style={{ background: "var(--accent)" }}>{t("common.decode")}</button>
        <button onClick={copy} className="px-4 py-2 rounded-lg text-white" style={{ background: "var(--accent)" }}>{t("toolPages.base64.copyResult")}</button>
      </div>
      {error && <div className="mt-3 text-sm p-3 rounded-lg" style={{ color: "#ef4444", background: "#ef444420" }}>{error}</div>}
      <textarea value={output} readOnly placeholder={t("toolPages.base64.resultPlaceholder")} rows={6} className="w-full rounded-lg p-3 mt-4" style={inputStyle} />
    </ToolLayout>
  );
}
