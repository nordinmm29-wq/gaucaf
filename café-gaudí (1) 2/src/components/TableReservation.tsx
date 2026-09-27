import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  Sparkles,
  X,
  ChevronRight,
  Download,
  Share2,
  Eye,
  Loader2,
  ExternalLink,
  Send,
  RefreshCw,
  Palmtree,
  PartyPopper,
  CalendarX,
  Ban,
  Info,
} from 'lucide-react';
import { Reservation, ConfirmationEmailConfig, VenueSettings } from '../types';
import { SOCIAL_LINKS } from '../data/socialData';
import {
  getStoredEmailConfig,
  replaceEmailVariables,
  getStoredReservations,
  saveReservations,
  getStoredSmtpSettings,
  getStoredVenueSettings,
  isVenueClosedOnDate,
  isVenueCurrentlyClosed,
} from '../data/adminStore';
import { EmailPreviewCard } from './EmailPreviewCard';
import { sendReservationEmail, generateMailtoLink, SendEmailResult } from '../data/emailService';
import { useLanguage } from '../i18n/LanguageContext';
import { ScrollReveal } from './ScrollReveal';

const TIME_SLOTS = {
  brunch: ['09:30', '10:00', '10:30', '11:15', '11:45', '12:15'],
  almuerzo: ['13:00', '13:30', '14:00', '14:30', '15:00'],
  tardeo: ['17:30', '18:15', '19:00', '19:45'],
  cena: ['20:30', '21:00', '21:30', '22:00'],
};

