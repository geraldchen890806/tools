"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface DiffLine { type: "same" | "add" | "del"; text: string }

function diffLines(a: string[], b: string[]): DiffLine[] {
  const result: DiffLine[] = [];
  const max = Math.max(a.length, b.length);
  // Simple LCS-based diff
  const n = a.length, m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
  for (let i = 1; i <= n; i++)
    for (let j = 1; j <= m; j++)
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);

  let i = n, j = m;
  const ops: DiffLine[] = [];
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      ops.push({ type: "same", text: a[i - 1] });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      ops.push({ type: "add", text: b[j - 1] });
      j--;
    } else {
      ops.push({ type: "del", text: a[i - 1] });
      i--;
    }
  }
  return ops.reverse();
}

export default function TextDiff() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [result, setResult] = useState<DiffLine[]>([]);

  const compare = () => setResult(diffLines(left.split("\n"), right.split("\n")));

  const colors: Record<string, string> = { add: "#22c55e", del: "#ef4444" };

  return (
    <ToolLayout title="文本对比" description="逐行对比两段文本，高亮显示差异">
      <div className="grid grid-cols-2 gap-4">
        <textarea value={left} onChange={e => setLeft(e.target.value)} placeholder="原始文本..." rows={10} className="w-full rounded-lg p-3" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
        <textarea value={right} onChange={e => setRight(e.target.value)} placeholder="修改后文本..." rows={10} className="w-full rounded-lg p-3" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
      </div>
      <button onClick={compare} className="mt-4 px-4 py-2 rounded-lg text-white" style={{ background: "var(--accent)" }}>对比</button>
      {result.length > 0 && (
        <div className="mt-4 rounded-lg overflow-hidden" style={{ border: "1px solid var(--border)" }}>
          {result.map((line, i) => (
            <div key={i} className="px-3 py-1 font-mono text-sm" style={{
              background: line.type === "same" ? "var(--bg-secondary)" : colors[line.type] + "20",
              color: line.type === "same" ? "var(--text-primary)" : colors[line.type],
              borderLeft: line.type !== "same" ? `3px solid ${colors[line.type]}` : "3px solid transparent",
            }}>
              <span className="mr-2 opacity-50">{line.type === "add" ? "+" : line.type === "del" ? "-" : " "}</span>
              {line.text || " "}
            </div>
          ))}
        </div>
      )}
    </ToolLayout>
  );
}
