import React from 'react';
import {
  Calendar,
  Users,
  Clock,
  Camera,
  Mail,
  Utensils,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  Phone,
  MessageCircle,
  MapPin,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Percent,
  Sliders,
  Palmtree,
  PartyPopper,
} from 'lucide-react';
import { Reservation, GalleryPhoto, VenueSettings } from '../../types';
import { isVenueCurrentlyClosed } from '../../data/adminStore';

interface AdminDashboardOverviewProps {
  reservations: Reservation[];
  photos: GalleryPhoto[];
  venueSettings: VenueSettings;
  onNavigateTab: (tab: 'reservas' | 'galeria' | 'carta' | 'email' | 'ajustes' | 'variables') => void;
  onStatusChange: (id: string, status: Reservation['status']) => void;
}

export const AdminDashboardOverview: React.FC<AdminDashboardOverviewProps> = ({
  reservations,
  photos,
  venueSettings,
  onNavigateTab,
  onStatusChange,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const activeReservations = reservations.filter((r) => !r.archived);
  const archivedReservations = reservations.filter((r) => r.archived);
  const todayReservations = activeReservations.filter((r) => r.date === todayStr);

  const totalGuestsToday = todayReservations.reduce((sum, r) => sum + r.guests, 0);
  const confirmedToday = todayReservations.filter((r) => r.status === 'confirmada' || r.status === 'sentada').length;
  const pendingCount = activeReservations.filter((r) => r.status === 'pendiente').length;

  // Capacity calculation
  const totalCapacity = venueSettings.terraceCapacity + venueSettings.salonCapacity;
  const occupancyPercent = totalCapacity > 0 ? Math.min(100, Math.round((totalGuestsToday / totalCapacity) * 100)) : 0;

  // Next upcoming reservation today
  const sortedToday = [...todayReservations]
    .filter((r) => r.status !== 'cancelada' && r.status !== 'completada')
    .sort((a, b) => a.time.localeCompare(b.time));
  const nextReservation = sortedToday[0] || null;

  // Open hours and current venue status
  const dayOfWeek = new Date().getDay(); // 0 is Sunday, 1 is Monday
  const isEarlyCloseToday = dayOfWeek === 0 || dayOfWeek === 1;
  const venueStatus = isVenueCurrentlyClosed(venueSettings);
  const regularHoursToday = isEarlyCloseToday
    ? `${venueSettings.scheduleSunMon || '08:30 a 16:00 h'} (Horario diurno)`
    : `${venueSettings.scheduleTueSat || '08:30 a 23:00 h'} (Servicio continuo & Cenas)`;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Prominent Alert Banner if Venue is Closed for Vacations or Holidays */}
      {venueStatus.isClosed && (
        <div className="bg-gradient-to-r from-amber-950/80 via-amber-900/60 to-[#282922] border-2 border-amber-400/60 rounded-3xl p-5 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-start gap-3.5">
            <span className="text-3xl shrink-0 mt-0.5">
              {venueStatus.status === 'vacation' ? '🏖️' : venueStatus.status === 'holiday' ? '🎉' : '⏸️'}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-sans uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {venueStatus.status === 'vacation' ? 'Modo Vacaciones Activo' : venueStatus.status === 'holiday' ? 'Festivo Activo' : 'Cierre Temporal'}
                </span>
                {venueStatus.reopeningDate && (
                  <span className="text-xs text-amber-200/90 font-sans font-medium">
                    • Reapertura: {venueStatus.reopeningDate}
                  </span>
                )}
              </div>
              <h3 className="font-serif text-lg text-white font-medium mt-1">
                {venueStatus.title}
              </h3>
              <p className="text-xs text-neutral-300 font-sans mt-0.5 max-w-2xl leading-relaxed">
                {venueStatus.message}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('ajustes')}
            className="shrink-0 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-sans text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Gestionar Horario / Reabrir</span>
          </button>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#282922] via-[#33342c] to-[#282922] border border-[#5a5a40]/30 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {venueStatus.isClosed ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-sans uppercase tracking-wider font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                  {venueStatus.status === 'vacation' ? '🏖️ En Vacaciones' : venueStatus.status === 'holiday' ? '🎉 En Festivo' : '⏸️ Temporalmente Cerrado'}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-sans uppercase tracking-wider font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Servicio Operativo
                </span>
              )}
              <span className="text-xs text-neutral-400 font-sans">
                {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-white font-medium">
              Bienvenido al Panel de Café Gaudí
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-2xl font-sans">
              Control centralizado de citas, mesas, horarios, modo cerrado por vacaciones/festivos, carta digital y notificaciones.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('ajustes')}
              className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-amber-300/30 font-sans text-xs uppercase tracking-wider font-semibold rounded-xl flex items-center gap-2 transition-all cursor-pointer"
            >
              <Clock className="w-4 h-4 text-amber-300" />
              <span>Horarios & Vacaciones</span>
            </button>
            <button
              onClick={() => onNavigateTab('reservas')}
              className="px-5 py-2.5 bg-[#5a5a40] hover:bg-[#6c6c4c] text-white font-sans text-xs uppercase tracking-wider font-semibold rounded-xl flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Ver Agenda de Citas</span>
            </button>
          </div>
        </div>

        {/* Schedule note pill */}
        <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-300 font-sans">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            <span>
              Horario de hoy:{' '}
              <strong className={venueStatus.isClosed ? 'text-amber-300 font-medium' : 'text-white'}>
                {venueStatus.isClosed ? `Cerrado (${venueStatus.title})` : regularHoursToday}
              </strong>
            </span>
          </div>
          <span className="text-[11px] text-neutral-400">
            Aforo: {venueSettings.terraceCapacity} Terraza • {venueSettings.salonCapacity} Salón
          </span>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Reservas Hoy */}
        <div
          onClick={() => onNavigateTab('reservas')}
          className="bg-[#24251e] border border-[#5a5a40]/30 hover:border-amber-300/40 rounded-2xl p-5 shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-sans uppercase tracking-wider text-neutral-400 font-medium">
              Reservas Hoy
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-300/10 text-amber-300 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-serif text-white font-bold">{todayReservations.length}</span>
            <span className="text-xs text-neutral-400 font-sans">
              ({confirmedToday} confirmadas)
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-neutral-400 font-sans border-t border-neutral-800 pt-2">
            <span>{pendingCount > 0 ? `${pendingCount} pendientes de revisión` : 'Todas revisadas'}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-amber-300" />
          </div>
        </div>

        {/* Card 2: Comensales Hoy */}
        <div
          onClick={() => onNavigateTab('reservas')}
          className="bg-[#24251e] border border-[#5a5a40]/30 hover:border-amber-300/40 rounded-2xl p-5 shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-sans uppercase tracking-wider text-neutral-400 font-medium">
              Comensales Esperados
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-serif text-white font-bold">{totalGuestsToday}</span>
            <span className="text-xs text-neutral-400 font-sans">personas</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-neutral-400 font-sans border-t border-neutral-800 pt-2">
            <span>Ocupación de aforo: {occupancyPercent}%</span>
            <Percent className="w-3.5 h-3.5 text-blue-400" />
          </div>
        </div>

        {/* Card 3: Próxima Mesa */}
        <div
          onClick={() => onNavigateTab('reservas')}
          className="bg-[#24251e] border border-[#5a5a40]/30 hover:border-amber-300/40 rounded-2xl p-5 shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-sans uppercase tracking-wider text-neutral-400 font-medium">
              Próxima Llegada
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          {nextReservation ? (
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-serif text-white font-bold">{nextReservation.time} h</span>
                <span className="text-xs text-emerald-400 font-sans uppercase font-medium">
                  {nextReservation.zone}
                </span>
              </div>
              <p className="text-xs text-neutral-300 truncate mt-1">
                {nextReservation.name} ({nextReservation.guests}p)
              </p>
            </div>
          ) : (
            <div>
              <span className="text-lg font-serif text-neutral-400">Sin citas pendientes</span>
              <p className="text-xs text-neutral-500 mt-1">Todas sentadas o turno finalizado</p>
            </div>
          )}
          <div className="mt-3 flex items-center justify-between text-xs text-neutral-400 font-sans border-t border-neutral-800 pt-2">
            <span>Ver horario completo</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>

        {/* Card 4: Galería & Catálogo */}
        <div
          onClick={() => onNavigateTab('galeria')}
          className="bg-[#24251e] border border-[#5a5a40]/30 hover:border-amber-300/40 rounded-2xl p-5 shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-sans uppercase tracking-wider text-neutral-400 font-medium">
              Fotos en Galería
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Camera className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-serif text-white font-bold">{photos.length}</span>
            <span className="text-xs text-neutral-400 font-sans">fotografías</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-neutral-400 font-sans border-t border-neutral-800 pt-2">
            <span>Subir o editar imágenes</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Main Split: Today's Appointments & Quick Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Citas y Reservas de Hoy */}
        <div className="lg:col-span-2 bg-[#24251e] border border-[#5a5a40]/30 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-serif text-lg text-white font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-300" />
                <span>Agenda de Hoy ({todayReservations.length})</span>
              </h2>
              <p className="text-xs text-neutral-400 font-sans mt-0.5">
                Manejo inmediato de clientes en sala y llegadas programadas
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('reservas')}
              className="text-xs text-amber-300 hover:text-amber-200 font-sans font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>Ver todas</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {todayReservations.length === 0 ? (
            <div className="text-center py-10 bg-[#1e1f1a] rounded-2xl border border-dashed border-neutral-800">
              <Calendar className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
              <p className="text-xs text-neutral-400 font-sans">No hay reservas registradas para hoy aún.</p>
              <button
                onClick={() => onNavigateTab('reservas')}
                className="mt-3 px-4 py-2 bg-[#5a5a40]/40 hover:bg-[#5a5a40] text-neutral-200 text-xs rounded-xl font-sans transition-colors cursor-pointer"
              >
                + Añadir Reserva Manual
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {todayReservations.map((res) => {
                const isSentada = res.status === 'sentada';
                const isCompletada = res.status === 'completada';
                const isCancelada = res.status === 'cancelada';

                return (
                  <div
                    key={res.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isSentada
                        ? 'bg-blue-950/20 border-blue-500/30'
                        : isCompletada
                        ? 'bg-neutral-900/30 border-neutral-800 opacity-75'
                        : isCancelada
                        ? 'bg-red-950/10 border-red-900/20 opacity-60'
                        : 'bg-[#1e1f1a] border-[#5a5a40]/30 hover:border-amber-300/30'
                    }`}
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#2a2b22] border border-[#5a5a40]/40 flex flex-col items-center justify-center shrink-0">
                        <span className="font-mono text-xs text-amber-300 font-bold">{res.time}</span>
                        <span className="text-[10px] text-neutral-400 uppercase">{res.zone.slice(0, 4)}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-sm text-white font-sans">{res.name}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-medium bg-neutral-800 text-neutral-300">
                            {res.guests} {res.guests === 1 ? 'persona' : 'personas'}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-sans uppercase tracking-wider font-semibold ${
                              res.status === 'confirmada'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : res.status === 'sentada'
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                : res.status === 'pendiente'
                                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                                : res.status === 'completada'
                                ? 'bg-neutral-800 text-neutral-400'
                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}
                          >
                            {res.status === 'sentada' ? 'En Mesa' : res.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-neutral-400 mt-1 font-sans">
                          <span className="font-mono text-[11px] text-neutral-500">#{res.code}</span>
                          <span>•</span>
                          <a
                            href={`tel:${res.phone.replace(/\s+/g, '')}`}
                            className="hover:text-amber-300 flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" />
                            <span>{res.phone}</span>
                          </a>
                        </div>
                        {res.specialRequests && (
                          <p className="text-xs text-amber-300/80 italic mt-1 font-sans">
                            «{res.specialRequests}»
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Quick status buttons */}
                    <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                      {res.status !== 'sentada' && res.status !== 'completada' && (
                        <button
                          onClick={() => onStatusChange(res.id, 'sentada')}
                          className="px-2.5 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-lg text-xs font-sans transition-colors cursor-pointer"
                          title="Marcar cliente sentado en la mesa"
                        >
                          Sentar a mesa
                        </button>
                      )}
                      {res.status === 'sentada' && (
                        <button
                          onClick={() => onStatusChange(res.id, 'completada')}
                          className="px-2.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-sans transition-colors cursor-pointer"
                          title="Marcar servicio completado"
                        >
                          Completar
                        </button>
                      )}
                      <a
                        href={`https://wa.me/${res.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `¡Hola ${res.name}! Te escribimos de Café Gaudí respecto a tu reserva de hoy a las ${res.time}h (#${res.code}). ¿Todo listo para recibirte?`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-400 border border-emerald-800/40 rounded-lg text-xs transition-colors cursor-pointer"
                        title="Contactar por WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 1 Col: Quick Control Shortcuts */}
        <div className="space-y-4">
          {/* Quick modules navigation card */}
          <div className="bg-[#24251e] border border-[#5a5a40]/30 rounded-3xl p-6 shadow-xl">
            <h3 className="font-serif text-base text-white font-medium mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Accesos Rápidos</span>
            </h3>
            <div className="space-y-2.5">
              <button
                onClick={() => onNavigateTab('variables')}
                className="w-full p-3 bg-[#1e1f1a] hover:bg-[#2c2d24] border border-amber-300/30 hover:border-amber-300/60 rounded-xl text-left flex items-center justify-between transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-sans font-semibold text-white block flex items-center gap-1.5">
                      <span>Panel de Variables</span>
                      <span className="px-1.5 py-0.2 bg-amber-400/20 text-amber-300 text-[9px] rounded-full uppercase tracking-wider">Checklist</span>
                    </span>
                    <span className="text-[11px] text-neutral-400">Revisar y definir variables de la web</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
              </button>

              <button
                onClick={() => onNavigateTab('reservas')}
                className="w-full p-3 bg-[#1e1f1a] hover:bg-[#2c2d24] border border-[#5a5a40]/20 hover:border-amber-300/40 rounded-xl text-left flex items-center justify-between transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-300/10 text-amber-300 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-sans font-semibold text-white block">Libro de Reservas</span>
                    <span className="text-[11px] text-neutral-400">Ver todas las fechas y clientes</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
              </button>

              <button
                onClick={() => onNavigateTab('galeria')}
                className="w-full p-3 bg-[#1e1f1a] hover:bg-[#2c2d24] border border-[#5a5a40]/20 hover:border-amber-300/40 rounded-xl text-left flex items-center justify-between transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-sans font-semibold text-white block">Galería & Fotos</span>
                    <span className="text-[11px] text-neutral-400">Subir, editar y borrar fotos</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
              </button>

              <button
                onClick={() => onNavigateTab('carta')}
                className="w-full p-3 bg-[#1e1f1a] hover:bg-[#2c2d24] border border-[#5a5a40]/20 hover:border-amber-300/40 rounded-xl text-left flex items-center justify-between transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <Utensils className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-sans font-semibold text-white block">Carta & Disponibilidad</span>
                    <span className="text-[11px] text-neutral-400">Marcar platos agotados/activos</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
              </button>

              <button
                onClick={() => onNavigateTab('email')}
                className="w-full p-3 bg-[#1e1f1a] hover:bg-[#2c2d24] border border-[#5a5a40]/20 hover:border-amber-300/40 rounded-xl text-left flex items-center justify-between transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-sans font-semibold text-white block">Configuración de Email</span>
                    <span className="text-[11px] text-neutral-400">Plantilla y previsualización</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
              </button>
            </div>
          </div>

          {/* Local Information status */}
          <div className="bg-[#24251e] border border-[#5a5a40]/30 rounded-3xl p-5 shadow-xl">
            <h4 className="text-xs font-sans uppercase tracking-wider text-neutral-400 font-semibold mb-3 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-300" />
              <span>Café Gaudí - Datos del Local</span>
            </h4>
            <div className="text-xs text-neutral-300 space-y-2 font-sans">
              <p>
                <strong className="text-white">Dirección:</strong> Carrer Germans Thos i Codina, 20, Mataró
              </p>
              <p>
                <strong className="text-white">Teléfono de sala:</strong> {venueSettings.phone}
              </p>
              <p>
                <strong className="text-white">WhatsApp directo:</strong> +{venueSettings.whatsapp}
              </p>
              <div className="pt-2 border-t border-neutral-800">
                <span className="text-[11px] text-neutral-400 block mb-1 font-medium">Aviso activo a clientes:</span>
                <p className="text-[11px] text-amber-300/90 bg-[#1e1f1a] p-2.5 rounded-lg border border-[#5a5a40]/20">
                  {venueSettings.noticeBanner}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
