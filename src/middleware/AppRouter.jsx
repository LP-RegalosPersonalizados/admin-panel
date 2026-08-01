import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import { DataProvider } from '../context/DataContext';
import { PendingChangesProvider } from '../context/PendingChangesContext';
import { ToastProvider } from '../components/ui/Toast';
import { AuthContainer, ProtectedRoute } from '../features/auth';
import { DashboardContainer } from '../features/dashboard';
import { ProductosContainer } from '../features/productos';
import { TrabajosContainer } from '../features/trabajos';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <DataProvider>
            <PendingChangesProvider>
              <ToastProvider>
                <Routes>
                  <Route path="/" element={<AuthContainer />} />
                  <Route path="/dashboard" element={<ProtectedRoute><DashboardContainer /></ProtectedRoute>} />
                  <Route path="/productos" element={<ProtectedRoute><ProductosContainer /></ProtectedRoute>} />
                  <Route path="/trabajos" element={<ProtectedRoute><TrabajosContainer /></ProtectedRoute>} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </ToastProvider>
            </PendingChangesProvider>
          </DataProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
