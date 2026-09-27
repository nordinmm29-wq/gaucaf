export type DietaryTag = 'vegetariano' | 'vegano' | 'sin-gluten' | 'estrella' | 'temporada' | 'novedad';

export type MenuCategoryType =
  | 'ofertas'
  | 'desayunos'
  | 'bocadillos'
  | 'focaccias'
  | 'combos'
  | 'tapas'
  | 'burgers'
  | 'postres'
  | 'vinos';

export interface WineDetails {
  glassPrice: number;
  bottlePrice: number;
  nose?: string;
  mouth?: string;
  pairing?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  priceSecondary?: string;
  portionNote?: string;
  category: MenuCategoryType;
  image: string;
  allergens?: string[];
  tags?: DietaryTag[];
  popular?: boolean;
  wineDetails?: WineDetails;
}

export type ReservationStatus = 'confirmada' | 'sentada' | 'completada' | 'cancelada' | 'pendiente';

export interface Reservation {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  zone: 'terraza' | 'salon';
  specialRequests?: string;
  createdAt: string;
  status: ReservationStatus;
  archived?: boolean;
  archivedAt?: string;
  archivedReason?: string;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  category: 'todos' | 'gastronomia' | 'cafe' | 'cocteles' | 'ambiente' | 'hamburguesas';
  imageUrl: string;
  description?: string;
  isGooglePhoto?: boolean;
  googleRating?: number;
  authorName?: string;
}

export interface SocialPost {
  id: string;
  imageUrl: string;
  caption: string;
  likes: number;
  comments: number;
  date: string;
  link: string;
}

export interface CustomerReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  platform: 'Google' | 'TripAdvisor' | 'Cliente Verificado';
  avatar?: string;
  isLocalGuide?: boolean;
  reviewCount?: number;
  dishesMentioned?: string[];
  likesCount?: number;
  category?: 'coffee' | 'burgers' | 'tapas' | 'brunch' | 'desserts' | 'service';
  visitType?: string;
  responseFromOwner?: {
    date: string;
    text: string;
  };
}

export interface ConfirmationEmailConfig {
  senderName: string;
  senderEmail: string;
  subject: string;
  headline: string;
  greetingText: string;
  policyNotes: string;
  footerNotes: string;
  buttonText: string;
  accentNote?: string;
}

export type ServiceStatus = 'open' | 'vacation' | 'holiday' | 'special_closed';

export interface HolidayDate {
  id: string;
  date: string; // YYYY-MM-DD
  label: string;
  allDayClosed: boolean;
}

export interface VenueSettings {
  businessName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  terraceCapacity: number;
  salonCapacity: number;
  noticeBanner: string;
  autoConfirmOnline: boolean;
  instagramUrl?: string;
  tiktokUrl?: string;
  tripAdvisorUrl?: string;
  cifOrTaxId?: string;
  // SEO & Posicionamiento en Buscadores
  metaDescription?: string;
  metaKeywords?: string;
  // Service status & holiday / vacation scheduling
  serviceStatus: ServiceStatus;
  closureTitle?: string;
  closureMessage?: string;
  closureStartDate?: string;
  closureEndDate?: string;
  reopeningDate?: string;
  allowFutureBookingsDuringClosure?: boolean;
  // Editable regular hours
  scheduleTueSat: string;
  scheduleTueSatNote?: string;
  scheduleSunMon: string;
  scheduleSunMonNote?: string;
  // Weekly closed days (0 = Sunday, 1 = Monday, etc.)
  weeklyClosedDays?: number[];
  // Specific closed holiday dates list
  holidayDates?: HolidayDate[];
}

export interface SmtpSettings {
  host: string;
  port: number;
  user: string;
  pass: string;
  secure: boolean;
  fromName: string;
  fromEmail: string;
  resendApiKey?: string;
}

export interface EmailDeliveryLog {
  id: string;
  timestamp: string;
  recipient: string;
  subject: string;
  reservationCode?: string;
  status: 'enviado' | 'fallido' | 'simulado' | 'mailto';
  provider: string;
  messageId?: string;
  error?: string;
  previewUrl?: string;
}

