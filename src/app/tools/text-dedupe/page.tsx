'use client';

import { useState } from 'react';

export default function TextDedupe() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [trimLines, setTrimLines] = useState(true);
  const [removeEmpty, setRemoveEmpty] = useState(true);
  const [stats, setStats] = useState({ original: 0, unique: 0, duplicates: 0 });
  const [copied, setCopied] = useState(false);

  const handleDedupe = () => {
    const lines = input.split('\n');
    
    let processed = lines.map((line) => {
      if (trimLines) return line.trim();
      return line;
    });

    if (removeEmpty) {
      processed = processed.filter((line) => line.length > 0);
    }

    const seen = new Set<string>();
    const unique: string[] = [];

    processed.forEach((line) => {
      const key = caseSensitive ? line : line.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(line);
      }
    });

    setOutput(unique.join('\n'));
    setStats({
      original: processed.length,
      unique: unique.length,
      duplicates: processed.length - unique.length,
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setStats({ original: 0, unique: 0, duplicates: 0 });
  };

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <h1 className="text-3xl font-bold mb-6">文本去重工具</h1>

      {/* Options */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <h3 className="font-semibold mb-3">选项</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
              className="w-4 h-4"
            />
            <span>区分大小写</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={trimLines}
              onChange={(e) => setTrimLines(e.target.checked)}
              className="w-4 h-4"
            />
            <span>去除首尾空格</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={removeEmpty}
              onChange={(e) => setRemoveEmpty(e.target.checked)}
              className="w-4 h-4"
            />
            <span>删除空行</span>
          </label>
        </div>
      </div>

      {/* Input */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold">输入（每行一项）</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入文本，每行一项...&#10;例如：&#10;apple&#10;banana&#10;apple&#10;cherry"
          className="w-full h-64 p-3 border rounded font-mono text-sm"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={handleDedupe}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          去重
        </button>
        <button
          onClick={handleClear}
          className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          清空
        </button>
      </div>

      {/* Stats */}
      {output && (
        <div className="mb-4 p-4 bg-blue-50 rounded border border-blue-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {stats.original}
              </div>
              <div className="text-sm text-gray-600">原始行数</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {stats.unique}
              </div>
              <div className="text-sm text-gray-600">唯一行数</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {stats.duplicates}
              </div>
              <div className="text-sm text-gray-600">重复行数</div>
            </div>
          </div>
        </div>
      )}

      {/* Output */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold">输出（去重后）</label>
        <textarea
          value={output}
          readOnly
          placeholder="去重结果将显示在这里..."
          className="w-full h-64 p-3 border rounded font-mono text-sm bg-gray-50"
        />
      </div>

      {/* Copy Button */}
      {output && (
        <button
          onClick={handleCopy}
          className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {copied ? '已复制 ✓' : '复制结果'}
        </button>
      )}

      {/* Examples */}
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">使用场景：</h3>
        <ul className="text-sm space-y-1 list-disc list-inside">
          <li>清理重复的邮箱地址、用户名</li>
          <li>去除日志文件中的重复记录</li>
          <li>整理关键词列表</li>
          <li>清理数据导入文件</li>
        </ul>
      </div>
    </div>
  );
}
