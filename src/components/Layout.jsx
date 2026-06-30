import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { usePendingChanges } from '../context/PendingChangesContext';
import PendingChangesPanel from './PendingChangesPanel';

export default function Layout({ children }) {
  const { email, logout } = useAuth();
  const { pendingCount } = usePendingChanges();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  const links = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/productos', label: 'Productos' },
    { to: '/trabajos', label: 'Trabajos' },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-slate-800 text-white px-4 py-3 flex items-center gap-3">
        <button onClick={() => setMobileMenuOpen(true)} className="text-xl leading-none cursor-pointer">☰</button>
        <span className="font-semibold">Admin</span>
        <button
          onClick={() => setPanelOpen(true)}
          className="ml-auto relative px-2 py-1 bg-slate-700 rounded text-xs cursor-pointer"
        >
          Pendientes {pendingCount > 0 && <span className="ml-1 bg-blue-400 text-white text-xs rounded-full px-1.5">{pendingCount}</span>}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <nav className="relative w-64 bg-slate-800 text-white h-full p-5 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Admin</h2>
              <button onClick={() => setMobileMenuOpen(false)} className="text-xl leading-none cursor-pointer">✕</button>
            </div>
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 mb-1 rounded-lg text-white no-underline ${
                  location.pathname === l.to ? 'bg-slate-600' : 'hover:bg-slate-700'
                }`}
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-auto pt-5 border-t border-slate-600">
              <p className="text-xs text-slate-400 truncate">{email}</p>
              <button
                onClick={logout}
                className="mt-2 w-full bg-red-500 text-white border-0 px-4 py-2 rounded-md cursor-pointer text-sm"
              >
                Cerrar sesión
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* Desktop sidebar */}
      <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-60 bg-slate-800 text-white p-5 flex-col z-20">
        <h2 className="text-lg font-semibold mb-5">Admin</h2>
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className={`block px-4 py-2.5 mb-1 rounded-lg text-white no-underline ${
              location.pathname === l.to ? 'bg-slate-600' : 'hover:bg-slate-700'
            }`}
          >
            {l.label}
          </Link>
        ))}
        <button
          onClick={() => setPanelOpen(true)}
          className="mt-3 w-full px-4 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-left cursor-pointer flex items-center justify-between"
        >
          <span>📋 Pendientes</span>
          {pendingCount > 0 && (
            <span className="bg-blue-400 text-white text-xs font-bold rounded-full px-2 py-0.5">{pendingCount}</span>
          )}
        </button>
        <div className="mt-auto pt-5 border-t border-slate-600">
          <p className="text-xs text-slate-400 truncate">{email}</p>
          <button
            onClick={logout}
            className="mt-2 w-full bg-red-500 text-white border-0 px-4 py-2 rounded-md cursor-pointer text-sm hover:bg-red-600"
          >
            Cerrar sesión
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main className="md:ml-60 pt-14 md:pt-0 p-4 md:p-8">
        {children}
      </main>

      {/* Pending changes panel */}
      <PendingChangesPanel isOpen={panelOpen} onClose={() => setPanelOpen(false)} />
    </div>
  );
}
