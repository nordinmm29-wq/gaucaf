import { ConfirmationEmailConfig, Reservation, SmtpSettings } from '../types';
import { replaceEmailVariables } from './adminStore';

export function generateReservationEmailHtml(config: ConfirmationEmailConfig, res: Reservation): string {
  const headline = replaceEmailVariables(config.headline, res);
  const greeting = replaceEmailVariables(config.greetingText, res);
  const policy = replaceEmailVariables(config.policyNotes, res);
  const footer = replaceEmailVariables(config.footerNotes, res);
  const accentNote = config.accentNote ? replaceEmailVariables(config.accentNote, res) : '';

  const zoneName = res.zone === 'salon' ? 'Salón Principal Climatizado' : 'Terraza Exterior';

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación de Reserva - Café Gaudí</title>
</head>
<body style="margin:0; padding:0; background-color:#f5f5f0; font-family:'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing:antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f5f5f0; padding: 24px 12px;">
    <tr>
      <td align="center">
        <!-- Container -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e2d8;">
          
          <!-- Header Branding -->
          <tr>
            <td style="background-color: #3d3d33; padding: 32px 24px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 300; letter-spacing: 3px; text-transform: uppercase;">
                Café Gaudí
              </h1>
              <p style="margin: 6px 0 0 0; color: #d4d4aa; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">
                Mataró • Carrer Germans Thos i Codina, 20
              </p>
            </td>
          </tr>

          <!-- Confirmation Badge -->
          <tr>
            <td style="padding: 28px 24px 8px 24px; text-align: center;">
              <div style="display: inline-block; background-color: #eaf5eb; color: #2e7d32; border: 1px solid #c8e6c9; padding: 6px 16px; border-radius: 20px; font-size: 11px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase;">
                ✓ Reserva Confirmada
              </div>
              <h2 style="margin: 16px 0 8px 0; color: #3d3d33; font-size: 22px; font-weight: 400; line-height: 1.3;">
                ${headline}
              </h2>
              <p style="margin: 0; color: #737365; font-size: 14px; line-height: 1.6;">
                ${greeting}
              </p>
            </td>
          </tr>

          <!-- Ticket Box with Details -->
          <tr>
            <td style="padding: 16px 24px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f9f9f6; border: 1px solid #e8e8df; border-radius: 16px; padding: 20px;">
                <tr>
                  <td style="padding-bottom: 14px; border-bottom: 1px dashed #dcdcd0;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="color: #8a8a7a; font-size: 11px; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">
                          Localizador
                        </td>
                        <td align="right" style="font-family: monospace; font-size: 16px; font-weight: bold; color: #5a5a40;">
                          #${res.code}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding-top: 14px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="6">
                      <tr>
                        <td width="35%" style="color: #8a8a7a; font-size: 12px;">Fecha de Reserva:</td>
                        <td style="color: #3d3d33; font-size: 13px; font-weight: bold;">${res.date}</td>
                      </tr>
                      <tr>
                        <td style="color: #8a8a7a; font-size: 12px;">Hora:</td>
                        <td style="color: #3d3d33; font-size: 13px; font-weight: bold;">${res.time} h</td>
                      </tr>
                      <tr>
                        <td style="color: #8a8a7a; font-size: 12px;">Comensales:</td>
                        <td style="color: #3d3d33; font-size: 13px; font-weight: bold;">${res.guests} ${res.guests === 1 ? 'persona' : 'personas'}</td>
                      </tr>
                      <tr>
                        <td style="color: #8a8a7a; font-size: 12px;">Zona Asignada:</td>
                        <td style="color: #3d3d33; font-size: 13px; font-weight: bold;">${zoneName}</td>
                      </tr>
                      <tr>
                        <td style="color: #8a8a7a; font-size: 12px;">Titular:</td>
                        <td style="color: #3d3d33; font-size: 13px;">${res.name}</td>
                      </tr>
                      <tr>
                        <td style="color: #8a8a7a; font-size: 12px;">Teléfono:</td>
                        <td style="color: #3d3d33; font-size: 13px;">${res.phone}</td>
                      </tr>
                      ${res.specialRequests ? `
                      <tr>
                        <td style="color: #8a8a7a; font-size: 12px; vertical-align: top;">Petición especial:</td>
                        <td style="color: #5a5a40; font-size: 12px; font-style: italic;">"${res.specialRequests}"</td>
                      </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Courtesy & Notes -->
          <tr>
            <td style="padding: 8px 24px 16px 24px;">
              <div style="background-color: #fff9e6; border-left: 4px solid #d4a017; padding: 12px 16px; border-radius: 6px; font-size: 12px; color: #6b5200; line-height: 1.5;">
                <strong>Puntualidad:</strong> ${policy}
              </div>
              ${accentNote ? `
              <div style="margin-top: 10px; font-size: 12px; color: #737365; line-height: 1.5;">
                ℹ️ ${accentNote}
              </div>
              ` : ''}
            </td>
          </tr>

          <!-- Actions -->
          <tr>
            <td style="padding: 16px 24px 28px 24px; text-align: center;">
              <a href="https://maps.google.com/?q=Carrer+Germans+Thos+i+Codina+20+Mataró" target="_blank" style="display: inline-block; background-color: #5a5a40; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 30px; font-size: 12px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase;">
                Ver Ubicación en Google Maps
              </a>
              <div style="margin-top: 14px;">
                <a href="tel:931459019" style="color: #5a5a40; text-decoration: underline; font-size: 12px;">
                  ¿Necesitas modificar la reserva? Llámanos al 931 45 90 19
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f5f5f0; padding: 20px 24px; text-align: center; border-top: 1px solid #e2e2d8;">
              <p style="margin: 0; color: #8a8a7a; font-size: 11px; line-height: 1.5;">
                ${footer}
              </p>
              <p style="margin: 6px 0 0 0; color: #b0b0a0; font-size: 10px;">
                Este correo confirma tu solicitud en el sistema de reservas de Café Gaudí.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export function generateReservationEmailText(config: ConfirmationEmailConfig, res: Reservation): string {
  const headline = replaceEmailVariables(config.headline, res);
  const greeting = replaceEmailVariables(config.greetingText, res);
  const policy = replaceEmailVariables(config.policyNotes, res);
  const footer = replaceEmailVariables(config.footerNotes, res);

  return `
CAFÉ GAUDÍ - RESERVA CONFIRMADA
=======================================
Código de Reserva: #${res.code}

${headline}

${greeting}

DETALLES DE LA RESERVA:
-----------------------
- Fecha: ${res.date}
- Hora: ${res.time} h
- Personas: ${res.guests}
- Zona: ${res.zone === 'salon' ? 'Salón Principal' : 'Terraza Exterior'}
- Titular: ${res.name}
- Teléfono: ${res.phone}
${res.specialRequests ? `- Peticiones: ${res.specialRequests}\n` : ''}

INFORMACIÓN IMPORTANTE:
-----------------------
${policy}

DIRECCIÓN & CONTACTO:
${footer}
Teléfono: 931 45 90 19
Ubicación: Carrer Germans Thos i Codina, 20, 08301 Mataró (Barcelona)
`.trim();
}

export interface SendEmailResult {
  success: boolean;
  provider?: string;
  previewUrl?: string;
  messageId?: string;
  isTestMode?: boolean;
  isSimulated?: boolean;
  isPendingSetup?: boolean;
  error?: string;
  message?: string;
}

export async function sendReservationEmail(
  res: Reservation,
  config: ConfirmationEmailConfig,
  smtpSettings?: SmtpSettings
): Promise<SendEmailResult> {
  const subject = replaceEmailVariables(config.subject, res);
  const html = generateReservationEmailHtml(config, res);
  const text = generateReservationEmailText(config, res);

  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: res.email,
        subject,
        html,
        text,
        reservationCode: res.code,
        smtpConfig: smtpSettings || undefined,
      }),
    });

    const data = await response.json();
    return data;
  } catch (err: any) {
    console.error('Error invoking /api/send-email:', err);
    return {
      success: false,
      error: err.message || 'Error de conexión con el servidor de correo',
    };
  }
}

export function generateMailtoLink(res: Reservation, config: ConfirmationEmailConfig): string {
  const subject = encodeURIComponent(replaceEmailVariables(config.subject, res));
  const body = encodeURIComponent(generateReservationEmailText(config, res));
  return `mailto:${encodeURIComponent(res.email)}?subject=${subject}&body=${body}`;
}
