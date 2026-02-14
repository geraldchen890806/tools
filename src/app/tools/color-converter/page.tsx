"use client";

import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { useTranslation } from "@/i18n";

function hexToRgb(hex: string) {
  const m = hex.replace("#", "").match(/.{2}/g);
  if (!m || m.length < 3) return null;
  return { r: parseInt(m[0], 16), g: parseInt(m[1], 16), b: parseInt(m[2], 16) };
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export default function ColorConverter() {
  const { t } = useTranslation();
  const [hex, setHex] = useState("#6366f1");
  const [textInput, setTextInput] = useState("#6366f1");

  const rgb = hexToRgb(hex);
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;

  const hexStr = hex.toUpperCase();
  const rgbStr = rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : "";
  const hslStr = hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : "";

  const handleTextChange = (v: string) => {
    setTextInput(v);
    if (/^#[0-9a-fA-F]{6}$/.test(v)) setHex(v);
  };

  const copy = (s: string) => navigator.clipboard.writeText(s);

  const formats = [
    { label: "HEX", value: hexStr },
    { label: "RGB", value: rgbStr },
    { label: "HSL", value: hslStr },
  ];

  return (
    <ToolLayout toolId="color-converter">
      <div className="flex gap-4 items-start">
        <input type="color" value={hex} onChange={e => { setHex(e.target.value); setTextInput(e.target.value); }} className="w-12 h-12 rounded cursor-pointer border-0 p-0" />
        <input value={textInput} onChange={e => handleTextChange(e.target.value)} placeholder="#6366f1" className="flex-1 rounded-lg p-3" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
        <div className="w-[100px] h-[100px] rounded-lg flex-shrink-0" style={{ background: hex, border: "1px solid var(--border)" }} />
      </div>
      <div className="grid gap-3 mt-6">
        {formats.map(f => (
          <div key={f.label} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
            <span className="w-10 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>{f.label}</span>
            <span className="flex-1 font-mono" style={{ color: "var(--text-primary)" }}>{f.value}</span>
            <button onClick={() => copy(f.value)} className="px-4 py-2 rounded-lg text-white text-sm" style={{ background: "var(--accent)" }}>{t("common.copy")}</button>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}