export const TableReservation: React.FC = () => {
  const { dict } = useLanguage();
  const [reservations, setReservations] = useState<Reservation[]>(getStoredReservations);
  const [emailConfig, setEmailConfig] = useState<ConfirmationEmailConfig>(getStoredEmailConfig);
  const [venueSettings, setVenueSettings] = useState<VenueSettings>(getStoredVenueSettings);
  const [showEmailModal, setShowEmailModal] = useState(false);

  // Listen to email configuration, reservations, and venue settings updates from Admin panel
  useEffect(() => {
    const handleEmailConfigUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<ConfirmationEmailConfig>;
      if (customEvent.detail) {
        setEmailConfig(customEvent.detail);
      } else {
        setEmailConfig(getStoredEmailConfig());
      }
    };

    const handleReservationsUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<Reservation[]>;
      if (customEvent.detail) {
        setReservations(customEvent.detail);
      } else {
        setReservations(getStoredReservations());
      }
    };

    const handleVenueSettingsUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<VenueSettings>;
      if (customEvent.detail) {
        setVenueSettings(customEvent.detail);
      } else {
        setVenueSettings(getStoredVenueSettings());
      }
    };

    window.addEventListener('gaudi:email_config_updated', handleEmailConfigUpdate);
    window.addEventListener('gaudi:reservations_updated', handleReservationsUpdate);
    window.addEventListener('gaudi:venue_settings_updated', handleVenueSettingsUpdate);
    return () => {
      window.removeEventListener('gaudi:email_config_updated', handleEmailConfigUpdate);
      window.removeEventListener('gaudi:reservations_updated', handleReservationsUpdate);
      window.removeEventListener('gaudi:venue_settings_updated', handleVenueSettingsUpdate);
    };
  }, []);

  // Form State
  const [date, setDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [serviceCategory, setServiceCategory] = useState<'almuerzo' | 'cena' | 'brunch' | 'tardeo'>('almuerzo');
  const [selectedTime, setSelectedTime] = useState<string>('14:00');
  const [guests, setGuests] = useState<number>(2);
  const [zone, setZone] = useState<'terraza' | 'salon'>('terraza');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [submittedReservation, setSubmittedReservation] = useState<Reservation | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Email delivery state
  const [emailSendStatus, setEmailSendStatus] = useState<'idle' | 'sending' | 'sent' | 'warning' | 'error'>('idle');
  const [emailSendResult, setEmailSendResult] = useState<SendEmailResult | null>(null);
  const [isResending, setIsResending] = useState(false);

  // Date helpers
  const todayStr = new Date().toISOString().split('T')[0];

  // Check if restaurant is closed on the selected date (vacation, holiday, or rest day)
  const dateClosure = React.useMemo(() => {
    return isVenueClosedOnDate(date, venueSettings);
  }, [date, venueSettings]);

  // Check if restaurant is currently closed (right now)
  const currentVenueStatus = React.useMemo(() => {
    return isVenueCurrentlyClosed(venueSettings);
  }, [venueSettings]);

  // Sunday & Monday close early at 16:00h; Tuesday to Saturday close at 23:00h
  const isEarlyCloseDay = React.useMemo(() => {
    if (!date) return false;
    if (dateClosure.isClosed) return false;
    const d = new Date(date + 'T12:00:00');
    const day = d.getDay();
    return day === 0 || day === 1; // 0 = Domingo, 1 = Lunes
  }, [date, dateClosure.isClosed]);

  // Automatically adjust service if Sunday or Monday is picked
  useEffect(() => {
    if (isEarlyCloseDay && (serviceCategory === 'cena' || serviceCategory === 'tardeo')) {
      setServiceCategory('almuerzo');
      setSelectedTime('14:00');
    }
  }, [isEarlyCloseDay, serviceCategory]);

  // Set quick date helpers
  const handleQuickDate = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    setDate(d.toISOString().split('T')[0]);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (dateClosure.isClosed) {
      setErrorMessage(
        `El restaurante permanecerá cerrado en la fecha seleccionada (${dateClosure.reason}). ${
          dateClosure.reopeningDate ? `Reapertura prevista: ${dateClosure.reopeningDate}.` : ''
        } Por favor, elige otra fecha en el calendario.`
      );
      return;
    }

    if (!name.trim()) {
      setErrorMessage('Por favor, indica tu nombre completo.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setErrorMessage('Por favor, introduce un número de teléfono de contacto válido.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Por favor, introduce un correo electrónico válido.');
      return;
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newRes: Reservation = {
      id: `res-${Date.now()}`,
      code: `GAUDI-${randomSuffix}`,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      date,
      time: selectedTime,
      guests,
      zone,
      specialRequests: specialRequests.trim() || undefined,
      createdAt: new Date().toISOString(),
      status: 'confirmada',
    };

    const updated = [newRes, ...reservations];
    setReservations(updated);
    saveReservations(updated);
    setSubmittedReservation(newRes);

    // Trigger real email delivery via backend API
    setEmailSendStatus('sending');
    setEmailSendResult(null);

    try {
      const res = await sendReservationEmail(newRes, emailConfig, getStoredSmtpSettings());
      setEmailSendResult(res);
      if (res.success && !res.isPendingSetup && !res.isSimulated && !res.isTestMode) {
        setEmailSendStatus('sent');
      } else {
        setEmailSendStatus('warning');
      }
    } catch (err: any) {
      setEmailSendResult({ success: false, error: err.message || 'Error de conexión' });
      setEmailSendStatus('error');
    }
  };

  const handleResendEmail = async (res: Reservation) => {
    setIsResending(true);
    setEmailSendStatus('sending');
    try {
      const result = await sendReservationEmail(res, emailConfig, getStoredSmtpSettings());
      setEmailSendResult(result);
      if (result.success && !result.isPendingSetup && !result.isSimulated && !result.isTestMode) {
        setEmailSendStatus('sent');
      } else {
        setEmailSendStatus('warning');
      }
    } catch (err: any) {
      setEmailSendResult({ success: false, error: err.message });
      setEmailSendStatus('error');
    } finally {
      setIsResending(false);
    }
  };

  // Google calendar link generator
  const getGoogleCalendarUrl = (res: Reservation) => {
    const title = encodeURIComponent(`Reserva en Café Gaudí (${res.guests} personas)`);
    const details = encodeURIComponent(
      `Reserva confirmada #${res.code}\nMesa en: ${res.zone.toUpperCase()}\nNombre: ${res.name}\nTeléfono del local: ${SOCIAL_LINKS.phone}\nDirección: Carrer Germans Thos i Codina, 20, Mataró`
    );
    const location = encodeURIComponent('Carrer Germans Thos i Codina, 20, 08302 Mataró, Barcelona');
    
    // Approximate start/end time
    const startIso = `${res.date.replace(/-/g, '')}T${res.time.replace(':', '')}00`;
    const [h, m] = res.time.split(':').map(Number);
    const endH = String(h + 2).padStart(2, '0');
    const endIso = `${res.date.replace(/-/g, '')}T${endH}${String(m).padStart(2, '0')}00`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
  };

  return (
    <section id="reservas" className="py-20 sm:py-28 bg-[#f5f5f0] relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal distance="sm" duration={700}>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-sans font-semibold tracking-widest text-[#5a5a40] uppercase block mb-2">
              {dict.reservation.tag}
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#3d3d33] tracking-tight mb-4">
              {dict.reservation.title}
            </h2>
            <p className="text-[#8a8a7a] text-sm sm:text-base font-light">
              {dict.reservation.subtitle}
            </p>
          </div>
        </ScrollReveal>

        {/* Booking Form or Immediate Confirmation */}
        <ScrollReveal distance="md" duration={800} delay={150}>
          <div>
            {submittedReservation ? (
              /* Success Confirmation Card */
              <div className="bg-white rounded-[32px] sm:rounded-[40px] p-8 sm:p-12 border border-[#5a5a40]/15 shadow-sm max-w-2xl mx-auto text-center animate-scale-up">
                <div className="w-16 h-16 rounded-full bg-[#5a5a40]/10 text-[#5a5a40] flex items-center justify-center mx-auto mb-5 shadow-xs">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <span className="inline-block px-3.5 py-1 rounded-full bg-[#5a5a40]/10 border border-[#5a5a40]/20 text-[#5a5a40] text-xs font-sans uppercase tracking-wider mb-2 font-medium">
                  Reserva Confirmada
                </span>

                <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#3d3d33] mb-2">
                  ¡Te esperamos, {submittedReservation.name}!
                </h3>
                <p className="text-sm text-[#8a8a7a] mb-5 font-light">
                  Hemos registrado tu reserva con éxito en nuestro sistema de mesas.
                </p>

                {/* Email Delivery Live Status Banner */}
                <div className="bg-[#f5f5f0] border border-[#5a5a40]/20 rounded-2xl p-4 mb-6 text-left font-sans">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      {emailSendStatus === 'sending' ? (
                        <Loader2 className="w-5 h-5 text-amber-600 animate-spin shrink-0 mt-0.5" />
                      ) : emailSendStatus === 'sent' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <Mail className="w-5 h-5 text-[#5a5a40] shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="text-xs font-semibold text-[#3d3d33] flex items-center gap-1.5">
                          {emailSendStatus === 'sending' && 'Enviando email de confirmación...'}
                          {emailSendStatus === 'sent' && '✓ Email de confirmación entregado con éxito'}
                          {emailSendStatus === 'warning' && (emailSendResult?.isPendingSetup ? 'Reserva registrada en el sistema' : 'Email de reserva procesado')}
                          {emailSendStatus === 'error' && 'Reserva confirmada en sala (fallo en servidor de correo)'}
                          {emailSendStatus === 'idle' && 'Estado de correo'}
                        </div>
                        <p className="text-xs text-[#737365] mt-0.5">
                          Destinatario: <strong className="text-[#3d3d33]">{submittedReservation.email}</strong>
                        </p>
                        {emailSendResult?.provider && (
                          <span className="inline-block text-[11px] text-[#8a8a7a] mt-0.5">
                            Canal de salida: {emailSendResult.provider}
                          </span>
                        )}
                        {emailSendResult?.message && (
                          <p className="text-[11px] text-[#737365] mt-1 bg-white/70 p-2 rounded-lg border border-[#5a5a40]/10 leading-relaxed">
                            {emailSendResult.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-end gap-1.5 shrink-0">
                      <button
                        type="button"
                        disabled={isResending}
                        onClick={() => handleResendEmail(submittedReservation)}
                        className="px-3 py-1.5 bg-white hover:bg-[#eaeae0] border border-[#5a5a40]/20 rounded-full text-[11px] font-semibold text-[#5a5a40] flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                        title="Reenviar el correo de confirmación"
                      >
                        <RefreshCw className={`w-3 h-3 ${isResending ? 'animate-spin' : ''}`} />
                        <span>{isResending ? 'Reenviando...' : 'Reenviar Email'}</span>
                      </button>

                      {emailSendResult?.previewUrl && (
                        <a
                          href={emailSendResult.previewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-900 rounded-full text-[11px] font-semibold flex items-center gap-1 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Ver en Bandeja Test</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Fallback direct mailto link */}
                  <div className="mt-3 pt-2.5 border-t border-[#5a5a40]/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#8a8a7a]">
                    <span>¿No lo ves en tu bandeja de entrada o spam?</span>
                    <a
                      href={generateMailtoLink(submittedReservation, emailConfig)}
                      className="text-[#5a5a40] hover:text-[#3d3d33] font-semibold underline flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      <span>Abrir y recibir en mi app de correo</span>
                    </a>
                  </div>
                </div>

                {/* Ticket Details Box */}
                <div className="bg-[#f5f5f0] rounded-[24px] p-6 border border-[#5a5a40]/15 text-left mb-6 space-y-3 font-sans">
                  <div className="flex items-center justify-between border-b border-[#5a5a40]/15 pb-3">
                    <span className="text-xs text-[#8a8a7a] uppercase font-semibold tracking-wider">Código de Reserva</span>
                    <span className="text-base font-mono font-bold text-[#5a5a40] bg-white px-3 py-1 rounded-full border border-[#5a5a40]/15">
                      #{submittedReservation.code}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1 text-sm">
                    <div>
                      <div className="text-[11px] text-[#8a8a7a]">Fecha & Hora:</div>
                      <div className="font-medium text-[#3d3d33]">
                        {submittedReservation.date} • {submittedReservation.time} h
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-[#8a8a7a]">Comensales:</div>
                      <div className="font-medium text-[#3d3d33]">
                        {submittedReservation.guests} {submittedReservation.guests === 1 ? 'persona' : 'personas'}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-[#8a8a7a]">Zona asignada:</div>
                      <div className="font-medium text-[#3d3d33] capitalize">
                        {submittedReservation.zone === 'terraza' ? '🌿 Terraza Exterior' : '🍷 Salón Principal'}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-[#8a8a7a]">Ubicación:</div>
                      <div className="font-medium text-[#3d3d33] text-xs">
                        Germans Thos i Codina, 20
                      </div>
                    </div>
                  </div>

                  {submittedReservation.specialRequests && (
                    <div className="pt-2 border-t border-[#5a5a40]/15 text-xs text-[#8a8a7a]">
                      <strong>Nota especial:</strong> {submittedReservation.specialRequests}
                    </div>
                  )}
                </div>

                {/* Quick actions: Add to calendar, WhatsApp share, & View Email */}
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center mb-6 font-sans">
                  <a
                    href={getGoogleCalendarUrl(submittedReservation)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-[#5a5a40] hover:bg-[#4a4a30] text-white text-xs uppercase tracking-wider font-semibold rounded-full flex items-center justify-center gap-2 transition-colors shadow-xs"
                  >
                    <Calendar className="w-4 h-4 text-white/80" />
                    <span>Añadir a Google Calendar</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setShowEmailModal(true)}
                    className="px-6 py-3 bg-white hover:bg-[#f5f5f0] text-[#5a5a40] border border-[#5a5a40]/30 text-xs uppercase tracking-wider font-semibold rounded-full flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
                  >
                    <Mail className="w-4 h-4 text-[#5a5a40]" />
                    <span>Ver Email Generado</span>
                  </button>

                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `¡He reservado mesa en Café Gaudí (Mataró)!\nFecha: ${submittedReservation.date} a las ${submittedReservation.time}h para ${submittedReservation.guests} personas. Código: #${submittedReservation.code}\nDirección: Carrer Germans Thos i Codina, 20`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-[#e2e2d8] hover:bg-[#dcdcd0] text-[#3d3d33] text-xs uppercase tracking-wider font-semibold rounded-full flex items-center justify-center gap-2 transition-colors"
                  >
                    <Share2 className="w-4 h-4 text-[#5a5a40]" />
                    <span>Compartir por WhatsApp</span>
                  </a>
                </div>

                <button
                  onClick={() => {
                    setSubmittedReservation(null);
                    setName('');
                    setPhone('');
                    setEmail('');
                    setSpecialRequests('');
                  }}
                  className="text-xs font-sans font-semibold text-[#8a8a7a] hover:text-[#3d3d33] underline tracking-wider uppercase"
                >
                  Hacer otra reserva
                </button>
              </div>
            ) : (
              /* Booking Form Container */
              <form
                id="booking-form"
                onSubmit={handleBookingSubmit}
                className="bg-white rounded-[32px] sm:rounded-[40px] p-6 sm:p-12 border border-[#5a5a40]/15 shadow-sm max-w-3xl mx-auto"
              >
                {/* Master Status Alert Banner (Vacation / Holiday / Special Closure) */}
                {currentVenueStatus.isClosed && (
                  <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100 border-2 border-amber-300 shadow-xs text-amber-950 font-sans animate-fade-in text-left">
                    <div className="flex items-start gap-3.5">
                      <span className="text-3xl shrink-0 mt-0.5">
                        {currentVenueStatus.status === 'vacation' ? '🏖️' : currentVenueStatus.status === 'holiday' ? '🎉' : '⏸️'}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 border border-amber-300">
                            {currentVenueStatus.status === 'vacation'
                              ? 'Aviso de Vacaciones'
                              : currentVenueStatus.status === 'holiday'
                              ? 'Aviso de Festivo'
                              : 'Cierre Temporal'}
                          </span>
                          {currentVenueStatus.reopeningDate && (
                            <span className="text-xs text-amber-900 font-semibold">
                              • Reapertura: {currentVenueStatus.reopeningDate}
                            </span>
                          )}
                        </div>
                        <h4 className="font-serif text-base font-semibold text-amber-950 mt-1">
                          {currentVenueStatus.title}
                        </h4>
                        <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                          {currentVenueStatus.message}
                        </p>
                        {venueSettings.allowFutureBookingsDuringClosure ? (
                          <p className="text-[11px] text-emerald-800 font-medium mt-2 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl inline-block">
                            ✓ Puedes reservar con antelación para fechas posteriores a nuestra reapertura.
                          </p>
                        ) : (
                          <p className="text-[11px] text-amber-900 font-medium mt-2 bg-amber-200/60 px-3 py-1 rounded-xl inline-block">
                            El sistema de reservas permanecerá en pausa durante este período.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {errorMessage && (
                  <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Step 1: Comensales y Fecha */}
                <div className="space-y-7 font-sans">
                  <div>
                    <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#5a5a40] mb-3">
                      1. Número de personas
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setGuests(num)}
                          className={`w-12 h-12 rounded-full text-sm font-semibold transition-all cursor-pointer flex items-center justify-center ${
                            guests === num
                              ? 'bg-[#5a5a40] text-white shadow-sm scale-105'
                              : 'bg-[#f5f5f0] text-[#3d3d33] border border-[#5a5a40]/15 hover:bg-[#e2e2d8]'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                      <div className="flex items-center text-xs text-[#8a8a7a] pl-2">
                        <span>Para grupos mayores de 10 personas,</span>
                        <a href={`tel:${SOCIAL_LINKS.phoneRaw || SOCIAL_LINKS.phone.replace(/\s+/g, '')}`} className="text-[#5a5a40] font-semibold ml-1 underline">
                          llámanos al {SOCIAL_LINKS.phone}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Date selection */}
                  <div>
                    <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#5a5a40] mb-2">
                      2. Selecciona el día
                    </label>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <button
                        type="button"
                        onClick={() => handleQuickDate(0)}
                        className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-semibold border transition-all cursor-pointer ${
                          date === todayStr
                            ? 'bg-[#5a5a40] text-white border-[#5a5a40]'
                            : 'bg-[#f5f5f0] text-[#3d3d33] border-[#5a5a40]/15 hover:bg-[#e2e2d8]'
                        }`}
                      >
                        {dict.reservation.quickToday}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickDate(1)}
                        className="px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-semibold bg-[#f5f5f0] text-[#3d3d33] border border-[#5a5a40]/15 hover:bg-[#e2e2d8] transition-all cursor-pointer"
                      >
                        {dict.reservation.quickTomorrow}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickDate(2)}
                        className="px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-semibold bg-[#f5f5f0] text-[#3d3d33] border border-[#5a5a40]/15 hover:bg-[#e2e2d8] transition-all cursor-pointer"
                      >
                        {dict.reservation.quickWeekend}
                      </button>

                      <div className="relative flex-1 min-w-[180px]">
                        <input
                          type="date"
                          min={todayStr}
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full text-xs font-semibold py-2.5 px-4 bg-[#f5f5f0] border border-[#5a5a40]/20 rounded-full text-[#3d3d33] focus:outline-none focus:border-[#5a5a40]"
                        />
                      </div>
                    </div>

                    {/* Specific Date Closure Alert */}
                    {dateClosure.isClosed && (
                      <div className="mt-3 p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 text-xs font-sans animate-fade-in text-left">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl shrink-0">🏖️</span>
                          <div>
                            <h4 className="font-semibold text-sm text-amber-950">
                              Establecimiento cerrado en esta fecha ({dateClosure.reason})
                            </h4>
                            <p className="text-xs text-amber-900/90 mt-1 leading-relaxed">
                              No se admiten reservas para el día seleccionado debido a vacaciones o festividad del local.
                              {dateClosure.reopeningDate && (
                                <span className="block mt-1 font-semibold text-amber-950">
                                  📅 Fecha prevista de reapertura: {dateClosure.reopeningDate}.
                                </span>
                              )}
                            </p>
                            <p className="text-[11px] text-amber-800 mt-1.5 font-medium">
                              Por favor, selecciona otra fecha en el calendario superior.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Step 2: Service & Time Slot */}
                  <div>
                    <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#5a5a40] mb-2 text-left">
                      3. {dict.reservation.serviceLabel}
                    </label>

                    {/* Schedule banner for selected date */}
                    {dateClosure.isClosed ? (
                      <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 mb-3 text-left">
                        <Ban className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>
                          <strong>Día cerrado:</strong> {dateClosure.reason}. Sin turnos operativos para esta jornada.
                        </span>
                      </div>
                    ) : isEarlyCloseDay ? (
                      <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-[#5a5a40] mb-3 text-left">
                        <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>
                          <strong>Horario diurno especial (Dom/Lun):</strong> {venueSettings.scheduleSunMon || '08:30 a 16:00 h'}. {venueSettings.scheduleSunMonNote || 'Servicio de brunch y comida. Sin cenas.'}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-[#5a5a40]/5 border border-[#5a5a40]/10 text-xs text-[#737365] mb-3 text-left">
                        <Clock className="w-4 h-4 text-[#5a5a40] shrink-0" />
                        <span>
                          <strong>Horario habitual (Mar-Sáb):</strong> {venueSettings.scheduleTueSat || '08:30 a 23:00 h'}. {venueSettings.scheduleTueSatNote || 'Servicio continuo y cenas.'}
                        </span>
                      </div>
                    )}

                    {/* Shift tabs */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                      <button
                        type="button"
                        onClick={() => {
                          setServiceCategory('brunch');
                          setSelectedTime(TIME_SLOTS.brunch[0]);
                        }}
                        className={`p-2.5 rounded-full text-xs font-sans font-semibold border transition-all text-center cursor-pointer ${
                          serviceCategory === 'brunch'
                            ? 'bg-[#5a5a40] text-white border-[#5a5a40]'
                            : 'bg-[#f5f5f0] text-[#5a5a40] border-[#5a5a40]/15 hover:bg-[#e2e2d8]'
                        }`}
                      >
                        Café & Brunch
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setServiceCategory('almuerzo');
                          setSelectedTime(TIME_SLOTS.almuerzo[1]);
                        }}
                        className={`p-2.5 rounded-full text-xs font-sans font-semibold border transition-all text-center cursor-pointer ${
                          serviceCategory === 'almuerzo'
                            ? 'bg-[#5a5a40] text-white border-[#5a5a40]'
                            : 'bg-[#f5f5f0] text-[#5a5a40] border-[#5a5a40]/15 hover:bg-[#e2e2d8]'
                        }`}
                      >
                        Almuerzo / Comida
                      </button>
                      <button
                        type="button"
                        disabled={isEarlyCloseDay}
                        title={isEarlyCloseDay ? 'Cierre a las 16:00 h los domingos y lunes' : 'Tardeo & Vermut'}
                        onClick={() => {
                          if (!isEarlyCloseDay) {
                            setServiceCategory('tardeo');
                            setSelectedTime(TIME_SLOTS.tardeo[0]);
                          }
                        }}
                        className={`p-2.5 rounded-full text-xs font-sans font-semibold border transition-all text-center ${
                          isEarlyCloseDay
                            ? 'bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed opacity-50'
                            : serviceCategory === 'tardeo'
                            ? 'bg-[#5a5a40] text-white border-[#5a5a40] cursor-pointer'
                            : 'bg-[#f5f5f0] text-[#5a5a40] border-[#5a5a40]/15 hover:bg-[#e2e2d8] cursor-pointer'
                        }`}
                      >
                        Tardeo {isEarlyCloseDay ? '(Cerrado 16h)' : '& Vermut'}
                      </button>
                      <button
                        type="button"
                        disabled={isEarlyCloseDay}
                        title={isEarlyCloseDay ? 'Cierre a las 16:00 h los domingos y lunes' : 'Cena & Tapas'}
                        onClick={() => {
                          if (!isEarlyCloseDay) {
                            setServiceCategory('cena');
                            setSelectedTime(TIME_SLOTS.cena[1]);
                          }
                        }}
                        className={`p-2.5 rounded-full text-xs font-sans font-semibold border transition-all text-center ${
                          isEarlyCloseDay
                            ? 'bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed opacity-50'
                            : serviceCategory === 'cena'
                            ? 'bg-[#5a5a40] text-white border-[#5a5a40] cursor-pointer'
                            : 'bg-[#f5f5f0] text-[#5a5a40] border-[#5a5a40]/15 hover:bg-[#e2e2d8] cursor-pointer'
                        }`}
                      >
                        Cena {isEarlyCloseDay ? '(Cerrado 16h)' : '& Tapas'}
                      </button>
                    </div>

                    {/* Available hours pills */}
                    <div className="flex flex-wrap gap-2">
                      {TIME_SLOTS[serviceCategory].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setSelectedTime(t)}
                          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                            selectedTime === t
                              ? 'bg-[#5a5a40] text-white shadow-xs scale-105'
                              : 'bg-[#f5f5f0] text-[#3d3d33] border border-[#5a5a40]/15 hover:bg-[#e2e2d8]'
                          }`}
                        >
                          {t} h
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 3: Zone Selection (Barra Gastronómica removed per user directive) */}
                  <div>
                    <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#5a5a40] mb-2">
                      4. Preferencia de zona
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div
                        onClick={() => setZone('terraza')}
                        className={`p-5 rounded-[24px] border cursor-pointer transition-all ${
                          zone === 'terraza'
                            ? 'bg-[#f5f5f0] border-[#5a5a40] ring-1 ring-[#5a5a40]'
                            : 'bg-white border-[#5a5a40]/15 hover:bg-[#f5f5f0]/50'
                        }`}
                      >
                        <div className="font-semibold text-sm text-[#3d3d33] mb-1 flex items-center justify-between">
                          <span>🌿 Terraza Exterior</span>
                          {zone === 'terraza' && <CheckCircle2 className="w-4 h-4 text-[#5a5a40]" />}
                        </div>
                        <p className="text-xs text-[#8a8a7a] font-light">
                          Al aire libre en Germans Thos i Codina. Agradable ambiente y climatizada según temporada.
                        </p>
                      </div>

                      <div
                        onClick={() => setZone('salon')}
                        className={`p-5 rounded-[24px] border cursor-pointer transition-all ${
                          zone === 'salon'
                            ? 'bg-[#f5f5f0] border-[#5a5a40] ring-1 ring-[#5a5a40]'
                            : 'bg-white border-[#5a5a40]/15 hover:bg-[#f5f5f0]/50'
                        }`}
                      >
                        <div className="font-semibold text-sm text-[#3d3d33] mb-1 flex items-center justify-between">
                          <span>🍷 Salón Principal</span>
                          {zone === 'salon' && <CheckCircle2 className="w-4 h-4 text-[#5a5a40]" />}
                        </div>
                        <p className="text-xs text-[#8a8a7a] font-light">
                          Espacio interior elegante, iluminación cálida, excelente confort y ambiente climatizado.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Step 4: Contact Details */}
                  <div className="pt-4 border-t border-[#5a5a40]/15">
                    <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#5a5a40] mb-3">
                      5. Datos de contacto
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#5a5a40] mb-1">
                          Nombre y Apellidos *
                        </label>
                        <input
                          id="booking-name"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Ej. Laura Martínez"
                          className="w-full text-xs py-2.5 px-4 bg-[#f5f5f0] border border-[#5a5a40]/20 rounded-full text-[#3d3d33] focus:outline-none focus:border-[#5a5a40]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#5a5a40] mb-1">
                          Teléfono de contacto *
                        </label>
                        <input
                          id="booking-phone"
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Ej. 612 34 56 78"
                          className="w-full text-xs py-2.5 px-4 bg-[#f5f5f0] border border-[#5a5a40]/20 rounded-full text-[#3d3d33] focus:outline-none focus:border-[#5a5a40]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#5a5a40] mb-1">
                          Correo electrónico *
                        </label>
                        <input
                          id="booking-email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="tu@email.com"
                          className="w-full text-xs py-2.5 px-4 bg-[#f5f5f0] border border-[#5a5a40]/20 rounded-full text-[#3d3d33] focus:outline-none focus:border-[#5a5a40]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#5a5a40] mb-1">
                        Peticiones especiales, intolerancias o motivo de celebración (opcional)
                      </label>
                      <input
                        id="booking-notes"
                        type="text"
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        placeholder="Ej. Trona para bebé, aniversario, intolerancia a frutos secos..."
                        className="w-full text-xs py-2.5 px-4 bg-[#f5f5f0] border border-[#5a5a40]/20 rounded-full text-[#3d3d33] focus:outline-none focus:border-[#5a5a40]"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <div className="mt-8 pt-4 border-t border-[#5a5a40]/15 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
                  <div className="text-xs text-[#8a8a7a]">
                    Cancelación gratuita en cualquier momento desde esta web.
                  </div>

                  <button
                    id="booking-submit-btn"
                    type="submit"
                    disabled={dateClosure.isClosed}
                    className={`w-full sm:w-auto px-8 py-3.5 text-xs uppercase tracking-wider font-semibold rounded-full shadow-md transition-all duration-200 flex items-center justify-center gap-2 ${
                      dateClosure.isClosed
                        ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed shadow-none'
                        : 'bg-[#5a5a40] hover:bg-[#4a4a30] text-white transform hover:-translate-y-0.5 cursor-pointer'
                    }`}
                  >
                    {dateClosure.isClosed ? (
                      <>
                        <Ban className="w-4 h-4 text-neutral-500" />
                        <span>Local cerrado en la fecha seleccionada</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirmar Reserva Ahora</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </ScrollReveal>
      </div>

      {/* Email preview popup */}
      {showEmailModal && submittedReservation && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-neutral-300 my-auto text-left">
            <div className="bg-[#3d3d33] text-white px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <Mail className="w-4 h-4 text-amber-300" />
                <span className="font-medium">Correo Electrónico de Confirmación de Reserva</span>
              </div>
              <button
                onClick={() => setShowEmailModal(false)}
                className="text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[75vh] overflow-y-auto">
              <EmailPreviewCard config={emailConfig} reservation={submittedReservation} isModal={true} />
            </div>
            <div className="bg-[#f5f5f0] px-6 py-3 border-t border-neutral-200 flex items-center justify-between text-xs text-[#737365]">
              <span>Enviado a: <strong>{submittedReservation.email}</strong></span>
              <button
                onClick={() => setShowEmailModal(false)}
                className="px-4 py-1.5 bg-[#5a5a40] hover:bg-[#4a4a30] text-white rounded-full font-medium cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
