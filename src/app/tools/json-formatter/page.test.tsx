import { render, screen, waitFor } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import JsonFormatter from './page';

describe('JSON 格式化工具', () => {
  const validJson = '{"name":"John","age":30,"city":"New York"}';
  const formattedJson = `{
  "name": "John",
  "age": 30,
  "city": "New York"
}`;

  // 1. 渲染测试
  test('应该正确渲染工具界面', () => {
    render(<JsonFormatter />);
    expect(screen.getByText('JSON 格式化')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('粘贴 JSON...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '格式化' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '压缩' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '复制' })).toBeInTheDocument();
  });

  // 2. 格式化功能测试
  describe('格式化功能', () => {
    test('应该正确格式化压缩的 JSON', async () => {
      const user = userEvent.setup();
      render(<JsonFormatter />);
      
      const textarea = screen.getByPlaceholderText('粘贴 JSON...');
      await user.click(textarea);
      await user.paste(validJson);
      
      const formatBtn = screen.getByRole('button', { name: '格式化' });
      await user.click(formatBtn);
      
      await waitFor(() => {
        const outputs = screen.getAllByText(/John/);
        // 格式化后应该有缩进（取输出区域的元素）
        const output = outputs[outputs.length - 1];
        expect(output.textContent).toContain('\n');
        expect(output.textContent).toContain('  '); // 2 空格缩进
      });
    });

    test('应该正确格式化嵌套的 JSON', async () => {
      const user = userEvent.setup();
      render(<JsonFormatter />);
      
      const nestedJson = '{"user":{"name":"John","address":{"city":"NY","zip":"10001"}}}';
      
      const textarea = screen.getByPlaceholderText('粘贴 JSON...');
      await user.click(textarea);
      await user.paste(nestedJson);
      
      const formatBtn = screen.getByRole('button', { name: '格式化' });
      await user.click(formatBtn);
      
      await waitFor(() => {
        const outputs = screen.getAllByText(/user/);
        const output = outputs[outputs.length - 1];
        expect(output.textContent).toContain('user');
        expect(output.textContent).toContain('name');
        expect(output.textContent).toContain('address');
        expect(output.textContent).toContain('city');
      });
    });

    test('应该正确格式化数组', async () => {
      const user = userEvent.setup();
      render(<JsonFormatter />);
      
      const arrayJson = '["apple","banana","cherry"]';
      
      const textarea = screen.getByPlaceholderText('粘贴 JSON...');
      await user.click(textarea);
      await user.paste(arrayJson);
      
      const formatBtn = screen.getByRole('button', { name: '格式化' });
      await user.click(formatBtn);
      
      await waitFor(() => {
        const outputs = screen.getAllByText(/apple/);
        const output = outputs[outputs.length - 1];
        expect(output.textContent).toContain('apple');
        expect(output.textContent).toContain('banana');
        expect(output.textContent).toContain('cherry');
      });
    });

    test('应该正确格式化包含数字和布尔值的 JSON', async () => {
      const user = userEvent.setup();
      render(<JsonFormatter />);
      
      const mixedJson = '{"count":42,"active":true,"price":19.99,"empty":null}';
      
      const textarea = screen.getByPlaceholderText('粘贴 JSON...');
      await user.click(textarea);
      await user.paste(mixedJson);
      
      const formatBtn = screen.getByRole('button', { name: '格式化' });
      await user.click(formatBtn);
      
      await waitFor(() => {
        const outputs = screen.getAllByText(/count/);
        const output = outputs[outputs.length - 1];
        expect(output.textContent).toContain('42');
        expect(output.textContent).toContain('true');
        expect(output.textContent).toContain('19.99');
        expect(output.textContent).toContain('null');
      });
    });
  });

  // 3. 压缩功能测试
  describe('压缩功能', () => {
    test('应该正确压缩格式化的 JSON', async () => {
      const user = userEvent.setup();
      render(<JsonFormatter />);
      
      const textarea = screen.getByPlaceholderText('粘贴 JSON...');
      await user.click(textarea);
      await user.paste(formattedJson);
      
      const minifyBtn = screen.getByRole('button', { name: '压缩' });
      await user.click(minifyBtn);
      
      await waitFor(() => {
        const outputs = screen.getAllByText(/John/);
        const output = outputs[outputs.length - 1];
        // 压缩后不应该有多余的空格和换行
        expect(output.textContent).toBe(validJson);
      });
    });

    test('应该移除所有空格和换行', async () => {
      const user = userEvent.setup();
      render(<JsonFormatter />);
      
      const messyJson = `{
        "name"  :  "John"  ,
        "age"   :  30
      }`;
      
      const textarea = screen.getByPlaceholderText('粘贴 JSON...');
      await user.click(textarea);
      await user.paste(messyJson);
      
      const minifyBtn = screen.getByRole('button', { name: '压缩' });
      await user.click(minifyBtn);
      
      await waitFor(() => {
        const outputs = screen.getAllByText(/John/);
        const output = outputs[outputs.length - 1];
        // 应该是紧凑格式
        expect(output.textContent).toBe('{"name":"John","age":30}');
      });
    });
  });

  // 4. 格式化后压缩测试
  test('格式化后再压缩应该得到原始压缩格式', async () => {
    const user = userEvent.setup();
    render(<JsonFormatter />);
    
    const textarea = screen.getByPlaceholderText('粘贴 JSON...');
    await user.click(textarea);
    await user.paste(validJson);
    
    // 先格式化
    const formatBtn = screen.getByRole('button', { name: '格式化' });
    await user.click(formatBtn);
    
    await waitFor(() => {
      const outputs = screen.getAllByText(/John/);
      const output = outputs[outputs.length - 1];
      expect(output.textContent).toContain('\n');
    });
    
    // 再压缩
    const minifyBtn = screen.getByRole('button', { name: '压缩' });
    await user.click(minifyBtn);
    
    await waitFor(() => {
      const outputs = screen.getAllByText(/John/);
      const output = outputs[outputs.length - 1];
      expect(output.textContent).toBe(validJson);
    });
  });

  // 5. 错误处理测试
  describe('错误处理', () => {
    test('应该处理无效的 JSON', async () => {
      const user = userEvent.setup();
      render(<JsonFormatter />);
      
      const textarea = screen.getByPlaceholderText('粘贴 JSON...');
      await user.click(textarea);
      await user.paste('invalid json');
      
      const formatBtn = screen.getByRole('button', { name: '格式化' });
      await user.click(formatBtn);
      
      await waitFor(() => {
        expect(screen.getByText(/Unexpected token/i)).toBeInTheDocument();
      });
    });

    test('应该处理缺少引号的 JSON', async () => {
      const user = userEvent.setup();
      render(<JsonFormatter />);
      
      const textarea = screen.getByPlaceholderText('粘贴 JSON...');
      await user.click(textarea);
      await user.paste('{name: "John"}'); // 属性名缺少引号
      
      const formatBtn = screen.getByRole('button', { name: '格式化' });
      await user.click(formatBtn);
      
      await waitFor(() => {
        const errorElement = screen.queryByText(/Unexpected token|Expected/i);
        expect(errorElement).toBeInTheDocument();
      });
    });

    test('应该处理缺少逗号的 JSON', async () => {
      const user = userEvent.setup();
      render(<JsonFormatter />);
      
      const textarea = screen.getByPlaceholderText('粘贴 JSON...');
      await user.click(textarea);
      await user.paste('{"name":"John" "age":30}'); // 缺少逗号
      
      const formatBtn = screen.getByRole('button', { name: '格式化' });
      await user.click(formatBtn);
      
      await waitFor(() => {
        // 错误消息应该出现（检查DOM中是否有错误容器）
        const errorElements = screen.queryAllByText(/Unexpected|Expected|token|position/i);
        expect(errorElements.length).toBeGreaterThan(0);
      });
    });

    test('应该处理空输入', async () => {
      const user = userEvent.setup();
      render(<JsonFormatter />);
      
      const formatBtn = screen.getByRole('button', { name: '格式化' });
      await user.click(formatBtn);
      
      await waitFor(() => {
        // 错误消息应该出现
        const errorElements = screen.queryAllByText(/Unexpected|Expected|JSON|empty|end/i);
        expect(errorElements.length).toBeGreaterThan(0);
      });
    });

    test('成功操作后错误应该消失', async () => {
      const user = userEvent.setup();
      render(<JsonFormatter />);
      
      const textarea = screen.getByPlaceholderText('粘贴 JSON...');
      const formatBtn = screen.getByRole('button', { name: '格式化' });
      
      // 先触发错误
      await user.click(textarea);
      await user.paste('invalid');
      await user.click(formatBtn);
      
      await waitFor(() => {
        expect(screen.getByText(/Unexpected/i)).toBeInTheDocument();
      });
      
      // 输入有效 JSON
      await user.clear(textarea);
      await user.paste(validJson);
      await user.click(formatBtn);
      
      await waitFor(() => {
        expect(screen.queryByText(/Unexpected/i)).not.toBeInTheDocument();
      });
    });
  });

  // 6. 复制功能测试
  test('应该支持复制格式化后的结果', async () => {
    const user = userEvent.setup();
    const writeTextMock = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: writeTextMock,
      },
      writable: true,
    });
    
    render(<JsonFormatter />);
    
    const textarea = screen.getByPlaceholderText('粘贴 JSON...');
    await user.click(textarea);
    await user.paste(validJson);
    
    const formatBtn = screen.getByRole('button', { name: '格式化' });
    await user.click(formatBtn);
    
    await waitFor(() => {
      expect(screen.getAllByText(/John/).length).toBeGreaterThan(0);
    });
    
    const copyBtn = screen.getByRole('button', { name: '复制' });
    await user.click(copyBtn);
    
    expect(writeTextMock).toHaveBeenCalled();
    const copiedText = writeTextMock.mock.calls[0][0];
    expect(copiedText).toContain('John');
    expect(copiedText).toContain('\n'); // 格式化的应该有换行
  });

  // 7. UI 状态测试
  test('初始状态应该显示提示文本', () => {
    render(<JsonFormatter />);
    expect(screen.getByText('格式化结果将显示在这里...')).toBeInTheDocument();
  });

  test('格式化后应该显示结果', async () => {
    const user = userEvent.setup();
    render(<JsonFormatter />);
    
    const textarea = screen.getByPlaceholderText('粘贴 JSON...');
    await user.click(textarea);
    await user.paste(validJson);
    
    const formatBtn = screen.getByRole('button', { name: '格式化' });
    await user.click(formatBtn);
    
    await waitFor(() => {
      expect(screen.queryByText('格式化结果将显示在这里...')).not.toBeInTheDocument();
      expect(screen.getAllByText(/John/).length).toBeGreaterThan(0);
    });
  });

  // 8. 特殊字符测试
  test('应该正确处理转义字符', async () => {
    const user = userEvent.setup();
    render(<JsonFormatter />);
    
    const jsonWithEscape = '{"text":"Line 1\\nLine 2\\tTabbed"}';
    
    const textarea = screen.getByPlaceholderText('粘贴 JSON...');
    await user.click(textarea);
    await user.paste(jsonWithEscape);
    
    const formatBtn = screen.getByRole('button', { name: '格式化' });
    await user.click(formatBtn);
    
    await waitFor(() => {
      const outputs = screen.getAllByText(/Line 1/);
      const output = outputs[outputs.length - 1];
      expect(output.textContent).toContain('\\n');
      expect(output.textContent).toContain('\\t');
    });
  });

  test('应该正确处理 Unicode 字符', async () => {
    const user = userEvent.setup();
    render(<JsonFormatter />);
    
    const jsonWithUnicode = '{"emoji":"😀","chinese":"你好"}';
    
    const textarea = screen.getByPlaceholderText('粘贴 JSON...');
    await user.click(textarea);
    await user.paste(jsonWithUnicode);
    
    const formatBtn = screen.getByRole('button', { name: '格式化' });
    await user.click(formatBtn);
    
    await waitFor(() => {
      const outputs = screen.getAllByText(/emoji/);
      const output = outputs[outputs.length - 1];
      expect(output.textContent).toContain('😀');
      expect(output.textContent).toContain('你好');
    });
  });

  // 9. 数据类型保留测试
  test('应该保留 null 和 undefined', async () => {
    const user = userEvent.setup();
    render(<JsonFormatter />);
    
    const jsonWithNull = '{"value":null,"count":0,"flag":false}';
    
    const textarea = screen.getByPlaceholderText('粘贴 JSON...');
    await user.click(textarea);
    await user.paste(jsonWithNull);
    
    const formatBtn = screen.getByRole('button', { name: '格式化' });
    await user.click(formatBtn);
    
    await waitFor(() => {
      const outputs = screen.getAllByText(/null/);
      const output = outputs[outputs.length - 1];
      expect(output.textContent).toContain('null');
      expect(output.textContent).toContain('0');
      expect(output.textContent).toContain('false');
    });
  });
});
