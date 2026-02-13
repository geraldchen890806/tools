import { render, screen, waitFor } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import UUIDGeneratorPage from './page';

describe('UUID 生成器', () => {
  // 1. 渲染测试
  test('应该正确渲染工具界面', () => {
    render(<UUIDGeneratorPage />);
    expect(screen.getByText('UUID 生成器')).toBeInTheDocument();
    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '生成' })).toBeInTheDocument();
  });

  // 2. UUID 生成功能测试
  describe('UUID 生成功能', () => {
    test('应该生成指定数量的 UUID', async () => {
      const user = userEvent.setup();
      render(<UUIDGeneratorPage />);
      
      const generateBtn = screen.getByRole('button', { name: '生成' });
      await user.click(generateBtn);
      
      await waitFor(() => {
        // 默认应该生成 5 个 UUID
        const uuids = screen.getAllByText(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
        expect(uuids.length).toBe(5);
      });
    });

    test('应该支持自定义生成数量', async () => {
      const user = userEvent.setup();
      render(<UUIDGeneratorPage />);
      
      const countInput = screen.getByRole('spinbutton') as HTMLInputElement;
      await user.type(countInput, '{backspace}{backspace}10');
      
      const generateBtn = screen.getByRole('button', { name: '生成' });
      await user.click(generateBtn);
      
      await waitFor(() => {
        const uuids = screen.getAllByText(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
        expect(uuids.length).toBe(10);
      });
    });

    test('应该支持生成 1 个 UUID', async () => {
      const user = userEvent.setup();
      render(<UUIDGeneratorPage />);
      
      const countInput = screen.getByRole('spinbutton') as HTMLInputElement;
      await user.type(countInput, '{backspace}1');
      
      const generateBtn = screen.getByRole('button', { name: '生成' });
      await user.click(generateBtn);
      
      await waitFor(() => {
        const uuids = screen.getAllByText(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
        expect(uuids.length).toBe(1);
      });
    });

    test('应该支持生成最大数量（100）的 UUID', async () => {
      const user = userEvent.setup();
      render(<UUIDGeneratorPage />);
      
      const countInput = screen.getByRole('spinbutton') as HTMLInputElement;
      await user.type(countInput, '{backspace}{backspace}100');
      
      const generateBtn = screen.getByRole('button', { name: '生成' });
      await user.click(generateBtn);
      
      await waitFor(() => {
        const uuids = screen.getAllByText(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
        expect(uuids.length).toBe(100);
      }, { timeout: 5000 });
    });
  });

  // 3. UUID 格式验证
  describe('UUID 格式验证', () => {
    test('生成的 UUID 应该符合 UUID v4 格式', async () => {
      const user = userEvent.setup();
      render(<UUIDGeneratorPage />);
      
      const generateBtn = screen.getByRole('button', { name: '生成' });
      await user.click(generateBtn);
      
      await waitFor(() => {
        const uuidElements = screen.getAllByText(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
        uuidElements.forEach(el => {
          const uuid = el.textContent!;
          // UUID v4 格式：xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
          // 第13位必须是 4
          expect(uuid[14]).toBe('4');
          // 第17位必须是 8, 9, a, 或 b
          expect(['8', '9', 'a', 'b']).toContain(uuid[19].toLowerCase());
        });
      });
    });

    test('生成的 UUID 应该包含正确的分隔符', async () => {
      const user = userEvent.setup();
      render(<UUIDGeneratorPage />);
      
      const generateBtn = screen.getByRole('button', { name: '生成' });
      await user.click(generateBtn);
      
      await waitFor(() => {
        const uuidElements = screen.getAllByText(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
        uuidElements.forEach(el => {
          const uuid = el.textContent!;
          expect(uuid.split('-').length).toBe(5);
          expect(uuid[8]).toBe('-');
          expect(uuid[13]).toBe('-');
          expect(uuid[18]).toBe('-');
          expect(uuid[23]).toBe('-');
        });
      });
    });
  });

  // 4. UUID 唯一性测试
  test('多次生成的 UUID 应该都是唯一的', async () => {
    const user = userEvent.setup();
    render(<UUIDGeneratorPage />);
    
    const countInput = screen.getByRole('spinbutton') as HTMLInputElement;
    await user.type(countInput, '{backspace}50');
    
    const generateBtn = screen.getByRole('button', { name: '生成' });
    await user.click(generateBtn);
    
    await waitFor(() => {
      const uuidElements = screen.getAllByText(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
      const uuids = uuidElements.map(el => el.textContent);
      const uniqueUuids = new Set(uuids);
      
      // 所有 UUID 应该是唯一的
      expect(uniqueUuids.size).toBe(50);
    });
  });

  // 5. 复制功能测试
  describe('复制功能', () => {
    test('应该支持复制单个 UUID', async () => {
      const user = userEvent.setup();
      const writeTextMock = vi.fn(() => Promise.resolve());
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: writeTextMock,
        },
        writable: true,
      });
      
      render(<UUIDGeneratorPage />);
      
      const generateBtn = screen.getByRole('button', { name: '生成' });
      await user.click(generateBtn);
      
      await waitFor(() => {
        expect(screen.getAllByRole('button', { name: '复制' }).length).toBeGreaterThan(0);
      });
      
      const copyButtons = screen.getAllByRole('button', { name: '复制' });
      await user.click(copyButtons[0]);
      
      expect(writeTextMock).toHaveBeenCalled();
      const copiedText = writeTextMock.mock.calls[0][0];
      expect(copiedText).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    test('应该支持全部复制', async () => {
      const user = userEvent.setup();
      const writeTextMock = vi.fn(() => Promise.resolve());
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: writeTextMock,
        },
        writable: true,
      });
      
      render(<UUIDGeneratorPage />);
      
      const countInput = screen.getByRole('spinbutton') as HTMLInputElement;
      await user.type(countInput, '{backspace}3');
      
      const generateBtn = screen.getByRole('button', { name: '生成' });
      await user.click(generateBtn);
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: '全部复制' })).toBeInTheDocument();
      });
      
      const copyAllBtn = screen.getByRole('button', { name: '全部复制' });
      await user.click(copyAllBtn);
      
      expect(writeTextMock).toHaveBeenCalled();
      const copiedText = writeTextMock.mock.calls[0][0];
      const lines = copiedText.split('\n');
      expect(lines.length).toBe(3);
      lines.forEach((line: string) => {
        expect(line).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
      });
    });
  });

  // 6. UI 状态测试
  test('生成前不应该显示全部复制按钮', () => {
    render(<UUIDGeneratorPage />);
    expect(screen.queryByRole('button', { name: '全部复制' })).not.toBeInTheDocument();
  });

  test('生成后应该显示全部复制按钮', async () => {
    const user = userEvent.setup();
    render(<UUIDGeneratorPage />);
    
    const generateBtn = screen.getByRole('button', { name: '生成' });
    await user.click(generateBtn);
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: '全部复制' })).toBeInTheDocument();
    });
  });

  test('重新生成应该替换之前的 UUID', async () => {
    const user = userEvent.setup();
    render(<UUIDGeneratorPage />);
    
    const countInput = screen.getByRole('spinbutton') as HTMLInputElement;
    await user.type(countInput, '{backspace}2');
    
    const generateBtn = screen.getByRole('button', { name: '生成' });
    await user.click(generateBtn);
    
    await waitFor(() => {
      const firstUuids = screen.getAllByText(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
      expect(firstUuids.length).toBe(2);
    });
    
    const firstUuidText = screen.getAllByText(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)[0].textContent;
    
    // 再次生成
    await user.click(generateBtn);
    
    await waitFor(() => {
      const secondUuids = screen.getAllByText(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
      expect(secondUuids.length).toBe(2);
      // 新的 UUID 应该与第一次不同
      expect(secondUuids[0].textContent).not.toBe(firstUuidText);
    });
  });

  // 7. 边界测试
  test('应该限制最小数量为 1', () => {
    render(<UUIDGeneratorPage />);
    
    const countInput = screen.getByRole('spinbutton') as HTMLInputElement;
    expect(countInput.min).toBe('1');
  });

  test('应该限制最大数量为 100', () => {
    render(<UUIDGeneratorPage />);
    
    const countInput = screen.getByRole('spinbutton') as HTMLInputElement;
    expect(countInput.max).toBe('100');
  });
});
