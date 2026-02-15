"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { useTranslation } from "@/i18n";

const inputStyle: React.CSSProperties = { background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" };
const btnStyle: React.CSSProperties = { background: "var(--accent)", color: "white" };

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const DIGITS = "0123456789";
const SPECIAL = "!@#$%^&*()_+-=[]{}|;:,.<>?";

function getStrength(pw: string, t: (key: string) => string): { label: string; color: string; percent: number } {
  let score = 0;
  if (pw.length >= 12) score++; if (pw.length >= 20) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;
  if (score <= 2) return { label: t("toolPages.password-generator.weak"), color: "#ef4444", percent: 33 };
  if (score <= 3) return { label: t("toolPages.password-generator.medium"), color: "#eab308", percent: 66 };
  return { label: t("toolPages.password-generator.strong"), color: "#22c55e", percent: 100 };
}

export default function PasswordGeneratorPage() {
  const { t } = useTranslation();
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [digits, setDigits] = useState(true);
  const [special, setSpecial] = useState(true);
  const [password, setPassword] = useState("");

  const generate = () => {
    let chars = "";
    if (upper) chars += UPPER;
    if (lower) chars += LOWER;
    if (digits) chars += DIGITS;
    if (special) chars += SPECIAL;
    if (!chars) return;
    const arr = new Uint32Array(length);
    crypto.getRandomValues(arr);
    setPassword(Array.from(arr, v => chars[v % chars.length]).join(""));
  };

  const strength = password ? getStrength(password, t) : null;

  return (
    <ToolLayout toolId="password-generator">
      <div className="space-y-4">
        <div>
          <label className="text-sm" style={{ color: "var(--text-secondary)" }}>{t("toolPages.password-generator.length")}: {length}</label>
          <input type="range" min={8} max={64} value={length} onChange={e => setLength(Number(e.target.value))} className="w-full" />
        </div>
        <div className="flex gap-4 flex-wrap">
          {[
            [t("toolPages.password-generator.includeUppercase"), upper, setUpper],
            [t("toolPages.password-generator.includeLowercase"), lower, setLower],
            [t("toolPages.password-generator.includeNumbers"), digits, setDigits],
            [t("toolPages.password-generator.includeSymbols"), special, setSpecial]
          ].map(([label, val, set]) => (
            <label key={label as string} className="flex items-center gap-1 text-sm" style={{ color: "var(--text-primary)" }}>
              <input type="checkbox" checked={val as boolean} onChange={e => (set as (v: boolean) => void)(e.target.checked)} />
              {label as string}
            </label>
          ))}
        </div>
        <button onClick={generate} className="px-4 py-2 rounded-lg" style={btnStyle}>{t("toolPages.password-generator.generate")}</button>
        {password && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-3 rounded-lg" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
              <span className="flex-1 font-mono break-all" style={{ color: "var(--text-primary)" }}>{password}</span>
              <button onClick={() => navigator.clipboard.writeText(password)} className="px-3 py-1 rounded text-sm shrink-0" style={btnStyle}>{t("common.copy")}</button>
            </div>
            {strength && (
              <div>
                <div className="flex items-center gap-2 text-sm">
                  <span style={{ color: "var(--text-secondary)" }}>{t("toolPages.password-generator.strength")}:</span>
                  <span style={{ color: strength.color }}>{strength.label}</span>
                </div>
                <div className="w-full h-2 rounded-full mt-1" style={{ background: "var(--border)" }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${strength.percent}%`, background: strength.color }} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
