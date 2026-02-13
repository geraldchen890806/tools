import { render, screen, waitFor } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import CaseConverter from './page';

describe('大小写转换工具', () => {
  // 1. 渲染测试
  test('应该正确渲染工具界面', () => {
    render(<CaseConverter />);
    expect(screen.getByText('大小写转换')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('输入要转换的文本...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '大写' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '小写' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '首字母大写' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'camelCase' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'snake_case' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'kebab-case' })).toBeInTheDocument();
  });

  // 2. 大写转换测试
  describe('大写转换', () => {
    test('应该将文本转换为大写', async () => {
      const user = userEvent.setup();
      const { container } = render(<CaseConverter />);
      
      const textarea = screen.getByPlaceholderText('输入要转换的文本...');
      await user.type(textarea, 'hello world');
      
      const upperBtn = screen.getByRole('button', { name: '大写' });
      await user.click(upperBtn);
      
      await waitFor(() => {
        const result = container.querySelector('pre');
        expect(result?.textContent).toBe('HELLO WORLD');
      });
    });

    test('应该正确处理中文和特殊字符', async () => {
      const user = userEvent.setup();
      const { container } = render(<CaseConverter />);
      
      const textarea = screen.getByPlaceholderText('输入要转换的文本...');
      await user.type(textarea, 'hello 世界 123!');
      
      const upperBtn = screen.getByRole('button', { name: '大写' });
      await user.click(upperBtn);
      
      await waitFor(() => {
        const result = container.querySelector('pre');
        expect(result?.textContent).toBe('HELLO 世界 123!');
      });
    });
  });

  // 3. 小写转换测试
  describe('小写转换', () => {
    test('应该将文本转换为小写', async () => {
      const user = userEvent.setup();
      const { container } = render(<CaseConverter />);
      
      const textarea = screen.getByPlaceholderText('输入要转换的文本...');
      await user.type(textarea, 'HELLO WORLD');
      
      const lowerBtn = screen.getByRole('button', { name: '小写' });
      await user.click(lowerBtn);
      
      await waitFor(() => {
        const result = container.querySelector('pre');
        expect(result?.textContent).toBe('hello world');
      });
    });

    test('应该处理混合大小写', async () => {
      const user = userEvent.setup();
      const { container } = render(<CaseConverter />);
      
      const textarea = screen.getByPlaceholderText('输入要转换的文本...');
      await user.type(textarea, 'HeLLo WoRLd');
      
      const lowerBtn = screen.getByRole('button', { name: '小写' });
      await user.click(lowerBtn);
      
      await waitFor(() => {
        const result = container.querySelector('pre');
        expect(result?.textContent).toBe('hello world');
      });
    });
  });

  // 4. 首字母大写转换测试
  describe('首字母大写转换', () => {
    test('应该将每个单词的首字母转换为大写', async () => {
      const user = userEvent.setup();
      const { container } = render(<CaseConverter />);
      
      const textarea = screen.getByPlaceholderText('输入要转换的文本...');
      await user.type(textarea, 'hello world test');
      
      const titleBtn = screen.getByRole('button', { name: '首字母大写' });
      await user.click(titleBtn);
      
      await waitFor(() => {
        const result = container.querySelector('pre');
        expect(result?.textContent).toBe('Hello World Test');
      });
    });

    test('应该处理已有大写字母', async () => {
      const user = userEvent.setup();
      const { container } = render(<CaseConverter />);
      
      const textarea = screen.getByPlaceholderText('输入要转换的文本...');
      await user.type(textarea, 'HELLO WORLD');
      
      const titleBtn = screen.getByRole('button', { name: '首字母大写' });
      await user.click(titleBtn);
      
      await waitFor(() => {
        const result = container.querySelector('pre');
        expect(result?.textContent).toBe('HELLO WORLD');
      });
    });
  });

  // 5. camelCase 转换测试
  describe('camelCase 转换', () => {
    test('应该转换为驼峰命名', async () => {
      const user = userEvent.setup();
      const { container } = render(<CaseConverter />);
      
      const textarea = screen.getByPlaceholderText('输入要转换的文本...');
      await user.type(textarea, 'hello world test');
      
      const camelBtn = screen.getByRole('button', { name: 'camelCase' });
      await user.click(camelBtn);
      
      await waitFor(() => {
        const result = container.querySelector('pre');
        expect(result?.textContent).toBe('helloWorldTest');
      });
    });

    test('应该处理下划线分隔', async () => {
      const user = userEvent.setup();
      const { container } = render(<CaseConverter />);
      
      const textarea = screen.getByPlaceholderText('输入要转换的文本...');
      await user.type(textarea, 'hello_world_test');
      
      const camelBtn = screen.getByRole('button', { name: 'camelCase' });
      await user.click(camelBtn);
      
      await waitFor(() => {
        const result = container.querySelector('pre');
        expect(result?.textContent).toBe('helloWorldTest');
      });
    });

    test('应该处理连字符分隔', async () => {
      const user = userEvent.setup();
      const { container } = render(<CaseConverter />);
      
      const textarea = screen.getByPlaceholderText('输入要转换的文本...');
      await user.type(textarea, 'hello-world-test');
      
      const camelBtn = screen.getByRole('button', { name: 'camelCase' });
      await user.click(camelBtn);
      
      await waitFor(() => {
        const result = container.querySelector('pre');
        expect(result?.textContent).toBe('helloWorldTest');
      });
    });
  });

  // 6. snake_case 转换测试
  describe('snake_case 转换', () => {
    test('应该转换为蛇形命名', async () => {
      const user = userEvent.setup();
      const { container } = render(<CaseConverter />);
      
      const textarea = screen.getByPlaceholderText('输入要转换的文本...');
      await user.type(textarea, 'hello world test');
      
      const snakeBtn = screen.getByRole('button', { name: 'snake_case' });
      await user.click(snakeBtn);
      
      await waitFor(() => {
        const result = container.querySelector('pre');
        expect(result?.textContent).toBe('hello_world_test');
      });
    });

    test('应该处理驼峰命名', async () => {
      const user = userEvent.setup();
      const { container } = render(<CaseConverter />);
      
      const textarea = screen.getByPlaceholderText('输入要转换的文本...');
      await user.type(textarea, 'helloWorldTest');
      
      const snakeBtn = screen.getByRole('button', { name: 'snake_case' });
      await user.click(snakeBtn);
      
      await waitFor(() => {
        const result = container.querySelector('pre');
        expect(result?.textContent).toBe('hello_world_test');
      });
    });

    test('应该处理连字符分隔', async () => {
      const user = userEvent.setup();
      const { container } = render(<CaseConverter />);
      
      const textarea = screen.getByPlaceholderText('输入要转换的文本...');
      await user.type(textarea, 'hello-world-test');
      
      const snakeBtn = screen.getByRole('button', { name: 'snake_case' });
      await user.click(snakeBtn);
      
      await waitFor(() => {
        const result = container.querySelector('pre');
        expect(result?.textContent).toBe('hello_world_test');
      });
    });
  });

  // 7. kebab-case 转换测试
  describe('kebab-case 转换', () => {
    test('应该转换为短横线命名', async () => {
      const user = userEvent.setup();
      const { container } = render(<CaseConverter />);
      
      const textarea = screen.getByPlaceholderText('输入要转换的文本...');
      await user.type(textarea, 'hello world test');
      
      const kebabBtn = screen.getByRole('button', { name: 'kebab-case' });
      await user.click(kebabBtn);
      
      await waitFor(() => {
        const result = container.querySelector('pre');
        expect(result?.textContent).toBe('hello-world-test');
      });
    });

    test('应该处理驼峰命名', async () => {
      const user = userEvent.setup();
      const { container } = render(<CaseConverter />);
      
      const textarea = screen.getByPlaceholderText('输入要转换的文本...');
      await user.type(textarea, 'helloWorldTest');
      
      const kebabBtn = screen.getByRole('button', { name: 'kebab-case' });
      await user.click(kebabBtn);
      
      await waitFor(() => {
        const result = container.querySelector('pre');
        expect(result?.textContent).toBe('hello-world-test');
      });
    });

    test('应该处理下划线分隔', async () => {
      const user = userEvent.setup();
      const { container } = render(<CaseConverter />);
      
      const textarea = screen.getByPlaceholderText('输入要转换的文本...');
      await user.type(textarea, 'hello_world_test');
      
      const kebabBtn = screen.getByRole('button', { name: 'kebab-case' });
      await user.click(kebabBtn);
      
      await waitFor(() => {
        const result = container.querySelector('pre');
        expect(result?.textContent).toBe('hello-world-test');
      });
    });
  });

  // 8. 复制功能测试
  test('应该支持复制结果', async () => {
    const user = userEvent.setup();
    const writeTextMock = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: writeTextMock,
      },
      writable: true,
    });
    
    render(<CaseConverter />);
    
    const textarea = screen.getByPlaceholderText('输入要转换的文本...');
    await user.type(textarea, 'hello world');
    
    const upperBtn = screen.getByRole('button', { name: '大写' });
    await user.click(upperBtn);
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: '复制' })).toBeInTheDocument();
    });
    
    const copyBtn = screen.getByRole('button', { name: '复制' });
    await user.click(copyBtn);
    
    expect(writeTextMock).toHaveBeenCalledWith('HELLO WORLD');
  });

  // 9. UI 状态测试
  test('转换前不应该显示结果', () => {
    const { container } = render(<CaseConverter />);
    expect(container.querySelector('pre')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '复制' })).not.toBeInTheDocument();
  });

  test('转换后应该显示结果和复制按钮', async () => {
    const user = userEvent.setup();
    const { container } = render(<CaseConverter />);
    
    const textarea = screen.getByPlaceholderText('输入要转换的文本...');
    await user.type(textarea, 'test');
    
    const upperBtn = screen.getByRole('button', { name: '大写' });
    await user.click(upperBtn);
    
    await waitFor(() => {
      expect(container.querySelector('pre')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '复制' })).toBeInTheDocument();
    });
  });

  test('切换转换方式应该更新结果', async () => {
    const user = userEvent.setup();
    const { container } = render(<CaseConverter />);
    
    const textarea = screen.getByPlaceholderText('输入要转换的文本...');
    await user.type(textarea, 'hello world');
    
    // 先转大写
    const upperBtn = screen.getByRole('button', { name: '大写' });
    await user.click(upperBtn);
    
    await waitFor(() => {
      const result = container.querySelector('pre');
      expect(result?.textContent).toBe('HELLO WORLD');
    });
    
    // 再转小写
    const lowerBtn = screen.getByRole('button', { name: '小写' });
    await user.click(lowerBtn);
    
    await waitFor(() => {
      const result = container.querySelector('pre');
      expect(result?.textContent).toBe('hello world');
    });
  });

  // 10. 空输入测试
  test('应该处理空输入', async () => {
    const user = userEvent.setup();
    const { container } = render(<CaseConverter />);
    
    const upperBtn = screen.getByRole('button', { name: '大写' });
    await user.click(upperBtn);
    
    await waitFor(() => {
      const result = container.querySelector('pre');
      // 空输入可能不显示结果区域，或显示空内容
      expect(result === null || result.textContent === '').toBe(true);
    });
  });

  // 11. 特殊字符测试
  test('应该正确处理数字和特殊字符', async () => {
    const user = userEvent.setup();
    const { container } = render(<CaseConverter />);
    
    const textarea = screen.getByPlaceholderText('输入要转换的文本...');
    await user.type(textarea, 'test123!@#');
    
    const camelBtn = screen.getByRole('button', { name: 'camelCase' });
    await user.click(camelBtn);
    
    await waitFor(() => {
      const result = container.querySelector('pre');
      // 应该保留数字，移除特殊字符
      expect(result?.textContent).toMatch(/test123/);
    });
  });
});
