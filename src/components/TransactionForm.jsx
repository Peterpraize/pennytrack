import { useState } from 'react';

export const TRANSACTION_CATEGORIES = ['Salary', 'Freelance', 'Food', 'Transport', 'Education', 'Bills', 'Shopping', 'Health', 'Housing', 'Other'];

function localDateString() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function isValidDateString(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function validate(fields) {
  const errors = {};
  if (!fields.description.trim()) errors.description = 'Enter a description.';
  if (!String(fields.amount).trim() || !Number.isFinite(Number(fields.amount)) || Number(fields.amount) <= 0) errors.amount = 'Enter an amount greater than zero.';
  if (!['income', 'expense'].includes(fields.type)) errors.type = 'Choose income or expense.';
  if (!fields.category) errors.category = 'Choose a category.';
  if (!isValidDateString(fields.date)) errors.date = 'Choose a valid date.';
  return errors;
}

export default function TransactionForm({ initialTransaction, onSubmit, onCancel }) {
  const [fields, setFields] = useState(() => ({
    description: initialTransaction?.description ?? '',
    amount: initialTransaction?.amount ?? '',
    type: initialTransaction?.type ?? 'expense',
    category: initialTransaction?.category ?? '',
    date: initialTransaction?.date ?? localDateString(),
  }));
  const [errors, setErrors] = useState({});

  function changeField(event) {
    const { name, value } = event.target;
    setFields((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined, form: undefined }));
  }

  function submit(event) {
    event.preventDefault();
    const nextErrors = validate(fields);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    const result = onSubmit({ ...fields, amount: Number(fields.amount) });
    if (result?.success === false) setErrors({ form: result.error?.message || 'The transaction could not be saved.' });
  }

  return (
    <form className="transaction-form" onSubmit={submit} noValidate>
      <div className="form-heading"><div><p className="eyebrow">TRANSACTION DETAILS</p><h2>{initialTransaction ? 'Edit transaction' : 'Add a transaction'}</h2></div>{onCancel && <button className="icon-button" type="button" aria-label="Close transaction form" onClick={onCancel}>×</button>}</div>
      <div className="form-grid">
        <div className="field field-wide"><label htmlFor="transaction-description">Description</label><input id="transaction-description" name="description" value={fields.description} onChange={changeField} placeholder="e.g. Weekly groceries" aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? 'description-error' : undefined} />{errors.description && <span id="description-error" className="field-error">{errors.description}</span>}</div>
        <div className="field"><label htmlFor="transaction-amount">Amount</label><input id="transaction-amount" name="amount" type="number" min="0.01" step="0.01" inputMode="decimal" value={fields.amount} onChange={changeField} placeholder="0.00" aria-invalid={Boolean(errors.amount)} aria-describedby={errors.amount ? 'amount-error' : undefined} />{errors.amount && <span id="amount-error" className="field-error">{errors.amount}</span>}</div>
        <div className="field"><label htmlFor="transaction-type">Type</label><select id="transaction-type" name="type" value={fields.type} onChange={changeField}><option value="expense">Expense</option><option value="income">Income</option></select></div>
        <div className="field"><label htmlFor="transaction-category">Category</label><select id="transaction-category" name="category" value={fields.category} onChange={changeField} aria-invalid={Boolean(errors.category)} aria-describedby={errors.category ? 'category-error' : undefined}><option value="">Choose a category</option>{TRANSACTION_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}</select>{errors.category && <span id="category-error" className="field-error">{errors.category}</span>}</div>
        <div className="field"><label htmlFor="transaction-date">Date</label><input id="transaction-date" name="date" type="date" value={fields.date} onChange={changeField} aria-invalid={Boolean(errors.date)} aria-describedby={errors.date ? 'date-error' : undefined} />{errors.date && <span id="date-error" className="field-error">{errors.date}</span>}</div>
      </div>
      {errors.form && <p className="form-error" role="alert">{errors.form}</p>}
      <div className="form-actions">{onCancel && <button className="button button-secondary" type="button" onClick={onCancel}>Cancel</button>}<button className="button button-primary" type="submit">Save transaction</button></div>
    </form>
  );
}
