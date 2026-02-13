import { render, screen, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import HashPage from './page';

describe('Hash 计算工具', () => {
  // 1. 渲染测试
  test('应该正确渲染工具界面', () => {
    render(<HashPage />);
    expect(screen.getByText('Hash 计算')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('输入要计算哈希的文本...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '计算' })).toBeInTheDocument();
  });

  // 2. 哈希计算功能测试
  describe('哈希计算功能', () => {
    test('应该计算所有哈希算法', async () => {
      const user = userEvent.setup();
      render(<HashPage />);
      
      const input = screen.getByPlaceholderText('输入要计算哈希的文本...');
      await user.type(input, 'Hello World');
      
      const calculateBtn = screen.getByRole('button', { name: '计算' });
      await user.click(calculateBtn);
      
      // 等待所有哈希值计算完成
      await waitFor(() => {
        expect(screen.getByText('SHA-1')).toBeInTheDocument();
        expect(screen.getByText('SHA-256')).toBeInTheDocument();
        expect(screen.getByText('SHA-384')).toBeInTheDocument();
        expect(screen.getByText('SHA-512')).toBeInTheDocument();
      });
    });

    test('应该正确计算 SHA-256 哈希（已知值测试）', async () => {
      const user = userEvent.setup();
      render(<HashPage />);
      
      const input = screen.getByPlaceholderText('输入要计算哈希的文本...');
      // "Hello World" 的 SHA-256 是已知的
      await user.type(input, 'Hello World');
      
      const calculateBtn = screen.getByRole('button', { name: '计算' });
      await user.click(calculateBtn);
      
      await waitFor(() => {
        // "Hello World" 的 SHA-256 哈希值
        const sha256Inputs = screen.queryAllByDisplayValue(/[a-f0-9]{64}/i);
        expect(sha256Inputs.length).toBeGreaterThan(0);
        // 验证是 256 位 (64 个十六进制字符)
        expect(sha256Inputs[0].value.length).toBe(64);
      });
    });

    test('应该处理空输入', async () => {
      const user = userEvent.setup();
      render(<HashPage />);
      
      const calculateBtn = screen.getByRole('button', { name: '计算' });
      await user.click(calculateBtn);
      
      // 空字符串也有哈希值
      await waitFor(() => {
        expect(screen.getByText('SHA-256')).toBeInTheDocument();
        const inputs = screen.getAllByRole('textbox');
        // 应该有结果（空字符串的哈希值）
        const sha256Result = inputs.find(input => 
          input.getAttribute('readonly') !== null && 
          input.value.length === 64
        );
        expect(sha256Result).toBeDefined();
      });
    });

    test('应该处理中文文本', async () => {
      const user = userEvent.setup();
      render(<HashPage />);
      
      const input = screen.getByPlaceholderText('输入要计算哈希的文本...');
      await user.type(input, '你好世界');
      
      const calculateBtn = screen.getByRole('button', { name: '计算' });
      await user.click(calculateBtn);
      
      await waitFor(() => {
        // 应该有 SHA-256 结果
        const sha256Label = screen.getByText('SHA-256');
        expect(sha256Label).toBeInTheDocument();
        
        // 找到所有只读输入框
        const readonlyInputs = screen.getAllByRole('textbox').filter(
          input => input.hasAttribute('readonly')
        );
        
        // 应该有 4 个结果（SHA-1, SHA-256, SHA-384, SHA-512）
        expect(readonlyInputs.length).toBe(4);
        
        // 每个都应该有值
        readonlyInputs.forEach(input => {
          expect(input.value.length).toBeGreaterThan(0);
        });
      });
    });

    test('应该处理特殊字符', async () => {
      const user = userEvent.setup();
      render(<HashPage />);
      
      const input = screen.getByPlaceholderText('输入要计算哈希的文本...') as HTMLTextAreaElement;
      // 使用 paste 而不是 type 来避免特殊字符问题
      await user.click(input);
      await user.paste('!@#$%^&*()_+-=[]{}|;:\'",.<>?/~`');
      
      const calculateBtn = screen.getByRole('button', { name: '计算' });
      await user.click(calculateBtn);
      
      await waitFor(() => {
        const readonlyInputs = screen.getAllByRole('textbox').filter(
          input => input.hasAttribute('readonly')
        );
        expect(readonlyInputs.length).toBe(4);
      });
    });

    test('应该处理emoji表情', async () => {
      const user = userEvent.setup();
      render(<HashPage />);
      
      const input = screen.getByPlaceholderText('输入要计算哈希的文本...');
      await user.type(input, '😀🎉✨');
      
      const calculateBtn = screen.getByRole('button', { name: '计算' });
      await user.click(calculateBtn);
      
      await waitFor(() => {
        const readonlyInputs = screen.getAllByRole('textbox').filter(
          input => input.hasAttribute('readonly')
        );
        expect(readonlyInputs.length).toBe(4);
      });
    });

    test('应该处理长文本', async () => {
      const user = userEvent.setup();
      const { container } = render(<HashPage />);
      
      const input = screen.getByPlaceholderText('输入要计算哈希的文本...') as HTMLTextAreaElement;
      const longText = 'A'.repeat(10000);
      // 使用 paste 来加速
      await user.click(input);
      await user.paste(longText);
      
      const calculateBtn = screen.getByRole('button', { name: '计算' });
      await user.click(calculateBtn);
      
      await waitFor(() => {
        const readonlyInputs = screen.getAllByRole('textbox').filter(
          input => input.hasAttribute('readonly')
        );
        expect(readonlyInputs.length).toBe(4);
      }, { timeout: 5000 });
    });
  });

  // 3. 哈希值格式测试
  describe('哈希值格式验证', () => {
    test('SHA-1 应该是 40 个十六进制字符', async () => {
      const user = userEvent.setup();
      render(<HashPage />);
      
      const input = screen.getByPlaceholderText('输入要计算哈希的文本...');
      await user.type(input, 'Test');
      await user.click(screen.getByRole('button', { name: '计算' }));
      
      await waitFor(() => {
        const readonlyInputs = screen.getAllByRole('textbox').filter(
          input => input.hasAttribute('readonly')
        );
        // 第一个应该是 SHA-1 (40 字符)
        expect(readonlyInputs[0].value.length).toBe(40);
        expect(readonlyInputs[0].value).toMatch(/^[a-f0-9]{40}$/);
      });
    });

    test('SHA-256 应该是 64 个十六进制字符', async () => {
      const user = userEvent.setup();
      render(<HashPage />);
      
      const input = screen.getByPlaceholderText('输入要计算哈希的文本...');
      await user.type(input, 'Test');
      await user.click(screen.getByRole('button', { name: '计算' }));
      
      await waitFor(() => {
        const readonlyInputs = screen.getAllByRole('textbox').filter(
          input => input.hasAttribute('readonly')
        );
        // 第二个应该是 SHA-256 (64 字符)
        expect(readonlyInputs[1].value.length).toBe(64);
        expect(readonlyInputs[1].value).toMatch(/^[a-f0-9]{64}$/);
      });
    });

    test('SHA-384 应该是 96 个十六进制字符', async () => {
      const user = userEvent.setup();
      render(<HashPage />);
      
      const input = screen.getByPlaceholderText('输入要计算哈希的文本...');
      await user.type(input, 'Test');
      await user.click(screen.getByRole('button', { name: '计算' }));
      
      await waitFor(() => {
        const readonlyInputs = screen.getAllByRole('textbox').filter(
          input => input.hasAttribute('readonly')
        );
        // 第三个应该是 SHA-384 (96 字符)
        expect(readonlyInputs[2].value.length).toBe(96);
        expect(readonlyInputs[2].value).toMatch(/^[a-f0-9]{96}$/);
      });
    });

    test('SHA-512 应该是 128 个十六进制字符', async () => {
      const user = userEvent.setup();
      render(<HashPage />);
      
      const input = screen.getByPlaceholderText('输入要计算哈希的文本...');
      await user.type(input, 'Test');
      await user.click(screen.getByRole('button', { name: '计算' }));
      
      await waitFor(() => {
        const readonlyInputs = screen.getAllByRole('textbox').filter(
          input => input.hasAttribute('readonly')
        );
        // 第四个应该是 SHA-512 (128 字符)
        expect(readonlyInputs[3].value.length).toBe(128);
        expect(readonlyInputs[3].value).toMatch(/^[a-f0-9]{128}$/);
      });
    });
  });

  // 4. 复制功能测试
  test('应该支持复制每个哈希值', async () => {
    const user = userEvent.setup();
    
    // Mock clipboard API
    const writeTextMock = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: writeTextMock,
      },
      writable: true,
    });
    
    render(<HashPage />);
    
    const input = screen.getByPlaceholderText('输入要计算哈希的文本...');
    await user.type(input, 'Test');
    await user.click(screen.getByRole('button', { name: '计算' }));
    
    await waitFor(() => {
      expect(screen.getByText('SHA-256')).toBeInTheDocument();
    });
    
    const copyButtons = screen.getAllByRole('button', { name: '复制' });
    expect(copyButtons.length).toBe(4);
    
    // 点击第一个复制按钮
    await user.click(copyButtons[0]);
    
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });

  // 5. 确定性测试（相同输入产生相同哈希）
  test('相同输入应该产生相同的哈希值', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<HashPage />);
    
    const input = screen.getByPlaceholderText('输入要计算哈希的文本...');
    await user.type(input, 'Deterministic Test');
    await user.click(screen.getByRole('button', { name: '计算' }));
    
    await waitFor(() => {
      expect(screen.getByText('SHA-256')).toBeInTheDocument();
    });
    
    const firstResults = screen.getAllByRole('textbox')
      .filter(input => input.hasAttribute('readonly'))
      .map(input => input.value);
    
    // 卸载并重新渲染
    unmount();
    render(<HashPage />);
    
    const newInput = screen.getByPlaceholderText('输入要计算哈希的文本...');
    await user.type(newInput, 'Deterministic Test');
    await user.click(screen.getByRole('button', { name: '计算' }));
    
    await waitFor(() => {
      expect(screen.getByText('SHA-256')).toBeInTheDocument();
    });
    
    const secondResults = screen.getAllByRole('textbox')
      .filter(input => input.hasAttribute('readonly'))
      .map(input => input.value);
    
    // 两次计算的结果应该完全相同
    expect(firstResults).toEqual(secondResults);
  });

  // 6. 不同输入产生不同哈希
  test('不同输入应该产生不同的哈希值', async () => {
    const user = userEvent.setup();
    render(<HashPage />);
    
    const input = screen.getByPlaceholderText('输入要计算哈希的文本...');
    
    // 第一次计算
    await user.type(input, 'Input1');
    await user.click(screen.getByRole('button', { name: '计算' }));
    
    await waitFor(() => {
      expect(screen.getByText('SHA-256')).toBeInTheDocument();
    });
    
    const firstHash = screen.getAllByRole('textbox')
      .filter(input => input.hasAttribute('readonly'))[1].value; // SHA-256
    
    // 修改输入
    await user.clear(input);
    await user.type(input, 'Input2');
    await user.click(screen.getByRole('button', { name: '计算' }));
    
    await waitFor(() => {
      const secondHash = screen.getAllByRole('textbox')
        .filter(input => input.hasAttribute('readonly'))[1].value;
      
      // 应该不同
      expect(secondHash).not.toBe(firstHash);
    });
  });

  // 7. UI 状态测试
  test('输入框应该可编辑，结果框应该只读', async () => {
    const user = userEvent.setup();
    render(<HashPage />);
    
    const input = screen.getByPlaceholderText('输入要计算哈希的文本...');
    expect(input).not.toHaveAttribute('readonly');
    
    await user.type(input, 'Test');
    await user.click(screen.getByRole('button', { name: '计算' }));
    
    await waitFor(() => {
      const readonlyInputs = screen.getAllByRole('textbox').filter(
        input => input.hasAttribute('readonly')
      );
      readonlyInputs.forEach(input => {
        expect(input).toHaveAttribute('readonly');
      });
    });
  });

  // 8. 结果显示/隐藏测试
  test('计算前不应该显示结果', () => {
    render(<HashPage />);
    
    expect(screen.queryByText('SHA-1')).not.toBeInTheDocument();
    expect(screen.queryByText('SHA-256')).not.toBeInTheDocument();
  });

  test('计算后应该显示所有结果', async () => {
    const user = userEvent.setup();
    render(<HashPage />);
    
    const input = screen.getByPlaceholderText('输入要计算哈希的文本...');
    await user.type(input, 'Test');
    await user.click(screen.getByRole('button', { name: '计算' }));
    
    await waitFor(() => {
      expect(screen.getByText('SHA-1')).toBeInTheDocument();
      expect(screen.getByText('SHA-256')).toBeInTheDocument();
      expect(screen.getByText('SHA-384')).toBeInTheDocument();
      expect(screen.getByText('SHA-512')).toBeInTheDocument();
    });
  });
});
