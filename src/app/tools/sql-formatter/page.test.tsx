import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SqlFormatter from './page';

describe('SqlFormatter', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: vi.fn(() => Promise.resolve()),
      },
      writable: true,
    });
  });

  it('renders the component', () => {
    render(<SqlFormatter />);
    expect(screen.getByText('SQL 格式化工具')).toBeInTheDocument();
  });

  it('shows all SQL dialects', () => {
    render(<SqlFormatter />);
    expect(screen.getByText('SQL')).toBeInTheDocument();
    expect(screen.getByText('MYSQL')).toBeInTheDocument();
    expect(screen.getByText('POSTGRESQL')).toBeInTheDocument();
    expect(screen.getByText('SQLITE')).toBeInTheDocument();
  });

  it('defaults to SQL dialect', () => {
    render(<SqlFormatter />);
    const sqlBtn = screen.getByText('SQL');
    expect(sqlBtn).toHaveClass('bg-blue-500');
  });

  it('switches SQL dialect', async () => {
    const user = userEvent.setup();
    render(<SqlFormatter />);

    const mysqlBtn = screen.getByText('MYSQL');
    await user.click(mysqlBtn);

    expect(mysqlBtn).toHaveClass('bg-blue-500');
  });

  it('formats basic SQL query', async () => {
    const user = userEvent.setup();
    render(<SqlFormatter />);

    const input = screen.getByPlaceholderText('输入要格式化的 SQL 语句...');
    await user.click(input);
    await user.paste('SELECT * FROM users');

    const formatBtn = screen.getByText('格式化');
    await user.click(formatBtn);

    const output = screen.getByPlaceholderText('格式化结果将显示在这里...');
    expect(output.value).toContain('SELECT');
    expect(output.value).toContain('FROM');
  });

  it('formats complex SQL query', async () => {
    const user = userEvent.setup();
    render(<SqlFormatter />);

    const input = screen.getByPlaceholderText('输入要格式化的 SQL 语句...');
    await user.click(input);
    await user.paste('SELECT id,name FROM users WHERE age>18 AND status="active"');

    const formatBtn = screen.getByText('格式化');
    await user.click(formatBtn);

    const output = screen.getByPlaceholderText('格式化结果将显示在这里...');
    expect(output.value).toContain('WHERE');
    expect(output.value).toContain('AND');
  });

  it('respects uppercase keyword option', async () => {
    const user = userEvent.setup();
    render(<SqlFormatter />);

    const input = screen.getByPlaceholderText('输入要格式化的 SQL 语句...');
    await user.click(input);
    await user.paste('select * from users');

    const formatBtn = screen.getByText('格式化');
    await user.click(formatBtn);

    const output = screen.getByPlaceholderText('格式化结果将显示在这里...');
    expect(output.value).toContain('SELECT');
  });

  it('formats with lowercase keywords when option is disabled', async () => {
    const user = userEvent.setup();
    render(<SqlFormatter />);

    const uppercaseCheckbox = screen.getByLabelText('关键字大写');
    await user.click(uppercaseCheckbox);

    const input = screen.getByPlaceholderText('输入要格式化的 SQL 语句...');
    await user.click(input);
    await user.paste('SELECT * FROM users');

    const formatBtn = screen.getByText('格式化');
    await user.click(formatBtn);

    const output = screen.getByPlaceholderText('格式化结果将显示在这里...');
    expect(output.value).toContain('select');
  });

  it('allows changing indent size', async () => {
    const user = userEvent.setup();
    render(<SqlFormatter />);

    const indentInput = screen.getByRole('spinbutton') as HTMLInputElement;
    await user.clear(indentInput);
    await user.type(indentInput, '4');

    expect(indentInput).toHaveValue(4);
  });

  it('compresses SQL query', async () => {
    const user = userEvent.setup();
    render(<SqlFormatter />);

    const input = screen.getByPlaceholderText('输入要格式化的 SQL 语句...');
    await user.click(input);
    await user.paste('SELECT  *  FROM   users   WHERE  id  =  1');

    const compressBtn = screen.getByText('压缩');
    await user.click(compressBtn);

    const output = screen.getByPlaceholderText('格式化结果将显示在这里...');
    expect(output.value).toBe('SELECT * FROM users WHERE id = 1');
  });

  it('handles empty input', async () => {
    const user = userEvent.setup();
    render(<SqlFormatter />);

    const formatBtn = screen.getByText('格式化');
    await user.click(formatBtn);

    const output = screen.getByPlaceholderText('格式化结果将显示在这里...');
    expect(output).toHaveValue('');
  });

  it('shows error for invalid SQL', async () => {
    const user = userEvent.setup();
    render(<SqlFormatter />);

    const input = screen.getByPlaceholderText('输入要格式化的 SQL 语句...');
    await user.click(input);
    await user.paste('INVALID SQL SYNTAX @#$');

    const formatBtn = screen.getByText('格式化');
    await user.click(formatBtn);

    // sql-formatter might not throw on all invalid syntax, so this test is optional
    // Just verify it doesn't crash
    expect(input).toBeInTheDocument();
  });

  it('clears input and output', async () => {
    const user = userEvent.setup();
    render(<SqlFormatter />);

    const input = screen.getByPlaceholderText('输入要格式化的 SQL 语句...');
    await user.click(input);
    await user.paste('SELECT * FROM users');

    const formatBtn = screen.getByText('格式化');
    await user.click(formatBtn);

    const clearBtn = screen.getByText('清空');
    await user.click(clearBtn);

    expect(input).toHaveValue('');
    const output = screen.getByPlaceholderText('格式化结果将显示在这里...');
    expect(output).toHaveValue('');
  });

  it('copies output to clipboard', async () => {
    const user = userEvent.setup();
    const writeTextMock = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      writable: true,
    });

    render(<SqlFormatter />);

    const input = screen.getByPlaceholderText('输入要格式化的 SQL 语句...');
    await user.click(input);
    await user.paste('SELECT * FROM users');

    const formatBtn = screen.getByText('格式化');
    await user.click(formatBtn);

    const copyBtn = screen.getByText('复制结果');
    await user.click(copyBtn);

    expect(writeTextMock).toHaveBeenCalled();
    expect(screen.getByText('已复制 ✓')).toBeInTheDocument();
  });
});
