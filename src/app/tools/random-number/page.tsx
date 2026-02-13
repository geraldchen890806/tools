'use client';

import { useState } from 'react';

export default function RandomNumber() {
  const [min, setMin] = useState('1');
  const [max, setMax] = useState('100');
  const [count, setCount] = useState('1');
  const [unique, setUnique] = useState(false);
  const [results, setResults] = useState<number[]>([]);
  const [error, setError] = useState('');

  const generateRandom = () => {
    setError('');
    const minNum = parseInt(min);
    const maxNum = parseInt(max);
    const countNum = parseInt(count);

    // Validation
    if (isNaN(minNum) || isNaN(maxNum) || isNaN(countNum)) {
      setError('请输入有效的数字');
      return;
    }

    if (minNum >= maxNum) {
      setError('最小值必须小于最大值');
      return;
    }

    if (countNum < 1 || countNum > 1000) {
      setError('生成数量必须在 1-1000 之间');
      return;
    }

    if (unique && countNum > maxNum - minNum + 1) {
      setError('不重复模式下，数量不能超过范围大小');
      return;
    }

    // Generate
    const numbers: number[] = [];
    if (unique) {
      // Generate unique numbers
      const available = Array.from(
        { length: maxNum - minNum + 1 },
        (_, i) => minNum + i
      );
      for (let i = 0; i < countNum; i++) {
        const idx = Math.floor(Math.random() * available.length);
        numbers.push(available[idx]);
        available.splice(idx, 1);
      }
    } else {
      // Generate random numbers (can repeat)
      for (let i = 0; i < countNum; i++) {
        numbers.push(Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum);
      }
    }

    setResults(numbers);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(results.join(', '));
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <h1 className="text-3xl font-bold mb-6">随机数生成器</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        {/* Min/Max */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-2 font-semibold">最小值</label>
            <input
              type="number"
              value={min}
              onChange={(e) => setMin(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">最大值</label>
            <input
              type="number"
              value={max}
              onChange={(e) => setMax(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {/* Count */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold">生成数量</label>
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            min="1"
            max="1000"
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Unique checkbox */}
        <div className="mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={unique}
              onChange={(e) => setUnique(e.target.checked)}
              className="w-4 h-4"
            />
            <span>不重复（生成唯一数字）</span>
          </label>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={generateRandom}
          className="w-full px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-semibold"
        >
          生成随机数
        </button>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">结果</h2>
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              复制
            </button>
          </div>

          <div className="p-4 bg-gray-50 rounded border">
            {results.length === 1 ? (
              <div className="text-6xl font-bold text-blue-500 text-center py-8">
                {results[0]}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {results.map((num, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded font-mono"
                  >
                    {num}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 text-sm text-gray-600">
            <p>总计: {results.length} 个数字</p>
            <p>范围: {Math.min(...results)} - {Math.max(...results)}</p>
            {results.length > 1 && (
              <p>
                平均值:{' '}
                {(results.reduce((a, b) => a + b, 0) / results.length).toFixed(2)}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Examples */}
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">使用场景：</h3>
        <ul className="text-sm space-y-1 list-disc list-inside">
          <li>抽奖：生成 1-100 之间不重复的号码</li>
          <li>骰子：生成 1-6 的随机数</li>
          <li>密码：生成多个随机数字组合</li>
          <li>测试数据：批量生成测试用数字</li>
        </ul>
      </div>
    </div>
  );
}
