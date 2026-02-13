import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import Page from './page';

describe('Cron 表达式工具', () => {
  test('应该正确渲染工具界面', () => {
    render(<Page />);
    expect(screen.getByText('Cron 表达式')).toBeInTheDocument();
    expect(screen.getByText('分')).toBeInTheDocument();
    expect(screen.getByText('时')).toBeInTheDocument();
    expect(screen.getByText('日')).toBeInTheDocument();
    expect(screen.getByText('月')).toBeInTheDocument();
    expect(screen.getByText('周')).toBeInTheDocument();
  });

  test('应该有预设按钮', () => {
    render(<Page />);
    expect(screen.getByRole('button', { name: '每分钟' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '每小时' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '每天 0:00' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '每周一' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '每月1号' })).toBeInTheDocument();
  });

  test('默认应该显示每分钟执行', () => {
    render(<Page />);
    expect(screen.getByText(/每分钟执行/)).toBeInTheDocument();
  });

  test('点击预设应该更新表达式', async () => {
    const user = userEvent.setup();
    render(<Page />);
    
    const btn = screen.getByRole('button', { name: '每小时' });
    await user.click(btn);
    
    expect(screen.getByText(/0 \* \* \* \*/)).toBeInTheDocument();
  });

  test('应该支持手动输入', async () => {
    const user = userEvent.setup();
    render(<Page />);
    
    const inputs = screen.getAllByRole('textbox');
    await user.clear(inputs[0]);
    await user.type(inputs[0], '30');
    
    expect(screen.getByText(/30 \* \* \* \*/)).toBeInTheDocument();
  });

  test('应该显示正确的解释', async () => {
    const user = userEvent.setup();
    render(<Page />);
    
    const btn = screen.getByRole('button', { name: '每天 0:00' });
    await user.click(btn);
    
    expect(screen.getByText(/每天.*00:00.*执行/)).toBeInTheDocument();
  });
});
