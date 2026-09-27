import React, { useState } from 'react';
import {
  Settings,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  Users,
  Save,
  CheckCircle2,
  AlertCircle,
  Bell,
  Check,
  Mail,
  Share2,
  FileText,
  Shield,
  ExternalLink,
  Sparkles,
  Palmtree,
  PartyPopper,
  Calendar,
  AlertTriangle,
  Plus,
  Trash2,
  Eye,
  Info,
  Sun,
  Moon,
  Ban,
  CalendarX,
  Coffee,
  Search,
  Globe,
  Tag,
  HelpCircle,
  RefreshCw,
  X,
} from 'lucide-react';
import { VenueSettings, ServiceStatus, HolidayDate } from '../../types';

interface AdminSettingsViewProps {
  settings: VenueSettings;
  onSaveSettings: (s: VenueSettings) => void;
}

const PRESETS = [
  {
    status: 'vacation' as ServiceStatus,
    label: 'Vacaciones de Verano',
    icon: '🏖️',
    title: 'Cerrado por Vacaciones de Verano',
    message: 'Nos tomamos un merecido descanso estival para recargar energías y volver con nuevas propuestas gastronómicas. ¡Nos vemos muy pronto!',
  },
  {
    status: 'vacation' as ServiceStatus,
    label: 'Vacaciones de Invierno / Navidad',
    icon: '❄️',
    title: 'Cerrado por Vacaciones de Invierno',
    message: 'Todo el equipo de Café Gaudí se toma unos días de descanso por las fiestas. ¡Volvemos tras Reyes con las pilas cargadas!',
  },
  {
    status: 'holiday' as ServiceStatus,
    label: 'Festivo Local / Festa Major',
    icon: '🎈',
    title: 'Cerrado por Festivo Local',
    message: 'Hoy celebramos la festividad local en Mataró y nuestro equipo disfruta de la jornada. ¡Mañana volvemos a abrir en horario habitual!',
  },
  {
    status: 'holiday' as ServiceStatus,
    label: 'Festivo Nacional / Puente',
    icon: '🎉',
    title: 'Cerrado por Festivo',
    message: 'Permaneceremos cerrados con motivo de la festividad. Estaremos de vuelta al día siguiente con café de especialidad y tapas de mercado.',
  },
  {
    status: 'special_closed' as ServiceStatus,
    label: 'Mantenimiento / Reformas',
    icon: '🔧',
    title: 'Cierre Temporal por Mantenimiento',
    message: 'Estamos realizando labores de mejora y puesta a punto de nuestras instalaciones para ofrecerte una experiencia aún mejor.',
  },
];

const DAYS_OF_WEEK = [
  { day: 1, label: 'Lunes' },
  { day: 2, label: 'Martes' },
  { day: 3, label: 'Miércoles' },
  { day: 4, label: 'Jueves' },
  { day: 5, label: 'Viernes' },
  { day: 6, label: 'Sábado' },
  { day: 0, label: 'Domingo' },
];

