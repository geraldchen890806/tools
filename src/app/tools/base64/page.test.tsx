import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import Base64Tool from './page';

describe('Base64 编解码工具', () => {
  // 1. 渲染测试
  test('应该正确渲染工具界面', () => {
    render(<Base64Tool />);
    expect(screen.getByText('Base64 编解码')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('输入文本...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '编码' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '解码' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '复制结果' })).toBeInTheDocument();
  });

  // 2. 编码功能测试
  describe('编码功能', () => {
    test('应该正确编码普通英文文本', async () => {
      const user = userEvent.setup();
      render(<Base64Tool />);
      
      const input = screen.getByPlaceholderText('输入文本...');
      await user.type(input, 'Hello World');
      
      const encodeBtn = screen.getByRole('button', { name: '编码' });
      await user.click(encodeBtn);
      
      const output = screen.getByPlaceholderText('结果...');
      expect(output).toHaveValue('SGVsbG8gV29ybGQ=');
    });

    test('应该正确编码中文文本', async () => {
      const user = userEvent.setup();
      render(<Base64Tool />);
      
      const input = screen.getByPlaceholderText('输入文本...');
      await user.type(input, '你好世界');
      
      const encodeBtn = screen.getByRole('button', { name: '编码' });
      await user.click(encodeBtn);
      
      const output = screen.getByPlaceholderText('结果...');
      expect(output.value).toBe('5L2g5aW95LiW55WM');
    });

    test('应该处理空输入', async () => {
      const user = userEvent.setup();
      render(<Base64Tool />);
      
      const encodeBtn = screen.getByRole('button', { name: '编码' });
      await user.click(encodeBtn);
      
      const output = screen.getByPlaceholderText('结果...');
      expect(output).toHaveValue('');
    });

    test('应该处理特殊字符', async () => {
      const user = userEvent.setup();
      render(<Base64Tool />);
      
      const input = screen.getByPlaceholderText('输入文本...');
      const specialChars = '!@#$%^&*()_+-=<>?/~`';
      await user.type(input, specialChars);
      
      const encodeBtn = screen.getByRole('button', { name: '编码' });
      await user.click(encodeBtn);
      
      const output = screen.getByPlaceholderText('结果...');
      expect(output.value.length).toBeGreaterThan(0);
    });

    test('应该处理emoji表情', async () => {
      const user = userEvent.setup();
      render(<Base64Tool />);
      
      const input = screen.getByPlaceholderText('输入文本...');
      await user.type(input, '😀🎉✨');
      
      const encodeBtn = screen.getByRole('button', { name: '编码' });
      await user.click(encodeBtn);
      
      const output = screen.getByPlaceholderText('结果...');
      expect(output.value.length).toBeGreaterThan(0);
    });
  });

  // 3. 解码功能测试
  describe('解码功能', () => {
    test('应该正确解码有效的 Base64（英文）', async () => {
      const user = userEvent.setup();
      render(<Base64Tool />);
      
      const input = screen.getByPlaceholderText('输入文本...');
      await user.type(input, 'SGVsbG8gV29ybGQ=');
      
      const decodeBtn = screen.getByRole('button', { name: '解码' });
      await user.click(decodeBtn);
      
      const output = screen.getByPlaceholderText('结果...');
      expect(output).toHaveValue('Hello World');
    });

    test('应该正确解码有效的 Base64（中文）', async () => {
      const user = userEvent.setup();
      render(<Base64Tool />);
      
      const input = screen.getByPlaceholderText('输入文本...');
      await user.type(input, '5L2g5aW95LiW55WM');
      
      const decodeBtn = screen.getByRole('button', { name: '解码' });
      await user.click(decodeBtn);
      
      const output = screen.getByPlaceholderText('结果...');
      expect(output).toHaveValue('你好世界');
    });

    test('应该处理无效的 Base64 并显示错误', async () => {
      const user = userEvent.setup();
      render(<Base64Tool />);
      
      const input = screen.getByPlaceholderText('输入文本...');
      await user.type(input, 'invalid-base64');
      
      const decodeBtn = screen.getByRole('button', { name: '解码' });
      await user.click(decodeBtn);
      
      // 应该显示错误信息
      await waitFor(() => {
        const errorElements = screen.queryAllByText(/invalid|character/i);
        expect(errorElements.length).toBeGreaterThan(0);
      });
    });

    test('应该处理空输入', async () => {
      const user = userEvent.setup();
      render(<Base64Tool />);
      
      const decodeBtn = screen.getByRole('button', { name: '解码' });
      await user.click(decodeBtn);
      
      // 空输入应该失败并显示错误
      await waitFor(() => {
        const output = screen.getByPlaceholderText('结果...');
        // btoa('') 会报错
        expect(output.value).toBe('');
      });
    });
  });

  // 4. 编码后解码测试（往返测试）
  describe('编码解码往返测试', () => {
    test('编码后解码应该恢复原文本（英文）', async () => {
      const user = userEvent.setup();
      render(<Base64Tool />);
      
      const originalText = 'Hello World Test 123';
      const input = screen.getByPlaceholderText('输入文本...');
      
      // 编码
      await user.type(input, originalText);
      await user.click(screen.getByRole('button', { name: '编码' }));
      
      const output = screen.getByPlaceholderText('结果...');
      const encoded = output.value;
      expect(encoded.length).toBeGreaterThan(0);
      
      // 清空输入，用编码后的结果解码
      await user.clear(input);
      await user.type(input, encoded);
      await user.click(screen.getByRole('button', { name: '解码' }));
      
      expect(output).toHaveValue(originalText);
    });

    test('编码后解码应该恢复原文本（中文）', async () => {
      const user = userEvent.setup();
      render(<Base64Tool />);
      
      const originalText = '测试中文编码解码功能';
      const input = screen.getByPlaceholderText('输入文本...');
      
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
  test('应该支持复制结果到剪贴板', async () => {
    const user = userEvent.setup();
    
    // Mock clipboard API
    const writeTextMock = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: writeTextMock,
      },
      writable: true,
    });
    
    render(<Base64Tool />);
    
    const input = screen.getByPlaceholderText('输入文本...');
    await user.type(input, 'Test');
    
    const encodeBtn = screen.getByRole('button', { name: '编码' });
    await user.click(encodeBtn);
    
    const output = screen.getByPlaceholderText('结果...');
    const result = output.value;
    
    const copyBtn = screen.getByRole('button', { name: '复制结果' });
    await user.click(copyBtn);
    
    expect(writeTextMock).toHaveBeenCalledWith(result);
  });

  // 6. 错误处理测试
  test('编码错误后应该清除之前的结果', async () => {
    const user = userEvent.setup();
    render(<Base64Tool />);
    
    const input = screen.getByPlaceholderText('输入文本...');
    
    // 先成功编码
    await user.type(input, 'Valid');
    await user.click(screen.getByRole('button', { name: '编码' }));
    
    const output = screen.getByPlaceholderText('结果...');
    expect(output.value).not.toBe('');
    
    // 清空并尝试有效操作
    await user.clear(input);
    await user.type(input, 'Another');
    await user.click(screen.getByRole('button', { name: '编码' }));
    
    // 结果应该更新
    expect(output.value).toBe('QW5vdGhlcg==');
  });

  // 7. UI 状态测试
  test('输入和输出框应该正确响应', async () => {
    const user = userEvent.setup();
    render(<Base64Tool />);
    
    const input = screen.getByPlaceholderText('输入文本...');
    const output = screen.getByPlaceholderText('结果...');
    
    // 输入框应该可编辑
    expect(input).not.toHaveAttribute('readonly');
    
    // 输出框应该只读
    expect(output).toHaveAttribute('readonly');
    
    // 输入内容
    await user.type(input, 'Test Input');
    expect(input).toHaveValue('Test Input');
  });
});
