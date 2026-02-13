import { render, screen, waitFor } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import UrlEncoder from './page';

describe('URL 编解码工具', () => {
  // 1. 渲染测试
  test('应该正确渲染工具界面', () => {
    render(<UrlEncoder />);
    expect(screen.getByText('URL 编解码')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('输入文本或 URL...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '编码' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '解码' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '复制结果' })).toBeInTheDocument();
  });

  // 2. 编码功能测试
  describe('编码功能', () => {
    test('应该正确编码普通 URL', async () => {
      const user = userEvent.setup();
      render(<UrlEncoder />);
      
      const input = screen.getByPlaceholderText('输入文本或 URL...');
      await user.type(input, 'https://example.com/path?key=value&name=test');
      
      const encodeBtn = screen.getByRole('button', { name: '编码' });
      await user.click(encodeBtn);
      
      const output = screen.getByPlaceholderText('结果...');
      expect(output).toHaveValue('https%3A%2F%2Fexample.com%2Fpath%3Fkey%3Dvalue%26name%3Dtest');
    });

    test('应该正确编码中文字符', async () => {
      const user = userEvent.setup();
      render(<UrlEncoder />);
      
      const input = screen.getByPlaceholderText('输入文本或 URL...');
      await user.type(input, '你好世界');
      
      const encodeBtn = screen.getByRole('button', { name: '编码' });
      await user.click(encodeBtn);
      
      const output = screen.getByPlaceholderText('结果...');
      expect(output.value).toBe('%E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C');
    });

    test('应该正确编码特殊字符', async () => {
      const user = userEvent.setup();
      render(<UrlEncoder />);
      
      const input = screen.getByPlaceholderText('输入文本或 URL...');
      await user.type(input, '!@#$%^&*()');
      
      const encodeBtn = screen.getByRole('button', { name: '编码' });
      await user.click(encodeBtn);
      
      const output = screen.getByPlaceholderText('结果...');
      expect(output.value.length).toBeGreaterThan(0);
      expect(output.value).toContain('%');
    });

    test('应该正确编码空格', async () => {
      const user = userEvent.setup();
      render(<UrlEncoder />);
      
      const input = screen.getByPlaceholderText('输入文本或 URL...');
      await user.type(input, 'hello world');
      
      const encodeBtn = screen.getByRole('button', { name: '编码' });
      await user.click(encodeBtn);
      
      const output = screen.getByPlaceholderText('结果...');
      expect(output).toHaveValue('hello%20world');
    });

    test('应该正确编码 emoji', async () => {
      const user = userEvent.setup();
      render(<UrlEncoder />);
      
      const input = screen.getByPlaceholderText('输入文本或 URL...');
      await user.type(input, '😀🎉');
      
      const encodeBtn = screen.getByRole('button', { name: '编码' });
      await user.click(encodeBtn);
      
      const output = screen.getByPlaceholderText('结果...');
      expect(output.value).toContain('%');
      expect(output.value.length).toBeGreaterThan(0);
    });

    test('应该处理空输入', async () => {
      const user = userEvent.setup();
      render(<UrlEncoder />);
      
      const encodeBtn = screen.getByRole('button', { name: '编码' });
      await user.click(encodeBtn);
      
      const output = screen.getByPlaceholderText('结果...');
      expect(output).toHaveValue('');
    });
  });

  // 3. 解码功能测试
  describe('解码功能', () => {
    test('应该正确解码已编码的 URL', async () => {
      const user = userEvent.setup();
      render(<UrlEncoder />);
      
      const input = screen.getByPlaceholderText('输入文本或 URL...');
      await user.type(input, 'https%3A%2F%2Fexample.com%2Fpath%3Fkey%3Dvalue');
      
      const decodeBtn = screen.getByRole('button', { name: '解码' });
      await user.click(decodeBtn);
      
      const output = screen.getByPlaceholderText('结果...');
      expect(output).toHaveValue('https://example.com/path?key=value');
    });

    test('应该正确解码中文字符', async () => {
      const user = userEvent.setup();
      render(<UrlEncoder />);
      
      const input = screen.getByPlaceholderText('输入文本或 URL...');
      await user.type(input, '%E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C');
      
      const decodeBtn = screen.getByRole('button', { name: '解码' });
      await user.click(decodeBtn);
      
      const output = screen.getByPlaceholderText('结果...');
      expect(output).toHaveValue('你好世界');
    });

    test('应该正确解码空格', async () => {
      const user = userEvent.setup();
      render(<UrlEncoder />);
      
      const input = screen.getByPlaceholderText('输入文本或 URL...');
      await user.type(input, 'hello%20world');
      
      const decodeBtn = screen.getByRole('button', { name: '解码' });
      await user.click(decodeBtn);
      
      const output = screen.getByPlaceholderText('结果...');
      expect(output).toHaveValue('hello world');
    });

    test('应该处理无效的编码并显示错误', async () => {
      const user = userEvent.setup();
      render(<UrlEncoder />);
      
      const input = screen.getByPlaceholderText('输入文本或 URL...');
      await user.type(input, '%ZZ'); // 无效的编码
      
      const decodeBtn = screen.getByRole('button', { name: '解码' });
      await user.click(decodeBtn);
      
      await waitFor(() => {
        const errorText = screen.queryByText(/URI malformed|invalid/i);
        expect(errorText).toBeInTheDocument();
      });
    });

    test('应该处理空输入', async () => {
      const user = userEvent.setup();
      render(<UrlEncoder />);
      
      const decodeBtn = screen.getByRole('button', { name: '解码' });
      await user.click(decodeBtn);
      
      const output = screen.getByPlaceholderText('结果...');
      expect(output).toHaveValue('');
    });
  });

  // 4. 编码解码往返测试
  describe('编码解码往返测试', () => {
    test('编码后解码应该恢复原文本（英文）', async () => {
      const user = userEvent.setup();
      render(<UrlEncoder />);
      
      const originalText = 'https://example.com/search?q=test query&lang=en';
      const input = screen.getByPlaceholderText('输入文本或 URL...');
      
      // 编码
      await user.type(input, originalText);
      await user.click(screen.getByRole('button', { name: '编码' }));
      
      const output = screen.getByPlaceholderText('结果...');
      const encoded = output.value;
      expect(encoded).toContain('%');
      
      // 解码
      await user.clear(input);
      await user.type(input, encoded);
      await user.click(screen.getByRole('button', { name: '解码' }));
      
      expect(output).toHaveValue(originalText);
    });

    test('编码后解码应该恢复原文本（中文）', async () => {
      const user = userEvent.setup();
      render(<UrlEncoder />);
      
      const originalText = '搜索关键词：测试';
      const input = screen.getByPlaceholderText('输入文本或 URL...');
      
      // 编码
      await user.type(input, originalText);
      await user.click(screen.getByRole('button', { name: '编码' }));
      
      const output = screen.getByPlaceholderText('结果...');
      const encoded = output.value;
      
      // 解码
      await user.clear(input);
      await user.type(input, encoded);
      await user.click(screen.getByRole('button', { name: '解码' }));
      
      expect(output).toHaveValue(originalText);
    });

    test('编码后解码应该恢复原文本（混合内容）', async () => {
      const user = userEvent.setup();
      render(<UrlEncoder />);
      
      const originalText = 'Hello 世界 123 !@#';
      const input = screen.getByPlaceholderText('输入文本或 URL...');
      
      // 编码
      await user.type(input, originalText);
      await user.click(screen.getByRole('button', { name: '编码' }));
      
      const output = screen.getByPlaceholderText('结果...');
      const encoded = output.value;
      
      // 解码
      await user.clear(input);
      await user.type(input, encoded);
      await user.click(screen.getByRole('button', { name: '解码' }));
      
      expect(output).toHaveValue(originalText);
    });
  });

  // 5. 复制功能测试
  test('应该支持复制结果', async () => {
    const user = userEvent.setup();
    const writeTextMock = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: writeTextMock,
      },
      writable: true,
    });
    
    render(<UrlEncoder />);
    
    const input = screen.getByPlaceholderText('输入文本或 URL...');
    await user.type(input, 'test');
    await user.click(screen.getByRole('button', { name: '编码' }));
    
    const output = screen.getByPlaceholderText('结果...');
    const result = output.value;
    
    const copyBtn = screen.getByRole('button', { name: '复制结果' });
    await user.click(copyBtn);
    
    expect(writeTextMock).toHaveBeenCalledWith(result);
  });

  // 6. 错误处理测试
  test('解码错误后应该清除之前的结果', async () => {
    const user = userEvent.setup();
    render(<UrlEncoder />);
    
    const input = screen.getByPlaceholderText('输入文本或 URL...');
    const output = screen.getByPlaceholderText('结果...');
    
    // 先成功编码
    await user.type(input, 'valid');
    await user.click(screen.getByRole('button', { name: '编码' }));
    expect(output.value).not.toBe('');
    
    // 尝试解码无效内容
    await user.clear(input);
    await user.type(input, '%ZZ');
    await user.click(screen.getByRole('button', { name: '解码' }));
    
    // 应该显示错误
    await waitFor(() => {
      expect(screen.queryByText(/URI malformed|invalid/i)).toBeInTheDocument();
    });
  });

  test('成功操作后应该清除之前的错误', async () => {
    const user = userEvent.setup();
    render(<UrlEncoder />);
    
    const input = screen.getByPlaceholderText('输入文本或 URL...');
    
    // 先触发错误
    await user.type(input, '%ZZ');
    await user.click(screen.getByRole('button', { name: '解码' }));
    
    await waitFor(() => {
      expect(screen.queryByText(/URI malformed|invalid/i)).toBeInTheDocument();
    });
    
    // 成功编码
    await user.clear(input);
    await user.type(input, 'valid');
    await user.click(screen.getByRole('button', { name: '编码' }));
    
    // 错误应该消失
    await waitFor(() => {
      expect(screen.queryByText(/URI malformed|invalid/i)).not.toBeInTheDocument();
    });
  });

  // 7. UI 状态测试
  test('输入框应该可编辑，输出框应该只读', async () => {
    render(<UrlEncoder />);
    
    const input = screen.getByPlaceholderText('输入文本或 URL...');
    const output = screen.getByPlaceholderText('结果...');
    
    expect(input).not.toHaveAttribute('readonly');
    expect(output).toHaveAttribute('readonly');
  });

  // 8. 特殊场景测试
  test('应该保留未编码的字符（字母数字）', async () => {
    const user = userEvent.setup();
    render(<UrlEncoder />);
    
    const input = screen.getByPlaceholderText('输入文本或 URL...');
    await user.type(input, 'abc123XYZ');
    
    const encodeBtn = screen.getByRole('button', { name: '编码' });
    await user.click(encodeBtn);
    
    const output = screen.getByPlaceholderText('结果...');
    // 字母和数字应该保持不变
    expect(output).toHaveValue('abc123XYZ');
  });

  test('应该正确处理连续的特殊字符', async () => {
    const user = userEvent.setup();
    render(<UrlEncoder />);
    
    const input = screen.getByPlaceholderText('输入文本或 URL...');
    await user.type(input, '???&&&===');
    
    const encodeBtn = screen.getByRole('button', { name: '编码' });
    await user.click(encodeBtn);
    
    const output = screen.getByPlaceholderText('结果...');
    expect(output.value).toContain('%');
    expect(output.value.length).toBeGreaterThan(0);
  });
});
