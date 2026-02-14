"use client";
import { ToolLayout } from "@/components/ToolLayout";
import { useTranslation } from "@/i18n";
import { useState } from "react";

const sizes = [150, 200, 300, 400];

export default function Page() {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [size, setSize] = useState(300);
  const [url, setUrl] = useState("");

  const generate = () => {
    if (!text.trim()) return;
    setUrl(`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`);
  };

  const download = async () => {
    if (!url) return;
    const res = await fetch(url);
    const blob = await res.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "qrcode.png";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <ToolLayout toolId="qrcode">
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <input value={text} onChange={e => setText(e.target.value)} placeholder={t("toolPages.qrcode.inputPlaceholder")} onKeyDown={e => e.key === "Enter" && generate()} style={{ flex: 1, minWidth: 200, background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)", borderRadius: 8, padding: 12 }} />
        <select value={size} onChange={e => setSize(Number(e.target.value))} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)", borderRadius: 8, padding: "8px 12px" }}>
          {sizes.map(s => <option key={s} value={s}>{s}x{s}</option>)}
        </select>
        <button onClick={generate} style={{ background: "var(--accent)", color: "white", padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer" }}>{t("common.generate")}</button>
        {url && <button onClick={download} style={{ background: "var(--accent)", color: "white", padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer" }}>{t("common.download")}</button>}
      </div>
      {url && (
        <div style={{ display: "flex", justifyContent: "center", padding: 24, background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 8 }}>
          <img src={url} alt="QR Code" width={size} height={size} />
        </div>
      )}
    </ToolLayout>
  );
}
