import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import TransactionList from './TransactionList.jsx';

const baseProps = { onEdit: () => {}, onDelete: () => {}, currency: 'NGN' };

describe('TransactionList states', () => {
  it('shows a first-transaction empty state', () => {
    render(<TransactionList {...baseProps} transactions={[]} hasAnyTransactions={false} />);
    expect(screen.getByText(/your story starts here/i)).toBeInTheDocument();
  });
  it('shows a no-results state when filters hide existing transactions', () => {
    render(<TransactionList {...baseProps} transactions={[]} hasAnyTransactions onClearFilters={() => {}} />);
    expect(screen.getByText(/no transactions match/i)).toBeInTheDocument();
  });
});
