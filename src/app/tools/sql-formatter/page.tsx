'use client';

import { useState } from 'react';
import { ToolLayout } from "@/components/ToolLayout";
import { useTranslation } from "@/i18n";
import { format } from 'sql-formatter';

export default function SqlFormatter() {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState<'sql' | 'mysql' | 'postgresql' | 'sqlite'>('sql');
  const [indentSize, setIndentSize] = useState('2');
  const [uppercase, setUppercase] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleFormat = () => {
    setError('');
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      const formatted = format(input, {
        language,
        tabWidth: parseInt(indentSize),
        keywordCase: uppercase ? 'upper' : 'lower',
      });
      setOutput(formatted);
    } catch (err) {
      setError('SQL 格式化失败，请检查语法');
      setOutput('');
    }
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
    setError('');
  };

  const handleCompress = () => {
    if (!input.trim()) return;
    const compressed = input.replace(/\s+/g, ' ').trim();
    setOutput(compressed);
  };

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <h1 className="text-3xl font-bold mb-6">SQL 格式化工具</h1>

      {/* Options */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <h3 className="font-semibold mb-3">选项</h3>
        
        {/* Language */}
        <div className="mb-3">
          <label className="block mb-2 text-sm font-medium">SQL 方言</label>
          <div className="flex gap-2">
            {(['sql', 'mysql', 'postgresql', 'sqlite'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-3 py-1 rounded text-sm ${
                  language === lang
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Indent */}
        <div className="mb-3">
          <label className="block mb-2 text-sm font-medium">缩进空格数</label>
          <input
            type="number"
            value={indentSize}
            onChange={(e) => setIndentSize(e.target.value)}
            min="2"
            max="8"
            className="w-24 p-2 border rounded"
          />
        </div>

        {/* Uppercase */}
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">关键字大写</span>
          </label>
        </div>
      </div>

      {/* Input */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold">输入 SQL</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入要格式化的 SQL 语句..."
          className="w-full h-64 p-3 border rounded font-mono text-sm"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={handleFormat}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          格式化
        </button>
        <button
          onClick={handleCompress}
          className="px-6 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          压缩
        </button>
        <button
          onClick={handleClear}
          className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          清空
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Output */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold">输出</label>
        <textarea
          value={output}
          readOnly
          placeholder="格式化结果将显示在这里..."
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
        <h3 className="font-semibold mb-2">示例：</h3>
        <div className="text-sm space-y-2">
          <div>
            <strong>格式化前：</strong>
            <code className="block bg-white p-2 rounded mt-1 text-xs">
              SELECT id,name,email FROM users WHERE age &gt; 18 AND status = &apos;active&apos; ORDER BY created_at DESC
            </code>
          </div>
          <div>
            <strong>格式化后：</strong>
            <pre className="bg-white p-2 rounded mt-1 text-xs">
{`SELECT
  id,
  name,
  email
FROM
  users
WHERE
  age > 18
  AND status = 'active'
ORDER BY
  created_at DESC`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
