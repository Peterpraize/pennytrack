import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import TransactionForm from './TransactionForm.jsx';

afterEach(() => {
  cleanup();
});

describe('TransactionForm', () => {
  it('rejects a zero or invalid amount', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TransactionForm onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText(/description/i), 'Lunch');
    await user.clear(screen.getByLabelText(/amount/i));
    await user.type(screen.getByLabelText(/amount/i), '0');
    await user.selectOptions(screen.getByLabelText(/category/i), 'Food');
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2026-10-12' } });
    await user.click(screen.getByRole('button', { name: /save transaction/i }));
    expect(screen.getByText(/greater than zero/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
  it('submits valid fields', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TransactionForm onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText(/description/i), 'Lunch');
    await user.type(screen.getByLabelText(/amount/i), '2500');
    await user.selectOptions(screen.getByLabelText(/type/i), 'expense');
    await user.selectOptions(screen.getByLabelText(/category/i), 'Food');
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2026-10-12' } });
    await user.click(screen.getByRole('button', { name: /save transaction/i }));
    expect(onSubmit).toHaveBeenCalledWith({ description: 'Lunch', amount: 2500, type: 'expense', category: 'Food', date: '2026-10-12' });
  });
});
