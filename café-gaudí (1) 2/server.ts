import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import nodemailer from 'nodemailer';

interface EmailLogEntry {
  id: string;
  timestamp: string;
  recipient: string;
  subject: string;
  reservationCode?: string;
  status: 'enviado' | 'fallido' | 'simulado' | 'ethereal' | 'sin_configuracion';
  provider: string;
  messageId?: string;
  error?: string;
  previewUrl?: string;
}

interface ServerSmtpSettings {
  host?: string;
  port?: number;
  secure?: boolean;
  user?: string;
  pass?: string;
  fromName?: string;
  fromEmail?: string;
  resendApiKey?: string;
  notificationEmail?: string;
}

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Persistent files
const LOGS_FILE = path.join(process.cwd(), 'email_delivery_logs.json');
const SMTP_FILE = path.join(process.cwd(), 'smtp_config.json');

let deliveryLogs: EmailLogEntry[] = [];
let serverSmtpSettings: ServerSmtpSettings = {};

// Load saved SMTP settings
try {
  if (fs.existsSync(SMTP_FILE)) {
    const rawSmtp = fs.readFileSync(SMTP_FILE, 'utf-8');
    serverSmtpSettings = JSON.parse(rawSmtp);
  }
} catch (e) {
  console.warn('Could not read existing SMTP config:', e);
}

function saveServerSmtpSettings(settings: ServerSmtpSettings) {
  try {
    serverSmtpSettings = { ...serverSmtpSettings, ...settings };
    fs.writeFileSync(SMTP_FILE, JSON.stringify(serverSmtpSettings, null, 2), 'utf-8');
    return true;
  } catch (e) {
    console.error('Could not persist SMTP settings:', e);
    return false;
  }
}

// Load logs
try {
  if (fs.existsSync(LOGS_FILE)) {
    const raw = fs.readFileSync(LOGS_FILE, 'utf-8');
    deliveryLogs = JSON.parse(raw);
  }
} catch (e) {
  console.warn('Could not read existing email logs:', e);
}

