"use client";
import { ToolLayout } from "@/components/ToolLayout";
import { useTranslation } from "@/i18n";
import { useState } from "react";

const inputStyle = "w-full rounded-lg p-3 border";
const inputCss: React.CSSProperties = { background: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" };
const btnStyle: React.CSSProperties = { background: "var(--accent)", color: "#fff" };

export default function ImageMergePage() {
  const { t } = useTranslation();
  const [images, setImages] = useState<{ src: string; w: number; h: number }[]>([]);
  const [direction, setDirection] = useState<"horizontal" | "vertical">("horizontal");
  const [resultUrl, setResultUrl] = useState("");

  const onFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setResultUrl("");
    const loaded: typeof images = [];
    let count = 0;
    files.forEach((file, i) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          loaded[i] = { src: reader.result as string, w: img.width, h: img.height };
          count++;
          if (count === files.length) setImages(loaded);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const merge = () => {
    if (images.length === 0) return;
    let totalW: number, totalH: number;
    if (direction === "horizontal") {
      totalW = images.reduce((s, i) => s + i.w, 0);
      totalH = Math.max(...images.map((i) => i.h));
    } else {
      totalW = Math.max(...images.map((i) => i.w));
      totalH = images.reduce((s, i) => s + i.h, 0);
    }
    const canvas = document.createElement("canvas");
    canvas.width = totalW;
    canvas.height = totalH;
    const ctx = canvas.getContext("2d")!;
    let offset = 0;
    const promises = images.map((item) => new Promise<HTMLImageElement>((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = item.src;
    }));
    Promise.all(promises).then((imgs) => {
      imgs.forEach((img, i) => {
        if (direction === "horizontal") {
          ctx.drawImage(img, offset, 0);
          offset += images[i].w;
        } else {
          ctx.drawImage(img, 0, offset);
          offset += images[i].h;
        }
      });
      setResultUrl(canvas.toDataURL("image/png"));
    });
  };

  const download = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = "merged.png";
    a.click();
  };

  return (
    <ToolLayout toolId="image-merge">
      <div className="space-y-4">
        <input type="file" accept="image/*" multiple onChange={onFiles} className={inputStyle} style={inputCss} />
        {images.length > 0 && (
          <>
            <p style={{ color: "var(--text-secondary)" }}>{t("toolPages.image-merge.selectedImages").replace("{{count}}", String(images.length))}</p>
            <div className="flex items-center gap-4">
              {(["horizontal", "vertical"] as const).map((d) => (
                <label key={d} className="flex items-center gap-1 cursor-pointer" style={{ color: "var(--text-primary)" }}>
                  <input type="radio" name="dir" checked={direction === d} onChange={() => setDirection(d)} />
                  {d === "horizontal" ? t("toolPages.image-merge.horizontal") : t("toolPages.image-merge.vertical")}
                </label>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              {images.map((img, i) => (
                <img key={i} src={img.src} alt={`img-${i}`} className="rounded border" style={{ borderColor: "var(--border)", maxHeight: 80 }} />
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={merge} className="px-4 py-2 rounded-lg" style={btnStyle}>{t("toolPages.image-merge.mergePreview")}</button>
              {resultUrl && <button onClick={download} className="px-4 py-2 rounded-lg" style={btnStyle}>{t("common.download")}</button>}
            </div>
          </>
        )}
        {resultUrl && <img src={resultUrl} alt="merged" className="rounded-lg border" style={{ borderColor: "var(--border)", maxWidth: "100%" }} />}
      </div>
    </ToolLayout>
  );
}
