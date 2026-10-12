import EmptyState from './EmptyState.jsx';
import TransactionItem from './TransactionItem.jsx';

export default function TransactionList({ transactions, hasAnyTransactions, onEdit, onDelete, onAdd, onClearFilters, currency = 'NGN' }) {
  if (!transactions.length && !hasAnyTransactions) {
    return <EmptyState icon="＋" title="Your story starts here" description="Add your first income or expense to start seeing your money more clearly." action={onAdd && <button type="button" className="button button-primary" onClick={onAdd}>Add first transaction</button>} />;
  }
  if (!transactions.length) {
    return <EmptyState icon="⌕" title="No transactions match" description="Try another search or clear your filters to see more activity." action={onClearFilters && <button type="button" className="button button-secondary" onClick={onClearFilters}>Clear filters</button>} />;
  }
  return <div className="transaction-list">{transactions.map((transaction) => <TransactionItem key={transaction.id} transaction={transaction} onEdit={onEdit} onDelete={onDelete} currency={currency} />)}</div>;
}
