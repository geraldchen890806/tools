"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";

const inputStyle: React.CSSProperties = { background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" };
const btnStyle: React.CSSProperties = { background: "var(--accent)", color: "white" };

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const DIGITS = "0123456789";
const SPECIAL = "!@#$%^&*()_+-=[]{}|;:,.<>?";

function getStrength(pw: string): { label: string; color: string; percent: number } {
  let score = 0;
  if (pw.length >= 12) score++; if (pw.length >= 20) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;
  if (score <= 2) return { label: "弱", color: "#ef4444", percent: 33 };
  if (score <= 3) return { label: "中", color: "#eab308", percent: 66 };
  return { label: "强", color: "#22c55e", percent: 100 };
}

export default function PasswordGeneratorPage() {
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

  const strength = password ? getStrength(password) : null;

  return (
    <ToolLayout title="密码生成器" description="生成安全随机密码">
      <div className="space-y-4">
        <div>
          <label className="text-sm" style={{ color: "var(--text-secondary)" }}>长度: {length}</label>
          <input type="range" min={8} max={64} value={length} onChange={e => setLength(Number(e.target.value))} className="w-full" />
        </div>
        <div className="flex gap-4 flex-wrap">
          {[["大写", upper, setUpper], ["小写", lower, setLower], ["数字", digits, setDigits], ["特殊字符", special, setSpecial]].map(([label, val, set]) => (
            <label key={label as string} className="flex items-center gap-1 text-sm" style={{ color: "var(--text-primary)" }}>
              <input type="checkbox" checked={val as boolean} onChange={e => (set as (v: boolean) => void)(e.target.checked)} />
              {label as string}
            </label>
          ))}
        </div>
        <button onClick={generate} className="px-4 py-2 rounded-lg" style={btnStyle}>生成密码</button>
        {password && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-3 rounded-lg" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
              <span className="flex-1 font-mono break-all" style={{ color: "var(--text-primary)" }}>{password}</span>
              <button onClick={() => navigator.clipboard.writeText(password)} className="px-3 py-1 rounded text-sm shrink-0" style={btnStyle}>复制</button>
            </div>
            {strength && (
              <div>
                <div className="flex items-center gap-2 text-sm">
                  <span style={{ color: "var(--text-secondary)" }}>强度:</span>
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
