import React from 'react';
import { Calendar, Utensils, MapPin, Coffee, Star, ChevronDown, Sparkles } from 'lucide-react';
import { SOCIAL_LINKS } from '../data/socialData';
import { useLanguage } from '../i18n/LanguageContext';

export const Hero: React.FC = () => {
  const { dict } = useLanguage();

  return (
    <section
      id="inicio"
      className="relative min-h-[92vh] flex items-center justify-center bg-[#25251d] text-white pt-24 pb-16 overflow-hidden"
    >
      {/* Background Image with layered gastronomic mood gradients */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000&q=85"
          alt="Ambiente acogedor de restaurante y café bar"
          className="w-full h-full object-cover object-center opacity-25 scale-105 transform animate-pulse duration-10000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#25251d] via-[#25251d]/85 to-[#25251d]/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#5a5a40]/30 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-4">
        {/* Location & Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs sm:text-sm text-[#e2e2d8] mb-6 backdrop-blur-xs shadow-xs font-sans tracking-wide">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-semibold text-white">Café Gaudí</span>
          <span className="text-[#8a8a7a]">•</span>
          <MapPin className="w-3.5 h-3.5 text-[#dcdcd0]" />
          <span>{dict.hero.badge}</span>
        </div>

        {/* Main Headline */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-[#f5f5f0] mb-6 leading-[1.15]">
          {dict.hero.headlinePart1} <br className="hidden sm:inline" />
          <span className="text-[#dcdcd0] italic font-normal">{dict.hero.headlinePart2}</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-[#dcdcd0] max-w-3xl mx-auto mb-10 leading-relaxed font-light">
          {dict.hero.subtitle}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <a
            id="hero-btn-menu"
            href="#menu"
            className="w-full sm:w-auto px-8 py-3.5 bg-[#f5f5f0] hover:bg-white text-[#3d3d33] font-sans text-xs uppercase tracking-widest font-semibold rounded-full shadow-md transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5"
          >
            <Utensils className="w-4 h-4 text-[#5a5a40]" />
            <span>{dict.hero.btnMenu}</span>
          </a>

          <a
            id="hero-btn-reserva"
            href="#reservas"
            className="w-full sm:w-auto px-8 py-3.5 bg-[#5a5a40] hover:bg-[#4a4a30] text-white font-sans text-xs uppercase tracking-widest font-semibold rounded-full shadow-md transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5 border border-[#6b6b50]"
          >
            <Calendar className="w-4 h-4" />
            <span>{dict.hero.btnReserve}</span>
          </a>

          <a
            id="hero-btn-map"
            href="#ubicacion"
            className="w-full sm:w-auto px-7 py-3.5 bg-white/10 hover:bg-white/15 text-[#f5f5f0] hover:text-white font-sans text-xs uppercase tracking-widest font-medium rounded-full border border-white/20 backdrop-blur-xs transition-all flex items-center justify-center gap-2"
          >
            <MapPin className="w-4 h-4 text-[#dcdcd0]" />
            <span>{dict.hero.btnMap}</span>
          </a>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-8 border-t border-white/15 text-left">
          <div className="p-4 rounded-[24px] bg-white/[0.04] border border-white/10 backdrop-blur-xs">
            <div className="flex items-center gap-2 text-[#dcdcd0] mb-1">
              <Utensils className="w-4 h-4 text-[#e2e2d8]" />
              <span className="text-xs font-sans font-semibold uppercase tracking-wider">{dict.hero.burgersTitle}</span>
            </div>
            <p className="text-xs text-[#b8b8a8]">{dict.hero.burgersDesc}</p>
          </div>

          <div className="p-4 rounded-[24px] bg-white/[0.04] border border-white/10 backdrop-blur-xs">
            <div className="flex items-center gap-2 text-[#dcdcd0] mb-1">
              <Coffee className="w-4 h-4 text-[#e2e2d8]" />
              <span className="text-xs font-sans font-semibold uppercase tracking-wider">{dict.hero.coffeeTitle}</span>
            </div>
            <p className="text-xs text-[#b8b8a8]">{dict.hero.coffeeDesc}</p>
          </div>

          <div className="p-4 rounded-[24px] bg-white/[0.04] border border-white/10 backdrop-blur-xs">
            <div className="flex items-center gap-2 text-[#dcdcd0] mb-1">
              <MapPin className="w-4 h-4 text-[#e2e2d8]" />
              <span className="text-xs font-sans font-semibold uppercase tracking-wider">{dict.hero.terraceTitle}</span>
            </div>
            <p className="text-xs text-[#b8b8a8]">{dict.hero.terraceDesc}</p>
          </div>

          <div className="p-4 rounded-[24px] bg-white/[0.04] border border-white/10 backdrop-blur-xs">
            <div className="flex items-center gap-2 text-[#dcdcd0] mb-1">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="text-xs font-sans font-semibold uppercase tracking-wider">{dict.hero.artisanalTitle}</span>
            </div>
            <p className="text-xs text-[#b8b8a8]">{dict.hero.artisanalDesc}</p>
          </div>
        </div>

        {/* Scroll down indicator */}
        <div className="mt-12 flex justify-center">
          <a
            href="#menu"
            aria-label={dict.hero.btnMenu}
            className="text-[#8a8a7a] hover:text-white transition-colors p-2"
          >
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
};
