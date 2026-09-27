import {
  ConfirmationEmailConfig,
  GalleryPhoto,
  Reservation,
  SmtpSettings,
  VenueSettings,
  HolidayDate,
  ServiceStatus,
} from '../types';
import { GALLERY_PHOTOS } from './galleryData';

export const DEFAULT_SMTP_SETTINGS: SmtpSettings = {
  host: '',
  port: 587,
  user: '',
  pass: '',
  secure: false,
  fromName: 'Café Gaudí',
  fromEmail: 'reservas@cafegaudi.com',
  resendApiKey: '',
};

const SMTP_STORAGE_KEY = 'gaudi_smtp_settings_v1';

export const DEFAULT_EMAIL_CONFIG: ConfirmationEmailConfig = {
  senderName: 'Café Gaudí - Reservas',
  senderEmail: 'reservas@cafegaudi.com',
  subject: '¡Reserva Confirmada! Tu mesa en Café Gaudí (Mataró) - #{codigo}',
  headline: '¡Hola {nombre}, tu mesa está confirmada!',
  greetingText: 'Nos hace mucha ilusión recibirte en Café Gaudí. Hemos registrado tu reserva para {personas} el día {fecha} a las {hora} h en nuestra zona de {zona}. Nuestro equipo de sala y cocina tiene todo listo para brindarte una gran experiencia.',
  policyNotes: 'Rogamos máxima puntualidad. Mantenemos la reserva durante 15 minutos de cortesía sobre la hora indicada. Si necesitas modificar el número de comensales o avisar de un retraso, llámanos directamente.',
  footerNotes: 'Carrer Germans Thos i Codina, 20, 08301 Mataró, Barcelona • Tel: {telefono_local}',
  buttonText: 'Añadir a Google Calendar',
  accentNote: 'Si algún comensal requiere atención especial por alergias o necesita trona para niños, háznoslo saber a la llegada.',
};

const GALLERY_STORAGE_KEY = 'gaudi_custom_gallery_photos_v2';
const OLD_GALLERY_STORAGE_KEY = 'gaudi_gallery_photos_v1';
const EMAIL_CONFIG_STORAGE_KEY = 'gaudi_email_config_v1';
const ADMIN_AUTH_KEY = 'gaudi_admin_authenticated';

export function getStoredGalleryPhotos(): GalleryPhoto[] {
  if (typeof window === 'undefined') return [];
  try {
    if (localStorage.getItem(OLD_GALLERY_STORAGE_KEY)) {
      localStorage.removeItem(OLD_GALLERY_STORAGE_KEY);
    }
    const raw = localStorage.getItem(GALLERY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Solo fotos subidas por el administrador (filtrando demos antiguas)
        return parsed.filter((p) => p && p.id && !p.id.startsWith('gal-'));
      }
    }
  } catch (e) {
    console.error('Error loading gallery photos from storage:', e);
  }
  return [];
}

export function saveGalleryPhotos(photos: GalleryPhoto[]): void {
  try {
    const sanitized = (photos || []).filter((p) => p && p.id && !p.id.startsWith('gal-'));
    localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(sanitized));
    window.dispatchEvent(new CustomEvent('gaudi:gallery_updated', { detail: sanitized }));
  } catch (e) {
    console.error('Error saving gallery photos:', e);
  }
}

export function resetGalleryPhotos(): GalleryPhoto[] {
  try {
    localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify([]));
    window.dispatchEvent(new CustomEvent('gaudi:gallery_updated', { detail: [] }));
  } catch (e) {
    console.error('Error resetting gallery photos:', e);
  }
  return [];
}

export function clearAllGalleryPhotos(): GalleryPhoto[] {
  return resetGalleryPhotos();
}

export function getStoredEmailConfig(): ConfirmationEmailConfig {
  if (typeof window === 'undefined') return DEFAULT_EMAIL_CONFIG;
  try {
    const raw = localStorage.getItem(EMAIL_CONFIG_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_EMAIL_CONFIG, ...parsed };
    }
  } catch (e) {
    console.error('Error loading email config from storage:', e);
  }
  return DEFAULT_EMAIL_CONFIG;
}

