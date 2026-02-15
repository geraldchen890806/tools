"use client";
import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { useTranslation } from "@/i18n";
import { pinyin } from "pinyin-pro";

export default function PinyinPage() {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [toneType, setToneType] = useState<"symbol" | "num" | "none">("symbol");
  const [separator, setSeparator] = useState(" ");

  const inputStyle = "w-full h-64 p-3 rounded-lg font-mono text-sm";
  const inputCss = { background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" };
  const btnStyle = { background: "var(--accent)", color: "var(--bg-primary)" };

  const convert = () => {
    if (!input.trim()) {
      setOutput("");
      return;
    }

    const result = pinyin(input, {
      toneType: toneType === "symbol" ? "symbol" : toneType === "num" ? "num" : "none",
      separator,
    });
    setOutput(result);
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
  };

  return (
    <ToolLayout toolId="pinyin">
      <div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <div className="flex gap-2 items-center">
            <label className="text-sm" style={{ color: "var(--text-secondary)" }}>{t("toolPages.pinyin.tone")}:</label>
            <button
              onClick={() => setToneType("symbol")}
              className="px-3 py-1 rounded text-sm"
              style={toneType === "symbol" ? btnStyle : { background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
            >
              {t("toolPages.pinyin.withTone")} (nǐ hǎo)
            </button>
            <button
              onClick={() => setToneType("num")}
              className="px-3 py-1 rounded text-sm"
              style={toneType === "num" ? btnStyle : { background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
            >
              {t("toolPages.pinyin.numberTone")} (ni3 hao3)
            </button>
            <button
              onClick={() => setToneType("none")}
              className="px-3 py-1 rounded text-sm"
              style={toneType === "none" ? btnStyle : { background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
            >
              {t("toolPages.pinyin.noTone")} (ni hao)
            </button>
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <label className="text-sm" style={{ color: "var(--text-secondary)" }}>{t("toolPages.pinyin.separator")}:</label>
          <button
            onClick={() => setSeparator(" ")}
            className="px-3 py-1 rounded text-sm"
            style={separator === " " ? btnStyle : { background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
          >
            {t("toolPages.pinyin.space")}
          </button>
          <button
            onClick={() => setSeparator("-")}
            className="px-3 py-1 rounded text-sm"
            style={separator === "-" ? btnStyle : { background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
          >
            {t("toolPages.pinyin.hyphen")}
          </button>
          <button
            onClick={() => setSeparator("")}
            className="px-3 py-1 rounded text-sm"
            style={separator === "" ? btnStyle : { background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
          >
            {t("toolPages.pinyin.none")}
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
            placeholder={t("toolPages.pinyin.inputPlaceholder")}
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
