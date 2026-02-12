"use client";
import { ToolLayout } from "@/components/ToolLayout";
import { useState, useRef } from "react";

const inputStyle = "w-full rounded-lg p-3 border";
const inputCss: React.CSSProperties = { background: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" };
const btnStyle: React.CSSProperties = { background: "var(--accent)", color: "#fff" };

export default function ImageWatermarkPage() {
  const [imgSrc, setImgSrc] = useState("");
  const [text, setText] = useState("Watermark");
  const [fontSize, setFontSize] = useState(36);
  const [color, setColor] = useState("#ffffff");
  const [opacity, setOpacity] = useState(0.5);
  const [position, setPosition] = useState("右下");
  const [resultUrl, setResultUrl] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { setImgSrc(reader.result as string); setResultUrl(""); };
    reader.readAsDataURL(file);
  };

  const preview = () => {
    if (!imgSrc || !text) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;
      ctx.font = `${fontSize}px sans-serif`;
      ctx.textBaseline = "middle";

      if (position === "平铺") {
        const metrics = ctx.measureText(text);
        const tw = metrics.width + 60;
        const th = fontSize + 60;
        for (let yy = 0; yy < img.height; yy += th) {
          for (let xx = 0; xx < img.width; xx += tw) {
            ctx.save();
            ctx.translate(xx + tw / 2, yy + th / 2);
            ctx.rotate(-Math.PI / 6);
            ctx.fillText(text, -metrics.width / 2, 0);
            ctx.restore();
          }
        }
      } else {
        const metrics = ctx.measureText(text);
        const pad = 20;
        let dx = pad, dy = pad + fontSize / 2;
        switch (position) {
          case "右上": dx = img.width - metrics.width - pad; break;
          case "左下": dy = img.height - pad - fontSize / 2; break;
          case "右下": dx = img.width - metrics.width - pad; dy = img.height - pad - fontSize / 2; break;
          case "居中": dx = (img.width - metrics.width) / 2; dy = img.height / 2; break;
        }
        ctx.fillText(text, dx, dy);
      }

      setResultUrl(canvas.toDataURL("image/png"));
    };
    img.src = imgSrc;
  };

  const download = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = "watermarked.png";
    a.click();
  };

  return (
    <ToolLayout title="图片水印" description="为图片添加文字水印，支持自定义样式和位置">
      <div className="space-y-4">
        <input type="file" accept="image/*" onChange={onFile} className={inputStyle} style={inputCss} />
        {imgSrc && (
          <>
            <input className={inputStyle} style={inputCss} placeholder="水印文字" value={text} onChange={(e) => setText(e.target.value)} />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="text-sm" style={{ color: "var(--text-secondary)" }}>字体大小: {fontSize}px</label>
                <input type="range" min={12} max={72} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full" />
              </div>
              <div>
                <label className="text-sm" style={{ color: "var(--text-secondary)" }}>颜色</label>
                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-10 rounded-lg border cursor-pointer" style={{ borderColor: "var(--border)" }} />
              </div>
              <div>
                <label className="text-sm" style={{ color: "var(--text-secondary)" }}>透明度: {opacity}</label>
                <input type="range" min={0} max={1} step={0.05} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full" />
              </div>
              <div>
                <label className="text-sm" style={{ color: "var(--text-secondary)" }}>位置</label>
                <select className={inputStyle} style={inputCss} value={position} onChange={(e) => setPosition(e.target.value)}>
                  {["左上", "右上", "左下", "右下", "居中", "平铺"].map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={preview} className="px-4 py-2 rounded-lg" style={btnStyle}>预览水印</button>
              {resultUrl && <button onClick={download} className="px-4 py-2 rounded-lg" style={btnStyle}>下载</button>}
            </div>
          </>
        )}
        {resultUrl && <img src={resultUrl} alt="watermarked" className="rounded-lg border" style={{ borderColor: "var(--border)", maxWidth: 600 }} />}
      </div>
    </ToolLayout>
  );
}
