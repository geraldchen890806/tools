"use client";
import { ToolLayout } from "@/components/ToolLayout";
import { useTranslation } from "@/i18n";
import { useState, useRef, useEffect } from "react";
import QRCode from "qrcode";

const sizes = [200, 300, 400, 500];
const errorLevels = [
  { value: "L", label: "L (7%)" },
  { value: "M", label: "M (15%)" },
  { value: "Q", label: "Q (25%)" },
  { value: "H", label: "H (30%)" },
];

export default function Page() {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [size, setSize] = useState(300);
  const [errorLevel, setErrorLevel] = useState("M");
  const [margin, setMargin] = useState(4);
  const [darkColor, setDarkColor] = useState("#000000");
  const [lightColor, setLightColor] = useState("#ffffff");
  const [logo, setLogo] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generate = async () => {
    if (!text.trim() || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 生成二维码
    await QRCode.toCanvas(canvas, text, {
      width: size,
      margin,
      errorCorrectionLevel: errorLevel as "L" | "M" | "Q" | "H",
      color: {
        dark: darkColor,
        light: lightColor,
      },
    });

    // 如果有logo，绘制在中间
    if (logo) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const logoSize = size * 0.2; // logo占二维码的20%
        const x = (size - logoSize) / 2;
        const y = (size - logoSize) / 2;

        // 绘制白色背景（确保logo清晰）
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(x - 5, y - 5, logoSize + 10, logoSize + 10);

        // 绘制logo
        ctx.drawImage(img, x, y, logoSize, logoSize);
      };
      img.src = logo;
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setLogo(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const download = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "qrcode.png";
    a.click();
  };

  useEffect(() => {
    if (text.trim()) {
      generate();
    }
  }, [text, size, errorLevel, margin, darkColor, lightColor, logo]);

  return (
    <ToolLayout toolId="qrcode">
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* 文本输入 */}
        <div>
          <label style={{ display: "block", marginBottom: 8, color: "var(--text-secondary)", fontSize: 14 }}>
            {t("toolPages.qrcode.inputLabel")}
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("toolPages.qrcode.inputPlaceholder")}
            style={{
              width: "100%",
              minHeight: 100,
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
              borderRadius: 8,
              padding: 12,
              resize: "vertical",
            }}
          />
        </div>

        {/* 设置选项 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          {/* 尺寸 */}
          <div>
            <label style={{ display: "block", marginBottom: 8, color: "var(--text-secondary)", fontSize: 14 }}>
              {t("toolPages.qrcode.size")}
            </label>
            <select
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              style={{
                width: "100%",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
                borderRadius: 8,
                padding: "8px 12px",
              }}
            >
              {sizes.map((s) => (
                <option key={s} value={s}>
                  {s}x{s}
                </option>
              ))}
            </select>
          </div>

          {/* 容错级别 */}
          <div>
            <label style={{ display: "block", marginBottom: 8, color: "var(--text-secondary)", fontSize: 14 }}>
              {t("toolPages.qrcode.errorLevel")}
            </label>
            <select
              value={errorLevel}
              onChange={(e) => setErrorLevel(e.target.value)}
              style={{
                width: "100%",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
                borderRadius: 8,
                padding: "8px 12px",
              }}
            >
              {errorLevels.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          {/* 边距 */}
          <div>
            <label style={{ display: "block", marginBottom: 8, color: "var(--text-secondary)", fontSize: 14 }}>
              {t("toolPages.qrcode.margin")} ({margin})
            </label>
            <input
              type="range"
              min="0"
              max="10"
              value={margin}
              onChange={(e) => setMargin(Number(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>

          {/* 前景色 */}
          <div>
            <label style={{ display: "block", marginBottom: 8, color: "var(--text-secondary)", fontSize: 14 }}>
              {t("toolPages.qrcode.darkColor")}
            </label>
            <input
              type="color"
              value={darkColor}
              onChange={(e) => setDarkColor(e.target.value)}
              style={{
                width: "100%",
                height: 40,
                background: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                cursor: "pointer",
              }}
            />
          </div>

          {/* 背景色 */}
          <div>
            <label style={{ display: "block", marginBottom: 8, color: "var(--text-secondary)", fontSize: 14 }}>
              {t("toolPages.qrcode.lightColor")}
            </label>
            <input
              type="color"
              value={lightColor}
              onChange={(e) => setLightColor(e.target.value)}
              style={{
                width: "100%",
                height: 40,
                background: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                cursor: "pointer",
              }}
            />
          </div>
        </div>

        {/* Logo上传 */}
        <div>
          <label style={{ display: "block", marginBottom: 8, color: "var(--text-secondary)", fontSize: 14 }}>
            {t("toolPages.qrcode.logo")}
          </label>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              style={{ display: "none" }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
                padding: "8px 16px",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              {t("toolPages.qrcode.uploadLogo")}
            </button>
            {logo && (
              <>
                <span style={{ color: "var(--text-secondary)", fontSize: 14 }}>
                  {t("toolPages.qrcode.logoUploaded")}
                </span>
                <button
                  onClick={removeLogo}
                  style={{
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                    padding: "8px 16px",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                >
                  {t("toolPages.qrcode.removeLogo")}
                </button>
              </>
            )}
          </div>
        </div>

        {/* 生成按钮 */}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={generate}
            disabled={!text.trim()}
            style={{
              background: text.trim() ? "var(--accent)" : "var(--bg-secondary)",
              color: text.trim() ? "white" : "var(--text-secondary)",
              padding: "12px 24px",
              borderRadius: 8,
              border: "none",
              cursor: text.trim() ? "pointer" : "not-allowed",
            }}
          >
            {t("common.generate")}
          </button>
          {text.trim() && (
            <button
              onClick={download}
              style={{
                background: "var(--accent)",
                color: "white",
                padding: "12px 24px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
              }}
            >
              {t("common.download")}
            </button>
          )}
        </div>

        {/* 预览 */}
        {text.trim() && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: 24,
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              borderRadius: 8,
            }}
          >
            <canvas ref={canvasRef} style={{ maxWidth: "100%" }} />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
