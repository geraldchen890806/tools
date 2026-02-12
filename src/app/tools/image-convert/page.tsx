"use client";
import { ToolLayout } from "@/components/ToolLayout";
import { useState } from "react";

const inputStyle = "w-full rounded-lg p-3 border";
const inputCss: React.CSSProperties = { background: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" };
const btnStyle: React.CSSProperties = { background: "var(--accent)", color: "#fff" };

function formatSize(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1024 / 1024).toFixed(2) + " MB";
}

export default function ImageConvertPage() {
  const [imgSrc, setImgSrc] = useState("");
  const [origType, setOrigType] = useState("");
  const [origSize, setOrigSize] = useState(0);
  const [targetFormat, setTargetFormat] = useState("image/jpeg");
  const [resultUrl, setResultUrl] = useState("");
  const [resultSize, setResultSize] = useState(0);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setOrigType(file.type);
    setOrigSize(file.size);
    setResultUrl("");
    const reader = new FileReader();
    reader.onload = () => setImgSrc(reader.result as string);
    reader.readAsDataURL(file);
  };

  const convert = () => {
    if (!imgSrc) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) return;
        setResultBlob(blob);
        setResultSize(blob.size);
        setResultUrl(URL.createObjectURL(blob));
      }, targetFormat, 0.92);
    };
    img.src = imgSrc;
  };

  const download = () => {
    if (!resultUrl) return;
    const ext = targetFormat.split("/")[1];
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `converted.${ext}`;
    a.click();
  };

  return (
    <ToolLayout title="图片格式转换" description="上传图片，转换为 JPEG、PNG 或 WebP 格式">
      <div className="space-y-4">
        <input type="file" accept="image/*" onChange={onFile} className={inputStyle} style={inputCss} />
        {imgSrc && (
          <>
            <div className="flex items-center gap-3 flex-wrap">
              <span style={{ color: "var(--text-secondary)" }}>原格式: {origType || "未知"} ({formatSize(origSize)})</span>
              <span style={{ color: "var(--text-secondary)" }}>→</span>
              <select className="rounded-lg p-3 border" style={inputCss} value={targetFormat} onChange={(e) => setTargetFormat(e.target.value)}>
                <option value="image/jpeg">JPEG</option>
                <option value="image/png">PNG</option>
                <option value="image/webp">WebP</option>
              </select>
              <button onClick={convert} className="px-4 py-2 rounded-lg" style={btnStyle}>转换</button>
            </div>
            <img src={imgSrc} alt="original" className="rounded-lg border" style={{ borderColor: "var(--border)", maxWidth: 400 }} />
          </>
        )}
        {resultUrl && (
          <div className="space-y-2">
            <p style={{ color: "var(--text-secondary)" }}>转换后: {targetFormat} ({formatSize(resultSize)}) — {origSize > resultSize ? "减小" : "增大"} {formatSize(Math.abs(origSize - resultSize))}</p>
            <img src={resultUrl} alt="converted" className="rounded-lg border" style={{ borderColor: "var(--border)", maxWidth: 400 }} />
            <button onClick={download} className="px-4 py-2 rounded-lg" style={btnStyle}>下载</button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
