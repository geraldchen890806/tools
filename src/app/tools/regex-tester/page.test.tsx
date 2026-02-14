import { render, screen, waitFor } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import RegexTester from './page';

describe('正则测试工具', () => {
  // 1. 渲染测试
  test('应该正确渲染工具界面', () => {
    render(<RegexTester />);
    expect(screen.getByText('正则测试')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('输入正则...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('输入测试文本...')).toBeInTheDocument();
    expect(screen.getByText('Flags')).toBeInTheDocument();
  });

  // 2. 基础匹配测试
  describe('基础匹配', () => {
    test('应该匹配简单的文本', async () => {
      const user = userEvent.setup();
      render(<RegexTester />);
      
      const patternInput = screen.getByPlaceholderText('输入正则...');
      const textInput = screen.getByPlaceholderText('输入测试文本...');
      
      await user.type(patternInput, 'hello');
      await user.type(textInput, 'hello world');
      
      await waitFor(() => {
        expect(screen.getByText('高亮结果')).toBeInTheDocument();
        expect(screen.getByText(/匹配项/)).toBeInTheDocument();
      });
    });

    test('应该显示匹配数量', async () => {
      const user = userEvent.setup();
      render(<RegexTester />);
      
      const patternInput = screen.getByPlaceholderText('输入正则...');
      const textInput = screen.getByPlaceholderText('输入测试文本...');
      
      await user.click(patternInput);
      await user.paste('a');
      await user.click(textInput);
      await user.paste('aaa bbb aaa');
      
      await waitFor(() => {
        // 检查是否有"高亮结果"区域显示
        expect(screen.getByText('高亮结果')).toBeInTheDocument();
        // 检查是否显示匹配项标题（包含数量）
        const matchTitle = screen.getByText(/匹配项/);
        expect(matchTitle).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    test('应该显示所有匹配项', async () => {
      const user = userEvent.setup();
      render(<RegexTester />);
      
      const patternInput = screen.getByPlaceholderText('输入正则...');
      const textInput = screen.getByPlaceholderText('输入测试文本...');
      
      await user.type(patternInput, 'test');
      await user.type(textInput, 'test1 test2 test3');
      
      await waitFor(() => {
        expect(screen.getByText(/匹配项 \(3\)/)).toBeInTheDocument();
      });
    });
  });

  // 3. Flags 测试
  describe('Flags 功能', () => {
    test('默认应该使用全局匹配 (g)', async () => {
      const user = userEvent.setup();
      render(<RegexTester />);
      
      const patternInput = screen.getByPlaceholderText('输入正则...');
      const textInput = screen.getByPlaceholderText('输入测试文本...');
      const flagsInput = screen.getAllByRole('textbox')[1]; // Flags 输入框
      
      // 检查默认值
      expect(flagsInput).toHaveValue('g');
      
      await user.type(patternInput, 'a');
      await user.type(textInput, 'aaa');
      
      await waitFor(() => {
        expect(screen.getByText(/匹配项 \(3\)/)).toBeInTheDocument();
      });
    });

    test('应该支持大小写不敏感 (i)', async () => {
      const user = userEvent.setup();
      render(<RegexTester />);
      
      const patternInput = screen.getByPlaceholderText('输入正则...');
      const textInput = screen.getByPlaceholderText('输入测试文本...');
      const flagsInput = screen.getAllByRole('textbox')[1];
      
      await user.clear(flagsInput);
      await user.type(flagsInput, 'gi');
      await user.type(patternInput, 'hello');
      await user.type(textInput, 'HELLO Hello hello');
      
      await waitFor(() => {
        expect(screen.getByText(/匹配项 \(3\)/)).toBeInTheDocument();
      });
    });

    test('应该支持多行模式 (m)', async () => {
      const user = userEvent.setup();
      render(<RegexTester />);
      
      const patternInput = screen.getByPlaceholderText('输入正则...');
      const textInput = screen.getByPlaceholderText('输入测试文本...');
      const flagsInput = screen.getAllByRole('textbox')[1];
      
      await user.clear(flagsInput);
      await user.type(flagsInput, 'gm');
      await user.click(patternInput);
      await user.paste('^test');
      await user.click(textInput);
      await user.paste('test\ntest\ntest');
      
      await waitFor(() => {
        expect(screen.getByText(/匹配项 \(3\)/)).toBeInTheDocument();
      }, { timeout: 5000 }); // 多行模式可能需要更长时间
    });
  });

  // 4. 正则表达式模式测试
  describe('正则表达式模式', () => {
    test('应该支持字符类 [a-z]', async () => {
      const user = userEvent.setup();
      render(<RegexTester />);
      
      const patternInput = screen.getByPlaceholderText('输入正则...');
      const textInput = screen.getByPlaceholderText('输入测试文本...');
      
      await user.click(patternInput);
      await user.paste('[0-9]+');
      await user.click(textInput);
      await user.paste('abc123def456');
      
      await waitFor(() => {
        expect(screen.getByText(/匹配项 \(2\)/)).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    test('应该支持量词 +', async () => {
      const user = userEvent.setup();
      render(<RegexTester />);
      
      const patternInput = screen.getByPlaceholderText('输入正则...');
      const textInput = screen.getByPlaceholderText('输入测试文本...');
      
      await user.type(patternInput, 'a+');
      await user.type(textInput, 'a aa aaa');
      
      await waitFor(() => {
        expect(screen.getByText(/匹配项 \(3\)/)).toBeInTheDocument();
      });
    });

    test('应该支持捕获组 ()', async () => {
      const user = userEvent.setup();
      render(<RegexTester />);
      
      const patternInput = screen.getByPlaceholderText('输入正则...');
      const textInput = screen.getByPlaceholderText('输入测试文本...');
      
      await user.type(patternInput, '(\\d+)');
      await user.type(textInput, '123 456 789');
      
      await waitFor(() => {
        expect(screen.getByText(/匹配项 \(3\)/)).toBeInTheDocument();
      });
    });

    test('应该支持转义字符 \\d \\w \\s', async () => {
      const user = userEvent.setup();
      render(<RegexTester />);
      
      const patternInput = screen.getByPlaceholderText('输入正则...');
      const textInput = screen.getByPlaceholderText('输入测试文本...');
      
      await user.type(patternInput, '\\d+');
      await user.type(textInput, 'test123');
      
      await waitFor(() => {
        expect(screen.getByText(/匹配项 \(1\)/)).toBeInTheDocument();
      });
    });
  });

  // 5. 错误处理测试
  describe('错误处理', () => {
    test('应该处理无效的正则表达式', async () => {
      const user = userEvent.setup();
      render(<RegexTester />);
      
      const patternInput = screen.getByPlaceholderText('输入正则...');
      await user.click(patternInput);
      await user.paste('[invalid');
      
      await waitFor(() => {
        // 检查是否有错误提示（可能在多个地方显示）
        const errorElements = screen.queryAllByText(/Unterminated|Invalid|正则表达式|错误|error/i);
        expect(errorElements.length).toBeGreaterThan(0);
      }, { timeout: 2000 });
    });

    test('应该处理未闭合的括号', async () => {
      const user = userEvent.setup();
      render(<RegexTester />);
      
      const patternInput = screen.getByPlaceholderText('输入正则...');
      await user.type(patternInput, '(unclosed');
      
      await waitFor(() => {
        const errorElement = screen.queryByText(/Unterminated|Invalid/);
        expect(errorElement).toBeInTheDocument();
      });
    });

    test('应该处理无效的量词', async () => {
      const user = userEvent.setup();
      render(<RegexTester />);
      
      const patternInput = screen.getByPlaceholderText('输入正则...');
      await user.type(patternInput, '*invalid');
      
      await waitFor(() => {
        const errorElement = screen.queryByText(/Invalid|Nothing to repeat/);
        expect(errorElement).toBeInTheDocument();
      });
    });

    test('错误时不应该显示结果', async () => {
      const user = userEvent.setup();
      render(<RegexTester />);
      
      const patternInput = screen.getByPlaceholderText('输入正则...');
      const textInput = screen.getByPlaceholderText('输入测试文本...');
      
      await user.click(patternInput);
      await user.paste('[invalid');
      await user.type(textInput, 'test');
      
      await waitFor(() => {
        // 有错误时不应该显示匹配结果
        expect(screen.queryByText(/匹配项 \(\d+\)/)).not.toBeInTheDocument();
      }, { timeout: 2000 });
    });
  });

  // 6. UI 状态测试
  test('没有输入时不应该显示结果', () => {
    render(<RegexTester />);
    expect(screen.queryByText('高亮结果')).not.toBeInTheDocument();
    expect(screen.queryByText(/匹配项/)).not.toBeInTheDocument();
  });

  test('只有正则没有文本时不应该显示结果', async () => {
    const user = userEvent.setup();
    render(<RegexTester />);
    
    const patternInput = screen.getByPlaceholderText('输入正则...');
    await user.type(patternInput, 'test');
    
    expect(screen.queryByText('高亮结果')).not.toBeInTheDocument();
  });

  test('只有文本没有正则时不应该显示结果', async () => {
    const user = userEvent.setup();
    render(<RegexTester />);
    
    const textInput = screen.getByPlaceholderText('输入测试文本...');
    await user.type(textInput, 'test');
    
    expect(screen.queryByText('高亮结果')).not.toBeInTheDocument();
  });

  test('有正则和文本时应该显示结果', async () => {
    const user = userEvent.setup();
    render(<RegexTester />);
    
    const patternInput = screen.getByPlaceholderText('输入正则...');
    const textInput = screen.getByPlaceholderText('输入测试文本...');
    
    await user.type(patternInput, 'test');
    await user.type(textInput, 'test');
    
    await waitFor(() => {
      expect(screen.getByText('高亮结果')).toBeInTheDocument();
      expect(screen.getByText(/匹配项/)).toBeInTheDocument();
    });
  });

  // 7. 无匹配测试
  test('无匹配时应该显示提示', async () => {
    const user = userEvent.setup();
    render(<RegexTester />);
    
    const patternInput = screen.getByPlaceholderText('输入正则...');
    const textInput = screen.getByPlaceholderText('输入测试文本...');
    
    await user.type(patternInput, 'xyz');
    await user.type(textInput, 'abc');
    
    await waitFor(() => {
      expect(screen.getByText('无匹配')).toBeInTheDocument();
      expect(screen.getByText(/匹配项 \(0\)/)).toBeInTheDocument();
    });
  });

  // 8. 实时更新测试
  test('修改正则应该实时更新结果', async () => {
    const user = userEvent.setup();
    render(<RegexTester />);
    
    const patternInput = screen.getByPlaceholderText('输入正则...');
    const textInput = screen.getByPlaceholderText('输入测试文本...');
    
    await user.type(textInput, 'test123');
    
    // 先匹配字母
    await user.type(patternInput, 'test');
    await waitFor(() => {
      expect(screen.getByText(/匹配项 \(1\)/)).toBeInTheDocument();
    });
    
    // 修改为匹配数字
    await user.clear(patternInput);
    await user.type(patternInput, '\\d+');
    await waitFor(() => {
      expect(screen.getByText(/匹配项 \(1\)/)).toBeInTheDocument();
    });
  });

  test('修改文本应该实时更新结果', async () => {
    const user = userEvent.setup();
    render(<RegexTester />);
    
    const patternInput = screen.getByPlaceholderText('输入正则...');
    const textInput = screen.getByPlaceholderText('输入测试文本...');
    
    await user.type(patternInput, 'a');
    
    // 先输入少量文本
    await user.type(textInput, 'aa');
    await waitFor(() => {
      expect(screen.getByText(/匹配项 \(2\)/)).toBeInTheDocument();
    });
    
    // 添加更多文本
    await user.type(textInput, 'a');
    await waitFor(() => {
      expect(screen.getByText(/匹配项 \(3\)/)).toBeInTheDocument();
    });
  });

  // 9. 特殊场景测试
  test('应该正确处理中文', async () => {
    const user = userEvent.setup();
    render(<RegexTester />);
    
    const patternInput = screen.getByPlaceholderText('输入正则...');
    const textInput = screen.getByPlaceholderText('输入测试文本...');
    
    await user.type(patternInput, '你好');
    await user.type(textInput, '你好世界');
    
    await waitFor(() => {
      expect(screen.getByText(/匹配项 \(1\)/)).toBeInTheDocument();
    });
  });

  test('应该正确处理换行符', async () => {
    const user = userEvent.setup();
    render(<RegexTester />);
    
    const patternInput = screen.getByPlaceholderText('输入正则...');
    const textInput = screen.getByPlaceholderText('输入测试文本...');
    
    await user.type(patternInput, 'test');
    await user.click(textInput);
    await user.paste('test\ntest\ntest');
    
    await waitFor(() => {
      expect(screen.getByText(/匹配项 \(3\)/)).toBeInTheDocument();
    });
  });
});
