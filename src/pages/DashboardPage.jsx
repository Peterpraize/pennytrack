import { useMemo, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { useTransactions } from '../hooks/useTransactions.js';
import { calculateTotals, getCategoryTotals } from '../utils/financeUtils.js';
import { formatCurrency } from '../utils/formatCurrency.js';
import EmptyState from '../components/EmptyState.jsx';
import SummaryCard from '../components/SummaryCard.jsx';
import TransactionForm from '../components/TransactionForm.jsx';
import TransactionList from '../components/TransactionList.jsx';

export default function DashboardPage() {
  const { currency } = useOutletContext();
  const { transactions, createTransaction, updateTransaction, deleteTransaction, storageStatus } = useTransactions();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const totals = useMemo(() => calculateTotals(transactions), [transactions]);
  const categories = useMemo(() => getCategoryTotals(transactions).slice(0, 4), [transactions]);
  const recent = transactions.slice(0, 5);

  function submit(fields) {
    const result = editing ? updateTransaction(editing.id, fields) : createTransaction(fields);
    if (result.success) { setFormOpen(false); setEditing(null); }
    return result;
  }
  function edit(transaction) { setEditing(transaction); setFormOpen(true); }

  return (
    <div className="dashboard-page">
      <section className="welcome-row"><div><p className="eyebrow">YOUR FINANCES</p><h1>Good to see you.</h1><p className="page-intro">Your money, made easier to understand.</p></div><button type="button" className="button button-primary" onClick={() => { setEditing(null); setFormOpen((open) => !open); }}>{formOpen && !editing ? 'Close form' : '＋ Add transaction'}</button></section>
      {storageStatus.message && <p className="storage-notice" role="status">{storageStatus.message}</p>}
      {formOpen && <section className="panel form-panel"><TransactionForm key={editing?.id ?? 'new'} initialTransaction={editing} onSubmit={submit} onCancel={() => { setFormOpen(false); setEditing(null); }} /></section>}
      <section className="summary-grid" aria-label="Financial summary">
        <SummaryCard title="Total income" value={formatCurrency(totals.income, currency)} description="Money coming in" tone="income" icon="↙" />
        <SummaryCard title="Total expenses" value={formatCurrency(totals.expenses, currency)} description="Money going out" tone="expense" icon="↗" />
        <SummaryCard title="Available balance" value={formatCurrency(totals.balance, currency)} description="Income minus expenses" tone="balance" icon="◈" />
      </section>
      <div className="dashboard-columns">
        <section className="panel activity-panel"><div className="panel-heading"><div><p className="eyebrow">LATEST ACTIVITY</p><h2>Recent transactions</h2></div><Link className="subtle-link" to="/transactions">View all <span aria-hidden="true">→</span></Link></div><TransactionList transactions={recent} hasAnyTransactions={transactions.length > 0} onEdit={edit} onDelete={deleteTransaction} onAdd={() => { setEditing(null); setFormOpen(true); }} currency={currency} /></section>
        <section className="panel category-panel"><div className="panel-heading"><div><p className="eyebrow">SPENDING BREAKDOWN</p><h2>Top categories</h2></div></div>{categories.length ? <div className="category-list">{categories.map((item, index) => { const max = categories[0].amount || 1; return <div className="category-item" key={item.category}><div className="category-row"><span>{item.category}</span><strong>{formatCurrency(item.amount, currency)}</strong></div><div className="category-track"><span className={`category-fill category-fill-${index}`} style={{ width: `${Math.max(5, (item.amount / max) * 100)}%` }} /></div></div>; })}<p className="category-note">Based on recorded expenses.</p></div> : <EmptyState icon="◌" title="Your spending, at a glance" description="Add an expense and its category will appear here." />}</section>
      </div>
    </div>
  );
}
