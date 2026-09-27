import React, { useState, useMemo, useEffect } from 'react';
import {
  Info,
  Plus,
  Minus,
  ShoppingBag,
  X,
  UtensilsCrossed,
  Sparkles,
  Clock,
  Download,
  Loader2,
  ChevronRight,
  ChevronLeft,
  FileText,
  BookOpen,
  Globe,
  SlidersHorizontal,
} from 'lucide-react';
import { ALLERGENS_LIST } from '../data/menuData';
import { PDF_MENU_PAGES, PdfMenuPage } from '../data/pdfMenuData';
import { MenuItem, DietaryTag } from '../types';
import {
  getStoredMenuAvailability,
  getStoredMenuPriceOverrides,
  getStoredVenueSettings,
} from '../data/adminStore';
import {
  generateAndDownloadFullMenuPdf,
  generateAndDownloadCurrentSectionPdf,
} from '../utils/downloadMenuPdf';
import { useLanguage, Language } from '../i18n/LanguageContext';
import {
  getTranslatedMenuItem,
  getTranslatedSupplements,
  getPageScheduleNote,
  getPageFooterNote,
} from '../i18n/menuTranslations';
import { ScrollReveal } from './ScrollReveal';

interface OrderItem {
  item: MenuItem;
  quantity: number;
}

interface DigitalMenuProps {
  order: OrderItem[];
  onUpdateQuantity: (item: MenuItem, delta: number) => void;
  onClearOrder: () => void;
  orderDrawerOpen: boolean;
  setOrderDrawerOpen: (open: boolean) => void;
}

