import React, { useEffect, useRef, useState } from 'react';
import {
  MapPin,
  Navigation,
  Compass,
  ExternalLink,
  Copy,
  Check,
  Train,
  Car,
  Bus,
  Phone,
  Clock,
  Layers,
  Satellite,
  Star,
  Eye,
} from 'lucide-react';
import { SOCIAL_LINKS } from '../data/socialData';
import { useLanguage } from '../i18n/LanguageContext';
import { VenueSettings } from '../types';
import { getStoredVenueSettings, isVenueCurrentlyClosed } from '../data/adminStore';
import L from 'leaflet';
import { ScrollReveal } from './ScrollReveal';

export const InteractiveMap: React.FC = () => {
  const { dict, language } = useLanguage();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [copied, setCopied] = useState(false);
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
  
  // View modes: 'google-satelite' (Google satellite imagery), 'google-map' (official Google road view), 'estilizado' (custom Leaflet)
  const [activeView, setActiveView] = useState<'google-satelite' | 'google-map' | 'estilizado'>('google-satelite');

  const { lat, lng } = SOCIAL_LINKS.coords; // 41.53215, 2.44102

  // Initialize Leaflet map only when 'estilizado' is active
  useEffect(() => {
    if (activeView !== 'estilizado' || !mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [lat, lng],
      zoom: 17,
      scrollWheelZoom: false,
    });

    mapInstanceRef.current = map;

    // CartoDB Voyager warm tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    }).addTo(map);

    // Custom Gaudí Pin
    const customIcon = L.divIcon({
      className: 'custom-pin-container',
      html: `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; transform: translate(-50%, -100%);">
          <div style="width: 44px; height: 44px; background: #5a5a40; border: 3px solid white; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); box-shadow: 0 4px 14px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
            <div style="transform: rotate(45deg); font-weight: 700; color: white; font-size: 15px; font-family: serif;">G</div>
          </div>
          <div style="position: absolute; bottom: -8px; width: 14px; height: 6px; background: rgba(0,0,0,0.25); border-radius: 50%; filter: blur(1px);"></div>
        </div>
      `,
      iconSize: [0, 0],
      iconAnchor: [0, 0],
      popupAnchor: [0, -45],
    });

    const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

    const popupCategoryDesc =
      language === 'cat'
        ? 'Esmorzars • Tapes • Cerveseria • Plats Especials'
        : language === 'eng'
        ? 'Breakfast • Tapas • Bar & Specialties'
        : 'Desayunos • Tapas • Cervecería • Platos Especiales';

    const popupOpenToday =
      language === 'cat'
        ? '● Obert avui'
        : language === 'eng'
        ? '● Open today'
        : '● Abierto hoy';

    const popupViewInMaps =
      language === 'cat'
        ? 'Veure a Maps &rarr;'
        : language === 'eng'
        ? 'View in Maps &rarr;'
        : 'Ver en Maps &rarr;';

    const popupContent = `
      <div style="width: 260px; font-family: sans-serif; padding: 4px;">
        <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80" style="width: 100%; height: 110px; object-fit: cover; border-radius: 12px 12px 0 0;" alt="Cafetería Gaudí" />
        <div style="padding: 10px;">
          <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 4px;">
            <span style="color: #f59e0b; font-size: 12px;">★★★★★</span>
            <span style="font-size: 11px; font-weight: 600; color: #5a5a40;">4.8 (Google Maps)</span>
          </div>
          <h4 style="font-weight: 600; font-size: 14px; color: #3d3d33; margin: 0 0 4px 0; font-family: serif;">Cafetería Gaudí</h4>
          <p style="font-size: 11px; color: #737365; margin: 0 0 6px 0; line-height: 1.3;">${popupCategoryDesc}</p>
          <p style="font-size: 11px; color: #8a8a7a; margin: 0 0 8px 0; line-height: 1.3;">C/ Germans Thos i Codina / C/ Cooperativa<br>Mataró, Barcelona</p>
          <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 6px; border-top: 1px solid #e2e2d8;">
            <span style="font-size: 11px; color: #16a34a; font-weight: 600;">${popupOpenToday}</span>
            <a href="${SOCIAL_LINKS.googlePlaceUrl}" target="_blank" rel="noopener noreferrer" style="font-size: 11px; font-weight: bold; color: #5a5a40; text-decoration: none;">${popupViewInMaps}</a>
          </div>
        </div>
      </div>
    `;

    marker.bindPopup(popupContent, { maxWidth: 280 });
    marker.openPopup();

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [activeView, lat, lng, language]);

  const handleRecenter = () => {
    if (mapInstanceRef.current && activeView === 'estilizado') {
      mapInstanceRef.current.setView([lat, lng], 17, { animate: true });
    }
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(SOCIAL_LINKS.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Accurate Google Maps Navigation & Directions Links from official listing
  const googleMapsUrl = SOCIAL_LINKS.googlePlaceUrl;
  const googleDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`;
  const appleMapsUrl = `https://maps.apple.com/?address=${encodeURIComponent(
    'Carrer de la Cooperativa, 60-62, 08301 Mataró, Barcelona'
  )}&ll=${lat},${lng}`;

  // Google Maps official embed URLs using current language parameter
  const hl = language === 'cat' ? 'ca' : language === 'eng' ? 'en' : 'es';
  const googleSatelliteEmbedUrl = `https://maps.google.com/maps?q=${lat},${lng}&hl=${hl}&z=18&t=k&output=embed`;
  const googleStandardEmbedUrl = `https://maps.google.com/maps?q=${lat},${lng}&hl=${hl}&z=17&output=embed`;

  return (
    <section id="ubicacion" className="py-20 sm:py-28 bg-[#f5f5f0] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal distance="sm" duration={700}>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5a5a40]/10 text-xs font-sans font-semibold text-[#5a5a40] uppercase tracking-wider mb-3">
              <Star className="w-3.5 h-3.5 fill-[#5a5a40]" />
              <span>{dict.location.googleBadge}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#3d3d33] tracking-tight mb-4">
              {dict.location.title}
            </h2>
            <p className="text-[#8a8a7a] text-sm sm:text-base font-light">
              {dict.location.subtitle}
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal distance="md" duration={800} delay={150}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Map & Google Imagery */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            {/* View Mode Selector Tabs */}
            <div className="flex items-center justify-between flex-wrap gap-2 px-1 font-sans">
              <div className="flex items-center gap-1.5 p-1 bg-white rounded-full border border-[#5a5a40]/15 shadow-xs">
                <button
                  onClick={() => setActiveView('google-satelite')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeView === 'google-satelite'
                      ? 'bg-[#5a5a40] text-white shadow-xs'
                      : 'text-[#6b6b58] hover:text-[#3d3d33]'
                  }`}
                >
                  <Satellite className="w-3.5 h-3.5" />
                  <span>{dict.location.viewSatellite}</span>
                </button>

                <button
                  onClick={() => setActiveView('google-map')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeView === 'google-map'
                      ? 'bg-[#5a5a40] text-white shadow-xs'
                      : 'text-[#6b6b58] hover:text-[#3d3d33]'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{dict.location.viewMap}</span>
                </button>

                <button
                  onClick={() => setActiveView('estilizado')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeView === 'estilizado'
                      ? 'bg-[#5a5a40] text-white shadow-xs'
                      : 'text-[#6b6b58] hover:text-[#3d3d33]'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>{dict.location.viewStylized}</span>
                </button>
              </div>

              {/* External Street View Link */}
              <a
                href={streetViewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#e2e2d8] text-[#5a5a40] text-xs font-semibold uppercase tracking-wider border border-[#5a5a40]/15 shadow-xs transition-colors"
                title={dict.location.streetViewTitle}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{dict.location.streetView}</span>
              </a>
            </div>

            {/* Map Canvas Frame */}
            <div className="relative w-full h-[460px] sm:h-[500px] rounded-[32px] overflow-hidden border border-[#5a5a40]/20 shadow-md bg-[#e2e2d8]">
              {/* Google Satellite View */}
              {activeView === 'google-satelite' && (
                <iframe
                  title="Google Maps - Vista Satélite Café Gaudí"
                  src={googleSatelliteEmbedUrl}
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                />
              )}

              {/* Google Standard Map View */}
              {activeView === 'google-map' && (
                <iframe
                  title="Google Maps - Vista Callejero Café Gaudí"
                  src={googleStandardEmbedUrl}
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                />
              )}

              {/* Leaflet Stylized Map */}
              {activeView === 'estilizado' && (
                <>
                  <div ref={mapContainerRef} className="w-full h-full" />
                  <div className="absolute top-4 right-4 z-20 font-sans">
                    <button
                      onClick={handleRecenter}
                      className="p-2.5 bg-white/95 hover:bg-white text-[#3d3d33] rounded-full shadow-md border border-[#5a5a40]/15 transition-transform transform active:scale-95 cursor-pointer"
                      title={dict.location.recenterMap}
                      aria-label={dict.location.recenterMap}
                    >
                      <Compass className="w-4 h-4 text-[#5a5a40]" />
                    </button>
                  </div>
                </>
              )}

              {/* Bottom Quick Directions Bar */}
              <div className="absolute bottom-3 inset-x-3 sm:bottom-4 sm:inset-x-4 z-20 bg-white/95 backdrop-blur-xs rounded-[24px] p-3 sm:p-4 shadow-lg border border-[#5a5a40]/15 flex flex-wrap items-center justify-between gap-3 font-sans">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#5a5a40] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-[#3d3d33] leading-tight">
                        Cafetería Gaudí • Mataró
                      </p>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                        {dict.location.verifiedListing}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#737365] mt-0.5">
                      C/ Germans Thos i Codina / C/ Cooperativa • Coord: 41.53342, 2.44262
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    id="map-open-google"
                    href={googleDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 sm:px-5 py-2 sm:py-2.5 bg-[#5a5a40] hover:bg-[#4a4a30] text-white text-xs uppercase tracking-wider font-semibold rounded-full transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>{dict.location.startGps}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Map Links */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-2 font-sans">
              <div className="flex items-center gap-3">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs uppercase tracking-wider font-semibold text-[#5a5a40] hover:underline flex items-center gap-1"
                >
                  <span>{dict.location.openInGoogleMaps}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-[#8a8a7a]">•</span>
                <a
                  href={appleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs uppercase tracking-wider font-semibold text-[#5a5a40] hover:underline flex items-center gap-1"
                >
                  <span>{dict.location.openInAppleMaps}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <button
                onClick={handleCopyAddress}
                className="text-xs uppercase tracking-wider font-semibold text-[#5a5a40] hover:text-[#3d3d33] flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? dict.location.copied : dict.location.copyAddress}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Transportation & Opening Hours */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Practical Access Guide */}
            <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#5a5a40]/15 shadow-sm">
              <h3 className="font-serif text-2xl font-light text-[#3d3d33] mb-6">
                {dict.location.howToArriveTitle}
              </h3>

              <div className="space-y-6 font-sans">
                {/* Rodalies Renfe */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#f5f5f0] text-[#5a5a40] flex items-center justify-center shrink-0 border border-[#5a5a40]/20">
                    <Train className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-[#3d3d33]">
                        {dict.location.trainTitle}
                      </h4>
                      <span className="text-[10px] bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded-full">
                        {dict.location.trainWalkingTime}
                      </span>
                    </div>
                    <p className="text-xs text-[#8a8a7a] mt-1 leading-relaxed font-light">
                      {dict.location.trainDesc}
                    </p>
                  </div>
                </div>

                {/* Parkings */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#f5f5f0] text-[#5a5a40] flex items-center justify-center shrink-0 border border-[#5a5a40]/20">
                    <Car className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#3d3d33]">
                      {dict.location.carTitle}
                    </h4>
                    <p className="text-xs text-[#8a8a7a] mt-1 leading-relaxed font-light whitespace-pre-line">
                      {dict.location.carDesc}
                    </p>
                  </div>
                </div>

                {/* Autobús Urbano */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#f5f5f0] text-[#5a5a40] flex items-center justify-center shrink-0 border border-[#5a5a40]/20">
                    <Bus className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#3d3d33]">
                      {dict.location.busTitle}
                    </h4>
                    <p className="text-xs text-[#8a8a7a] mt-1 leading-relaxed font-light">
                      {dict.location.busDesc}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Contact & Hours Card */}
            <div className="bg-[#36362d] text-white rounded-[32px] p-6 sm:p-8 border border-[#5a5a40]/30 shadow-sm font-sans">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-[#dcdcd0] text-xs uppercase tracking-wider font-semibold">
                  <Clock className="w-4 h-4 text-[#a0a090]" />
                  <span>{dict.location.scheduleCardBadge}</span>
                </div>
                <span className="text-[11px] text-[#dcdcd0] font-medium uppercase tracking-wider">
                  {dict.location.scheduleCardType}
                </span>
              </div>
              <h3 className="font-serif text-2xl font-light text-white mb-4">
                {dict.location.scheduleCardTitle}
              </h3>

              {/* Status Banner for Closure / Holiday / Vacation */}
              {currentVenueStatus.isClosed && (
                <div className="mb-5 p-3.5 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs">
                  <div className="flex items-center gap-2 font-semibold text-white">
                    <span className="text-base">
                      {currentVenueStatus.status === 'vacation' ? '🏖️' : currentVenueStatus.status === 'holiday' ? '🎉' : '⏸️'}
                    </span>
                    <span>{currentVenueStatus.title}</span>
                  </div>
                  <p className="text-[11px] text-amber-100/90 mt-1 leading-relaxed">
                    {currentVenueStatus.message}
                  </p>
                  {currentVenueStatus.reopeningDate && (
                    <div className="mt-2 text-[11px] font-semibold text-amber-300 flex items-center gap-1">
                      <span>Fecha reapertura: {currentVenueStatus.reopeningDate}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2.5 text-xs border-b border-white/10 pb-5 mb-6">
                <div className="flex items-center justify-between py-2 border-b border-white/5 font-light">
                  <div>
                    <span className="text-white font-medium block text-sm">{dict.location.scheduleTueSatDays}</span>
                    <span className="text-[11px] text-[#a0a090]">{venueSettings.scheduleTueSatNote || dict.location.scheduleTueSatNote}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-white block text-sm">{venueSettings.scheduleTueSat || dict.location.scheduleTueSatTime}</span>
                    <span className="text-[10px] text-emerald-400">{dict.location.scheduleTueSatClose}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2 font-light">
                  <div>
                    <span className="text-white font-medium block text-sm">{dict.location.scheduleSunMonDays}</span>
                    <span className="text-[11px] text-[#a0a090]">{venueSettings.scheduleSunMonNote || dict.location.scheduleSunMonNote}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-white block text-sm">{venueSettings.scheduleSunMon || dict.location.scheduleSunMonTime}</span>
                    <span className="text-[10px] text-amber-300 font-medium">{dict.location.scheduleSunMonClose}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={`tel:${SOCIAL_LINKS.phoneRaw || SOCIAL_LINKS.phone.replace(/\s+/g, '')}`}
                  className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/15 text-white rounded-full text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 transition-colors border border-white/10"
                >
                  <Phone className="w-3.5 h-3.5 text-[#dcdcd0]" />
                  <span>Tel: {SOCIAL_LINKS.phone}</span>
                </a>

                <a
                  href={SOCIAL_LINKS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 bg-[#5a5a40] hover:bg-[#4a4a30] text-white rounded-full text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <span>{dict.location.whatsappDirect}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
