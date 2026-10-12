import { formatCurrency } from '../utils/formatCurrency.js';

export default function TransactionItem({ transaction, onEdit, onDelete, currency }) {
  const income = transaction.type === 'income';
  function requestDelete() {
    if (window.confirm(`Delete “${transaction.description}”? This cannot be undone.`)) onDelete(transaction.id);
  }

  return (
    <article className="transaction-row">
      <div className={`transaction-symbol ${income ? 'symbol-income' : 'symbol-expense'}`} aria-hidden="true">{income ? '↙' : '↗'}</div>
      <div className="transaction-main"><p className="transaction-title">{transaction.description}</p><p className="transaction-meta">{transaction.category} <span aria-hidden="true">·</span> <time dateTime={transaction.date}>{new Date(`${transaction.date}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</time></p></div>
      <p className={`transaction-amount ${income ? 'amount-income' : 'amount-expense'}`}><span className="sr-only">{income ? 'Income' : 'Expense'}: </span>{income ? '+' : '−'}{formatCurrency(transaction.amount, currency)}</p>
      <div className="transaction-actions"><button type="button" className="text-action" onClick={() => onEdit(transaction)} aria-label={`Edit ${transaction.description}`}>Edit</button><button type="button" className="text-action text-action-danger" onClick={requestDelete} aria-label={`Delete ${transaction.description}`}>Delete</button></div>
    </article>
  );
}
