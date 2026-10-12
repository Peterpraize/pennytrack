import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App.jsx';

beforeEach(() => localStorage.clear());

function renderAt(path) {
  return render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>);
}

describe('application routes', () => {
  it('renders the dashboard at the root route', () => {
    renderAt('/');
    expect(screen.getByRole('heading', { name: /good to see you/i })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument();
  });
  it('renders transaction history at /transactions', () => {
    renderAt('/transactions');
    expect(screen.getByRole('heading', { name: /^transactions$/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/search description/i)).toBeInTheDocument();
  });
  it('renders a not-found page for unknown routes', () => {
    renderAt('/somewhere-else');
    expect(screen.getByRole('heading', { name: /we can’t find that page/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to overview/i })).toHaveAttribute('href', '/');
  });
});
