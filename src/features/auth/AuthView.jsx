import { Package, Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function AuthView({ email, password, error, loading, onEmailChange, onPasswordChange, onSubmit }) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#ffffff] dark:bg-[#000000] px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white dark:bg-[#161617] rounded-xl shadow-sm p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="p-3 bg-[rgba(0,113,227,0.08)] dark:bg-[rgba(10,132,255,0.18)] rounded-xl mb-4">
              <Package size={28} className="text-[#0071e3] dark:text-[#2997ff]" />
            </div>
            <h1 className="text-xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">Admin</h1>
            <p className="text-sm text-[#6e6e73] dark:text-[#86868b] mt-0.5">Recuerdos Compartidos</p>
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
