"use client";
import { ToolLayout } from "@/components/ToolLayout";
import { useState } from "react";

const data = [
  { code: 100, name: "Continue", desc: "服务器已收到请求头，客户端应继续发送请求体" },
  { code: 101, name: "Switching Protocols", desc: "服务器同意切换协议" },
  { code: 200, name: "OK", desc: "请求成功" },
  { code: 201, name: "Created", desc: "请求成功并创建了新资源" },
  { code: 204, name: "No Content", desc: "请求成功但无返回内容" },
  { code: 206, name: "Partial Content", desc: "服务器返回部分内容（范围请求）" },
  { code: 301, name: "Moved Permanently", desc: "资源已永久移动到新位置" },
  { code: 302, name: "Found", desc: "资源临时移动到新位置" },
  { code: 304, name: "Not Modified", desc: "资源未修改，可使用缓存" },
  { code: 307, name: "Temporary Redirect", desc: "临时重定向，保持请求方法不变" },
  { code: 308, name: "Permanent Redirect", desc: "永久重定向，保持请求方法不变" },
  { code: 400, name: "Bad Request", desc: "请求语法错误，服务器无法理解" },
  { code: 401, name: "Unauthorized", desc: "需要身份认证" },
  { code: 403, name: "Forbidden", desc: "服务器拒绝请求" },
  { code: 404, name: "Not Found", desc: "请求的资源不存在" },
  { code: 405, name: "Method Not Allowed", desc: "请求方法不被允许" },
  { code: 408, name: "Request Timeout", desc: "请求超时" },
  { code: 409, name: "Conflict", desc: "请求与服务器当前状态冲突" },
  { code: 413, name: "Payload Too Large", desc: "请求体过大" },
  { code: 429, name: "Too Many Requests", desc: "请求过于频繁" },
  { code: 500, name: "Internal Server Error", desc: "服务器内部错误" },
  { code: 502, name: "Bad Gateway", desc: "网关收到无效响应" },
  { code: 503, name: "Service Unavailable", desc: "服务暂时不可用" },
  { code: 504, name: "Gateway Timeout", desc: "网关超时" },
];

const groups = [
  { label: "1xx 信息", range: [100, 199] },
  { label: "2xx 成功", range: [200, 299] },
  { label: "3xx 重定向", range: [300, 399] },
  { label: "4xx 客户端错误", range: [400, 499] },
  { label: "5xx 服务器错误", range: [500, 599] },
];

const colorMap: Record<string, string> = { "1": "var(--text-secondary)", "2": "#22c55e", "3": "#3b82f6", "4": "#f59e0b", "5": "#ef4444" };

export default function Page() {
  const [q, setQ] = useState("");
  const filtered = data.filter(d => !q || String(d.code).includes(q) || d.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <ToolLayout title="HTTP 状态码" description="常见 HTTP 状态码速查">
      <input value={q} onChange={e => setQ(e.target.value)} placeholder="搜索状态码或名称..." style={{ width: "100%", background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)", borderRadius: 8, padding: 12, marginBottom: 16 }} />
      {groups.map(g => {
        const items = filtered.filter(d => d.code >= g.range[0] && d.code <= g.range[1]);
        if (!items.length) return null;
        return (
          <div key={g.label} style={{ marginBottom: 20 }}>
            <h3 style={{ color: "var(--text-secondary)", marginBottom: 8, fontSize: 14, fontWeight: 600 }}>{g.label}</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {items.map(d => (
                <div key={d.code} style={{ display: "flex", alignItems: "center", gap: 12, background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 16px" }}>
                  <span style={{ fontWeight: 700, fontSize: 18, color: colorMap[String(d.code)[0]], minWidth: 48 }}>{d.code}</span>
                  <span style={{ fontWeight: 600, color: "var(--text-primary)", minWidth: 180 }}>{d.name}</span>
                  <span style={{ color: "var(--text-secondary)", fontSize: 14 }}>{d.desc}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </ToolLayout>
  );
}
