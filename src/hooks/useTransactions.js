import { useCallback, useState } from 'react';
import { generateTransactionId } from '../utils/financeUtils.js';
import { readStoredValue, writeStoredValue } from '../utils/storage.js';

const TRANSACTIONS_KEY = 'pennytrack_transactions';

function isValidDateString(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function isValidStoredTransaction(item) {
  return Boolean(item && typeof item === 'object' && typeof item.id === 'string' && item.id &&
    typeof item.description === 'string' && item.description.trim() &&
    Number.isFinite(Number(item.amount)) && Number(item.amount) > 0 &&
    ['income', 'expense'].includes(item.type) && typeof item.category === 'string' && item.category.trim() &&
    isValidDateString(item.date));
}

function readInitialTransactions() {
  const stored = readStoredValue(TRANSACTIONS_KEY, []);
  const validArray = Array.isArray(stored.value) && stored.value.every(isValidStoredTransaction);
  if (!stored.ok) return { transactions: [], status: { kind: stored.kind, message: stored.kind === 'invalid-json' ? 'Saved transaction data could not be read. PennyTrack will not overwrite it automatically.' : 'Browser storage is unavailable. Changes cannot be saved.' } };
  if (!validArray) return { transactions: [], status: { kind: 'invalid-data', message: 'Saved transaction data has an unexpected format. It will not be overwritten automatically.' } };
  return { transactions: stored.value, status: { kind: 'ready', message: '' } };
}

function isValidTransactionFields(fields) {
  return Boolean(
    fields && typeof fields.description === 'string' && fields.description.trim() &&
    Number.isFinite(Number(fields.amount)) && Number(fields.amount) > 0 &&
    ['income', 'expense'].includes(fields.type) && typeof fields.category === 'string' && fields.category.trim() &&
    isValidDateString(fields.date),
  );
}

export function useTransactions() {
  const [initial] = useState(readInitialTransactions);
  const [transactions, setTransactions] = useState(initial.transactions);
  const [storageStatus, setStorageStatus] = useState(initial.status);

  const commit = useCallback((nextTransactions) => {
    if (['invalid-json', 'invalid-data', 'read-error'].includes(storageStatus.kind)) {
      return { success: false, error: new Error('Existing saved data needs attention before PennyTrack can overwrite it.') };
    }
    const result = writeStoredValue(TRANSACTIONS_KEY, nextTransactions);
    if (!result.success) {
      setStorageStatus({ kind: 'write-error', message: 'Your change was not saved. Check browser storage space or permissions and try again.' });
      return result;
    }
    setTransactions(nextTransactions);
    setStorageStatus({ kind: 'ready', message: '' });
    return { success: true };
  }, [storageStatus.kind]);

  const createTransaction = useCallback((fields) => {
    if (!isValidTransactionFields(fields)) return { success: false, error: new Error('Transaction details are invalid.') };
    const transaction = { ...fields, id: generateTransactionId(), description: fields.description.trim(), amount: Number(fields.amount) };
    const result = commit([transaction, ...transactions]);
    return result.success ? { success: true, transaction } : result;
  }, [commit, transactions]);

  const updateTransaction = useCallback((id, fields) => {
    if (!isValidTransactionFields(fields)) return { success: false, error: new Error('Transaction details are invalid.') };
    const next = transactions.map((transaction) => transaction.id === id
      ? { ...fields, id, description: fields.description.trim(), amount: Number(fields.amount) }
      : transaction);
    if (!transactions.some((transaction) => transaction.id === id)) return { success: false, error: new Error('Transaction not found.') };
    return commit(next);
  }, [commit, transactions]);

  const deleteTransaction = useCallback((id) => {
    if (!transactions.some((transaction) => transaction.id === id)) return { success: false, error: new Error('Transaction not found.') };
    return commit(transactions.filter((transaction) => transaction.id !== id));
  }, [commit, transactions]);

  return { transactions, createTransaction, updateTransaction, deleteTransaction, storageStatus };
}
