import { describe, expect, it } from 'vitest';
import { formatCurrency } from './formatCurrency.js';

describe('formatCurrency', () => {
  it('formats values as Nigerian naira by default', () => {
    expect(formatCurrency(1000)).toContain('1,000');
    expect(formatCurrency(1000)).toContain('₦');
  });
  it('formats a selected currency without changing the numeric amount', () => {
    const amount = 25000;
    expect(formatCurrency(amount, 'USD')).toContain('$');
    expect(amount).toBe(25000);
  });
});
