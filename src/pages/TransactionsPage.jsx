import { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useTransactions } from '../hooks/useTransactions.js';
import { filterTransactions } from '../utils/financeUtils.js';
import { TRANSACTION_CATEGORIES } from '../components/TransactionForm.jsx';
import TransactionForm from '../components/TransactionForm.jsx';
import TransactionList from '../components/TransactionList.jsx';

const INITIAL_FILTERS = { search: '', type: 'all', category: 'all' };

export default function TransactionsPage() {
  const { currency } = useOutletContext();
  const { transactions, createTransaction, updateTransaction, deleteTransaction, storageStatus } = useTransactions();
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const visibleTransactions = useMemo(() => filterTransactions(transactions, filters), [transactions, filters]);

  function submit(fields) {
    const result = editing ? updateTransaction(editing.id, fields) : createTransaction(fields);
    if (result.success) { setFormOpen(false); setEditing(null); }
    return result;
  }
  function edit(transaction) { setEditing(transaction); setFormOpen(true); }
  function updateFilter(name, value) { setFilters((current) => ({ ...current, [name]: value })); }

  return (
    <div className="transactions-page">
      <section className="welcome-row"><div><p className="eyebrow">ALL ACTIVITY</p><h1>Transactions</h1><p className="page-intro">Every income and expense in one place.</p></div><button type="button" className="button button-primary" onClick={() => { setEditing(null); setFormOpen((open) => !open); }}>{formOpen && !editing ? 'Close form' : '＋ Add transaction'}</button></section>
      {storageStatus.message && <p className="storage-notice" role="status">{storageStatus.message}</p>}
      {formOpen && <section className="panel form-panel"><TransactionForm key={editing?.id ?? 'new'} initialTransaction={editing} onSubmit={submit} onCancel={() => { setFormOpen(false); setEditing(null); }} /></section>}
      <section className="panel history-panel"><div className="panel-heading"><div><p className="eyebrow">YOUR RECORDS</p><h2>Transaction history</h2></div><span className="record-count">{visibleTransactions.length} {visibleTransactions.length === 1 ? 'record' : 'records'}</span></div>
        <div className="filter-bar"><div className="field search-field"><label htmlFor="transaction-search">Search description</label><input id="transaction-search" type="search" value={filters.search} onChange={(event) => updateFilter('search', event.target.value)} placeholder="Search transactions…" /></div><div className="field"><label htmlFor="transaction-type-filter">Type</label><select id="transaction-type-filter" value={filters.type} onChange={(event) => updateFilter('type', event.target.value)}><option value="all">All types</option><option value="income">Income</option><option value="expense">Expense</option></select></div><div className="field"><label htmlFor="transaction-category-filter">Category</label><select id="transaction-category-filter" value={filters.category} onChange={(event) => updateFilter('category', event.target.value)}><option value="all">All categories</option>{TRANSACTION_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}</select></div></div>
        <TransactionList transactions={visibleTransactions} hasAnyTransactions={transactions.length > 0} onEdit={edit} onDelete={deleteTransaction} onAdd={() => { setEditing(null); setFormOpen(true); }} onClearFilters={() => setFilters(INITIAL_FILTERS)} currency={currency} />
      </section>
    </div>
  );
}
