import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Star,
  MessageSquare,
  ThumbsUp,
  CheckCircle2,
  ExternalLink,
  Search,
  Award,
  Sparkles,
  Coffee,
  Utensils,
  ShieldCheck,
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
} from 'lucide-react';
import { SOCIAL_LINKS, INITIAL_REVIEWS } from '../data/socialData';
import { useLanguage } from '../i18n/LanguageContext';
import { CustomerReview } from '../types';
import { ScrollReveal } from './ScrollReveal';

export const CustomerReviews: React.FC = () => {
  const { dict } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});
  const [expandedReviewId, setExpandedReviewId] = useState<string | null>(null);

  // Carousel state
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [visibleItemsCount, setVisibleItemsCount] = useState<number>(3);
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  // Categories list
  const categories = [
    { id: 'all', label: dict.reviews.filterAll, icon: Sparkles },
    { id: 'coffee', label: dict.reviews.filterCoffee, icon: Coffee },
    { id: 'burgers', label: dict.reviews.filterBurgers, icon: Utensils },
    { id: 'tapas', label: dict.reviews.filterTapas, icon: Award },
    { id: 'desserts', label: dict.reviews.filterSweets, icon: Sparkles },
    { id: 'service', label: dict.reviews.filterService, icon: ShieldCheck },
  ];

  // Responsive items count
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setVisibleItemsCount(1);
      } else if (width < 1024) {
        setVisibleItemsCount(2);
      } else {
        setVisibleItemsCount(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter reviews
  const filteredReviews = useMemo(() => {
    return INITIAL_REVIEWS.filter((rev) => {
      // Category match
      const matchesCategory =
        selectedCategory === 'all' || rev.category === selectedCategory;

      // Query match
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        rev.author.toLowerCase().includes(q) ||
        rev.comment.toLowerCase().includes(q) ||
        rev.visitType?.toLowerCase().includes(q) ||
        (rev.dishesMentioned &&
          rev.dishesMentioned.some((d) => d.toLowerCase().includes(q)));

      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  // Max index allowed
  const maxSlideIndex = Math.max(0, filteredReviews.length - visibleItemsCount);

  // Reset slide index when filter changes or when out of bounds
  useEffect(() => {
    setCurrentSlideIndex(0);
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    setCurrentSlideIndex((prev) => (prev > maxSlideIndex ? maxSlideIndex : prev));
  }, [maxSlideIndex]);

  // Carousel Next/Prev Handlers
  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : maxSlideIndex));
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev < maxSlideIndex ? prev + 1 : 0));
  };

  // Auto-play interval
  useEffect(() => {
    if (!isPlaying || filteredReviews.length <= visibleItemsCount) return;

    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev < maxSlideIndex ? prev + 1 : 0));
    }, 5000);

    return () => clearInterval(timer);
  }, [isPlaying, maxSlideIndex, filteredReviews.length, visibleItemsCount]);

  // Touch Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current === null || touchEndXRef.current === null) return;
    const distance = touchStartXRef.current - touchEndXRef.current;
    const minSwipeDistance = 45;

    if (distance > minSwipeDistance) {
      handleNextSlide();
    } else if (distance < -minSwipeDistance) {
      handlePrevSlide();
    }

    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  const toggleLike = (id: string) => {
    setLikedReviews((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section
      id="resenas"
      className="py-20 sm:py-28 bg-[#f2f2eb] relative border-t border-[#5a5a40]/15 overflow-hidden"
    >
      {/* Subtle decorative background glow */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-48 w-96 h-96 bg-[#5a5a40]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <ScrollReveal animation="fade-in" className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#5a5a40]/20 text-[#2d2e26] text-xs font-medium tracking-wide font-sans mb-4 shadow-2xs">
            <span className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            </span>
            <span className="font-semibold text-[#5a5a40]">4.8 / 5.0</span>
            <span className="text-[#8a8a7a]">•</span>
            <span className="text-[#5a5a40]">Google Maps Mataró (+700 reseñas)</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#2d2e26] font-serif tracking-tight mb-4">
            {dict.reviews.title}
          </h2>

          <p className="text-[#6a6a5a] text-sm sm:text-base font-light leading-relaxed max-w-2xl mx-auto">
            {dict.reviews.subtitle}
          </p>
        </ScrollReveal>

        {/* Search and Category Filters Bar */}
        <div className="mb-8 space-y-4">
          {/* Search Box */}
          <div className="relative max-w-xl mx-auto">
            <Search className="w-4 h-4 text-[#8a8a7a] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="reviews-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={dict.reviews.searchPlaceholder}
              className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white border border-[#5a5a40]/20 text-xs sm:text-sm text-[#2d2e26] placeholder-[#a0a090] focus:outline-none focus:border-[#5a5a40] focus:ring-2 focus:ring-[#5a5a40]/10 transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#8a8a7a] hover:text-[#2d2e26] cursor-pointer"
                aria-label="Limpiar búsqueda"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter Pills & Carousel Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            {/* Category Filter Pills */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    id={`review-filter-${cat.id}`}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-medium font-sans transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#5a5a40] text-white shadow-xs'
                        : 'bg-white text-[#6a6a5a] border border-[#5a5a40]/15 hover:border-[#5a5a40]/30 hover:bg-[#f9f9f5]'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : 'text-[#8a8a7a]'}`} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Play/Pause & Counter */}
            <div className="flex items-center gap-2 shrink-0">
              {filteredReviews.length > visibleItemsCount && (
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-3 py-1.5 rounded-full border border-[#5a5a40]/20 bg-white text-[#5a5a40] hover:bg-[#e2e2d8] transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
                  title={isPlaying ? 'Pausar carrusel' : 'Reanudar avance automático'}
                >
                  {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  <span>{isPlaying ? 'Pausa' : 'Auto'}</span>
                </button>
              )}

              <a
                href={SOCIAL_LINKS.googleReviews}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[#5a5a40] font-medium hover:underline bg-white px-3 py-1.5 rounded-full border border-[#5a5a40]/20"
              >
                <span>Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CAROUSEL CONTAINER                                        */}
        {/* ========================================================= */}
        {filteredReviews.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#5a5a40]/15 max-w-md mx-auto p-8">
            <Search className="w-10 h-10 text-[#a0a090] mx-auto mb-3" />
            <h3 className="font-serif text-lg text-[#2d2e26] mb-1">No se encontraron reseñas</h3>
            <p className="text-xs text-[#8a8a7a] mb-4">
              Prueba con otro término de búsqueda o selecciona otra categoría.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-[#5a5a40] text-white text-xs font-semibold rounded-xl hover:bg-[#4a4a30] transition-colors cursor-pointer"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div
            className="relative"
            onMouseEnter={() => setIsPlaying(false)}
            onMouseLeave={() => setIsPlaying(true)}
          >
            {/* Carousel Side Navigation Arrows */}
            {filteredReviews.length > visibleItemsCount && (
              <>
                <button
                  onClick={handlePrevSlide}
                  aria-label="Reseña anterior"
                  className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white text-[#3d3d33] border border-[#5a5a40]/25 shadow-md flex items-center justify-center hover:bg-[#5a5a40] hover:text-white transition-all cursor-pointer focus:outline-none"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNextSlide}
                  aria-label="Reseña siguiente"
                  className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white text-[#3d3d33] border border-[#5a5a40]/25 shadow-md flex items-center justify-center hover:bg-[#5a5a40] hover:text-white transition-all cursor-pointer focus:outline-none"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Carousel Window */}
            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="overflow-hidden py-3 px-1"
            >
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${currentSlideIndex * (100 / visibleItemsCount)}%)`,
                }}
              >
                {filteredReviews.map((rev) => {
                  const isLiked = !!likedReviews[rev.id];
                  const isExpanded = expandedReviewId === rev.id;
                  const hasLongComment = rev.comment.length > 200;

                  return (
                    <div
                      key={rev.id}
                      className="px-2.5 sm:px-3 shrink-0"
                      style={{ width: `${100 / visibleItemsCount}%` }}
                    >
                      <article
                        id={`review-card-${rev.id}`}
                        className="bg-white rounded-3xl p-6 sm:p-7 border border-[#5a5a40]/15 shadow-xs hover:shadow-md hover:border-[#5a5a40]/30 transition-all flex flex-col justify-between h-full group"
                      >
                        <div>
                          {/* Reviewer Header */}
                          <div className="flex items-start justify-between gap-3 mb-4">
                            <div className="flex items-center gap-3">
                              {/* Avatar */}
                              <div className="relative shrink-0">
                                {rev.avatar ? (
                                  <img
                                    src={rev.avatar}
                                    alt={rev.author}
                                    className="w-11 h-11 rounded-full object-cover border border-[#5a5a40]/20"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <div className="w-11 h-11 rounded-full bg-[#5a5a40] text-white flex items-center justify-center font-serif text-base font-semibold">
                                    {rev.author.charAt(0)}
                                  </div>
                                )}

                                {/* Google Logo Mini badge */}
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white shadow-xs border border-gray-100 flex items-center justify-center p-0.5">
                                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                                    <path
                                      fill="#4285F4"
                                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                      fill="#34A853"
                                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                      fill="#FBBC05"
                                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                                    />
                                    <path
                                      fill="#EA4335"
                                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                    />
                                  </svg>
                                </div>
                              </div>

                              {/* Author Name and Local Guide Info */}
                              <div>
                                <h3 className="font-serif font-medium text-sm sm:text-base text-[#2d2e26] leading-snug">
                                  {rev.author}
                                </h3>

                                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#8a8a7a]">
                                  {rev.isLocalGuide && (
                                    <span className="inline-flex items-center gap-0.5 text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200/60">
                                      <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-600" />
                                      <span>{dict.reviews.localGuide}</span>
                                    </span>
                                  )}
                                  {rev.reviewCount && (
                                    <span>• {rev.reviewCount} {dict.reviews.reviewsCount}</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Visit badge */}
                            {rev.visitType && (
                              <span className="text-[10px] uppercase font-sans font-semibold tracking-wider text-[#5a5a40] bg-[#f5f5f0] px-2 py-0.5 rounded-full border border-[#5a5a40]/10 shrink-0">
                                {rev.visitType}
                              </span>
                            )}
                          </div>

                          {/* Star Rating and Date */}
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <div className="flex items-center text-amber-400 gap-0.5">
                              {[...Array(rev.rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                              ))}
                            </div>
                            <span className="text-[11px] text-[#8a8a7a] font-sans">
                              {rev.date}
                            </span>
                          </div>

                          {/* Comment text */}
                          <p className="text-xs sm:text-sm text-[#4a4a3c] font-light leading-relaxed mb-4">
                            &ldquo;{isExpanded || !hasLongComment
                              ? rev.comment
                              : `${rev.comment.substring(0, 190)}...`}&rdquo;
                          </p>

                          {hasLongComment && (
                            <button
                              onClick={() =>
                                setExpandedReviewId(isExpanded ? null : rev.id)
                              }
                              className="text-[11px] font-semibold text-[#5a5a40] hover:underline mb-4 block cursor-pointer"
                            >
                              {isExpanded ? 'Leer menos' : 'Leer reseña completa'}
                            </button>
                          )}

                          {/* Dishes mentioned tags */}
                          {rev.dishesMentioned && rev.dishesMentioned.length > 0 && (
                            <div className="mb-4 pt-3 border-t border-gray-100">
                              <span className="text-[10px] uppercase tracking-wider text-[#8a8a7a] block mb-1.5 font-medium">
                                {dict.reviews.dishesRecommended}
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {rev.dishesMentioned.map((dish, i) => (
                                  <span
                                    key={i}
                                    className="text-[11px] bg-[#f5f5f0] text-[#5a5a40] px-2 py-0.5 rounded-md border border-[#5a5a40]/10 font-medium"
                                  >
                                    {dish}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Response from Owner */}
                          {rev.responseFromOwner && (
                            <div className="mt-3 p-3 rounded-2xl bg-[#fafaf6] border border-[#5a5a40]/15 text-xs text-[#5a5a40]">
                              <div className="flex items-center gap-1.5 font-semibold text-[11px] text-[#2d2e26] mb-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>{dict.reviews.responseFromOwner}</span>
                                <span className="text-[10px] text-[#8a8a7a] font-normal">
                                  ({rev.responseFromOwner.date})
                                </span>
                              </div>
                              <p className="text-[11px] text-[#6a6a5a] italic leading-relaxed">
                                {rev.responseFromOwner.text}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Bottom Card Footer with Likes and Verification */}
                        <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs text-[#8a8a7a]">
                          <div className="flex items-center gap-1 text-[11px] text-emerald-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Verificada en Google</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              id={`like-review-btn-${rev.id}`}
                              onClick={() => toggleLike(rev.id)}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] transition-colors cursor-pointer ${
                                isLiked
                                  ? 'bg-amber-100 text-amber-800 font-semibold'
                                  : 'bg-gray-50 hover:bg-gray-100 text-[#6a6a5a]'
                              }`}
                              title="¿Te ha parecido útil esta opinión?"
                            >
                              <ThumbsUp className={`w-3 h-3 ${isLiked ? 'fill-amber-600 text-amber-600' : ''}`} />
                              <span>{(rev.likesCount || 0) + (isLiked ? 1 : 0)}</span>
                            </button>

                            <a
                              href={SOCIAL_LINKS.googleReviews}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 text-[#8a8a7a] hover:text-[#5a5a40] transition-colors"
                              title="Ver en Google Maps"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      </article>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Carousel Pagination Dots */}
            {filteredReviews.length > visibleItemsCount && (
              <div className="flex items-center justify-center gap-2 mt-6">
                {Array.from({ length: maxSlideIndex + 1 }).map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    onClick={() => setCurrentSlideIndex(dotIdx)}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      currentSlideIndex === dotIdx
                        ? 'w-7 bg-[#5a5a40]'
                        : 'w-2.5 bg-[#5a5a40]/25 hover:bg-[#5a5a40]/50'
                    }`}
                    aria-label={`Ir al grupo de reseñas ${dotIdx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bottom Callout Banner */}
        <ScrollReveal animation="fade-in" delay={150} className="mt-12">
          <div className="bg-[#2d2e26] text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border border-[#5a5a40]/30 shadow-lg">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-400/30">
                <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
              </div>
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-light">
                  ¿Nos has visitado recientemente en Carrer Germans Thos i Codina?
                </h3>
                <p className="text-xs sm:text-sm text-[#a0a090] font-light mt-0.5">
                  Tu opinión nos ayuda a seguir mejorando cada día. ¡Comparte tu experiencia en Google!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 flex-wrap justify-center">
              <a
                id="cta-bottom-view-reviews"
                href={SOCIAL_LINKS.googleReviews}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold uppercase tracking-wider transition-all border border-white/20 flex items-center gap-2 cursor-pointer font-sans"
              >
                <ExternalLink className="w-4 h-4" />
                <span>{dict.reviews.viewAllOnGoogle}</span>
              </a>

              <a
                id="cta-bottom-leave-review"
                href={SOCIAL_LINKS.writeReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-[#2d2e26] text-xs font-semibold uppercase tracking-wider transition-all shadow-sm flex items-center gap-2 cursor-pointer font-sans"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{dict.reviews.writeReview}</span>
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
