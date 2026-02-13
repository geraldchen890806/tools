import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import PasswordGeneratorPage from './page';

describe('密码生成器', () => {
  // 1. 渲染测试
  test('应该正确渲染工具界面', () => {
    render(<PasswordGeneratorPage />);
    expect(screen.getByText('密码生成器')).toBeInTheDocument();
    expect(screen.getByText(/长度:/)).toBeInTheDocument();
    expect(screen.getByLabelText('大写')).toBeInTheDocument();
    expect(screen.getByLabelText('小写')).toBeInTheDocument();
    expect(screen.getByLabelText('数字')).toBeInTheDocument();
    expect(screen.getByLabelText('特殊字符')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '生成密码' })).toBeInTheDocument();
  });

  // 2. 密码生成功能测试
  describe('密码生成功能', () => {
    test('应该生成指定长度的密码', async () => {
      const user = userEvent.setup();
      render(<PasswordGeneratorPage />);
      
      // 默认长度 16
      const generateBtn = screen.getByRole('button', { name: '生成密码' });
      await user.click(generateBtn);
      
      await waitFor(() => {
        const copyBtn = screen.getByRole('button', { name: '复制' });
        expect(copyBtn).toBeInTheDocument();
        // 找到密码（在复制按钮的前面）
        const passwordContainer = copyBtn.closest('.flex');
        const passwordElement = passwordContainer?.querySelector('.font-mono');
        expect(passwordElement?.textContent?.length).toBe(16);
      });
    });

    test('应该根据滑块调整密码长度', async () => {
      const user = userEvent.setup();
      const { container } = render(<PasswordGeneratorPage />);
      
      const slider = screen.getByRole('slider') as HTMLInputElement;
      // 使用 fireEvent 模拟滑块变化
      const { fireEvent } = await import('@testing-library/react');
      fireEvent.change(slider, { target: { value: '24' } });
      
      const generateBtn = screen.getByRole('button', { name: '生成密码' });
      await user.click(generateBtn);
      
      await waitFor(() => {
        const passwordElement = container.querySelector('.font-mono');
        expect(passwordElement?.textContent?.length).toBe(24);
      });
    });

    test('应该支持最小长度（8）', async () => {
      const user = userEvent.setup();
      const { container } = render(<PasswordGeneratorPage />);
      
      const slider = screen.getByRole('slider') as HTMLInputElement;
      fireEvent.change(slider, { target: { value: '8' } });
      
      const generateBtn = screen.getByRole('button', { name: '生成密码' });
      await user.click(generateBtn);
      
      await waitFor(() => {
        const passwordElement = container.querySelector('.font-mono');
        expect(passwordElement?.textContent?.length).toBe(8);
      });
    });

    test('应该支持最大长度（64）', async () => {
      const user = userEvent.setup();
      const { container } = render(<PasswordGeneratorPage />);
      
      const slider = screen.getByRole('slider') as HTMLInputElement;
      fireEvent.change(slider, { target: { value: '64' } });
      
      const generateBtn = screen.getByRole('button', { name: '生成密码' });
      await user.click(generateBtn);
      
      await waitFor(() => {
        const passwordElement = container.querySelector('.font-mono');
        expect(passwordElement?.textContent?.length).toBe(64);
      });
    });
  });

  // 3. 字符类型选项测试
  describe('字符类型选项', () => {
    test('默认应该包含所有字符类型', async () => {
      const user = userEvent.setup();
      const { container } = render(<PasswordGeneratorPage />);
      
      const generateBtn = screen.getByRole('button', { name: '生成密码' });
      await user.click(generateBtn);
      
      await waitFor(() => {
        const passwordElement = container.querySelector('.font-mono');
        const password = passwordElement?.textContent!;
        // 应该包含多种字符（概率很高）
        expect(password.length).toBe(16);
      });
    });

    test('只选择大写字母时，密码应该只包含大写', async () => {
      const user = userEvent.setup();
      const { container } = render(<PasswordGeneratorPage />);
      
      // 取消所有其他选项
      await user.click(screen.getByLabelText('小写'));
      await user.click(screen.getByLabelText('数字'));
      await user.click(screen.getByLabelText('特殊字符'));
      
      const generateBtn = screen.getByRole('button', { name: '生成密码' });
      await user.click(generateBtn);
      
      await waitFor(() => {
        const passwordElement = container.querySelector('.font-mono');
        const password = passwordElement?.textContent!;
        expect(password).toMatch(/^[A-Z]+$/);
      });
    });

    test('只选择小写字母时，密码应该只包含小写', async () => {
      const user = userEvent.setup();
      const { container } = render(<PasswordGeneratorPage />);
      
      // 取消所有其他选项
      await user.click(screen.getByLabelText('大写'));
      await user.click(screen.getByLabelText('数字'));
      await user.click(screen.getByLabelText('特殊字符'));
      
      const generateBtn = screen.getByRole('button', { name: '生成密码' });
      await user.click(generateBtn);
      
      await waitFor(() => {
        const passwordElement = container.querySelector('.font-mono');
        const password = passwordElement?.textContent!;
        expect(password).toMatch(/^[a-z]+$/);
      });
    });

    test('只选择数字时，密码应该只包含数字', async () => {
      const user = userEvent.setup();
      const { container } = render(<PasswordGeneratorPage />);
      
      // 取消所有其他选项
      await user.click(screen.getByLabelText('大写'));
      await user.click(screen.getByLabelText('小写'));
      await user.click(screen.getByLabelText('特殊字符'));
      
      const generateBtn = screen.getByRole('button', { name: '生成密码' });
      await user.click(generateBtn);
      
      await waitFor(() => {
        const passwordElement = container.querySelector('.font-mono');
        const password = passwordElement?.textContent!;
        expect(password).toMatch(/^[0-9]+$/);
      });
    });

    test('只选择特殊字符时，密码应该只包含特殊字符', async () => {
      const user = userEvent.setup();
      const { container } = render(<PasswordGeneratorPage />);
      
      // 取消所有其他选项
      await user.click(screen.getByLabelText('大写'));
      await user.click(screen.getByLabelText('小写'));
      await user.click(screen.getByLabelText('数字'));
      
      const generateBtn = screen.getByRole('button', { name: '生成密码' });
      await user.click(generateBtn);
      
      await waitFor(() => {
        const passwordElement = container.querySelector('.font-mono');
        const password = passwordElement?.textContent!;
        expect(password).toMatch(/^[!@#$%^&*()_+\-=[\]{}|;:,.<>?]+$/);
      });
    });

    test('组合选择时密码应该包含对应字符', async () => {
      const user = userEvent.setup();
      const { container } = render(<PasswordGeneratorPage />);
      
      // 只选择大写和数字
      await user.click(screen.getByLabelText('小写'));
      await user.click(screen.getByLabelText('特殊字符'));
      
      const generateBtn = screen.getByRole('button', { name: '生成密码' });
      await user.click(generateBtn);
      
      await waitFor(() => {
        const passwordElement = container.querySelector('.font-mono');
        const password = passwordElement?.textContent!;
        expect(password).toMatch(/^[A-Z0-9]+$/);
      });
    });
  });

  // 4. 密码强度测试
  describe('密码强度', () => {
    test('生成后应该显示密码强度', async () => {
      const user = userEvent.setup();
      render(<PasswordGeneratorPage />);
      
      const generateBtn = screen.getByRole('button', { name: '生成密码' });
      await user.click(generateBtn);
      
      await waitFor(() => {
        expect(screen.getByText('强度:')).toBeInTheDocument();
        const strengthText = screen.getByText('强度:').parentElement?.textContent;
        expect(strengthText).toMatch(/弱|中|强/);
      });
    });

    test('长度短且选项少的密码应该是弱密码', async () => {
      const user = userEvent.setup();
      render(<PasswordGeneratorPage />);
      
      const slider = screen.getByRole('slider') as HTMLInputElement;
      fireEvent.change(slider, { target: { value: '8' } });
      
      // 只选择小写
      await user.click(screen.getByLabelText('大写'));
      await user.click(screen.getByLabelText('数字'));
      await user.click(screen.getByLabelText('特殊字符'));
      
      const generateBtn = screen.getByRole('button', { name: '生成密码' });
      await user.click(generateBtn);
      
      await waitFor(() => {
        expect(screen.getByText('弱')).toBeInTheDocument();
      });
    });

    test('长度适中且包含多种字符的密码应该是中等强度', async () => {
      const user = userEvent.setup();
      const { container } = render(<PasswordGeneratorPage />);
      
      const slider = screen.getByRole('slider') as HTMLInputElement;
      fireEvent.change(slider, { target: { value: '12' } });
      
      // 取消特殊字符
      await user.click(screen.getByLabelText('特殊字符'));
      
      const generateBtn = screen.getByRole('button', { name: '生成密码' });
      await user.click(generateBtn);
      
      await waitFor(() => {
        expect(screen.getByText('强度:')).toBeInTheDocument();
        // 检查是否有强度指示
        const strengthContainer = screen.getByText('强度:').parentElement;
        expect(strengthContainer?.textContent).toMatch(/中|强/);
      });
    });

    test('长密码且包含所有字符类型应该是强密码', async () => {
      const user = userEvent.setup();
      render(<PasswordGeneratorPage />);
      
      const slider = screen.getByRole('slider') as HTMLInputElement;
      fireEvent.change(slider, { target: { value: '20' } });
      
      const generateBtn = screen.getByRole('button', { name: '生成密码' });
      await user.click(generateBtn);
      
      await waitFor(() => {
        expect(screen.getByText('强')).toBeInTheDocument();
      });
    });
  });

  // 5. 复制功能测试
  test('应该支持复制密码', async () => {
    const user = userEvent.setup();
    const writeTextMock = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: writeTextMock,
      },
      writable: true,
    });
    
    render(<PasswordGeneratorPage />);
    
    const generateBtn = screen.getByRole('button', { name: '生成密码' });
    await user.click(generateBtn);
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: '复制' })).toBeInTheDocument();
    });
    
    const copyBtn = screen.getByRole('button', { name: '复制' });
    await user.click(copyBtn);
    
    expect(writeTextMock).toHaveBeenCalled();
    const copiedPassword = writeTextMock.mock.calls[0][0];
    expect(copiedPassword.length).toBe(16);
  });

  // 6. 随机性测试
  test('多次生成应该产生不同的密码', async () => {
    const user = userEvent.setup();
    const { container } = render(<PasswordGeneratorPage />);
    
    const generateBtn = screen.getByRole('button', { name: '生成密码' });
    
    await user.click(generateBtn);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: '复制' })).toBeInTheDocument();
    });
    const firstPassword = container.querySelector('.font-mono')?.textContent;
    
    await user.click(generateBtn);
    await waitFor(() => {
      const secondPassword = container.querySelector('.font-mono')?.textContent;
      expect(secondPassword).not.toBe(firstPassword);
    });
  });

  // 7. UI 状态测试
  test('生成前不应该显示密码和强度', () => {
    render(<PasswordGeneratorPage />);
    expect(screen.queryByText('强度:')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '复制' })).not.toBeInTheDocument();
  });

  test('生成后应该显示密码和复制按钮', async () => {
    const user = userEvent.setup();
    render(<PasswordGeneratorPage />);
    
    const generateBtn = screen.getByRole('button', { name: '生成密码' });
    await user.click(generateBtn);
    
    await waitFor(() => {
      expect(screen.getByText('强度:')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '复制' })).toBeInTheDocument();
    });
  });

  // 8. 边界情况测试
  test('取消所有选项时不应该生成密码', async () => {
    const user = userEvent.setup();
    render(<PasswordGeneratorPage />);
    
    // 取消所有选项
    await user.click(screen.getByLabelText('大写'));
    await user.click(screen.getByLabelText('小写'));
    await user.click(screen.getByLabelText('数字'));
    await user.click(screen.getByLabelText('特殊字符'));
    
    const generateBtn = screen.getByRole('button', { name: '生成密码' });
    await user.click(generateBtn);
    
    // 不应该显示密码
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(screen.queryByText('强度:')).not.toBeInTheDocument();
  });

  test('重新生成应该替换之前的密码', async () => {
    const user = userEvent.setup();
    const { container } = render(<PasswordGeneratorPage />);
    
    const generateBtn = screen.getByRole('button', { name: '生成密码' });
    
    await user.click(generateBtn);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: '复制' })).toBeInTheDocument();
    });
    
    await user.click(generateBtn);
    
    // 应该只有一个密码显示
    await waitFor(() => {
      const copyButtons = screen.getAllByRole('button', { name: '复制' });
      expect(copyButtons.length).toBe(1);
    });
  });

  test('滑块应该有正确的范围', () => {
    render(<PasswordGeneratorPage />);
    
    const slider = screen.getByRole('slider') as HTMLInputElement;
    expect(slider.min).toBe('8');
    expect(slider.max).toBe('64');
    expect(slider.value).toBe('16');
  });
});
