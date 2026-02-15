"use client";
import { ToolLayout } from "@/components/ToolLayout";
import { useTranslation } from "@/i18n";
import { useState } from "react";

type CipherType = "rot13" | "caesar" | "morse" | "base64" | "reverse";

export default function Page() {
  const { t } = useTranslation();
  const [type, setType] = useState<CipherType>("rot13");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [caesarShift, setCaesarShift] = useState(3);
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const process = () => {
    if (!input.trim()) {
      setOutput("");
      return;
    }

    let result = "";
    try {
      if (mode === "encode") {
        result = encode(input, type);
      } else {
        result = decode(input, type);
      }
      setOutput(result);
    } catch (e: any) {
      setOutput(`Error: ${e.message}`);
    }
  };

  const encode = (text: string, cipher: CipherType): string => {
    switch (cipher) {
      case "rot13":
        return rot13(text);
      case "caesar":
        return caesar(text, caesarShift);
      case "morse":
        return textToMorse(text);
      case "base64":
        return btoa(text);
      case "reverse":
        return text.split("").reverse().join("");
      default:
        return text;
    }
  };

  const decode = (text: string, cipher: CipherType): string => {
    switch (cipher) {
      case "rot13":
        return rot13(text); // ROT13 是对称的
      case "caesar":
        return caesar(text, -caesarShift); // 反向移位
      case "morse":
        return morseToText(text);
      case "base64":
        return atob(text);
      case "reverse":
        return text.split("").reverse().join("");
      default:
        return text;
    }
  };

  const rot13 = (text: string): string => {
    return text.replace(/[a-zA-Z]/g, (c) => {
      const base = c <= "Z" ? 65 : 97;
      return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
    });
  };

  const caesar = (text: string, shift: number): string => {
    return text.replace(/[a-zA-Z]/g, (c) => {
      const base = c <= "Z" ? 65 : 97;
      return String.fromCharCode(((c.charCodeAt(0) - base + shift + 26) % 26) + base);
    });
  };

  const morseCodeMap: Record<string, string> = {
    A: ".-",
    B: "-...",
    C: "-.-.",
    D: "-..",
    E: ".",
    F: "..-.",
    G: "--.",
    H: "....",
    I: "..",
    J: ".---",
    K: "-.-",
    L: ".-..",
    M: "--",
    N: "-.",
    O: "---",
    P: ".--.",
    Q: "--.-",
    R: ".-.",
    S: "...",
    T: "-",
    U: "..-",
    V: "...-",
    W: ".--",
    X: "-..-",
    Y: "-.--",
    Z: "--..",
    "0": "-----",
    "1": ".----",
    "2": "..---",
    "3": "...--",
    "4": "....-",
    "5": ".....",
    "6": "-....",
    "7": "--...",
    "8": "---..",
    "9": "----.",
    " ": "/",
  };

  const textToMorse = (text: string): string => {
    return text
      .toUpperCase()
      .split("")
      .map((c) => morseCodeMap[c] || c)
      .join(" ");
  };

  const morseToText = (morse: string): string => {
    const reverseMap = Object.fromEntries(Object.entries(morseCodeMap).map(([k, v]) => [v, k]));
    return morse
      .split(" ")
      .map((code) => reverseMap[code] || "")
      .join("");
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
  };

  const clear = () => {
    setInput("");
    setOutput("");
  };

  return (
    <ToolLayout toolId="text-cipher">
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* 加密类型选择 */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {(["rot13", "caesar", "morse", "base64", "reverse"] as CipherType[]).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: type === t ? "var(--accent)" : "var(--bg-secondary)",
                color: type === t ? "white" : "var(--text-primary)",
                cursor: "pointer",
              }}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {/* 凯撒密码偏移量 */}
        {type === "caesar" && (
          <div>
            <label style={{ display: "block", marginBottom: 8, color: "var(--text-secondary)", fontSize: 14 }}>
              {t("toolPages.text-cipher.caesarShift")} ({caesarShift})
            </label>
            <input
              type="range"
              min="1"
              max="25"
              value={caesarShift}
              onChange={(e) => setCaesarShift(Number(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>
        )}

        {/* 模式切换 */}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setMode("encode")}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: mode === "encode" ? "var(--accent)" : "var(--bg-secondary)",
              color: mode === "encode" ? "white" : "var(--text-primary)",
              cursor: "pointer",
            }}
          >
            {t("common.encode")}
          </button>
          <button
            onClick={() => setMode("decode")}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: mode === "decode" ? "var(--accent)" : "var(--bg-secondary)",
              color: mode === "decode" ? "white" : "var(--text-primary)",
              cursor: "pointer",
            }}
          >
            {t("common.decode")}
          </button>
        </div>

        {/* 输入 */}
        <div>
          <label style={{ display: "block", marginBottom: 8, color: "var(--text-secondary)", fontSize: 14 }}>
            {t("common.input")}
          </label>
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              process();
            }}
            placeholder={t("common.inputPlaceholder")}
            style={{
              width: "100%",
              minHeight: 150,
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
              borderRadius: 8,
              padding: 12,
              fontFamily: "monospace",
              resize: "vertical",
            }}
          />
        </div>

        {/* 按钮 */}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={process}
            style={{
              background: "var(--accent)",
              color: "white",
              padding: "12px 24px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
            }}
          >
            {mode === "encode" ? t("common.encode") : t("common.decode")}
          </button>
          <button
            onClick={clear}
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
              padding: "12px 24px",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            {t("common.clear")}
          </button>
          {output && (
            <button
              onClick={copy}
              style={{
                background: "var(--accent)",
                color: "white",
                padding: "12px 24px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
              }}
            >
              {t("common.copy")}
            </button>
          )}
        </div>

        {/* 输出 */}
        {output && (
          <div>
            <label style={{ display: "block", marginBottom: 8, color: "var(--text-secondary)", fontSize: 14 }}>
              {t("common.output")}
            </label>
            <textarea
              value={output}
              readOnly
              style={{
                width: "100%",
                minHeight: 150,
                background: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
                borderRadius: 8,
                padding: 12,
                fontFamily: "monospace",
                resize: "vertical",
              }}
            />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
