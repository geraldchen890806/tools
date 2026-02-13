import { render, screen, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import NotesPage from './page';

describe('备忘提醒工具', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  test('应该正确渲染工具界面', () => {
    render(<NotesPage />);
    expect(screen.getByText('备忘提醒')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('标题')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('内容（可选）')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '添加备忘' })).toBeInTheDocument();
  });

  test('初始状态应该显示空状态提示', () => {
    render(<NotesPage />);
    expect(screen.getByText(/暂无备忘/)).toBeInTheDocument();
  });

  test('应该能添加备忘', async () => {
    const user = userEvent.setup();
    render(<NotesPage />);
    
    const titleInput = screen.getByPlaceholderText('标题');
    await user.type(titleInput, '测试备忘');
    
    const addBtn = screen.getByRole('button', { name: '添加备忘' });
    await user.click(addBtn);
    
    await waitFor(() => {
      expect(screen.getByText('测试备忘')).toBeInTheDocument();
      expect(screen.queryByText(/暂无备忘/)).not.toBeInTheDocument();
    });
  });

  test('应该能添加带内容的备忘', async () => {
    const user = userEvent.setup();
    render(<NotesPage />);
    
    const titleInput = screen.getByPlaceholderText('标题');
    const contentInput = screen.getByPlaceholderText('内容（可选）');
    
    await user.type(titleInput, '标题');
    await user.type(contentInput, '这是内容');
    
    const addBtn = screen.getByRole('button', { name: '添加备忘' });
    await user.click(addBtn);
    
    await waitFor(() => {
      expect(screen.getByText('标题')).toBeInTheDocument();
      expect(screen.getByText('这是内容')).toBeInTheDocument();
    });
  });

  test('添加后应该清空输入框', async () => {
    const user = userEvent.setup();
    render(<NotesPage />);
    
    const titleInput = screen.getByPlaceholderText('标题');
    await user.type(titleInput, '测试');
    
    const addBtn = screen.getByRole('button', { name: '添加备忘' });
    await user.click(addBtn);
    
    await waitFor(() => {
      expect(titleInput).toHaveValue('');
    });
  });

  test('空标题不应该能添加', async () => {
    const user = userEvent.setup();
    render(<NotesPage />);
    
    const addBtn = screen.getByRole('button', { name: '添加备忘' });
    await user.click(addBtn);
    
    expect(screen.getByText(/暂无备忘/)).toBeInTheDocument();
  });

  test('应该能标记备忘为完成', async () => {
    const user = userEvent.setup();
    render(<NotesPage />);
    
    const titleInput = screen.getByPlaceholderText('标题');
    await user.type(titleInput, '任务');
    
    const addBtn = screen.getByRole('button', { name: '添加备忘' });
    await user.click(addBtn);
    
    await waitFor(() => {
      expect(screen.getByText('任务')).toBeInTheDocument();
    });
    
    const checkbox = screen.getByRole('button', { name: '' });
    await user.click(checkbox);
    
    await waitFor(() => {
      const taskElement = screen.getByText('任务');
      expect(taskElement).toHaveStyle({ textDecoration: 'line-through' });
    });
  });

  test('应该能删除备忘', async () => {
    const user = userEvent.setup();
    render(<NotesPage />);
    
    const titleInput = screen.getByPlaceholderText('标题');
    await user.type(titleInput, '要删除的');
    
    const addBtn = screen.getByRole('button', { name: '添加备忘' });
    await user.click(addBtn);
    
    await waitFor(() => {
      expect(screen.getByText('要删除的')).toBeInTheDocument();
    });
    
    const deleteBtn = screen.getByRole('button', { name: '删除' });
    await user.click(deleteBtn);
    
    await waitFor(() => {
      expect(screen.queryByText('要删除的')).not.toBeInTheDocument();
    });
  });

  test('应该能编辑备忘', async () => {
    const user = userEvent.setup();
    render(<NotesPage />);
    
    // 添加
    const titleInput = screen.getByPlaceholderText('标题');
    await user.type(titleInput, '原标题');
    await user.click(screen.getByRole('button', { name: '添加备忘' }));
    
    await waitFor(() => {
      expect(screen.getByText('原标题')).toBeInTheDocument();
    });
    
    // 编辑
    const editBtn = screen.getByRole('button', { name: '编辑' });
    await user.click(editBtn);
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: '保存修改' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '取消' })).toBeInTheDocument();
    });
    
    const titleInputEdit = screen.getByPlaceholderText('标题');
    await user.clear(titleInputEdit);
    await user.type(titleInputEdit, '新标题');
    
    const saveBtn = screen.getByRole('button', { name: '保存修改' });
    await user.click(saveBtn);
    
    await waitFor(() => {
      expect(screen.getByText('新标题')).toBeInTheDocument();
      expect(screen.queryByText('原标题')).not.toBeInTheDocument();
    });
  });

  test('应该能取消编辑', async () => {
    const user = userEvent.setup();
    render(<NotesPage />);
    
    const titleInput = screen.getByPlaceholderText('标题');
    await user.type(titleInput, '测试');
    await user.click(screen.getByRole('button', { name: '添加备忘' }));
    
    await waitFor(() => {
      expect(screen.getByText('测试')).toBeInTheDocument();
    });
    
    const editBtn = screen.getByRole('button', { name: '编辑' });
    await user.click(editBtn);
    
    const cancelBtn = screen.getByRole('button', { name: '取消' });
    await user.click(cancelBtn);
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: '添加备忘' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: '取消' })).not.toBeInTheDocument();
    });
  });

  test('应该保存到localStorage', async () => {
    const user = userEvent.setup();
    render(<NotesPage />);
    
    const titleInput = screen.getByPlaceholderText('标题');
    await user.type(titleInput, '测试存储');
    await user.click(screen.getByRole('button', { name: '添加备忘' }));
    
    await waitFor(() => {
      const stored = localStorage.getItem('aft-notes');
      expect(stored).toBeTruthy();
      const notes = JSON.parse(stored!);
      expect(notes.length).toBe(1);
      expect(notes[0].title).toBe('测试存储');
    });
  });
});
