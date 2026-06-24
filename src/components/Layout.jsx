import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

export default function Layout({ children }) {
  const { email, logout } = useAuth();
  const location = useLocation();

  const links = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/productos', label: 'Productos' },
    { to: '/trabajos', label: 'Trabajos' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-100">
      <nav className="w-60 bg-slate-800 text-white p-5 flex flex-col">
        <h2 className="text-lg font-semibold mb-5">Admin</h2>
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className={`block px-4 py-2.5 mb-1 rounded-lg text-white no-underline ${
              location.pathname === l.to ? 'bg-slate-600' : 'bg-transparent'
            }`}
          >
            {l.label}
          </Link>
        ))}
        <div className="mt-auto pt-5 border-t border-slate-600">
          <p className="text-xs text-slate-400">{email}</p>
          <button
            onClick={logout}
            className="mt-2 bg-red-500 text-white border-0 px-4 py-2 rounded-md cursor-pointer text-sm"
          >
            Cerrar sesión
          </button>
        </div>
      </nav>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
