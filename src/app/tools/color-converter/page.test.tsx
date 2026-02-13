import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import ColorConverter from './page';

describe('颜色转换工具', () => {
  test('应该正确渲染工具界面', () => {
    render(<ColorConverter />);
    expect(screen.getByText('颜色转换')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('#6366f1')).toBeInTheDocument();
  });

  test('应该显示所有颜色格式', () => {
    render(<ColorConverter />);
    expect(screen.getByText('HEX')).toBeInTheDocument();
    expect(screen.getByText('RGB')).toBeInTheDocument();
    expect(screen.getByText('HSL')).toBeInTheDocument();
  });

  test('应该正确转换HEX到RGB', () => {
    render(<ColorConverter />);
    expect(screen.getByText(/rgb\(/)).toBeInTheDocument();
  });

  test('应该正确转换HEX到HSL', () => {
    render(<ColorConverter />);
    expect(screen.getByText(/hsl\(/)).toBeInTheDocument();
  });

  test('应该支持输入HEX值', async () => {
    const user = userEvent.setup();
    render(<ColorConverter />);
    
    const input = screen.getByPlaceholderText('#6366f1');
    await user.clear(input);
    await user.type(input, '#ff0000');
    
    expect(screen.getByText(/rgb\(255, 0, 0\)/)).toBeInTheDocument();
  });

  test('应该支持复制颜色值', async () => {
    const user = userEvent.setup();
    const writeTextMock = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      writable: true,
    });
    
    render(<ColorConverter />);
    
    const copyButtons = screen.getAllByRole('button', { name: '复制' });
    await user.click(copyButtons[0]);
    
    expect(writeTextMock).toHaveBeenCalled();
  });
});
