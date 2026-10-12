import { describe, expect, it } from 'vitest';
import { calculateTotals, filterTransactions, getCategoryTotals } from './financeUtils.js';

const transactions = [
  { id: 'a', description: 'Monthly salary', amount: 100000, type: 'income', category: 'Salary', date: '2026-10-01' },
  { id: 'b', description: 'Groceries', amount: 25000, type: 'expense', category: 'Food', date: '2026-10-02' },
  { id: 'c', description: 'Bus fare', amount: 1500, type: 'expense', category: 'Transport', date: '2026-10-03' },
];

describe('calculateTotals', () => {
  it('calculates income, expenses, and balance from transactions', () => {
    expect(calculateTotals(transactions)).toEqual({ income: 100000, expenses: 26500, balance: 73500 });
  });
  it('returns zero totals for an empty list', () => {
    expect(calculateTotals([])).toEqual({ income: 0, expenses: 0, balance: 0 });
  });
});

describe('filterTransactions', () => {
  it('searches descriptions without mutating the original array', () => {
    expect(filterTransactions(transactions, { search: 'GROC' }).map((t) => t.id)).toEqual(['b']);
    expect(transactions).toHaveLength(3);
  });
  it('combines type and category filters', () => {
    expect(filterTransactions(transactions, { type: 'expense', category: 'Transport' }).map((t) => t.id)).toEqual(['c']);
  });
});

describe('getCategoryTotals', () => {
  it('groups expense amounts by category', () => {
    expect(getCategoryTotals(transactions)).toEqual([{ category: 'Food', amount: 25000 }, { category: 'Transport', amount: 1500 }]);
  });
});