function saveLogs() {
  try {
    fs.writeFileSync(LOGS_FILE, JSON.stringify(deliveryLogs.slice(0, 100), null, 2), 'utf-8');
  } catch (e) {
    console.warn('Could not persist email logs:', e);
  }
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get effective SMTP / Email configuration
app.get('/api/email/config', (req, res) => {
  const effectiveHost = serverSmtpSettings.host || process.env.SMTP_HOST || '';
  const effectiveUser = serverSmtpSettings.user || process.env.SMTP_USER || '';
  const effectivePort = serverSmtpSettings.port || Number(process.env.SMTP_PORT || 587);
  const effectiveSecure = serverSmtpSettings.secure ?? (process.env.SMTP_SECURE === 'true' || effectivePort === 465);
  const effectiveFromName = serverSmtpSettings.fromName || 'Café Gaudí';
  const effectiveFromEmail = serverSmtpSettings.fromEmail || process.env.SMTP_FROM || (effectiveUser || 'reservas@cafegaudi.com');
  const effectiveResendKey = serverSmtpSettings.resendApiKey || process.env.RESEND_API_KEY || '';
  const effectiveNotificationEmail = serverSmtpSettings.notificationEmail || process.env.ADMIN_NOTIFICATION_EMAIL || 'nordinmm28@gmail.com';

  res.json({
    host: effectiveHost,
    port: effectivePort,
    secure: effectiveSecure,
    user: effectiveUser,
    hasPass: Boolean(serverSmtpSettings.pass || process.env.SMTP_PASS),
    pass: serverSmtpSettings.pass || process.env.SMTP_PASS || '',
    fromName: effectiveFromName,
    fromEmail: effectiveFromEmail,
    resendApiKey: effectiveResendKey,
    notificationEmail: effectiveNotificationEmail,
    isConfigured: Boolean(effectiveResendKey || (effectiveHost && effectiveUser && (serverSmtpSettings.pass || process.env.SMTP_PASS))),
  });
});

// Save SMTP settings from Admin Panel
app.post('/api/email/config', (req, res) => {
  const { host, port, secure, user, pass, fromName, fromEmail, resendApiKey, notificationEmail } = req.body;
  const updated: ServerSmtpSettings = {
    host: host ? String(host).trim() : undefined,
    port: port ? Number(port) : 587,
    secure: Boolean(secure),
    user: user ? String(user).trim() : undefined,
    pass: pass !== undefined ? String(pass).trim() : serverSmtpSettings.pass,
    fromName: fromName ? String(fromName).trim() : 'Café Gaudí',
    fromEmail: fromEmail ? String(fromEmail).trim() : undefined,
    resendApiKey: resendApiKey !== undefined ? String(resendApiKey).trim() : serverSmtpSettings.resendApiKey,
    notificationEmail: notificationEmail ? String(notificationEmail).trim() : undefined,
  };

  const success = saveServerSmtpSettings(updated);
  if (success) {
    res.json({ success: true, message: 'Configuración de correo guardada en el servidor con éxito' });
  } else {
    res.status(500).json({ success: false, error: 'No se pudo guardar la configuración en el servidor' });
  }
});

// Check email configuration status
app.get('/api/email/status', (req, res) => {
  const hasResend = Boolean(serverSmtpSettings.resendApiKey || process.env.RESEND_API_KEY);
  const host = serverSmtpSettings.host || process.env.SMTP_HOST;
  const user = serverSmtpSettings.user || process.env.SMTP_USER;
  const pass = serverSmtpSettings.pass || process.env.SMTP_PASS;
  const hasSmtp = Boolean(host && user && pass);

  res.json({
    hasResend,
    hasSmtp,
    isReady: hasResend || hasSmtp,
    smtpHost: host || null,
    smtpUser: user ? `${user.substring(0, 3)}***` : null,
    totalLogs: deliveryLogs.length,
    lastDelivery: deliveryLogs[0] || null,
  });
});

// Get delivery logs
app.get('/api/email/logs', (req, res) => {
  res.json(deliveryLogs);
});

// Helper: send via Resend API
async function sendViaResend(apiKey: string, to: string, subject: string, html: string, from?: string) {
  const fromAddress = from || process.env.SMTP_FROM || 'Café Gaudí <onboarding@resend.dev>';
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromAddress,
      to: [to],
      subject,
      html,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Error al enviar mediante Resend');
  }
  return { id: data.id, provider: 'Resend API' };
}

// Helper: send via SMTP
async function sendViaSmtp(
  smtp: { host: string; port: number; secure: boolean; user: string; pass: string; from?: string },
  to: string,
  subject: string,
  html: string,
  text?: string
) {
  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: {
      user: smtp.user,
      pass: smtp.pass,
    },
    tls: {
      rejectUnauthorized: false, // Avoid self-signed cert issues
    },
  });

  const info = await transporter.sendMail({
    from: smtp.from || `"${smtp.user}" <${smtp.user}>`,
    to,
    subject,
    text: text || html.replace(/<[^>]*>?/gm, ''),
    html,
  });

  return { id: info.messageId, provider: `SMTP (${smtp.host})` };
}

