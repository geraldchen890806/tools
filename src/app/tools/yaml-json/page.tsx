"use client";
import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { useTranslation } from "@/i18n";
import yaml from "js-yaml";

export default function YamlJsonPage() {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"yaml2json" | "json2yaml">("yaml2json");

  const inputStyle = "w-full h-64 p-3 rounded-lg font-mono text-sm";
  const inputCss = { background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" };
  const btnStyle = { background: "var(--accent)", color: "var(--bg-primary)" };

  const convert = () => {
    setError("");
    setOutput("");
    if (!input.trim()) {
      setError(t("toolPages.yaml-json.errorEmpty"));
      return;
    }

    try {
      if (mode === "yaml2json") {
        const obj = yaml.load(input);
        setOutput(JSON.stringify(obj, null, 2));
      } else {
        const obj = JSON.parse(input);
        setOutput(yaml.dump(obj, { indent: 2, lineWidth: -1 }));
      }
    } catch (err) {
      setError(mode === "yaml2json" ? t("toolPages.yaml-json.errorInvalidYaml") : t("toolPages.yaml-json.errorInvalidJson"));
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

  const switchMode = () => {
    setMode(mode === "yaml2json" ? "json2yaml" : "yaml2json");
    setInput(output);
    setOutput("");
    setError("");
  };

  return (
    <ToolLayout toolId="yaml-json">
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => setMode("yaml2json")}
            className="px-4 py-2 rounded-lg"
            style={mode === "yaml2json" ? btnStyle : { background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
          >
            {t("toolPages.yaml-json.yamlToJson")}
          </button>
          <button
            onClick={() => setMode("json2yaml")}
            className="px-4 py-2 rounded-lg"
            style={mode === "json2yaml" ? btnStyle : { background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
          >
            {t("toolPages.yaml-json.jsonToYaml")}
          </button>
        </div>

        <div>
          <label className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>
            {t("common.input")} ({mode === "yaml2json" ? "YAML" : "JSON"})
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "yaml2json" ? t("toolPages.yaml-json.yamlPlaceholder") : t("toolPages.yaml-json.jsonPlaceholder")}
            className={inputStyle}
            style={inputCss}
          />
        </div>

        <div className="flex gap-2">
          <button onClick={convert} className="px-4 py-2 rounded-lg" style={btnStyle}>
            {t("common.convert")}
          </button>
          {output && (
            <button onClick={switchMode} className="px-4 py-2 rounded-lg" style={{ background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}>
              {t("toolPages.yaml-json.switchMode")}
            </button>
          )}
          <button onClick={clearAll} className="px-4 py-2 rounded-lg" style={{ background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}>
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
                {t("common.output")} ({mode === "yaml2json" ? "JSON" : "YAML"})
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
