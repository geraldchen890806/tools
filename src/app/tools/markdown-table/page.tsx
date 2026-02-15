"use client";
import { ToolLayout } from "@/components/ToolLayout";
import { useTranslation } from "@/i18n";
import { useState } from "react";

type ConvertMode = "csv2md" | "json2md" | "html2md" | "md2csv" | "md2json" | "md2html";

export default function Page() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<ConvertMode>("csv2md");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const convert = () => {
    setError("");
    try {
      if (!input.trim()) {
        setError(t("toolPages.markdown-table.emptyInput"));
        return;
      }

      let result = "";
      switch (mode) {
        case "csv2md":
          result = csvToMarkdown(input);
          break;
        case "json2md":
          result = jsonToMarkdown(input);
          break;
        case "html2md":
          result = htmlToMarkdown(input);
          break;
        case "md2csv":
          result = markdownToCsv(input);
          break;
        case "md2json":
          result = markdownToJson(input);
          break;
        case "md2html":
          result = markdownToHtml(input);
          break;
      }
      setOutput(result);
    } catch (e: any) {
      setError(e.message || t("toolPages.markdown-table.convertError"));
    }
  };

  const csvToMarkdown = (csv: string): string => {
    const lines = csv.trim().split("\n");
    if (lines.length === 0) throw new Error(t("toolPages.markdown-table.emptyInput"));

    const rows = lines.map((line) => line.split(",").map((cell) => cell.trim()));
    const header = rows[0];
    const separator = header.map(() => "---").join(" | ");
    const body = rows.slice(1).map((row) => row.join(" | "));

    return `| ${header.join(" | ")} |\n| ${separator} |\n${body.map((r) => `| ${r} |`).join("\n")}`;
  };

  const jsonToMarkdown = (json: string): string => {
    const data = JSON.parse(json);
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error(t("toolPages.markdown-table.invalidJsonArray"));
    }

    const keys = Object.keys(data[0]);
    const header = keys.join(" | ");
    const separator = keys.map(() => "---").join(" | ");
    const body = data.map((obj) => keys.map((k) => obj[k] ?? "").join(" | "));

    return `| ${header} |\n| ${separator} |\n${body.map((r) => `| ${r} |`).join("\n")}`;
  };

  const htmlToMarkdown = (html: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const table = doc.querySelector("table");
    if (!table) throw new Error(t("toolPages.markdown-table.noTableFound"));

    const rows = Array.from(table.querySelectorAll("tr"));
    if (rows.length === 0) throw new Error(t("toolPages.markdown-table.emptyTable"));

    const header = Array.from(rows[0].querySelectorAll("th, td")).map((cell) => cell.textContent?.trim() || "");
    const separator = header.map(() => "---").join(" | ");
    const body = rows.slice(1).map((row) =>
      Array.from(row.querySelectorAll("td")).map((cell) => cell.textContent?.trim() || "")
    );

    return `| ${header.join(" | ")} |\n| ${separator} |\n${body.map((r) => `| ${r.join(" | ")} |`).join("\n")}`;
  };

  const markdownToCsv = (md: string): string => {
    const lines = md.trim().split("\n").filter((line) => line.trim());
    if (lines.length < 2) throw new Error(t("toolPages.markdown-table.invalidMarkdownTable"));

    const rows = lines
      .filter((line) => !line.match(/^\s*\|\s*[-:]+/)) // 过滤分隔行
      .map((line) =>
        line
          .split("|")
          .slice(1, -1)
          .map((cell) => cell.trim())
      );

    return rows.map((row) => row.join(",")).join("\n");
  };

  const markdownToJson = (md: string): string => {
    const lines = md.trim().split("\n").filter((line) => line.trim());
    if (lines.length < 2) throw new Error(t("toolPages.markdown-table.invalidMarkdownTable"));

    const rows = lines
      .filter((line) => !line.match(/^\s*\|\s*[-:]+/))
      .map((line) =>
        line
          .split("|")
          .slice(1, -1)
          .map((cell) => cell.trim())
      );

    const header = rows[0];
    const data = rows.slice(1).map((row) => {
      const obj: any = {};
      header.forEach((key, i) => {
        obj[key] = row[i] || "";
      });
      return obj;
    });

    return JSON.stringify(data, null, 2);
  };

  const markdownToHtml = (md: string): string => {
    const lines = md.trim().split("\n").filter((line) => line.trim());
    if (lines.length < 2) throw new Error(t("toolPages.markdown-table.invalidMarkdownTable"));

    const rows = lines
      .filter((line) => !line.match(/^\s*\|\s*[-:]+/))
      .map((line) =>
        line
          .split("|")
          .slice(1, -1)
          .map((cell) => cell.trim())
      );

    const header = rows[0];
    const body = rows.slice(1);

    const headerHtml = `<tr>${header.map((cell) => `<th>${cell}</th>`).join("")}</tr>`;
    const bodyHtml = body.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("\n");

    return `<table>\n  <thead>\n    ${headerHtml}\n  </thead>\n  <tbody>\n    ${bodyHtml}\n  </tbody>\n</table>`;
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
  };

  const clear = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  const modes: ConvertMode[] = ["csv2md", "json2md", "html2md", "md2csv", "md2json", "md2html"];

  return (
    <ToolLayout toolId="markdown-table">
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* 模式选择 */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {modes.map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: mode === m ? "var(--accent)" : "var(--bg-secondary)",
                color: mode === m ? "white" : "var(--text-primary)",
                cursor: "pointer",
              }}
            >
              {t(`toolPages.markdown-table.${m}`)}
            </button>
          ))}
        </div>

        {/* 输入 */}
        <div>
          <label style={{ display: "block", marginBottom: 8, color: "var(--text-secondary)", fontSize: 14 }}>
            {t("common.input")}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("toolPages.markdown-table.inputPlaceholder")}
            style={{
              width: "100%",
              minHeight: 200,
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
              borderRadius: 8,
              padding: 12,
              fontFamily: "monospace",
              resize: "vertical",
            }}
          />
        </div>

        {/* 按钮 */}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={convert}
            style={{
              background: "var(--accent)",
              color: "white",
              padding: "12px 24px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
            }}
          >
            {t("common.convert")}
          </button>
          <button
            onClick={clear}
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
              padding: "12px 24px",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            {t("common.clear")}
          </button>
          {output && (
            <button
              onClick={copy}
              style={{
                background: "var(--accent)",
                color: "white",
                padding: "12px 24px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
              }}
            >
              {t("common.copy")}
            </button>
          )}
        </div>

        {/* 错误 */}
        {error && (
          <div
            style={{
              padding: 12,
              background: "#fee",
              border: "1px solid #fcc",
              borderRadius: 8,
              color: "#c00",
            }}
          >
            {error}
          </div>
        )}

        {/* 输出 */}
        {output && (
          <div>
            <label style={{ display: "block", marginBottom: 8, color: "var(--text-secondary)", fontSize: 14 }}>
              {t("common.output")}
            </label>
            <textarea
              value={output}
              readOnly
              style={{
                width: "100%",
                minHeight: 200,
                background: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
                borderRadius: 8,
                padding: 12,
                fontFamily: "monospace",
                resize: "vertical",
              }}
            />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
