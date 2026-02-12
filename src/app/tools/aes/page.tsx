"use client";
import { ToolLayout } from "@/components/ToolLayout";
import { useState } from "react";
import { AES, enc, mode, pad } from "crypto-js";

const inputStyle = "w-full rounded-lg p-3 border" as const;
const inputCss: React.CSSProperties = { background: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" };
const btnStyle: React.CSSProperties = { background: "var(--accent)", color: "#fff" };

export default function AESPage() {
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
      if (![16, 24, 32].includes(key.length)) { setError("Key 必须为 16/24/32 字符"); return; }
      if (iv.length !== 16) { setError("IV 必须为 16 字符"); return; }
      if (!input) { setError("请输入内容"); return; }
      const k = enc.Utf8.parse(key);
      const i = enc.Utf8.parse(iv);
      if (modeType === "encrypt") {
        const encrypted = AES.encrypt(input, k, { iv: i, mode: mode.CBC, padding: pad.Pkcs7 });
        setOutput(enc.Base64.stringify(encrypted.ciphertext));
      } else {
        const decrypted = AES.decrypt(input, k, { iv: i, mode: mode.CBC, padding: pad.Pkcs7 });
        const result = decrypted.toString(enc.Utf8);
        if (!result) { setError("解密失败，请检查密钥和密文"); return; }
        setOutput(result);
      }
    } catch (e: any) {
      setError(e.message || "操作失败");
    }
  };

  return (
    <ToolLayout title="AES 加密/解密" description="使用 AES-CBC 模式进行加密和解密">
      <div className="space-y-4">
        <div className="flex gap-2">
          {(["encrypt", "decrypt"] as const).map((m) => (
            <button key={m} onClick={() => { setModeType(m); setOutput(""); setError(""); }}
              className="px-4 py-2 rounded-lg font-medium transition-opacity"
              style={modeType === m ? btnStyle : { background: "var(--bg-secondary)", color: "var(--text-secondary)", borderColor: "var(--border)", borderWidth: 1 }}>
              {m === "encrypt" ? "加密" : "解密"}
            </button>
          ))}
        </div>
        <input className={inputStyle} style={inputCss} placeholder="Key（16/24/32 字符）" value={key} onChange={(e) => setKey(e.target.value)} />
        <input className={inputStyle} style={inputCss} placeholder="IV（16 字符）" value={iv} onChange={(e) => setIv(e.target.value)} />
        <textarea className={inputStyle} style={{ ...inputCss, minHeight: 120 }} placeholder={modeType === "encrypt" ? "输入明文" : "输入密文（Base64）"} value={input} onChange={(e) => setInput(e.target.value)} />
        <button onClick={run} className="px-4 py-2 rounded-lg font-medium" style={btnStyle}>
          {modeType === "encrypt" ? "加密" : "解密"}
        </button>
        {error && <p style={{ color: "#ef4444" }}>{error}</p>}
        {output && (
          <div className="space-y-2">
            <textarea className={inputStyle} style={{ ...inputCss, minHeight: 100 }} readOnly value={output} />
            <button onClick={() => navigator.clipboard.writeText(output)} className="px-4 py-2 rounded-lg" style={btnStyle}>复制结果</button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
