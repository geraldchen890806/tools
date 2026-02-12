"use client";
import { ToolLayout } from "@/components/ToolLayout";
import { useState } from "react";

const inputStyle = "w-full rounded-lg p-3 border";
const inputCss: React.CSSProperties = { background: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" };
const btnStyle: React.CSSProperties = { background: "var(--accent)", color: "#fff" };
const sizes = [16, 32, 48, 64, 128, 256];

export default function FaviconGeneratorPage() {
  const [imgSrc, setImgSrc] = useState("");
  const [previews, setPreviews] = useState<{ size: number; url: string }[]>([]);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;
      setImgSrc(src);
      const img = new Image();
      img.onload = () => {
        const results = sizes.map((size) => {
          const canvas = document.createElement("canvas");
          canvas.width = size;
          canvas.height = size;
          canvas.getContext("2d")!.drawImage(img, 0, 0, size, size);
          return { size, url: canvas.toDataURL("image/png") };
        });
        setPreviews(results);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const download = (url: string, name: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
  };

  return (
    <ToolLayout title="Favicon 生成器" description="上传图片，生成多种尺寸的 Favicon">
      <div className="space-y-4">
        <input type="file" accept="image/*" onChange={onFile} className={inputStyle} style={inputCss} />
        {previews.length > 0 && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {previews.map(({ size, url }) => (
                <div key={size} className="flex items-center gap-3 p-3 rounded-lg border" style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}>
                  <img src={url} alt={`${size}x${size}`} style={{ width: size > 64 ? 64 : size, height: size > 64 ? 64 : size, imageRendering: "pixelated" }}
                    className="rounded border" />
                  <div className="flex-1">
                    <p className="font-medium" style={{ color: "var(--text-primary)" }}>{size}×{size}</p>
                    <button onClick={() => download(url, `favicon-${size}x${size}.png`)}
                      className="px-3 py-1 rounded-lg text-sm mt-1" style={btnStyle}>下载 PNG</button>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => download(previews[previews.length - 1].url, "favicon.png")}
              className="px-4 py-2 rounded-lg font-medium" style={btnStyle}>
              下载 ICO (favicon.png)
            </button>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
