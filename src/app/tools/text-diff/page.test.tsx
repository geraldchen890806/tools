import { render, screen, waitFor } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import TextDiff from './page';

describe('文本对比工具', () => {
  // 1. 渲染测试
  test('应该正确渲染工具界面', () => {
    render(<TextDiff />);
    expect(screen.getByText('文本对比')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('原始文本...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('修改后文本...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '对比' })).toBeInTheDocument();
  });

  // 2. 基础对比功能测试
  describe('基础对比', () => {
    test('应该检测到新增的行', async () => {
      const user = userEvent.setup();
      const { container } = render(<TextDiff />);
      
      const leftTextarea = screen.getByPlaceholderText('原始文本...');
      const rightTextarea = screen.getByPlaceholderText('修改后文本...');
      
      await user.click(leftTextarea);
      await user.paste('Line 1\nLine 2');
      
      await user.click(rightTextarea);
      await user.paste('Line 1\nLine 2\nLine 3');
      
      const compareBtn = screen.getByRole('button', { name: '对比' });
      await user.click(compareBtn);
      
      await waitFor(() => {
        expect(screen.getByText('Line 3')).toBeInTheDocument();
        // 应该有加号标记
        expect(screen.getByText('+')).toBeInTheDocument();
      });
    });

    test('应该检测到删除的行', async () => {
      const user = userEvent.setup();
      render(<TextDiff />);
      
      const leftTextarea = screen.getByPlaceholderText('原始文本...');
      const rightTextarea = screen.getByPlaceholderText('修改后文本...');
      
      await user.click(leftTextarea);
      await user.paste('Line 1\nLine 2\nLine 3');
      
      await user.click(rightTextarea);
      await user.paste('Line 1\nLine 3');
      
      const compareBtn = screen.getByRole('button', { name: '对比' });
      await user.click(compareBtn);
      
      await waitFor(() => {
        // 应该有减号标记
        expect(screen.getByText('-')).toBeInTheDocument();
      });
    });

    test('应该检测到相同的行', async () => {
      const user = userEvent.setup();
      render(<TextDiff />);
      
      const leftTextarea = screen.getByPlaceholderText('原始文本...');
      const rightTextarea = screen.getByPlaceholderText('修改后文本...');
      
      await user.click(leftTextarea);
      await user.paste('Same Line');
      
      await user.click(rightTextarea);
      await user.paste('Same Line');
      
      const compareBtn = screen.getByRole('button', { name: '对比' });
      await user.click(compareBtn);
      
      await waitFor(() => {
        expect(screen.getByText('Same Line')).toBeInTheDocument();
      });
    });
  });

  // 3. 复杂对比测试
  describe('复杂对比', () => {
    test('应该处理多行修改', async () => {
      const user = userEvent.setup();
      render(<TextDiff />);
      
      const leftTextarea = screen.getByPlaceholderText('原始文本...');
      const rightTextarea = screen.getByPlaceholderText('修改后文本...');
      
      await user.click(leftTextarea);
      await user.paste('Line 1\nLine 2\nLine 3');
      
      await user.click(rightTextarea);
      await user.paste('Line 1\nModified Line 2\nLine 3\nLine 4');
      
      const compareBtn = screen.getByRole('button', { name: '对比' });
      await user.click(compareBtn);
      
      await waitFor(() => {
        expect(screen.getByText('Line 1')).toBeInTheDocument();
        expect(screen.getByText('Modified Line 2')).toBeInTheDocument();
        expect(screen.getByText('Line 4')).toBeInTheDocument();
      });
    });

    test('应该处理完全不同的文本', async () => {
      const user = userEvent.setup();
      render(<TextDiff />);
      
      const leftTextarea = screen.getByPlaceholderText('原始文本...');
      const rightTextarea = screen.getByPlaceholderText('修改后文本...');
      
      await user.click(leftTextarea);
      await user.paste('AAA\nBBB\nCCC');
      
      await user.click(rightTextarea);
      await user.paste('XXX\nYYY\nZZZ');
      
      const compareBtn = screen.getByRole('button', { name: '对比' });
      await user.click(compareBtn);
      
      await waitFor(() => {
        // 应该显示所有行都有变化
        const minusSigns = screen.getAllByText('-');
        const plusSigns = screen.getAllByText('+');
        expect(minusSigns.length).toBeGreaterThan(0);
        expect(plusSigns.length).toBeGreaterThan(0);
      });
    });

    test('应该处理空行', async () => {
      const user = userEvent.setup();
      render(<TextDiff />);
      
      const leftTextarea = screen.getByPlaceholderText('原始文本...');
      const rightTextarea = screen.getByPlaceholderText('修改后文本...');
      
      await user.click(leftTextarea);
      await user.paste('Line 1\n\nLine 3');
      
      await user.click(rightTextarea);
      await user.paste('Line 1\n\nLine 3');
      
      const compareBtn = screen.getByRole('button', { name: '对比' });
      await user.click(compareBtn);
      
      await waitFor(() => {
        expect(screen.getByText('Line 1')).toBeInTheDocument();
        expect(screen.getByText('Line 3')).toBeInTheDocument();
      });
    });
  });

  // 4. 边界情况测试
  describe('边界情况', () => {
    test('应该处理两边都为空', async () => {
      const user = userEvent.setup();
      render(<TextDiff />);
      
      const compareBtn = screen.getByRole('button', { name: '对比' });
      await user.click(compareBtn);
      
      // 不应该显示任何差异内容
      await waitFor(() => {
        const diffContainer = document.querySelector('.font-mono');
        expect(diffContainer).not.toBeInTheDocument();
      });
    });

    test('应该处理左侧为空', async () => {
      const user = userEvent.setup();
      render(<TextDiff />);
      
      const rightTextarea = screen.getByPlaceholderText('修改后文本...');
      await user.click(rightTextarea);
      await user.paste('New Line');
      
      const compareBtn = screen.getByRole('button', { name: '对比' });
      await user.click(compareBtn);
      
      await waitFor(() => {
        expect(screen.getByText('New Line')).toBeInTheDocument();
        expect(screen.getByText('+')).toBeInTheDocument();
      });
    });

    test('应该处理右侧为空', async () => {
      const user = userEvent.setup();
      render(<TextDiff />);
      
      const leftTextarea = screen.getByPlaceholderText('原始文本...');
      await user.click(leftTextarea);
      await user.paste('Deleted Line');
      
      const compareBtn = screen.getByRole('button', { name: '对比' });
      await user.click(compareBtn);
      
      await waitFor(() => {
        expect(screen.getByText('Deleted Line')).toBeInTheDocument();
        expect(screen.getByText('-')).toBeInTheDocument();
      });
    });

    test('应该处理单行文本', async () => {
      const user = userEvent.setup();
      render(<TextDiff />);
      
      const leftTextarea = screen.getByPlaceholderText('原始文本...');
      const rightTextarea = screen.getByPlaceholderText('修改后文本...');
      
      await user.click(leftTextarea);
      await user.paste('Single line');
      
      await user.click(rightTextarea);
      await user.paste('Single line');
      
      const compareBtn = screen.getByRole('button', { name: '对比' });
      await user.click(compareBtn);
      
      await waitFor(() => {
        expect(screen.getByText('Single line')).toBeInTheDocument();
      });
    });
  });

  // 5. UI 状态测试
  test('对比前不应该显示结果', () => {
    render(<TextDiff />);
    
    const diffContainer = document.querySelector('.font-mono');
    expect(diffContainer).not.toBeInTheDocument();
  });

  test('对比后应该显示结果', async () => {
    const user = userEvent.setup();
    render(<TextDiff />);
    
    const leftTextarea = screen.getByPlaceholderText('原始文本...');
    const rightTextarea = screen.getByPlaceholderText('修改后文本...');
    
    await user.click(leftTextarea);
    await user.paste('Test');
    
    await user.click(rightTextarea);
    await user.paste('Test');
    
    const compareBtn = screen.getByRole('button', { name: '对比' });
    await user.click(compareBtn);
    
    await waitFor(() => {
      const diffContainer = document.querySelector('.font-mono');
      expect(diffContainer).toBeInTheDocument();
    });
  });

  test('重新对比应该更新结果', async () => {
    const user = userEvent.setup();
    render(<TextDiff />);
    
    const leftTextarea = screen.getByPlaceholderText('原始文本...');
    const rightTextarea = screen.getByPlaceholderText('修改后文本...');
    const compareBtn = screen.getByRole('button', { name: '对比' });
    
    // 第一次对比
    await user.click(leftTextarea);
    await user.paste('First');
    await user.click(rightTextarea);
    await user.paste('First');
    await user.click(compareBtn);
    
    await waitFor(() => {
      expect(screen.getByText('First')).toBeInTheDocument();
    });
    
    // 修改内容并重新对比
    await user.clear(leftTextarea);
    await user.clear(rightTextarea);
    await user.click(leftTextarea);
    await user.paste('Second');
    await user.click(rightTextarea);
    await user.paste('Second');
    await user.click(compareBtn);
    
    await waitFor(() => {
      expect(screen.getByText('Second')).toBeInTheDocument();
      expect(screen.queryByText('First')).not.toBeInTheDocument();
    });
  });

  // 6. 视觉标记测试
  test('新增行应该有加号标记', async () => {
    const user = userEvent.setup();
    render(<TextDiff />);
    
    const leftTextarea = screen.getByPlaceholderText('原始文本...');
    const rightTextarea = screen.getByPlaceholderText('修改后文本...');
    
    await user.click(leftTextarea);
    await user.paste('Line 1');
    
    await user.click(rightTextarea);
    await user.paste('Line 1\nLine 2');
    
    const compareBtn = screen.getByRole('button', { name: '对比' });
    await user.click(compareBtn);
    
    await waitFor(() => {
      expect(screen.getByText('+')).toBeInTheDocument();
    });
  });

  test('删除行应该有减号标记', async () => {
    const user = userEvent.setup();
    render(<TextDiff />);
    
    const leftTextarea = screen.getByPlaceholderText('原始文本...');
    const rightTextarea = screen.getByPlaceholderText('修改后文本...');
    
    await user.click(leftTextarea);
    await user.paste('Line 1\nLine 2');
    
    await user.click(rightTextarea);
    await user.paste('Line 1');
    
    const compareBtn = screen.getByRole('button', { name: '对比' });
    await user.click(compareBtn);
    
    await waitFor(() => {
      expect(screen.getByText('-')).toBeInTheDocument();
    });
  });

  // 7. 特殊字符测试
  test('应该正确处理特殊字符', async () => {
    const user = userEvent.setup();
    render(<TextDiff />);
    
    const leftTextarea = screen.getByPlaceholderText('原始文本...');
    const rightTextarea = screen.getByPlaceholderText('修改后文本...');
    
    await user.click(leftTextarea);
    await user.paste('!@#$%^&*()');
    
    await user.click(rightTextarea);
    await user.paste('!@#$%^&*()');
    
    const compareBtn = screen.getByRole('button', { name: '对比' });
    await user.click(compareBtn);
    
    await waitFor(() => {
      expect(screen.getByText('!@#$%^&*()')).toBeInTheDocument();
    });
  });

  test('应该正确处理中文字符', async () => {
    const user = userEvent.setup();
    render(<TextDiff />);
    
    const leftTextarea = screen.getByPlaceholderText('原始文本...');
    const rightTextarea = screen.getByPlaceholderText('修改后文本...');
    
    await user.click(leftTextarea);
    await user.paste('你好世界');
    
    await user.click(rightTextarea);
    await user.paste('你好世界');
    
    const compareBtn = screen.getByRole('button', { name: '对比' });
    await user.click(compareBtn);
    
    await waitFor(() => {
      expect(screen.getByText('你好世界')).toBeInTheDocument();
    });
  });
});
