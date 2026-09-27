import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Instagram, Clock, ShieldCheck, Heart, Settings } from 'lucide-react';
import { SOCIAL_LINKS } from '../data/socialData';
import { useLanguage } from '../i18n/LanguageContext';
import { VenueSettings } from '../types';
import { getStoredVenueSettings, isVenueCurrentlyClosed } from '../data/adminStore';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const { dict } = useLanguage();
  const [venueSettings, setVenueSettings] = useState<VenueSettings>(getStoredVenueSettings);

  useEffect(() => {
    const handleVenueSettingsUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<VenueSettings>;
      if (customEvent.detail) {
        setVenueSettings(customEvent.detail);
      } else {
        setVenueSettings(getStoredVenueSettings());
      }
    };
    window.addEventListener('gaudi:venue_settings_updated', handleVenueSettingsUpdate);
    return () => window.removeEventListener('gaudi:venue_settings_updated', handleVenueSettingsUpdate);
  }, []);

  const currentVenueStatus = React.useMemo(() => {
    return isVenueCurrentlyClosed(venueSettings);
  }, [venueSettings]);

  return (
    <footer className="bg-[#2d2e26] text-[#dcdcd0] pt-16 pb-12 border-t border-[#5a5a40]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#5a5a40]/20">
          {/* Col 1: Brand & Philosophy */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#5a5a40] flex items-center justify-center text-white font-bold shrink-0">
                <span className="font-serif text-lg font-light">G</span>
              </div>
              <div>
                <span className="text-xl font-serif font-light tracking-tight text-white block">
                  CAFÉ GAUDÍ
                </span>
                <span className="text-[10px] tracking-widest uppercase text-[#a0a090] font-sans font-medium block">
                  Cafetería • Tapas • Mataró
                </span>
              </div>
            </div>
            <p className="text-xs text-[#a0a090] leading-relaxed font-light font-sans">
              {dict.footer.description}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#5a5a40] text-[#dcdcd0] hover:text-white flex items-center justify-center transition-colors border border-white/10"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={SOCIAL_LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#5a5a40] text-[#dcdcd0] hover:text-white flex items-center justify-center transition-colors border border-white/10"
                aria-label="WhatsApp"
              >
                <span className="text-xs font-bold font-sans">WA</span>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="font-sans">
            <h4 className="font-serif text-base font-light text-white uppercase tracking-wider mb-4">
              {dict.footer.navigation}
            </h4>
            <ul className="space-y-2 text-xs text-[#a0a090]">
              <li>
                <a href="#menu" className="hover:text-white transition-colors">
                  {dict.nav.menu}
                </a>
              </li>
              <li>
                <a href="#reservas" className="hover:text-white transition-colors">
                  {dict.nav.reservations}
                </a>
              </li>
              <li>
                <a href="#galeria" className="hover:text-white transition-colors">
                  {dict.nav.gallery}
                </a>
              </li>
              <li>
                <a href="#resenas" className="hover:text-white transition-colors">
                  {dict.nav.reviews}
                </a>
              </li>
              <li>
                <a href="#ubicacion" className="hover:text-white transition-colors">
                  {dict.nav.location}
                </a>
              </li>
              {onOpenAdmin && (
                <li className="pt-2 border-t border-white/10">
                  <button
                    onClick={onOpenAdmin}
                    className="flex items-center gap-1.5 text-xs text-amber-300/80 hover:text-amber-300 transition-colors cursor-pointer font-medium"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>{dict.footer.adminPanel}</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Col 3: Contact & Address */}
          <div className="font-sans">
            <h4 className="font-serif text-base font-light text-white uppercase tracking-wider mb-4">
              {dict.footer.contactTitle}
            </h4>
            <ul className="space-y-3 text-xs text-[#a0a090]">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#8a8a7a] shrink-0 mt-0.5" />
                <span>Carrer Germans Thos i Codina, 20<br />08301 Mataró, Barcelona</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#8a8a7a] shrink-0 mt-0.5" />
                <div>
                  <span className="text-white block font-medium">{dict.footer.schedule}:</span>
                  <span>Mar-Sáb: {venueSettings.scheduleTueSat || '08:30 - 23:00 h'}</span><br />
                  <span className="text-amber-300/90 font-medium">Dom-Lun: {venueSettings.scheduleSunMon || '08:30 - 16:00 h'}</span>
                  {currentVenueStatus.isClosed && (
                    <div className="mt-2 p-2 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-200 text-[11px] leading-tight">
                      <span className="font-semibold block text-amber-100">
                        {currentVenueStatus.status === 'vacation' ? '🏖️ Vacaciones' : currentVenueStatus.status === 'holiday' ? '🎉 Festivo' : '⏸️ Cierre Temporal'}
                      </span>
                      <span>{currentVenueStatus.message}</span>
                      {currentVenueStatus.reopeningDate && (
                        <span className="block mt-0.5 font-medium text-amber-300">
                          Reapertura: {currentVenueStatus.reopeningDate}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#8a8a7a] shrink-0" />
                <a href={`tel:${SOCIAL_LINKS.phone.replace(/\s+/g, '')}`} className="hover:text-white transition-colors font-medium text-white">
                  {SOCIAL_LINKS.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#8a8a7a] shrink-0" />
                <a href={`mailto:${SOCIAL_LINKS.email}`} className="hover:text-white transition-colors">
                  {SOCIAL_LINKS.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Quality & Compliance */}
          <div className="font-sans">
            <h4 className="font-serif text-base font-light text-white uppercase tracking-wider mb-4">
              {dict.footer.qualityTitle}
            </h4>
            <p className="text-xs text-[#a0a090] leading-relaxed mb-3 font-light">
              {dict.footer.qualityDesc}
            </p>
            <div className="p-4 rounded-[20px] bg-white/5 border border-[#5a5a40]/30 text-[11px] text-[#dcdcd0] flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#8a8a7a] shrink-0" />
              <span>{dict.footer.qualityBadge}</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8a8a7a] gap-4 font-sans">
          <p>
            &copy; {new Date().getFullYear()} Café Gaudí. {dict.footer.rights}
          </p>
          <p className="flex items-center gap-1 text-[#8a8a7a]">
            <span>{dict.footer.craftedWith}</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
