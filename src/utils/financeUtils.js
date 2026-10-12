export function calculateTotals(transactions = []) {
  const totals = transactions.reduce((result, transaction) => {
    const amount = Number(transaction.amount);
    if (!Number.isFinite(amount) || amount <= 0) return result;
    if (transaction.type === 'income') result.income += amount;
    if (transaction.type === 'expense') result.expenses += amount;
    return result;
  }, { income: 0, expenses: 0, balance: 0 });

  totals.balance = totals.income - totals.expenses;
  return totals;
}

export function filterTransactions(transactions = [], filters = {}) {
  const query = String(filters.search ?? '').trim().toLocaleLowerCase();
  const type = filters.type ?? 'all';
  const category = filters.category ?? 'all';

  return transactions.filter((transaction) => {
    const matchesSearch = !query || transaction.description.toLocaleLowerCase().includes(query);
    const matchesType = type === 'all' || transaction.type === type;
    const matchesCategory = category === 'all' || transaction.category === category;
    return matchesSearch && matchesType && matchesCategory;
  });
}

export function getCategoryTotals(transactions = []) {
  const totals = new Map();
  for (const transaction of transactions) {
    if (transaction.type !== 'expense' || !Number.isFinite(Number(transaction.amount))) continue;
    totals.set(transaction.category, (totals.get(transaction.category) ?? 0) + Number(transaction.amount));
  }
  return [...totals.entries()]
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}

export function generateTransactionId() {
  if (typeof globalThis.crypto?.randomUUID === 'function') return globalThis.crypto.randomUUID();
  return `txn-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}
