'use client';

import { useState } from 'react';
import OpenCC from 'opencc-js';

export default function ChineseConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'s2t' | 't2s' | 's2tw' | 's2hk'>('s2t');
  const [copied, setCopied] = useState(false);

  const modeLabels = {
    s2t: '简体 → 繁体',
    t2s: '繁体 → 简体',
    s2tw: '简体 → 台湾繁体',
    s2hk: '简体 → 香港繁体',
  };

  const handleConvert = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    const converter = OpenCC.Converter({ from: mode.split('2')[0], to: mode.split('2')[1] });
    const result = converter(input);
    setOutput(result);
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
      <h1 className="text-3xl font-bold mb-6">繁简转换工具</h1>

      {/* Mode Selection */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold">转换模式</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {(Object.keys(modeLabels) as Array<keyof typeof modeLabels>).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-2 rounded ${
                mode === m
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {modeLabels[m]}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold">输入</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入要转换的中文文本..."
          className="w-full h-48 p-3 border rounded text-base"
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
          className="w-full h-48 p-3 border rounded text-base bg-gray-50"
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
            <strong>简体：</strong>
            <span className="ml-2">中国文化博大精深</span>
          </div>
          <div>
            <strong>繁体：</strong>
            <span className="ml-2">中國文化博大精深</span>
          </div>
          <div>
            <strong>台湾繁体：</strong>
            <span className="ml-2">中國文化博大精深</span>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <p>💡 提示：</p>
          <ul className="list-disc list-inside space-y-1">
            <li>台湾繁体和香港繁体会根据当地用词习惯进行转换</li>
            <li>支持批量文本转换</li>
            <li>自动识别并保留标点符号、数字等</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
