import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GALLERY_CATEGORIES } from '../data/galleryData';
import { getStoredGalleryPhotos } from '../data/adminStore';
import { SOCIAL_LINKS } from '../data/socialData';
import { GalleryPhoto } from '../types';
import {
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Camera,
  Star,
  ExternalLink,
  Play,
  Pause,
  Grid,
  SlidersHorizontal,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { ScrollReveal } from './ScrollReveal';

const FALLBACK_GALLERY_IMAGE = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80';

export const PhotoGallery: React.FC = () => {
  const { dict } = useLanguage();
  const [photos, setPhotos] = useState<GalleryPhoto[]>(getStoredGalleryPhotos);
  const [activeCategory, setActiveCategory] = useState<string>('todos');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  // Carousel specific state
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [visibleItemsCount, setVisibleItemsCount] = useState<number>(3);

  // Touch swipe support
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const carouselContainerRef = useRef<HTMLDivElement>(null);

  // Listen for gallery updates from the Admin panel
  useEffect(() => {
    const handleGalleryUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<GalleryPhoto[]>;
      if (customEvent.detail) {
        setPhotos(customEvent.detail);
      } else {
        setPhotos(getStoredGalleryPhotos());
      }
    };

    window.addEventListener('gaudi:gallery_updated', handleGalleryUpdate);
    return () => window.removeEventListener('gaudi:gallery_updated', handleGalleryUpdate);
  }, []);

  const filteredPhotos = photos.filter((photo) => {
    if (activeCategory === 'todos') return true;
    if (activeCategory === 'google') return !!photo.isGooglePhoto;
    return photo.category === activeCategory;
  });

  // Calculate responsive visible items
  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth < 640) {
        setVisibleItemsCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleItemsCount(2);
      } else {
        setVisibleItemsCount(3);
      }
    };

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  // Reset slide index when category changes
  useEffect(() => {
    setCurrentSlideIndex(0);
  }, [activeCategory]);

  const maxIndex = Math.max(0, filteredPhotos.length - visibleItemsCount);

  const handleNextSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const handlePrevSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Autoplay effect
  useEffect(() => {
    if (!isPlaying || viewMode !== 'carousel' || filteredPhotos.length <= visibleItemsCount) {
      return;
    }

    const timer = setInterval(() => {
      handleNextSlide();
    }, 4500);

    return () => clearInterval(timer);
  }, [isPlaying, viewMode, filteredPhotos.length, visibleItemsCount, handleNextSlide]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      // Swiped left -> Next
      handleNextSlide();
    } else if (distance < -minSwipeDistance) {
      // Swiped right -> Prev
      handlePrevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPhotoIndex === null) return;
      if (e.key === 'Escape') setSelectedPhotoIndex(null);
      if (e.key === 'ArrowRight') handleLightboxNext();
      if (e.key === 'ArrowLeft') handleLightboxPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhotoIndex, filteredPhotos]);

  const handleLightboxNext = () => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((selectedPhotoIndex + 1) % filteredPhotos.length);
  };

  const handleLightboxPrev = () => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((selectedPhotoIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
  };

  const activePhoto = selectedPhotoIndex !== null ? filteredPhotos[selectedPhotoIndex] : null;

  return (
    <section id="galeria" className="py-20 sm:py-28 bg-[#f5f5f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal distance="sm" duration={700}>
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5a5a40]/10 text-xs font-sans font-semibold text-[#5a5a40] uppercase tracking-wider mb-3">
              <Camera className="w-3.5 h-3.5 text-[#5a5a40]" />
              <span>{dict.gallery.tag}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#3d3d33] tracking-tight mb-4">
              {dict.gallery.title}
            </h2>
            <p className="text-[#8a8a7a] text-sm sm:text-base font-light">
              {dict.gallery.subtitle}
            </p>
          </div>
        </ScrollReveal>

        {/* Filter Pills & View Controls */}
        <ScrollReveal distance="sm" duration={800} delay={100}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            {/* Category Filter Pills */}
            <div className="flex items-center justify-center flex-wrap gap-2 font-sans">
              {GALLERY_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-[#5a5a40] text-white shadow-xs'
                      : 'bg-white text-[#5a5a40] border border-[#5a5a40]/15 hover:bg-[#e2e2d8]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Controls: Mode Switcher & Carousel Playback */}
            <div className="flex items-center gap-2 font-sans text-xs shrink-0">
              {viewMode === 'carousel' && filteredPhotos.length > visibleItemsCount && (
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-3 py-1.5 rounded-full border border-[#5a5a40]/20 bg-white text-[#5a5a40] hover:bg-[#e2e2d8] transition-colors flex items-center gap-1.5 cursor-pointer"
                  title={isPlaying ? 'Pausar avance automático' : 'Reanudar avance automático'}
                >
                  {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  <span className="hidden sm:inline">{isPlaying ? 'Pausa' : 'Auto'}</span>
                </button>
              )}

              <div className="flex items-center rounded-full bg-white border border-[#5a5a40]/20 p-0.5">
                <button
                  onClick={() => setViewMode('carousel')}
                  className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer ${
                    viewMode === 'carousel'
                      ? 'bg-[#5a5a40] text-white font-medium shadow-xs'
                      : 'text-[#5a5a40] hover:text-[#2d2d24]'
                  }`}
                  title="Vista Carrusel interactivo"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Carrusel</span>
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-[#5a5a40] text-white font-medium shadow-xs'
                      : 'text-[#5a5a40] hover:text-[#2d2d24]'
                  }`}
                  title="Vista Cuadrícula completa"
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span>Cuadrícula</span>
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* ========================================================= */}
        {/* CAROUSEL VIEW / GRID VIEW / EMPTY STATE                   */}
        {/* ========================================================= */}
        <ScrollReveal distance="md" duration={800} delay={200}>
          {filteredPhotos.length === 0 ? (
            <div className="bg-white/80 border border-[#5a5a40]/20 rounded-3xl p-10 sm:p-14 text-center max-w-lg mx-auto shadow-xs">
              <Camera className="w-12 h-12 text-[#5a5a40]/50 mx-auto mb-3" />
              <h4 className="font-serif text-xl text-[#2d2d24] font-medium">
                {photos.length === 0 ? 'Galería Fotográfica' : 'No hay fotografías en esta categoría'}
              </h4>
              <p className="text-xs text-[#5a5a40] font-sans mt-2 leading-relaxed">
                {photos.length === 0
                  ? 'La galería de fotos se actualizará próximamente con imágenes de nuestras especialidades culinarias, tapas y el ambiente de nuestro local en Mataró.'
                  : 'Prueba a seleccionar «Todas las fotos» en los filtros para explorar las imágenes disponibles.'}
              </p>
            </div>
          ) : viewMode === 'carousel' ? (
          <div
            className="relative"
            onMouseEnter={() => setIsPlaying(false)}
            onMouseLeave={() => setIsPlaying(true)}
          >
            {/* Carousel Navigation Arrows */}
            {filteredPhotos.length > visibleItemsCount && (
              <>
                <button
                  onClick={handlePrevSlide}
                  aria-label="Foto anterior en el carrusel"
                  className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/95 text-[#3d3d33] border border-[#5a5a40]/25 shadow-lg flex items-center justify-center hover:bg-[#5a5a40] hover:text-white transition-all cursor-pointer focus:outline-none"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNextSlide}
                  aria-label="Foto siguiente en el carrusel"
                  className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/95 text-[#3d3d33] border border-[#5a5a40]/25 shadow-lg flex items-center justify-center hover:bg-[#5a5a40] hover:text-white transition-all cursor-pointer focus:outline-none"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Carousel Overflow Window */}
            <div
              ref={carouselContainerRef}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="overflow-hidden rounded-[28px] sm:rounded-[36px] py-1"
            >
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${currentSlideIndex * (100 / visibleItemsCount)}%)`,
                }}
              >
                {filteredPhotos.map((photo, index) => (
                  <div
                    key={photo.id}
                    style={{ flex: `0 0 ${100 / visibleItemsCount}%` }}
                    className="px-2.5 sm:px-3.5"
                  >
                    <div
                      id={`gallery-carousel-item-${photo.id}`}
                      onClick={() => setSelectedPhotoIndex(index)}
                      className="relative h-72 sm:h-84 md:h-96 rounded-[28px] overflow-hidden cursor-pointer group shadow-sm hover:shadow-xl transition-all duration-300 bg-[#e2e2d8]"
                    >
                      <img
                        src={photo.imageUrl}
                        alt={photo.title}
                        loading="lazy"
                        onError={(e) => {
                          const el = e.currentTarget;
                          if (el.src !== FALLBACK_GALLERY_IMAGE) {
                            el.src = FALLBACK_GALLERY_IMAGE;
                          }
                        }}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-60 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 sm:p-6 text-white" />

                      {/* Google Verified Badge */}
                      {photo.isGooglePhoto && (
                        <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/65 backdrop-blur-xs text-white text-[11px] font-sans font-medium border border-white/20">
                          <span className="w-2 h-2 rounded-full bg-[#34a853]" />
                          <span>Google Maps • {photo.googleRating ?? 4.8} ★</span>
                        </div>
                      )}

                      {/* Expand / Maximize Icon */}
                      <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/45 backdrop-blur-xs text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md">
                        <Maximize2 className="w-4 h-4" />
                      </div>

                      {/* Caption overlay */}
                      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 text-white translate-y-0 sm:translate-y-2 group-hover:translate-y-0 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/25 backdrop-blur-xs text-[10px] font-sans uppercase tracking-wider font-semibold mb-1.5">
                          {photo.category}
                        </span>
                        <h3 className="font-serif text-base sm:text-lg font-light leading-snug drop-shadow-xs line-clamp-2">
                          {photo.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination Indicators / Thumbnails Navigation */}
            {filteredPhotos.length > 1 && (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
                <span className="text-xs font-sans text-[#7a7a6a] font-medium">
                  Foto {currentSlideIndex + 1} a{' '}
                  {Math.min(currentSlideIndex + visibleItemsCount, filteredPhotos.length)} de{' '}
                  {filteredPhotos.length}
                </span>

                {/* Dots indicator */}
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: maxIndex + 1 }).map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      onClick={() => setCurrentSlideIndex(dotIdx)}
                      aria-label={`Ir al grupo ${dotIdx + 1}`}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        currentSlideIndex === dotIdx
                          ? 'w-6 bg-[#5a5a40]'
                          : 'w-2 bg-[#5a5a40]/25 hover:bg-[#5a5a40]/50'
                      }`}
                    />
                  ))}
                </div>

                {/* Jump to specific image via quick thumbnail roll */}
                <div className="hidden md:flex items-center gap-1.5 overflow-x-auto max-w-xs py-1">
                  {filteredPhotos.map((thumb, tIdx) => (
                    <button
                      key={thumb.id}
                      onClick={() => {
                        const target = Math.min(tIdx, maxIndex);
                        setCurrentSlideIndex(target);
                      }}
                      className={`w-8 h-8 rounded-lg overflow-hidden border transition-all cursor-pointer shrink-0 ${
                        tIdx >= currentSlideIndex && tIdx < currentSlideIndex + visibleItemsCount
                          ? 'border-[#5a5a40] ring-2 ring-[#5a5a40]/30 scale-105'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                      title={thumb.title}
                    >
                      <img
                        src={thumb.imageUrl}
                        alt=""
                        onError={(e) => {
                          const el = e.currentTarget;
                          if (el.src !== FALLBACK_GALLERY_IMAGE) el.src = FALLBACK_GALLERY_IMAGE;
                        }}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ========================================================= */
          /* GRID VIEW                                                 */
          /* ========================================================= */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhotos.map((photo, index) => (
              <div
                key={photo.id}
                id={`gallery-item-${photo.id}`}
                onClick={() => setSelectedPhotoIndex(index)}
                className="relative h-64 sm:h-80 rounded-[32px] overflow-hidden cursor-pointer group shadow-sm hover:shadow-xl transition-all duration-300 bg-[#e2e2d8]"
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  loading="lazy"
                  onError={(e) => {
                    const el = e.currentTarget;
                    if (el.src !== FALLBACK_GALLERY_IMAGE) el.src = FALLBACK_GALLERY_IMAGE;
                  }}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white" />

                {/* Google Verified Badge */}
                {photo.isGooglePhoto && (
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-[11px] font-sans font-medium border border-white/20">
                    <span className="w-2 h-2 rounded-full bg-[#34a853]" />
                    <span>Google Maps • {photo.googleRating ?? 4.8} ★</span>
                  </div>
                )}

                {/* Hover overlay content */}
                <div className="absolute inset-x-0 bottom-0 p-6 text-white translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-[10px] font-sans uppercase tracking-wider font-semibold mb-2">
                    {photo.category}
                  </span>
                  <h3 className="font-serif text-lg font-light leading-snug drop-shadow-xs">
                    {photo.title}
                  </h3>
                </div>

                {/* Hover icon */}
                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-xs text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        )}
        </ScrollReveal>

        {/* Google Maps Photos Call to Action */}
        <ScrollReveal distance="sm" duration={800} delay={300}>
          <div className="mt-12 text-center">
            <a
              href={SOCIAL_LINKS.googlePlaceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#3d3d33] border border-[#5a5a40]/20 hover:bg-[#e2e2d8] text-xs font-sans uppercase tracking-wider font-semibold shadow-xs transition-colors"
            >
              <span>Ver fotos y ubicación en Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#5a5a40]" />
            </a>
          </div>
        </ScrollReveal>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 sm:p-6 backdrop-blur-md">
          {/* Top bar */}
          <div className="absolute top-4 inset-x-4 sm:inset-x-8 flex items-center justify-between text-white z-10">
            <div className="flex items-center gap-3">
              <Camera className="w-5 h-5 text-[#dcdcd0]" />
              <span className="text-sm font-mono text-[#dcdcd0]">
                {(selectedPhotoIndex ?? 0) + 1} / {filteredPhotos.length}
              </span>
              {activePhoto.isGooglePhoto && (
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/15 text-[11px] text-[#dcdcd0]">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  Foto verificada en Google Maps ({activePhoto.googleRating ?? 4.8} ★)
                </span>
              )}
            </div>

            <button
              onClick={() => setSelectedPhotoIndex(null)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Cerrar foto"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Left / Right arrow navigation */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleLightboxPrev();
            }}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer z-10"
            aria-label="Foto anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleLightboxNext();
            }}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer z-10"
            aria-label="Foto siguiente"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Photo display */}
          <div className="max-w-4xl max-h-[75vh] w-full h-full flex items-center justify-center overflow-hidden">
            <img
              src={activePhoto.imageUrl}
              alt={activePhoto.title}
              onError={(e) => {
                const el = e.currentTarget;
                if (el.src !== FALLBACK_GALLERY_IMAGE) el.src = FALLBACK_GALLERY_IMAGE;
              }}
              className="max-w-full max-h-[72vh] object-contain rounded-[24px] shadow-2xl animate-scale-up"
            />
          </div>

          {/* Caption footer */}
          <div className="mt-4 text-center max-w-2xl px-4 text-white">
            <h3 className="font-serif text-xl sm:text-2xl font-light text-white mb-1">
              {activePhoto.title}
            </h3>
            {activePhoto.description && (
              <p className="text-xs sm:text-sm text-[#dcdcd0] font-light">
                {activePhoto.description}
              </p>
            )}
            {activePhoto.authorName && (
              <p className="text-[11px] text-[#a0a090] font-sans mt-1">
                Fuente: {activePhoto.authorName}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
