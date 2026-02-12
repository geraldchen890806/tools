"use client";

import { useTheme } from "./ThemeProvider";

export function Navbar() {
  const { theme, toggle } = useTheme();

  return (
    <nav
      className="fixed top-0 w-full z-50 border-b backdrop-blur-xl"
      style={{ borderColor: "var(--border)", background: "var(--nav-bg)" }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a
          href="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight"
        >
          <span className="text-2xl">⚡</span>
          <span style={{ color: "var(--accent-light)" }}>AnyFree</span>
          <span style={{ color: "var(--text-primary)" }}>Tools</span>
        </a>
        <div
          className="flex items-center gap-4 text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          <a href="/" className="hover:opacity-80 transition-opacity">
            首页
          </a>
          <a
            href="https://github.com/geraldchen890806/tools"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            GitHub
          </a>
          <button
            onClick={toggle}
            className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
            }}
            title={theme === "dark" ? "切换亮色模式" : "切换暗色模式"}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </nav>
  );
}
