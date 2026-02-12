"use client";

import { useState } from "react";
import { categories, allTools, type Tool } from "@/config/tools";
import Link from "next/link";
import { HomepageJsonLd } from "./homepage-jsonld";
import { useTranslation } from "@/i18n";

export default function Home() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { t } = useTranslation();

  const filtered = search.trim()
    ? allTools.filter((tool) => {
        const name = t(`tools.${tool.id}.name`).toLowerCase();
        const desc = t(`tools.${tool.id}.description`).toLowerCase();
        const q = search.toLowerCase();
        return name.includes(q) || desc.includes(q);
      })
    : null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <HomepageJsonLd />
      {/* Hero */}
      <section className="text-center py-16">
        <h1 className="text-5xl font-bold tracking-tight mb-4">
          <span style={{ color: "var(--accent-light)" }}>{t("home.title")}</span>
          {t("home.titleSuffix")}
        </h1>
        <p
          className="text-lg max-w-2xl mx-auto mb-10"
          style={{ color: "var(--text-secondary)" }}
        >
          {t("home.subtitle")}
        </p>

        {/* Search */}
        <div className="max-w-xl mx-auto relative">
          <input
            type="text"
            placeholder={t("home.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-3.5 rounded-xl text-base outline-none transition-all border focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            style={{
              background: "var(--bg-secondary)",
              borderColor: "var(--border)",
              color: "var(--text-primary)",
            }}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl opacity-40">
            🔍
          </span>
        </div>
      </section>

      {/* Search Results */}
      {filtered ? (
        <section className="mb-16">
          <h2
            className="text-sm font-medium mb-4 uppercase tracking-wider"
            style={{ color: "var(--text-secondary)" }}
          >
            {t("home.searchResults")} ({filtered.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((tool) => (
              <ToolCard key={tool.href} tool={tool} />
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-center py-12" style={{ color: "var(--text-secondary)" }}>
              {t("home.noResults")}
            </p>
          )}
        </section>
      ) : (
        <>
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveCategory(null)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: activeCategory === null ? "var(--accent)" : "var(--bg-secondary)",
                color: activeCategory === null ? "white" : "var(--text-secondary)",
                border: `1px solid ${activeCategory === null ? "var(--accent)" : "var(--border)"}`,
              }}
            >
              {t("home.allCategory")}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: activeCategory === cat.id ? "var(--accent)" : "var(--bg-secondary)",
                  color: activeCategory === cat.id ? "white" : "var(--text-secondary)",
                  border: `1px solid ${activeCategory === cat.id ? "var(--accent)" : "var(--border)"}`,
                }}
              >
                {cat.icon} {t(`categories.${cat.id}`)}
              </button>
            ))}
          </div>

          {/* Tool Categories */}
          {categories
            .filter((c) => !activeCategory || c.id === activeCategory)
            .map((category) => (
              <section key={category.id} className="mb-12">
                <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
                  <span className="text-2xl">{category.icon}</span>
                  {t(`categories.${category.id}`)}
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: "var(--bg-secondary)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {category.tools.length}
                  </span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.tools.map((tool) => (
                    <ToolCard key={tool.href} tool={tool} />
                  ))}
                </div>
              </section>
            ))}
        </>
      )}
    </div>
  );
}

function ToolCard({ tool }: { tool: Tool }) {
  const { t } = useTranslation();
  return (
    <Link
      href={tool.href}
      className="group block p-5 rounded-xl border transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background: "var(--bg-card)",
        borderColor: "var(--border)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--bg-card-hover)";
        e.currentTarget.style.borderColor = "var(--accent)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "var(--bg-card)";
        e.currentTarget.style.borderColor = "var(--border)";
      }}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{tool.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-base">{t(`tools.${tool.id}.name`)}</h3>
            {tool.isNew && (
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                style={{ background: "var(--accent)", color: "white" }}
              >
                NEW
              </span>
            )}
          </div>
          <p
            className="text-sm mt-1 leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            {t(`tools.${tool.id}.description`)}
          </p>
        </div>
        <span
          className="opacity-0 group-hover:opacity-100 transition-opacity text-lg"
          style={{ color: "var(--accent-light)" }}
        >
          →
        </span>
      </div>
    </Link>
  );
}
