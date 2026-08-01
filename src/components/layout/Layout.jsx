import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Briefcase, Bell, LogOut, Menu, X, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { usePendingChanges } from '../../context/PendingChangesContext';
import PendingChangesPanel from '../../features/pending-changes/PendingChangesPanel';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/productos', label: 'Productos', icon: Package },
  { to: '/trabajos', label: 'Trabajos', icon: Briefcase },
];

export default function Layout({ children }) {
  const { email, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const { pendingCount } = usePendingChanges();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900 dark:bg-slate-950 text-white px-4 py-3 flex items-center gap-3">
        <button onClick={() => setMobileMenuOpen(true)} className="p-1 hover:bg-slate-800 rounded-md cursor-pointer">
          <Menu size={20} />
        </button>
        <span className="font-semibold">Admin</span>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={toggleTheme} className="p-1.5 hover:bg-slate-800 rounded-md cursor-pointer">
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button onClick={() => setPanelOpen(true)} className="relative p-1.5 hover:bg-slate-800 rounded-md cursor-pointer">
            <Bell size={18} />
            {pendingCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                {pendingCount > 9 ? '9+' : pendingCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <nav className="relative w-64 bg-slate-900 dark:bg-slate-950 text-white h-full p-5 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Admin</h2>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1 hover:bg-slate-800 rounded-md cursor-pointer">
                <X size={20} />
              </button>
            </div>
            {navLinks.map((l) => {
              const Icon = l.icon;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 mb-1 rounded-lg text-white no-underline ${
                    location.pathname === l.to ? 'bg-slate-700' : 'hover:bg-slate-800'
                  }`}
                >
                  <Icon size={18} />
                  <span>{l.label}</span>
                </Link>
              );
            })}
            <div className="mt-auto pt-5 border-t border-slate-700">
              <p className="text-xs text-slate-400 truncate">{email}</p>
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="mt-2 w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm cursor-pointer"
              >
                <LogOut size={16} />
                Cerrar sesión
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* Desktop sidebar */}
      <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-60 bg-slate-900 dark:bg-slate-950 text-white p-5 flex-col z-20 shadow-lg">
        <div className="mb-6 px-2">
          <h2 className="text-lg font-bold">Admin</h2>
          <p className="text-xs text-slate-400 mt-0.5">Recuerdos Compartidos</p>
        </div>
        {navLinks.map((l) => {
          const Icon = l.icon;
          return (
            <Link
              key={l.to}
              to={l.to}
              className={`flex items-center gap-3 px-4 py-2.5 mb-1 rounded-lg text-white no-underline ${
                location.pathname === l.to ? 'bg-slate-700' : 'hover:bg-slate-800'
              }`}
            >
              <Icon size={18} />
              <span>{l.label}</span>
            </Link>
          );
        })}
        <button
          onClick={() => setPanelOpen(true)}
          className="mt-3 w-full flex items-center justify-between px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Bell size={16} />
            Pendientes
          </span>
          {pendingCount > 0 && (
            <span className="bg-blue-500 text-white text-xs font-bold rounded-full px-2 py-0.5">{pendingCount}</span>
          )}
        </button>

        <button
          onClick={toggleTheme}
          className="mt-2 w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white text-sm cursor-pointer"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
          <span>{isDark ? 'Modo claro' : 'Modo oscuro'}</span>
        </button>

        <div className="mt-auto pt-5 border-t border-slate-700">
          <p className="text-xs text-slate-400 truncate px-2">{email}</p>
          <button
            onClick={logout}
            className="mt-2 w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm cursor-pointer"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main className="px-4 py-4 pt-14 md:ml-60 md:px-8 md:py-8 md:pt-0">
        {children}
      </main>

      {/* Pending changes panel */}
      <PendingChangesPanel isOpen={panelOpen} onClose={() => setPanelOpen(false)} />
    </div>
  );
}
