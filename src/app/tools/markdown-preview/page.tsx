"use client";
import { ToolLayout } from "@/components/ToolLayout";
import { useState } from "react";

function md2html(md: string): string {
  let html = md;
  // code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre style="background:#1e1e1e;color:#d4d4d4;padding:12px;border-radius:8px;overflow-x:auto"><code>$2</code></pre>');
  // headings
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  // hr
  html = html.replace(/^---$/gm, '<hr style="border:none;border-top:1px solid var(--border);margin:16px 0">');
  // bold & italic
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  // inline code
  html = html.replace(/`([^`]+)`/g, '<code style="background:var(--bg-secondary);padding:2px 6px;border-radius:4px;font-size:0.9em">$1</code>');
  // images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%">');
  // links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:var(--accent)">$1</a>');
  // blockquote
  html = html.replace(/^> (.+)$/gm, '<blockquote style="border-left:3px solid var(--accent);padding-left:12px;color:var(--text-secondary);margin:8px 0">$1</blockquote>');
  // list
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul style="padding-left:20px">$&</ul>');
  // paragraphs
  html = html.replace(/^(?!<[hupblo]|<hr|<pre|<img|<a)(.+)$/gm, '<p>$1</p>');
  return html;
}

const sample = `# Markdown 预览

## 功能演示

**加粗文本** 和 *斜体文本*

\`行内代码\` 示例

\`\`\`js
const hello = "world";
\`\`\`

- 列表项 1
- 列表项 2

> 这是引用

[链接](https://example.com)

---

普通段落文本`;

export default function Page() {
  const [text, setText] = useState(sample);
  return (
    <ToolLayout title="Markdown 预览" description="实时 Markdown 预览">
      <div style={{ display: "flex", gap: 16, minHeight: 500 }}>
        <textarea value={text} onChange={e => setText(e.target.value)} style={{ flex: 1, background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)", borderRadius: 8, padding: 12, fontFamily: "monospace", resize: "none", fontSize: 14 }} />
        <div style={{ flex: 1, background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 8, padding: 16, overflow: "auto", color: "var(--text-primary)", lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: md2html(text) }} />
      </div>
    </ToolLayout>
  );
}
