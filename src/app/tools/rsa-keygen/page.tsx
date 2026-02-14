"use client";
import { ToolLayout } from "@/components/ToolLayout";
import { useTranslation } from "@/i18n";
import { useState } from "react";

const inputStyle = "w-full rounded-lg p-3 border";
const inputCss: React.CSSProperties = { background: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" };
const btnStyle: React.CSSProperties = { background: "var(--accent)", color: "#fff" };

function arrayBufferToBase64(buf: ArrayBuffer) {
  const bytes = new Uint8Array(buf);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

function formatPEM(b64: string, type: "PUBLIC" | "PRIVATE") {
  const label = type === "PUBLIC" ? "PUBLIC KEY" : "PRIVATE KEY";
  const lines = b64.match(/.{1,64}/g) || [];
  return `-----BEGIN ${label}-----\n${lines.join("\n")}\n-----END ${label}-----`;
}

export default function RSAKeygenPage() {
  const { t } = useTranslation();
  const [bits, setBits] = useState(2048);
  const [pubKey, setPubKey] = useState("");
  const [privKey, setPrivKey] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const keyPair = await window.crypto.subtle.generateKey(
        { name: "RSA-OAEP", modulusLength: bits, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
        true,
        ["encrypt", "decrypt"]
      );
      const spki = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
      const pkcs8 = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
      setPubKey(formatPEM(arrayBufferToBase64(spki), "PUBLIC"));
      setPrivKey(formatPEM(arrayBufferToBase64(pkcs8), "PRIVATE"));
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout toolId="rsa-keygen">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <label style={{ color: "var(--text-secondary)" }}>{t("toolPages.rsa-keygen.keySize")}</label>
          <select className="rounded-lg p-3 border" style={inputCss} value={bits} onChange={(e) => setBits(Number(e.target.value))}>
            <option value={2048}>2048</option>
            <option value={4096}>4096</option>
          </select>
          <button onClick={generate} disabled={loading} className="px-4 py-2 rounded-lg font-medium disabled:opacity-50" style={btnStyle}>
            {loading ? t("common.generating") : t("toolPages.rsa-keygen.generateKeys")}
          </button>
        </div>
        {pubKey && (
          <div className="space-y-2">
            <label className="font-medium" style={{ color: "var(--text-primary)" }}>{t("toolPages.rsa-keygen.publicKey")}</label>
            <textarea className={inputStyle} style={{ ...inputCss, minHeight: 160, fontFamily: "monospace", fontSize: 12 }} readOnly value={pubKey} />
            <button onClick={() => navigator.clipboard.writeText(pubKey)} className="px-4 py-2 rounded-lg" style={btnStyle}>复制公钥</button>
          </div>
        )}
        {privKey && (
          <div className="space-y-2">
            <label className="font-medium" style={{ color: "var(--text-primary)" }}>{t("toolPages.rsa-keygen.privateKey")}</label>
            <textarea className={inputStyle} style={{ ...inputCss, minHeight: 200, fontFamily: "monospace", fontSize: 12 }} readOnly value={privKey} />
            <button onClick={() => navigator.clipboard.writeText(privKey)} className="px-4 py-2 rounded-lg" style={btnStyle}>复制私钥</button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
