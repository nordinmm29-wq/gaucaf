import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  X,
  Trash2,
  Filter,
  Eye,
  ChevronDown,
  Sparkles,
  MapPin,
  FileText,
  Loader2,
  Send,
  Archive,
  RotateCcw,
  ShieldCheck,
  FolderDown,
  Info,
  ArchiveRestore,
  AlertTriangle
} from 'lucide-react';
import { Reservation, ConfirmationEmailConfig } from '../../types';
import { EmailPreviewCard } from '../EmailPreviewCard';
import { sendReservationEmail } from '../../data/emailService';
import { getStoredSmtpSettings } from '../../data/adminStore';

interface AdminBookingsViewProps {
  reservations: Reservation[];
  emailConfig: ConfirmationEmailConfig;
  onStatusChange: (id: string, status: Reservation['status']) => void;
  onDeleteReservation: (id: string) => void;
  onArchiveReservation?: (id: string, reason?: string) => void;
  onRestoreReservation?: (id: string) => void;
  onPermanentDeleteReservation?: (id: string) => void;
  onDeleteMultipleReservations?: (ids: string[]) => void;
  onClearArchivedReservations?: () => void;
  onClearAllPastHistory?: () => void;
  onResetToDemoReservations?: () => void;
  onAddReservation: (res: Omit<Reservation, 'id' | 'code' | 'createdAt'>) => void;
}

