import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TextDedupe from './page';

describe('TextDedupe', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: vi.fn(() => Promise.resolve()),
      },
      writable: true,
    });
  });

  it('renders the component', () => {
    render(<TextDedupe />);
    expect(screen.getByText('文本去重工具')).toBeInTheDocument();
  });

  it('shows default options', () => {
    render(<TextDedupe />);
    expect(screen.getByLabelText('区分大小写')).toBeChecked();
    expect(screen.getByLabelText('去除首尾空格')).toBeChecked();
    expect(screen.getByLabelText('删除空行')).toBeChecked();
  });

  it('removes duplicate lines', async () => {
    const user = userEvent.setup();
    render(<TextDedupe />);

    const input = screen.getByPlaceholderText(/输入文本/);
    await user.click(input);
    await user.paste('apple\nbanana\napple\ncherry');

    const dedupeBtn = screen.getByText('去重');
    await user.click(dedupeBtn);

    const output = screen.getByPlaceholderText('去重结果将显示在这里...');
    expect(output).toHaveValue('apple\nbanana\ncherry');
  });

  it('shows correct statistics', async () => {
    const user = userEvent.setup();
    render(<TextDedupe />);

    const input = screen.getByPlaceholderText(/输入文本/);
    await user.click(input);
    await user.paste('apple\nbanana\napple\ncherry\nbanana');

    const dedupeBtn = screen.getByText('去重');
    await user.click(dedupeBtn);

    expect(screen.getByText('5')).toBeInTheDocument(); // original
    expect(screen.getByText('3')).toBeInTheDocument(); // unique
    expect(screen.getByText('2')).toBeInTheDocument(); // duplicates
  });

  it('handles case sensitivity', async () => {
    const user = userEvent.setup();
    render(<TextDedupe />);

    const input = screen.getByPlaceholderText(/输入文本/);
    await user.click(input);
    await user.paste('Apple\napple\nAPPLE');

    const caseSensitiveCheckbox = screen.getByLabelText('区分大小写');
    await user.click(caseSensitiveCheckbox);

    const dedupeBtn = screen.getByText('去重');
    await user.click(dedupeBtn);

    const output = screen.getByPlaceholderText('去重结果将显示在这里...');
    expect(output).toHaveValue('Apple');
  });

  it('trims whitespace when enabled', async () => {
    const user = userEvent.setup();
    render(<TextDedupe />);

    const input = screen.getByPlaceholderText(/输入文本/);
    await user.click(input);
    await user.paste('  apple  \napple\n  apple');

    const dedupeBtn = screen.getByText('去重');
    await user.click(dedupeBtn);

    const output = screen.getByPlaceholderText('去重结果将显示在这里...');
    expect(output).toHaveValue('apple');
  });

  it('preserves whitespace when trim is disabled', async () => {
    const user = userEvent.setup();
    render(<TextDedupe />);

    const input = screen.getByPlaceholderText(/输入文本/);
    await user.click(input);
    await user.paste('  apple  \napple');

    const trimCheckbox = screen.getByLabelText('去除首尾空格');
    await user.click(trimCheckbox);

    const dedupeBtn = screen.getByText('去重');
    await user.click(dedupeBtn);

    const output = screen.getByPlaceholderText('去重结果将显示在这里...');
    expect(output).toHaveValue('  apple  \napple');
  });

  it('removes empty lines when enabled', async () => {
    const user = userEvent.setup();
    render(<TextDedupe />);

    const input = screen.getByPlaceholderText(/输入文本/);
    await user.click(input);
    await user.paste('apple\n\nbanana\n\n');

    const dedupeBtn = screen.getByText('去重');
    await user.click(dedupeBtn);

    const output = screen.getByPlaceholderText('去重结果将显示在这里...');
    expect(output).toHaveValue('apple\nbanana');
  });

  it('keeps empty lines when option is disabled', async () => {
    const user = userEvent.setup();
    render(<TextDedupe />);

    const input = screen.getByPlaceholderText(/输入文本/);
    await user.click(input);
    await user.paste('apple\n\nbanana');

    const removeEmptyCheckbox = screen.getByLabelText('删除空行');
    await user.click(removeEmptyCheckbox);

    const dedupeBtn = screen.getByText('去重');
    await user.click(dedupeBtn);

    const output = screen.getByPlaceholderText('去重结果将显示在这里...');
    expect(output).toHaveValue('apple\n\nbanana');
  });

  it('handles empty input', async () => {
    const user = userEvent.setup();
    render(<TextDedupe />);

    const dedupeBtn = screen.getByText('去重');
    await user.click(dedupeBtn);

    const output = screen.getByPlaceholderText('去重结果将显示在这里...');
    expect(output).toHaveValue('');
  });

  it('clears input and output', async () => {
    const user = userEvent.setup();
    render(<TextDedupe />);

    const input = screen.getByPlaceholderText(/输入文本/);
    await user.click(input);
    await user.paste('apple\nbanana');

    const dedupeBtn = screen.getByText('去重');
    await user.click(dedupeBtn);

    const clearBtn = screen.getByText('清空');
    await user.click(clearBtn);

    expect(input).toHaveValue('');
    const output = screen.getByPlaceholderText('去重结果将显示在这里...');
    expect(output).toHaveValue('');
  });

  it('copies output to clipboard', async () => {
    const user = userEvent.setup();
    const writeTextMock = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      writable: true,
    });

    render(<TextDedupe />);

    const input = screen.getByPlaceholderText(/输入文本/);
    await user.click(input);
    await user.paste('apple\nbanana\napple');

    const dedupeBtn = screen.getByText('去重');
    await user.click(dedupeBtn);

    const copyBtn = screen.getByText('复制结果');
    await user.click(copyBtn);

    expect(writeTextMock).toHaveBeenCalledWith('apple\nbanana');
    expect(screen.getByText('已复制 ✓')).toBeInTheDocument();
  });
});
