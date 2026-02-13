import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import Page from './page';

describe('世界时钟工具', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('应该正确渲染工具界面', () => {
    render(<Page />);
    expect(screen.getByText('世界时钟')).toBeInTheDocument();
  });

  test('应该显示所有城市', () => {
    render(<Page />);
    expect(screen.getByText('北京')).toBeInTheDocument();
    expect(screen.getByText('东京')).toBeInTheDocument();
    expect(screen.getByText('纽约')).toBeInTheDocument();
    expect(screen.getByText('伦敦')).toBeInTheDocument();
    expect(screen.getByText('悉尼')).toBeInTheDocument();
  });

  test('应该显示时间', () => {
    render(<Page />);
    // 时间格式应该是 HH:MM:SS
    const timeElements = screen.getAllByText(/\d{2}:\d{2}:\d{2}/);
    expect(timeElements.length).toBeGreaterThan(0);
  });

  test('应该显示与北京的时差', () => {
    render(<Page />);
    expect(screen.getByText('同北京')).toBeInTheDocument();
  });
});
