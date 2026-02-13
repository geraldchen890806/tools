import { render, screen, waitFor } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import Page from './page';

describe('二维码生成工具', () => {
  // 1. 渲染测试
  test('应该正确渲染工具界面', () => {
    render(<Page />);
    expect(screen.getByText('二维码生成')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('输入文本或 URL')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '生成' })).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  // 2. 尺寸选择测试
  test('应该有多个尺寸选项', () => {
    render(<Page />);
    
    const select = screen.getByRole('combobox');
    const options = select.querySelectorAll('option');
    
    expect(options.length).toBeGreaterThanOrEqual(4);
    expect(select).toHaveValue('300'); // 默认值
  });

  test('应该支持切换尺寸', async () => {
    const user = userEvent.setup();
    render(<Page />);
    
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, '200');
    
    expect(select).toHaveValue('200');
  });

  // 3. 生成功能测试
  describe('生成功能', () => {
    test('输入文本后应该能生成二维码', async () => {
      const user = userEvent.setup();
      render(<Page />);
      
      const input = screen.getByPlaceholderText('输入文本或 URL');
      await user.type(input, 'Hello World');
      
      const generateBtn = screen.getByRole('button', { name: '生成' });
      await user.click(generateBtn);
      
      await waitFor(() => {
        const img = screen.queryByRole('img');
        expect(img).toBeInTheDocument();
      });
    });

    test('生成的二维码 URL 应该包含编码后的文本', async () => {
      const user = userEvent.setup();
      render(<Page />);
      
      const input = screen.getByPlaceholderText('输入文本或 URL');
      await user.type(input, 'Test Text');
      
      const generateBtn = screen.getByRole('button', { name: '生成' });
      await user.click(generateBtn);
      
      await waitFor(() => {
        const img = screen.getByRole('img') as HTMLImageElement;
        expect(img.src).toContain('Test%20Text');
        expect(img.src).toContain('qrserver.com');
      });
    });

    test('生成的二维码 URL 应该包含正确的尺寸', async () => {
      const user = userEvent.setup();
      render(<Page />);
      
      const input = screen.getByPlaceholderText('输入文本或 URL');
      const select = screen.getByRole('combobox');
      
      await user.selectOptions(select, '200');
      await user.type(input, 'Test');
      
      const generateBtn = screen.getByRole('button', { name: '生成' });
      await user.click(generateBtn);
      
      await waitFor(() => {
        const img = screen.getByRole('img') as HTMLImageElement;
        expect(img.src).toContain('200x200');
      });
    });

    test('应该正确编码 URL', async () => {
      const user = userEvent.setup();
      render(<Page />);
      
      const input = screen.getByPlaceholderText('输入文本或 URL');
      await user.type(input, 'https://example.com?key=value');
      
      const generateBtn = screen.getByRole('button', { name: '生成' });
      await user.click(generateBtn);
      
      await waitFor(() => {
        const img = screen.getByRole('img') as HTMLImageElement;
        expect(img.src).toContain(encodeURIComponent('https://example.com?key=value'));
      });
    });

    test('应该正确处理特殊字符', async () => {
      const user = userEvent.setup();
      render(<Page />);
      
      const input = screen.getByPlaceholderText('输入文本或 URL');
      await user.type(input, 'Hello & World!');
      
      const generateBtn = screen.getByRole('button', { name: '生成' });
      await user.click(generateBtn);
      
      await waitFor(() => {
        const img = screen.getByRole('img');
        expect(img).toBeInTheDocument();
      });
    });

    test('应该正确处理中文', async () => {
      const user = userEvent.setup();
      render(<Page />);
      
      const input = screen.getByPlaceholderText('输入文本或 URL');
      await user.type(input, '你好世界');
      
      const generateBtn = screen.getByRole('button', { name: '生成' });
      await user.click(generateBtn);
      
      await waitFor(() => {
        const img = screen.getByRole('img');
        expect(img).toBeInTheDocument();
      });
    });
  });

  // 4. 空输入测试
  test('空输入时不应该生成二维码', async () => {
    const user = userEvent.setup();
    render(<Page />);
    
    const generateBtn = screen.getByRole('button', { name: '生成' });
    await user.click(generateBtn);
    
    // 不应该有图片
    const img = screen.queryByRole('img');
    expect(img).not.toBeInTheDocument();
  });

  test('只有空格时不应该生成二维码', async () => {
    const user = userEvent.setup();
    render(<Page />);
    
    const input = screen.getByPlaceholderText('输入文本或 URL');
    await user.type(input, '   ');
    
    const generateBtn = screen.getByRole('button', { name: '生成' });
    await user.click(generateBtn);
    
    const img = screen.queryByRole('img');
    expect(img).not.toBeInTheDocument();
  });

  // 5. 下载按钮测试
  test('生成前不应该显示下载按钮', () => {
    render(<Page />);
    expect(screen.queryByRole('button', { name: '下载' })).not.toBeInTheDocument();
  });

  test('生成后应该显示下载按钮', async () => {
    const user = userEvent.setup();
    render(<Page />);
    
    const input = screen.getByPlaceholderText('输入文本或 URL');
    await user.type(input, 'Test');
    
    const generateBtn = screen.getByRole('button', { name: '生成' });
    await user.click(generateBtn);
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: '下载' })).toBeInTheDocument();
    });
  });

  test('下载按钮应该触发下载', async () => {
    const user = userEvent.setup();
    
    // Mock fetch
    global.fetch = vi.fn(() =>
      Promise.resolve({
        blob: () => Promise.resolve(new Blob(['fake image data'])),
      } as Response)
    );
    
    // Mock URL.createObjectURL and revokeObjectURL
    global.URL.createObjectURL = vi.fn(() => 'blob:test');
    global.URL.revokeObjectURL = vi.fn();
    
    // Mock document.createElement to spy on the download
    const mockClick = vi.fn();
    const originalCreateElement = document.createElement.bind(document);
    document.createElement = vi.fn((tagName: string) => {
      const element = originalCreateElement(tagName);
      if (tagName === 'a') {
        element.click = mockClick;
      }
      return element;
    });
    
    render(<Page />);
    
    const input = screen.getByPlaceholderText('输入文本或 URL');
    await user.type(input, 'Test');
    
    const generateBtn = screen.getByRole('button', { name: '生成' });
    await user.click(generateBtn);
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: '下载' })).toBeInTheDocument();
    });
    
    const downloadBtn = screen.getByRole('button', { name: '下载' });
    await user.click(downloadBtn);
    
    await waitFor(() => {
      expect(mockClick).toHaveBeenCalled();
    });
    
    // Cleanup
    document.createElement = originalCreateElement;
  });

  // 6. 回车键生成测试
  test('应该支持按回车键生成', async () => {
    const user = userEvent.setup();
    render(<Page />);
    
    const input = screen.getByPlaceholderText('输入文本或 URL');
    await user.type(input, 'Test{Enter}');
    
    await waitFor(() => {
      const img = screen.queryByRole('img');
      expect(img).toBeInTheDocument();
    });
  });

  // 7. 重新生成测试
  test('重新生成应该更新二维码', async () => {
    const user = userEvent.setup();
    render(<Page />);
    
    const input = screen.getByPlaceholderText('输入文本或 URL');
    const generateBtn = screen.getByRole('button', { name: '生成' });
    
    // 第一次生成
    await user.type(input, 'First');
    await user.click(generateBtn);
    
    await waitFor(() => {
      const img = screen.getByRole('img') as HTMLImageElement;
      expect(img.src).toContain('First');
    });
    
    // 修改文本并重新生成
    await user.clear(input);
    await user.type(input, 'Second');
    await user.click(generateBtn);
    
    await waitFor(() => {
      const img = screen.getByRole('img') as HTMLImageElement;
      expect(img.src).toContain('Second');
      expect(img.src).not.toContain('First');
    });
  });

  // 8. UI 状态测试
  test('生成前不应该显示二维码图片', () => {
    render(<Page />);
    const img = screen.queryByRole('img');
    expect(img).not.toBeInTheDocument();
  });

  test('生成后应该显示二维码图片', async () => {
    const user = userEvent.setup();
    render(<Page />);
    
    const input = screen.getByPlaceholderText('输入文本或 URL');
    await user.type(input, 'Test');
    
    const generateBtn = screen.getByRole('button', { name: '生成' });
    await user.click(generateBtn);
    
    await waitFor(() => {
      const img = screen.getByRole('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('alt', 'QR Code');
    });
  });

  test('图片尺寸应该与选择的尺寸一致', async () => {
    const user = userEvent.setup();
    render(<Page />);
    
    const input = screen.getByPlaceholderText('输入文本或 URL');
    const select = screen.getByRole('combobox');
    
    await user.selectOptions(select, '400');
    await user.type(input, 'Test');
    
    const generateBtn = screen.getByRole('button', { name: '生成' });
    await user.click(generateBtn);
    
    await waitFor(() => {
      const img = screen.getByRole('img') as HTMLImageElement;
      expect(img.width).toBe(400);
      expect(img.height).toBe(400);
    });
  });
});
