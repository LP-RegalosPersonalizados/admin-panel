import { Package, Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function AuthView({ email, password, error, loading, onEmailChange, onPasswordChange, onSubmit }) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50 dark:bg-slate-900 px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl mb-4">
              <Package size={28} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Admin</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Recuerdos Compartidos</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle size={16} className="text-red-500 shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              icon={Mail}
              required
              placeholder="admin@ejemplo.com"
            />
            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              icon={Lock}
              required
              placeholder="••••••••"
            />
            <Button type="submit" icon={LogIn} className="w-full" loading={loading}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
