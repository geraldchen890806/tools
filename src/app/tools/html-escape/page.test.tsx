import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HtmlEscape from './page';

describe('HtmlEscape', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: vi.fn(() => Promise.resolve()),
      },
      writable: true,
    });
  });

  it('renders the component', () => {
    render(<HtmlEscape />);
    expect(screen.getByText('HTML 转义工具')).toBeInTheDocument();
  });

  it('shows encode mode by default', () => {
    render(<HtmlEscape />);
    const encodeBtn = screen.getByText('转义 (Encode)');
    expect(encodeBtn).toHaveClass('bg-blue-500');
  });

  it('switches to decode mode', async () => {
    const user = userEvent.setup();
    render(<HtmlEscape />);
    
    const decodeBtn = screen.getByText('反转义 (Decode)');
    await user.click(decodeBtn);
    
    expect(decodeBtn).toHaveClass('bg-blue-500');
  });

  describe('Encode mode', () => {
    it('escapes HTML entities correctly', async () => {
      const user = userEvent.setup();
      render(<HtmlEscape />);

      const input = screen.getByPlaceholderText('输入要转义的 HTML 代码...');
      await user.click(input);
      await user.paste('<div>Hello & World</div>');

      const convertBtn = screen.getByText('转换');
      await user.click(convertBtn);

      const output = screen.getByPlaceholderText('转换结果将显示在这里...');
      expect(output).toHaveValue('&lt;div&gt;Hello &amp; World&lt;/div&gt;');
    });

    it('escapes quotes correctly', async () => {
      const user = userEvent.setup();
      render(<HtmlEscape />);

      const input = screen.getByPlaceholderText('输入要转义的 HTML 代码...');
      await user.click(input);
      await user.paste('<a href="link">text</a>');

      const convertBtn = screen.getByText('转换');
      await user.click(convertBtn);

      const output = screen.getByPlaceholderText('转换结果将显示在这里...');
      expect(output).toHaveValue('&lt;a href=&quot;link&quot;&gt;text&lt;&#x2F;a&gt;');
    });

    it('escapes single quotes', async () => {
      const user = userEvent.setup();
      render(<HtmlEscape />);

      const input = screen.getByPlaceholderText('输入要转义的 HTML 代码...');
      await user.click(input);
      await user.paste("It's a test");

      const convertBtn = screen.getByText('转换');
      await user.click(convertBtn);

      const output = screen.getByPlaceholderText('转换结果将显示在这里...');
      expect(output).toHaveValue('It&#39;s a test');
    });

    it('handles empty input', async () => {
      const user = userEvent.setup();
      render(<HtmlEscape />);

      const convertBtn = screen.getByText('转换');
      await user.click(convertBtn);

      const output = screen.getByPlaceholderText('转换结果将显示在这里...');
      expect(output).toHaveValue('');
    });
  });

  describe('Decode mode', () => {
    it('unescapes HTML entities correctly', async () => {
      const user = userEvent.setup();
      render(<HtmlEscape />);

      const decodeBtn = screen.getByText('反转义 (Decode)');
      await user.click(decodeBtn);

      const input = screen.getByPlaceholderText('输入要反转义的文本...');
      await user.click(input);
      await user.paste('&lt;div&gt;Hello &amp; World&lt;/div&gt;');

      const convertBtn = screen.getByText('转换');
      await user.click(convertBtn);

      const output = screen.getByPlaceholderText('转换结果将显示在这里...');
      expect(output).toHaveValue('<div>Hello & World</div>');
    });

    it('unescapes quotes correctly', async () => {
      const user = userEvent.setup();
      render(<HtmlEscape />);

      const decodeBtn = screen.getByText('反转义 (Decode)');
      await user.click(decodeBtn);

      const input = screen.getByPlaceholderText('输入要反转义的文本...');
      await user.click(input);
      await user.paste('&lt;a href=&quot;link&quot;&gt;text&lt;/a&gt;');

      const convertBtn = screen.getByText('转换');
      await user.click(convertBtn);

      const output = screen.getByPlaceholderText('转换结果将显示在这里...');
      expect(output).toHaveValue('<a href="link">text</a>');
    });

    it('handles numeric entities', async () => {
      const user = userEvent.setup();
      render(<HtmlEscape />);

      const decodeBtn = screen.getByText('反转义 (Decode)');
      await user.click(decodeBtn);

      const input = screen.getByPlaceholderText('输入要反转义的文本...');
      await user.click(input);
      await user.paste('It&#39;s a test');

      const convertBtn = screen.getByText('转换');
      await user.click(convertBtn);

      const output = screen.getByPlaceholderText('转换结果将显示在这里...');
      expect(output).toHaveValue("It's a test");
    });
  });

  describe('Actions', () => {
    it('clears input and output', async () => {
      const user = userEvent.setup();
      render(<HtmlEscape />);

      const input = screen.getByPlaceholderText('输入要转义的 HTML 代码...');
      await user.click(input);
      await user.paste('<div>test</div>');

      const convertBtn = screen.getByText('转换');
      await user.click(convertBtn);

      const clearBtn = screen.getByText('清空');
      await user.click(clearBtn);

      expect(input).toHaveValue('');
      const output = screen.getByPlaceholderText('转换结果将显示在这里...');
      expect(output).toHaveValue('');
    });

    it('copies output to clipboard', async () => {
      const user = userEvent.setup();
      const writeTextMock = vi.fn(() => Promise.resolve());
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: writeTextMock },
        writable: true,
      });

      render(<HtmlEscape />);

      const input = screen.getByPlaceholderText('输入要转义的 HTML 代码...');
      await user.click(input);
      await user.paste('<div>test</div>');

      const convertBtn = screen.getByText('转换');
      await user.click(convertBtn);

      const copyBtn = screen.getByText('复制结果');
      await user.click(copyBtn);

      expect(writeTextMock).toHaveBeenCalledWith('&lt;div&gt;test&lt;/div&gt;');
      expect(screen.getByText('已复制 ✓')).toBeInTheDocument();
    });
  });
});
