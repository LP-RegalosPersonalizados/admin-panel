import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { PendingChangesProvider } from '../context/PendingChangesContext';
import { AuthContainer, ProtectedRoute } from '../features/auth';
import { DashboardContainer } from '../features/dashboard';
import { ProductosContainer } from '../features/productos';
import { TrabajosContainer } from '../features/trabajos';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PendingChangesProvider>
          <Routes>
            <Route path="/" element={<AuthContainer />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardContainer /></ProtectedRoute>} />
            <Route path="/productos" element={<ProtectedRoute><ProductosContainer /></ProtectedRoute>} />
            <Route path="/trabajos" element={<ProtectedRoute><TrabajosContainer /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PendingChangesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
