"use client";

import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { useTranslation } from "@/i18n";

function formatSize(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}

export default function ImageCompressPage() {
  const { t } = useTranslation();
  const [original, setOriginal] = useState<{ url: string; size: number; name: string } | null>(null);
  const [compressed, setCompressed] = useState<{ url: string; size: number } | null>(null);
  const [quality, setQuality] = useState(0.7);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setCompressed(null);
    const url = URL.createObjectURL(file);
    setOriginal({ url, size: file.size, name: file.name });
  };

  const compress = () => {
    if (!original) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            setCompressed({ url: URL.createObjectURL(blob), size: blob.size });
          }
        },
        "image/jpeg",
        quality
      );
    };
    img.src = original.url;
  };

  const download = () => {
    if (!compressed) return;
    const a = document.createElement("a");
    a.href = compressed.url;
    a.download = "compressed_" + (original?.name || "image.jpg");
    a.click();
  };

  return (
    <ToolLayout toolId="image-compress">
      <div
        className="border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors"
        style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
        }}
      >
        <p className="text-lg mb-1">📦 {t("toolPages.image-compress.uploadHint")}</p>
        <p className="text-sm">{t("toolPages.image-compress.supportFormats")}</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </div>

      {original && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-4">
            <label className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {t("toolPages.image-compress.quality")}: {Math.round(quality * 100)}%
            </label>
            <input
              type="range"
              min={0.1}
              max={1}
              step={0.05}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="flex-1"
            />
            <button onClick={compress} className="px-4 py-2 rounded-lg text-white" style={{ background: "var(--accent)" }}>
              {t("common.compress")}
            </button>
          </div>

          <div className="flex gap-4 text-sm" style={{ color: "var(--text-secondary)" }}>
            <span>{t("toolPages.image-compress.originalSize")}: <strong style={{ color: "var(--text-primary)" }}>{formatSize(original.size)}</strong></span>
            {compressed && (
              <>
                <span>{t("toolPages.image-compress.compressedSize")}: <strong style={{ color: "var(--text-primary)" }}>{formatSize(compressed.size)}</strong></span>
                <span>{t("toolPages.image-compress.saved")}: <strong style={{ color: "#22c55e" }}>{Math.round((1 - compressed.size / original.size) * 100)}%</strong></span>
              </>
            )}
          </div>

          {compressed && (
            <button onClick={download} className="px-4 py-2 rounded-lg text-white" style={{ background: "var(--accent)" }}>
              {t("toolPages.image-compress.downloadCompressed")}
            </button>
          )}
        </div>
      )}
    </ToolLayout>
  );
}
