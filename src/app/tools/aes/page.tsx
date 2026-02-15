"use client";
import { ToolLayout } from "@/components/ToolLayout";
import { useTranslation } from "@/i18n";
import { useState } from "react";
import { AES, enc, mode, pad } from "crypto-js";

const inputStyle = "w-full rounded-lg p-3 border" as const;
const inputCss: React.CSSProperties = { background: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" };
const btnStyle: React.CSSProperties = { background: "var(--accent)", color: "#fff" };

export default function AESPage() {
  const { t } = useTranslation();
  const [key, setKey] = useState("");
  const [iv, setIv] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [modeType, setModeType] = useState<"encrypt" | "decrypt">("encrypt");

  const run = () => {
    setError("");
    setOutput("");
    try {
      if (![16, 24, 32].includes(key.length)) { setError(t("toolPages.aes.errorKeyLength")); return; }
      if (iv.length !== 16) { setError(t("toolPages.aes.errorIvLength")); return; }
      if (!input) { setError(t("toolPages.aes.errorNoInput")); return; }
      const k = enc.Utf8.parse(key);
      const i = enc.Utf8.parse(iv);
      if (modeType === "encrypt") {
        const encrypted = AES.encrypt(input, k, { iv: i, mode: mode.CBC, padding: pad.Pkcs7 });
        setOutput(enc.Base64.stringify(encrypted.ciphertext));
      } else {
        const decrypted = AES.decrypt(input, k, { iv: i, mode: mode.CBC, padding: pad.Pkcs7 });
        const result = decrypted.toString(enc.Utf8);
        if (!result) { setError(t("toolPages.aes.errorDecryptFailed")); return; }
        setOutput(result);
      }
    } catch (e: any) {
      setError(e.message || t("toolPages.aes.errorOperationFailed"));
    }
  };

  return (
    <ToolLayout toolId="aes">
      <div className="space-y-4">
        <div className="flex gap-2">
          {(["encrypt", "decrypt"] as const).map((m) => (
            <button key={m} onClick={() => { setModeType(m); setOutput(""); setError(""); }}
              className="px-4 py-2 rounded-lg font-medium transition-opacity"
              style={modeType === m ? btnStyle : { background: "var(--bg-secondary)", color: "var(--text-secondary)", borderColor: "var(--border)", borderWidth: 1 }}>
              {m === "encrypt" ? t("common.encode") : t("common.decode")}
            </button>
          ))}
        </div>
        <input className={inputStyle} style={inputCss} placeholder={t("toolPages.aes.keyPlaceholder")} value={key} onChange={(e) => setKey(e.target.value)} />
        <input className={inputStyle} style={inputCss} placeholder={t("toolPages.aes.ivPlaceholder")} value={iv} onChange={(e) => setIv(e.target.value)} />
        <textarea className={inputStyle} style={{ ...inputCss, minHeight: 120 }} placeholder={modeType === "encrypt" ? t("toolPages.aes.inputPlaceholder") : t("toolPages.aes.ciphertextPlaceholder")} value={input} onChange={(e) => setInput(e.target.value)} />
        <button onClick={run} className="px-4 py-2 rounded-lg font-medium" style={btnStyle}>
          {modeType === "encrypt" ? t("common.encode") : t("common.decode")}
        </button>
        {error && <p style={{ color: "#ef4444" }}>{error}</p>}
        {output && (
          <div className="space-y-2">
            <textarea className={inputStyle} style={{ ...inputCss, minHeight: 100 }} readOnly value={output} />
            <button onClick={() => navigator.clipboard.writeText(output)} className="px-4 py-2 rounded-lg" style={btnStyle}>{t("common.copyResult")}</button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
