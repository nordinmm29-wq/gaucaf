import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Calendar,
  Camera,
  Utensils,
  Mail,
  Settings,
  ArrowLeft,
  LogOut,
  Menu as MenuIcon,
  X,
  Coffee,
  Plus,
  ExternalLink,
  ShieldCheck,
  Clock,
  ChevronRight,
  Bell,
  Sliders
} from 'lucide-react';
import {
  Reservation,
  GalleryPhoto,
  ConfirmationEmailConfig,
  VenueSettings,
} from '../../types';
import {
  getStoredReservations,
  saveReservations,
  updateReservationStatus,
  deleteReservation,
  archiveReservationFromAgenda,
  restoreReservationToAgenda,
  permanentDeleteReservation,
  deleteMultipleReservations,
  clearArchivedReservations,
  clearAllPastReservationsHistory,
  resetReservationsToDemo,
  addReservation,
  getStoredGalleryPhotos,
  saveGalleryPhotos,
  resetGalleryPhotos,
  getStoredEmailConfig,
  saveEmailConfig,
  resetEmailConfig,
  getStoredVenueSettings,
  saveVenueSettings,
  setAdminAuthenticated,
  isAdminAuthenticated,
} from '../../data/adminStore';
import { AdminDashboardOverview } from './AdminDashboardOverview';
import { AdminBookingsView } from './AdminBookingsView';
import { AdminGalleryView } from './AdminGalleryView';
import { AdminMenuView } from './AdminMenuView';
import { AdminEmailView } from './AdminEmailView';
import { AdminSettingsView } from './AdminSettingsView';
import { AdminVariablesView } from './AdminVariablesView';

interface AdminDashboardProps {
  onBackToWeb: () => void;
}