export const AdminBookingsView: React.FC<AdminBookingsViewProps> = ({
  reservations,
  emailConfig,
  onStatusChange,
  onDeleteReservation,
  onArchiveReservation,
  onRestoreReservation,
  onPermanentDeleteReservation,
  onDeleteMultipleReservations,
  onClearArchivedReservations,
  onClearAllPastHistory,
  onResetToDemoReservations,
  onAddReservation,
}) => {
  const [agendaMode, setAgendaMode] = useState<'activa' | 'archivadas'>('activa');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [dateFilter, setDateFilter] = useState<'todos' | 'hoy' | 'manana' | 'semana' | 'custom'>('todos');
  const [customDate, setCustomDate] = useState<string>('');

  // Selected reservation for email preview modal
  const [previewReservation, setPreviewReservation] = useState<Reservation | null>(null);

  // Archive confirmation modal state
  const [archiveModalReservation, setArchiveModalReservation] = useState<Reservation | null>(null);
  const [archiveReasonChoice, setArchiveReasonChoice] = useState<string>('Borrada de la agenda a petición del cliente');
  const [customArchiveReason, setCustomArchiveReason] = useState<string>('');

  // History Purging / Clear modals
  const [isConfirmClearAllOpen, setIsConfirmClearAllOpen] = useState(false);
  const [isConfirmClearPastOpen, setIsConfirmClearPastOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // New manual reservation modal
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [newBookingName, setNewBookingName] = useState('');
  const [newBookingPhone, setNewBookingPhone] = useState('');
  const [newBookingEmail, setNewBookingEmail] = useState('');
  const [newBookingDate, setNewBookingDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [newBookingTime, setNewBookingTime] = useState('14:00');
  const [newBookingGuests, setNewBookingGuests] = useState(2);
  const [newBookingZone, setNewBookingZone] = useState<'terraza' | 'salon'>('terraza');
  const [newBookingRequests, setNewBookingRequests] = useState('');
  const [newBookingStatus, setNewBookingStatus] = useState<Reservation['status']>('confirmada');

  // Email sending state
  const [sendingEmailId, setSendingEmailId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSendEmail = async (res: Reservation) => {
    setSendingEmailId(res.id);
    try {
      const result = await sendReservationEmail(res, emailConfig, getStoredSmtpSettings());
      if (result.success) {
        setToastMessage(`✓ Email enviado con éxito a ${res.email}`);
      } else {
        setToastMessage(`Aviso de envío: ${result.message || result.error || 'Registrado'}`);
      }
    } catch (e: any) {
      setToastMessage(`Error de envío: ${e.message}`);
    } finally {
      setSendingEmailId(null);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  // Dates helpers
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const in7Days = new Date();
  in7Days.setDate(in7Days.getDate() + 7);
  const in7DaysStr = in7Days.toISOString().split('T')[0];

  // Active vs Archived separation
  const activeReservations = reservations.filter((r) => !r.archived);
  const archivedReservations = reservations.filter((r) => r.archived);

  // Target list depending on selected mode
  const currentModeList = agendaMode === 'activa' ? activeReservations : archivedReservations;

  // Filter reservations
  const filteredReservations = currentModeList.filter((r) => {
    // Status filter
    if (statusFilter !== 'todos' && r.status !== statusFilter) return false;

    // Date filter
    if (dateFilter === 'hoy' && r.date !== todayStr) return false;
    if (dateFilter === 'manana' && r.date !== tomorrowStr) return false;
    if (dateFilter === 'semana' && (r.date < todayStr || r.date > in7DaysStr)) return false;
    if (dateFilter === 'custom' && customDate && r.date !== customDate) return false;

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = r.name.toLowerCase().includes(q);
      const matchPhone = r.phone.toLowerCase().includes(q);
      const matchCode = r.code.toLowerCase().includes(q);
      const matchEmail = r.email.toLowerCase().includes(q);
      const matchReq = (r.specialRequests || '').toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchCode && !matchEmail && !matchReq) return false;
    }

    return true;
  });

  // Sort by date then time
  const sortedReservations = [...filteredReservations].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.time.localeCompare(b.time);
  });

  const totalGuests = sortedReservations.reduce((sum, r) => sum + r.guests, 0);

  const handleConfirmArchive = () => {
    if (!archiveModalReservation) return;
    const finalReason =
      archiveReasonChoice === 'custom' && customArchiveReason.trim()
        ? customArchiveReason.trim()
        : archiveReasonChoice;

    if (onArchiveReservation) {
      onArchiveReservation(archiveModalReservation.id, finalReason);
    } else {
      onDeleteReservation(archiveModalReservation.id);
    }

    setToastMessage(`✓ Reserva de ${archiveModalReservation.name} quitada de la agenda activa y conservada en archivo.`);
    setTimeout(() => setToastMessage(null), 4000);
    setArchiveModalReservation(null);
    setArchiveReasonChoice('Borrada de la agenda a petición del cliente');
    setCustomArchiveReason('');
  };

  const handleRestore = (res: Reservation) => {
    if (onRestoreReservation) {
      onRestoreReservation(res.id);
    }
    setToastMessage(`✓ Reserva #${res.code} de ${res.name} restaurada a la agenda activa.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllCurrent = () => {
    if (selectedIds.length === filteredReservations.length && filteredReservations.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredReservations.map((r) => r.id));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    const count = selectedIds.length;
    if (
      confirm(
        `⚠️ ¿Deseas eliminar definitivamente las ${count} reserva(s) seleccionadas?\n\nEsta acción no se puede deshacer.`
      )
    ) {
      if (onDeleteMultipleReservations) {
        onDeleteMultipleReservations(selectedIds);
      } else {
        selectedIds.forEach((id) => {
          if (onPermanentDeleteReservation) onPermanentDeleteReservation(id);
          else onDeleteReservation(id);
        });
      }
      setSelectedIds([]);
      setToastMessage(`✓ ${count} reserva(s) eliminadas definitivamente.`);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const handleConfirmClearAllArchive = () => {
    if (onClearArchivedReservations) {
      onClearArchivedReservations();
    } else {
      archivedReservations.forEach((r) => {
        if (onPermanentDeleteReservation) onPermanentDeleteReservation(r.id);
      });
    }
    setIsConfirmClearAllOpen(false);
    setSelectedIds([]);
    setToastMessage('✓ Todo el archivo histórico de reservas ha sido eliminado por completo.');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleConfirmClearPast = () => {
    if (onClearAllPastHistory) {
      onClearAllPastHistory();
    }
    setIsConfirmClearPastOpen(false);
    setSelectedIds([]);
    setToastMessage('✓ Reservas pasadas finalizadas han sido eliminadas de la agenda.');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handlePermanentDelete = (res: Reservation) => {
    if (
      confirm(
        `⚠️ ATENCIÓN: ¿Deseas eliminar permanentemente de la base de datos la reserva de ${res.name} (#${res.code})?\n\nEsta acción purgará el registro por completo y no se podrá deshacer.`
      )
    ) {
      if (onPermanentDeleteReservation) {
        onPermanentDeleteReservation(res.id);
      } else {
        onDeleteReservation(res.id);
      }
      setToastMessage(`Reserva #${res.code} eliminada definitivamente.`);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const handleCreateManualBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookingName.trim() || !newBookingPhone.trim()) {
      setToastMessage('Por favor indica nombre y teléfono para la reserva.');
      setTimeout(() => setToastMessage(null), 3500);
      return;
    }

    onAddReservation({
      name: newBookingName.trim(),
      phone: newBookingPhone.trim(),
      email: newBookingEmail.trim() || 'cliente@gastrocafegaudi.com',
      date: newBookingDate,
      time: newBookingTime,
      guests: newBookingGuests,
      zone: newBookingZone,
      specialRequests: newBookingRequests.trim() || undefined,
      status: newBookingStatus,
    });

    // Reset and close
    setNewBookingName('');
    setNewBookingPhone('');
    setNewBookingEmail('');
    setNewBookingRequests('');
    setIsNewBookingModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-sans animate-fade-in border border-emerald-500">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-white font-medium flex items-center gap-2">
            <Calendar className="w-6 h-6 text-amber-300" />
            <span>Agenda & Libro de Reservas</span>
          </h2>
          <p className="text-xs text-neutral-400 font-sans mt-0.5">
            Gestión completa de citas, control de estados (confirmar, sentar a la mesa, completar) y avisos a clientes.
          </p>
        </div>

        <button
          onClick={() => setIsNewBookingModalOpen(true)}
          className="px-4 py-2.5 bg-[#5a5a40] hover:bg-[#6c6c4c] text-white font-sans text-xs uppercase tracking-wider font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Registrar Reserva Manual</span>
        </button>
      </div>

      {/* Mode Switcher: Active Agenda vs Preserved Archive */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#24251e] border border-[#5a5a40]/30 p-2.5 rounded-2xl shadow-md">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAgendaMode('activa')}
            className={`px-4 py-2.5 rounded-xl text-xs font-sans font-medium flex items-center gap-2.5 transition-all cursor-pointer ${
              agendaMode === 'activa'
                ? 'bg-[#5a5a40] text-white shadow-md font-semibold'
                : 'text-neutral-400 hover:text-white hover:bg-[#1e1f1a]'
            }`}
          >
            <Calendar className="w-4 h-4 text-amber-300" />
            <span>Agenda Activa</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                agendaMode === 'activa' ? 'bg-black/40 text-amber-300' : 'bg-[#1e1f1a] text-neutral-300'
              }`}
            >
              {activeReservations.length}
            </span>
          </button>

          <button
            onClick={() => setAgendaMode('archivadas')}
            className={`px-4 py-2.5 rounded-xl text-xs font-sans font-medium flex items-center gap-2.5 transition-all cursor-pointer ${
              agendaMode === 'archivadas'
                ? 'bg-amber-950/60 text-amber-200 border border-amber-500/40 shadow-md font-semibold'
                : 'text-neutral-400 hover:text-white hover:bg-[#1e1f1a]'
            }`}
          >
            <Archive className="w-4 h-4 text-amber-400" />
            <span>Reservas Conservadas</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                agendaMode === 'archivadas' ? 'bg-amber-400/20 text-amber-300' : 'bg-[#1e1f1a] text-neutral-300'
              }`}
            >
              {archivedReservations.length}
            </span>
          </button>
        </div>

        <div className="text-[11px] text-neutral-400 font-sans hidden sm:flex items-center gap-1.5 px-3">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>
            {agendaMode === 'activa'
              ? 'Al borrar una reserva de la agenda, queda conservada en el archivo sin perder datos.'
              : 'Histórico preservado: ningún dato se pierde y puedes restaurarlas cuando quieras.'}
          </span>
        </div>
      </div>

      {/* Action / Toolbar Bar for Selected items or Clear History */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#1e1f1a] border border-[#5a5a40]/30 rounded-2xl p-3 sm:p-4">
        <div className="flex flex-wrap items-center gap-2">
          {filteredReservations.length > 0 && (
            <button
              onClick={handleSelectAllCurrent}
              className="px-3 py-1.5 rounded-xl text-xs font-sans font-medium bg-[#2a2b22] hover:bg-[#35362a] text-neutral-300 hover:text-white border border-[#5a5a40]/40 transition-colors cursor-pointer"
            >
              {selectedIds.length === filteredReservations.length
                ? 'Deseleccionar todas'
                : `Seleccionar todas (${filteredReservations.length})`}
            </button>
          )}

          {selectedIds.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="px-3.5 py-1.5 rounded-xl text-xs font-sans font-semibold bg-rose-950/60 hover:bg-rose-900/80 text-rose-200 border border-rose-600/50 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Eliminar {selectedIds.length} seleccionada(s)</span>
            </button>
          )}

          {selectedIds.length > 0 && (
            <span className="text-xs text-neutral-400 font-sans">
              {selectedIds.length} de {filteredReservations.length} seleccionadas
            </span>
          )}
        </div>

        {/* Global actions per tab */}
        <div className="flex flex-wrap items-center gap-2">
          {agendaMode === 'archivadas' && archivedReservations.length > 0 && (
            <button
              onClick={() => setIsConfirmClearAllOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-sans font-semibold bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-500/50 flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
              title="Eliminar permanentemente todas las reservas archivadas"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
              <span>Vaciar Archivo Histórico</span>
            </button>
          )}

          {agendaMode === 'activa' && (
            <button
              onClick={() => setIsConfirmClearPastOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-sans font-medium bg-[#2a2b22] hover:bg-[#35362a] text-neutral-300 hover:text-amber-200 border border-[#5a5a40]/40 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Purgar reservas pasadas que ya fueron completadas o canceladas"
            >
              <Trash2 className="w-3.5 h-3.5 text-amber-400/80" />
              <span>Limpiar Reservas Pasadas Finalizadas</span>
            </button>
          )}
        </div>
      </div>

      {/* Informational Banner for Preserved / Archive Mode */}
      {agendaMode === 'archivadas' && (
        <div className="bg-amber-950/30 border border-amber-500/40 rounded-2xl p-4 text-amber-200 text-xs font-sans flex items-start gap-3 shadow-inner">
          <Archive className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="font-semibold text-white text-sm">
                Historial de Reservas Conservadas ({archivedReservations.length})
              </h4>
              {archivedReservations.length > 0 && (
                <span className="text-[11px] text-amber-300/80 font-mono">
                  Puedes vaciar este historial en cualquier momento con el botón superior.
                </span>
              )}
            </div>
            <p className="text-neutral-300 leading-relaxed">
              Aquí se guardan las reservas retiradas de la agenda de sala con todos sus datos intactos.
              Puedes consultarlas, restaurarlas a la agenda activa con un clic o eliminarlas definitivamente cuando ya no las necesites.
            </p>
          </div>
        </div>
      )}

      {/* Filter and Search Bar (Barbería Style) */}
      <div className="bg-[#24251e] border border-[#5a5a40]/30 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por cliente, teléfono, código (#GAUDI-...), o peticiones..."
              className="w-full pl-10 pr-4 py-2 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white placeholder-neutral-500 text-xs focus:outline-hidden focus:border-amber-300/50"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs text-neutral-400 font-sans whitespace-nowrap">Estado:</span>
            {[
              { id: 'todos', label: 'Todos' },
              { id: 'confirmada', label: 'Confirmadas' },
              { id: 'sentada', label: 'En Mesa' },
              { id: 'pendiente', label: 'Pendientes' },
              { id: 'completada', label: 'Completadas' },
              { id: 'cancelada', label: 'Canceladas' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-sans whitespace-nowrap transition-colors cursor-pointer ${
                  statusFilter === st.id
                    ? 'bg-amber-300/20 text-amber-300 border border-amber-300/40 font-medium'
                    : 'bg-[#1e1f1a] text-neutral-400 hover:text-neutral-200 border border-[#5a5a40]/20'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Date Filters Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-800">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-neutral-400 font-sans">Fecha:</span>
            <button
              onClick={() => setDateFilter('todos')}
              className={`px-3 py-1 rounded-lg text-xs font-sans transition-colors cursor-pointer ${
                dateFilter === 'todos'
                  ? 'bg-[#5a5a40] text-white font-medium'
                  : 'bg-[#1e1f1a] text-neutral-400 hover:text-white'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setDateFilter('hoy')}
              className={`px-3 py-1 rounded-lg text-xs font-sans transition-colors cursor-pointer ${
                dateFilter === 'hoy'
                  ? 'bg-[#5a5a40] text-white font-medium'
                  : 'bg-[#1e1f1a] text-neutral-400 hover:text-white'
              }`}
            >
              Hoy
            </button>
            <button
              onClick={() => setDateFilter('manana')}
              className={`px-3 py-1 rounded-lg text-xs font-sans transition-colors cursor-pointer ${
                dateFilter === 'manana'
                  ? 'bg-[#5a5a40] text-white font-medium'
                  : 'bg-[#1e1f1a] text-neutral-400 hover:text-white'
              }`}
            >
              Mañana
            </button>
            <button
              onClick={() => setDateFilter('semana')}
              className={`px-3 py-1 rounded-lg text-xs font-sans transition-colors cursor-pointer ${
                dateFilter === 'semana'
                  ? 'bg-[#5a5a40] text-white font-medium'
                  : 'bg-[#1e1f1a] text-neutral-400 hover:text-white'
              }`}
            >
              Próximos 7 días
            </button>

            <div className="flex items-center gap-1.5 ml-2">
              <input
                type="date"
                value={customDate}
                onChange={(e) => {
                  setCustomDate(e.target.value);
                  setDateFilter('custom');
                }}
                className="bg-[#1e1f1a] border border-[#5a5a40]/30 rounded-lg text-white text-xs px-2.5 py-1 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="text-xs text-neutral-400 font-sans">
            Mostrando <strong className="text-white">{sortedReservations.length}</strong> reservas (
            <strong className="text-amber-300">{totalGuests}</strong> comensales)
          </div>
        </div>
      </div>

      {/* Bookings Table / Cards List */}
      {sortedReservations.length === 0 ? (
        <div className="bg-[#24251e] border border-[#5a5a40]/30 rounded-3xl p-12 text-center">
          <Calendar className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
          <h3 className="font-serif text-lg text-white font-medium">
            {agendaMode === 'activa'
              ? (searchTerm || statusFilter !== 'todos' || dateFilter !== 'todos' ? 'No se encontraron reservas con estos filtros' : 'No hay reservas en la agenda activa')
              : 'No hay reservas en el archivo histórico'}
          </h3>
          <p className="text-xs text-neutral-400 font-sans mt-1.5 max-w-md mx-auto leading-relaxed">
            {agendaMode === 'activa'
              ? (searchTerm || statusFilter !== 'todos' || dateFilter !== 'todos'
                  ? 'Prueba a cambiar las fechas, el estado o el texto de búsqueda.'
                  : 'Las reservas únicamente se registrarán cuando un cliente las solicite a través de la web pública o cuando las introduzcas manualmente con el botón «+ Nueva Reserva». No se autogeneran reservas de prueba sin autorización.')
              : 'Las reservas que quites de la agenda de sala se conservarán aquí por seguridad sin perder sus datos.'}
          </p>
          {(searchTerm || statusFilter !== 'todos' || dateFilter !== 'todos') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('todos');
                setDateFilter('todos');
                setCustomDate('');
              }}
              className="mt-4 px-4 py-2 bg-[#5a5a40]/50 hover:bg-[#5a5a40] text-white rounded-xl text-xs font-sans transition-colors cursor-pointer"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {sortedReservations.map((res) => {
            const isToday = res.date === todayStr;

            return (
              <div
                key={res.id}
                className={`bg-[#24251e] hover:bg-[#282922] border rounded-2xl p-4 sm:p-5 shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                  selectedIds.includes(res.id)
                    ? 'border-amber-400/60 bg-[#2b2c22]'
                    : 'border-[#5a5a40]/30'
                }`}
              >
                {/* Left: Date, Time, Zone & Customer Details */}
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Select Checkbox */}
                  <div className="pt-3.5 sm:pt-4 shrink-0">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(res.id)}
                      onChange={() => handleToggleSelect(res.id)}
                      className="w-4 h-4 rounded-sm border-neutral-600 bg-neutral-900 text-amber-500 focus:ring-amber-400 cursor-pointer"
                      title="Seleccionar para acciones en lote"
                    />
                  </div>

                  {/* Time badge */}
                  <div className="w-14 h-14 rounded-2xl bg-[#1e1f1a] border border-[#5a5a40]/40 flex flex-col items-center justify-center shrink-0 shadow-inner">
                    <span className="font-mono text-sm text-amber-300 font-bold">{res.time}</span>
                    <span className="text-[10px] text-neutral-400 uppercase font-sans">
                      {res.zone === 'terraza' ? 'Terraza' : 'Salón'}
                    </span>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h4 className="font-serif text-base text-white font-medium">{res.name}</h4>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-sans font-medium bg-neutral-800 text-neutral-300 flex items-center gap-1">
                        <Users className="w-3 h-3 text-neutral-400" />
                        <span>{res.guests} {res.guests === 1 ? 'comensal' : 'comensales'}</span>
                      </span>

                      {/* Status Badge */}
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-sans uppercase tracking-wider font-semibold ${
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

                      {isToday && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-bold bg-amber-400 text-neutral-900 uppercase tracking-wider">
                          Hoy
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-400 font-sans">
                      <span className="font-mono text-neutral-400 font-medium">#{res.code}</span>
                      <span>Fecha: <strong className="text-neutral-300">{res.date}</strong></span>
                      <a
                        href={`tel:${res.phone.replace(/\s+/g, '')}`}
                        className="text-neutral-300 hover:text-amber-300 flex items-center gap-1 transition-colors"
                      >
                        <Phone className="w-3 h-3 text-amber-300" />
                        <span>{res.phone}</span>
                      </a>
                      <span className="text-neutral-400">{res.email}</span>
                    </div>

                    {/* Special requests note */}
                    {res.specialRequests && (
                      <div className="mt-2 bg-[#1e1f1a] px-3 py-1.5 rounded-lg border border-[#5a5a40]/20 text-xs text-amber-200/90 font-sans flex items-start gap-1.5 max-w-xl">
                        <FileText className="w-3.5 h-3.5 text-amber-300 shrink-0 mt-0.5" />
                        <span>«{res.specialRequests}»</span>
                      </div>
                    )}

                    {/* Preserved archive metadata badge */}
                    {res.archived && (
                      <div className="mt-2 bg-amber-950/40 border border-amber-500/30 px-3 py-1.5 rounded-lg text-xs text-amber-200/90 font-sans flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="flex items-center gap-1 text-amber-300 font-semibold">
                          <Archive className="w-3.5 h-3.5" />
                          <span>Conservada en archivo</span>
                        </span>
                        {res.archivedAt && (
                          <span className="text-neutral-400">
                            Retirada el: {new Date(res.archivedAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                        {res.archivedReason && (
                          <span className="text-neutral-300 italic">
                            Motivo: «{res.archivedReason}»
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Actions, Status Changing & WhatsApp */}
                <div className="flex flex-wrap items-center gap-2 self-end lg:self-center shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-neutral-800 w-full lg:w-auto justify-end">
                  {/* Status Change Selector */}
                  <select
                    value={res.status}
                    onChange={(e) => onStatusChange(res.id, e.target.value as Reservation['status'])}
                    className="bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-xs font-sans text-white px-3 py-2 focus:outline-hidden focus:border-amber-300/50 cursor-pointer"
                  >
                    <option value="confirmada">🟢 Confirmada</option>
                    <option value="sentada">🔵 Sentada en mesa</option>
                    <option value="pendiente">������ Pendiente</option>
                    <option value="completada">⚪ Completada</option>
                    <option value="cancelada">🔴 Cancelada</option>
                  </select>

                  {/* View Email Preview Button */}
                  <button
                    type="button"
                    onClick={() => setPreviewReservation(res)}
                    className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-xl text-xs border border-neutral-700 transition-colors cursor-pointer"
                    title="Ver correo de confirmación de este cliente"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {/* Send / Resend Email Button */}
                  <button
                    type="button"
                    disabled={sendingEmailId === res.id}
                    onClick={() => handleSendEmail(res)}
                    className="p-2 bg-neutral-800 hover:bg-neutral-700 text-amber-300 hover:text-amber-200 rounded-xl text-xs border border-neutral-700 transition-colors cursor-pointer disabled:opacity-50"
                    title={`Enviar / Reenviar correo de confirmación a ${res.email}`}
                  >
                    {sendingEmailId === res.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                    ) : (
                      <Mail className="w-4 h-4" />
                    )}
                  </button>

                  {/* Direct WhatsApp Button */}
                  <a
                    href={`https://wa.me/${res.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `¡Hola ${res.name}! Te contactamos desde Café Gaudí (Mataró) para saludarte y confirmar tu reserva de mesa (#${res.code}) para ${res.guests} personas el día ${res.date} a las ${res.time}h en nuestra zona de ${res.zone}.\n\nCarrer Germans Thos i Codina, 20. ¡Te esperamos!`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-400 border border-emerald-800/40 rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    title="Enviar WhatsApp directo"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="hidden sm:inline font-sans text-xs">WhatsApp</span>
                  </a>

                  {/* Direct Call Button */}
                  <a
                    href={`tel:${res.phone.replace(/\s+/g, '')}`}
                    className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-xl text-xs border border-neutral-700 transition-colors cursor-pointer"
                    title="Llamar al cliente"
                  >
                    <Phone className="w-4 h-4" />
                  </a>

                  {/* If Archived: Show Restore & Permanent Delete */}
                  {res.archived ? (
                    <div className="flex items-center gap-1.5 pl-1 border-l border-neutral-700/60">
                      <button
                        onClick={() => handleRestore(res)}
                        className="px-3 py-2 bg-[#5a5a40] hover:bg-[#6c6c4c] text-white rounded-xl text-xs font-sans font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                        title="Restaurar a la agenda activa"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
                        <span>Restaurar a Agenda</span>
                      </button>

                      <button
                        onClick={() => handlePermanentDelete(res)}
                        className="p-2 bg-red-950/20 hover:bg-red-900/40 text-red-400 border border-red-900/30 rounded-xl text-xs transition-colors cursor-pointer"
                        title="Eliminar definitivamente de la base de datos"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    /* If Active: Soft delete button (removes from active agenda, keeps preserved) */
                    <button
                      onClick={() => setArchiveModalReservation(res)}
                      className="px-3 py-2 bg-rose-950/25 hover:bg-rose-900/40 text-rose-300 hover:text-white border border-rose-800/40 hover:border-rose-600 rounded-xl text-xs font-sans transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                      title="Borrar de la agenda activa (se conservará en el archivo histórico)"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                      <span className="hidden sm:inline font-medium">Borrar de la agenda</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: Email Preview for a specific reservation */}
      {previewReservation && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-neutral-300 my-auto text-left">
            <div className="bg-[#282922] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-300" />
                <span className="font-serif text-sm font-medium">
                  Correo de Confirmación para {previewReservation.name} (#{previewReservation.code})
                </span>
              </div>
              <button
                onClick={() => setPreviewReservation(null)}
                className="text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[75vh] overflow-y-auto">
              <EmailPreviewCard config={emailConfig} reservation={previewReservation} isModal={true} />
            </div>
            <div className="bg-[#f5f5f0] px-6 py-3 border-t border-neutral-200 flex items-center justify-between text-xs text-[#737365]">
              <span>Destinatario: <strong>{previewReservation.email}</strong></span>
              <button
                onClick={() => setPreviewReservation(null)}
                className="px-4 py-1.5 bg-[#5a5a40] hover:bg-[#4a4a30] text-white rounded-full font-medium cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Quitar de Agenda y Conservar en Archivo */}
      {archiveModalReservation && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#24251e] w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-amber-500/40 my-auto text-left">
            <div className="bg-[#2d2e26] text-white px-6 py-4 flex items-center justify-between border-b border-[#5a5a40]/30">
              <div className="flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-rose-400" />
                <span className="font-serif text-base font-medium">Borrar de la Agenda (Conservar Registro)</span>
              </div>
              <button
                onClick={() => setArchiveModalReservation(null)}
                className="text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 font-sans text-xs">
              <div className="bg-[#1e1f1a] border border-[#5a5a40]/30 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-white font-medium text-sm">
                    {archiveModalReservation.name}
                  </span>
                  <span className="font-mono text-amber-300 font-bold">
                    #{archiveModalReservation.code}
                  </span>
                </div>
                <div className="text-neutral-400 flex flex-wrap gap-x-3 gap-y-1">
                  <span>Fecha: <strong className="text-neutral-200">{archiveModalReservation.date}</strong></span>
                  <span>Hora: <strong className="text-neutral-200">{archiveModalReservation.time} h</strong></span>
                  <span>Comensales: <strong className="text-neutral-200">{archiveModalReservation.guests} pers.</strong> ({archiveModalReservation.zone})</span>
                </div>
              </div>

              {/* Preservation reassurance alert */}
              <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-3.5 text-emerald-300 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5 leading-relaxed">
                  <span className="font-semibold text-white block">Los datos quedan 100% conservados:</span>
                  <p className="text-neutral-300 text-[11px]">
                    La reserva se retirará del planning de la agenda activa y del aforo de hoy, pero se mantendrá <strong>conservada de forma segura en el archivo histórico</strong> con su teléfono, email y notas. Podrás restaurarla a la agenda con un solo clic si el cliente vuelve a llamar.
                  </p>
                </div>
              </div>

              {/* Reason selector */}
              <div>
                <label className="block text-neutral-300 font-medium mb-1.5">
                  Motivo de retirada de la agenda (opcional para control interno):
                </label>
                <select
                  value={archiveReasonChoice}
                  onChange={(e) => setArchiveReasonChoice(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300/50 cursor-pointer"
                >
                  <option value="Borrada de la agenda a petición del cliente">Borrada de la agenda a petición del cliente</option>
                  <option value="No se presentó (No-show)">No se presentó (No-show)</option>
                  <option value="Cancelada con antelación">Cancelada con antelación</option>
                  <option value="Fecha pasada / Servicio completado y cerrado">Fecha pasada / Servicio completado y cerrado</option>
                  <option value="Duplicada o error de fecha">Duplicada o error de fecha</option>
                  <option value="custom">Otro motivo personalizado...</option>
                </select>
              </div>

              {archiveReasonChoice === 'custom' && (
                <div>
                  <label className="block text-neutral-400 mb-1">Escribe el motivo:</label>
                  <input
                    type="text"
                    value={customArchiveReason}
                    onChange={(e) => setCustomArchiveReason(e.target.value)}
                    placeholder="Ej. El cliente llamó para aplazar la cita sin fecha fija..."
                    className="w-full px-3 py-2 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300/50"
                  />
                </div>
              )}

              <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setArchiveModalReservation(null)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-sans cursor-pointer transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmArchive}
                  className="px-5 py-2 bg-rose-900/70 hover:bg-rose-800 text-white border border-rose-600/50 rounded-xl text-xs font-sans font-semibold uppercase tracking-wider cursor-pointer transition-colors flex items-center gap-1.5 shadow-md"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-300" />
                  <span>Borrar de Agenda y Conservar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Nueva Reserva Manual */}
      {isNewBookingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#24251e] w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border border-[#5a5a40]/40 my-auto text-left">
            <div className="bg-[#2d2e26] text-white px-6 py-4 flex items-center justify-between border-b border-[#5a5a40]/30">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-300" />
                <span className="font-serif text-base font-medium">Registrar Nueva Cita / Reserva Manual</span>
              </div>
              <button
                onClick={() => setIsNewBookingModalOpen(false)}
                className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManualBooking} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans uppercase tracking-wider text-neutral-300 mb-1">
                    Nombre del Cliente *
                  </label>
                  <input
                    type="text"
                    required
                    value={newBookingName}
                    onChange={(e) => setNewBookingName(e.target.value)}
                    placeholder="Ej. Pau Claris"
                    className="w-full px-3 py-2 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans uppercase tracking-wider text-neutral-300 mb-1">
                    Teléfono de Contacto *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newBookingPhone}
                    onChange={(e) => setNewBookingPhone(e.target.value)}
                    placeholder="Ej. 612 34 56 78"
                    className="w-full px-3 py-2 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-sans uppercase tracking-wider text-neutral-300 mb-1">
                  Email del Cliente (opcional)
                </label>
                <input
                  type="email"
                  value={newBookingEmail}
                  onChange={(e) => setNewBookingEmail(e.target.value)}
                  placeholder="cliente@ejemplo.com"
                  className="w-full px-3 py-2 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-sans uppercase tracking-wider text-neutral-300 mb-1">
                    Fecha *
                  </label>
                  <input
                    type="date"
                    required
                    value={newBookingDate}
                    onChange={(e) => setNewBookingDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans uppercase tracking-wider text-neutral-300 mb-1">
                    Hora *
                  </label>
                  <input
                    type="time"
                    required
                    value={newBookingTime}
                    onChange={(e) => setNewBookingTime(e.target.value)}
                    className="w-full px-3 py-2 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans uppercase tracking-wider text-neutral-300 mb-1">
                    Personas *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    required
                    value={newBookingGuests}
                    onChange={(e) => setNewBookingGuests(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-sans uppercase tracking-wider text-neutral-300 mb-1">
                    Zona
                  </label>
                  <select
                    value={newBookingZone}
                    onChange={(e) => setNewBookingZone(e.target.value as 'terraza' | 'salon')}
                    className="w-full px-3 py-2 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300/50 cursor-pointer"
                  >
                    <option value="terraza">Terraza Exterior</option>
                    <option value="salon">Salón Interior Climatizado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-sans uppercase tracking-wider text-neutral-300 mb-1">
                    Estado Inicial
                  </label>
                  <select
                    value={newBookingStatus}
                    onChange={(e) => setNewBookingStatus(e.target.value as Reservation['status'])}
                    className="w-full px-3 py-2 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300/50 cursor-pointer"
                  >
                    <option value="confirmada">Confirmada</option>
                    <option value="sentada">Sentada en mesa</option>
                    <option value="pendiente">Pendiente</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-sans uppercase tracking-wider text-neutral-300 mb-1">
                  Peticiones Especiales / Alergias
                </label>
                <textarea
                  value={newBookingRequests}
                  onChange={(e) => setNewBookingRequests(e.target.value)}
                  placeholder="Ej. Trona de bebé, intolerancia a frutos secos..."
                  rows={2}
                  className="w-full px-3 py-2 bg-[#1e1f1a] border border-[#5a5a40]/40 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-300/50"
                />
              </div>

              <div className="pt-4 border-t border-neutral-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewBookingModalOpen(false)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-sans cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#5a5a40] hover:bg-[#6c6c4c] text-white rounded-xl text-xs font-sans font-semibold uppercase tracking-wider cursor-pointer"
                >
                  Guardar Reserva
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Confirmation for Clearing ALL Archived History */}
      {isConfirmClearAllOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#24251e] border border-red-500/50 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto sm:mx-0">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-semibold text-white font-serif">
                ¿Vaciar todo el historial de reservas conservadas?
              </h3>
              <p className="text-xs text-neutral-300 font-sans mt-2 leading-relaxed">
                Se eliminarán permanentemente las <strong>{archivedReservations.length}</strong> reservas conservadas en el archivo histórico.
                Esta acción es irreversible y purgará los registros por completo de la memoria del panel.
              </p>
            </div>

            <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsConfirmClearAllOpen(false)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-sans cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmClearAllArchive}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-sans font-semibold uppercase tracking-wider transition-colors cursor-pointer shadow-lg"
              >
                Sí, vaciar historial ahora
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Confirmation for Clearing Past Completed/Cancelled Reservations */}
      {isConfirmClearPastOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#24251e] border border-amber-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto sm:mx-0">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-semibold text-white font-serif">
                ¿Limpiar reservas pasadas finalizadas?
              </h3>
              <p className="text-xs text-neutral-300 font-sans mt-2 leading-relaxed">
                Esta acción eliminará de la agenda activa las reservas de fechas anteriores a hoy que ya estén marcadas como <em>completadas</em> o <em>canceladas</em>, dejando la vista despejada para las reservas de hoy y próximas fechas.
              </p>
            </div>

            <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsConfirmClearPastOpen(false)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-sans cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmClearPast}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold rounded-xl text-xs font-sans uppercase tracking-wider transition-colors cursor-pointer shadow-lg"
              >
                Limpiar agenda
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