export const DigitalMenu: React.FC<DigitalMenuProps> = ({
  order,
  onUpdateQuantity,
  onClearOrder,
  orderDrawerOpen,
  setOrderDrawerOpen,
}) => {
  const { language, setLanguage, dict } = useLanguage();

  // Active page: 1 to 8 (exclusively shows the selected menu section)
  const [selectedPageNumber, setSelectedPageNumber] = useState<number>(1);
  const [selectedTag, setSelectedTag] = useState<DietaryTag | 'todos'>('todos');
  const [showAllergensModal, setShowAllergensModal] = useState(false);
  const [showMobileSectionsModal, setShowMobileSectionsModal] = useState(false);
  const [tableNumber, setTableNumber] = useState('');
  const [showWaiterMode, setShowWaiterMode] = useState(false);
  const [availabilityMap, setAvailabilityMap] = useState<Record<string, boolean>>(getStoredMenuAvailability);
  const [priceOverrides, setPriceOverrides] = useState<Record<string, number>>(getStoredMenuPriceOverrides);
  const [isDownloading, setIsDownloading] = useState(false);

  // Helper to get translated page labels
  const getPageLabels = (pageNum: number) => {
    const pages = dict.menu?.pages;
    if (!pages) {
      return { tabTitle: `Sección ${pageNum}`, title: '', summary: '' };
    }
    switch (pageNum) {
      case 1:
        return { tabTitle: pages.p1Tab, title: pages.p1Title, summary: pages.p1Desc };
      case 2:
        return { tabTitle: pages.p2Tab, title: pages.p2Title, summary: pages.p2Desc };
      case 3:
        return { tabTitle: pages.p3Tab, title: pages.p3Title, summary: pages.p3Desc };
      case 4:
        return { tabTitle: pages.p4Tab, title: pages.p4Title, summary: pages.p4Desc };
      case 5:
        return { tabTitle: pages.p5Tab, title: pages.p5Title, summary: pages.p5Desc };
      case 6:
        return { tabTitle: pages.p6Tab, title: pages.p6Title, summary: pages.p6Desc };
      case 7:
        return { tabTitle: pages.p7Tab, title: pages.p7Title, summary: pages.p7Desc };
      case 8:
        return { tabTitle: pages.p8Tab, title: pages.p8Title, summary: pages.p8Desc };
      default:
        return { tabTitle: `Sección ${pageNum}`, title: '', summary: '' };
    }
  };

  const currentSupplements = useMemo(() => getTranslatedSupplements(language), [language]);

  useEffect(() => {
    const handleAvailabilityUpdate = (e: any) => {
      if (e.detail) {
        setAvailabilityMap(e.detail);
      } else {
        setAvailabilityMap(getStoredMenuAvailability());
      }
    };

    const handlePricesUpdate = (e: any) => {
      if (e.detail) {
        setPriceOverrides(e.detail);
      } else {
        setPriceOverrides(getStoredMenuPriceOverrides());
      }
    };

    window.addEventListener('gaudi:menu_availability_updated', handleAvailabilityUpdate);
    window.addEventListener('gaudi:menu_prices_updated', handlePricesUpdate);

    return () => {
      window.removeEventListener('gaudi:menu_availability_updated', handleAvailabilityUpdate);
      window.removeEventListener('gaudi:menu_prices_updated', handlePricesUpdate);
    };
  }, []);

  // Filter items per page - strictly show only the selected section
  const filteredPages = useMemo(() => {
    return PDF_MENU_PAGES.map((page) => {
      if (page.pageNumber !== selectedPageNumber) {
        return null;
      }

      const filteredSections = page.sections
        .map((section) => {
          const filteredItems = section.items.filter((item) => {
            if (selectedTag === 'todos') return true;
            if (selectedTag === 'estrella') return item.popular || item.tags?.includes('estrella');
            return item.tags?.includes(selectedTag);
          });

          return {
            ...section,
            items: filteredItems,
          };
        })
        .filter((section) => section.items.length > 0);

      if (filteredSections.length === 0) {
        return null;
      }

      return {
        ...page,
        sections: filteredSections,
      };
    }).filter((page): page is PdfMenuPage => page !== null);
  }, [selectedPageNumber, selectedTag]);

  const orderTotal = useMemo(() => {
    return order.reduce((sum, entry) => {
      const price = priceOverrides[entry.item.id] !== undefined ? priceOverrides[entry.item.id] : entry.item.price;
      return sum + price * entry.quantity;
    }, 0);
  }, [order, priceOverrides]);

  const totalItemCount = useMemo(() => {
    return order.reduce((sum, entry) => sum + entry.quantity, 0);
  }, [order]);

  const getItemQuantity = (itemId: string) => {
    return order.find((o) => o.item.id === itemId)?.quantity || 0;
  };

  const handleDownloadMenu = () => {
    try {
      setIsDownloading(true);
      setTimeout(() => {
        generateAndDownloadFullMenuPdf(language);
        setIsDownloading(false);
      }, 100);
    } catch (err) {
      console.error('Error al generar el PDF de la carta:', err);
      setIsDownloading(false);
    }
  };

  const scrollToContent = () => {
    if (typeof window !== 'undefined') {
      const el = document.getElementById('menu-dishes-view');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <section id="menu" className="py-12 sm:py-20 bg-[#f5f5f0] relative print:bg-white print:py-4">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal distance="sm" duration={700}>
          <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10 print:mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#5a5a40]/10 text-[#5a5a40] text-xs font-sans uppercase tracking-[0.2em] font-medium mb-3">
              <FileText className="w-3.5 h-3.5" />
              <span>{dict.menu.badge}</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#5a5a40] tracking-tight mb-3">
              {dict.menu.title}
            </h2>

            <p className="text-[#666657] text-sm sm:text-base font-light leading-relaxed max-w-2xl mx-auto">
              {dict.menu.subtitle}
            </p>

            {/* Language Switcher Bar directly inside Menu */}
            <div className="mt-5 inline-flex items-center p-1 bg-white rounded-full border border-[#5a5a40]/25 shadow-xs font-sans print:hidden">
              <span className="pl-3 pr-2 text-xs font-medium text-[#7a7a6b] flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#5a5a40]" />
                <span className="hidden sm:inline">{dict.menu.languageSelectorTitle}</span>
              </span>
              <div className="flex items-center gap-1" role="group" aria-label="Seleccionar idioma de la carta">
                <button
                  type="button"
                  onClick={() => setLanguage('es')}
                  aria-pressed={language === 'es'}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    language === 'es'
                      ? 'bg-[#5a5a40] text-white shadow-2xs'
                      : 'text-[#5a5a40] hover:bg-[#f0f0ea]'
                  }`}
                  title="Cambiar idioma a Español"
                >
                  ES <span className="hidden sm:inline font-normal text-[10px] opacity-85">(Español)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('cat')}
                  aria-pressed={language === 'cat'}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    language === 'cat'
                      ? 'bg-[#5a5a40] text-white shadow-2xs'
                      : 'text-[#5a5a40] hover:bg-[#f0f0ea]'
                  }`}
                  title="Canviar idioma a Català"
                >
                  CAT <span className="hidden sm:inline font-normal text-[10px] opacity-85">(Català)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('eng')}
                  aria-pressed={language === 'eng'}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    language === 'eng'
                      ? 'bg-[#5a5a40] text-white shadow-2xs'
                      : 'text-[#5a5a40] hover:bg-[#f0f0ea]'
                  }`}
                  title="Switch language to English"
                >
                  ENG <span className="hidden sm:inline font-normal text-[10px] opacity-85">(English)</span>
                </button>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3 font-sans print:hidden">
              <button
                id="btn-descargar-carta"
                onClick={handleDownloadMenu}
                disabled={isDownloading}
                className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-[#5a5a40] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#474733] shadow-xs hover:shadow-sm transition-all cursor-pointer disabled:opacity-75"
                title={dict.menu.downloadFullPdf}
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{dict.menu.downloading}</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>{dict.menu.downloadFullPdf}</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setShowAllergensModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full bg-white border border-[#5a5a40]/25 text-[#5a5a40] text-xs uppercase tracking-wider font-semibold hover:bg-[#e8e8df] shadow-2xs transition-colors cursor-pointer"
              >
                <Info className="w-3.5 h-3.5" />
                <span>{dict.menu.allergensGuide}</span>
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Mobile-Only Horizontal Scrollable Sections Bar */}
        <div className="lg:hidden mb-4 print:hidden">
          <div className="bg-white rounded-2xl border border-[#5a5a40]/20 p-3 shadow-xs">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#5a5a40] flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{dict.menu.sectionsTitle}</span>
              </span>
              <button
                onClick={() => setShowMobileSectionsModal(true)}
                className="text-[11px] font-sans font-semibold text-[#5a5a40] hover:text-[#3d3d2c] flex items-center gap-1 underline underline-offset-2 cursor-pointer"
              >
                <SlidersHorizontal className="w-3 h-3" />
                <span>{dict.menu.viewAllSectionsMobile}</span>
              </button>
            </div>

            {/* Horizontal Scrollable Pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar scroll-smooth" tabIndex={0} aria-label="Navegación horizontal de secciones">
              {PDF_MENU_PAGES.map((page) => {
                const isSelected = selectedPageNumber === page.pageNumber;
                const labels = getPageLabels(page.pageNumber);
                return (
                  <button
                    key={page.pageCode}
                    onClick={() => {
                      setSelectedPageNumber(page.pageNumber);
                      scrollToContent();
                    }}
                    className={`shrink-0 px-3 py-2 rounded-xl text-xs font-sans font-medium transition-all flex items-center gap-2 border cursor-pointer ${
                      isSelected
                        ? 'bg-[#5a5a40] text-white border-[#5a5a40] shadow-xs'
                        : 'bg-[#fcfcfa] text-[#4a4a35] border-[#5a5a40]/15 hover:bg-[#f0f0ea]'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-[#e8e8de] text-[#5a5a40]'
                      }`}
                    >
                      {page.pageNumber}
                    </span>
                    <span className="truncate max-w-[130px] font-serif font-semibold">
                      {labels.tabTitle || page.tabTitle}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Dietary Filter Pills */}
            <div className="mt-3 pt-2.5 border-t border-[#5a5a40]/15 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5 font-sans">
              <span className="text-[10px] uppercase font-bold text-[#7a7a6b] shrink-0 pr-1">
                {dict.menu.filterBy}
              </span>
              <button
                onClick={() => setSelectedTag('todos')}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap transition-all cursor-pointer ${
                  selectedTag === 'todos'
                    ? 'bg-[#5a5a40] text-white shadow-2xs'
                    : 'bg-[#f5f5f0] text-[#5a5a40] hover:bg-[#ebebe0]'
                }`}
              >
                {dict.menu.filterAll}
              </button>
              <button
                onClick={() => setSelectedTag('estrella')}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                  selectedTag === 'estrella'
                    ? 'bg-[#5a5a40] text-white shadow-2xs'
                    : 'bg-[#f5f5f0] text-[#5a5a40] hover:bg-[#ebebe0]'
                }`}
              >
                <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                <span>{dict.menu.filterSpecial}</span>
              </button>
              <button
                onClick={() => setSelectedTag('sin-gluten')}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap transition-all cursor-pointer ${
                  selectedTag === 'sin-gluten'
                    ? 'bg-[#5a5a40] text-white shadow-2xs'
                    : 'bg-[#f5f5f0] text-[#5a5a40] hover:bg-[#ebebe0]'
                }`}
              >
                {dict.menu.filterGlutenFree}
              </button>
              <button
                onClick={() => setSelectedTag('vegetariano')}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap transition-all cursor-pointer ${
                  selectedTag === 'vegetariano'
                    ? 'bg-[#5a5a40] text-white shadow-2xs'
                    : 'bg-[#f5f5f0] text-[#5a5a40] hover:bg-[#ebebe0]'
                }`}
              >
                {dict.menu.filterVeg}
              </button>
              <button
                onClick={() => setSelectedTag('vegano')}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap transition-all cursor-pointer ${
                  selectedTag === 'vegano'
                    ? 'bg-[#5a5a40] text-white shadow-2xs'
                    : 'bg-[#f5f5f0] text-[#5a5a40] hover:bg-[#ebebe0]'
                }`}
              >
                {dict.menu.filterVegan}
              </button>
            </div>
          </div>
        </div>

        {/* Layout with Vertical Buttons and Dishes Content */}
        <ScrollReveal distance="md" duration={800} delay={150}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Desktop Vertical Buttons Sidebar */}
            <aside className="hidden lg:block lg:col-span-4 print:hidden">
              <div className="lg:sticky lg:top-24 space-y-4">
                <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#5a5a40]/20 p-4 sm:p-5 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-[#5a5a40]/15 mb-3">
                    <span className="text-xs uppercase font-bold tracking-wider text-[#5a5a40] flex items-center gap-1.5 font-sans">
                      <BookOpen className="w-4 h-4" />
                      <span>{dict.menu.sectionsTitle}</span>
                    </span>
                    <span className="text-[11px] font-sans font-semibold text-[#7a7a6b] bg-[#f0f0ea] px-2.5 py-0.5 rounded-full">
                      {dict.menu.sectionsCount}
                    </span>
                  </div>

                  {/* Vertical Buttons Stack (1 to 8) */}
                  <nav className="flex flex-col gap-2" aria-label="Secciones de la carta">
                    {PDF_MENU_PAGES.map((page) => {
                      const isSelected = selectedPageNumber === page.pageNumber;
                      const labels = getPageLabels(page.pageNumber);
                      return (
                        <button
                          key={page.pageCode}
                          id={`btn-carta-${page.pageCode}`}
                          onClick={() => {
                            setSelectedPageNumber(page.pageNumber);
                            scrollToContent();
                          }}
                          className={`w-full text-left p-3 sm:p-3.5 rounded-xl sm:rounded-2xl transition-all cursor-pointer flex items-center justify-between border ${
                            isSelected
                              ? 'bg-[#5a5a40] text-white border-[#5a5a40] shadow-sm'
                              : 'bg-[#fcfcfa] text-[#2d2d24] border-[#5a5a40]/15 hover:bg-[#f4f4ee] hover:border-[#5a5a40]/30'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`w-8 h-8 rounded-lg sm:rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                                isSelected ? 'bg-white/20 text-white' : 'bg-[#e8e8de] text-[#5a5a40]'
                              }`}
                            >
                              {page.pageNumber}
                            </div>
                            <div className="min-w-0">
                              <div className="font-serif text-sm sm:text-base font-semibold truncate leading-tight">
                                {labels.tabTitle || page.tabTitle}
                              </div>
                              <div
                                className={`text-[11px] font-sans truncate mt-0.5 ${
                                  isSelected ? 'text-[#e8e8df]' : 'text-[#7a7a6b]'
                                }`}
                              >
                                {labels.summary || page.summary}
                              </div>
                            </div>
                          </div>
                          <ChevronRight
                            className={`w-4 h-4 shrink-0 transition-transform ${
                              isSelected ? 'text-white translate-x-0.5' : 'text-[#8a8a7a]'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </nav>

                  {/* Desktop Dietary Filter Pills */}
                  <div className="mt-5 pt-4 border-t border-[#5a5a40]/15">
                    <div className="text-[11px] font-sans uppercase tracking-wider font-semibold text-[#7a7a6b] mb-2.5">
                      {dict.menu.filterBy}
                    </div>
                    <div className="flex flex-wrap gap-1.5 font-sans">
                      <button
                        onClick={() => setSelectedTag('todos')}
                        className={`text-xs font-medium px-3 py-1 rounded-full transition-all cursor-pointer uppercase tracking-wider ${
                          selectedTag === 'todos'
                            ? 'bg-[#5a5a40] text-white shadow-2xs'
                            : 'bg-[#f5f5f0] text-[#5a5a40] hover:bg-[#ebebe0]'
                        }`}
                      >
                        {dict.menu.filterAll}
                      </button>
                      <button
                        onClick={() => setSelectedTag('estrella')}
                        className={`text-xs font-medium px-3 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1 uppercase tracking-wider ${
                          selectedTag === 'estrella'
                            ? 'bg-[#5a5a40] text-white shadow-2xs'
                            : 'bg-[#f5f5f0] text-[#5a5a40] hover:bg-[#ebebe0]'
                        }`}
                      >
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        <span>{dict.menu.filterSpecial}</span>
                      </button>
                      <button
                        onClick={() => setSelectedTag('sin-gluten')}
                        className={`text-xs font-medium px-3 py-1 rounded-full transition-all cursor-pointer uppercase tracking-wider ${
                          selectedTag === 'sin-gluten'
                            ? 'bg-[#5a5a40] text-white shadow-2xs'
                            : 'bg-[#f5f5f0] text-[#5a5a40] hover:bg-[#ebebe0]'
                        }`}
                      >
                        {dict.menu.filterGlutenFree}
                      </button>
                      <button
                        onClick={() => setSelectedTag('vegetariano')}
                        className={`text-xs font-medium px-3 py-1 rounded-full transition-all cursor-pointer uppercase tracking-wider ${
                          selectedTag === 'vegetariano'
                            ? 'bg-[#5a5a40] text-white shadow-2xs'
                            : 'bg-[#f5f5f0] text-[#5a5a40] hover:bg-[#ebebe0]'
                        }`}
                      >
                        {dict.menu.filterVeg}
                      </button>
                      <button
                        onClick={() => setSelectedTag('vegano')}
                        className={`text-xs font-medium px-3 py-1 rounded-full transition-all cursor-pointer uppercase tracking-wider ${
                          selectedTag === 'vegano'
                            ? 'bg-[#5a5a40] text-white shadow-2xs'
                            : 'bg-[#f5f5f0] text-[#5a5a40] hover:bg-[#ebebe0]'
                        }`}
                      >
                        {dict.menu.filterVegan}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Dishes View / Menu Content Column */}
            <main id="menu-dishes-view" className="lg:col-span-8 scroll-mt-24 sm:scroll-mt-28">
              {/* Active Section Info Bar with navigation */}
              <div className="flex items-center justify-between bg-white px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-2xl border border-[#5a5a40]/15 mb-4 sm:mb-6 print:hidden shadow-2xs">
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-[#5a5a40] font-sans min-w-0">
                  <span className="font-semibold text-[#8a8a7a] hidden sm:inline">{dict.menu.activeSection}:</span>
                  <span className="font-bold text-[#2d2d24] truncate">
                    {getPageLabels(selectedPageNumber).tabTitle}
                  </span>
                  <span className="text-[11px] text-[#7a7a6b] font-medium shrink-0">
                    ({dict.menu.pageIndicator
                      ? dict.menu.pageIndicator.replace('{current}', String(selectedPageNumber)).replace('{total}', '8')
                      : `${selectedPageNumber} de 8`})
                  </span>
                </div>

                {/* Prev / Next Navigation Controls */}
                <div className="flex items-center gap-1 sm:gap-1.5 font-sans shrink-0">
                  <button
                    onClick={() => {
                      const activePage = PDF_MENU_PAGES.find((p) => p.pageNumber === selectedPageNumber);
                      if (activePage) {
                        generateAndDownloadCurrentSectionPdf(activePage, language);
                      }
                    }}
                    className="p-1.5 sm:px-2.5 sm:py-1 text-xs rounded-lg border border-[#5a5a40]/20 text-[#5a5a40] font-medium hover:bg-[#f0f0ea] transition-colors cursor-pointer flex items-center gap-1"
                    title={dict.menu.downloadSectionPdf}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">{dict.menu.pdfSection}</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPageNumber((prev) => Math.max(1, prev - 1));
                      scrollToContent();
                    }}
                    disabled={selectedPageNumber <= 1}
                    className="p-1.5 sm:px-2.5 sm:py-1 text-xs rounded-lg border border-[#5a5a40]/20 text-[#5a5a40] font-medium hover:bg-[#f0f0ea] disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer flex items-center gap-1"
                    title={dict.menu.prev}
                    aria-label={dict.menu.prev}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{dict.menu.prev}</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPageNumber((prev) => Math.min(8, prev + 1));
                      scrollToContent();
                    }}
                    disabled={selectedPageNumber >= 8}
                    className="p-1.5 sm:px-2.5 sm:py-1 text-xs rounded-lg border border-[#5a5a40]/20 text-[#5a5a40] font-medium hover:bg-[#f0f0ea] disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer flex items-center gap-1"
                    title={dict.menu.next}
                    aria-label={dict.menu.next}
                  >
                    <span className="hidden sm:inline">{dict.menu.next}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Empty State */}
              {filteredPages.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-[#5a5a40]/15 p-8 max-w-xl mx-auto shadow-xs">
                  <UtensilsCrossed className="w-10 h-10 text-[#5a5a40] mx-auto mb-3 opacity-60" />
                  <h3 className="font-serif text-lg font-light text-[#3d3d33] mb-1">
                    {dict.menu.noDishesFound}
                  </h3>
                  <p className="text-sm text-[#8a8a7a] mb-4">
                    {dict.menu.noDishesDesc}
                  </p>
                  <button
                    onClick={() => setSelectedTag('todos')}
                    className="text-xs font-sans uppercase tracking-wider text-[#5a5a40] underline hover:text-[#4a4a30] cursor-pointer"
                  >
                    {dict.menu.resetFilters}
                  </button>
                </div>
              ) : (
                /* Render the Selected PDF Pages */
                <div className="space-y-12">
                  {filteredPages.map((page) => {
                    const pageLabels = getPageLabels(page.pageNumber);
                    const pageScheduleNote = getPageScheduleNote(page.pageNumber, language) || page.scheduleNote;

                    return (
                      <article
                        key={page.pageCode}
                        id={`carta-${page.pageCode}`}
                        className="bg-[#fdfcf9] rounded-2xl sm:rounded-3xl border border-[#d5d5c7] p-4 sm:p-8 lg:p-10 shadow-xs relative print:shadow-none print:border-none print:p-0 print:m-0 print:break-after-page"
                      >
                        {/* PDF Page Header */}
                        <div className="border-b-2 border-[#5a5a40]/25 pb-4 sm:pb-5 mb-6 sm:mb-8">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                            <span className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.25em] font-semibold text-[#8a8a7a]">
                              CAFÉ GAUDÍ • MATARÓ
                            </span>
                            <span className="text-[10px] sm:text-[11px] font-sans uppercase tracking-widest font-bold text-[#5a5a40] bg-[#5a5a40]/10 px-2.5 sm:px-3 py-0.5 rounded-full border border-[#5a5a40]/15">
                              {dict.menu.pageIndicator
                                ? dict.menu.pageIndicator.replace('{current}', String(page.pageNumber)).replace('{total}', '8')
                                : `Página ${page.pageNumber} de 8`}
                            </span>
                          </div>

                          <h3 className="font-serif text-xl sm:text-3xl font-medium text-[#2d2d24] tracking-tight leading-snug">
                            {pageLabels.title || pageLabels.tabTitle}
                          </h3>

                          {/* Schedule note / Terms notice */}
                          {pageScheduleNote && (
                            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-sans">
                              <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                              <span className="font-medium leading-relaxed">{pageScheduleNote}</span>
                            </div>
                          )}
                        </div>

                        {/* Sub-sections of this page */}
                        <div className="space-y-6">
                          {page.sections.map((section) => {
                            const transSection = dict.menu.sections?.[section.title];
                            const sectionTitle = transSection?.title || section.title;
                            const sectionSubtitle = transSection?.subtitle || section.subtitle;

                            return (
                              <section key={section.title} className="last:mb-0">
                                {/* Section Title Header */}
                                <div className="flex items-center gap-3 mb-2.5">
                                  <div className="h-px bg-[#5a5a40]/25 flex-1" />
                                  <h4 className="font-serif text-sm sm:text-lg font-medium text-[#4a4a35] tracking-wide text-center px-2 uppercase">
                                    {sectionTitle}
                                  </h4>
                                  <div className="h-px bg-[#5a5a40]/25 flex-1" />
                                </div>

                                {sectionSubtitle && (
                                  <p className="text-xs font-sans text-center text-[#7a7a6b] italic mb-3 -mt-1">
                                    {sectionSubtitle}
                                  </p>
                                )}

                                {/* Items in classic responsive menu format */}
                                <div className="divide-y divide-[#5a5a40]/15">
                                  {section.items.map((item) => {
                                    const qty = getItemQuantity(item.id);
                                    const isAvailable = availabilityMap[item.id] !== false;
                                    const effectivePrice = priceOverrides[item.id] !== undefined ? priceOverrides[item.id] : item.price;
                                    const dish = getTranslatedMenuItem(item, language);

                                    return (
                                      <div
                                        key={item.id}
                                        id={`menu-row-${item.id}`}
                                        className={`py-2.5 sm:py-3 px-2 sm:px-3 rounded-xl transition-colors ${
                                          !isAvailable
                                            ? 'opacity-60 bg-stone-50'
                                            : 'hover:bg-[#f6f6ef]/80'
                                        }`}
                                      >
                                        {/* Dish Title & Price Row */}
                                        <div className="flex items-start sm:items-baseline justify-between gap-2 sm:gap-3 min-w-0">
                                          <div className="flex items-baseline flex-wrap gap-x-2 gap-y-0.5 min-w-0 flex-1">
                                            <h5
                                              className="font-serif text-sm sm:text-base font-semibold text-[#2d2d24] leading-snug break-words"
                                              title={dish.name}
                                            >
                                              {dish.name}
                                            </h5>

                                            {/* Badges */}
                                            {item.tags?.includes('novedad') && (
                                              <span className="bg-amber-600 text-white text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded shrink-0 whitespace-nowrap">
                                                {dict.menu.new}
                                              </span>
                                            )}
                                            {item.popular && (
                                              <span className="bg-[#5a5a40] text-white text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded shrink-0 flex items-center gap-0.5 whitespace-nowrap">
                                                <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                                                <span>{dict.menu.speciality}</span>
                                              </span>
                                            )}
                                            {!isAvailable && (
                                              <span className="bg-red-100 text-red-700 text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded shrink-0 whitespace-nowrap">
                                                {dict.menu.soldOut}
                                              </span>
                                            )}
                                          </div>

                                          {/* Classic Dotted Leader Line (hidden on very small mobile) */}
                                          <div className="hidden sm:block flex-1 min-w-3 border-b border-dotted border-[#8a8a7a]/35 mx-1 mb-1 self-end" />

                                          {/* Primary Price & Add to Order action */}
                                          <div className="shrink-0 flex items-center gap-2 text-right pl-1 self-start sm:self-auto">
                                            <span className="font-serif text-sm sm:text-base font-bold text-[#5a5a40] whitespace-nowrap tabular-nums">
                                              {effectivePrice.toFixed(2)} €
                                            </span>

                                            {/* Comanda Order Stepper / Button */}
                                            {isAvailable && (
                                              <div className="print:hidden">
                                                {qty === 0 ? (
                                                  <button
                                                    onClick={() => onUpdateQuantity(item, 1)}
                                                    className="w-7 h-7 rounded-full bg-[#f0f0ea] hover:bg-[#5a5a40] text-[#5a5a40] hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                                                    title={dict.menu.addToOrder}
                                                    aria-label={`${dict.menu.addToOrder}: ${dish.name}`}
                                                  >
                                                    <Plus className="w-3.5 h-3.5" />
                                                  </button>
                                                ) : (
                                                  <div className="flex items-center gap-1 bg-[#e8e8de] px-1.5 py-0.5 rounded-full border border-[#5a5a40]/20 shadow-2xs">
                                                    <button
                                                      onClick={() => onUpdateQuantity(item, -1)}
                                                      className="w-5 h-5 rounded-full hover:bg-white flex items-center justify-center text-[#5a5a40] cursor-pointer"
                                                      aria-label="Restar 1"
                                                    >
                                                      <Minus className="w-2.5 h-2.5" />
                                                    </button>
                                                    <span className="text-xs font-bold text-[#3d3d2c] w-3.5 text-center">
                                                      {qty}
                                                    </span>
                                                    <button
                                                      onClick={() => onUpdateQuantity(item, 1)}
                                                      className="w-5 h-5 rounded-full hover:bg-white flex items-center justify-center text-[#5a5a40] cursor-pointer"
                                                      aria-label="Añadir 1 más"
                                                    >
                                                      <Plus className="w-2.5 h-2.5" />
                                                    </button>
                                                  </div>
                                                )}
                                              </div>
                                            )}
                                          </div>
                                        </div>

                                        {/* Secondary Price Note / Portion Note */}
                                        {(item.priceSecondary || item.portionNote) && (
                                          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] font-sans">
                                            {item.priceSecondary && (
                                              <span className="font-semibold text-[#5a5a40] bg-[#eaeade] px-1.5 py-0.5 rounded text-[10px]">
                                                {dict.menu.format}: {item.priceSecondary}
                                              </span>
                                            )}
                                            {item.portionNote && (
                                              <span className="text-[#7a7a6b] italic text-[11px]">
                                                {item.portionNote}
                                              </span>
                                            )}
                                          </div>
                                        )}

                                        {/* Description & Allergens */}
                                        {(dish.description || (item.allergens && item.allergens.length > 0)) && (
                                          <div className="text-xs sm:text-[13px] text-[#636354] font-light leading-snug mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                                            {dish.description && <span>{dish.description}</span>}
                                            {item.allergens && item.allergens.length > 0 && (
                                              <span className="inline-flex items-center gap-1 shrink-0 my-0.5">
                                                {item.allergens.map((allId) => {
                                                  const match = ALLERGENS_LIST.find((a) => a.id === allId);
                                                  const allergenEntry = dict.allergens?.[allId];
                                                  const allergenLabel =
                                                    typeof allergenEntry === 'object' && allergenEntry !== null
                                                      ? allergenEntry.name
                                                      : typeof allergenEntry === 'string'
                                                      ? allergenEntry
                                                      : match?.label || allId;
                                                  return (
                                                    <span
                                                      key={allId}
                                                      tabIndex={0}
                                                      className="relative group inline-flex items-center justify-center w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-[#eaeae0] hover:bg-[#5a5a40] text-[10px] border border-[#5a5a40]/25 text-[#5a5a40] hover:text-white transition-all cursor-pointer select-none focus:outline-none focus:ring-1 focus:ring-[#5a5a40]"
                                                      aria-label={`Alérgeno: ${allergenLabel}`}
                                                    >
                                                      <span>{match?.icon || '⚠️'}</span>

                                                      {/* Tooltip */}
                                                      <span
                                                        role="tooltip"
                                                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:flex group-focus:flex items-center gap-1 bg-[#2b2b22] text-[#f7f7f2] text-[11px] font-sans font-medium px-2 py-0.5 rounded-md shadow-md whitespace-nowrap z-30 pointer-events-none transition-all"
                                                      >
                                                        <span className="text-xs">{match?.icon || '⚠️'}</span>
                                                        <span>{allergenLabel}</span>
                                                        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#2b2b22]" />
                                                      </span>
                                                    </span>
                                                  );
                                                })}
                                              </span>
                                            )}
                                          </div>
                                        )}

                                        {/* Wine Tasting Details */}
                                        {item.wineDetails && (
                                          <div className="mt-1.5 p-2 rounded-lg bg-[#f4f4ee] border border-[#5a5a40]/15 text-[11px] font-sans text-[#555545] space-y-0.5">
                                            {item.wineDetails.nose && (
                                              <p>
                                                <strong className="text-[#3d3d33]">{dict.menu.wineNose}</strong> {item.wineDetails.nose}
                                              </p>
                                            )}
                                            {item.wineDetails.mouth && (
                                              <p>
                                                <strong className="text-[#3d3d33]">{dict.menu.wineMouth}</strong> {item.wineDetails.mouth}
                                              </p>
                                            )}
                                            {item.wineDetails.pairing && (
                                              <p>
                                                <strong className="text-[#3d3d33]">{dict.menu.winePairing}</strong> {item.wineDetails.pairing}
                                              </p>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </section>
                            );
                          })}
                        </div>

                        {/* Page 3 Supplements Table */}
                        {page.hasSupplements && (
                          <div className="mt-8 sm:mt-10 p-4 sm:p-5 rounded-2xl bg-[#f7f6f0] border border-[#5a5a40]/25 shadow-2xs font-sans">
                            <div className="flex items-center gap-2 mb-3">
                              <Sparkles className="w-4 h-4 text-[#5a5a40]" />
                              <h4 className="text-xs font-bold uppercase tracking-wider text-[#5a5a40]">
                                {dict.menu.supplementsTitle || dict.menu.supplementsTable}
                              </h4>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-xs">
                              {currentSupplements.map((sup) => (
                                <div
                                  key={sup.name}
                                  className="flex justify-between items-center bg-white px-2.5 py-1.5 rounded-lg border border-[#5a5a40]/15"
                                >
                                  <span className="text-[#3d3d33] truncate pr-1">{sup.name}</span>
                                  <span className="font-semibold text-[#5a5a40] shrink-0">{sup.price}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Page Footer Note */}
                        {(page.footerNote || getPageFooterNote(page.pageNumber, language)) && (
                          <div className="mt-6 pt-4 border-t border-[#5a5a40]/15 text-xs text-[#7a7a6b] font-sans italic text-center">
                            {getPageFooterNote(page.pageNumber, language) || page.footerNote}
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}
            </main>
          </div>
        </ScrollReveal>
      </div>

      {/* Mobile All Sections Modal Sheet */}
      {showMobileSectionsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 print:hidden">
          <div className="bg-white w-full sm:max-w-lg rounded-t-[28px] sm:rounded-[32px] p-5 sm:p-6 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#5a5a40]/15 mb-3">
              <span className="font-serif text-lg font-semibold text-[#2d2d24] flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#5a5a40]" />
                <span>{dict.menu.sectionsTitle}</span>
              </span>
              <button
                onClick={() => setShowMobileSectionsModal(false)}
                className="text-[#8a8a7a] hover:text-[#3d3d33] p-1.5 rounded-lg cursor-pointer"
                aria-label={dict.menu.closeSectionsModal}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-2 py-2 flex-1">
              {PDF_MENU_PAGES.map((page) => {
                const isSelected = selectedPageNumber === page.pageNumber;
                const labels = getPageLabels(page.pageNumber);
                return (
                  <button
                    key={page.pageCode}
                    onClick={() => {
                      setSelectedPageNumber(page.pageNumber);
                      setShowMobileSectionsModal(false);
                      scrollToContent();
                    }}
                    className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer flex items-center justify-between border ${
                      isSelected
                        ? 'bg-[#5a5a40] text-white border-[#5a5a40] shadow-sm'
                        : 'bg-[#fcfcfa] text-[#2d2d24] border-[#5a5a40]/15 hover:bg-[#f4f4ee]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-[#e8e8de] text-[#5a5a40]'
                        }`}
                      >
                        {page.pageNumber}
                      </div>
                      <div className="min-w-0">
                        <div className="font-serif text-sm font-semibold truncate leading-tight">
                          {labels.tabTitle || page.tabTitle}
                        </div>
                        <div
                          className={`text-[11px] font-sans truncate mt-0.5 ${
                            isSelected ? 'text-[#e8e8df]' : 'text-[#7a7a6b]'
                          }`}
                        >
                          {labels.summary || page.summary}
                        </div>
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 shrink-0 ${
                        isSelected ? 'text-white' : 'text-[#8a8a7a]'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setShowMobileSectionsModal(false)}
              className="mt-3 w-full py-2.5 bg-[#f0f0ea] hover:bg-[#e4e4dc] text-[#5a5a40] rounded-xl font-sans text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              {dict.menu.closeSectionsModal}
            </button>
          </div>
        </div>
      )}

      {/* Floating sticky Order bar when items exist */}
      {totalItemCount > 0 && !orderDrawerOpen && (
        <div className="fixed bottom-6 right-6 z-40 animate-bounce-subtle print:hidden">
          <button
            id="floating-order-summary-btn"
            onClick={() => setOrderDrawerOpen(true)}
            className="bg-[#5a5a40] hover:bg-[#4a4a30] text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-full shadow-xl border border-[#6b6b50] flex items-center gap-2.5 sm:gap-3 transition-all transform hover:scale-105 cursor-pointer font-sans"
          >
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white text-[#5a5a40] flex items-center justify-center text-xs font-bold">
              {totalItemCount}
            </div>
            <div className="text-left pr-1">
              <div className="text-[10px] text-[#e2e2d8] uppercase tracking-widest font-semibold">
                {dict.orderTray.myOrder}
              </div>
              <div className="text-xs sm:text-sm font-bold text-white">{orderTotal.toFixed(2)} €</div>
            </div>
            <ShoppingBag className="w-4 h-4 text-[#e2e2d8]" />
          </button>
        </div>
      )}

      {/* Allergens Guide Modal */}
      {showAllergensModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 print:hidden">
          <div className="bg-white rounded-[28px] sm:rounded-[32px] max-w-lg w-full p-5 sm:p-8 shadow-2xl border border-[#5a5a40]/20 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-[#5a5a40]/15 mb-4">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-[#5a5a40]" />
                <h3 className="font-serif text-lg sm:text-xl font-light text-[#3d3d33]">
                  {dict.menu.allergensTitle}
                </h3>
              </div>
              <button
                onClick={() => setShowAllergensModal(false)}
                className="text-[#8a8a7a] hover:text-[#3d3d33] p-1 rounded-lg cursor-pointer"
                aria-label="Cerrar alérgenos"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#8a8a7a] mb-5 leading-relaxed font-light">
              {dict.menu.allergensSubtitle}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6 max-h-[50vh] overflow-y-auto pr-1">
              {ALLERGENS_LIST.map((all) => {
                const allergenEntry = dict.allergens?.[all.id];
                const label =
                  typeof allergenEntry === 'object' && allergenEntry !== null
                    ? allergenEntry.name
                    : typeof allergenEntry === 'string'
                    ? allergenEntry
                    : all.label;
                const desc =
                  typeof allergenEntry === 'object' && allergenEntry !== null
                    ? allergenEntry.desc
                    : '';
                return (
                  <div
                    key={all.id}
                    className="flex items-start gap-2.5 p-2.5 rounded-2xl bg-[#f5f5f0] border border-[#5a5a40]/10"
                  >
                    <span className="text-lg shrink-0 mt-0.5">{all.icon}</span>
                    <div className="text-left">
                      <span className="text-xs font-semibold text-[#3d3d33] block">{label}</span>
                      {desc && (
                        <span className="text-[11px] text-[#8a8a7a] leading-tight block mt-0.5">
                          {desc}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setShowAllergensModal(false)}
              className="w-full py-3 bg-[#5a5a40] hover:bg-[#4a4a30] text-white rounded-full font-sans text-xs uppercase tracking-widest font-semibold transition-colors shadow-xs cursor-pointer"
            >
              {dict.menu.understood}
            </button>
          </div>
        </div>
      )}

      {/* Order Drawer (Slide-over / Modal) */}
      {orderDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden print:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setOrderDrawerOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 bg-[#5a5a40] text-white flex items-center justify-between border-b border-[#4a4a30]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl font-light text-white">
                      {dict.orderTray.title}
                    </h3>
                    <p className="text-xs text-[#e2e2d8] font-sans">
                      {totalItemCount} {totalItemCount === 1 ? 'producto seleccionado' : 'productos seleccionados'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setOrderDrawerOpen(false)}
                  className="p-1.5 text-white/80 hover:text-white rounded-lg transition-colors cursor-pointer"
                  aria-label="Cerrar comanda"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Waiter Mode toggle notice */}
              <div className="p-3 sm:p-3.5 bg-[#f5f5f0] border-b border-[#5a5a40]/15 flex items-center justify-between px-4 sm:px-5 font-sans">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#5a5a40] font-medium">{dict.orderTray.tableNumber}:</span>
                  <input
                    type="text"
                    placeholder="Ej. 4 / Terraza"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-24 sm:w-28 text-xs py-1 px-2.5 bg-white border border-[#5a5a40]/20 rounded-full focus:outline-none focus:border-[#5a5a40]"
                  />
                </div>
                <button
                  onClick={() => setShowWaiterMode(!showWaiterMode)}
                  className={`text-xs px-3 py-1 rounded-full font-semibold transition-colors cursor-pointer uppercase tracking-wider ${
                    showWaiterMode
                      ? 'bg-[#5a5a40] text-white'
                      : 'bg-[#e2e2d8] text-[#5a5a40] hover:bg-[#dcdcd0]'
                  }`}
                >
                  {showWaiterMode ? dict.orderTray.normalMode : dict.orderTray.waiterMode}
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-[#5a5a40]/10">
                {order.length === 0 ? (
                  <div className="text-center py-16 text-[#8a8a7a]">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30 text-[#5a5a40]" />
                    <p className="font-serif text-lg font-light text-[#3d3d33] mb-1">
                      {dict.orderTray.empty}
                    </p>
                    <p className="text-xs text-[#8a8a7a]">
                      {dict.orderTray.emptyDesc}
                    </p>
                  </div>
                ) : (
                  order.map(({ item, quantity }) => {
                    const dish = getTranslatedMenuItem(item, language);
                    return (
                      <div key={item.id} className="py-3 sm:py-3.5 flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-[#3d3d33] truncate">
                            {dish.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-[#8a8a7a]">
                              {item.price.toFixed(2)} € / ud.
                            </span>
                            <span className="text-xs font-bold text-[#5a5a40]">
                              {(item.price * quantity).toFixed(2)} €
                            </span>
                          </div>
                        </div>

                        {/* Quantity modifier */}
                        <div className="flex items-center gap-2 bg-[#f5f5f0] px-2 py-1 rounded-full border border-[#5a5a40]/15">
                          <button
                            onClick={() => onUpdateQuantity(item, -1)}
                            className="w-5 h-5 rounded-full hover:bg-white flex items-center justify-center text-[#5a5a40] cursor-pointer"
                            aria-label="Restar"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-[#3d3d33] w-4 text-center">
                            {quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item, 1)}
                            className="w-5 h-5 rounded-full hover:bg-white flex items-center justify-center text-[#5a5a40] cursor-pointer"
                            aria-label="Sumar"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Waiter Mode High-Contrast Card */}
              {showWaiterMode && order.length > 0 && (
                <div className="m-3 sm:m-4 p-4 rounded-2xl bg-[#363628] text-white border border-[#5a5a40]">
                  <div className="text-[10px] uppercase font-sans font-bold tracking-widest text-[#dcdcd0] mb-1">
                    {dict.orderTray.waiterTicket} {tableNumber ? `• MESA ${tableNumber.toUpperCase()}` : ''}
                  </div>
                  <ul className="text-xs space-y-1.5 my-2 font-sans">
                    {order.map(({ item, quantity }) => {
                      const dish = getTranslatedMenuItem(item, language);
                      return (
                        <li key={item.id} className="flex justify-between border-b border-white/10 pb-1">
                          <span className="font-medium text-[#f5f5f0]">
                            <strong className="text-white font-bold mr-1.5 text-sm">{quantity}x</strong>
                            {dish.name}
                          </span>
                          <span className="font-semibold text-[#dcdcd0]">
                            {(item.price * quantity).toFixed(2)} €
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="flex justify-between items-center pt-2 font-bold text-sm text-white">
                    <span>{dict.orderTray.estimatedTotal}:</span>
                    <span className="text-[#dcdcd0] text-base">{orderTotal.toFixed(2)} €</span>
                  </div>
                </div>
              )}

              {/* Drawer Footer */}
              {order.length > 0 && (
                <div className="p-4 sm:p-5 bg-[#f5f5f0] border-t border-[#5a5a40]/15">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-[#8a8a7a]">{dict.orderTray.estimatedTotal}:</span>
                    <span className="text-xl font-bold font-serif text-[#3d3d33]">
                      {orderTotal.toFixed(2)} €
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 font-sans">
                    <button
                      onClick={onClearOrder}
                      className="py-2.5 px-3 bg-white hover:bg-[#e2e2d8] text-[#5a5a40] text-xs uppercase tracking-wider font-semibold rounded-full border border-[#5a5a40]/20 transition-colors cursor-pointer"
                    >
                      {dict.orderTray.clear}
                    </button>
                    <a
                      href={`https://wa.me/${(getStoredVenueSettings().whatsapp || '34685994473').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Hola Café Gaudí, quisiera consultar sobre este pedido ${tableNumber ? `(Mesa ${tableNumber})` : ''}:\n` +
                          order.map((o) => `• ${o.quantity}x ${o.item.name} (${(o.item.price * o.quantity).toFixed(2)}€)`).join('\n') +
                          `\nTotal: ${orderTotal.toFixed(2)}€`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 bg-[#5a5a40] hover:bg-[#4a4a30] text-white text-xs uppercase tracking-wider font-semibold rounded-full flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <span>{dict.orderTray.sendWhatsApp}</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
