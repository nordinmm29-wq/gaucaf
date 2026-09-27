import React, { useState } from 'react';
import {
  Sliders,
  CheckCircle2,
  AlertCircle,
  Clock,
  Phone,
  MessageCircle,
  Mail,
  Share2,
  Users,
  Shield,
  ExternalLink,
  Copy,
  Check,
  Save,
  RotateCcw,
  Sparkles,
  Info,
  Search,
  Globe,
  Tag,
} from 'lucide-react';
import { VenueSettings, SmtpSettings, ConfirmationEmailConfig } from '../../types';
import {
  DEFAULT_VENUE_SETTINGS,
  DEFAULT_SMTP_SETTINGS,
  getStoredSmtpSettings,
  saveSmtpSettings,
} from '../../data/adminStore';

interface AdminVariablesViewProps {
  venueSettings: VenueSettings;
  emailConfig: ConfirmationEmailConfig;
  onSaveVenueSettings: (s: VenueSettings) => void;
  onNavigateTab: (tab: 'reservas' | 'galeria' | 'carta' | 'email' | 'ajustes' | 'variables') => void;
}

export const AdminVariablesView: React.FC<AdminVariablesViewProps> = ({
  venueSettings,
  emailConfig,
  onSaveVenueSettings,
  onNavigateTab,
}) => {
  const [formData, setFormData] = useState<VenueSettings>(venueSettings);
  const [smtpSettings, setSmtpSettings] = useState<SmtpSettings>(getStoredSmtpSettings);
  const [notification, setNotification] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveVenueSettings(formData);
    saveSmtpSettings(smtpSettings);
    showToast('Variables globales del proyecto actualizadas con éxito');
  };

  // Variable checklist calculation
  const variablesList = [
    {
      id: 'phone',
      category: 'Contacto & Sala',
      name: 'Teléfono Fijo del Restaurante',
      value: formData.phone || '',
      isComplete: Boolean(formData.phone && formData.phone.trim().length >= 9),
      hint: 'Utilizado en Footer, mapa interactivo y confirmaciones de reserva.',
    },
    {
      id: 'whatsapp',
      category: 'Contacto & Sala',
      name: 'WhatsApp para Pedidos & Consultas',
      value: formData.whatsapp || '',
      isComplete: Boolean(formData.whatsapp && formData.whatsapp.replace(/[^0-9]/g, '').length >= 9),
      hint: 'Enlace directo de consulta rápida desde la carta digital y el mapa.',
    },
    {
      id: 'email',
      category: 'Contacto & Sala',
      name: 'Email General de Contacto',
      value: formData.email || '',
      isComplete: Boolean(formData.email && formData.email.includes('@')),
      hint: 'Visible en el pie de página para proveedores y clientes.',
    },
    {
      id: 'address',
      category: 'Ubicación',
      name: 'Dirección Física del Establecimiento',
      value: formData.address || '',
      isComplete: Boolean(formData.address && formData.address.includes('Mataró')),
      hint: 'Enfoca la ruta GPS en Google Maps, Apple Maps y OpenStreetMap.',
    },
    {
      id: 'instagram',
      category: 'Redes Sociales',
      name: 'Perfil Oficial de Instagram',
      value: formData.instagramUrl || '',
      isComplete: Boolean(formData.instagramUrl && formData.instagramUrl.includes('instagram.com/')),
      hint: 'Icono de pie de página y sección de novedades gastronómicas.',
    },
    {
      id: 'tiktok',
      category: 'Redes Sociales',
      name: 'Canal de TikTok',
      value: formData.tiktokUrl || '',
      isComplete: Boolean(formData.tiktokUrl && formData.tiktokUrl.includes('tiktok.com/')),
      hint: 'Videos de café latte art, preparaciones y ambiente.',
    },
    {
      id: 'tripadvisor',
      category: 'Redes Sociales',
      name: 'Ficha en TripAdvisor',
      value: formData.tripAdvisorUrl || '',
      isComplete: Boolean(formData.tripAdvisorUrl && formData.tripAdvisorUrl.length > 25 && !formData.tripAdvisorUrl.endsWith('tripadvisor.es')),
      hint: 'Enlace a reseñas de turistas y comensales en Mataró.',
    },
    {
      id: 'cif',
      category: 'Legal & Fiscal',
      name: 'CIF / NIF / Razón Social',
      value: formData.cifOrTaxId || '',
      isComplete: Boolean(formData.cifOrTaxId && formData.cifOrTaxId.trim().length > 3),
      hint: 'Requerido para el Aviso Legal y cumplimiento RGPD.',
    },
    {
      id: 'smtp_user',
      category: 'Servidor de Correo (Emails)',
      name: 'Usuario SMTP / Correo Emisor',
      value: smtpSettings.user || '',
      isComplete: Boolean(smtpSettings.user && smtpSettings.user.includes('@')),
      hint: 'Para el envío real automatizado de correos de confirmación.',
    },
    {
      id: 'smtp_pass',
      category: 'Servidor de Correo (Emails)',
      name: 'Contraseña de Aplicación SMTP o Resend API Key',
      value: smtpSettings.pass || smtpSettings.resendApiKey || '',
      isComplete: Boolean((smtpSettings.pass && smtpSettings.pass.length > 8) || (smtpSettings.resendApiKey && smtpSettings.resendApiKey.length > 10)),
      hint: 'Credencial segura requerida para autenticar en el servidor de correo.',
    },
    {
      id: 'meta_description',
      category: 'SEO & Buscadores',
      name: 'Meta-Descripción (Snippet de Google)',
      value: formData.metaDescription || '',
      isComplete: Boolean(formData.metaDescription && formData.metaDescription.trim().length >= 80),
      hint: 'Descripción indexable por Google, Bing y tarjetas de redes sociales.',
    },
    {
      id: 'meta_keywords',
      category: 'SEO & Buscadores',
      name: 'Palabras Clave (Keywords SEO)',
      value: formData.metaKeywords || '',
      isComplete: Boolean(formData.metaKeywords && formData.metaKeywords.trim().length >= 20),
      hint: 'Términos clave para que los clientes encuentren la cafetería en Mataró.',
    },
  ];

  const totalVars = variablesList.length;
  const completedVars = variablesList.filter((v) => v.isComplete).length;
  const completionPercentage = Math.round((completedVars / totalVars) * 100);

  return (
    <div className="space-y-6">
      {/* Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-sans animate-fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header with Completion Metric */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-white font-medium flex items-center gap-2.5">
            <Sliders className="w-6 h-6 text-amber-300" />
            <span>Panel de Variables del Proyecto</span>
          </h2>
          <p className="text-xs text-neutral-400 font-sans mt-0.5">
            Estado de configuración de Café Gaudí y variables pendientes para producción.
          </p>
        </div>

        {/* Global Progress Pill */}
        <div className="bg-[#24251e] border border-[#5a5a40]/40 rounded-2xl p-3 flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] uppercase tracking-wider text-neutral-400 block font-sans">
              Completado
            </span>
            <span className="text-sm font-bold text-amber-300 font-mono">
              {completedVars} de {totalVars} variables ({completionPercentage}%)
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#1e1f1a] border border-[#5a5a40]/30 flex items-center justify-center font-mono font-bold text-xs text-emerald-400">
            {completionPercentage}%
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-[#1e1f1a] rounded-full h-2.5 overflow-hidden border border-[#5a5a40]/30">
        <div
          className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full transition-all duration-500 rounded-full"
          style={{ width: `${completionPercentage}%` }}
        />
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#24251e] border border-[#5a5a40]/30 rounded-2xl p-4">
          <span className="text-xs text-emerald-400 font-sans font-semibold uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Variables Listas ({completedVars})</span>
          </span>
          <p className="text-xs text-neutral-400">
            Horarios de apertura, aforos de sala/terraza, dirección de Mataró y textos de cartas.
          </p>
        </div>

        <div className="bg-[#24251e] border border-[#5a5a40]/30 rounded-2xl p-4">
          <span className="text-xs text-amber-300 font-sans font-semibold uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <AlertCircle className="w-4 h-4" />
            <span>Por Definir ({totalVars - completedVars})</span>
          </span>
          <p className="text-xs text-neutral-400">
            Ficha exacta de TripAdvisor, CIF fiscal y credenciales de servidor SMTP de correo.
          </p>
        </div>

        <div className="bg-[#24251e] border border-[#5a5a40]/30 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <span className="text-xs text-blue-400 font-sans font-semibold uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Plantilla Email Activa</span>
            </span>
            <p className="text-xs text-neutral-400 truncate">
              {emailConfig.subject.substring(0, 45)}...
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('email')}
            className="text-[11px] text-amber-300 hover:text-white flex items-center gap-1 font-medium mt-2 pt-2 border-t border-neutral-700/50 cursor-pointer"
          >
            <span>Personalizar plantilla email</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Variables Editor Form */}
      <form onSubmit={handleSaveAll} className="space-y-6">
        {/* Section 1: Contacto y Atención */}
        <div className="bg-[#24251e] border border-[#5a5a40]/30 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg text-white font-medium flex items-center gap-2">
              <Phone className="w-5 h-5 text-amber-300" />
              <span>1. Variables de Contacto & Canales de Atención</span>
            </h3>
            <span className="text-xs text-neutral-400 font-sans">
              Afecta a: Footer, Mapa, Botón WhatsApp del Menú y Emails
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-sans uppercase tracking-wider text-neutral-300">
                  Teléfono de Sala (Fijo)
                </label>
                {formData.phone ? (
                  <span className="text-[10px] text-emerald-400 font-medium">Definido</span>
                ) : (
                  <span className="text-[10px] text-amber-300 font-medium">Pendiente</span>
                )}
              </div>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300/50"
              />
              <span className="text-[11px] text-neutral-500 block mt-1">Ej: 931 45 90 19</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-sans uppercase tracking-wider text-neutral-300">
                  WhatsApp Oficial (Móvil)
                </label>
                {formData.whatsapp && formData.whatsapp.length >= 9 ? (
                  <span className="text-[10px] text-emerald-400 font-medium">Definido</span>
                ) : (
                  <span className="text-[10px] text-amber-300 font-medium">Pendiente</span>
                )}
              </div>
              <input
                type="text"
                placeholder="34685994473"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300/50 font-mono"
              />
              <span className="text-[11px] text-neutral-500 block mt-1">Con prefijo país (ej: 34685994473)</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-sans uppercase tracking-wider text-neutral-300">
                  Email de Contacto
                </label>
                {formData.email && formData.email.includes('@') ? (
                  <span className="text-[10px] text-emerald-400 font-medium">Definido</span>
                ) : (
                  <span className="text-[10px] text-amber-300 font-medium">Pendiente</span>
                )}
              </div>
              <input
                type="email"
                placeholder="contacto@gastrocafegaudi.com"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300/50"
              />
              <span className="text-[11px] text-neutral-500 block mt-1">Buzón visible en la web</span>
            </div>
          </div>
        </div>

        {/* Section 2: Redes Sociales & Reputación */}
        <div className="bg-[#24251e] border border-[#5a5a40]/30 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg text-white font-medium flex items-center gap-2">
              <Share2 className="w-5 h-5 text-amber-300" />
              <span>2. Variables de Redes Sociales & Reputación</span>
            </h3>
            <span className="text-xs text-neutral-400 font-sans">
              Afecta a: Enlaces del Footer y sección Social Wall
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-sans uppercase tracking-wider text-neutral-300">
                  Instagram URL
                </label>
                {formData.instagramUrl && formData.instagramUrl.includes('instagram.com') ? (
                  <span className="text-[10px] text-emerald-400 font-medium">Definido</span>
                ) : (
                  <span className="text-[10px] text-amber-300 font-medium">Pendiente</span>
                )}
              </div>
              <input
                type="text"
                placeholder="https://instagram.com/gastrocafe_gaudi"
                value={formData.instagramUrl || ''}
                onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300/50 font-mono"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-sans uppercase tracking-wider text-neutral-300">
                  TikTok URL
                </label>
                {formData.tiktokUrl && formData.tiktokUrl.includes('tiktok.com') ? (
                  <span className="text-[10px] text-emerald-400 font-medium">Definido</span>
                ) : (
                  <span className="text-[10px] text-amber-300 font-medium">Pendiente</span>
                )}
              </div>
              <input
                type="text"
                placeholder="https://tiktok.com/@gastrocafegaudi"
                value={formData.tiktokUrl || ''}
                onChange={(e) => setFormData({ ...formData, tiktokUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300/50 font-mono"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-sans uppercase tracking-wider text-neutral-300">
                  TripAdvisor URL
                </label>
                {formData.tripAdvisorUrl && formData.tripAdvisorUrl.length > 25 ? (
                  <span className="text-[10px] text-emerald-400 font-medium">Definido</span>
                ) : (
                  <span className="text-[10px] text-amber-300 font-medium">Enlace genérico</span>
                )}
              </div>
              <input
                type="text"
                placeholder="https://tripadvisor.es/Restaurant_Review..."
                value={formData.tripAdvisorUrl || ''}
                onChange={(e) => setFormData({ ...formData, tripAdvisorUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300/50 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Legal & Fiscal */}
        <div className="bg-[#24251e] border border-[#5a5a40]/30 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg text-white font-medium flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-300" />
              <span>3. Variables Fiscales & RGPD</span>
            </h3>
            <span className="text-xs text-neutral-400 font-sans">
              Afecta a: Pie de página, Política de Privacidad y Facturas
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-sans uppercase tracking-wider text-neutral-300">
                  CIF / NIF o Razón Social
                </label>
                {formData.cifOrTaxId && formData.cifOrTaxId.trim().length > 3 ? (
                  <span className="text-[10px] text-emerald-400 font-medium">Definido</span>
                ) : (
                  <span className="text-[10px] text-amber-300 font-medium">Pendiente de rellenar</span>
                )}
              </div>
              <input
                type="text"
                placeholder="Ej: B-12345678 o Nombre del Titular"
                value={formData.cifOrTaxId || ''}
                onChange={(e) => setFormData({ ...formData, cifOrTaxId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300/50"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-sans uppercase tracking-wider text-neutral-300">
                  Dirección Legal Completa
                </label>
                <span className="text-[10px] text-emerald-400 font-medium">Definido</span>
              </div>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300/50"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Credenciales del Servidor de Correo */}
        <div className="bg-[#24251e] border border-[#5a5a40]/30 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg text-white font-medium flex items-center gap-2">
              <Mail className="w-5 h-5 text-amber-300" />
              <span>4. Servidor SMTP / Envío Automatizado de Emails</span>
            </h3>
            <button
              type="button"
              onClick={() => onNavigateTab('email')}
              className="text-xs text-amber-300 hover:text-white flex items-center gap-1 font-sans cursor-pointer"
            >
              <span>Configuración avanzada SMTP</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-neutral-400 font-sans">
            Para que la web envíe el email de confirmación automáticamente a la bandeja de entrada del cliente al reservar:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-sans uppercase tracking-wider text-neutral-300 mb-1">
                Servidor SMTP (Host)
              </label>
              <input
                type="text"
                placeholder="smtp.gmail.com"
                value={smtpSettings.host || ''}
                onChange={(e) => setSmtpSettings({ ...smtpSettings, host: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300/50 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-sans uppercase tracking-wider text-neutral-300 mb-1">
                Usuario / Correo Saliente
              </label>
              <input
                type="email"
                placeholder="reservas@cafegaudi.com"
                value={smtpSettings.user || ''}
                onChange={(e) => setSmtpSettings({ ...smtpSettings, user: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300/50 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-sans uppercase tracking-wider text-neutral-300 mb-1">
                Contraseña de Aplicación
              </label>
              <input
                type="password"
                placeholder="••••••••••••••••"
                value={smtpSettings.pass || ''}
                onChange={(e) => setSmtpSettings({ ...smtpSettings, pass: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300/50 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Variables SEO & Posicionamiento en Buscadores */}
        <div className="bg-[#24251e] border border-amber-300/30 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg text-white font-medium flex items-center gap-2">
              <Search className="w-5 h-5 text-amber-300" />
              <span>5. Variables SEO & Posicionamiento en Buscadores (Google)</span>
            </h3>
            <button
              type="button"
              onClick={() => onNavigateTab('ajustes')}
              className="text-xs text-amber-300 hover:text-white flex items-center gap-1 font-sans cursor-pointer"
            >
              <span>Ver vista previa SERP Google</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-neutral-400 font-sans">
            Configura la meta-descripción y las palabras clave que indexan Google y otros motores de búsqueda para posicionar Café Gaudí en búsquedas locales en Mataró:
          </p>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-sans uppercase tracking-wider text-neutral-300 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-amber-300" />
                  <span>Meta-Descripción de la Web (Google Snippet)</span>
                </label>
                <span className="text-[11px] font-mono text-neutral-400">
                  {(formData.metaDescription || '').length} / 160 caracteres
                </span>
              </div>
              <textarea
                rows={2}
                placeholder="Descripción persuasiva para los resultados de Google (recomendado entre 120 y 160 caracteres)..."
                value={formData.metaDescription || ''}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300/50 leading-relaxed font-sans"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-sans uppercase tracking-wider text-neutral-300 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-amber-300" />
                  <span>Palabras Clave (Keywords SEO, separadas por comas)</span>
                </label>
                <span className="text-[11px] font-mono text-neutral-400">
                  {(formData.metaKeywords || '').split(',').map((k) => k.trim()).filter(Boolean).length} palabras
                </span>
              </div>
              <input
                type="text"
                placeholder="café gaudi mataró, cafetería mataró, café de especialidad, focaccias artesanas..."
                value={formData.metaKeywords || ''}
                onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300/50 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => {
              setFormData(DEFAULT_VENUE_SETTINGS);
              setSmtpSettings(DEFAULT_SMTP_SETTINGS);
              saveSmtpSettings(DEFAULT_SMTP_SETTINGS);
              onSaveVenueSettings(DEFAULT_VENUE_SETTINGS);
              showToast('Todas las variables y ajustes se han reestablecido a sus valores por defecto');
            }}
            className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-sans rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reestablecer Variables por Defecto</span>
          </button>

          <button
            type="submit"
            className="px-6 py-3 bg-[#5a5a40] hover:bg-[#6c6c4c] text-white font-sans text-xs uppercase tracking-wider font-semibold rounded-xl flex items-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Todas las Variables</span>
          </button>
        </div>
      </form>
    </div>
  );
};
