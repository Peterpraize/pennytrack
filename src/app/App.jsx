import { Route, Routes } from 'react-router-dom';
import AppLayout from './AppLayout.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import TransactionsPage from '../pages/TransactionsPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
