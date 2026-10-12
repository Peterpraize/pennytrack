import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useTransactions } from './useTransactions.js';

const validTransaction = { id: 'saved-1', description: 'Saved rent', amount: 50000, type: 'expense', category: 'Housing', date: '2026-10-01' };

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('useTransactions persistence', () => {
  it('restores transactions saved in localStorage', () => {
    localStorage.setItem('pennytrack_transactions', JSON.stringify([validTransaction]));
    const { result } = renderHook(() => useTransactions());
    expect(result.current.transactions).toEqual([validTransaction]);
  });
  it('does not crash or overwrite malformed stored JSON', () => {
    localStorage.setItem('pennytrack_transactions', '{broken-json');
    const { result } = renderHook(() => useTransactions());
    expect(result.current.transactions).toEqual([]);
    expect(result.current.storageStatus.kind).toBe('invalid-json');
    expect(localStorage.getItem('pennytrack_transactions')).toBe('{broken-json');
  });
  it('does not add a transaction when storage writes fail', () => {
    const { result } = renderHook(() => useTransactions());
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('quota exceeded'); });
    let outcome;
    act(() => {
      outcome = result.current.createTransaction({ description: 'Lunch', amount: 2500, type: 'expense', category: 'Food', date: '2026-10-12' });
    });
    expect(outcome.success).toBe(false);
    expect(result.current.transactions).toHaveLength(0);
    expect(result.current.storageStatus.kind).toBe('write-error');
  });
  it('creates, updates, and deletes a transaction', () => {
    const { result } = renderHook(() => useTransactions());
    let created;
    act(() => { created = result.current.createTransaction({ description: 'Salary', amount: 100000, type: 'income', category: 'Salary', date: '2026-10-12' }); });
    expect(created.success).toBe(true);
    expect(created.transaction.id).toBeTruthy();
    act(() => { result.current.updateTransaction(created.transaction.id, { description: 'October salary', amount: 110000, type: 'income', category: 'Salary', date: '2026-10-12' }); });
    expect(result.current.transactions[0].description).toBe('October salary');
    expect(result.current.transactions[0].amount).toBe(110000);
    act(() => { result.current.deleteTransaction(created.transaction.id); });
    expect(result.current.transactions).toEqual([]);
  });
});
