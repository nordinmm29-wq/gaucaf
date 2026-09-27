import React from 'react';
import { ConfirmationEmailConfig, Reservation } from '../types';
import { replaceEmailVariables } from '../data/adminStore';
import { Mail, Calendar, Clock, MapPin, Phone, CheckCircle2, ShieldCheck } from 'lucide-react';
import { SOCIAL_LINKS } from '../data/socialData';

interface EmailPreviewCardProps {
  config: ConfirmationEmailConfig;
  reservation?: Partial<Reservation>;
  isModal?: boolean;
}

export const EmailPreviewCard: React.FC<EmailPreviewCardProps> = ({
  config,
  reservation,
  isModal = false,
}) => {
  const sampleRes: Partial<Reservation> = reservation || {
    name: 'Carlos Martínez',
    code: 'GAUDI-7821',
    date: '2026-09-15',
    time: '14:30',
    guests: 3,
    zone: 'terraza',
    phone: '612 98 76 54',
    specialRequests: 'Mesa con sombra si es posible',
  };

  const subjectResolved = replaceEmailVariables(config.subject, sampleRes);
  const headlineResolved = replaceEmailVariables(config.headline, sampleRes);
  const greetingResolved = replaceEmailVariables(config.greetingText, sampleRes);
  const policyResolved = replaceEmailVariables(config.policyNotes, sampleRes);
  const footerResolved = replaceEmailVariables(config.footerNotes, sampleRes);
  const accentResolved = config.accentNote ? replaceEmailVariables(config.accentNote, sampleRes) : '';

  return (
    <div className={`w-full font-sans ${isModal ? '' : 'shadow-xl rounded-2xl border border-neutral-200'} overflow-hidden bg-white`}>
      {/* Email Client Header Chrome */}
      <div className="bg-[#f0f0eb] px-4 py-3 border-b border-neutral-200 text-xs">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block" />
          <span className="ml-2 font-mono text-[11px] text-[#737365]">Cliente de Correo • Vista previa en vivo</span>
        </div>

        <div className="space-y-1 text-xs text-[#3d3d33]">
          <div className="flex items-center gap-2">
            <span className="text-[#8a8a7a] w-14 font-medium">De:</span>
            <span className="font-semibold text-[#3d3d33]">
              {config.senderName} &lt;<span className="text-[#5a5a40]">{config.senderEmail}</span>&gt;
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#8a8a7a] w-14 font-medium">Para:</span>
            <span className="text-neutral-600">
              {sampleRes.name} &lt;{sampleRes.email || 'cliente@ejemplo.com'}&gt;
            </span>
          </div>
          <div className="flex items-start gap-2 pt-0.5">
            <span className="text-[#8a8a7a] w-14 font-medium">Asunto:</span>
            <span className="font-semibold text-[#22221b] flex-1">
              {subjectResolved}
            </span>
          </div>
        </div>
      </div>

      {/* Email Body Canvas */}
      <div className="p-4 sm:p-7 bg-[#fbfbf9]">
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xs border border-[#e5e5dc] overflow-hidden">
          {/* Restaurant Brand Banner */}
          <div className="bg-[#5a5a40] text-white px-6 py-6 text-center relative">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
              <span className="font-serif font-bold text-lg text-white">G</span>
            </div>
            <h1 className="font-serif text-2xl font-light tracking-wide text-white">
              CAFÉ GAUDÍ
            </h1>
            <p className="text-[11px] tracking-widest uppercase text-white/80 font-medium mt-0.5">
              Mataró • Cafetería • Tapas • Desayunos
            </p>
          </div>

          {/* Email Content */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Status indicator */}
            <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full text-xs font-semibold w-fit mx-auto border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Reserva Confirmada Oficialmente</span>
            </div>

            {/* Headline & greeting */}
            <div className="text-center space-y-2">
              <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#2d2d25]">
                {headlineResolved}
              </h2>
              <p className="text-sm text-[#5d5d4f] font-light leading-relaxed">
                {greetingResolved}
              </p>
            </div>

            {/* Reservation Summary Card */}
            <div className="bg-[#f5f5f0] rounded-2xl p-5 border border-[#5a5a40]/20 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-[#5a5a40]/15">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#8a8a7a]">
                  Localizador
                </span>
                <span className="font-mono text-base font-bold text-[#5a5a40] bg-white px-3 py-0.5 rounded-lg border border-[#5a5a40]/20">
                  #{sampleRes.code}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[#8a8a7a] block text-[11px]">Fecha y hora:</span>
                  <span className="font-semibold text-[#2d2d25]">
                    {sampleRes.date} a las {sampleRes.time} h
                  </span>
                </div>
                <div>
                  <span className="text-[#8a8a7a] block text-[11px]">Comensales:</span>
                  <span className="font-semibold text-[#2d2d25]">
                    {sampleRes.guests} {sampleRes.guests === 1 ? 'persona' : 'personas'}
                  </span>
                </div>
                <div>
                  <span className="text-[#8a8a7a] block text-[11px]">Zona asignada:</span>
                  <span className="font-semibold text-[#2d2d25]">
                    {sampleRes.zone === 'salon' ? '🍷 Salón Principal' : '🌿 Terraza Exterior'}
                  </span>
                </div>
                <div>
                  <span className="text-[#8a8a7a] block text-[11px]">Titular:</span>
                  <span className="font-semibold text-[#2d2d25]">
                    {sampleRes.name}
                  </span>
                </div>
              </div>

              {sampleRes.specialRequests && (
                <div className="pt-2 border-t border-[#5a5a40]/15 text-xs text-[#737365]">
                  <strong className="text-[#3d3d33]">Petición especial:</strong> {sampleRes.specialRequests}
                </div>
              )}
            </div>

            {/* Policy Notes Box */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3 text-xs text-[#5a5a40]">
              <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed font-light">
                <strong className="font-medium text-[#3d3d33] block mb-0.5">Puntualidad y Cortesía:</strong>
                {policyResolved}
              </div>
            </div>

            {/* Accent notice if present */}
            {accentResolved && (
              <div className="text-xs text-[#737365] bg-neutral-100 p-3 rounded-xl border border-neutral-200 text-center font-light">
                {accentResolved}
              </div>
            )}

            {/* Google Calendar Action CTA */}
            <div className="text-center pt-2">
              <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#5a5a40] text-white text-xs font-semibold uppercase tracking-wider shadow-sm">
                <Calendar className="w-4 h-4" />
                <span>{config.buttonText || 'Añadir a Google Calendar'}</span>
              </span>
            </div>

            {/* Footer with location & phone */}
            <div className="border-t border-[#e5e5dc] pt-5 text-center space-y-2 text-xs text-[#8a8a7a]">
              <div className="flex items-center justify-center gap-2 text-[#3d3d33] font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#5a5a40]" />
                <span>Carrer Germans Thos i Codina, 20, 08301 Mataró</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#5a5a40]" />
                <span className="text-[#3d3d33] font-semibold">Tel: {SOCIAL_LINKS.phone}</span>
              </div>
              <p className="text-[11px] text-[#999988] leading-tight">
                {footerResolved}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
