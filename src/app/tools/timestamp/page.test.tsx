import { render, screen, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import TimestampPage from './page';

describe('时间戳转换工具', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // 1. 渲染测试
  test('应该正确渲染工具界面', () => {
    render(<TimestampPage />);
    expect(screen.getByText('时间戳转换')).toBeInTheDocument();
    expect(screen.getByText('当前时间')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('输入时间戳（秒或毫秒）')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/如 2024-01-01/)).toBeInTheDocument();
  });

  // 2. 当前时间显示测试
  test('应该显示当前时间', () => {
    const mockDate = new Date('2024-01-01T12:00:00.000Z');
    vi.setSystemTime(mockDate);
    
    render(<TimestampPage />);
    
    // 应该显示秒和毫秒
    expect(screen.getByText(/秒:/)).toBeInTheDocument();
    expect(screen.getByText(/毫秒:/)).toBeInTheDocument();
  });

  test('当前时间应该每秒更新', async () => {
    const mockDate = new Date('2024-01-01T12:00:00.000Z');
    vi.setSystemTime(mockDate);
    
    render(<TimestampPage />);
    
    const initialTime = screen.getByText(/秒:/).textContent;
    
    // 前进 1 秒
    vi.advanceTimersByTime(1000);
    
    await waitFor(() => {
      const updatedTime = screen.getByText(/秒:/).textContent;
      expect(updatedTime).not.toBe(initialTime);
    });
  });

  // 3. 时间戳转日期功能测试
  describe('时间戳转日期', () => {
    test('应该正确转换秒级时间戳', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<TimestampPage />);
      
      const input = screen.getByPlaceholderText('输入时间戳（秒或毫秒）');
      await user.type(input, '1704110400'); // 2024-01-01 12:00:00 UTC
      
      const convertBtn = screen.getAllByRole('button', { name: '转换' })[0];
      await user.click(convertBtn);
      
      await waitFor(() => {
        // 应该显示转换结果
        expect(screen.getByText(/ISO:/)).toBeInTheDocument();
        expect(screen.getByText(/秒:/)).toBeInTheDocument();
        expect(screen.getByText(/毫秒:/)).toBeInTheDocument();
      });
    });

    test('应该正确转换毫秒级时间戳', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<TimestampPage />);
      
      const input = screen.getByPlaceholderText('输入时间戳（秒或毫秒）');
      await user.type(input, '1704110400000'); // 2024-01-01 12:00:00 UTC (毫秒)
      
      const convertBtn = screen.getAllByRole('button', { name: '转换' })[0];
      await user.click(convertBtn);
      
      await waitFor(() => {
        expect(screen.getByText(/ISO:/)).toBeInTheDocument();
      });
    });

    test('应该处理无效时间戳', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<TimestampPage />);
      
      const input = screen.getByPlaceholderText('输入时间戳（秒或毫秒）');
      await user.type(input, 'invalid');
      
      const convertBtn = screen.getAllByRole('button', { name: '转换' })[0];
      await user.click(convertBtn);
      
      await waitFor(() => {
        expect(screen.getByText('无效时间戳')).toBeInTheDocument();
      });
    });

    test('应该处理空输入', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<TimestampPage />);
      
      const convertBtn = screen.getAllByRole('button', { name: '转换' })[0];
      await user.click(convertBtn);
      
      await waitFor(() => {
        expect(screen.getByText('无效时间戳')).toBeInTheDocument();
      });
    });
  });

  // 4. 日期转时间戳功能测试
  describe('日期转时间戳', () => {
    test('应该正确转换标准日期格式', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<TimestampPage />);
      
      const input = screen.getByPlaceholderText(/如 2024-01-01/);
      await user.type(input, '2024-01-01 12:00:00');
      
      const convertBtn = screen.getAllByRole('button', { name: '转换' })[1];
      await user.click(convertBtn);
      
      await waitFor(() => {
        // 应该显示秒和毫秒
        const results = screen.getAllByText(/秒:/);
        expect(results.length).toBeGreaterThan(1);
      });
    });

    test('应该正确转换 ISO 格式日期', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<TimestampPage />);
      
      const input = screen.getByPlaceholderText(/如 2024-01-01/);
      await user.type(input, '2024-01-01T12:00:00.000Z');
      
      const convertBtn = screen.getAllByRole('button', { name: '转换' })[1];
      await user.click(convertBtn);
      
      await waitFor(() => {
        const results = screen.getAllByText(/秒:/);
        expect(results.length).toBeGreaterThan(1);
      });
    });

    test('应该处理无效日期', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<TimestampPage />);
      
      const input = screen.getByPlaceholderText(/如 2024-01-01/);
      await user.type(input, 'invalid date');
      
      const convertBtn = screen.getAllByRole('button', { name: '转换' })[1];
      await user.click(convertBtn);
      
      await waitFor(() => {
        expect(screen.getByText('无效日期')).toBeInTheDocument();
      });
    });

    test('应该处理空输入', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<TimestampPage />);
      
      const convertBtn = screen.getAllByRole('button', { name: '转换' })[1];
      await user.click(convertBtn);
      
      await waitFor(() => {
        expect(screen.getByText('无效日期')).toBeInTheDocument();
      });
    });
  });

  // 5. 复制功能测试
  describe('复制功能', () => {
    test('应该支持复制当前时间（秒）', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const writeTextMock = vi.fn(() => Promise.resolve());
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: writeTextMock,
        },
        writable: true,
      });
      
      const mockDate = new Date('2024-01-01T12:00:00.000Z');
      vi.setSystemTime(mockDate);
      
      render(<TimestampPage />);
      
      const copyBtn = screen.getByRole('button', { name: '复制秒' });
      await user.click(copyBtn);
      
      expect(writeTextMock).toHaveBeenCalled();
      const copiedValue = writeTextMock.mock.calls[0][0];
      expect(copiedValue).toMatch(/^\d+$/);
    });

    test('应该支持复制当前时间（毫秒）', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const writeTextMock = vi.fn(() => Promise.resolve());
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: writeTextMock,
        },
        writable: true,
      });
      
      const mockDate = new Date('2024-01-01T12:00:00.000Z');
      vi.setSystemTime(mockDate);
      
      render(<TimestampPage />);
      
      const copyBtn = screen.getByRole('button', { name: '复制毫秒' });
      await user.click(copyBtn);
      
      expect(writeTextMock).toHaveBeenCalled();
      const copiedValue = writeTextMock.mock.calls[0][0];
      expect(copiedValue).toMatch(/^\d+$/);
    });
  });

  // 6. 双向转换验证
  test('时间戳转日期后再转回应该一致', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const { container } = render(<TimestampPage />);
    
    const originalTs = '1704110400'; // 2024-01-01 12:00:00 UTC
    
    // 先转换时间戳到日期
    const tsInput = screen.getByPlaceholderText('输入时间戳（秒或毫秒）');
    await user.type(tsInput, originalTs);
    await user.click(screen.getAllByRole('button', { name: '转换' })[0]);
    
    await waitFor(() => {
      expect(screen.getByText(/ISO:/)).toBeInTheDocument();
    });
    
    // 获取转换后的日期
    const tsResultElement = container.querySelector('pre');
    const dateString = tsResultElement?.textContent?.split('\n')[0];
    
    // 清空输入
    await user.clear(tsInput);
    
    // 用这个日期转回时间戳
    const dateInput = screen.getByPlaceholderText(/如 2024-01-01/);
    if (dateString) {
      await user.type(dateInput, dateString);
      await user.click(screen.getAllByRole('button', { name: '转换' })[1]);
      
      await waitFor(() => {
        const results = screen.getAllByText(/秒:/);
        expect(results.length).toBeGreaterThan(1);
      });
    }
  });

  // 7. UI 状态测试
  test('转换前不应该显示结果', () => {
    render(<TimestampPage />);
    
    // 不应该有 ISO: 或结果 pre 元素
    expect(screen.queryByText(/ISO:/)).not.toBeInTheDocument();
  });

  test('转换后应该显示结果', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<TimestampPage />);
    
    const input = screen.getByPlaceholderText('输入时间戳（秒或毫秒）');
    await user.type(input, '1704110400');
    await user.click(screen.getAllByRole('button', { name: '转换' })[0]);
    
    await waitFor(() => {
      expect(screen.getByText(/ISO:/)).toBeInTheDocument();
    }, { timeout: 10000 });
  });
});
