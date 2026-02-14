"use client";

import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { useTranslation } from "@/i18n";

export default function ImageToBase64Page() {
  const { t } = useTranslation();
  const [base64, setBase64] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [reverseInput, setReverseInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setBase64(result);
      setCharCount(result.length);
    };
    reader.readAsDataURL(file);
  };

  const handleReverse = () => {
    const input = reverseInput.trim();
    if (input.startsWith("data:image")) {
      setPreviewUrl(input);
    } else {
      setPreviewUrl("data:image/png;base64," + input);
    }
  };

  return (
    <ToolLayout toolId="image-to-base64">
      {/* Image to Base64 */}
      <h3 className="font-semibold mb-3">图片 → Base64</h3>
      <div
        className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer"
        style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
        }}
      >
        <p>🖼️ 点击或拖拽上传图片</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </div>

      {base64 && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
              字符数: {charCount.toLocaleString()}
            </span>
            <button
              onClick={() => navigator.clipboard.writeText(base64)}
              className="px-3 py-1.5 rounded-lg text-white text-sm"
              style={{ background: "var(--accent)" }}
            >
              复制
            </button>
          </div>
          <textarea
            readOnly
            value={base64}
            className="w-full h-32 rounded-lg p-3 border resize-none font-mono text-xs"
            style={{ background: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }}
          />
        </div>
      )}

      {/* Base64 to Image */}
      <div className="mt-8 pt-6 border-t" style={{ borderColor: "var(--border)" }}>
        <h3 className="font-semibold mb-3">Base64 → 图片</h3>
        <textarea
          className="w-full h-28 rounded-lg p-3 border resize-none font-mono text-xs"
          style={{ background: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }}
          placeholder={t("toolPages.image-to-base64.base64Placeholder")}
          value={reverseInput}
          onChange={(e) => setReverseInput(e.target.value)}
        />
        <button
          onClick={handleReverse}
          className="mt-2 px-4 py-2 rounded-lg text-white"
          style={{ background: "var(--accent)" }}
        >
          预览
        </button>
        {previewUrl && (
          <div className="mt-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="preview" className="max-w-full max-h-80 rounded-lg border" style={{ borderColor: "var(--border)" }} />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
