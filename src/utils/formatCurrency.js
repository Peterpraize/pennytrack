export const DEFAULT_CURRENCY = 'NGN';
export const SUPPORTED_CURRENCIES = [
  { code: 'NGN', label: 'Nigerian naira (₦)' },
  { code: 'USD', label: 'US dollar ($)' },
  { code: 'GBP', label: 'British pound (£)' },
  { code: 'EUR', label: 'Euro (€)' },
];

export function formatCurrency(amount, currencyCode = DEFAULT_CURRENCY) {
  const value = Number.isFinite(Number(amount)) ? Number(amount) : 0;
  try {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${currencyCode} ${value.toLocaleString('en-NG', { maximumFractionDigits: 2 })}`;
  }
}