export function saveEmailConfig(config: ConfirmationEmailConfig): void {
  try {
    localStorage.setItem(EMAIL_CONFIG_STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new CustomEvent('gaudi:email_config_updated', { detail: config }));
  } catch (e) {
    console.error('Error saving email config:', e);
  }
}

export function resetEmailConfig(): ConfirmationEmailConfig {
  try {
    localStorage.removeItem(EMAIL_CONFIG_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('gaudi:email_config_updated', { detail: DEFAULT_EMAIL_CONFIG }));
  } catch (e) {
    console.error('Error resetting email config:', e);
  }
  return DEFAULT_EMAIL_CONFIG;
}

export function getStoredSmtpSettings(): SmtpSettings {
  if (typeof window === 'undefined') return DEFAULT_SMTP_SETTINGS;
  try {
    const raw = localStorage.getItem(SMTP_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_SMTP_SETTINGS, ...parsed };
    }
  } catch (e) {
    console.error('Error loading smtp settings:', e);
  }
  return DEFAULT_SMTP_SETTINGS;
}

export function saveSmtpSettings(settings: SmtpSettings): void {
  try {
    localStorage.setItem(SMTP_STORAGE_KEY, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('gaudi:smtp_settings_updated', { detail: settings }));
    // Persist to server backend so all visitor reservations can dispatch real emails
    fetch('/api/email/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    }).catch((err) => console.warn('Could not sync SMTP to server:', err));
  } catch (e) {
    console.error('Error saving smtp settings:', e);
  }
}

export async function fetchServerSmtpSettings(): Promise<SmtpSettings | null> {
  try {
    const res = await fetch('/api/email/config');
    if (res.ok) {
      const data = await res.json();
      if (data.host || data.user || data.resendApiKey) {
        const current = getStoredSmtpSettings();
        const merged: SmtpSettings = {
          host: data.host || current.host || '',
          port: data.port || current.port || 587,
          secure: data.secure ?? current.secure ?? false,
          user: data.user || current.user || '',
          pass: data.pass || current.pass || '',
          fromName: data.fromName || current.fromName || 'Café Gaudí',
          fromEmail: data.fromEmail || current.fromEmail || '',
          resendApiKey: data.resendApiKey || current.resendApiKey || '',
        };
        localStorage.setItem(SMTP_STORAGE_KEY, JSON.stringify(merged));
        return merged;
      }
    }
  } catch (e) {
    console.warn('Could not fetch SMTP settings from server:', e);
  }
  return null;
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setAdminAuthenticated(val: boolean): void {
  try {
    if (val) {
      localStorage.setItem(ADMIN_AUTH_KEY, 'true');
    } else {
      localStorage.removeItem(ADMIN_AUTH_KEY);
    }
  } catch (e) {
    console.error(e);
  }
}

// ----------------------------------------------------
// RESERVATIONS & BOOKINGS
// ----------------------------------------------------
export const RESERVATIONS_STORAGE_KEY = 'thos20_reservations';

// Las reservas solo se crean cuando un cliente real reserva en la web o cuando el administrador añade una manualmente
export const INITIAL_DEMO_RESERVATIONS: Reservation[] = [];

export function getStoredReservations(): Reservation[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RESERVATIONS_STORAGE_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Filtrar y purgar cualquier reserva ficticia autogenerada previamente
        return parsed.filter((r) => r && r.id && !r.id.startsWith('res-demo-'));
      }
    }
  } catch (e) {
    console.error('Error loading reservations:', e);
  }
  return [];
}

export function saveReservations(reservations: Reservation[]): void {
  try {
    // Asegurar que no se guarden reservas demo no autorizadas
    const sanitized = reservations.filter((r) => r && r.id && !r.id.startsWith('res-demo-'));
    localStorage.setItem(RESERVATIONS_STORAGE_KEY, JSON.stringify(sanitized));
    window.dispatchEvent(new CustomEvent('gaudi:reservations_updated', { detail: sanitized }));
  } catch (e) {
    console.error('Error saving reservations:', e);
  }
}

