"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { useTranslation } from "@/i18n";

const LOREM = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris.",
  "Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula ut dictum pharetra, nisi nunc fringilla magna.",
  "Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, quis gravida magna mi a libero. Fusce vulputate eleifend sapien. Vestibulum purus quam, scelerisque ut, mollis sed, nonummy id, metus.",
];

const CN_CHARS = "天地玄黄宇宙洪荒日月盈昃辰宿列张寒来暑往秋收冬藏闰余成岁律吕调阳云腾致雨露结为霜金生丽水玉出昆冈剑号巨阙珠称夜光果珍李柰菜重芥姜海咸河淡鳞潜羽翔龙师火帝鸟官人皇始制文字乃服衣裳推位让国有虞陶唐";

function genChinese(paragraphs: number): string {
  const result: string[] = [];
  for (let p = 0; p < paragraphs; p++) {
    const sentences: string[] = [];
    const sentenceCount = 3 + Math.floor(Math.random() * 4);
    for (let s = 0; s < sentenceCount; s++) {
      const len = 8 + Math.floor(Math.random() * 20);
      let sentence = "";
      for (let i = 0; i < len; i++) {
        sentence += CN_CHARS[Math.floor(Math.random() * CN_CHARS.length)];
      }
      sentences.push(sentence + "。");
    }
    result.push(sentences.join(""));
  }
  return result.join("\n\n");
}

function genEnglish(paragraphs: number): string {
  const result: string[] = [];
  for (let i = 0; i < paragraphs; i++) {
    result.push(LOREM[i % LOREM.length]);
  }
  return result.join("\n\n");
}

export default function LoremIpsumPage() {
  const { t } = useTranslation();
  const [count, setCount] = useState(3);
  const [lang, setLang] = useState<"en" | "zh">("en");
  const [output, setOutput] = useState("");

  const generate = () => {
    setOutput(lang === "zh" ? genChinese(count) : genEnglish(count));
  };

  return (
    <ToolLayout toolId="lorem-ipsum">
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <label className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
          段落数
          <input
            type="number"
            min={1}
            max={10}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-20 rounded-lg p-2 border text-center"
            style={{ background: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }}
          />
        </label>
        <div className="flex gap-3">
          {(["en", "zh"] as const).map((l) => (
            <label key={l} className="flex items-center gap-1.5 text-sm cursor-pointer" style={{ color: "var(--text-secondary)" }}>
              <input type="radio" name="lang" checked={lang === l} onChange={() => setLang(l)} />
              {l === "en" ? "English" : "中文"}
            </label>
          ))}
        </div>
        <button onClick={generate} className="px-4 py-2 rounded-lg text-white" style={{ background: "var(--accent)" }}>
          生成
        </button>
      </div>

      {output && (
        <>
          <pre
            className="rounded-lg p-4 border text-sm whitespace-pre-wrap leading-relaxed"
            style={{ background: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }}
          >
            {output}
          </pre>
          <button
            onClick={() => navigator.clipboard.writeText(output)}
            className="mt-3 px-4 py-2 rounded-lg text-white"
            style={{ background: "var(--accent)" }}
          >
            复制
          </button>
        </>
      )}
    </ToolLayout>
  );
}
