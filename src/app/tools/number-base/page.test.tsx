import { render, screen, waitFor } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import NumberBasePage from './page';

describe('进制转换工具', () => {
  // 1. 渲染测试
  test('应该正确渲染工具界面', () => {
    render(<NumberBasePage />);
    expect(screen.getByText('进制转换')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('输入数字')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '转换' })).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  // 2. 十进制转换测试
  describe('十进制转换', () => {
    test('应该正确转换十进制到所有进制', async () => {
      const user = userEvent.setup();
      render(<NumberBasePage />);
      
      const input = screen.getByPlaceholderText('输入数字');
      await user.type(input, '255');
      
      const convertBtn = screen.getByRole('button', { name: '转换' });
      await user.click(convertBtn);
      
      await waitFor(() => {
        expect(screen.getByText('11111111')).toBeInTheDocument(); // 二进制
        expect(screen.getByText('377')).toBeInTheDocument(); // 八进制
        expect(screen.getByText('255')).toBeInTheDocument(); // 十进制
        expect(screen.getByText('FF')).toBeInTheDocument(); // 十六进制
      });
    });

    test('应该正确转换小数字', async () => {
      const user = userEvent.setup();
      render(<NumberBasePage />);
      
      const input = screen.getByPlaceholderText('输入数字');
      await user.type(input, '10');
      
      const convertBtn = screen.getByRole('button', { name: '转换' });
      await user.click(convertBtn);
      
      await waitFor(() => {
        expect(screen.getByText('1010')).toBeInTheDocument(); // 二进制
        expect(screen.getByText('12')).toBeInTheDocument(); // 八进制
        expect(screen.getByText('10')).toBeInTheDocument(); // 十进制
        expect(screen.getByText('A')).toBeInTheDocument(); // 十六进制
      });
    });

    test('应该正确转换大数字', async () => {
      const user = userEvent.setup();
      render(<NumberBasePage />);
      
      const input = screen.getByPlaceholderText('输入数字');
      await user.type(input, '65535');
      
      const convertBtn = screen.getByRole('button', { name: '转换' });
      await user.click(convertBtn);
      
      await waitFor(() => {
        expect(screen.getByText('1111111111111111')).toBeInTheDocument(); // 二进制
        expect(screen.getByText('177777')).toBeInTheDocument(); // 八进制
        expect(screen.getByText('65535')).toBeInTheDocument(); // 十进制
        expect(screen.getByText('FFFF')).toBeInTheDocument(); // 十六进制
      });
    });
  });

  // 3. 二进制转换测试
  describe('二进制转换', () => {
    test('应该正确转换二进制到其他进制', async () => {
      const user = userEvent.setup();
      render(<NumberBasePage />);
      
      const input = screen.getByPlaceholderText('输入数字');
      await user.type(input, '1010');
      
      // 选择二进制作为源
      const select = screen.getByRole('combobox');
      await user.selectOptions(select, '2');
      
      const convertBtn = screen.getByRole('button', { name: '转换' });
      await user.click(convertBtn);
      
      await waitFor(() => {
        expect(screen.getByText('1010')).toBeInTheDocument(); // 二进制
        expect(screen.getByText('12')).toBeInTheDocument(); // 八进制
        expect(screen.getByText('10')).toBeInTheDocument(); // 十进制
        expect(screen.getByText('A')).toBeInTheDocument(); // 十六进制
      });
    });

    test('应该处理无效的二进制输入', async () => {
      const user = userEvent.setup();
      render(<NumberBasePage />);
      
      const input = screen.getByPlaceholderText('输入数字');
      await user.type(input, '1012'); // 包含非法字符 2
      
      const select = screen.getByRole('combobox');
      await user.selectOptions(select, '2');
      
      const convertBtn = screen.getByRole('button', { name: '转换' });
      await user.click(convertBtn);
      
      await waitFor(() => {
        expect(screen.getByText('无效输入')).toBeInTheDocument();
      });
    });
  });

  // 4. 八进制转换测试
  describe('八进制转换', () => {
    test('应该正确转换八进制到其他进制', async () => {
      const user = userEvent.setup();
      render(<NumberBasePage />);
      
      const input = screen.getByPlaceholderText('输入数字');
      await user.type(input, '377');
      
      const select = screen.getByRole('combobox');
      await user.selectOptions(select, '8');
      
      const convertBtn = screen.getByRole('button', { name: '转换' });
      await user.click(convertBtn);
      
      await waitFor(() => {
        expect(screen.getByText('11111111')).toBeInTheDocument(); // 二进制
        expect(screen.getByText('377')).toBeInTheDocument(); // 八进制
        expect(screen.getByText('255')).toBeInTheDocument(); // 十进制
        expect(screen.getByText('FF')).toBeInTheDocument(); // 十六进制
      });
    });

    test('应该处理无效的八进制输入', async () => {
      const user = userEvent.setup();
      render(<NumberBasePage />);
      
      const input = screen.getByPlaceholderText('输入数字');
      await user.type(input, '789'); // 包含非法字符 8 和 9
      
      const select = screen.getByRole('combobox');
      await user.selectOptions(select, '8');
      
      const convertBtn = screen.getByRole('button', { name: '转换' });
      await user.click(convertBtn);
      
      await waitFor(() => {
        expect(screen.getByText('无效输入')).toBeInTheDocument();
      });
    });
  });

  // 5. 十六进制转换测试
  describe('十六进制转换', () => {
    test('应该正确转换十六进制到其他进制', async () => {
      const user = userEvent.setup();
      render(<NumberBasePage />);
      
      const input = screen.getByPlaceholderText('输入数字');
      await user.type(input, 'FF');
      
      const select = screen.getByRole('combobox');
      await user.selectOptions(select, '16');
      
      const convertBtn = screen.getByRole('button', { name: '转换' });
      await user.click(convertBtn);
      
      await waitFor(() => {
        expect(screen.getByText('11111111')).toBeInTheDocument(); // 二进制
        expect(screen.getByText('377')).toBeInTheDocument(); // 八进制
        expect(screen.getByText('255')).toBeInTheDocument(); // 十进制
        expect(screen.getByText('FF')).toBeInTheDocument(); // 十六进制
      });
    });

    test('应该正确处理小写十六进制', async () => {
      const user = userEvent.setup();
      render(<NumberBasePage />);
      
      const input = screen.getByPlaceholderText('输入数字');
      await user.type(input, 'ff');
      
      const select = screen.getByRole('combobox');
      await user.selectOptions(select, '16');
      
      const convertBtn = screen.getByRole('button', { name: '转换' });
      await user.click(convertBtn);
      
      await waitFor(() => {
        expect(screen.getByText('FF')).toBeInTheDocument(); // 应该转为大写
      });
    });

    test('应该处理包含字母的十六进制', async () => {
      const user = userEvent.setup();
      render(<NumberBasePage />);
      
      const input = screen.getByPlaceholderText('输入数字');
      await user.type(input, 'ABCD');
      
      const select = screen.getByRole('combobox');
      await user.selectOptions(select, '16');
      
      const convertBtn = screen.getByRole('button', { name: '转换' });
      await user.click(convertBtn);
      
      await waitFor(() => {
        expect(screen.getByText('ABCD')).toBeInTheDocument();
      });
    });
  });

  // 6. 特殊情况测试
  describe('特殊情况', () => {
    test('应该正确转换 0', async () => {
      const user = userEvent.setup();
      render(<NumberBasePage />);
      
      const input = screen.getByPlaceholderText('输入数字');
      await user.type(input, '0');
      
      const convertBtn = screen.getByRole('button', { name: '转换' });
      await user.click(convertBtn);
      
      await waitFor(() => {
        const results = screen.getAllByText('0');
        expect(results.length).toBeGreaterThanOrEqual(4); // 所有进制都应该是 0
      });
    });

    test('应该处理空输入', async () => {
      const user = userEvent.setup();
      render(<NumberBasePage />);
      
      const convertBtn = screen.getByRole('button', { name: '转换' });
      await user.click(convertBtn);
      
      await waitFor(() => {
        expect(screen.getByText('无效输入')).toBeInTheDocument();
      });
    });

    test('应该处理非数字输入', async () => {
      const user = userEvent.setup();
      render(<NumberBasePage />);
      
      const input = screen.getByPlaceholderText('输入数字');
      await user.type(input, 'abc');
      
      const convertBtn = screen.getByRole('button', { name: '转换' });
      await user.click(convertBtn);
      
      await waitFor(() => {
        expect(screen.getByText('无效输入')).toBeInTheDocument();
      });
    });
  });

  // 7. 复制功能测试
  test('应该支持复制每个进制的结果', async () => {
    const user = userEvent.setup();
    const writeTextMock = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: writeTextMock,
      },
      writable: true,
    });
    
    render(<NumberBasePage />);
    
    const input = screen.getByPlaceholderText('输入数字');
    await user.type(input, '255');
    
    const convertBtn = screen.getByRole('button', { name: '转换' });
    await user.click(convertBtn);
    
    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: '复制' }).length).toBe(4);
    });
    
    // 点击第一个复制按钮（二进制）
    const copyButtons = screen.getAllByRole('button', { name: '复制' });
    await user.click(copyButtons[0]);
    
    expect(writeTextMock).toHaveBeenCalledWith('11111111');
  });

  // 8. UI 状态测试
  test('转换前不应该显示结果', () => {
    render(<NumberBasePage />);
    expect(screen.queryByText('二进制 (2)')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '复制' })).not.toBeInTheDocument();
  });

  test('转换后应该显示所有进制的结果', async () => {
    const user = userEvent.setup();
    render(<NumberBasePage />);
    
    const input = screen.getByPlaceholderText('输入数字');
    await user.type(input, '10');
    
    const convertBtn = screen.getByRole('button', { name: '转换' });
    await user.click(convertBtn);
    
    await waitFor(() => {
      expect(screen.getByText('二进制 (2)')).toBeInTheDocument();
      expect(screen.getByText('八进制 (8)')).toBeInTheDocument();
      expect(screen.getByText('十进制 (10)')).toBeInTheDocument();
      expect(screen.getByText('十六进制 (16)')).toBeInTheDocument();
      expect(screen.getAllByRole('button', { name: '复制' }).length).toBe(4);
    });
  });

  test('错误时不应该显示结果', async () => {
    const user = userEvent.setup();
    render(<NumberBasePage />);
    
    const input = screen.getByPlaceholderText('输入数字');
    await user.type(input, 'invalid');
    
    const convertBtn = screen.getByRole('button', { name: '转换' });
    await user.click(convertBtn);
    
    await waitFor(() => {
      expect(screen.getByText('无效输入')).toBeInTheDocument();
      expect(screen.queryByText('二进制 (2)')).not.toBeInTheDocument();
    });
  });

  test('重新转换应该更新结果', async () => {
    const user = userEvent.setup();
    render(<NumberBasePage />);
    
    const input = screen.getByPlaceholderText('输入数字');
    const convertBtn = screen.getByRole('button', { name: '转换' });
    
    // 第一次转换
    await user.type(input, '10');
    await user.click(convertBtn);
    
    await waitFor(() => {
      expect(screen.getByText('A')).toBeInTheDocument();
    });
    
    // 清空并转换新数字
    await user.clear(input);
    await user.type(input, '255');
    await user.click(convertBtn);
    
    await waitFor(() => {
      expect(screen.getByText('FF')).toBeInTheDocument();
      expect(screen.queryByText('A')).not.toBeInTheDocument();
    });
  });

  // 9. 十六进制输出大写测试
  test('十六进制输出应该是大写', async () => {
    const user = userEvent.setup();
    render(<NumberBasePage />);
    
    const input = screen.getByPlaceholderText('输入数字');
    await user.type(input, '10');
    
    const convertBtn = screen.getByRole('button', { name: '转换' });
    await user.click(convertBtn);
    
    await waitFor(() => {
      // 应该是大写 A，不是小写 a
      expect(screen.getByText('A')).toBeInTheDocument();
      expect(screen.queryByText('a')).not.toBeInTheDocument();
    });
  });
});
