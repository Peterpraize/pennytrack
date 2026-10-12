import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { DEFAULT_CURRENCY, SUPPORTED_CURRENCIES } from '../utils/formatCurrency.js';
import { readStoredValue, writeStoredValue } from '../utils/storage.js';

function readCurrency() {
  const stored = readStoredValue('pennytrack_settings', {});
  const currency = stored.value?.currency;
  return SUPPORTED_CURRENCIES.some((item) => item.code === currency) ? currency : DEFAULT_CURRENCY;
}

export default function AppLayout() {
  const [currency, setCurrency] = useState(readCurrency);
  const [settingsMessage, setSettingsMessage] = useState('');

  function changeCurrency(event) {
    const nextCurrency = event.target.value;
    const result = writeStoredValue('pennytrack_settings', { currency: nextCurrency });
    if (!result.success) {
      setSettingsMessage('Currency preference could not be saved.');
      return;
    }
    setCurrency(nextCurrency);
    setSettingsMessage('');
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink className="brand" to="/" aria-label="PennyTrack home"><span className="brand-mark" aria-hidden="true">P</span><span>PennyTrack</span></NavLink>
        <nav className="main-nav" aria-label="Main navigation"><NavLink to="/" end>Overview</NavLink><NavLink to="/transactions">Transactions</NavLink></nav>
        <div className="currency-setting"><label htmlFor="display-currency">Currency</label><select id="display-currency" value={currency} onChange={changeCurrency} aria-describedby={settingsMessage ? 'currency-message' : undefined}>{SUPPORTED_CURRENCIES.map((item) => <option key={item.code} value={item.code}>{item.code}</option>)}</select>{settingsMessage && <span id="currency-message" className="sr-only" role="status">{settingsMessage}</span>}</div>
      </header>
      <main className="page-container"><Outlet context={{ currency }} /></main>
      <footer className="footer">A clearer view of your money, one transaction at a time.</footer>
    </div>
  );
}