// POST: Send reservation confirmation email
app.post('/api/send-email', async (req, res) => {
  const { to, subject, html, text, reservationCode, smtpConfig } = req.body;

  if (!to || !to.includes('@')) {
    return res.status(400).json({ success: false, error: 'Dirección de correo no válida' });
  }

  const emailSubject = subject || 'Confirmación de Reserva en Café Gaudí';

  const logEntry: EmailLogEntry = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    recipient: to,
    subject: emailSubject,
    reservationCode: reservationCode || undefined,
    status: 'enviado',
    provider: 'Desconocido',
  };

  try {
    // 1. Resolve credentials (Priority: body > server-stored > process.env)
    const resendKey =
      (smtpConfig?.resendApiKey && String(smtpConfig.resendApiKey).trim()) ||
      serverSmtpSettings.resendApiKey ||
      process.env.RESEND_API_KEY;

    const host =
      (smtpConfig?.host && String(smtpConfig.host).trim()) ||
      serverSmtpSettings.host ||
      process.env.SMTP_HOST;

    const user =
      (smtpConfig?.user && String(smtpConfig.user).trim()) ||
      serverSmtpSettings.user ||
      process.env.SMTP_USER;

    const pass =
      (smtpConfig?.pass && String(smtpConfig.pass).trim()) ||
      serverSmtpSettings.pass ||
      process.env.SMTP_PASS;

    const port = Number(
      (smtpConfig?.port && Number(smtpConfig.port)) ||
      serverSmtpSettings.port ||
      process.env.SMTP_PORT ||
      587
    );

    const secure = Boolean(
      smtpConfig?.secure ??
      (serverSmtpSettings.secure ?? (process.env.SMTP_SECURE === 'true' || port === 465))
    );

    const fromName =
      smtpConfig?.fromName ||
      serverSmtpSettings.fromName ||
      'Café Gaudí';

    const fromEmail =
      smtpConfig?.fromEmail ||
      serverSmtpSettings.fromEmail ||
      process.env.SMTP_FROM ||
      (user || 'reservas@cafegaudi.com');

    const adminNotificationEmail =
      serverSmtpSettings.notificationEmail ||
      process.env.ADMIN_NOTIFICATION_EMAIL ||
      'nordinmm28@gmail.com';

    // 1. Try Resend if API key is provided
    if (resendKey) {
      const fromAddr = `"${fromName}" <${fromEmail}>`;
      const resendRes = await sendViaResend(resendKey, to, emailSubject, html, fromAddr);
      logEntry.status = 'enviado';
      logEntry.provider = resendRes.provider;
      logEntry.messageId = resendRes.id;
      deliveryLogs.unshift(logEntry);
      saveLogs();

      // Also notify administrator if notification email is configured
      if (adminNotificationEmail && adminNotificationEmail !== to) {
        try {
          await sendViaResend(
            resendKey,
            adminNotificationEmail,
            `[Nueva Reserva] ${reservationCode || ''} - ${to}`,
            `<div style="font-family: sans-serif; padding: 20px;"><h2>Nueva Reserva Recibida</h2><p>Cliente: <strong>${to}</strong></p><p>Código: <strong>#${reservationCode || 'N/A'}</strong></p>${html}</div>`,
            fromAddr
          );
        } catch (adminErr) {
          console.warn('Could not dispatch admin copy via Resend:', adminErr);
        }
      }

      return res.json({ success: true, provider: resendRes.provider, messageId: resendRes.id });
    }

    // 2. Try SMTP if host, user, and pass provided
    if (host && user && pass) {
      const fromAddr = `"${fromName}" <${fromEmail}>`;
      const smtpRes = await sendViaSmtp({ host, port, secure, user, pass, from: fromAddr }, to, emailSubject, html, text);
      logEntry.status = 'enviado';
      logEntry.provider = smtpRes.provider;
      logEntry.messageId = smtpRes.id;
      deliveryLogs.unshift(logEntry);
      saveLogs();

      // Also notify administrator if notification email is configured
      if (adminNotificationEmail && adminNotificationEmail !== to) {
        try {
          await sendViaSmtp(
            { host, port, secure, user, pass, from: fromAddr },
            adminNotificationEmail,
            `[Nueva Reserva] ${reservationCode || ''} - ${to}`,
            `<div style="font-family: sans-serif; padding: 20px;"><h2>Nueva Reserva Recibida</h2><p>Cliente: <strong>${to}</strong></p><p>Código: <strong>#${reservationCode || 'N/A'}</strong></p>${html}</div>`
          );
        } catch (adminErr) {
          console.warn('Could not dispatch admin copy via SMTP:', adminErr);
        }
      }

      return res.json({ success: true, provider: smtpRes.provider, messageId: smtpRes.id });
    }

    // 3. Fallback when SMTP is not yet configured:
    // Create an ethereal message for instant sandbox inspection, but clearly indicate that real delivery requires SMTP
    try {
      const testAccount = await nodemailer.createTestAccount();
      const testTransporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

      const info = await testTransporter.sendMail({
        from: '"Café Gaudí - Reservas" <reservas@cafegaudi.com>',
        to,
        subject: emailSubject,
        text: text || html.replace(/<[^>]*>?/gm, ''),
        html,
      });

      const previewUrl = nodemailer.getTestMessageUrl(info) || undefined;
      logEntry.status = 'sin_configuracion';
      logEntry.provider = 'Ethereal Mail (Bandeja de prueba interactiva)';
      logEntry.messageId = info.messageId;
      logEntry.previewUrl = previewUrl ? String(previewUrl) : undefined;
      deliveryLogs.unshift(logEntry);
      saveLogs();

      return res.json({
        success: true,
        isTestMode: true,
        isPendingSetup: true,
        provider: logEntry.provider,
        previewUrl: logEntry.previewUrl,
        message: 'Reserva registrada en el sistema. Para entrega en tu buzón personal (Gmail/Outlook), el servidor requiere configurar SMTP o Resend en el panel de administración.',
      });
    } catch (etherealErr: any) {
      logEntry.status = 'simulado';
      logEntry.provider = 'Servicio Local de Café Gaudí';
      logEntry.error = 'Servidor SMTP no configurado. El email se ha generado y registrado en el sistema.';
      deliveryLogs.unshift(logEntry);
      saveLogs();

      return res.json({
        success: true,
        isSimulated: true,
        isPendingSetup: true,
        provider: logEntry.provider,
        message: 'El email de reserva ha sido registrado. Configura SMTP en Ajustes para entrega directa.',
      });
    }
  } catch (err: any) {
    console.error('Error enviando email:', err);
    logEntry.status = 'fallido';
    logEntry.error = err.message || 'Error desconocido al enviar';
    deliveryLogs.unshift(logEntry);
    saveLogs();

    return res.status(500).json({
      success: false,
      error: err.message || 'Fallo en el servicio de correo',
      provider: logEntry.provider,
    });
  }
});

