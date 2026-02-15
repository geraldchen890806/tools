"use client";
import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { useTranslation } from "@/i18n";

export default function UnicodePage() {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [format, setFormat] = useState<"u" | "U" | "html">("u");

  const inputStyle = "w-full h-64 p-3 rounded-lg font-mono text-sm";
  const inputCss = { background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" };
  const btnStyle = { background: "var(--accent)", color: "var(--bg-primary)" };

  const convert = () => {
    if (!input) {
      setOutput("");
      return;
    }

    try {
      if (mode === "encode") {
        let result = "";
        for (let i = 0; i < input.length; i++) {
          const code = input.charCodeAt(i);
          if (format === "u") {
            result += "\\u" + code.toString(16).padStart(4, "0");
          } else if (format === "U") {
            result += "\\U" + code.toString(16).padStart(8, "0");
          } else {
            result += "&#" + code + ";";
          }
        }
        setOutput(result);
      } else {
        let result = input;
        
        // Decode \uXXXX
        result = result.replace(/\\u([0-9a-fA-F]{4})/g, (_, code) => 
          String.fromCharCode(parseInt(code, 16))
        );
        
        // Decode \UXXXXXXXX
        result = result.replace(/\\U([0-9a-fA-F]{8})/g, (_, code) => 
          String.fromCodePoint(parseInt(code, 16))
        );
        
        // Decode &#XXXXX;
        result = result.replace(/&#(\d+);/g, (_, code) => 
          String.fromCharCode(parseInt(code, 10))
        );
        
        // Decode &#xXXXX;
        result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, code) => 
          String.fromCharCode(parseInt(code, 16))
        );

        setOutput(result);
      }
    } catch {
      setOutput(t("toolPages.unicode.errorInvalid"));
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
    <ToolLayout toolId="unicode">
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => setMode("encode")}
            className="px-4 py-2 rounded-lg"
            style={mode === "encode" ? btnStyle : { background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
          >
            {t("toolPages.unicode.encode")}
          </button>
          <button
            onClick={() => setMode("decode")}
            className="px-4 py-2 rounded-lg"
            style={mode === "decode" ? btnStyle : { background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
          >
            {t("toolPages.unicode.decode")}
          </button>
        </div>

        {mode === "encode" && (
          <div className="flex gap-2">
            <label className="text-sm" style={{ color: "var(--text-secondary)" }}>{t("toolPages.unicode.format")}:</label>
            <button
              onClick={() => setFormat("u")}
              className="px-3 py-1 rounded text-sm"
              style={format === "u" ? btnStyle : { background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
            >
              \uXXXX
            </button>
            <button
              onClick={() => setFormat("U")}
              className="px-3 py-1 rounded text-sm"
              style={format === "U" ? btnStyle : { background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
            >
              \UXXXXXXXX
            </button>
            <button
              onClick={() => setFormat("html")}
              className="px-3 py-1 rounded text-sm"
              style={format === "html" ? btnStyle : { background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
            >
              &amp;#XXXX;
            </button>
          </div>
        )}

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
            placeholder={t("toolPages.unicode.inputPlaceholder")}
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
