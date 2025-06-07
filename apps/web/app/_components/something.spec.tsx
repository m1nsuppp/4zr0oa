import { describe, it, expect, afterEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Something } from './something';

describe('Something', () => {
  afterEach(() => {
    cleanup();
  });

  it('초기 렌더링 시 랜덤한 텍스트가 보인다', () => {
    render(<Something />);
    const text = screen.getByText(/^[a-z0-9]{6}$/);
    expect(text).toBeInTheDocument();
  });

  it('버튼 클릭 시 텍스트가 변경된다', async () => {
    const user = userEvent.setup();
    render(<Something />);

    const { textContent: initialText } = screen.getByRole('paragraph');
    const button = screen.getByRole('button');

    await user.click(button);

    const { textContent: newText } = screen.getByRole('paragraph');
    expect(newText).not.toBe(initialText);
  });
});