export type AdminTab = 'dashboard' | 'reservas' | 'galeria' | 'carta' | 'email' | 'ajustes' | 'variables';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToWeb }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Core synchronized states
  const [reservations, setReservations] = useState<Reservation[]>(getStoredReservations);
  const [photos, setPhotos] = useState<GalleryPhoto[]>(getStoredGalleryPhotos);
  const [emailConfig, setEmailConfig] = useState<ConfirmationEmailConfig>(getStoredEmailConfig);
  const [venueSettings, setVenueSettings] = useState<VenueSettings>(getStoredVenueSettings);

  // Live time ticker
  const [currentTime, setCurrentTime] = useState<string>(() =>
    new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }));
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // Listen to custom window events for live cross-tab updates
  useEffect(() => {
    const handleReservationsUpdate = () => setReservations(getStoredReservations());
    const handleGalleryUpdate = () => setPhotos(getStoredGalleryPhotos());
    const handleEmailUpdate = () => setEmailConfig(getStoredEmailConfig());
    const handleSettingsUpdate = () => setVenueSettings(getStoredVenueSettings());

    window.addEventListener('gaudi:reservations_updated', handleReservationsUpdate);
    window.addEventListener('gaudi:gallery_updated', handleGalleryUpdate);
    window.addEventListener('gaudi:email_config_updated', handleEmailUpdate);
    window.addEventListener('gaudi:venue_settings_updated', handleSettingsUpdate);

    return () => {
      window.removeEventListener('gaudi:reservations_updated', handleReservationsUpdate);
      window.removeEventListener('gaudi:gallery_updated', handleGalleryUpdate);
      window.removeEventListener('gaudi:email_config_updated', handleEmailUpdate);
      window.removeEventListener('gaudi:venue_settings_updated', handleSettingsUpdate);
    };
  }, []);

  // Handlers for child views
  const handleStatusChange = (id: string, status: Reservation['status']) => {
    updateReservationStatus(id, status);
    setReservations(getStoredReservations());
  };

  const handleDeleteReservation = (id: string) => {
    deleteReservation(id);
    setReservations(getStoredReservations());
  };

  const handleArchiveReservation = (id: string, reason?: string) => {
    archiveReservationFromAgenda(id, reason);
    setReservations(getStoredReservations());
  };

  const handleRestoreReservation = (id: string) => {
    restoreReservationToAgenda(id);
    setReservations(getStoredReservations());
  };

  const handlePermanentDeleteReservation = (id: string) => {
    permanentDeleteReservation(id);
    setReservations(getStoredReservations());
  };

  const handleDeleteMultipleReservations = (ids: string[]) => {
    deleteMultipleReservations(ids);
    setReservations(getStoredReservations());
  };

  const handleClearArchivedReservations = () => {
    clearArchivedReservations();
    setReservations(getStoredReservations());
  };

  const handleClearAllPastHistory = () => {
    clearAllPastReservationsHistory();
    setReservations(getStoredReservations());
  };

  const handleResetToDemo = () => {
    resetReservationsToDemo();
    setReservations(getStoredReservations());
  };

  const handleAddReservation = (res: Omit<Reservation, 'id' | 'code' | 'createdAt'>) => {
    addReservation(res);
    setReservations(getStoredReservations());
  };

  const handleSavePhotos = (newPhotos: GalleryPhoto[]) => {
    saveGalleryPhotos(newPhotos);
    setPhotos(newPhotos);
  };

  const handleResetPhotos = () => {
    const defaultPhotos = resetGalleryPhotos();
    setPhotos(defaultPhotos);
  };

  const handleSaveEmail = (cfg: ConfirmationEmailConfig) => {
    saveEmailConfig(cfg);
    setEmailConfig(cfg);
  };

  const handleResetEmail = () => {
    const def = resetEmailConfig();
    setEmailConfig(def);
  };

  const handleSaveVenueSettings = (st: VenueSettings) => {
    saveVenueSettings(st);
    setVenueSettings(st);
  };

  const handleLogout = () => {
    setAdminAuthenticated(false);
    onBackToWeb();
  };

  // Badges & Counters
  const todayStr = new Date().toISOString().split('T')[0];
  const activeReservations = reservations.filter((r) => !r.archived);
  const archivedReservations = reservations.filter((r) => r.archived);
  const todayCount = activeReservations.filter((r) => r.date === todayStr).length;
  const pendingCount = activeReservations.filter((r) => r.status === 'pendiente').length;

  const NAV_ITEMS: { id: AdminTab; label: string; icon: React.FC<{ className?: string }>; badge?: string | number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: todayCount > 0 ? `${todayCount} hoy` : undefined },
    { id: 'variables', label: 'Panel de Variables', icon: Sliders, badge: 'Checklist' },
    {
      id: 'reservas',
      label: 'Agenda de Citas',
      icon: Calendar,
      badge: pendingCount > 0 ? `${pendingCount} pend.` : archivedReservations.length > 0 ? `${archivedReservations.length} arch.` : undefined,
    },
    { id: 'galeria', label: 'Galería de Fotos', icon: Camera, badge: photos.length },
    { id: 'carta', label: 'Carta & Disponibilidad', icon: Utensils },
    { id: 'email', label: 'Plantilla de Email', icon: Mail },
    { id: 'ajustes', label: 'Ajustes & Aforo', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#1a1b16] text-neutral-200 flex flex-col md:flex-row antialiased">
      {/* Mobile Top Header */}
      <header className="md:hidden bg-[#24251e] border-b border-[#5a5a40]/30 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#5a5a40]/40 flex items-center justify-center text-amber-300">
            <Coffee className="w-4 h-4" />
          </div>
          <div>
            <span className="font-serif text-sm font-semibold text-white block">Gaudí Admin</span>
            <span className="text-[10px] text-neutral-400 font-sans">Panel de Control</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBackToWeb}
            className="px-2.5 py-1 text-xs text-amber-300 font-sans border border-amber-300/30 rounded-lg flex items-center gap-1"
          >
            <span>Ver Web</span>
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-neutral-300 hover:text-white rounded-lg bg-[#1e1f1a]"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Left Sidebar (Barbershop style persistent sidebar) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#22231c] border-r border-[#5a5a40]/30 flex flex-col justify-between transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: Logo & System Badge */}
        <div>
          <div className="p-6 border-b border-[#5a5a40]/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#5a5a40] to-[#3a3a28] flex items-center justify-center text-amber-300 shadow-md border border-amber-300/20">
                <Coffee className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-serif text-base font-bold text-white tracking-wide">
                  GAUDÍ ADMIN
                </h1>
                <p className="text-[11px] text-neutral-400 font-sans flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Sistema Operativo</span>
                </p>
              </div>
            </div>

            {/* Close button on mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1.5">
            <span className="text-[11px] font-sans uppercase tracking-wider text-neutral-500 font-semibold px-3 mb-2 block">
              Gestión Principal
            </span>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full px-3.5 py-3 rounded-xl text-xs font-sans font-medium flex items-center justify-between transition-all cursor-pointer group ${
                    isActive
                      ? 'bg-[#5a5a40] text-white shadow-md font-semibold'
                      : 'text-neutral-400 hover:text-white hover:bg-[#2c2d24]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-amber-300' : 'text-neutral-400 group-hover:text-amber-300'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-sans ${
                        isActive
                          ? 'bg-black/30 text-amber-300 font-semibold'
                          : 'bg-[#1a1b16] text-neutral-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar: Return to Web & Logout */}
        <div className="p-4 border-t border-[#5a5a40]/30 space-y-2">
          <button
            onClick={onBackToWeb}
            className="w-full px-3.5 py-2.5 bg-[#1a1b16] hover:bg-[#2c2d24] text-neutral-200 hover:text-amber-300 border border-[#5a5a40]/30 rounded-xl text-xs font-sans flex items-center justify-between transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <ArrowLeft className="w-4 h-4 text-amber-300" />
              <span>Ver Web Pública</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
          </button>

          <button
            onClick={handleLogout}
            className="w-full px-3.5 py-2.5 text-neutral-400 hover:text-red-400 hover:bg-red-950/20 rounded-xl text-xs font-sans flex items-center gap-2.5 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>

          <div className="pt-2 px-2 text-[10px] text-neutral-500 font-mono text-center">
            Mataró • Carrer Germans Thos i Codina, 20
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Topbar */}
        <header className="hidden md:flex bg-[#22231c] border-b border-[#5a5a40]/30 px-8 py-4 items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-xs font-sans uppercase tracking-wider text-neutral-400 font-medium">
              Panel Administrativo
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
            <span className="text-sm font-serif font-medium text-white capitalize">
              {activeTab === 'reservas'
                ? 'Agenda de Citas & Reservas'
                : activeTab === 'galeria'
                ? 'Galería & Fotografías'
                : activeTab === 'carta'
                ? 'Carta & Disponibilidad'
                : activeTab === 'email'
                ? 'Configuración de Correo'
                : activeTab === 'ajustes'
                ? 'Ajustes del Restaurante'
                : 'Resumen General'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Live Clock */}
            <div className="flex items-center gap-1.5 text-xs text-neutral-300 font-mono bg-[#1a1b16] px-3 py-1.5 rounded-lg border border-[#5a5a40]/20">
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              <span>{currentTime}</span>
            </div>

            {/* Back to Web Button */}
            <button
              onClick={onBackToWeb}
              className="px-3.5 py-1.5 bg-[#1a1b16] hover:bg-[#2c2d24] text-neutral-300 hover:text-amber-300 border border-[#5a5a40]/30 rounded-xl text-xs font-sans flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Ver Web Pública</span>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
            </button>

            {/* Admin Badge */}
            <div className="flex items-center gap-2 pl-3 border-l border-neutral-700/60">
              <div className="w-8 h-8 rounded-full bg-[#5a5a40] text-white flex items-center justify-center font-bold text-xs shadow-inner">
                A
              </div>
              <div className="text-left">
                <span className="text-xs font-medium text-white block">Administrador</span>
                <span className="text-[10px] text-amber-300/90 font-mono">Café Gaudí</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <AdminDashboardOverview
              reservations={reservations}
              photos={photos}
              venueSettings={venueSettings}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onStatusChange={handleStatusChange}
            />
          )}

          {activeTab === 'reservas' && (
            <AdminBookingsView
              reservations={reservations}
              emailConfig={emailConfig}
              onStatusChange={handleStatusChange}
              onDeleteReservation={handleDeleteReservation}
              onArchiveReservation={handleArchiveReservation}
              onRestoreReservation={handleRestoreReservation}
              onPermanentDeleteReservation={handlePermanentDeleteReservation}
              onDeleteMultipleReservations={handleDeleteMultipleReservations}
              onClearArchivedReservations={handleClearArchivedReservations}
              onClearAllPastHistory={handleClearAllPastHistory}
              onResetToDemoReservations={handleResetToDemo}
              onAddReservation={handleAddReservation}
            />
          )}

          {activeTab === 'galeria' && (
            <AdminGalleryView
              photos={photos}
              onSavePhotos={handleSavePhotos}
              onResetPhotos={handleResetPhotos}
            />
          )}

          {activeTab === 'carta' && <AdminMenuView />}

          {activeTab === 'email' && (
            <AdminEmailView
              config={emailConfig}
              onSaveConfig={handleSaveEmail}
              onResetConfig={handleResetEmail}
            />
          )}

          {activeTab === 'variables' && (
            <AdminVariablesView
              venueSettings={venueSettings}
              emailConfig={emailConfig}
              onSaveVenueSettings={handleSaveVenueSettings}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'ajustes' && (
            <AdminSettingsView
              settings={venueSettings}
              onSaveSettings={handleSaveVenueSettings}
            />
          )}
        </main>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 md:hidden backdrop-blur-xs"
        />
      )}
    </div>
  );
};
