import { render, screen, waitFor } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import AESPage from './page';

describe('AES 加密/解密工具', () => {
  const validKey = '1234567890123456'; // 16 chars
  const validIV = '1234567890123456'; // 16 chars

  test('应该正确渲染工具界面', () => {
    render(<AESPage />);
    expect(screen.getByText('AES 加密/解密')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: '加密' }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: '解密' }).length).toBeGreaterThan(0);
  });

  test('默认应该选中加密模式', () => {
    render(<AESPage />);
    expect(screen.getByPlaceholderText('输入明文')).toBeInTheDocument();
  });

  test('应该能切换到解密模式', async () => {
    const user = userEvent.setup();
    render(<AESPage />);
    
    const decryptBtn = screen.getAllByRole('button', { name: '解密' })[0];
    await user.click(decryptBtn);
    
    expect(screen.getByPlaceholderText('输入密文（Base64）')).toBeInTheDocument();
  });

  test('应该验证Key长度', async () => {
    const user = userEvent.setup();
    render(<AESPage />);
    
    const keyInput = screen.getByPlaceholderText(/Key/);
    await user.type(keyInput, '123'); // 无效长度
    
    const encryptBtn = screen.getAllByRole('button', { name: '加密' })[1];
    await user.click(encryptBtn);
    
    await waitFor(() => {
      expect(screen.getByText(/Key 必须为 16\/24\/32 字符/)).toBeInTheDocument();
    });
  });

  test('应该验证IV长度', async () => {
    const user = userEvent.setup();
    render(<AESPage />);
    
    const keyInput = screen.getByPlaceholderText(/Key/);
    const ivInput = screen.getByPlaceholderText(/IV/);
    
    await user.type(keyInput, validKey);
    await user.type(ivInput, '123'); // 无效长度
    
    const encryptBtn = screen.getAllByRole('button', { name: '加密' })[1];
    await user.click(encryptBtn);
    
    await waitFor(() => {
      expect(screen.getByText(/IV 必须为 16 字符/)).toBeInTheDocument();
    });
  });

  test('应该能加密文本', async () => {
    const user = userEvent.setup();
    render(<AESPage />);
    
    const keyInput = screen.getByPlaceholderText(/Key/);
    const ivInput = screen.getByPlaceholderText(/IV/);
    const textInput = screen.getByPlaceholderText('输入明文');
    
    await user.type(keyInput, validKey);
    await user.type(ivInput, validIV);
    await user.type(textInput, 'Hello World');
    
    const encryptBtn = screen.getAllByRole('button', { name: '加密' })[1];
    await user.click(encryptBtn);
    
    await waitFor(() => {
      const outputs = screen.getAllByRole('textbox');
      const outputTextarea = outputs[outputs.length - 1] as HTMLTextAreaElement;
      expect(outputTextarea.value.length).toBeGreaterThan(0);
      expect(outputTextarea.readOnly).toBe(true);
    });
  });

  test('应该能复制加密结果', async () => {
    const user = userEvent.setup();
    const writeTextMock = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      writable: true,
    });
    
    render(<AESPage />);
    
    const keyInput = screen.getByPlaceholderText(/Key/);
    const ivInput = screen.getByPlaceholderText(/IV/);
    const textInput = screen.getByPlaceholderText('输入明文');
    
    await user.type(keyInput, validKey);
    await user.type(ivInput, validIV);
    await user.type(textInput, 'Test');
    
    await user.click(screen.getAllByRole('button', { name: '加密' })[1]);
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: '复制结果' })).toBeInTheDocument();
    });
    
    await user.click(screen.getByRole('button', { name: '复制结果' }));
    expect(writeTextMock).toHaveBeenCalled();
  });

  test('空输入应该显示错误', async () => {
    const user = userEvent.setup();
    render(<AESPage />);
    
    const keyInput = screen.getByPlaceholderText(/Key/);
    const ivInput = screen.getByPlaceholderText(/IV/);
    
    await user.type(keyInput, validKey);
    await user.type(ivInput, validIV);
    
    const encryptBtn = screen.getAllByRole('button', { name: '加密' })[1];
    await user.click(encryptBtn);
    
    await waitFor(() => {
      expect(screen.getByText(/请输入内容/)).toBeInTheDocument();
    });
  });
});
