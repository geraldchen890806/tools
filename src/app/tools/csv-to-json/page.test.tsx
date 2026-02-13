import { render, screen, waitFor } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import Page from './page';

describe('CSV 转 JSON 工具', () => {
  test('应该正确渲染工具界面', () => {
    render(<Page />);
    expect(screen.getByText('CSV 转 JSON')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /转换/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '复制' })).toBeInTheDocument();
  });

  test('应该能转换简单CSV', async () => {
    const user = userEvent.setup();
    render(<Page />);
    
    const textarea = screen.getByPlaceholderText(/name,age,city/);
    await user.click(textarea);
    await user.paste('name,age\nAlice,30\nBob,25');
    
    const convertBtn = screen.getByRole('button', { name: /转换/ });
    await user.click(convertBtn);
    
    await waitFor(() => {
      const output = screen.getByText(/Alice/);
      expect(output).toBeInTheDocument();
    });
  });

  test('应该处理少于两行的输入', async () => {
    const user = userEvent.setup();
    render(<Page />);
    
    const textarea = screen.getByPlaceholderText(/name,age,city/);
    await user.click(textarea);
    await user.paste('name,age');
    
    await user.click(screen.getByRole('button', { name: /转换/ }));
    
    await waitFor(() => {
      expect(screen.getByText(/需要至少两行/)).toBeInTheDocument();
    });
  });

  test('应该支持复制结果', async () => {
    const user = userEvent.setup();
    const writeTextMock = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      writable: true,
    });
    
    render(<Page />);
    
    const textarea = screen.getByPlaceholderText(/name,age,city/);
    await user.click(textarea);
    await user.paste('name,age\nAlice,30');
    await user.click(screen.getByRole('button', { name: /转换/ }));
    
    await waitFor(() => {
      expect(screen.getByText(/Alice/)).toBeInTheDocument();
    });
    
    await user.click(screen.getByRole('button', { name: '复制' }));
    expect(writeTextMock).toHaveBeenCalled();
  });
});