// POST: Test email endpoint for administration panel
app.post('/api/email/test', async (req, res) => {
  const { to, smtpConfig } = req.body;
  const recipient = to || serverSmtpSettings.notificationEmail || process.env.ADMIN_NOTIFICATION_EMAIL || 'nordinmm28@gmail.com';

  const testSubject = `🧪 Prueba de Envío de Email - Café Gaudí (${new Date().toLocaleTimeString('es-ES')})`;
  const testHtml = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e2d8; border-radius: 16px; overflow: hidden;">
      <div style="background-color: #3d3d33; color: #ffffff; padding: 24px; text-align: center;">
        <h1 style="margin: 0; font-size: 22px; font-weight: 300; letter-spacing: 2px;">CAFÉ GAUDÍ</h1>
        <p style="margin: 4px 0 0 0; font-size: 11px; color: #d4d4aa; text-transform: uppercase;">Carrer Germans Thos i Codina, 20 • Mataró</p>
      </div>
      <div style="padding: 30px 24px;">
        <div style="background: #eaf7ed; border-left: 4px solid #2e7d32; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px;">
          <strong style="color: #2e7d32; font-size: 14px;">✓ Conexión de Correo Exitosa</strong>
          <p style="margin: 4px 0 0 0; font-size: 13px; color: #333333;">Este mensaje confirma que el servicio de correo electrónico de Café Gaudí está funcionando correctamente.</p>
        </div>
        <p style="font-size: 14px; color: #4a4a3a; line-height: 1.6;">
          Hola,<br/><br/>
          Has solicitado una prueba de verificación del sistema de confirmaciones de reserva para la dirección: <strong>${recipient}</strong>.
        </p>
        <div style="background: #f8f8f4; border: 1px solid #eaeae0; padding: 16px; border-radius: 12px; margin: 20px 0; font-size: 13px;">
          <div style="margin-bottom: 8px;"><strong>Hora de envío:</strong> ${new Date().toLocaleString('es-ES')}</div>
          <div style="margin-bottom: 8px;"><strong>Destinatario:</strong> ${recipient}</div>
          <div><strong>Estado:</strong> Verificado y operativo</div>
        </div>
      </div>
      <div style="background: #f5f5f0; padding: 16px; text-align: center; font-size: 11px; color: #8a8a7a; border-top: 1px solid #e2e2d8;">
        Café Gaudí • Tel: 931 45 90 19 • Mataró (Barcelona)
      </div>
    </div>
  `;

  try {
    const resendKey =
      (smtpConfig?.resendApiKey && String(smtpConfig.resendApiKey).trim()) ||
      serverSmtpSettings.resendApiKey ||
      process.env.RESEND_API_KEY;

    const host =
      (smtpConfig?.host && String(smtpConfig.host).trim()) ||
      serverSmtpSettings.host ||
      process.env.SMTP_HOST;

    const user =
      (smtpConfig?.user && String(smtpConfig.user).trim()) ||
      serverSmtpSettings.user ||
      process.env.SMTP_USER;

    const pass =
      (smtpConfig?.pass && String(smtpConfig.pass).trim()) ||
      serverSmtpSettings.pass ||
      process.env.SMTP_PASS;

    const port = Number(
      (smtpConfig?.port && Number(smtpConfig.port)) ||
      serverSmtpSettings.port ||
      process.env.SMTP_PORT ||
      587
    );

    const secure = Boolean(
      smtpConfig?.secure ??
      (serverSmtpSettings.secure ?? (process.env.SMTP_SECURE === 'true' || port === 465))
    );

    const fromName =
      smtpConfig?.fromName ||
      serverSmtpSettings.fromName ||
      'Café Gaudí';

    const fromEmail =
      smtpConfig?.fromEmail ||
      serverSmtpSettings.fromEmail ||
      process.env.SMTP_FROM ||
      (user || 'reservas@cafegaudi.com');

    if (resendKey) {
      const fromAddr = `"${fromName}" <${fromEmail}>`;
      const resendRes = await sendViaResend(resendKey, recipient, testSubject, testHtml, fromAddr);
      deliveryLogs.unshift({
        id: `test-${Date.now()}`,
        recipient,
        subject: testSubject,
        provider: 'Resend API',
        status: 'enviado',
        timestamp: new Date().toISOString(),
      });
      saveLogs();
      return res.json({
        success: true,
        provider: 'Resend API',
        message: `Email de prueba enviado con éxito a ${recipient}`,
        messageId: resendRes.id,
      });
    }

    if (host && user && pass) {
      const fromAddr = `"${fromName}" <${fromEmail}>`;
      const smtpRes = await sendViaSmtp({ host, port, secure, user, pass, from: fromAddr }, recipient, testSubject, testHtml);
      deliveryLogs.unshift({
        id: `test-${Date.now()}`,
        recipient,
        subject: testSubject,
        provider: smtpRes.provider,
        status: 'enviado',
        timestamp: new Date().toISOString(),
      });
      saveLogs();
      return res.json({
        success: true,
        provider: smtpRes.provider,
        message: `Email de prueba enviado exitosamente a ${recipient} vía ${smtpRes.provider}`,
        messageId: smtpRes.id,
      });
    }

    // Attempt Ethereal
    const testAccount = await nodemailer.createTestAccount();
    const testTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });

    const info = await testTransporter.sendMail({
      from: '"Café Gaudí" <reservas@cafegaudi.com>',
      to: recipient,
      subject: testSubject,
      html: testHtml,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info) || undefined;
    deliveryLogs.unshift({
      id: `test-${Date.now()}`,
      recipient,
      subject: testSubject,
      provider: 'Ethereal Test Mail',
      status: 'ethereal',
      timestamp: new Date().toISOString(),
      previewUrl,
    });
    saveLogs();

    return res.json({
      success: true,
      provider: 'Ethereal Test Mail',
      previewUrl,
      message: `Email de prueba generado en simulador Ethereal. Para recibirlo directamente en tu buzón personal de Gmail/Outlook (${recipient}), introduce tus credenciales SMTP o API Key en el panel inferior y pulsa "Guardar Parámetros SMTP".`,
    });
  } catch (err: any) {
    deliveryLogs.unshift({
      id: `test-${Date.now()}`,
      recipient,
      subject: testSubject,
      provider: 'none',
      status: 'fallido',
      timestamp: new Date().toISOString(),
      error: err.message,
    });
    saveLogs();
    return res.status(500).json({
      success: false,
      error: err.message || 'Error al enviar email de prueba',
    });
  }
});

// ----------------------------------------------------
// VITE OR STATIC SERVING
// ----------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Café Gaudí server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
