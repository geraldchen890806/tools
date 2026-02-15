"use client";
import { ToolLayout } from "@/components/ToolLayout";
import { useTranslation } from "@/i18n";
import { useState, useRef, useCallback, useEffect } from "react";

const inputStyle = "w-full rounded-lg p-3 border";
const inputCss: React.CSSProperties = { background: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" };
const btnStyle: React.CSSProperties = { background: "var(--accent)", color: "#fff" };

type DragType = "move" | "nw" | "ne" | "sw" | "se" | "n" | "s" | "e" | "w" | null;

export default function ImageCropPage() {
  const { t } = useTranslation();
  const [imgSrc, setImgSrc] = useState("");
  const [imgW, setImgW] = useState(0);
  const [imgH, setImgH] = useState(0);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [w, setW] = useState(0);
  const [h, setH] = useState(0);
  const [result, setResult] = useState("");
  const [dragType, setDragType] = useState<DragType>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, origX: 0, origY: 0, origW: 0, origH: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Mouse handlers for dragging
  const onMouseDown = useCallback((e: React.MouseEvent, type: DragType) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setDragType(type);
    setDragStart({ x: e.clientX, y: e.clientY, origX: x, origY: y, origW: w, origH: h });
  }, [x, y, w, h]);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!dragType || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const dx = (e.clientX - dragStart.x) / scale;
    const dy = (e.clientY - dragStart.y) / scale;

    if (dragType === "move") {
      setX(Math.max(0, Math.min(imgW - w, dragStart.origX + dx)));
      setY(Math.max(0, Math.min(imgH - h, dragStart.origY + dy)));
    } else if (dragType === "nw") {
      const newX = Math.max(0, Math.min(dragStart.origX + dragStart.origW - 20, dragStart.origX + dx));
      const newY = Math.max(0, Math.min(dragStart.origY + dragStart.origH - 20, dragStart.origY + dy));
      setX(newX);
      setY(newY);
      setW(dragStart.origW + (dragStart.origX - newX));
      setH(dragStart.origH + (dragStart.origY - newY));
    } else if (dragType === "ne") {
      const newY = Math.max(0, Math.min(dragStart.origY + dragStart.origH - 20, dragStart.origY + dy));
      setY(newY);
      setW(Math.max(20, Math.min(imgW - dragStart.origX, dragStart.origW + dx)));
      setH(dragStart.origH + (dragStart.origY - newY));
    } else if (dragType === "sw") {
      const newX = Math.max(0, Math.min(dragStart.origX + dragStart.origW - 20, dragStart.origX + dx));
      setX(newX);
      setW(dragStart.origW + (dragStart.origX - newX));
      setH(Math.max(20, Math.min(imgH - dragStart.origY, dragStart.origH + dy)));
    } else if (dragType === "se") {
      setW(Math.max(20, Math.min(imgW - dragStart.origX, dragStart.origW + dx)));
      setH(Math.max(20, Math.min(imgH - dragStart.origY, dragStart.origH + dy)));
    } else if (dragType === "n") {
      const newY = Math.max(0, Math.min(dragStart.origY + dragStart.origH - 20, dragStart.origY + dy));
      setY(newY);
      setH(dragStart.origH + (dragStart.origY - newY));
    } else if (dragType === "s") {
      setH(Math.max(20, Math.min(imgH - dragStart.origY, dragStart.origH + dy)));
    } else if (dragType === "w") {
      const newX = Math.max(0, Math.min(dragStart.origX + dragStart.origW - 20, dragStart.origX + dx));
      setX(newX);
      setW(dragStart.origW + (dragStart.origX - newX));
    } else if (dragType === "e") {
      setW(Math.max(20, Math.min(imgW - dragStart.origX, dragStart.origW + dx)));
    }
  }, [dragType, dragStart, scale, imgW, imgH, w, h]);

  const onMouseUp = useCallback(() => {
    setDragType(null);
  }, []);

  // Attach global listeners
  useEffect(() => {
    if (dragType) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };
    }
  }, [dragType, onMouseMove, onMouseUp]);

  return (
    <ToolLayout toolId="image-crop">
      <div className="space-y-4">
        <input type="file" accept="image/*" onChange={onFile} className={inputStyle} style={inputCss} />
        {imgSrc && (
          <>
            <div className="grid grid-cols-4 gap-2">
              {([
                ["X", x, setX],
                ["Y", y, setY],
                [t("toolPages.image-crop.width"), w, setW],
                [t("toolPages.image-crop.height"), h, setH]
              ] as const).map(([label, val, setter]) => (
                <div key={String(label)}>
                  <label className="text-sm" style={{ color: "var(--text-secondary)" }}>{label}</label>
                  <input type="number" className={inputStyle} style={inputCss} value={val}
                    onChange={(e) => (setter as any)(Math.max(0, Number(e.target.value)))} />
                </div>
              ))}
            </div>
            <div ref={containerRef} className="relative inline-block" style={{ width: previewW, height: previewH, userSelect: "none" }}>
              <img src={imgSrc} alt="preview" style={{ width: previewW, height: previewH, display: "block" }} />
              {/* Dark overlay with cutout - lighter for better visibility */}
              <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
                <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: y * scale, background: "rgba(0,0,0,0.2)" }} />
                <div style={{ position: "absolute", top: (y + h) * scale, left: 0, width: "100%", height: previewH - (y + h) * scale, background: "rgba(0,0,0,0.2)" }} />
                <div style={{ position: "absolute", top: y * scale, left: 0, width: x * scale, height: h * scale, background: "rgba(0,0,0,0.2)" }} />
                <div style={{ position: "absolute", top: y * scale, left: (x + w) * scale, width: previewW - (x + w) * scale, height: h * scale, background: "rgba(0,0,0,0.2)" }} />
              </div>
              {/* Draggable crop box */}
              <div
                onMouseDown={(e) => onMouseDown(e, "move")}
                style={{
                  position: "absolute",
                  top: y * scale,
                  left: x * scale,
                  width: w * scale,
                  height: h * scale,
                  border: "2px solid var(--accent)",
                  cursor: "move",
                  boxShadow: "0 0 0 1px rgba(255,255,255,0.8), 0 0 20px rgba(0,0,0,0.3)"
                }}
              >
                {/* Corner handles */}
                {(["nw", "ne", "sw", "se"] as const).map((dir) => (
                  <div
                    key={dir}
                    onMouseDown={(e) => onMouseDown(e, dir)}
                    style={{
                      position: "absolute",
                      width: 12,
                      height: 12,
                      background: "var(--accent)",
                      border: "2px solid white",
                      borderRadius: "50%",
                      cursor: `${dir}-resize`,
                      ...(dir.includes("n") ? { top: -6 } : { bottom: -6 }),
                      ...(dir.includes("w") ? { left: -6 } : { right: -6 })
                    }}
                  />
                ))}
                {/* Edge handles */}
                {(["n", "s", "e", "w"] as const).map((dir) => (
                  <div
                    key={dir}
                    onMouseDown={(e) => onMouseDown(e, dir)}
                    style={{
                      position: "absolute",
                      background: "var(--accent)",
                      ...(dir === "n" || dir === "s"
                        ? { left: "50%", transform: "translateX(-50%)", width: 40, height: 8, cursor: `${dir}-resize`, ...(dir === "n" ? { top: -4 } : { bottom: -4 }) }
                        : { top: "50%", transform: "translateY(-50%)", width: 8, height: 40, cursor: `${dir}-resize`, ...(dir === "w" ? { left: -4 } : { right: -4 }) })
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={crop} className="px-4 py-2 rounded-lg" style={btnStyle}>{t("toolPages.image-crop.crop")}</button>
              {result && <button onClick={download} className="px-4 py-2 rounded-lg" style={btnStyle}>{t("common.download")}</button>}
            </div>
          </>
        )}
        {result && (
          <div className="mt-4 p-1 inline-block rounded-lg" style={{ background: "var(--accent)", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
            <img src={result} alt="cropped" className="rounded-lg" style={{ display: "block", maxWidth: 400 }} />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
