import { Navigate, Route, Routes } from 'react-router-dom';
import { BioPage } from '../presentation/pages/BioPage';
import { AdminPage } from '../presentation/pages/AdminPage';
import { AdminTypesPage } from '../presentation/pages/AdminTypesPage';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<BioPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/admin/types" element={<AdminTypesPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
