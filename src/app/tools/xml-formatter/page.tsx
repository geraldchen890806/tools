"use client";
import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { useTranslation } from "@/i18n";
import xmlFormat from "xml-formatter";

export default function XmlFormatterPage() {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const inputStyle = "w-full h-64 p-3 rounded-lg font-mono text-sm";
  const inputCss = { background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" };
  const btnStyle = { background: "var(--accent)", color: "var(--bg-primary)" };

  const formatXml = () => {
    setError("");
    setOutput("");
    if (!input.trim()) {
      setError(t("toolPages.xml-formatter.errorEmpty"));
      return;
    }
    try {
      const formatted = xmlFormat(input, {
        indentation: "  ",
        collapseContent: true,
        lineSeparator: "\n",
      });
      setOutput(formatted);
    } catch (err) {
      setError(t("toolPages.xml-formatter.errorInvalid"));
    }
  };

  const minifyXml = () => {
    setError("");
    setOutput("");
    if (!input.trim()) {
      setError(t("toolPages.xml-formatter.errorEmpty"));
      return;
    }
    try {
      const minified = xmlFormat.minify(input, {
        collapseContent: true,
      });
      setOutput(minified);
    } catch (err) {
      setError(t("toolPages.xml-formatter.errorInvalid"));
    }
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  return (
    <ToolLayout toolId="xml-formatter">
      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>
            {t("common.input")}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("toolPages.xml-formatter.inputPlaceholder")}
            className={inputStyle}
            style={inputCss}
          />
        </div>

        <div className="flex gap-2">
          <button onClick={formatXml} className="px-4 py-2 rounded-lg" style={btnStyle}>
            {t("toolPages.xml-formatter.format")}
          </button>
          <button onClick={minifyXml} className="px-4 py-2 rounded-lg" style={btnStyle}>
            {t("toolPages.xml-formatter.minify")}
          </button>
          <button onClick={clearAll} className="px-4 py-2 rounded-lg" style={{ ...btnStyle, background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}>
            {t("common.clear")}
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg" style={{ background: "rgba(239, 68, 68, 0.1)", color: "rgb(239, 68, 68)", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
            {error}
          </div>
        )}

        {output && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {t("common.output")}
              </label>
              <button onClick={copyOutput} className="px-3 py-1 rounded text-sm" style={btnStyle}>
                {t("common.copy")}
              </button>
            </div>
            <textarea
              value={output}
              readOnly
              className={inputStyle}
              style={{ ...inputCss, background: "var(--bg-primary)" }}
            />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
