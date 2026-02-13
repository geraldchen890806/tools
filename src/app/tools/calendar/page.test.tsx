import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import Page from './page';

describe('日历工具', () => {
  test('应该正确渲染', () => {
    const { container } = render(<Page />);
    expect(container).toBeTruthy();
  });
});
