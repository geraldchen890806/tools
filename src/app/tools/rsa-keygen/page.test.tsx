import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import Page from './page';

describe('RSA 密钥生成工具', () => {
  test('应该正确渲染', () => {
    const { container } = render(<Page />);
    expect(container).toBeTruthy();
  });
});
