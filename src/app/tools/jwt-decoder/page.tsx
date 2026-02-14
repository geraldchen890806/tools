"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { useTranslation } from "@/i18n";

function decodeJWT(token: string) {
  const parts = token.trim().split(".");
  if (parts.length !== 3) throw new Error("Invalid JWT format (expected 3 parts)");

  const decode = (s: string) => {
    const base64 = s.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  };

  return {
    header: decode(parts[0]),
    payload: decode(parts[1]),
    signature: parts[2],
  };
}

export default function JWTDecoderPage() {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{ header: object; payload: object; signature: string } | null>(null);
  const [error, setError] = useState("");

  const decode = () => {
    setError("");
    setResult(null);
    try {
      setResult(decodeJWT(input));
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <ToolLayout toolId="jwt-decoder">
      <textarea
        className="w-full h-28 rounded-lg p-3 border resize-none font-mono text-sm"
        style={{ background: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }}
        placeholder={t("toolPages.jwt-decoder.inputPlaceholder")}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        onClick={decode}
        className="mt-3 px-4 py-2 rounded-lg text-white"
        style={{ background: "var(--accent)" }}
      >
        解析
      </button>

      {error && <p className="mt-3 text-red-500 text-sm">{error}</p>}

      {result && (
        <div className="mt-6 space-y-4">
          {(["header", "payload"] as const).map((key) => (
            <div key={key}>
              <h3 className="text-sm font-semibold uppercase mb-1" style={{ color: "var(--accent-light)" }}>
                {key}
              </h3>
              <pre
                className="rounded-lg p-3 border text-sm overflow-x-auto"
                style={{ background: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }}
              >
                {JSON.stringify(result[key], null, 2)}
              </pre>
            </div>
          ))}
          <div>
            <h3 className="text-sm font-semibold uppercase mb-1" style={{ color: "var(--accent-light)" }}>
              Signature
            </h3>
            <p className="font-mono text-sm break-all" style={{ color: "var(--text-secondary)" }}>
              {result.signature}
            </p>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