export function updateReservationStatus(id: string, newStatus: Reservation['status']): Reservation[] {
  const current = getStoredReservations();
  const updated = current.map((r) => (r.id === id ? { ...r, status: newStatus } : r));
  saveReservations(updated);
  return updated;
}

export function archiveReservationFromAgenda(id: string, reason?: string): Reservation[] {
  const current = getStoredReservations();
  const updated = current.map((r) =>
    r.id === id
      ? {
          ...r,
          archived: true,
          archivedAt: new Date().toISOString(),
          archivedReason: reason || 'Borrada de la agenda activa (conservada en archivo)',
        }
      : r
  );
  saveReservations(updated);
  return updated;
}

export function restoreReservationToAgenda(id: string): Reservation[] {
  const current = getStoredReservations();
  const updated = current.map((r) =>
    r.id === id
      ? {
          ...r,
          archived: false,
          archivedAt: undefined,
          archivedReason: undefined,
        }
      : r
  );
  saveReservations(updated);
  return updated;
}

export function permanentDeleteReservation(id: string): Reservation[] {
  const current = getStoredReservations();
  const updated = current.filter((r) => r.id !== id);
  saveReservations(updated);
  return updated;
}

export function deleteMultipleReservations(ids: string[]): Reservation[] {
  const current = getStoredReservations();
  const idSet = new Set(ids);
  const updated = current.filter((r) => !idSet.has(r.id));
  saveReservations(updated);
  return updated;
}

export function clearArchivedReservations(): Reservation[] {
  const current = getStoredReservations();
  const updated = current.filter((r) => !r.archived);
  saveReservations(updated);
  return updated;
}

export function clearAllPastReservationsHistory(): Reservation[] {
  const current = getStoredReservations();
  const todayStr = new Date().toISOString().split('T')[0];
  // Conserva solo reservas activas que no estén archivadas y que no sean pasadas completadas/canceladas
  const updated = current.filter((r) => {
    if (r.archived) return false;
    if (r.date < todayStr && (r.status === 'completada' || r.status === 'cancelada')) return false;
    return true;
  });
  saveReservations(updated);
  return updated;
}

export function resetReservationsToDemo(): Reservation[] {
  saveReservations(INITIAL_DEMO_RESERVATIONS);
  return INITIAL_DEMO_RESERVATIONS;
}

export function deleteReservation(id: string): Reservation[] {
  // Las reservas se borran de la agenda activa pero quedan conservadas en el archivo histórico
  return archiveReservationFromAgenda(id);
}

