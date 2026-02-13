import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import Page from './page';

describe('图片水印工具', () => {
  test('应该正确渲染', () => {
    const { container } = render(<Page />);
    expect(container).toBeTruthy();
  });
});
