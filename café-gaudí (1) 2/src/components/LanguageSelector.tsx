import React from 'react';
import { useLanguage, Language } from '../i18n/LanguageContext';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  className?: string;
  variant?: 'header' | 'mobile' | 'footer';
}

const LANGUAGES: { code: Language; label: string; fullName: string }[] = [
  { code: 'es', label: 'ES', fullName: 'Español' },
  { code: 'cat', label: 'CAT', fullName: 'Català' },
  { code: 'eng', label: 'ENG', fullName: 'English' },
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  className = '',
  variant = 'header',
}) => {
  const { language, setLanguage } = useLanguage();

  if (variant === 'mobile') {
    return (
      <div className={`flex flex-col gap-1.5 ${className}`}>
        <div className="flex items-center gap-1.5 text-[11px] font-sans text-[#8a8a7a] uppercase tracking-wider mb-1">
          <Globe className="w-3.5 h-3.5 text-[#5a5a40]" />
          <span>Idioma / Llengua / Language:</span>
        </div>
        <div className="grid grid-cols-3 gap-1 bg-[#e2e2d8] p-1 rounded-xl border border-[#5a5a40]/15">
          {LANGUAGES.map((lang) => {
            const isActive = language === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => setLanguage(lang.code)}
                className={`py-2 text-xs font-sans font-semibold rounded-lg transition-all text-center cursor-pointer ${
                  isActive
                    ? 'bg-[#5a5a40] text-white shadow-xs'
                    : 'text-[#5a5a40] hover:bg-white/60'
                }`}
                title={lang.fullName}
              >
                <span>{lang.label}</span>
                <span className="block text-[9px] font-normal opacity-85">
                  {lang.fullName}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Header pill switcher
  return (
    <div
      id="language-selector"
      className={`inline-flex items-center rounded-full bg-white border border-[#5a5a40]/20 p-0.5 shadow-xs font-sans text-xs ${className}`}
      role="group"
      aria-label="Seleccionar idioma / Select language"
    >
      <div className="pl-2 pr-1 text-[#8a8a7a] flex items-center justify-center">
        <Globe className="w-3.5 h-3.5 text-[#5a5a40]" />
      </div>
      {LANGUAGES.map((lang) => {
        const isActive = language === lang.code;
        return (
          <button
            key={lang.code}
            type="button"
            onClick={() => setLanguage(lang.code)}
            aria-pressed={isActive}
            className={`px-2.5 py-1 rounded-full text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
              isActive
                ? 'bg-[#5a5a40] text-white shadow-xs'
                : 'text-[#5a5a40] hover:text-[#2d2d24] hover:bg-[#f5f5f0]'
            }`}
            title={`Cambiar idioma a ${lang.fullName}`}
          >
            {lang.label}
          </button>
        );
      })}
    </div>
  );
};