export const AdminSettingsView: React.FC<AdminSettingsViewProps> = ({
  settings,
  onSaveSettings,
}) => {
  const [formData, setFormData] = useState<VenueSettings>(() => ({
    ...settings,
    serviceStatus: settings.serviceStatus || 'open',
    scheduleTueSat: settings.scheduleTueSat || '08:30 a 23:00 h',
    scheduleSunMon: settings.scheduleSunMon || '08:30 a 16:00 h',
    scheduleTueSatNote: settings.scheduleTueSatNote || 'Servicio continuo, vermut, tapas y cenas gastronómicas',
    scheduleSunMonNote: settings.scheduleSunMonNote || 'Servicio diurno de desayunos, brunch y almuerzos',
    closureTitle: settings.closureTitle || 'Cerrado por Vacaciones',
    closureMessage: settings.closureMessage || 'Estaremos cerrados temporalmente por descanso del personal. ¡Volvemos muy pronto!',
    closureStartDate: settings.closureStartDate || '',
    closureEndDate: settings.closureEndDate || '',
    reopeningDate: settings.reopeningDate || '',
    allowFutureBookingsDuringClosure: settings.allowFutureBookingsDuringClosure ?? true,
    holidayDates: settings.holidayDates || [],
    weeklyClosedDays: settings.weeklyClosedDays || [],
    metaDescription:
      settings.metaDescription ||
      'Café Gaudí en Carrer Germans Thos i Codina 20, Mataró. Especialistas en café de autor, focaccias artesanas, desayunos, tapas de mercado y terraza al aire libre. ¡Reserva tu mesa!',
    metaKeywords:
      settings.metaKeywords ||
      'café gaudi mataró, cafetería mataró, café de especialidad mataró, focaccias artesanas, brunch mataró, tapas mataró, restaurantes germans thos i codina, desayunos mataró, terrazas mataró, reservar mesa mataró',
  }));

  const [notification, setNotification] = useState<string | null>(null);

  // Suggested keywords for quick addition
  const SUGGESTED_KEYWORDS = [
    'Cafetería en Mataró',
    'Café de especialidad',
    'Focaccias artesanas',
    'Desayunos y brunch Mataró',
    'Tapas y raciones',
    'Restaurante Germans Thos i Codina',
    'Terraza exterior Mataró',
    'Reserva de mesa Mataró',
    'Café con terraza',
    'Comer en Mataró centro',
  ];

  const handleAddKeyword = (keyword: string) => {
    const current = (formData.metaKeywords || '')
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);
    const normalizedNew = keyword.trim().toLowerCase();
    const exists = current.some((k) => k.toLowerCase() === normalizedNew);

    if (exists) {
      showToast(`La palabra clave "${keyword}" ya está incluida`);
      return;
    }

    const updated = [...current, keyword.trim()].join(', ');
    setFormData((prev) => ({ ...prev, metaKeywords: updated }));
    showToast(`Palabra clave "${keyword}" añadida`);
  };

  const handleResetSeo = () => {
    setFormData((prev) => ({
      ...prev,
      metaDescription:
        'Café Gaudí en Carrer Germans Thos i Codina 20, Mataró. Especialistas en café de autor, focaccias artesanas, desayunos, tapas de mercado y terraza al aire libre. ¡Reserva tu mesa!',
      metaKeywords:
        'café gaudi mataró, cafetería mataró, café de especialidad mataró, focaccias artesanas, brunch mataró, tapas mataró, restaurantes germans thos i codina, desayunos mataró, terrazas mataró, reservar mesa mataró',
    }));
    showToast('Valores SEO recomendados restaurados');
  };

  // Quick holiday add form
  const [newHolidayDate, setNewHolidayDate] = useState('');
  const [newHolidayLabel, setNewHolidayLabel] = useState('');

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    showToast('Ajustes y horarios del local guardados con éxito');
  };

  const applyPreset = (preset: (typeof PRESETS)[0]) => {
    setFormData((prev) => ({
      ...prev,
      serviceStatus: preset.status,
      closureTitle: preset.title,
      closureMessage: preset.message,
    }));
    showToast(`Plantilla "${preset.label}" aplicada`);
  };

  const handleAddHoliday = () => {
    if (!newHolidayDate || !newHolidayLabel.trim()) {
      showToast('Introduce fecha y descripción del festivo');
      return;
    }
    const newHol: HolidayDate = {
      id: `hol-${Date.now()}`,
      date: newHolidayDate,
      label: newHolidayLabel.trim(),
      allDayClosed: true,
    };
    setFormData((prev) => ({
      ...prev,
      holidayDates: [...(prev.holidayDates || []), newHol].sort((a, b) => a.date.localeCompare(b.date)),
    }));
    setNewHolidayDate('');
    setNewHolidayLabel('');
    showToast('Festivo añadido correctamente');
  };

  const handleRemoveHoliday = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      holidayDates: (prev.holidayDates || []).filter((h) => h.id !== id),
    }));
    showToast('Festivo eliminado');
  };

  const toggleWeeklyClosedDay = (day: number) => {
    setFormData((prev) => {
      const current = prev.weeklyClosedDays || [];
      const updated = current.includes(day)
        ? current.filter((d) => d !== day)
        : [...current, day];
      return { ...prev, weeklyClosedDays: updated };
    });
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-sans animate-fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="font-serif text-2xl text-white font-medium flex items-center gap-2">
          <Settings className="w-6 h-6 text-amber-300" />
          <span>Ajustes del Local, Horarios & Vacaciones</span>
        </h2>
        <p className="text-xs text-neutral-400 font-sans mt-0.5">
          Configura los horarios habituales de servicio, activa el modo cerrado por vacaciones o festivos y gestiona las fechas especiales.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
        {/* ======================================================== */}
        {/* SECTION 1: MASTER SERVICE STATUS (VACATIONS / HOLIDAYS)  */}
        {/* ======================================================== */}
        <div className="bg-[#24251e] border-2 border-amber-300/40 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-sans uppercase tracking-wider font-semibold bg-amber-300/10 text-amber-300 border border-amber-300/20 mb-1">
                <Palmtree className="w-3.5 h-3.5" />
                Control de Vacaciones y Festivos
              </span>
              <h3 className="font-serif text-xl text-white font-medium">
                Estado Actual del Establecimiento
              </h3>
              <p className="text-xs text-neutral-400 font-sans mt-0.5">
                Selecciona si el local está abierto con horario regular o cerrado temporalmente por vacaciones o festivo.
              </p>
            </div>

            {/* Current Status Pill */}
            <div className="shrink-0">
              {formData.serviceStatus === 'open' ? (
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-sans font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  🟢 Local Abierto (Servicio Regular)
                </span>
              ) : formData.serviceStatus === 'vacation' ? (
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-sans font-semibold">
                  <span>🏖️</span>
                  Cerrado por Vacaciones
                </span>
              ) : formData.serviceStatus === 'holiday' ? (
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-400/20 text-purple-300 border border-purple-400/30 text-xs font-sans font-semibold">
                  <span>🎉</span>
                  Cerrado por Festivo
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-400/20 text-rose-300 border border-rose-400/30 text-xs font-sans font-semibold">
                  <span>⏸️</span>
                  Cierre Temporal
                </span>
              )}
            </div>
          </div>

          {/* Status Mode Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Option 1: Open */}
            <button
              type="button"
              onClick={() => setFormData({ ...formData, serviceStatus: 'open' })}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                formData.serviceStatus === 'open'
                  ? 'bg-emerald-950/40 border-emerald-500 shadow-md shadow-emerald-950/50 ring-1 ring-emerald-500'
                  : 'bg-[#1e1f1a] border-neutral-700/60 hover:border-neutral-500'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">🟢</span>
                {formData.serviceStatus === 'open' && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
              </div>
              <div>
                <span className="text-xs font-sans font-bold uppercase tracking-wider text-emerald-400 block">
                  Abierto
                </span>
                <p className="text-xs text-neutral-300 font-sans mt-0.5 font-medium">
                  Horario habitual
                </p>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Admite reservas y pedidos normales.
                </p>
              </div>
            </button>

            {/* Option 2: Vacation */}
            <button
              type="button"
              onClick={() => {
                setFormData({
                  ...formData,
                  serviceStatus: 'vacation',
                  closureTitle: formData.closureTitle || 'Cerrado por Vacaciones',
                });
              }}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                formData.serviceStatus === 'vacation'
                  ? 'bg-amber-950/40 border-amber-400 shadow-md shadow-amber-950/50 ring-1 ring-amber-400'
                  : 'bg-[#1e1f1a] border-neutral-700/60 hover:border-neutral-500'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">🏖️</span>
                {formData.serviceStatus === 'vacation' && (
                  <CheckCircle2 className="w-4 h-4 text-amber-300" />
                )}
              </div>
              <div>
                <span className="text-xs font-sans font-bold uppercase tracking-wider text-amber-300 block">
                  Vacaciones
                </span>
                <p className="text-xs text-neutral-300 font-sans mt-0.5 font-medium">
                  Descanso de equipo
                </p>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Muestra aviso y fecha de vuelta.
                </p>
              </div>
            </button>

            {/* Option 3: Holiday */}
            <button
              type="button"
              onClick={() => {
                setFormData({
                  ...formData,
                  serviceStatus: 'holiday',
                  closureTitle: formData.closureTitle || 'Cerrado por Festivo',
                });
              }}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                formData.serviceStatus === 'holiday'
                  ? 'bg-purple-950/40 border-purple-400 shadow-md shadow-purple-950/50 ring-1 ring-purple-400'
                  : 'bg-[#1e1f1a] border-neutral-700/60 hover:border-neutral-500'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">🎉</span>
                {formData.serviceStatus === 'holiday' && (
                  <CheckCircle2 className="w-4 h-4 text-purple-300" />
                )}
              </div>
              <div>
                <span className="text-xs font-sans font-bold uppercase tracking-wider text-purple-300 block">
                  Festivo / Puente
                </span>
                <p className="text-xs text-neutral-300 font-sans mt-0.5 font-medium">
                  Fiesta local o nacional
                </p>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Aviso de jornada no laboral.
                </p>
              </div>
            </button>

            {/* Option 4: Special closed / Maintenance */}
            <button
              type="button"
              onClick={() => {
                setFormData({
                  ...formData,
                  serviceStatus: 'special_closed',
                  closureTitle: formData.closureTitle || 'Cierre Temporal',
                });
              }}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                formData.serviceStatus === 'special_closed'
                  ? 'bg-rose-950/40 border-rose-400 shadow-md shadow-rose-950/50 ring-1 ring-rose-400'
                  : 'bg-[#1e1f1a] border-neutral-700/60 hover:border-neutral-500'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">⏸️</span>
                {formData.serviceStatus === 'special_closed' && (
                  <CheckCircle2 className="w-4 h-4 text-rose-300" />
                )}
              </div>
              <div>
                <span className="text-xs font-sans font-bold uppercase tracking-wider text-rose-300 block">
                  Cierre Temporal
                </span>
                <p className="text-xs text-neutral-300 font-sans mt-0.5 font-medium">
                  Obras o descanso
                </p>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Informa sobre reapertura.
                </p>
              </div>
            </button>
          </div>

          {/* Closure Configuration Details (Shown when not open) */}
          {formData.serviceStatus !== 'open' && (
            <div className="bg-[#1e1f1a] border border-amber-300/30 rounded-2xl p-5 space-y-5 animate-fade-in">
              {/* Preset quick buttons */}
              <div>
                <span className="text-[11px] font-sans uppercase tracking-wider text-neutral-400 font-medium block mb-2">
                  ⚡ Plantillas Rápidas con Textos Recomendados:
                </span>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => applyPreset(preset)}
                      className="px-3 py-1.5 bg-[#282922] hover:bg-[#34352b] border border-neutral-700 hover:border-amber-300/40 rounded-xl text-xs text-neutral-200 font-sans flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>{preset.icon}</span>
                      <span>{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title & Dates Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-3">
                  <label className="block text-xs font-sans uppercase tracking-wider text-neutral-300 mb-1">
                    Título del Aviso de Cierre
                  </label>
                  <input
                    type="text"
                    value={formData.closureTitle || ''}
                    onChange={(e) => setFormData({ ...formData, closureTitle: e.target.value })}
                    placeholder="Ej: Cerrado por Vacaciones de Verano"
                    className="w-full px-3 py-2 bg-[#282922] border border-[#5a5a40]/50 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans uppercase tracking-wider text-neutral-300 mb-1">
                    Fecha Inicio de Cierre
                  </label>
                  <input
                    type="date"
                    value={formData.closureStartDate || ''}
                    onChange={(e) => setFormData({ ...formData, closureStartDate: e.target.value })}
                    className="w-full px-3 py-2 bg-[#282922] border border-[#5a5a40]/50 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans uppercase tracking-wider text-neutral-300 mb-1">
                    Fecha Fin de Cierre
                  </label>
                  <input
                    type="date"
                    value={formData.closureEndDate || ''}
                    onChange={(e) => setFormData({ ...formData, closureEndDate: e.target.value })}
                    className="w-full px-3 py-2 bg-[#282922] border border-[#5a5a40]/50 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans uppercase tracking-wider text-neutral-300 mb-1">
                    Fecha / Texto de Reapertura
                  </label>
                  <input
                    type="text"
                    value={formData.reopeningDate || ''}
                    onChange={(e) => setFormData({ ...formData, reopeningDate: e.target.value })}
                    placeholder="Ej: Martes 26 de Agosto a las 08:30 h"
                    className="w-full px-3 py-2 bg-[#282922] border border-[#5a5a40]/50 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300"
                  />
                </div>
              </div>

              {/* Message to clients */}
              <div>
                <label className="block text-xs font-sans uppercase tracking-wider text-neutral-300 mb-1">
                  Mensaje Detallado para los Comensales (Visible en Web y Reservas)
                </label>
                <textarea
                  rows={3}
                  value={formData.closureMessage || ''}
                  onChange={(e) => setFormData({ ...formData, closureMessage: e.target.value })}
                  placeholder="Explica amablemente a los clientes el motivo del cierre y cuándo volverán a recibirlos..."
                  className="w-full px-3 py-2 bg-[#282922] border border-[#5a5a40]/50 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300 font-sans"
                />
              </div>

              {/* Future reservations toggle */}
              <div className="flex items-center justify-between p-3.5 bg-[#282922] rounded-xl border border-neutral-700/60">
                <div className="space-y-0.5 pr-4">
                  <span className="text-xs font-sans font-medium text-white block">
                    Permitir reservas para fechas posteriores a la reapertura
                  </span>
                  <span className="text-[11px] text-neutral-400 block font-sans">
                    Los comensales podrán reservar mesa para los días en que el local ya haya reabierto, pero no durante el período de cierre.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={formData.allowFutureBookingsDuringClosure ?? true}
                    onChange={(e) =>
                      setFormData({ ...formData, allowFutureBookingsDuringClosure: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Live Preview Box */}
              <div className="border border-amber-300/30 bg-amber-500/10 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-wider font-bold text-amber-300 mb-2">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Vista Previa del Aviso en la Web</span>
                </div>
                <div className="bg-[#36362d] p-4 rounded-xl text-white font-sans border border-amber-300/20">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl shrink-0 mt-0.5">
                      {formData.serviceStatus === 'vacation' ? '🏖️' : formData.serviceStatus === 'holiday' ? '🎉' : '⏸️'}
                    </span>
                    <div>
                      <h4 className="font-serif text-sm sm:text-base font-medium text-amber-300">
                        {formData.closureTitle || 'Aviso de Cierre Temporal'}
                      </h4>
                      <p className="text-xs text-neutral-200 mt-1 leading-relaxed">
                        {formData.closureMessage || 'El local permanecerá cerrado temporalmente.'}
                      </p>
                      {formData.reopeningDate && (
                        <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-white font-semibold bg-white/10 px-2.5 py-1 rounded-lg">
                          <Calendar className="w-3 h-3 text-amber-300" />
                          <span>Reapertura: {formData.reopeningDate}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* SECTION 2: EDITABLE REGULAR SCHEDULE & WEEKLY REST DAYS  */}
        {/* ======================================================== */}
        <div className="bg-[#24251e] border border-[#5a5a40]/30 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="font-serif text-lg text-white font-medium flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-300" />
                <span>Horarios Habituales de Servicio</span>
              </h3>
              <p className="text-xs text-neutral-400 font-sans mt-0.5">
                Edita las franjas horarias que se muestran en la carta, pie de página y mapa.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Martes a Sábados */}
            <div className="bg-[#1e1f1a] p-5 rounded-2xl border border-emerald-500/30 space-y-3">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-sans font-bold uppercase tracking-wider text-emerald-400">
                  Martes a Sábados (Servicio Completo & Cenas)
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-sans uppercase tracking-wider text-neutral-400 mb-1">
                  Horario de apertura y cierre
                </label>
                <input
                  type="text"
                  value={formData.scheduleTueSat || '08:30 a 23:00 h'}
                  onChange={(e) => setFormData({ ...formData, scheduleTueSat: e.target.value })}
                  placeholder="Ej: 08:30 a 23:00 h"
                  className="w-full px-3 py-2 bg-[#282922] border border-[#5a5a40]/40 rounded-xl text-white text-xs font-medium focus:outline-hidden focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-sans uppercase tracking-wider text-neutral-400 mb-1">
                  Nota descriptiva de cocina y servicio
                </label>
                <input
                  type="text"
                  value={formData.scheduleTueSatNote || ''}
                  onChange={(e) => setFormData({ ...formData, scheduleTueSatNote: e.target.value })}
                  placeholder="Ej: Servicio continuo, vermut, tapas y cenas gastronómicas"
                  className="w-full px-3 py-2 bg-[#282922] border border-[#5a5a40]/40 rounded-xl text-white text-xs focus:outline-hidden focus:border-emerald-400"
                />
              </div>
            </div>

            {/* Domingos y Lunes */}
            <div className="bg-[#1e1f1a] p-5 rounded-2xl border border-amber-300/30 space-y-3">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-300" />
                <span className="text-xs font-sans font-bold uppercase tracking-wider text-amber-300">
                  Domingos y Lunes (Horario Diurno)
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-sans uppercase tracking-wider text-neutral-400 mb-1">
                  Horario de apertura y cierre
                </label>
                <input
                  type="text"
                  value={formData.scheduleSunMon || '08:30 a 16:00 h'}
                  onChange={(e) => setFormData({ ...formData, scheduleSunMon: e.target.value })}
                  placeholder="Ej: 08:30 a 16:00 h"
                  className="w-full px-3 py-2 bg-[#282922] border border-[#5a5a40]/40 rounded-xl text-white text-xs font-medium focus:outline-hidden focus:border-amber-300"
                />
              </div>

              <div>
                <label className="block text-[11px] font-sans uppercase tracking-wider text-neutral-400 mb-1">
                  Nota descriptiva de cocina y servicio
                </label>
                <input
                  type="text"
                  value={formData.scheduleSunMonNote || ''}
                  onChange={(e) => setFormData({ ...formData, scheduleSunMonNote: e.target.value })}
                  placeholder="Ej: Servicio diurno de desayunos, brunch y almuerzos"
                  className="w-full px-3 py-2 bg-[#282922] border border-[#5a5a40]/40 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300"
                />
              </div>
            </div>
          </div>

          {/* Días de descanso semanal habituales */}
          <div className="bg-[#1e1f1a] p-4 rounded-2xl border border-neutral-800 space-y-3">
            <span className="text-xs font-sans uppercase tracking-wider text-neutral-300 font-bold block">
              Días de descanso semanal habituales (Cerrado todo el día)
            </span>
            <p className="text-xs text-neutral-400">
              Marca si hay algún día de la semana en el que el local cierra habitualmente (por defecto abierto todos los días con turno diurno en Dom/Lun):
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {DAYS_OF_WEEK.map(({ day, label }) => {
                const isClosed = (formData.weeklyClosedDays || []).includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleWeeklyClosedDay(day)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-sans font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                      isClosed
                        ? 'bg-rose-900/40 text-rose-300 border border-rose-600/50'
                        : 'bg-[#282922] text-neutral-300 border border-neutral-700 hover:border-neutral-500'
                    }`}
                  >
                    {isClosed ? <Ban className="w-3 h-3 text-rose-400" /> : <Check className="w-3 h-3 text-emerald-400 opacity-60" />}
                    <span>{label}</span>
                    <span className="text-[10px] opacity-70">
                      {isClosed ? '(Cerrado)' : '(Abierto)'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION 3: SPECIFIC HOLIDAYS / CLOSED DATES OF THE YEAR  */}
        {/* ======================================================== */}
        <div className="bg-[#24251e] border border-[#5a5a40]/30 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="font-serif text-lg text-white font-medium flex items-center gap-2">
                <PartyPopper className="w-5 h-5 text-amber-300" />
                <span>Calendario de Días Festivos Puntuales (Cerrados)</span>
              </h3>
              <p className="text-xs text-neutral-400 font-sans mt-0.5">
                Fechas específicas del año en las que el local estará cerrado. El sistema bloqueará reservas en estas fechas automáticamente.
              </p>
            </div>
            <span className="text-xs font-sans text-neutral-400">
              {(formData.holidayDates || []).length} festivos registrados
            </span>
          </div>

          {/* Add Holiday Form */}
          <div className="bg-[#1e1f1a] p-4 rounded-2xl border border-neutral-800 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-4">
              <label className="block text-[11px] font-sans uppercase tracking-wider text-neutral-400 mb-1">
                Fecha del Festivo
              </label>
              <input
                type="date"
                value={newHolidayDate}
                onChange={(e) => setNewHolidayDate(e.target.value)}
                className="w-full px-3 py-2 bg-[#282922] border border-[#5a5a40]/40 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300"
              />
            </div>

            <div className="sm:col-span-5">
              <label className="block text-[11px] font-sans uppercase tracking-wider text-neutral-400 mb-1">
                Motivo / Nombre del Festivo
              </label>
              <input
                type="text"
                placeholder="Ej: Festa Major de Mataró (Les Santes)"
                value={newHolidayLabel}
                onChange={(e) => setNewHolidayLabel(e.target.value)}
                className="w-full px-3 py-2 bg-[#282922] border border-[#5a5a40]/40 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300"
              />
            </div>

            <div className="sm:col-span-3">
              <button
                type="button"
                onClick={handleAddHoliday}
                className="w-full py-2 px-3 bg-amber-400 hover:bg-amber-300 text-neutral-900 font-sans text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Añadir Festivo</span>
              </button>
            </div>
          </div>

          {/* Holidays List */}
          <div className="space-y-2">
            {(formData.holidayDates || []).length === 0 ? (
              <p className="text-xs text-neutral-500 italic py-2 text-center">
                No hay festivos puntuales registrados. Añade uno arriba.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(formData.holidayDates || []).map((hol) => (
                  <div
                    key={hol.id}
                    className="flex items-center justify-between p-3 bg-[#1e1f1a] border border-neutral-800 rounded-xl hover:border-amber-300/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-400/10 text-amber-300 flex items-center justify-center font-mono text-xs font-bold">
                        🎉
                      </div>
                      <div>
                        <span className="text-xs text-white font-medium block">
                          {hol.label}
                        </span>
                        <span className="text-[11px] text-amber-300/90 font-mono">
                          {hol.date}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveHoliday(hol.id)}
                      className="p-1.5 text-neutral-400 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Eliminar festivo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION 4: CAPACITY & SEATING                             */}
        {/* ======================================================== */}
        <div className="bg-[#24251e] border border-[#5a5a40]/30 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="font-serif text-lg text-white font-medium flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-300" />
            <span>Aforo & Distribución de Mesas</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-sans uppercase tracking-wider text-neutral-300 mb-1">
                Aforo Máximo en Terraza Exterior (comensales)
              </label>
              <input
                type="number"
                min={10}
                max={200}
                value={formData.terraceCapacity}
                onChange={(e) =>
                  setFormData({ ...formData, terraceCapacity: parseInt(e.target.value) || 36 })
                }
                className="w-full px-3 py-2 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300/50"
              />
              <span className="text-[11px] text-neutral-500 font-sans mt-1 block">
                Mesas bajo sombrilla y calefactor en bulevar
              </span>
            </div>

            <div>
              <label className="block text-xs font-sans uppercase tracking-wider text-neutral-300 mb-1">
                Aforo Máximo en Salón Interior (comensales)
              </label>
              <input
                type="number"
                min={10}
                max={200}
                value={formData.salonCapacity}
                onChange={(e) =>
                  setFormData({ ...formData, salonCapacity: parseInt(e.target.value) || 48 })
                }
                className="w-full px-3 py-2 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300/50"
              />
              <span className="text-[11px] text-neutral-500 font-sans mt-1 block">
                Espacio climatizado interior y zona de barra
              </span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION 5: CONTACT INFO & ADDRESS                        */}
        {/* ======================================================== */}
        <div className="bg-[#24251e] border border-[#5a5a40]/30 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="font-serif text-lg text-white font-medium flex items-center gap-2">
            <Phone className="w-5 h-5 text-amber-300" />
            <span>Datos de Contacto & Dirección</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-sans uppercase tracking-wider text-neutral-300 mb-1">
                Teléfono de Sala / Restaurante
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300/50"
              />
            </div>

            <div>
              <label className="block text-xs font-sans uppercase tracking-wider text-neutral-300 mb-1">
                WhatsApp Oficial (para pedidos y contacto)
              </label>
              <input
                type="text"
                placeholder="34685994473"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full px-3 py-2 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300/50 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-sans uppercase tracking-wider text-neutral-300 mb-1">
                Email General de Contacto
              </label>
              <input
                type="email"
                placeholder="contacto@gastrocafegaudi.com"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300/50"
              />
            </div>

            <div>
              <label className="block text-xs font-sans uppercase tracking-wider text-neutral-300 mb-1">
                CIF / NIF / Razón Social (Aviso Legal)
              </label>
              <input
                type="text"
                placeholder="B-12345678 o titular"
                value={formData.cifOrTaxId || ''}
                onChange={(e) => setFormData({ ...formData, cifOrTaxId: e.target.value })}
                className="w-full px-3 py-2 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-sans uppercase tracking-wider text-neutral-300 mb-1">
              Dirección Física Completa
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300/50"
            />
          </div>

          <div>
            <label className="block text-xs font-sans uppercase tracking-wider text-neutral-300 mb-1">
              Aviso Destacado a Clientes (Banner web)
            </label>
            <textarea
              rows={2}
              value={formData.noticeBanner}
              onChange={(e) => setFormData({ ...formData, noticeBanner: e.target.value })}
              className="w-full px-3 py-2 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300/50 font-sans"
            />
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION 6: SOCIAL MEDIA LINKS                            */}
        {/* ======================================================== */}
        <div className="bg-[#24251e] border border-[#5a5a40]/30 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="font-serif text-lg text-white font-medium flex items-center gap-2">
            <Share2 className="w-5 h-5 text-amber-300" />
            <span>Redes Sociales & Perfiles Oficiales</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-sans uppercase tracking-wider text-neutral-300 mb-1">
                Instagram URL
              </label>
              <input
                type="text"
                placeholder="https://instagram.com/gastrocafe_gaudi"
                value={formData.instagramUrl || ''}
                onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                className="w-full px-3 py-2 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300/50 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-sans uppercase tracking-wider text-neutral-300 mb-1">
                TikTok URL
              </label>
              <input
                type="text"
                placeholder="https://tiktok.com/@gastrocafegaudi"
                value={formData.tiktokUrl || ''}
                onChange={(e) => setFormData({ ...formData, tiktokUrl: e.target.value })}
                className="w-full px-3 py-2 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300/50 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-sans uppercase tracking-wider text-neutral-300 mb-1">
                TripAdvisor URL
              </label>
              <input
                type="text"
                placeholder="https://tripadvisor.es/..."
                value={formData.tripAdvisorUrl || ''}
                onChange={(e) => setFormData({ ...formData, tripAdvisorUrl: e.target.value })}
                className="w-full px-3 py-2 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300/50 font-mono"
              />
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION 7: SEO & POSICIONAMIENTO EN BUSCADORES (GOOGLE)   */}
        {/* ======================================================== */}
        <div className="bg-[#24251e] border-2 border-amber-300/30 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-sans uppercase tracking-wider font-semibold bg-amber-300/10 text-amber-300 border border-amber-300/20 mb-1">
                <Search className="w-3.5 h-3.5" />
                SEO & Motores de Búsqueda
              </span>
              <h3 className="font-serif text-xl text-white font-medium flex items-center gap-2">
                <span>Posicionamiento en Google & Metadatos</span>
              </h3>
              <p className="text-xs text-neutral-400 font-sans mt-0.5">
                Actualiza dinámicamente la meta-descripción y las palabras clave que leen Google, Bing y las redes sociales para destacar en búsquedas locales en Mataró.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleResetSeo}
                className="px-3 py-1.5 bg-[#1a1b16] hover:bg-[#2c2d24] text-neutral-300 hover:text-amber-300 border border-[#5a5a40]/30 rounded-xl text-xs font-sans flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Rellenar con plantilla SEO optimizada para restaurantes en Mataró"
              >
                <RefreshCw className="w-3 h-3 text-amber-300" />
                <span>SEO Recomendado</span>
              </button>
            </div>
          </div>

          {/* 1. Meta-Description Field */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <label className="text-xs font-sans uppercase tracking-wider text-neutral-200 font-medium flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-amber-300" />
                <span>Meta-Descripción de la Web (Google Snippet)</span>
              </label>

              {/* Character counter & health indicator */}
              {(() => {
                const len = (formData.metaDescription || '').length;
                let badgeColor = 'text-amber-400 bg-amber-950/40 border-amber-400/30';
                let label = 'Recomendado: 120 a 160 caracteres';
                if (len >= 120 && len <= 160) {
                  badgeColor = 'text-emerald-400 bg-emerald-950/40 border-emerald-400/30';
                  label = 'Longitud ideal para Google';
                } else if (len > 160) {
                  badgeColor = 'text-orange-400 bg-orange-950/40 border-orange-400/30';
                  label = 'Google podría truncar el texto';
                } else if (len < 80) {
                  badgeColor = 'text-neutral-400 bg-neutral-800/60 border-neutral-700';
                  label = 'Descripción breve';
                }
                return (
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-sans px-2 py-0.5 rounded-full border ${badgeColor}`}>
                      {label}
                    </span>
                    <span className="text-xs font-mono text-neutral-400 font-medium">
                      {len} / 160 caracteres
                    </span>
                  </div>
                );
              })()}
            </div>

            <textarea
              rows={3}
              value={formData.metaDescription || ''}
              onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
              placeholder="Escribe una descripción persuasiva y descriptiva de Café Gaudí para los resultados de Google..."
              className="w-full px-4 py-3 bg-[#1e1f1a] border border-[#5a5a40]/50 rounded-2xl text-white text-xs sm:text-sm focus:outline-hidden focus:border-amber-300/60 leading-relaxed font-sans placeholder-neutral-500"
            />
            <p className="text-[11px] text-neutral-400 font-sans leading-normal">
              Esta es la frase resumen que aparece debajo del título cuando alguien busca en Google. Debe mencionar el nombre del local, la ubicación (Mataró), la dirección o calle y tus especialidades culinarias.
            </p>
          </div>

          {/* 2. Google SERP Live Snippet Preview */}
          <div className="bg-[#181914] border border-[#5a5a40]/30 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[10px] font-sans uppercase tracking-wider font-semibold text-neutral-400 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-amber-300" />
                Vista Previa en Vivo del Resultado en Google (SERP)
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">Actualizado en tiempo real</span>
            </div>

            <div className="bg-white rounded-xl p-4 text-left font-sans text-neutral-900 shadow-sm border border-neutral-200">
              <div className="flex items-center gap-2 text-xs text-neutral-600 mb-1">
                <div className="w-4 h-4 rounded-full bg-amber-600/20 text-amber-800 flex items-center justify-center text-[9px] font-bold">
                  G
                </div>
                <span className="text-neutral-700 text-xs font-medium">Café Gaudí</span>
                <span className="text-neutral-400">›</span>
                <span className="text-neutral-500 text-xs truncate">https://cafegaudi.es › mataro › cafeteria</span>
              </div>
              <h4 className="text-base sm:text-lg text-[#1a0dab] font-normal hover:underline cursor-pointer leading-tight mb-1">
                Café Gaudí | Mataró, Barcelona – Café de Especialidad & Tapas
              </h4>
              <p className="text-xs sm:text-sm text-[#4d5156] leading-relaxed line-clamp-2">
                {formData.metaDescription ||
                  'Café Gaudí en Carrer Germans Thos i Codina 20, Mataró. Carta digital completa, ofertas matinales, focaccias artesanas, combos y reserva de mesas.'}
              </p>
            </div>
          </div>

          {/* 3. Keywords SEO Field */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <label className="text-xs font-sans uppercase tracking-wider text-neutral-200 font-medium flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-amber-300" />
                <span>Palabras Clave (Meta Keywords SEO)</span>
              </label>

              <span className="text-xs font-mono text-neutral-400">
                {(formData.metaKeywords || '')
                  .split(',')
                  .map((k) => k.trim())
                  .filter(Boolean).length}{' '}
                keywords activas
              </span>
            </div>

            <textarea
              rows={2}
              value={formData.metaKeywords || ''}
              onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })}
              placeholder="café gaudi mataró, cafetería mataró, café de especialidad, focaccias artesanas..."
              className="w-full px-4 py-2.5 bg-[#1e1f1a] border border-[#5a5a40]/50 rounded-2xl text-white text-xs sm:text-sm focus:outline-hidden focus:border-amber-300/60 font-mono placeholder-neutral-500"
            />
            <p className="text-[11px] text-neutral-400 font-sans">
              Introduce las palabras clave separadas por comas. Estas son las búsquedas habituales con las que los comensales buscan cafeterías y locales gastronómicos en Mataró.
            </p>

            {/* Active Keywords Tags */}
            {(() => {
              const keywordsList = (formData.metaKeywords || '')
                .split(',')
                .map((k) => k.trim())
                .filter(Boolean);
              if (keywordsList.length === 0) return null;
              return (
                <div className="pt-1">
                  <span className="text-[10px] text-neutral-400 font-sans block mb-1.5">
                    Etiquetas activas reconocidas:
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                    {keywordsList.map((kw, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-300/10 text-amber-300 border border-amber-300/20 text-xs font-sans"
                      >
                        <span>{kw}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = keywordsList.filter((_, i) => i !== idx).join(', ');
                            setFormData({ ...formData, metaKeywords: updated });
                          }}
                          className="hover:text-red-400 ml-0.5 cursor-pointer"
                          title="Eliminar esta palabra clave"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Quick add suggested keywords */}
            <div className="bg-[#1e1f1a] border border-neutral-700/50 rounded-2xl p-3.5 space-y-2">
              <span className="text-[11px] text-neutral-300 font-sans font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Sugerencias rápidas para añadir (haz clic para incorporar):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_KEYWORDS.map((sug, i) => {
                  const alreadyIncluded = (formData.metaKeywords || '')
                    .toLowerCase()
                    .includes(sug.toLowerCase());
                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={alreadyIncluded}
                      onClick={() => handleAddKeyword(sug)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-sans transition-colors cursor-pointer flex items-center gap-1 ${
                        alreadyIncluded
                          ? 'bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed'
                          : 'bg-[#282921] hover:bg-[#34362a] text-neutral-300 hover:text-white border border-[#5a5a40]/40'
                      }`}
                    >
                      {alreadyIncluded ? <Check className="w-3 h-3 text-emerald-400" /> : <Plus className="w-3 h-3 text-amber-300" />}
                      <span>{sug}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-7 py-3.5 bg-[#5a5a40] hover:bg-[#6c6c4c] text-white font-sans text-xs uppercase tracking-wider font-semibold rounded-xl flex items-center gap-2 transition-all shadow-lg cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Todos los Ajustes y Horarios</span>
          </button>
        </div>
      </form>
    </div>
  );
};
