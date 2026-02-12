export interface Tool {
  name: string;
  description: string;
  href: string;
  icon: string;
  isNew?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  tools: Tool[];
}

export const categories: Category[] = [
  {
    id: "text",
    name: "文本工具",
    icon: "✏️",
    tools: [
      { name: "字数统计", description: "统计字符数、单词数、行数，支持中英文", href: "/tools/word-counter", icon: "🔢" },
      { name: "大小写转换", description: "文本大小写、驼峰、下划线等格式转换", href: "/tools/case-converter", icon: "🔤" },
      { name: "文本对比", description: "对比两段文本的差异，高亮显示不同之处", href: "/tools/text-diff", icon: "📄" },
      { name: "CSV 转 JSON", description: "粘贴 CSV 文本快速转换为 JSON 格式", href: "/tools/csv-to-json", icon: "📊", isNew: true },
    ],
  },
  {
    id: "dev",
    name: "开发工具",
    icon: "💻",
    tools: [
      { name: "JSON 格式化", description: "JSON 美化、压缩、校验，支持语法高亮", href: "/tools/json-formatter", icon: "📋" },
      { name: "Base64 编解码", description: "Base64 编码与解码，支持文本和文件", href: "/tools/base64", icon: "🔐" },
      { name: "URL 编解码", description: "URL 编码与解码转换", href: "/tools/url-encoder", icon: "🔗" },
      { name: "正则测试", description: "在线正则表达式测试与匹配高亮", href: "/tools/regex-tester", icon: "🎯" },
      { name: "日志高亮", description: "粘贴日志自动识别级别并高亮显示", href: "/tools/log-highlighter", icon: "📜", isNew: true },
      { name: "JSON Path 查询", description: "使用 JSONPath 语法查询 JSON 数据", href: "/tools/json-path", icon: "🔎", isNew: true },
      { name: "HTTP 状态码", description: "HTTP 状态码速查表，含说明和使用场景", href: "/tools/http-status", icon: "📡", isNew: true },
      { name: "Cron 表达式", description: "Cron 表达式可视化编辑和解读", href: "/tools/cron-parser", icon: "⏱️", isNew: true },
    ],
  },
  {
    id: "converter",
    name: "转换工具",
    icon: "🔄",
    tools: [
      { name: "颜色转换", description: "HEX、RGB、HSL 颜色格式互转与预览", href: "/tools/color-converter", icon: "🎨" },
      { name: "时间戳转换", description: "Unix 时间戳与日期时间互转", href: "/tools/timestamp", icon: "⏰" },
      { name: "进制转换", description: "二进制、八进制、十进制、十六进制互转", href: "/tools/number-base", icon: "🔢" },
      { name: "世界时钟", description: "全球主要城市实时时间对照", href: "/tools/world-clock", icon: "🌍", isNew: true },
      { name: "Markdown 预览", description: "实时 Markdown 编辑与预览", href: "/tools/markdown-preview", icon: "📝", isNew: true },
    ],
  },
  {
    id: "generator",
    name: "生成工具",
    icon: "⚡",
    tools: [
      { name: "UUID 生成器", description: "批量生成 UUID v4，一键复制", href: "/tools/uuid-generator", icon: "🆔" },
      { name: "密码生成器", description: "自定义长度和字符类型的安全密码生成", href: "/tools/password-generator", icon: "🔑" },
      { name: "Lorem Ipsum", description: "生成占位文本，支持中英文", href: "/tools/lorem-ipsum", icon: "📝" },
      { name: "二维码生成", description: "输入文本或 URL 生成二维码图片", href: "/tools/qrcode", icon: "📱", isNew: true },
    ],
  },
  {
    id: "crypto",
    name: "加密解密",
    icon: "🔒",
    tools: [
      { name: "Hash 计算", description: "SHA-1、SHA-256、SHA-512 等哈希值计算", href: "/tools/hash", icon: "🧮" },
      { name: "JWT 解析", description: "解码并查看 JWT Token 的 Header 和 Payload", href: "/tools/jwt-decoder", icon: "🎫" },
      { name: "AES 加密/解密", description: "AES-CBC 模式加密解密，支持自定义 Key 和 IV", href: "/tools/aes", icon: "🔐", isNew: true },
      { name: "RSA 密钥生成", description: "在线生成 RSA 公钥/私钥对", href: "/tools/rsa-keygen", icon: "🗝️", isNew: true },
    ],
  },
  {
    id: "image",
    name: "图片工具",
    icon: "🖼️",
    tools: [
      { name: "图片压缩", description: "在线无损/有损压缩，不上传服务器", href: "/tools/image-compress", icon: "📦" },
      { name: "图片转 Base64", description: "图片与 Base64 字符串互转", href: "/tools/image-to-base64", icon: "🖼️" },
      { name: "图片裁剪", description: "在线裁剪图片，自定义尺寸和比例", href: "/tools/image-crop", icon: "✂️", isNew: true },
      { name: "图片格式转换", description: "JPG、PNG、WebP 格式互转", href: "/tools/image-convert", icon: "🔄", isNew: true },
      { name: "图片水印", description: "给图片添加文字水印", href: "/tools/image-watermark", icon: "💧", isNew: true },
      { name: "图片拼接", description: "多张图片横向或纵向拼接", href: "/tools/image-merge", icon: "🧩", isNew: true },
      { name: "Favicon 生成", description: "上传图片生成多尺寸 Favicon", href: "/tools/favicon-generator", icon: "⭐", isNew: true },
    ],
  },
];

export const allTools = categories.flatMap((c) => c.tools);
