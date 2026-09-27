import React, { useState } from 'react';
import { Lock, ArrowRight, ShieldCheck, Coffee, AlertCircle, ArrowLeft } from 'lucide-react';
import { setAdminAuthenticated } from '../../data/adminStore';

interface AdminLoginProps {
  onSuccess: () => void;
  onBackToWeb: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onBackToWeb }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = password.trim().toLowerCase();
    if (normalized === 'cafegaudi2026') {
      setAdminAuthenticated(true);
      setError(false);
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#1e1f1a] flex flex-col justify-center items-center p-4 sm:p-6 text-neutral-200">
      {/* Back to web link */}
      <div className="w-full max-w-md mb-4 flex justify-between items-center">
        <button
          onClick={onBackToWeb}
          className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-wider text-neutral-400 hover:text-amber-300 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al sitio web</span>
        </button>
        <span className="text-xs font-mono text-neutral-500">v2.4 Sistema Gaudí</span>
      </div>

      <div className="w-full max-w-md bg-[#282922] border border-[#5a5a40]/30 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-md">
        {/* Brand & Badge */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#5a5a40]/30 border border-amber-300/30 flex items-center justify-center mb-4 text-amber-300 shadow-inner">
            <Coffee className="w-8 h-8" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-sans uppercase tracking-wider bg-amber-300/10 text-amber-300 border border-amber-300/20 mb-2 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            Acceso Administrativo
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-white font-medium">
            Café Gaudí
          </h1>
          <p className="text-xs text-neutral-400 mt-1 max-w-xs">
            Panel de control y gestión integral de reservas, galería, carta y configuración de comunicaciones.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-sans uppercase tracking-wider text-neutral-300 mb-1.5 font-medium">
              Contraseña de Administrador
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="Introduce tu contraseña..."
                autoFocus
                className={`w-full pl-10 pr-4 py-3 bg-[#1e1f1a] border rounded-xl text-white placeholder-neutral-500 text-sm focus:outline-hidden transition-all ${
                  error
                    ? 'border-red-500 ring-2 ring-red-500/20'
                    : 'border-[#5a5a40]/40 focus:border-amber-300/60 focus:ring-2 focus:ring-amber-300/20'
                }`}
              />
            </div>
            {error && (
              <p className="flex items-center gap-1 text-xs text-red-400 mt-1.5 font-sans">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Contraseña incorrecta. Por favor, verifica la contraseña introducida.</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#5a5a40] hover:bg-[#6c6c4c] text-white font-sans text-xs uppercase tracking-wider font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-amber-900/10 cursor-pointer"
          >
            <span>Iniciar Sesión</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
