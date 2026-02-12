"use client";

import { JsonLd } from "@/components/JsonLd";

export function HomepageJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "AnyFreeTools",
        url: "https://anyfreetools.com",
        description:
          "免费在线工具集合：JSON 格式化、Base64 编解码、颜色转换、UUID 生成、图片处理等开发者常用工具",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://anyfreetools.com/?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      }}
    />
  );
}
