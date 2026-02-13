import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChineseConverter from './page';

describe('ChineseConverter', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: vi.fn(() => Promise.resolve()),
      },
      writable: true,
    });
  });

  it('renders the component', () => {
    render(<ChineseConverter />);
    expect(screen.getByText('繁简转换工具')).toBeInTheDocument();
  });

  it('shows all conversion modes', () => {
    render(<ChineseConverter />);
    expect(screen.getByText('简体 → 繁体')).toBeInTheDocument();
    expect(screen.getByText('繁体 → 简体')).toBeInTheDocument();
    expect(screen.getByText('简体 → 台湾繁体')).toBeInTheDocument();
    expect(screen.getByText('简体 → 香港繁体')).toBeInTheDocument();
  });

  it('defaults to simplified to traditional mode', () => {
    render(<ChineseConverter />);
    const s2tBtn = screen.getByText('简体 → 繁体');
    expect(s2tBtn).toHaveClass('bg-blue-500');
  });

  it('switches conversion mode', async () => {
    const user = userEvent.setup();
    render(<ChineseConverter />);

    const t2sBtn = screen.getByText('繁体 → 简体');
    await user.click(t2sBtn);

    expect(t2sBtn).toHaveClass('bg-blue-500');
  });

  it('converts simplified to traditional', async () => {
    const user = userEvent.setup();
    render(<ChineseConverter />);

    const input = screen.getByPlaceholderText('输入要转换的中文文本...');
    await user.click(input);
    await user.paste('中国');

    const convertBtn = screen.getByText('转换');
    await user.click(convertBtn);

    const output = screen.getByPlaceholderText('转换结果将显示在这里...');
    expect(output).toHaveValue('中國');
  });

  it('converts traditional to simplified', async () => {
    const user = userEvent.setup();
    render(<ChineseConverter />);

    const t2sBtn = screen.getByText('繁体 → 简体');
    await user.click(t2sBtn);

    const input = screen.getByPlaceholderText('输入要转换的中文文本...');
    await user.click(input);
    await user.paste('中國');

    const convertBtn = screen.getByText('转换');
    await user.click(convertBtn);

    const output = screen.getByPlaceholderText('转换结果将显示在这里...');
    expect(output).toHaveValue('中国');
  });

  it('converts to Taiwan traditional', async () => {
    const user = userEvent.setup();
    render(<ChineseConverter />);

    const s2twBtn = screen.getByText('简体 → 台湾繁体');
    await user.click(s2twBtn);

    const input = screen.getByPlaceholderText('输入要转换的中文文本...');
    await user.click(input);
    await user.paste('软件');

    const convertBtn = screen.getByText('转换');
    await user.click(convertBtn);

    const output = screen.getByPlaceholderText('转换结果将显示在这里...');
    expect(output.value).toBeTruthy();
    expect(output.value).not.toBe('软件');
  });

  it('converts to Hong Kong traditional', async () => {
    const user = userEvent.setup();
    render(<ChineseConverter />);

    const s2hkBtn = screen.getByText('简体 → 香港繁体');
    await user.click(s2hkBtn);

    const input = screen.getByPlaceholderText('输入要转换的中文文本...');
    await user.click(input);
    await user.paste('软件');

    const convertBtn = screen.getByText('转换');
    await user.click(convertBtn);

    const output = screen.getByPlaceholderText('转换结果将显示在这里...');
    expect(output.value).toBeTruthy();
    expect(output.value).not.toBe('软件');
  });

  it('handles multi-line text', async () => {
    const user = userEvent.setup();
    render(<ChineseConverter />);

    const input = screen.getByPlaceholderText('输入要转换的中文文本...');
    await user.click(input);
    await user.paste('中国\n文化');

    const convertBtn = screen.getByText('转换');
    await user.click(convertBtn);

    const output = screen.getByPlaceholderText('转换结果将显示在这里...');
    expect(output).toHaveValue('中國\n文化');
  });

  it('preserves punctuation and numbers', async () => {
    const user = userEvent.setup();
    render(<ChineseConverter />);

    const input = screen.getByPlaceholderText('输入要转换的中文文本...');
    await user.click(input);
    await user.paste('中国，123！');

    const convertBtn = screen.getByText('转换');
    await user.click(convertBtn);

    const output = screen.getByPlaceholderText('转换结果将显示在这里...');
    expect(output).toHaveValue('中國，123！');
  });

  it('handles empty input', async () => {
    const user = userEvent.setup();
    render(<ChineseConverter />);

    const convertBtn = screen.getByText('转换');
    await user.click(convertBtn);

    const output = screen.getByPlaceholderText('转换结果将显示在这里...');
    expect(output).toHaveValue('');
  });

  it('clears input and output', async () => {
    const user = userEvent.setup();
    render(<ChineseConverter />);

    const input = screen.getByPlaceholderText('输入要转换的中文文本...');
    await user.click(input);
    await user.paste('中国');

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

    render(<ChineseConverter />);

    const input = screen.getByPlaceholderText('输入要转换的中文文本...');
    await user.click(input);
    await user.paste('中国');

    const convertBtn = screen.getByText('转换');
    await user.click(convertBtn);

    const copyBtn = screen.getByText('复制结果');
    await user.click(copyBtn);

    expect(writeTextMock).toHaveBeenCalledWith('中國');
    expect(screen.getByText('已复制 ✓')).toBeInTheDocument();
  });
});
