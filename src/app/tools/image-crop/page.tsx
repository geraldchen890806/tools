"use client";
import { ToolLayout } from "@/components/ToolLayout";
import { useState, useRef } from "react";

const inputStyle = "w-full rounded-lg p-3 border";
const inputCss: React.CSSProperties = { background: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" };
const btnStyle: React.CSSProperties = { background: "var(--accent)", color: "#fff" };

export default function ImageCropPage() {
  const [imgSrc, setImgSrc] = useState("");
  const [imgW, setImgW] = useState(0);
  const [imgH, setImgH] = useState(0);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [w, setW] = useState(0);
  const [h, setH] = useState(0);
  const [result, setResult] = useState("");
  const imgRef = useRef<HTMLImageElement>(null);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;
      setImgSrc(src);
      const img = new Image();
      img.onload = () => { setImgW(img.width); setImgH(img.height); setX(0); setY(0); setW(img.width); setH(img.height); };
      img.src = src;
    };
    reader.readAsDataURL(file);
    setResult("");
  };

  const crop = () => {
    if (!imgSrc) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d")!.drawImage(img, x, y, w, h, 0, 0, w, h);
      setResult(canvas.toDataURL("image/png"));
    };
    img.src = imgSrc;
  };

  const download = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result;
    a.download = "cropped.png";
    a.click();
  };

  // Calculate preview scale
  const maxPreviewW = 600;
  const scale = imgW > maxPreviewW ? maxPreviewW / imgW : 1;
  const previewW = imgW * scale;
  const previewH = imgH * scale;

  return (
    <ToolLayout title="图片裁剪" description="上传图片，设置裁剪区域，预览并下载">
      <div className="space-y-4">
        <input type="file" accept="image/*" onChange={onFile} className={inputStyle} style={inputCss} />
        {imgSrc && (
          <>
            <div className="grid grid-cols-4 gap-2">
              {([["X", x, setX], ["Y", y, setY], ["宽", w, setW], ["高", h, setH]] as const).map(([label, val, setter]) => (
                <div key={label}>
                  <label className="text-sm" style={{ color: "var(--text-secondary)" }}>{label}</label>
                  <input type="number" className={inputStyle} style={inputCss} value={val}
                    onChange={(e) => (setter as any)(Math.max(0, Number(e.target.value)))} />
                </div>
              ))}
            </div>
            <div className="relative inline-block" style={{ width: previewW, height: previewH }}>
              <img src={imgSrc} alt="preview" style={{ width: previewW, height: previewH }} />
              {/* Dark overlay with cutout */}
              <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
                {/* Top */}
                <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: y * scale, background: "rgba(0,0,0,0.5)" }} />
                {/* Bottom */}
                <div style={{ position: "absolute", top: (y + h) * scale, left: 0, width: "100%", height: previewH - (y + h) * scale, background: "rgba(0,0,0,0.5)" }} />
                {/* Left */}
                <div style={{ position: "absolute", top: y * scale, left: 0, width: x * scale, height: h * scale, background: "rgba(0,0,0,0.5)" }} />
                {/* Right */}
                <div style={{ position: "absolute", top: y * scale, left: (x + w) * scale, width: previewW - (x + w) * scale, height: h * scale, background: "rgba(0,0,0,0.5)" }} />
                {/* Border */}
                <div style={{ position: "absolute", top: y * scale, left: x * scale, width: w * scale, height: h * scale, border: "2px dashed var(--accent)" }} />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={crop} className="px-4 py-2 rounded-lg" style={btnStyle}>裁剪</button>
              {result && <button onClick={download} className="px-4 py-2 rounded-lg" style={btnStyle}>下载</button>}
            </div>
          </>
        )}
        {result && <img src={result} alt="cropped" className="rounded-lg border" style={{ borderColor: "var(--border)", maxWidth: 400 }} />}
      </div>
    </ToolLayout>
  );
}
