import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import Page from './page';

describe('HTTP 状态码工具', () => {
  test('应该正确渲染工具界面', () => {
    render(<Page />);
    expect(screen.getByText('HTTP 状态码')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('搜索状态码或名称...')).toBeInTheDocument();
  });

  test('应该显示所有分组', () => {
    render(<Page />);
    expect(screen.getByText('1xx 信息')).toBeInTheDocument();
    expect(screen.getByText('2xx 成功')).toBeInTheDocument();
    expect(screen.getByText('3xx 重定向')).toBeInTheDocument();
    expect(screen.getByText('4xx 客户端错误')).toBeInTheDocument();
    expect(screen.getByText('5xx 服务器错误')).toBeInTheDocument();
  });

  test('应该显示常见状态码', () => {
    render(<Page />);
    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
  });

  test('应该按状态码搜索', async () => {
    const user = userEvent.setup();
    render(<Page />);
    
    const input = screen.getByPlaceholderText('搜索状态码或名称...');
    await user.type(input, '404');
    
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Not Found')).toBeInTheDocument();
  });

  test('应该按名称搜索', async () => {
    const user = userEvent.setup();
    render(<Page />);
    
    const input = screen.getByPlaceholderText('搜索状态码或名称...');
    await user.type(input, 'ok');
    
    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.getByText('OK')).toBeInTheDocument();
  });

  test('搜索应该不区分大小写', async () => {
    const user = userEvent.setup();
    render(<Page />);
    
    const input = screen.getByPlaceholderText('搜索状态码或名称...');
    await user.type(input, 'FORBIDDEN');
    
    expect(screen.getByText('403')).toBeInTheDocument();
    expect(screen.getByText('Forbidden')).toBeInTheDocument();
  });

  test('无匹配时应该隐藏对应分组', async () => {
    const user = userEvent.setup();
    render(<Page />);
    
    const input = screen.getByPlaceholderText('搜索状态码或名称...');
    await user.type(input, '404');
    
    expect(screen.queryByText('2xx 成功')).not.toBeInTheDocument();
    expect(screen.getByText('4xx 客户端错误')).toBeInTheDocument();
  });

  test('清空搜索应该显示所有状态码', async () => {
    const user = userEvent.setup();
    render(<Page />);
    
    const input = screen.getByPlaceholderText('搜索状态码或名称...');
    await user.type(input, '404');
    
    expect(screen.queryByText('200')).not.toBeInTheDocument();
    
    await user.clear(input);
    
    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.getByText('404')).toBeInTheDocument();
  });
});
