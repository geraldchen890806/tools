import { render, screen, waitFor } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import LoremIpsumPage from './page';

describe('Lorem Ipsum 生成器', () => {
  // 1. 渲染测试
  test('应该正确渲染工具界面', () => {
    render(<LoremIpsumPage />);
    expect(screen.getByText('Lorem Ipsum')).toBeInTheDocument();
    expect(screen.getByText('段落数')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '生成' })).toBeInTheDocument();
    expect(screen.getByLabelText('English')).toBeInTheDocument();
    expect(screen.getByLabelText('中文')).toBeInTheDocument();
  });

  // 2. 英文文本生成测试
  describe('英文文本生成', () => {
    test('应该生成指定段落数的英文文本', async () => {
      const user = userEvent.setup();
      const { container } = render(<LoremIpsumPage />);
      
      const generateBtn = screen.getByRole('button', { name: '生成' });
      await user.click(generateBtn);
      
      await waitFor(() => {
        const output = container.querySelector('pre');
        expect(output).toBeInTheDocument();
        expect(output?.textContent).toContain('Lorem ipsum');
      });
    });

    test('应该生成包含多个段落的文本', async () => {
      const user = userEvent.setup();
      const { container } = render(<LoremIpsumPage />);
      
      const generateBtn = screen.getByRole('button', { name: '生成' });
      await user.click(generateBtn);
      
      await waitFor(() => {
        const output = container.querySelector('pre');
        const text = output?.textContent || '';
        // 检查是否有段落分隔（\n\n）
        expect(text.split('\n\n').length).toBeGreaterThan(1);
      });
    });

    test('应该根据段落数生成对应数量的段落', async () => {
      const user = userEvent.setup();
      const { container } = render(<LoremIpsumPage />);
      
      // 设置段落数为 5
      const countInput = screen.getByRole('spinbutton') as HTMLInputElement;
      await user.clear(countInput);
      await user.type(countInput, '5');
      
      const generateBtn = screen.getByRole('button', { name: '生成' });
      await user.click(generateBtn);
      
      await waitFor(() => {
        const output = container.querySelector('pre');
        const text = output?.textContent || '';
        const paragraphs = text.split('\n\n').length;
        expect(paragraphs).toBe(5);
      });
    });

    test('应该支持最少 1 个段落', async () => {
      const user = userEvent.setup();
      const { container } = render(<LoremIpsumPage />);
      
      const countInput = screen.getByRole('spinbutton') as HTMLInputElement;
      await user.clear(countInput);
      await user.type(countInput, '1');
      
      const generateBtn = screen.getByRole('button', { name: '生成' });
      await user.click(generateBtn);
      
      await waitFor(() => {
        const output = container.querySelector('pre');
        expect(output?.textContent).toContain('Lorem ipsum');
      });
    });

    test('应该支持最多 10 个段落', async () => {
      const user = userEvent.setup();
      const { container } = render(<LoremIpsumPage />);
      
      const countInput = screen.getByRole('spinbutton') as HTMLInputElement;
      expect(countInput.max).toBe('10');
    });
  });

  // 3. 中文文本生成测试
  describe('中文文本生成', () => {
    test('应该生成中文文本', async () => {
      const user = userEvent.setup();
      const { container } = render(<LoremIpsumPage />);
      
      // 选择中文
      const zhRadio = screen.getByLabelText('中文');
      await user.click(zhRadio);
      
      const generateBtn = screen.getByRole('button', { name: '生成' });
      await user.click(generateBtn);
      
      await waitFor(() => {
        const output = container.querySelector('pre');
        const text = output?.textContent || '';
        // 检查是否包含中文字符
        expect(text).toMatch(/[\u4e00-\u9fff]/);
      });
    });

    test('中文文本应该以句号结尾', async () => {
      const user = userEvent.setup();
      const { container } = render(<LoremIpsumPage />);
      
      const zhRadio = screen.getByLabelText('中文');
      await user.click(zhRadio);
      
      const generateBtn = screen.getByRole('button', { name: '生成' });
      await user.click(generateBtn);
      
      await waitFor(() => {
        const output = container.querySelector('pre');
        const text = output?.textContent || '';
        expect(text).toContain('。');
      });
    });

    test('应该生成指定段落数的中文文本', async () => {
      const user = userEvent.setup();
      const { container } = render(<LoremIpsumPage />);
      
      const zhRadio = screen.getByLabelText('中文');
      await user.click(zhRadio);
      
      const countInput = screen.getByRole('spinbutton') as HTMLInputElement;
      await user.clear(countInput);
      await user.type(countInput, '4');
      
      const generateBtn = screen.getByRole('button', { name: '生成' });
      await user.click(generateBtn);
      
      await waitFor(() => {
        const output = container.querySelector('pre');
        const text = output?.textContent || '';
        const paragraphs = text.split('\n\n').filter(p => p.trim()).length;
        expect(paragraphs).toBe(4);
      });
    });
  });

  // 4. 语言切换测试
  describe('语言切换', () => {
    test('默认应该选中英文', () => {
      render(<LoremIpsumPage />);
      
      const enRadio = screen.getByLabelText('English') as HTMLInputElement;
      expect(enRadio.checked).toBe(true);
    });

    test('应该支持切换到中文', async () => {
      const user = userEvent.setup();
      render(<LoremIpsumPage />);
      
      const zhRadio = screen.getByLabelText('中文') as HTMLInputElement;
      await user.click(zhRadio);
      
      expect(zhRadio.checked).toBe(true);
    });

    test('切换语言后生成的文本应该对应语言', async () => {
      const user = userEvent.setup();
      const { container } = render(<LoremIpsumPage />);
      
      // 先生成英文
      let generateBtn = screen.getByRole('button', { name: '生成' });
      await user.click(generateBtn);
      
      await waitFor(() => {
        const output = container.querySelector('pre');
        expect(output?.textContent).toContain('Lorem ipsum');
      });
      
      // 切换到中文并重新生成
      const zhRadio = screen.getByLabelText('中文');
      await user.click(zhRadio);
      
      generateBtn = screen.getByRole('button', { name: '生成' });
      await user.click(generateBtn);
      
      await waitFor(() => {
        const output = container.querySelector('pre');
        const text = output?.textContent || '';
        expect(text).toMatch(/[\u4e00-\u9fff]/);
        expect(text).not.toContain('Lorem ipsum');
      });
    });
  });

  // 5. 复制功能测试
  test('应该支持复制生成的文本', async () => {
    const user = userEvent.setup();
    const writeTextMock = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: writeTextMock,
      },
      writable: true,
    });
    
    const { container } = render(<LoremIpsumPage />);
    
    const generateBtn = screen.getByRole('button', { name: '生成' });
    await user.click(generateBtn);
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: '复制' })).toBeInTheDocument();
    });
    
    const copyBtn = screen.getByRole('button', { name: '复制' });
    await user.click(copyBtn);
    
    expect(writeTextMock).toHaveBeenCalled();
    const copiedText = writeTextMock.mock.calls[0][0];
    expect(copiedText).toContain('Lorem ipsum');
  });

  // 6. UI 状态测试
  test('生成前不应该显示输出区域', () => {
    const { container } = render(<LoremIpsumPage />);
    
    expect(container.querySelector('pre')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '复制' })).not.toBeInTheDocument();
  });

  test('生成后应该显示输出和复制按钮', async () => {
    const user = userEvent.setup();
    const { container } = render(<LoremIpsumPage />);
    
    const generateBtn = screen.getByRole('button', { name: '生成' });
    await user.click(generateBtn);
    
    await waitFor(() => {
      expect(container.querySelector('pre')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '复制' })).toBeInTheDocument();
    });
  });

  test('重新生成应该替换之前的内容', async () => {
    const user = userEvent.setup();
    const { container } = render(<LoremIpsumPage />);
    
    // 第一次生成
    const generateBtn = screen.getByRole('button', { name: '生成' });
    await user.click(generateBtn);
    
    await waitFor(() => {
      const output = container.querySelector('pre');
      expect(output).toBeInTheDocument();
    });
    
    const firstOutput = container.querySelector('pre')?.textContent;
    
    // 修改段落数并重新生成
    const countInput = screen.getByRole('spinbutton') as HTMLInputElement;
    await user.clear(countInput);
    await user.type(countInput, '1');
    
    await user.click(generateBtn);
    
    await waitFor(() => {
      const output = container.querySelector('pre');
      const secondOutput = output?.textContent;
      expect(secondOutput).not.toBe(firstOutput);
    });
  });

  // 7. 段落数边界测试
  test('段落数应该在 1-10 范围内', () => {
    render(<LoremIpsumPage />);
    
    const countInput = screen.getByRole('spinbutton') as HTMLInputElement;
    expect(countInput.min).toBe('1');
    expect(countInput.max).toBe('10');
  });

  // 8. 随机性测试（仅中文）
  test('多次生成中文应该产生不同的内容', async () => {
    const user = userEvent.setup();
    const { container } = render(<LoremIpsumPage />);
    
    const zhRadio = screen.getByLabelText('中文');
    await user.click(zhRadio);
    
    const generateBtn = screen.getByRole('button', { name: '生成' });
    
    // 第一次生成
    await user.click(generateBtn);
    await waitFor(() => {
      expect(container.querySelector('pre')).toBeInTheDocument();
    });
    const firstOutput = container.querySelector('pre')?.textContent;
    
    // 第二次生成
    await user.click(generateBtn);
    await waitFor(() => {
      const output = container.querySelector('pre');
      const secondOutput = output?.textContent;
      // 由于中文是随机生成的，两次内容应该不同
      expect(secondOutput).not.toBe(firstOutput);
    });
  });
});
