"use client";

import { useState, useEffect, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";

interface Note {
  id: string;
  title: string;
  content: string;
  reminder?: string; // ISO datetime string
  done: boolean;
  notified?: boolean;
  createdAt: string;
}

const STORAGE_KEY = "aft-notes";
const inputStyle: React.CSSProperties = { background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)", padding: "8px 12px", borderRadius: 6, width: "100%" };
const btnStyle: React.CSSProperties = { background: "var(--accent)", color: "white", padding: "8px 20px", borderRadius: 6, border: "none", cursor: "pointer", fontWeight: 500 };
const cardStyle: React.CSSProperties = { background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 16, marginBottom: 12 };

function load(): Note[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
}
function save(notes: Note[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(notes)); }

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [reminder, setReminder] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); setNotes(load()); }, []);

  useEffect(() => {
    if (mounted && typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, [mounted]);

  const update = useCallback((fn: (n: Note[]) => Note[]) => {
    setNotes(prev => { const next = fn(prev); save(next); return next; });
  }, []);

  // Check reminders every minute
  useEffect(() => {
    if (!mounted) return;
    const check = () => {
      const now = Date.now();
      setNotes(prev => {
        let changed = false;
        const next = prev.map(n => {
          if (n.reminder && !n.notified && !n.done && new Date(n.reminder).getTime() <= now) {
            changed = true;
            if (typeof Notification !== "undefined" && Notification.permission === "granted") {
              new Notification("备忘提醒", { body: n.title + (n.content ? `\n${n.content}` : ""), icon: "📌" });
            }
            return { ...n, notified: true };
          }
          return n;
        });
        if (changed) save(next);
        return changed ? next : prev;
      });
    };
    check();
    const t = setInterval(check, 60000);
    return () => clearInterval(t);
  }, [mounted]);

  const submit = () => {
    if (!title.trim()) return;
    if (editId) {
      update(ns => ns.map(n => n.id === editId ? { ...n, title, content, reminder: reminder || undefined, notified: false } : n));
      setEditId(null);
    } else {
      const note: Note = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), title, content, reminder: reminder || undefined, done: false, createdAt: new Date().toISOString() };
      update(ns => [note, ...ns]);
    }
    setTitle(""); setContent(""); setReminder("");
  };

  const startEdit = (n: Note) => { setEditId(n.id); setTitle(n.title); setContent(n.content); setReminder(n.reminder || ""); };
  const cancelEdit = () => { setEditId(null); setTitle(""); setContent(""); setReminder(""); };
  const toggleDone = (id: string) => update(ns => ns.map(n => n.id === id ? { ...n, done: !n.done } : n));
  const remove = (id: string) => update(ns => ns.filter(n => n.id !== id));

  const sorted = [...notes].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  if (!mounted) return null;

  return (
    <ToolLayout title="备忘提醒" description="创建备忘录，设置提醒时间，浏览器通知提醒">
      <div style={cardStyle}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="标题" style={inputStyle} />
          <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="内容（可选）" rows={3} style={{ ...inputStyle, resize: "vertical" }} />
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <label style={{ color: "var(--text-secondary)", fontSize: 13, whiteSpace: "nowrap" }}>提醒时间：</label>
            <input type="datetime-local" value={reminder} onChange={e => setReminder(e.target.value)} style={{ ...inputStyle, width: "auto", flex: 1, minWidth: 200 }} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={submit} style={btnStyle}>{editId ? "保存修改" : "添加备忘"}</button>
            {editId && <button onClick={cancelEdit} style={{ ...btnStyle, background: "var(--bg-primary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}>取消</button>}
          </div>
        </div>
      </div>

      {sorted.length === 0 && (
        <div style={{ textAlign: "center", color: "var(--text-secondary)", padding: 40 }}>暂无备忘，添加一个吧 📌</div>
      )}

      {sorted.map(n => (
        <div key={n.id} style={{ ...cardStyle, opacity: n.done ? 0.6 : 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button onClick={() => toggleDone(n.id)} style={{ background: n.done ? "var(--accent)" : "transparent", border: "2px solid var(--accent)", borderRadius: 4, width: 20, height: 20, cursor: "pointer", color: "white", fontSize: 12, lineHeight: "16px", padding: 0 }}>
                  {n.done ? "✓" : ""}
                </button>
                <span style={{ fontWeight: 600, color: "var(--text-primary)", textDecoration: n.done ? "line-through" : "none", fontSize: 15 }}>{n.title}</span>
              </div>
              {n.content && <div style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 6, marginLeft: 28, whiteSpace: "pre-wrap" }}>{n.content}</div>}
              <div style={{ display: "flex", gap: 12, marginTop: 8, marginLeft: 28, fontSize: 11, color: "var(--text-secondary)" }}>
                <span>创建: {new Date(n.createdAt).toLocaleString()}</span>
                {n.reminder && <span>⏰ {new Date(n.reminder).toLocaleString()}{n.notified ? " ✅已提醒" : ""}</span>}
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => startEdit(n)} style={{ background: "transparent", border: "1px solid var(--border)", borderRadius: 4, padding: "4px 8px", cursor: "pointer", color: "var(--text-secondary)", fontSize: 12 }}>编辑</button>
              <button onClick={() => remove(n.id)} style={{ background: "transparent", border: "1px solid var(--border)", borderRadius: 4, padding: "4px 8px", cursor: "pointer", color: "#e55", fontSize: 12 }}>删除</button>
            </div>
          </div>
        </div>
      ))}
    </ToolLayout>
  );
}
