export interface Tool {
  /** i18n key under tools.*, e.g. "word-counter" */
  id: string;
  href: string;
  icon: string;
  isNew?: boolean;
}

export interface Category {
  id: string;
  icon: string;
  tools: Tool[];
}

export const categories: Category[] = [
  {
    id: "dev",
    icon: "💻",
    tools: [
      { id: "json-formatter", href: "/tools/json-formatter", icon: "📋" },
      { id: "base64", href: "/tools/base64", icon: "🔐" },
      { id: "url-encoder", href: "/tools/url-encoder", icon: "🔗" },
      { id: "regex-tester", href: "/tools/regex-tester", icon: "🎯" },
      { id: "log-highlighter", href: "/tools/log-highlighter", icon: "📜", isNew: true },
      { id: "json-path", href: "/tools/json-path", icon: "🔎", isNew: true },
      { id: "json-schema-validator", href: "/tools/json-schema-validator", icon: "✓", isNew: true },
      { id: "http-status", href: "/tools/http-status", icon: "📡", isNew: true },
      { id: "cron-parser", href: "/tools/cron-parser", icon: "⏱️", isNew: true },
      { id: "crontab-generator", href: "/tools/crontab-generator", icon: "⚙️", isNew: true },
      { id: "html-escape", href: "/tools/html-escape", icon: "🏷️", isNew: true },
      { id: "sql-formatter", href: "/tools/sql-formatter", icon: "🗃️", isNew: true },
      { id: "ip-lookup", href: "/tools/ip-lookup", icon: "🌐", isNew: true },
    ],
  },
  {
    id: "crypto",
    icon: "🔒",
    tools: [
      { id: "hash", href: "/tools/hash", icon: "🧮" },
      { id: "jwt-decoder", href: "/tools/jwt-decoder", icon: "🎫" },
      { id: "aes", href: "/tools/aes", icon: "🔐", isNew: true },
      { id: "rsa-keygen", href: "/tools/rsa-keygen", icon: "🗝️", isNew: true },
      { id: "text-cipher", href: "/tools/text-cipher", icon: "🔐", isNew: true },
    ],
  },
  {
    id: "time",
    icon: "🕐",
    tools: [
      { id: "timestamp", href: "/tools/timestamp", icon: "⏰" },
      { id: "world-clock", href: "/tools/world-clock", icon: "🌍" },
      { id: "date-calculator", href: "/tools/date-calculator", icon: "📅", isNew: true },
      { id: "calendar", href: "/tools/calendar", icon: "🗓️", isNew: true },
      { id: "notes", href: "/tools/notes", icon: "📋", isNew: true },
    ],
  },
  {
    id: "image",
    icon: "🖼️",
    tools: [
      { id: "image-compress", href: "/tools/image-compress", icon: "📦" },
      { id: "image-to-base64", href: "/tools/image-to-base64", icon: "🖼️" },
      { id: "image-crop", href: "/tools/image-crop", icon: "✂️", isNew: true },
      { id: "image-convert", href: "/tools/image-convert", icon: "🔄", isNew: true },
      { id: "image-watermark", href: "/tools/image-watermark", icon: "💧", isNew: true },
      { id: "image-merge", href: "/tools/image-merge", icon: "🧩", isNew: true },
      { id: "favicon-generator", href: "/tools/favicon-generator", icon: "⭐", isNew: true },
    ],
  },
  {
    id: "converter",
    icon: "🔄",
    tools: [
      { id: "color-converter", href: "/tools/color-converter", icon: "🎨" },
      { id: "number-base", href: "/tools/number-base", icon: "🔢" },
      { id: "markdown-preview", href: "/tools/markdown-preview", icon: "📝", isNew: true },
      { id: "markdown-table", href: "/tools/markdown-table", icon: "📊", isNew: true },
      { id: "chinese-converter", href: "/tools/chinese-converter", icon: "🇨🇳", isNew: true },
    ],
  },
  {
    id: "generator",
    icon: "⚡",
    tools: [
      { id: "uuid-generator", href: "/tools/uuid-generator", icon: "🆔" },
      { id: "password-generator", href: "/tools/password-generator", icon: "🔑" },
      { id: "lorem-ipsum", href: "/tools/lorem-ipsum", icon: "📝" },
      { id: "qrcode", href: "/tools/qrcode", icon: "📱", isNew: true },
      { id: "random-number", href: "/tools/random-number", icon: "🎲", isNew: true },
    ],
  },
  {
    id: "calculator",
    icon: "🧮",
    tools: [
      { id: "unit-converter", href: "/tools/unit-converter", icon: "🔄", isNew: true },
      { id: "calculator", href: "/tools/calculator", icon: "🔢", isNew: true },
      { id: "bmi-calculator", href: "/tools/bmi-calculator", icon: "⚖️", isNew: true },
      { id: "loan-calculator", href: "/tools/loan-calculator", icon: "💰", isNew: true },
    ],
  },
  {
    id: "text",
    icon: "✏️",
    tools: [
      { id: "word-counter", href: "/tools/word-counter", icon: "🔢" },
      { id: "case-converter", href: "/tools/case-converter", icon: "🔤" },
      { id: "text-diff", href: "/tools/text-diff", icon: "📄" },
      { id: "csv-to-json", href: "/tools/csv-to-json", icon: "📊", isNew: true },
      { id: "text-dedupe", href: "/tools/text-dedupe", icon: "🧹", isNew: true },
      { id: "xml-formatter", href: "/tools/xml-formatter", icon: "📄", isNew: true },
      { id: "yaml-json", href: "/tools/yaml-json", icon: "🔄", isNew: true },
      { id: "escape", href: "/tools/escape", icon: "🏷️", isNew: true },
      { id: "unicode", href: "/tools/unicode", icon: "🔤", isNew: true },
      { id: "pinyin", href: "/tools/pinyin", icon: "🇨🇳", isNew: true },
    ],
  },
];

export const allTools = categories.flatMap((c) => c.tools);

// 热门推荐工具（Top 5）
export const featuredTools: Tool[] = [
  { id: "json-formatter", href: "/tools/json-formatter", icon: "📋" },
  { id: "qrcode", href: "/tools/qrcode", icon: "📱" },
  { id: "password-generator", href: "/tools/password-generator", icon: "🔑" },
  { id: "image-compress", href: "/tools/image-compress", icon: "📦" },
  { id: "timestamp", href: "/tools/timestamp", icon: "⏰" },
];