export function addReservation(newRes: Omit<Reservation, 'id' | 'code' | 'createdAt'>): Reservation {
  const current = getStoredReservations();
  const randomCode = `GAUDI-${Math.floor(1000 + Math.random() * 9000)}`;
  const created: Reservation = {
    ...newRes,
    id: `res-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    code: randomCode,
    createdAt: new Date().toISOString(),
  };
  const updated = [created, ...current];
  saveReservations(updated);
  return created;
}

// ----------------------------------------------------
// MENU AVAILABILITY OVERRIDES & PRICE CUSTOMIZATION
// ----------------------------------------------------
const MENU_AVAILABILITY_KEY = 'thos20_menu_availability';
const MENU_PRICE_OVERRIDES_KEY = 'gaudi_menu_price_overrides_v1';

export function getStoredMenuAvailability(): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(MENU_AVAILABILITY_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function toggleMenuItemAvailability(itemId: string): boolean {
  try {
    const map = getStoredMenuAvailability();
    const currentStatus = map[itemId] !== false; // default true
    const newStatus = !currentStatus;
    map[itemId] = newStatus;
    localStorage.setItem(MENU_AVAILABILITY_KEY, JSON.stringify(map));
    window.dispatchEvent(new CustomEvent('gaudi:menu_availability_updated', { detail: map }));
    return newStatus;
  } catch {
    return true;
  }
}

export function getStoredMenuPriceOverrides(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(MENU_PRICE_OVERRIDES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveMenuItemPrice(itemId: string, newPrice: number): void {
  try {
    const map = getStoredMenuPriceOverrides();
    map[itemId] = newPrice;
    localStorage.setItem(MENU_PRICE_OVERRIDES_KEY, JSON.stringify(map));
    window.dispatchEvent(new CustomEvent('gaudi:menu_prices_updated', { detail: map }));
  } catch (e) {
    console.error('Error saving menu item price:', e);
  }
}

export function resetMenuItemPrice(itemId: string): void {
  try {
    const map = getStoredMenuPriceOverrides();
    delete map[itemId];
    localStorage.setItem(MENU_PRICE_OVERRIDES_KEY, JSON.stringify(map));
    window.dispatchEvent(new CustomEvent('gaudi:menu_prices_updated', { detail: map }));
  } catch (e) {
    console.error('Error resetting menu item price:', e);
  }
}

export function resetAllMenuPrices(): void {
  try {
    localStorage.removeItem(MENU_PRICE_OVERRIDES_KEY);
    window.dispatchEvent(new CustomEvent('gaudi:menu_prices_updated', { detail: {} }));
  } catch (e) {
    console.error('Error resetting all menu prices:', e);
  }
}

// ----------------------------------------------------
// VENUE SETTINGS
// ----------------------------------------------------
export const DEFAULT_VENUE_SETTINGS: VenueSettings = {
  businessName: 'Café Gaudí',
  phone: '931 45 90 19',
  whatsapp: '34685994473',
  email: 'contacto@gastrocafegaudi.com',
  address: 'Carrer Germans Thos i Codina, 20, 08301 Mataró, Barcelona',
  terraceCapacity: 36,
  salonCapacity: 48,
  noticeBanner: 'Horario especial: Domingos y Lunes servicio diurno de 08:30 a 16:00. Martes a Sábados abierto hasta las 23:00 con cenas.',
  autoConfirmOnline: true,
  instagramUrl: 'https://instagram.com/gastrocafe_gaudi',
  tiktokUrl: 'https://tiktok.com/@gastrocafegaudi',
  tripAdvisorUrl: 'https://tripadvisor.es',
  cifOrTaxId: '',
  // SEO & Posicionamiento en Buscadores
  metaDescription:
    'Café Gaudí en Carrer Germans Thos i Codina 20, Mataró. Especialistas en café de autor, focaccias artesanas, desayunos, tapas de mercado y terraza al aire libre. ¡Reserva tu mesa!',
  metaKeywords:
    'café gaudi mataró, cafetería mataró, café de especialidad mataró, focaccias artesanas, brunch mataró, tapas mataró, restaurantes germans thos i codina, desayunos mataró, terrazas mataró, reservar mesa mataró',
  // Service status & holiday / vacation scheduling
  serviceStatus: 'open',
  closureTitle: 'Cerrado por Vacaciones',
  closureMessage: 'Estaremos cerrados temporalmente por descanso del personal. ¡Volvemos muy pronto con la máxima energía e ilusión!',
  closureStartDate: '',
  closureEndDate: '',
  reopeningDate: '',
  allowFutureBookingsDuringClosure: true,
  // Regular schedule
  scheduleTueSat: '08:30 a 23:00 h',
  scheduleTueSatNote: 'Servicio continuo, vermut, tapas y cenas gastronómicas',
  scheduleSunMon: '08:30 a 16:00 h',
  scheduleSunMonNote: 'Servicio diurno de desayunos, brunch y comidas',
  weeklyClosedDays: [],
  holidayDates: [
    { id: 'hol-1', date: '2026-12-25', label: 'Navidad', allDayClosed: true },
    { id: 'hol-2', date: '2026-12-26', label: 'Sant Esteve', allDayClosed: true },
    { id: 'hol-3', date: '2027-01-01', label: 'Año Nuevo', allDayClosed: true },
    { id: 'hol-4', date: '2027-01-06', label: 'Día de Reyes', allDayClosed: true },
  ],
};

const VENUE_SETTINGS_KEY = 'thos20_venue_settings';

export function getStoredVenueSettings(): VenueSettings {
  if (typeof window === 'undefined') return DEFAULT_VENUE_SETTINGS;
  try {
    const raw = localStorage.getItem(VENUE_SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_VENUE_SETTINGS,
        ...parsed,
        metaDescription: parsed.metaDescription ?? DEFAULT_VENUE_SETTINGS.metaDescription,
        metaKeywords: parsed.metaKeywords ?? DEFAULT_VENUE_SETTINGS.metaKeywords,
        serviceStatus: parsed.serviceStatus || DEFAULT_VENUE_SETTINGS.serviceStatus,
        scheduleTueSat: parsed.scheduleTueSat || DEFAULT_VENUE_SETTINGS.scheduleTueSat,
        scheduleSunMon: parsed.scheduleSunMon || DEFAULT_VENUE_SETTINGS.scheduleSunMon,
        scheduleTueSatNote: parsed.scheduleTueSatNote ?? DEFAULT_VENUE_SETTINGS.scheduleTueSatNote,
        scheduleSunMonNote: parsed.scheduleSunMonNote ?? DEFAULT_VENUE_SETTINGS.scheduleSunMonNote,
        closureTitle: parsed.closureTitle ?? DEFAULT_VENUE_SETTINGS.closureTitle,
        closureMessage: parsed.closureMessage ?? DEFAULT_VENUE_SETTINGS.closureMessage,
        closureStartDate: parsed.closureStartDate ?? '',
        closureEndDate: parsed.closureEndDate ?? '',
        reopeningDate: parsed.reopeningDate ?? '',
        allowFutureBookingsDuringClosure: parsed.allowFutureBookingsDuringClosure ?? true,
        holidayDates: Array.isArray(parsed.holidayDates) ? parsed.holidayDates : DEFAULT_VENUE_SETTINGS.holidayDates,
        weeklyClosedDays: Array.isArray(parsed.weeklyClosedDays) ? parsed.weeklyClosedDays : [],
      };
    }
  } catch {
    return DEFAULT_VENUE_SETTINGS;
  }
  return DEFAULT_VENUE_SETTINGS;
}

export function isVenueClosedOnDate(
  dateStr: string,
  settings: VenueSettings
): { isClosed: boolean; reason?: string; reopeningDate?: string } {
  if (!dateStr || !settings) return { isClosed: false };

  // 1. Check if venue is in vacation / holiday / special closure mode covering this date
  if (settings.serviceStatus && settings.serviceStatus !== 'open') {
    const start = settings.closureStartDate;
    const end = settings.closureEndDate;

    if (start && end) {
      if (dateStr >= start && dateStr <= end) {
        return {
          isClosed: true,
          reason: settings.closureTitle || 'Cerrado por vacaciones o festivo',
          reopeningDate: settings.reopeningDate || end,
        };
      }
    } else if (start && !end) {
      if (dateStr >= start) {
        return {
          isClosed: true,
          reason: settings.closureTitle || 'Cerrado temporalmente',
          reopeningDate: settings.reopeningDate,
        };
      }
    } else if (!start && end) {
      if (dateStr <= end) {
        return {
          isClosed: true,
          reason: settings.closureTitle || 'Cerrado temporalmente',
          reopeningDate: settings.reopeningDate || end,
        };
      }
    } else {
      // General closure with no date boundaries specified
      return {
        isClosed: true,
        reason: settings.closureTitle || 'Cerrado temporalmente',
        reopeningDate: settings.reopeningDate,
      };
    }
  }

  // 2. Check specific holiday dates
  if (Array.isArray(settings.holidayDates) && settings.holidayDates.length > 0) {
    const foundHoliday = settings.holidayDates.find(
      (h) => h.date === dateStr && h.allDayClosed
    );
    if (foundHoliday) {
      return {
        isClosed: true,
        reason: `Festivo: ${foundHoliday.label}`,
      };
    }
  }

  // 3. Check weekly closed days (e.g. if closed every Monday or Sunday)
  if (Array.isArray(settings.weeklyClosedDays) && settings.weeklyClosedDays.length > 0) {
    const d = new Date(dateStr + 'T12:00:00');
    const dayOfWeek = d.getDay();
    if (settings.weeklyClosedDays.includes(dayOfWeek)) {
      const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      return {
        isClosed: true,
        reason: `Día de descanso semanal (${dayNames[dayOfWeek]})`,
      };
    }
  }

  return { isClosed: false };
}

export function isVenueCurrentlyClosed(settings: VenueSettings): {
  isClosed: boolean;
  status: ServiceStatus;
  title: string;
  message: string;
  reopeningDate?: string;
  startDate?: string;
  endDate?: string;
} {
  if (!settings) {
    return { isClosed: false, status: 'open', title: 'Abierto', message: '' };
  }

  const todayStr = new Date().toISOString().split('T')[0];

  // If status is open, check if today is marked as a specific holiday
  if (settings.serviceStatus === 'open') {
    if (Array.isArray(settings.holidayDates)) {
      const hol = settings.holidayDates.find((h) => h.date === todayStr && h.allDayClosed);
      if (hol) {
        return {
          isClosed: true,
          status: 'holiday',
          title: `Cerrado por Festivo: ${hol.label}`,
          message: `Hoy permaneceremos cerrados con motivo de la festividad de ${hol.label}. ¡Te esperamos en nuestro próximo servicio habitual!`,
        };
      }
    }
    // Check if today matches a weekly closed day
    if (Array.isArray(settings.weeklyClosedDays) && settings.weeklyClosedDays.length > 0) {
      const dayOfWeek = new Date().getDay();
      if (settings.weeklyClosedDays.includes(dayOfWeek)) {
        const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        return {
          isClosed: true,
          status: 'special_closed',
          title: `Cerrado: Descanso semanal (${dayNames[dayOfWeek]})`,
          message: `Hoy es nuestro día de descanso semanal. Mañana volvemos con nuestro servicio habitual.`,
        };
      }
    }

    return {
      isClosed: false,
      status: 'open',
      title: 'Abierto',
      message: '',
    };
  }

  // If status is vacation, holiday, or special_closed
  return {
    isClosed: true,
    status: settings.serviceStatus,
    title:
      settings.closureTitle ||
      (settings.serviceStatus === 'vacation'
        ? 'Cerrado por Vacaciones'
        : settings.serviceStatus === 'holiday'
        ? 'Cerrado por Festivo'
        : 'Cierre Temporal'),
    message:
      settings.closureMessage ||
      'El restaurante permanecerá cerrado. Disculpen las molestias y gracias por su comprensión.',
    reopeningDate: settings.reopeningDate,
    startDate: settings.closureStartDate,
    endDate: settings.closureEndDate,
  };
}

export function saveVenueSettings(settings: VenueSettings): void {
  try {
    localStorage.setItem(VENUE_SETTINGS_KEY, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('gaudi:venue_settings_updated', { detail: settings }));
  } catch (e) {
    console.error('Error saving venue settings:', e);
  }
}

export function replaceEmailVariables(template: string, res?: Partial<Reservation>): string {
  if (!template) return '';
  const zoneLabel = res?.zone === 'salon' ? 'Salón Principal' : 'Terraza Exterior';
  const name = res?.name || 'María Gómez';
  const code = res?.code || 'GAUDI-9482';
  const date = res?.date || '2026-09-12';
  const time = res?.time || '14:30';
  const guests = res?.guests ? `${res.guests} ${res.guests === 1 ? 'persona' : 'personas'}` : '4 personas';
  const phoneClient = res?.phone || '612 34 56 78';

  return template
    .replace(/{nombre}/g, name)
    .replace(/{codigo}/g, code)
    .replace(/{fecha}/g, date)
    .replace(/{hora}/g, time)
    .replace(/{personas}/g, guests)
    .replace(/{zona}/g, zoneLabel)
    .replace(/{telefono_cliente}/g, phoneClient)
    .replace(/{telefono_local}/g, '931 45 90 19')
    .replace(/{direccion_local}/g, 'Carrer Germans Thos i Codina, 20, 08301 Mataró');
}
