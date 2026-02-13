import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RandomNumber from './page';

describe('RandomNumber', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: vi.fn(() => Promise.resolve()),
      },
      writable: true,
    });
  });

  it('renders the component', () => {
    render(<RandomNumber />);
    expect(screen.getByText('随机数生成器')).toBeInTheDocument();
  });

  it('shows default values', () => {
    render(<RandomNumber />);
    expect(screen.getByLabelText('最小值')).toHaveValue(1);
    expect(screen.getByLabelText('最大值')).toHaveValue(100);
    expect(screen.getByLabelText('生成数量')).toHaveValue(1);
  });

  it('generates a single random number', async () => {
    const user = userEvent.setup();
    render(<RandomNumber />);

    const generateBtn = screen.getByText('生成随机数');
    await user.click(generateBtn);

    expect(screen.getByText('结果')).toBeInTheDocument();
    expect(screen.getByText('总计: 1 个数字')).toBeInTheDocument();
  });

  it('generates multiple random numbers', async () => {
    const user = userEvent.setup();
    render(<RandomNumber />);

    const countInput = screen.getByLabelText('生成数量');
    await user.clear(countInput);
    await user.type(countInput, '5');

    const generateBtn = screen.getByText('生成随机数');
    await user.click(generateBtn);

    expect(screen.getByText('总计: 5 个数字')).toBeInTheDocument();
  });

  it('validates min < max', async () => {
    const user = userEvent.setup();
    render(<RandomNumber />);

    const minInput = screen.getByLabelText('最小值');
    const maxInput = screen.getByLabelText('最大值');

    await user.clear(minInput);
    await user.type(minInput, '100');
    await user.clear(maxInput);
    await user.type(maxInput, '50');

    const generateBtn = screen.getByText('生成随机数');
    await user.click(generateBtn);

    expect(screen.getByText('最小值必须小于最大值')).toBeInTheDocument();
  });

  it('validates invalid numbers', async () => {
    const user = userEvent.setup();
    render(<RandomNumber />);

    const minInput = screen.getByLabelText('最小值');
    await user.clear(minInput);
    await user.type(minInput, 'abc');

    const generateBtn = screen.getByText('生成随机数');
    await user.click(generateBtn);

    expect(screen.getByText('请输入有效的数字')).toBeInTheDocument();
  });

  it('validates count range', async () => {
    const user = userEvent.setup();
    render(<RandomNumber />);

    const countInput = screen.getByLabelText('生成数量');
    await user.clear(countInput);
    await user.type(countInput, '2000');

    const generateBtn = screen.getByText('生成随机数');
    await user.click(generateBtn);

    expect(screen.getByText('生成数量必须在 1-1000 之间')).toBeInTheDocument();
  });

  it('generates unique numbers', async () => {
    const user = userEvent.setup();
    render(<RandomNumber />);

    const minInput = screen.getByLabelText('最小值');
    const maxInput = screen.getByLabelText('最大值');
    const countInput = screen.getByLabelText('生成数量');

    await user.clear(minInput);
    await user.type(minInput, '1');
    await user.clear(maxInput);
    await user.type(maxInput, '10');
    await user.clear(countInput);
    await user.type(countInput, '10');

    const uniqueCheckbox = screen.getByLabelText('不重复（生成唯一数字）');
    await user.click(uniqueCheckbox);

    const generateBtn = screen.getByText('生成随机数');
    await user.click(generateBtn);

    expect(screen.getByText('总计: 10 个数字')).toBeInTheDocument();
  });

  it('validates unique count does not exceed range', async () => {
    const user = userEvent.setup();
    render(<RandomNumber />);

    const minInput = screen.getByLabelText('最小值');
    const maxInput = screen.getByLabelText('最大值');
    const countInput = screen.getByLabelText('生成数量');

    await user.clear(minInput);
    await user.type(minInput, '1');
    await user.clear(maxInput);
    await user.type(maxInput, '5');
    await user.clear(countInput);
    await user.type(countInput, '10');

    const uniqueCheckbox = screen.getByLabelText('不重复（生成唯一数字）');
    await user.click(uniqueCheckbox);

    const generateBtn = screen.getByText('生成随机数');
    await user.click(generateBtn);

    expect(screen.getByText('不重复模式下，数量不能超过范围大小')).toBeInTheDocument();
  });

  it('shows statistics for multiple numbers', async () => {
    const user = userEvent.setup();
    render(<RandomNumber />);

    const countInput = screen.getByLabelText('生成数量');
    await user.clear(countInput);
    await user.type(countInput, '5');

    const generateBtn = screen.getByText('生成随机数');
    await user.click(generateBtn);

    expect(screen.getByText(/范围:/)).toBeInTheDocument();
    expect(screen.getByText(/平均值:/)).toBeInTheDocument();
  });

  it('displays single number in large font', async () => {
    const user = userEvent.setup();
    render(<RandomNumber />);

    const generateBtn = screen.getByText('生成随机数');
    await user.click(generateBtn);

    const result = screen.getByText(/^\d+$/);
    expect(result).toHaveClass('text-6xl');
  });

  it('copies results to clipboard', async () => {
    const user = userEvent.setup();
    const writeTextMock = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      writable: true,
    });

    render(<RandomNumber />);

    const countInput = screen.getByLabelText('生成数量');
    await user.clear(countInput);
    await user.type(countInput, '3');

    const generateBtn = screen.getByText('生成随机数');
    await user.click(generateBtn);

    const copyBtn = screen.getByText('复制');
    await user.click(copyBtn);

    expect(writeTextMock).toHaveBeenCalled();
  });
});
