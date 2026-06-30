import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { PendingChangesProvider } from '../context/PendingChangesContext';
import ProtectedRoute from './ProtectedRoute';
import Login from './Login';
import Dashboard from './Dashboard';
import Productos from './Productos';
import Trabajos from './Trabajos';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PendingChangesProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/productos" element={<ProtectedRoute><Productos /></ProtectedRoute>} />
            <Route path="/trabajos" element={<ProtectedRoute><Trabajos /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PendingChangesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
