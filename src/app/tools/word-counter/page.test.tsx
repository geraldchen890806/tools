import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import WordCounter from './page';

describe('字数统计工具', () => {
  // 1. 渲染测试
  test('应该正确渲染工具界面', () => {
    render(<WordCounter />);
    expect(screen.getByText('字数统计')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('在此输入或粘贴文本...')).toBeInTheDocument();
    expect(screen.getByText('字符数')).toBeInTheDocument();
    expect(screen.getByText('单词数')).toBeInTheDocument();
    expect(screen.getByText('中文字符')).toBeInTheDocument();
    expect(screen.getByText('行数')).toBeInTheDocument();
    expect(screen.getByText('段落数')).toBeInTheDocument();
  });

  // 2. 初始状态测试
  test('初始状态下所有统计应该为 0', () => {
    const { container } = render(<WordCounter />);
    
    const statValues = container.querySelectorAll('.text-2xl');
    statValues.forEach(value => {
      expect(value.textContent).toBe('0');
    });
  });

  // 3. 字符数统计测试
  describe('字符数统计', () => {
    test('应该正确统计英文字符', async () => {
      const user = userEvent.setup();
      render(<WordCounter />);
      
      const textarea = screen.getByPlaceholderText('在此输入或粘贴文本...');
      await user.type(textarea, 'Hello World');
      
      // 查找字符数对应的值
      const charLabel = screen.getByText('字符数');
      const charValue = charLabel.previousElementSibling;
      expect(charValue?.textContent).toBe('11'); // "Hello World" = 11 characters
    });

    test('应该正确统计中文字符', async () => {
      const user = userEvent.setup();
      render(<WordCounter />);
      
      const textarea = screen.getByPlaceholderText('在此输入或粘贴文本...');
      await user.type(textarea, '你好世界');
      
      const charLabel = screen.getByText('字符数');
      const charValue = charLabel.previousElementSibling;
      expect(charValue?.textContent).toBe('4');
    });

    test('应该正确统计混合字符', async () => {
      const user = userEvent.setup();
      render(<WordCounter />);
      
      const textarea = screen.getByPlaceholderText('在此输入或粘贴文本...');
      await user.type(textarea, 'Hello 世界');
      
      const charLabel = screen.getByText('字符数');
      const charValue = charLabel.previousElementSibling;
      expect(charValue?.textContent).toBe('8'); // "Hello 世界" = 8 characters
    });

    test('应该包含空格和标点符号', async () => {
      const user = userEvent.setup();
      render(<WordCounter />);
      
      const textarea = screen.getByPlaceholderText('在此输入或粘贴文本...');
      await user.type(textarea, 'Hello, World!');
      
      const charLabel = screen.getByText('字符数');
      const charValue = charLabel.previousElementSibling;
      expect(charValue?.textContent).toBe('13');
    });
  });

  // 4. 单词数统计测试
  describe('单词数统计', () => {
    test('应该正确统计英文单词', async () => {
      const user = userEvent.setup();
      render(<WordCounter />);
      
      const textarea = screen.getByPlaceholderText('在此输入或粘贴文本...');
      await user.type(textarea, 'Hello World Test');
      
      const wordLabel = screen.getByText('单词数');
      const wordValue = wordLabel.previousElementSibling;
      expect(wordValue?.textContent).toBe('3');
    });

    test('应该处理多个空格', async () => {
      const user = userEvent.setup();
      render(<WordCounter />);
      
      const textarea = screen.getByPlaceholderText('在此输入或粘贴文本...') as HTMLTextAreaElement;
      await user.click(textarea);
      await user.paste('Hello   World');
      
      const wordLabel = screen.getByText('单词数');
      const wordValue = wordLabel.previousElementSibling;
      expect(wordValue?.textContent).toBe('2');
    });

    test('应该处理前后空格', async () => {
      const user = userEvent.setup();
      render(<WordCounter />);
      
      const textarea = screen.getByPlaceholderText('在此输入或粘贴文本...') as HTMLTextAreaElement;
      await user.click(textarea);
      await user.paste('  Hello World  ');
      
      const wordLabel = screen.getByText('单词数');
      const wordValue = wordLabel.previousElementSibling;
      expect(wordValue?.textContent).toBe('2');
    });

    test('空字符串应该返回 0 个单词', async () => {
      render(<WordCounter />);
      
      const wordLabel = screen.getByText('单词数');
      const wordValue = wordLabel.previousElementSibling;
      expect(wordValue?.textContent).toBe('0');
    });
  });

  // 5. 中文字符统计测试
  describe('中文字符统计', () => {
    test('应该正确统计纯中文', async () => {
      const user = userEvent.setup();
      render(<WordCounter />);
      
      const textarea = screen.getByPlaceholderText('在此输入或粘贴文本...');
      await user.type(textarea, '你好世界测试');
      
      const chineseLabel = screen.getByText('中文字符');
      const chineseValue = chineseLabel.previousElementSibling;
      expect(chineseValue?.textContent).toBe('6');
    });

    test('应该只统计中文字符，不包含英文', async () => {
      const user = userEvent.setup();
      render(<WordCounter />);
      
      const textarea = screen.getByPlaceholderText('在此输入或粘贴文本...');
      await user.type(textarea, 'Hello 世界 Test');
      
      const chineseLabel = screen.getByText('中文字符');
      const chineseValue = chineseLabel.previousElementSibling;
      expect(chineseValue?.textContent).toBe('2');
    });

    test('没有中文时应该返回 0', async () => {
      const user = userEvent.setup();
      render(<WordCounter />);
      
      const textarea = screen.getByPlaceholderText('在此输入或粘贴文本...');
      await user.type(textarea, 'Hello World');
      
      const chineseLabel = screen.getByText('中文字符');
      const chineseValue = chineseLabel.previousElementSibling;
      expect(chineseValue?.textContent).toBe('0');
    });
  });

  // 6. 行数统计测试
  describe('行数统计', () => {
    test('单行文本应该为 1 行', async () => {
      const user = userEvent.setup();
      render(<WordCounter />);
      
      const textarea = screen.getByPlaceholderText('在此输入或粘贴文本...');
      await user.type(textarea, 'Hello World');
      
      const lineLabel = screen.getByText('行数');
      const lineValue = lineLabel.previousElementSibling;
      expect(lineValue?.textContent).toBe('1');
    });

    test('应该正确统计多行文本', async () => {
      const user = userEvent.setup();
      render(<WordCounter />);
      
      const textarea = screen.getByPlaceholderText('在此输入或粘贴文本...') as HTMLTextAreaElement;
      await user.click(textarea);
      await user.paste('Line 1\nLine 2\nLine 3');
      
      const lineLabel = screen.getByText('行数');
      const lineValue = lineLabel.previousElementSibling;
      expect(lineValue?.textContent).toBe('3');
    });

    test('空文本应该为 0 行', () => {
      render(<WordCounter />);
      
      const lineLabel = screen.getByText('行数');
      const lineValue = lineLabel.previousElementSibling;
      expect(lineValue?.textContent).toBe('0');
    });
  });

  // 7. 段落数统计测试
  describe('段落数统计', () => {
    test('单段文本应该为 1 段', async () => {
      const user = userEvent.setup();
      render(<WordCounter />);
      
      const textarea = screen.getByPlaceholderText('在此输入或粘贴文本...');
      await user.type(textarea, 'This is a paragraph.');
      
      const paraLabel = screen.getByText('段落数');
      const paraValue = paraLabel.previousElementSibling;
      expect(paraValue?.textContent).toBe('1');
    });

    test('应该正确统计多段文本（用空行分隔）', async () => {
      const user = userEvent.setup();
      render(<WordCounter />);
      
      const textarea = screen.getByPlaceholderText('在此输入或粘贴文本...') as HTMLTextAreaElement;
      await user.click(textarea);
      await user.paste('Paragraph 1\n\nParagraph 2\n\nParagraph 3');
      
      const paraLabel = screen.getByText('段落数');
      const paraValue = paraLabel.previousElementSibling;
      expect(paraValue?.textContent).toBe('3');
    });

    test('应该忽略纯空格的段落', async () => {
      const user = userEvent.setup();
      render(<WordCounter />);
      
      const textarea = screen.getByPlaceholderText('在此输入或粘贴文本...') as HTMLTextAreaElement;
      await user.click(textarea);
      await user.paste('Paragraph 1\n  \n\nParagraph 2');
      
      const paraLabel = screen.getByText('段落数');
      const paraValue = paraLabel.previousElementSibling;
      expect(paraValue?.textContent).toBe('2');
    });

    test('空文本应该为 0 段', () => {
      render(<WordCounter />);
      
      const paraLabel = screen.getByText('段落数');
      const paraValue = paraLabel.previousElementSibling;
      expect(paraValue?.textContent).toBe('0');
    });
  });

  // 8. 实时更新测试
  test('统计应该实时更新', async () => {
    const user = userEvent.setup();
    render(<WordCounter />);
    
    const textarea = screen.getByPlaceholderText('在此输入或粘贴文本...');
    
    // 第一次输入
    await user.type(textarea, 'Hello');
    
    let charLabel = screen.getByText('字符数');
    let charValue = charLabel.previousElementSibling;
    expect(charValue?.textContent).toBe('5');
    
    // 继续输入
    await user.type(textarea, ' World');
    
    charLabel = screen.getByText('字符数');
    charValue = charLabel.previousElementSibling;
    expect(charValue?.textContent).toBe('11');
  });

  // 9. 综合测试
  test('应该正确统计复杂文本', async () => {
    const user = userEvent.setup();
    const { container } = render(<WordCounter />);
    
    const textarea = screen.getByPlaceholderText('在此输入或粘贴文本...') as HTMLTextAreaElement;
    const complexText = `Hello 世界

This is the first paragraph with 10 words in it here.

这是第二段，包含中文字符。

Third paragraph.`;
    
    await user.click(textarea);
    await user.paste(complexText);
    
    // 验证所有统计
    const charLabel = screen.getByText('字符数');
    const charValue = charLabel.previousElementSibling;
    expect(Number(charValue?.textContent)).toBeGreaterThan(0);
    
    const wordLabel = screen.getByText('单词数');
    const wordValue = wordLabel.previousElementSibling;
    expect(Number(wordValue?.textContent)).toBeGreaterThan(10);
    
    const chineseLabel = screen.getByText('中文字符');
    const chineseValue = chineseLabel.previousElementSibling;
    expect(Number(chineseValue?.textContent)).toBeGreaterThan(10);
    
    const lineLabel = screen.getByText('行数');
    const lineValue = lineLabel.previousElementSibling;
    expect(Number(lineValue?.textContent)).toBeGreaterThan(5);
    
    const paraLabel = screen.getByText('段落数');
    const paraValue = paraLabel.previousElementSibling;
    expect(paraValue?.textContent).toBe('4');
  });

  // 10. 特殊字符测试
  test('应该正确处理 emoji 和特殊字符', async () => {
    const user = userEvent.setup();
    render(<WordCounter />);
    
    const textarea = screen.getByPlaceholderText('在此输入或粘贴文本...');
    await user.type(textarea, 'Hello 😀 World 🎉');
    
    const charLabel = screen.getByText('字符数');
    const charValue = charLabel.previousElementSibling;
    expect(Number(charValue?.textContent)).toBeGreaterThan(0);
  });
});
