import { render, screen, waitFor } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import JWTDecoderPage from './page';

describe('JWT 解析工具', () => {
  // 一个有效的 JWT 示例（header + payload + signature）
  const validJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

  // 1. 渲染测试
  test('应该正确渲染工具界面', () => {
    render(<JWTDecoderPage />);
    expect(screen.getByText('JWT 解析')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('粘贴 JWT Token...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '解析' })).toBeInTheDocument();
  });

  // 2. JWT 解码功能测试
  describe('JWT 解码', () => {
    test('应该成功解析有效的 JWT', async () => {
      const user = userEvent.setup();
      render(<JWTDecoderPage />);
      
      const textarea = screen.getByPlaceholderText('粘贴 JWT Token...');
      await user.click(textarea);
      await user.paste(validJWT);
      
      const decodeBtn = screen.getByRole('button', { name: '解析' });
      await user.click(decodeBtn);
      
      await waitFor(() => {
        expect(screen.getByText('header')).toBeInTheDocument();
        expect(screen.getByText('payload')).toBeInTheDocument();
        expect(screen.getByText('Signature')).toBeInTheDocument();
      });
    });

    test('应该正确显示 header 内容', async () => {
      const user = userEvent.setup();
      const { container } = render(<JWTDecoderPage />);
      
      const textarea = screen.getByPlaceholderText('粘贴 JWT Token...');
      await user.click(textarea);
      await user.paste(validJWT);
      
      const decodeBtn = screen.getByRole('button', { name: '解析' });
      await user.click(decodeBtn);
      
      await waitFor(() => {
        const headerSection = screen.getByText('header').nextElementSibling;
        expect(headerSection?.textContent).toContain('HS256');
        expect(headerSection?.textContent).toContain('JWT');
      });
    });

    test('应该正确显示 payload 内容', async () => {
      const user = userEvent.setup();
      render(<JWTDecoderPage />);
      
      const textarea = screen.getByPlaceholderText('粘贴 JWT Token...');
      await user.click(textarea);
      await user.paste(validJWT);
      
      const decodeBtn = screen.getByRole('button', { name: '解析' });
      await user.click(decodeBtn);
      
      await waitFor(() => {
        const payloadSection = screen.getByText('payload').nextElementSibling;
        expect(payloadSection?.textContent).toContain('1234567890');
        expect(payloadSection?.textContent).toContain('John Doe');
        expect(payloadSection?.textContent).toContain('1516239022');
      });
    });

    test('应该显示 signature', async () => {
      const user = userEvent.setup();
      render(<JWTDecoderPage />);
      
      const textarea = screen.getByPlaceholderText('粘贴 JWT Token...');
      await user.click(textarea);
      await user.paste(validJWT);
      
      const decodeBtn = screen.getByRole('button', { name: '解析' });
      await user.click(decodeBtn);
      
      await waitFor(() => {
        expect(screen.getByText('Signature')).toBeInTheDocument();
        const signatureSection = screen.getByText('Signature').nextElementSibling;
        expect(signatureSection?.textContent).toContain('SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
      });
    });

    test('应该格式化 JSON 输出', async () => {
      const user = userEvent.setup();
      const { container } = render(<JWTDecoderPage />);
      
      const textarea = screen.getByPlaceholderText('粘贴 JWT Token...');
      await user.click(textarea);
      await user.paste(validJWT);
      
      const decodeBtn = screen.getByRole('button', { name: '解析' });
      await user.click(decodeBtn);
      
      await waitFor(() => {
        // 检查是否有 pre 标签（格式化的 JSON）
        const preElements = container.querySelectorAll('pre');
        expect(preElements.length).toBeGreaterThanOrEqual(2); // header 和 payload
        
        // 检查是否有缩进（格式化）
        const headerPre = preElements[0];
        expect(headerPre.textContent).toMatch(/\n/); // 应该有换行符
      });
    });
  });

  // 3. 错误处理测试
  describe('错误处理', () => {
    test('应该处理格式错误的 JWT（少于 3 部分）', async () => {
      const user = userEvent.setup();
      render(<JWTDecoderPage />);
      
      const textarea = screen.getByPlaceholderText('粘贴 JWT Token...');
      await user.click(textarea);
      await user.paste('invalid.jwt');
      
      const decodeBtn = screen.getByRole('button', { name: '解析' });
      await user.click(decodeBtn);
      
      await waitFor(() => {
        expect(screen.getByText(/Invalid JWT format/)).toBeInTheDocument();
      });
    });

    test('应该处理格式错误的 JWT（多于 3 部分）', async () => {
      const user = userEvent.setup();
      render(<JWTDecoderPage />);
      
      const textarea = screen.getByPlaceholderText('粘贴 JWT Token...');
      await user.click(textarea);
      await user.paste('part1.part2.part3.part4');
      
      const decodeBtn = screen.getByRole('button', { name: '解析' });
      await user.click(decodeBtn);
      
      await waitFor(() => {
        expect(screen.getByText(/Invalid JWT format/)).toBeInTheDocument();
      });
    });

    test('应该处理无效的 Base64 编码', async () => {
      const user = userEvent.setup();
      render(<JWTDecoderPage />);
      
      const textarea = screen.getByPlaceholderText('粘贴 JWT Token...');
      await user.click(textarea);
      await user.paste('invalid.base64.data');
      
      const decodeBtn = screen.getByRole('button', { name: '解析' });
      await user.click(decodeBtn);
      
      await waitFor(() => {
        // 应该显示某种错误
        const errorElement = screen.queryByText(/invalid|error|format/i);
        expect(errorElement).toBeInTheDocument();
      });
    });

    test('应该处理空输入', async () => {
      const user = userEvent.setup();
      render(<JWTDecoderPage />);
      
      const decodeBtn = screen.getByRole('button', { name: '解析' });
      await user.click(decodeBtn);
      
      await waitFor(() => {
        expect(screen.getByText(/Invalid JWT format/)).toBeInTheDocument();
      });
    });

    test('解析成功后错误信息应该消失', async () => {
      const user = userEvent.setup();
      render(<JWTDecoderPage />);
      
      const textarea = screen.getByPlaceholderText('粘贴 JWT Token...');
      const decodeBtn = screen.getByRole('button', { name: '解析' });
      
      // 先输入无效的 JWT
      await user.click(textarea);
      await user.paste('invalid');
      await user.click(decodeBtn);
      
      await waitFor(() => {
        expect(screen.getByText(/Invalid JWT format/)).toBeInTheDocument();
      });
      
      // 清空并输入有效的 JWT
      await user.clear(textarea);
      await user.paste(validJWT);
      await user.click(decodeBtn);
      
      await waitFor(() => {
        expect(screen.queryByText(/Invalid JWT format/)).not.toBeInTheDocument();
        expect(screen.getByText('header')).toBeInTheDocument();
      });
    });
  });

  // 4. UI 状态测试
  test('解析前不应该显示结果', () => {
    render(<JWTDecoderPage />);
    
    expect(screen.queryByText('header')).not.toBeInTheDocument();
    expect(screen.queryByText('payload')).not.toBeInTheDocument();
    expect(screen.queryByText('Signature')).not.toBeInTheDocument();
  });

  test('解析后应该显示所有三个部分', async () => {
    const user = userEvent.setup();
    render(<JWTDecoderPage />);
    
    const textarea = screen.getByPlaceholderText('粘贴 JWT Token...');
    await user.click(textarea);
    await user.paste(validJWT);
    
    const decodeBtn = screen.getByRole('button', { name: '解析' });
    await user.click(decodeBtn);
    
    await waitFor(() => {
      expect(screen.getByText('header')).toBeInTheDocument();
      expect(screen.getByText('payload')).toBeInTheDocument();
      expect(screen.getByText('Signature')).toBeInTheDocument();
    });
  });

  test('重新解析应该替换之前的结果', async () => {
    const user = userEvent.setup();
    const { container } = render(<JWTDecoderPage />);
    
    const textarea = screen.getByPlaceholderText('粘贴 JWT Token...');
    const decodeBtn = screen.getByRole('button', { name: '解析' });
    
    // 第一次解析
    await user.click(textarea);
    await user.paste(validJWT);
    await user.click(decodeBtn);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    
    // 创建一个新的 JWT（不同的 payload）
    const newJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5ODc2NTQzMjEwIiwibmFtZSI6IkphbmUgU21pdGgiLCJpYXQiOjE2MDAwMDAwMDB9.signature';
    
    // 清空并输入新的 JWT
    await user.clear(textarea);
    await user.paste(newJWT);
    await user.click(decodeBtn);
    
    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });
  });

  // 5. URL-safe Base64 测试
  test('应该正确处理 URL-safe Base64（- 和 _）', async () => {
    const user = userEvent.setup();
    // 使用 URL-safe Base64 的 JWT（使用 - 和 _ 而不是 + 和 /）
    const urlSafeJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIn0.Gfx6VO9tcxwk6xqx9yYzSfebfeakZp5JYIgP_edcw_A';
    
    render(<JWTDecoderPage />);
    
    const textarea = screen.getByPlaceholderText('粘贴 JWT Token...');
    await user.click(textarea);
    await user.paste(urlSafeJWT);
    
    const decodeBtn = screen.getByRole('button', { name: '解析' });
    await user.click(decodeBtn);
    
    await waitFor(() => {
      expect(screen.getByText('header')).toBeInTheDocument();
      expect(screen.getByText('payload')).toBeInTheDocument();
    });
  });

  // 6. 前后空格处理
  test('应该正确处理前后空格', async () => {
    const user = userEvent.setup();
    render(<JWTDecoderPage />);
    
    const textarea = screen.getByPlaceholderText('粘贴 JWT Token...');
    await user.click(textarea);
    await user.paste(`  ${validJWT}  `);
    
    const decodeBtn = screen.getByRole('button', { name: '解析' });
    await user.click(decodeBtn);
    
    await waitFor(() => {
      expect(screen.getByText('header')).toBeInTheDocument();
      expect(screen.getByText('payload')).toBeInTheDocument();
    });
  });
});
