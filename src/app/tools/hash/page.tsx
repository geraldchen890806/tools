"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";

async function computeHash(algo: string, text: string) {
  const data = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest(algo, data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const algos = [
  { name: "SHA-1", algo: "SHA-1" },
  { name: "SHA-256", algo: "SHA-256" },
  { name: "SHA-384", algo: "SHA-384" },
  { name: "SHA-512", algo: "SHA-512" },
];

export default function HashPage() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<Record<string, string>>({});

  const calculate = async () => {
    const r: Record<string, string> = {};
    for (const a of algos) {
      r[a.name] = await computeHash(a.algo, input);
    }
    setResults(r);
  };

  const copy = (text: string) => navigator.clipboard.writeText(text);

  return (
    <ToolLayout title="Hash 计算" description="SHA-1、SHA-256、SHA-384、SHA-512 哈希值计算">
      <textarea
        className="w-full h-32 rounded-lg p-3 border resize-none"
        style={{ background: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }}
        placeholder="输入要计算哈希的文本..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        onClick={calculate}
        className="mt-3 px-4 py-2 rounded-lg text-white"
        style={{ background: "var(--accent)" }}
      >
        计算
      </button>

      {Object.keys(results).length > 0 && (
        <div className="mt-6 space-y-3">
          {algos.map((a) => (
            <div key={a.name}>
              <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                {a.name}
              </label>
              <div className="flex gap-2 mt-1">
                <input
                  readOnly
                  value={results[a.name] || ""}
                  className="flex-1 rounded-lg p-3 border text-sm font-mono"
                  style={{ background: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                />
                <button
                  onClick={() => copy(results[a.name])}
                  className="px-3 py-2 rounded-lg text-white text-sm"
                  style={{ background: "var(--accent)" }}
                >
                  复制
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </ToolLayout>
  );
}
