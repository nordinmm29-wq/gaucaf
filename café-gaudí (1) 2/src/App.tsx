import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './i18n/LanguageContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { DigitalMenu } from './components/DigitalMenu';
import { TableReservation } from './components/TableReservation';
import { PhotoGallery } from './components/PhotoGallery';
import { CustomerReviews } from './components/CustomerReviews';
import { InteractiveMap } from './components/InteractiveMap';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLogin } from './components/admin/AdminLogin';
import { isAdminAuthenticated, getStoredVenueSettings, isVenueCurrentlyClosed } from './data/adminStore';
import { MenuItem, VenueSettings } from './types';
import { MessageCircle, X, Palmtree, PartyPopper, AlertCircle, Info, Calendar } from 'lucide-react';
import { SOCIAL_LINKS } from './data/socialData';

interface OrderItem {
  item: MenuItem;
  quantity: number;
}

function MainApp() {
  const [order, setOrder] = useState<OrderItem[]>(() => {
    try {
      const saved = localStorage.getItem('thos20_order');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [orderDrawerOpen, setOrderDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'web' | 'admin'>('web');
  const [authenticated, setAuthenticated] = useState<boolean>(isAdminAuthenticated);
  const [activeSection, setActiveSection] = useState('inicio');
  const [venueSettings, setVenueSettings] = useState<VenueSettings>(getStoredVenueSettings);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // Ensure every page load or refresh starts at the public website and at the very beginning/top
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Always reset to public web mode on fresh page load or refresh
    setViewMode('web');

    // Clean any hash from the URL (including #admin or section anchors) so it lands on the public homepage
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    // Instant scroll to top
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    setActiveSection('inicio');

    const timeout = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
      const heroEl = document.getElementById('inicio');
      if (heroEl) {
        heroEl.scrollIntoView({ behavior: 'instant' as ScrollBehavior, block: 'start' });
      }
    }, 40);

    return () => clearTimeout(timeout);
  }, []);

  // Listen to venue settings changes
  useEffect(() => {
    const handleVenueSettingsUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<VenueSettings>;
      if (customEvent.detail) {
        setVenueSettings(customEvent.detail);
      } else {
        setVenueSettings(getStoredVenueSettings());
      }
      setBannerDismissed(false); // Re-show if updated by admin
    };
    window.addEventListener('gaudi:venue_settings_updated', handleVenueSettingsUpdate);
    return () => window.removeEventListener('gaudi:venue_settings_updated', handleVenueSettingsUpdate);
  }, []);

  // Update dynamic SEO meta tags (description, keywords, OpenGraph, Twitter)
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const desc =
      venueSettings.metaDescription?.trim() ||
      'Café Gaudí en Carrer Germans Thos i Codina 20, Mataró. Especialistas en café de autor, focaccias artesanas, desayunos, tapas de mercado y terraza al aire libre. ¡Reserva tu mesa!';
    const keywords =
      venueSettings.metaKeywords?.trim() ||
      'café gaudi mataró, cafetería mataró, café de especialidad mataró, focaccias artesanas, brunch mataró, tapas mataró, restaurantes germans thos i codina, desayunos mataró, terrazas mataró, reservar mesa mataró';

    // 1. Meta description
    let metaDescEl = document.querySelector('meta[name="description"]');
    if (!metaDescEl) {
      metaDescEl = document.createElement('meta');
      metaDescEl.setAttribute('name', 'description');
      document.head.appendChild(metaDescEl);
    }
    metaDescEl.setAttribute('content', desc);

    // 2. OpenGraph & Twitter descriptions
    let ogDescEl = document.querySelector('meta[property="og:description"]');
    if (!ogDescEl) {
      ogDescEl = document.createElement('meta');
      ogDescEl.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescEl);
    }
    ogDescEl.setAttribute('content', desc);

    let twitterDescEl = document.querySelector('meta[name="twitter:description"]');
    if (!twitterDescEl) {
      twitterDescEl = document.createElement('meta');
      twitterDescEl.setAttribute('name', 'twitter:description');
      document.head.appendChild(twitterDescEl);
    }
    twitterDescEl.setAttribute('content', desc);

    // 3. Keywords meta tag
    let metaKeywordsEl = document.querySelector('meta[name="keywords"]');
    if (!metaKeywordsEl) {
      metaKeywordsEl = document.createElement('meta');
      metaKeywordsEl.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywordsEl);
    }
    metaKeywordsEl.setAttribute('content', keywords);
  }, [venueSettings.metaDescription, venueSettings.metaKeywords]);

  const venueStatus = React.useMemo(() => {
    return isVenueCurrentlyClosed(venueSettings);
  }, [venueSettings]);

  // Listen to hash changes for direct #admin access
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setViewMode('admin');
      } else if (viewMode === 'admin' && window.location.hash !== '#admin') {
        setViewMode('web');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [viewMode]);

  // Save order changes to local storage
  useEffect(() => {
    try {
      localStorage.setItem('thos20_order', JSON.stringify(order));
    } catch {
      // ignore
    }
  }, [order]);

  // Section observer for active navbar links
  useEffect(() => {
    if (viewMode !== 'web') return;

    const handleScroll = () => {
      const sections = ['inicio', 'menu', 'reservas', 'galeria', 'resenas', 'ubicacion'];
      const scrollPos = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [viewMode]);

  const handleOpenAdmin = () => {
    window.location.hash = '#admin';
    setViewMode('admin');
    setAuthenticated(isAdminAuthenticated());
  };

  const handleBackToWeb = () => {
    if (window.location.hash) {
      window.history.pushState('', document.title, window.location.pathname + window.location.search);
    }
    setViewMode('web');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    setActiveSection('inicio');
  };

  const handleLoginSuccess = () => {
    setAuthenticated(true);
  };

  const handleUpdateQuantity = (item: MenuItem, delta: number) => {
    setOrder((prev) => {
      const existing = prev.find((o) => o.item.id === item.id);
      if (!existing) {
        if (delta > 0) {
          return [...prev, { item, quantity: 1 }];
        }
        return prev;
      }

      const newQty = existing.quantity + delta;
      if (newQty <= 0) {
        return prev.filter((o) => o.item.id !== item.id);
      }

      return prev.map((o) => (o.item.id === item.id ? { ...o, quantity: newQty } : o));
    });
  };

  const handleClearOrder = () => {
    setOrder([]);
    try {
      localStorage.removeItem('thos20_order');
    } catch {
      // ignore
    }
  };

  const totalOrderCount = order.reduce((sum, item) => sum + item.quantity, 0);

  // If in admin mode, display Admin Login or Full-Page Administrative Dashboard
  if (viewMode === 'admin') {
    if (!authenticated) {
      return <AdminLogin onSuccess={handleLoginSuccess} onBackToWeb={handleBackToWeb} />;
    }
    return <AdminDashboard onBackToWeb={handleBackToWeb} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f0] text-[#3d3d33]">
      {/* Site-wide Closure / Vacation / Holiday Notice Banner */}
      {!bannerDismissed && (venueStatus.isClosed || venueSettings.showNoticeBanner) && (
        <aside
          aria-label="Aviso de servicio y horarios"
          className={`relative z-50 text-xs py-2.5 px-4 font-sans text-center transition-all ${
            venueStatus.isClosed
              ? 'bg-gradient-to-r from-amber-700 via-amber-800 to-amber-700 text-white shadow-md'
              : venueSettings.noticeBannerType === 'warning'
              ? 'bg-amber-500 text-slate-950 font-medium'
              : venueSettings.noticeBannerType === 'closure'
              ? 'bg-rose-700 text-white'
              : 'bg-[#5a5a40] text-white'
          }`}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-2">
            <div className="flex-1 flex items-center justify-center flex-wrap gap-2 text-center">
              <span className="text-base">
                {venueStatus.isClosed
                  ? venueStatus.status === 'vacation'
                    ? '🏖️'
                    : venueStatus.status === 'holiday'
                    ? '🎉'
                    : '⏸️'
                  : '📢'}
              </span>
              <span className="font-semibold tracking-wide">
                {venueStatus.isClosed ? venueStatus.title : 'Aviso Café Gaudí:'}
              </span>
              <span className="opacity-95">
                {venueStatus.isClosed ? venueStatus.message : venueSettings.noticeBannerText}
              </span>
              {venueStatus.reopeningDate && (
                <span className="font-bold bg-white/15 px-2 py-0.5 rounded-full text-[11px]">
                  Reapertura prevista: {venueStatus.reopeningDate}
                </span>
              )}
              {venueStatus.isClosed && (
                <a
                  href="#reservas"
                  className="ml-2 inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-colors"
                >
                  Consultar reservas &rarr;
                </a>
              )}
            </div>

            <button
              onClick={() => setBannerDismissed(true)}
              className="p-1 rounded-full hover:bg-black/20 text-white/80 hover:text-white transition-colors cursor-pointer shrink-0"
              title="Ocultar aviso"
              aria-label="Ocultar aviso"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}

      {/* Top Navbar */}
      <Navbar
        orderCount={totalOrderCount}
        onOpenOrder={() => setOrderDrawerOpen(true)}
        onOpenAdmin={handleOpenAdmin}
        activeSection={activeSection}
      />

      {/* Main Sections */}
      <main className="flex-1">
        <Hero />
        <DigitalMenu
          order={order}
          onUpdateQuantity={handleUpdateQuantity}
          onClearOrder={handleClearOrder}
          orderDrawerOpen={orderDrawerOpen}
          setOrderDrawerOpen={setOrderDrawerOpen}
        />
        <TableReservation />
        <PhotoGallery />
        <CustomerReviews />
        <InteractiveMap />
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={handleOpenAdmin} />

      {/* Quick Floating WhatsApp Action */}
      <div className="fixed bottom-6 left-6 z-40">
        <a
          id="floating-whatsapp-btn"
          href={SOCIAL_LINKS.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="w-13 h-13 rounded-full bg-[#25D366] hover:bg-[#20BE5A] text-white flex items-center justify-center shadow-2xl transition-transform transform hover:scale-110 active:scale-95"
          title="Contactar por WhatsApp"
          aria-label="Contactar por WhatsApp"
        >
          <MessageCircle className="w-6 h-6" />
        </a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
}

