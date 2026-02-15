"use client";
import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { useTranslation } from "@/i18n";

export default function EscapePage() {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"escape" | "unescape">("escape");
  const [escapeType, setEscapeType] = useState<"js" | "uri" | "html">("js");

  const inputStyle = "w-full h-64 p-3 rounded-lg font-mono text-sm";
  const inputCss = { background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" };
  const btnStyle = { background: "var(--accent)", color: "var(--bg-primary)" };

  const convert = () => {
    if (!input) {
      setOutput("");
      return;
    }

    try {
      if (mode === "escape") {
        if (escapeType === "js") {
          setOutput(JSON.stringify(input).slice(1, -1));
        } else if (escapeType === "uri") {
          setOutput(encodeURIComponent(input));
        } else {
          setOutput(
            input
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#39;")
          );
        }
      } else {
        if (escapeType === "js") {
          setOutput(JSON.parse(`"${input}"`));
        } else if (escapeType === "uri") {
          setOutput(decodeURIComponent(input));
        } else {
          setOutput(
            input
              .replace(/&amp;/g, "&")
              .replace(/&lt;/g, "<")
              .replace(/&gt;/g, ">")
              .replace(/&quot;/g, '"')
              .replace(/&#39;/g, "'")
          );
        }
      }
    } catch {
      setOutput(t("toolPages.escape.errorInvalid"));
    }
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
  };

  return (
    <ToolLayout toolId="escape">
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => setMode("escape")}
            className="px-4 py-2 rounded-lg"
            style={mode === "escape" ? btnStyle : { background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
          >
            {t("toolPages.escape.escape")}
          </button>
          <button
            onClick={() => setMode("unescape")}
            className="px-4 py-2 rounded-lg"
            style={mode === "unescape" ? btnStyle : { background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
          >
            {t("toolPages.escape.unescape")}
          </button>
        </div>

        <div className="flex gap-2">
          <label className="text-sm" style={{ color: "var(--text-secondary)" }}>{t("toolPages.escape.type")}:</label>
          <button
            onClick={() => setEscapeType("js")}
            className="px-3 py-1 rounded text-sm"
            style={escapeType === "js" ? btnStyle : { background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
          >
            JavaScript
          </button>
          <button
            onClick={() => setEscapeType("uri")}
            className="px-3 py-1 rounded text-sm"
            style={escapeType === "uri" ? btnStyle : { background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
          >
            URI
          </button>
          <button
            onClick={() => setEscapeType("html")}
            className="px-3 py-1 rounded text-sm"
            style={escapeType === "html" ? btnStyle : { background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
          >
            HTML
          </button>
        </div>

        <div>
          <label className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>
            {t("common.input")}
          </label>
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setOutput("");
            }}
            placeholder={t("toolPages.escape.inputPlaceholder")}
            className={inputStyle}
            style={inputCss}
          />
        </div>

        <div className="flex gap-2">
          <button onClick={convert} className="px-4 py-2 rounded-lg" style={btnStyle}>
            {t("common.convert")}
          </button>
          <button onClick={clearAll} className="px-4 py-2 rounded-lg" style={{ background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}>
            {t("common.clear")}
          </button>
        </div>

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
