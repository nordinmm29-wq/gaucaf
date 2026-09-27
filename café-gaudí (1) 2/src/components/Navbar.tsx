import React, { useState, useEffect } from 'react';
import { Utensils, Calendar, MapPin, Instagram, Phone, Clock, Menu, X, ShoppingBag, Settings, ShieldCheck } from 'lucide-react';
import { SOCIAL_LINKS } from '../data/socialData';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageSelector } from './LanguageSelector';

interface NavbarProps {
  orderCount: number;
  onOpenOrder: () => void;
  onOpenAdmin: () => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ orderCount, onOpenOrder, onOpenAdmin, activeSection }) => {
  const { dict } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: dict.nav.home, href: '#inicio', id: 'inicio' },
    { name: dict.nav.menu, href: '#menu', id: 'menu' },
    { name: dict.nav.reservations, href: '#reservas', id: 'reservas' },
    { name: dict.nav.gallery, href: '#galeria', id: 'galeria' },
    { name: dict.nav.reviews, href: '#resenas', id: 'resenas' },
    { name: dict.nav.location, href: '#ubicacion', id: 'ubicacion' },
  ];

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#f5f5f0]/95 backdrop-blur-md py-3 shadow-xs border-b border-[#5a5a40]/20'
          : 'bg-[#f5f5f0]/90 backdrop-blur-xs py-4 border-b border-[#5a5a40]/15'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#"
            id="nav-brand-link"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
              window.history.replaceState(null, '', window.location.pathname + window.location.search);
            }}
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-full bg-[#5a5a40] flex items-center justify-center text-white font-serif text-lg font-light shadow-xs group-hover:bg-[#4a4a30] transition-colors shrink-0">
              <span>G</span>
            </div>
            <div>
              <span className="text-lg sm:text-2xl font-light tracking-tight text-[#5a5a40] font-serif block leading-none">
                CAFÉ GAUDÍ
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-sans text-[#8a8a7a] block mt-1">
                Café Bar & Restaurant • Mataró
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 font-sans text-xs uppercase tracking-widest" aria-label="Navegación principal">
            {navLinks.map((link) => (
              <a
                key={link.id}
                id={`nav-link-${link.id}`}
                href={link.href}
                className={`transition-colors hover:text-[#5a5a40] pb-1 ${
                  activeSection === link.id
                    ? 'text-[#5a5a40] font-semibold border-b border-[#5a5a40]'
                    : 'text-[#5a5a40]/70'
                }`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Language Selector in Header */}
            <LanguageSelector variant="header" />

            {/* Phone quick call */}
            <a
              id="nav-phone-btn"
              href={`tel:${SOCIAL_LINKS.phoneRaw || SOCIAL_LINKS.phone.replace(/\s+/g, '')}`}
              className="hidden xl:flex items-center gap-2 text-xs font-sans text-[#5a5a40] hover:text-[#3d3d33] bg-white border border-[#5a5a40]/20 px-3.5 py-2 rounded-full transition-colors"
              title={dict.nav.callUs}
            >
              <Phone className="w-3.5 h-3.5 text-[#5a5a40]" />
              <span>{SOCIAL_LINKS.phone}</span>
            </a>

            {/* Order tray trigger */}
            {orderCount > 0 && (
              <button
                id="nav-order-tray-btn"
                onClick={onOpenOrder}
                className="flex items-center gap-2 bg-[#e2e2d8] hover:bg-[#dcdcd0] text-[#3d3d33] px-3.5 py-2 rounded-full text-xs font-sans uppercase tracking-wider border border-[#5a5a40]/20 transition-all shadow-xs cursor-pointer"
                title="Ver platos guardados"
              >
                <ShoppingBag className="w-4 h-4 text-[#5a5a40]" />
                <span>{dict.nav.orderTray}</span>
                <span className="bg-[#5a5a40] text-white text-[11px] px-2 py-0.5 rounded-full font-bold">
                  {orderCount}
                </span>
              </button>
            )}

            {/* Admin Panel Trigger */}
            <button
              id="nav-admin-btn"
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 text-xs font-sans text-[#5a5a40] hover:text-[#3d3d33] bg-white/70 hover:bg-white border border-[#5a5a40]/20 px-3 py-2 rounded-full transition-colors cursor-pointer"
              title="Panel de Administración"
            >
              <Settings className="w-3.5 h-3.5 text-[#5a5a40]" />
              <span className="hidden lg:inline">{dict.nav.admin}</span>
            </button>

            {/* Book Table Button */}
            <a
              id="nav-cta-reservation"
              href="#reservas"
              className="bg-[#5a5a40] hover:bg-[#4a4a30] text-white font-sans text-xs uppercase tracking-widest px-6 py-2.5 rounded-full shadow-xs transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{dict.nav.bookTable}</span>
            </a>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 sm:hidden">
            <LanguageSelector variant="header" className="scale-90 origin-right" />

            {orderCount > 0 && (
              <button
                id="nav-mobile-order-btn"
                onClick={onOpenOrder}
                className="p-2 bg-[#5a5a40] text-white rounded-full relative shadow-xs"
                aria-label="Ver comanda"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 bg-[#3d3d33] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {orderCount}
                </span>
              </button>
            )}

            <button
              id="nav-mobile-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#5a5a40] hover:text-[#3d3d33] rounded-lg transition-colors focus:outline-none"
              aria-label={dict.nav.openMenu}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-drawer"
          className="lg:hidden bg-[#f5f5f0] border-b border-[#5a5a40]/20 px-4 pt-3 pb-6 mt-3 shadow-xl animate-fade-in"
        >
          {/* Mobile Language Selector inside drawer */}
          <div className="mb-4 pb-3 border-b border-[#5a5a40]/15">
            <LanguageSelector variant="mobile" />
          </div>

          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.id}
                id={`mobile-link-${link.id}`}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2.5 px-3 rounded-2xl text-xs font-sans uppercase tracking-widest transition-colors ${
                  activeSection === link.id
                    ? 'bg-[#e2e2d8] text-[#5a5a40] font-bold'
                    : 'text-[#5a5a40]/80 hover:bg-white'
                }`}
              >
                {link.name}
              </a>
            ))}

            <div className="pt-3 border-t border-[#5a5a40]/15 flex flex-col gap-3">
              <a
                id="mobile-nav-cta-reservation"
                href="#reservas"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 bg-[#5a5a40] text-white font-sans text-xs uppercase tracking-widest rounded-full text-center flex items-center justify-center gap-2 shadow-xs"
              >
                <Calendar className="w-4 h-4" />
                <span>{dict.nav.bookTable}</span>
              </a>

              <button
                id="mobile-nav-admin-btn"
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full py-2.5 bg-white text-[#5a5a40] border border-[#5a5a40]/20 font-sans text-xs uppercase tracking-wider font-semibold rounded-full text-center flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-[#5a5a40]" />
                <span>{dict.footer.adminPanel}</span>
              </button>

              <div className="flex items-center justify-between text-xs text-[#8a8a7a] px-1 pt-1 font-sans">
                <a
                  href={`tel:${SOCIAL_LINKS.phoneRaw || SOCIAL_LINKS.phone.replace(/\s+/g, '')}`}
                  className="flex items-center gap-1.5 hover:text-[#5a5a40]"
                >
                  <Phone className="w-3.5 h-3.5 text-[#5a5a40]" />
                  <span>{SOCIAL_LINKS.phone}</span>
                </a>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#5a5a40]" />
                  <span>{dict.nav.openToday}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
