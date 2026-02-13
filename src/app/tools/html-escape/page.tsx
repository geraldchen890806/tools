'use client';

import { useState } from 'react';

export default function HtmlEscape() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);

  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
  };

  const escapeHtml = (text: string): string => {
    return text.replace(/[&<>"'\/]/g, (char) => htmlEntities[char] || char);
  };

  const unescapeHtml = (text: string): string => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  };

  const handleConvert = () => {
    if (mode === 'encode') {
      setOutput(escapeHtml(input));
    } else {
      setOutput(unescapeHtml(input));
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
  };

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <h1 className="text-3xl font-bold mb-6">HTML 转义工具</h1>

      {/* Mode Toggle */}
      <div className="mb-4 flex gap-4">
        <button
          onClick={() => setMode('encode')}
          className={`px-4 py-2 rounded ${
            mode === 'encode'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          转义 (Encode)
        </button>
        <button
          onClick={() => setMode('decode')}
          className={`px-4 py-2 rounded ${
            mode === 'decode'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          反转义 (Decode)
        </button>
      </div>

      {/* Input */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold">输入</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            mode === 'encode'
              ? '输入要转义的 HTML 代码...'
              : '输入要反转义的文本...'
          }
          className="w-full h-40 p-3 border rounded font-mono text-sm"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={handleConvert}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          转换
        </button>
        <button
          onClick={handleClear}
          className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          清空
        </button>
      </div>

      {/* Output */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold">输出</label>
        <textarea
          value={output}
          readOnly
          placeholder="转换结果将显示在这里..."
          className="w-full h-40 p-3 border rounded font-mono text-sm bg-gray-50"
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
            <strong>转义前：</strong>
            <code className="block bg-white p-2 rounded mt-1">
              {'<div class="container">Hello & goodbye</div>'}
            </code>
          </div>
          <div>
            <strong>转义后：</strong>
            <code className="block bg-white p-2 rounded mt-1">
              {'&lt;div class=&quot;container&quot;&gt;Hello &amp; goodbye&lt;/div&gt;'}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
