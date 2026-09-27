import React, { useState, useEffect } from 'react';
import {
  Mail,
  Save,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Eye,
  Info,
  HelpCircle,
  Copy,
  Check,
  Server,
  Send,
  Loader2,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Key,
  Clock,
  ListFilter
} from 'lucide-react';
import { ConfirmationEmailConfig, EmailDeliveryLog, SmtpSettings } from '../../types';
import { EmailPreviewCard } from '../EmailPreviewCard';
import { getStoredSmtpSettings, saveSmtpSettings } from '../../data/adminStore';

interface AdminEmailViewProps {
  config: ConfirmationEmailConfig;
  onSaveConfig: (cfg: ConfirmationEmailConfig) => void;
  onResetConfig: () => void;
}

export const AdminEmailView: React.FC<AdminEmailViewProps> = ({
  config,
  onSaveConfig,
  onResetConfig,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'plantilla' | 'smtp' | 'logs'>('plantilla');
  const [formConfig, setFormConfig] = useState<ConfirmationEmailConfig>(config);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedTag, setCopiedTag] = useState<string | null>(null);

  // SMTP Settings State
  const [smtpForm, setSmtpForm] = useState<SmtpSettings>(getStoredSmtpSettings);
  const [showPassword, setShowPassword] = useState(false);

  // Test Email State
  const [testRecipient, setTestRecipient] = useState('nordinmm28@gmail.com');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message?: string;
    previewUrl?: string;
    provider?: string;
    error?: string;
  } | null>(null);

  // Delivery Logs State
  const [logs, setLogs] = useState<EmailDeliveryLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 3500);
  };

  const fetchLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const res = await fetch('/api/email/logs');
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (e) {
      console.error('Error fetching email logs:', e);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  useEffect(() => {
    if (activeSubTab === 'logs') {
      fetchLogs();
    }
  }, [activeSubTab]);

  useEffect(() => {
    fetch('/api/email/config')
      .then((r) => r.json())
      .then((data) => {
        if (data) {
          setSmtpForm((prev) => ({
            ...prev,
            host: data.host || prev.host,
            port: data.port || prev.port,
            secure: data.secure !== undefined ? data.secure : prev.secure,
            user: data.user || prev.user,
            pass: data.pass || prev.pass,
            fromName: data.fromName || prev.fromName || 'Café Gaudí',
            fromEmail: data.fromEmail || prev.fromEmail,
            resendApiKey: data.resendApiKey || prev.resendApiKey,
          }));
        }
      })
      .catch((e) => console.warn('Could not sync SMTP from server:', e));
  }, []);

  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formConfig);
    showToast('Plantilla de email guardada correctamente');
  };

  const handleReset = () => {
    if (confirm('¿Restablecer la plantilla de correo a los textos oficiales originales?')) {
      onResetConfig();
      showToast('Plantilla restablecida a valores predeterminados');
    }
  };

  const handleSaveSmtp = async (e: React.FormEvent) => {
    e.preventDefault();
    saveSmtpSettings(smtpForm);
    try {
      const res = await fetch('/api/email/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(smtpForm),
      });
      if (res.ok) {
        showToast('Configuración SMTP guardada y sincronizada en el servidor');
      } else {
        showToast('Configuración guardada localmente');
      }
    } catch {
      showToast('Configuración guardada localmente');
    }
  };

  const handleTriggerTestEmail = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!testRecipient.trim() || !testRecipient.includes('@')) {
      showToast('Por favor, indica un correo electrónico válido', 'error');
      return;
    }

    setIsSendingTest(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/email/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: testRecipient.trim(),
          smtpConfig: smtpForm,
        }),
      });

      const data = await response.json();
      setTestResult(data);
      if (data.success) {
        showToast(`Email de prueba tramitado hacia ${testRecipient}`);
        if (activeSubTab === 'logs') fetchLogs();
      } else {
        showToast(data.error || 'Error al enviar email de prueba', 'error');
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        error: err.message || 'No se pudo contactar con el servidor de correo',
      });
      showToast('Error de comunicación con el servidor', 'error');
    } finally {
      setIsSendingTest(false);
    }
  };

  const insertVariable = (tag: string) => {
    navigator.clipboard?.writeText(tag);
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 2000);

    setFormConfig((prev) => ({
      ...prev,
      greetingText: prev.greetingText + ' ' + tag,
    }));
    showToast(`Etiqueta ${tag} copiada e insertada`);
  };

  const AVAILABLE_TAGS = [
    { tag: '{nombre}', desc: 'Nombre del comensal' },
    { tag: '{codigo}', desc: 'Localizador (#GAUDI-...)' },
    { tag: '{fecha}', desc: 'Fecha reservada' },
    { tag: '{hora}', desc: 'Hora (ej. 14:30)' },
    { tag: '{personas}', desc: 'Nº comensales' },
    { tag: '{zona}', desc: 'Terraza o Salón' },
    { tag: '{telefono_local}', desc: 'Teléfono del café' },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-sans animate-fade-in border ${
            notification.type === 'success'
              ? 'bg-emerald-600 border-emerald-500 text-white'
              : 'bg-red-600 border-red-500 text-white'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-white font-medium flex items-center gap-2">
            <Mail className="w-6 h-6 text-amber-300" />
            <span>Sistema de Correos de Confirmación de Reserva</span>
          </h2>
          <p className="text-xs text-neutral-400 font-sans mt-0.5">
            Gestiona la plantilla, el servidor de salida (SMTP / Resend) y el registro en tiempo real de envíos.
          </p>
        </div>

        {/* Sub-tabs switch */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#1a1b16] p-1.5 rounded-2xl border border-[#5a5a40]/30 self-start">
          <button
            type="button"
            onClick={() => setActiveSubTab('plantilla')}
            className={`px-4 py-2 rounded-xl text-xs font-sans font-medium transition-colors flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'plantilla'
                ? 'bg-[#5a5a40] text-white shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-[#2c2d24]'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Plantilla & Textos</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('smtp')}
            className={`px-4 py-2 rounded-xl text-xs font-sans font-medium transition-colors flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'smtp'
                ? 'bg-[#5a5a40] text-white shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-[#2c2d24]'
            }`}
          >
            <Server className="w-3.5 h-3.5 text-amber-300" />
            <span>Servidor de Salida (SMTP / Resend)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('logs')}
            className={`px-4 py-2 rounded-xl text-xs font-sans font-medium transition-colors flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'logs'
                ? 'bg-[#5a5a40] text-white shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-[#2c2d24]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Registro de Envíos</span>
          </button>
        </div>
      </div>

      {/* QUICK TEST BAR - ALWAYS AVAILABLE FOR IMMEDIATE DIAGNOSTIC */}
      <div className="bg-[#24251e] border border-[#5a5a40]/40 rounded-3xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white font-sans flex items-center gap-2">
                <span>Prueba Inmediata de Envío a tu Buzón</span>
                <span className="text-[10px] uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                  Test Live
                </span>
              </h3>
              <p className="text-xs text-neutral-400 font-sans mt-0.5">
                Verifica el funcionamiento del servicio enviando un correo de prueba a tu dirección en este instante.
              </p>
            </div>
          </div>

          <form onSubmit={handleTriggerTestEmail} className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
            <input
              type="email"
              required
              value={testRecipient}
              onChange={(e) => setTestRecipient(e.target.value)}
              placeholder="tu-correo@gmail.com"
              className="w-full sm:w-64 px-3.5 py-2 bg-[#1a1b16] border border-[#5a5a40]/40 rounded-xl text-xs font-mono text-white placeholder-neutral-500 focus:outline-hidden focus:border-amber-300"
            />
            <button
              type="submit"
              disabled={isSendingTest}
              className="w-full sm:w-auto px-5 py-2 bg-amber-500 hover:bg-amber-400 text-[#1a1b16] font-sans text-xs font-semibold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md disabled:opacity-50 shrink-0"
            >
              {isSendingTest ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar Test Ahora</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Immediate Result Card */}
        {testResult && (
          <div
            className={`mt-4 p-4 rounded-2xl border text-xs font-sans flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
              testResult.success
                ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300'
                : 'bg-red-950/30 border-red-800/40 text-red-300'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              )}
              <div>
                <p className="font-semibold text-white">
                  {testResult.success
                    ? '¡Envío completado exitosamente!'
                    : 'Aviso en el despacho del correo:'}
                </p>
                <p className="text-neutral-300 mt-0.5">{testResult.message || testResult.error}</p>
                {testResult.provider && (
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Canal empleado: <strong className="text-amber-300">{testResult.provider}</strong>
                  </p>
                )}
              </div>
            </div>

            {testResult.previewUrl && (
              <a
                href={testResult.previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-neutral-900 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-colors shrink-0 shadow-sm"
              >
                <span>Ver Email Renderizado</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}
      </div>

      {/* TAB 1: TEMPLATE & PREVIEW */}
      {activeSubTab === 'plantilla' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Left Col: Editor Form */}
          <div className="bg-[#24251e] border border-[#5a5a40]/30 rounded-3xl p-6 shadow-xl space-y-5">
            {/* Dynamic variables bar */}
            <div className="bg-[#1e1f1a] border border-[#5a5a40]/30 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-sans uppercase tracking-wider text-amber-300 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Variables Dinámicas Disponibles</span>
                </span>
                <span className="text-[11px] text-neutral-500 font-sans">Haz clic para copiar / insertar</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_TAGS.map(({ tag, desc }) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => insertVariable(tag)}
                    className="px-2.5 py-1 bg-[#282922] hover:bg-[#34352b] text-neutral-200 hover:text-white border border-[#5a5a40]/30 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                    title={desc}
                  >
                    <span className="text-amber-300">{tag}</span>
                    <span className="text-[10px] text-neutral-400 font-sans">({desc})</span>
                    {copiedTag === tag && <Check className="w-3 h-3 text-emerald-400" />}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSaveTemplate} className="space-y-4">
              {/* Sender and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans uppercase tracking-wider text-neutral-300 mb-1">
                    Nombre del Remitente
                  </label>
                  <input
                    type="text"
                    required
                    value={formConfig.senderName}
                    onChange={(e) => setFormConfig({ ...formConfig, senderName: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans uppercase tracking-wider text-neutral-300 mb-1">
                    Email Remitente (From)
                  </label>
                  <input
                    type="email"
                    required
                    value={formConfig.senderEmail}
                    onChange={(e) => setFormConfig({ ...formConfig, senderEmail: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300/50"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-sans uppercase tracking-wider text-neutral-300 mb-1">
                  Asunto del Correo
                </label>
                <input
                  type="text"
                  required
                  value={formConfig.subject}
                  onChange={(e) => setFormConfig({ ...formConfig, subject: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300/50 font-sans"
                />
              </div>

              {/* Headline */}
              <div>
                <label className="block text-xs font-sans uppercase tracking-wider text-neutral-300 mb-1">
                  Encabezado / Titular Principal
                </label>
                <input
                  type="text"
                  required
                  value={formConfig.headline}
                  onChange={(e) => setFormConfig({ ...formConfig, headline: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300/50"
                />
              </div>

              {/* Greeting & Body Text */}
              <div>
                <label className="block text-xs font-sans uppercase tracking-wider text-neutral-300 mb-1">
                  Mensaje de Bienvenida & Cuerpo
                </label>
                <textarea
                  required
                  rows={4}
                  value={formConfig.greetingText}
                  onChange={(e) => setFormConfig({ ...formConfig, greetingText: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300/50 font-sans leading-relaxed"
                />
              </div>

              {/* Policy Notes (15 min courtesy) */}
              <div>
                <label className="block text-xs font-sans uppercase tracking-wider text-neutral-300 mb-1">
                  Política de Puntualidad y Cortesía (15 min)
                </label>
                <textarea
                  rows={2}
                  value={formConfig.policyNotes}
                  onChange={(e) => setFormConfig({ ...formConfig, policyNotes: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300/50 font-sans"
                />
              </div>

              {/* Allergens note */}
              <div>
                <label className="block text-xs font-sans uppercase tracking-wider text-neutral-300 mb-1">
                  Nota de Alérgenos & Necesidades Especiales
                </label>
                <input
                  type="text"
                  value={formConfig.accentNote || ''}
                  onChange={(e) => setFormConfig({ ...formConfig, accentNote: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300/50"
                />
              </div>

              {/* Footer notes */}
              <div>
                <label className="block text-xs font-sans uppercase tracking-wider text-neutral-300 mb-1">
                  Pie de Página & Dirección
                </label>
                <input
                  type="text"
                  value={formConfig.footerNotes}
                  onChange={(e) => setFormConfig({ ...formConfig, footerNotes: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300/50"
                />
              </div>

              <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white rounded-xl text-xs font-sans transition-colors cursor-pointer"
                >
                  Restablecer Original
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#5a5a40] hover:bg-[#6c6c4c] text-white font-sans text-xs uppercase tracking-wider font-semibold rounded-xl flex items-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Plantilla</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Col: Live Email Preview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-sans uppercase tracking-wider text-neutral-400 font-semibold flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-amber-300" />
                <span>Previsualización en Tiempo Real del Correo</span>
              </span>
              <span className="text-[11px] text-neutral-500 font-sans">Diseño adaptado para móviles y escritorio</span>
            </div>

            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-neutral-300">
              <EmailPreviewCard config={formConfig} isModal={false} />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SMTP / SERVER SETTINGS */}
      {activeSubTab === 'smtp' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#24251e] border border-[#5a5a40]/30 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#5a5a40]/30 pb-4">
              <div>
                <h3 className="text-base font-medium text-white font-serif flex items-center gap-2">
                  <Server className="w-5 h-5 text-amber-300" />
                  <span>Parámetros del Servidor SMTP</span>
                </h3>
                <p className="text-xs text-neutral-400 font-sans mt-0.5">
                  Permite que Café Gaudí despache los correos utilizando tu propia cuenta de Gmail, Brevo, Mailgun o hosting.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveSmtp} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-sans uppercase tracking-wider text-neutral-300 mb-1">
                    Servidor SMTP (Host)
                  </label>
                  <input
                    type="text"
                    placeholder="smtp.gmail.com o smtp-relay.brevo.com"
                    value={smtpForm.host}
                    onChange={(e) => setSmtpForm({ ...smtpForm, host: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white text-xs font-mono focus:outline-hidden focus:border-amber-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans uppercase tracking-wider text-neutral-300 mb-1">
                    Puerto
                  </label>
                  <input
                    type="number"
                    placeholder="587 o 465"
                    value={smtpForm.port}
                    onChange={(e) => setSmtpForm({ ...smtpForm, port: parseInt(e.target.value) || 587 })}
                    className="w-full px-3 py-2 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white text-xs font-mono focus:outline-hidden focus:border-amber-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans uppercase tracking-wider text-neutral-300 mb-1">
                    Usuario / Email de Envío
                  </label>
                  <input
                    type="text"
                    placeholder="ejemplo@gmail.com"
                    value={smtpForm.user}
                    onChange={(e) => setSmtpForm({ ...smtpForm, user: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white text-xs font-mono focus:outline-hidden focus:border-amber-300"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-sans uppercase tracking-wider text-neutral-300">
                      Contraseña / App Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[10px] text-amber-300 hover:underline cursor-pointer"
                    >
                      {showPassword ? 'Ocultar' : 'Mostrar'}
                    </button>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Contraseña de aplicación de 16 caracteres"
                    value={smtpForm.pass}
                    onChange={(e) => setSmtpForm({ ...smtpForm, pass: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white text-xs font-mono focus:outline-hidden focus:border-amber-300"
                  />
                </div>
              </div>

              {/* Secure SSL checkbox */}
              <div className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  id="secure_ssl"
                  checked={smtpForm.secure}
                  onChange={(e) => setSmtpForm({ ...smtpForm, secure: e.target.checked })}
                  className="rounded border-[#5a5a40]/40 bg-[#1e1f1a] text-amber-400 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="secure_ssl" className="text-xs text-neutral-300 font-sans cursor-pointer">
                  Utilizar SSL/TLS directo (Marcar si usas puerto 465)
                </label>
              </div>

              {/* Or Resend API Key */}
              <div className="pt-3 border-t border-neutral-800">
                <label className="block text-xs font-sans uppercase tracking-wider text-neutral-300 mb-1 flex items-center justify-between">
                  <span>Alternativa: Resend API Key (Opcional)</span>
                  <span className="text-[10px] text-neutral-400 font-normal">Si prefieres API en vez de SMTP</span>
                </label>
                <input
                  type="password"
                  placeholder="re_xxxxxxxxxxxx..."
                  value={smtpForm.resendApiKey || ''}
                  onChange={(e) => setSmtpForm({ ...smtpForm, resendApiKey: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white text-xs font-mono focus:outline-hidden focus:border-amber-300"
                />
              </div>

              <div className="pt-4 border-t border-neutral-800 flex items-center justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#5a5a40] hover:bg-[#6c6c4c] text-white font-sans text-xs uppercase tracking-wider font-semibold rounded-xl flex items-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Parámetros SMTP</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Col: Quick Instructions Card */}
          <div className="space-y-4">
            <div className="bg-[#1e1f1a] border border-[#5a5a40]/30 rounded-3xl p-5 shadow-lg space-y-3 font-sans text-xs">
              <h4 className="font-semibold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>¿Cómo configurar Gmail en 2 minutos?</span>
              </h4>
              <p className="text-neutral-300 leading-relaxed">
                Para enviar con una cuenta @gmail.com sin errores de seguridad de Google:
              </p>
              <ol className="list-decimal list-inside space-y-1.5 text-neutral-300 leading-relaxed">
                <li>Ve a <strong>myaccount.google.com/security</strong>.</li>
                <li>Activa la <strong>Verificación en dos pasos</strong>.</li>
                <li>En el buscador escribe <strong>"Contraseñas de aplicaciones"</strong>.</li>
                <li>Crea una llamada "Café Gaudí" y copia los 16 caracteres.</li>
                <li>Pega ese código en <strong>Contraseña</strong> arriba con el host <strong>smtp.gmail.com</strong> y puerto <strong>587</strong>.</li>
              </ol>
            </div>

            <div className="bg-[#1e1f1a] border border-[#5a5a40]/30 rounded-3xl p-5 shadow-lg space-y-3 font-sans text-xs">
              <h4 className="font-semibold text-neutral-300 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <Key className="w-4 h-4 text-amber-300" />
                <span>Modo de Pruebas Automático</span>
              </h4>
              <p className="text-neutral-400 leading-relaxed">
                Si aún no has introducido un SMTP propio, el sistema no bloquea las reservas: genera los correos en la bandeja de diagnóstico <strong>Ethereal</strong> y permite abrir el mensaje preformateado en tu gestor de correo con 1 solo clic.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DELIVERY LOGS */}
      {activeSubTab === 'logs' && (
        <div className="bg-[#24251e] border border-[#5a5a40]/30 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#5a5a40]/30 pb-4">
            <div>
              <h3 className="text-base font-medium text-white font-serif flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-300" />
                <span>Registro de Envíos de Correo en Tiempo Real</span>
              </h3>
              <p className="text-xs text-neutral-400 font-sans mt-0.5">
                Historial de notificaciones emitidas por el sistema a clientes y comensales.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchLogs}
              disabled={isLoadingLogs}
              className="px-3.5 py-2 bg-[#1a1b16] hover:bg-[#2c2d24] text-neutral-300 hover:text-white border border-[#5a5a40]/30 rounded-xl text-xs font-sans flex items-center gap-1.5 transition-colors cursor-pointer self-start"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLogs ? 'animate-spin' : ''}`} />
              <span>Actualizar Registros</span>
            </button>
          </div>

          {logs.length === 0 ? (
            <div className="py-12 text-center font-sans space-y-2">
              <Mail className="w-10 h-10 text-neutral-600 mx-auto mb-2" />
              <p className="text-sm text-neutral-300 font-medium">Aún no hay registros de envío almacenados</p>
              <p className="text-xs text-neutral-500 max-w-md mx-auto">
                Realiza una reserva desde la web o haz una prueba en la barra superior para ver reflejado el seguimiento de entrega aquí.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-3">Fecha / Hora</th>
                    <th className="py-3 px-3">Destinatario</th>
                    <th className="py-3 px-3">Localizador</th>
                    <th className="py-3 px-3">Canal</th>
                    <th className="py-3 px-3">Estado</th>
                    <th className="py-3 px-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#1a1b16]/50 transition-colors">
                      <td className="py-3 px-3 text-neutral-300 font-mono text-[11px]">
                        {new Date(log.timestamp).toLocaleString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </td>
                      <td className="py-3 px-3 text-white font-medium">
                        {log.to}
                      </td>
                      <td className="py-3 px-3">
                        {log.reservationCode ? (
                          <span className="font-mono text-amber-300 font-bold bg-[#1a1b16] px-2 py-0.5 rounded-md border border-[#5a5a40]/30">
                            #{log.reservationCode}
                          </span>
                        ) : (
                          <span className="text-neutral-500">-</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-neutral-300 capitalize">
                        {log.provider || 'default'}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                            log.status === 'sent'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : log.status === 'failed'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {log.status === 'sent' && <CheckCircle2 className="w-3 h-3" />}
                          {log.status === 'failed' && <AlertTriangle className="w-3 h-3" />}
                          {log.status === 'simulated' && <Mail className="w-3 h-3" />}
                          <span>{log.status}</span>
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {log.previewUrl ? (
                          <a
                            href={log.previewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-amber-300 hover:text-amber-200 underline font-medium"
                          >
                            <span>Bandeja Ethereal</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-neutral-500 text-[11px]">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
