'use strict';

/**
 * Dolamo Attorneys – form backend.
 *
 * JavaScript (Node.js) version of the C# HomeController.ContactSubmit example:
 *   - receives the form details,
 *   - builds an HTML email,
 *   - sends it through SMTP to the firm's inbox,
 *   - tells the page whether it worked.
 *
 * It also serves the static website, so one command runs everything.
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');

const PORT = Number(process.env.PORT) || 3000;
const SITE_ROOT = path.resolve(__dirname, '..');
const MAIL_TO = process.env.MAIL_TO || 'admin@dattorney.co.za';
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.zoho.com';
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587;
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const MAIL_FROM = process.env.MAIL_FROM || SMTP_USER;

/* ------------------------------------------------------------------ */
/* Mail transport (equivalent of `new SmtpClient(...)` in the C# code) */
/* ------------------------------------------------------------------ */

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,        // 465 = implicit SSL, 587 = STARTTLS
  requireTLS: SMTP_PORT !== 465 && SMTP_PORT !== 25 && SMTP_PORT !== 1025,
  auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
});

const mailConfigured = Boolean(SMTP_USER && SMTP_PASS);

/* ------------------------------ helpers ----------------------------- */

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Strip line breaks so nothing user-supplied can inject extra mail headers.
function oneLine(value) {
  return String(value).replace(/[\r\n]+/g, ' ').trim();
}

function clean(value, max) {
  return String(value === undefined || value === null ? '' : value)
    .replace(/\u0000/g, '')
    .trim()
    .slice(0, max);
}

function formatNow() {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Africa/Johannesburg',
  }).format(new Date());
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+()\-\s.]{7,25}$/;

/* --------------------------- form definitions ----------------------- */
/* One entry per form on the website (see data-form-type in the HTML).   */

const FORMS = {
  // contact.html
  contact: {
    fields: {
      username: { label: 'Name', max: 100, required: true },
      email: { label: 'Email', max: 254, required: true, type: 'email' },
      phone: { label: 'Mobile Number', max: 25, type: 'phone' },
      subject: { label: 'Subject', max: 150, required: true },
      message: { label: 'Message', max: 5000, required: true, multiline: true },
    },
    subject: (d) => `Website Enquiry: ${d.subject}`,
    heading: (d) => `Contact Form About ${d.subject}`,
    replyName: (d) => d.username,
    success: 'Thank you for contacting us. We will get back to you shortly.',
  },

  // index.html + Request-Quote.html ("Find Lawyer" / appointment request)
  appointment: {
    fields: {
      first_name: { label: 'First Name', max: 80, required: true },
      last_name: { label: 'Last Name', max: 80 },
      category: { label: 'Category', max: 80, required: true },
      phone: { label: 'Mobile Number', max: 25, type: 'phone' },
      appointment_date: { label: 'Preferred Appointment Date', max: 40 },
      email: { label: 'Email', max: 254, required: true, type: 'email' },
    },
    subject: (d) => `Appointment Request: ${d.category}`,
    heading: (d) => `Appointment Request – ${d.category}`,
    replyName: (d) => `${d.first_name} ${d.last_name || ''}`.trim(),
    success: 'Thank you. Your appointment request has been received and we will contact you shortly.',
  },

  // footer "Subscribe" box on every page
  subscribe: {
    fields: {
      email: { label: 'Email', max: 254, required: true, type: 'email' },
    },
    subject: () => 'New Newsletter Subscription',
    heading: () => 'New Newsletter Subscription',
    replyName: () => '',
    success: 'Thank you for subscribing. We will keep you updated.',
  },
};

function validate(type, body) {
  const def = FORMS[type];
  const data = {};
  const errors = {};

  Object.keys(def.fields).forEach((key) => {
    const f = def.fields[key];
    const value = clean(body[key], f.max);
    data[key] = value;

    if (f.required && !value) {
      errors[key] = `${f.label} is required.`;
    } else if (value && f.type === 'email' && !EMAIL_RE.test(value)) {
      errors[key] = 'Please enter a valid email address.';
    } else if (value && f.type === 'phone' && !PHONE_RE.test(value)) {
      errors[key] = 'Please enter a valid phone number.';
    }
  });

  return { data, errors };
}

/* ----------------------------- email body --------------------------- */

function buildEmail(type, data) {
  const def = FORMS[type];
  const submitted = formatNow();

  const rows = Object.keys(def.fields)
    .filter((key) => data[key] && !def.fields[key].multiline)
    .map((key) => {
      const f = def.fields[key];
      const safe = escapeHtml(data[key]);
      const shown = f.type === 'email'
        ? `<a href='mailto:${safe}'>${safe}</a>`
        : safe;
      return `<p><strong>${escapeHtml(f.label)}:</strong> ${shown}</p>`;
    })
    .join('\n');

  const multiline = Object.keys(def.fields)
    .filter((key) => data[key] && def.fields[key].multiline)
    .map((key) => {
      const safe = escapeHtml(data[key]).replace(/\r?\n/g, '<br>');
      return `
        <p><strong>${escapeHtml(def.fields[key].label)}:</strong></p>
        <div style='background-color: #f9f9f9; padding: 10px; border: 1px solid #ddd;'>${safe}</div>`;
    })
    .join('\n');

  const html = `
    <div style='font-family: Arial, sans-serif; font-size: 14px; color: #333;'>
      <h2 style='color: #0b5394;'>${escapeHtml(def.heading(data))}</h2>
      ${rows}
      <p><strong>Submitted On:</strong> ${escapeHtml(submitted)}</p>
      <hr style='border: 1px solid #ccc;' />
      ${multiline}
      <br>
      <p style='font-size: 12px; color: #777;'>This email was sent from the Dolamo Attorneys website.</p>
    </div>`;

  const text = [
    def.heading(data),
    '',
    ...Object.keys(def.fields)
      .filter((key) => data[key])
      .map((key) => `${def.fields[key].label}: ${data[key]}`),
    `Submitted On: ${submitted}`,
    '',
    'This email was sent from the Dolamo Attorneys website.',
  ].join('\n');

  return { html, text };
}

/* ------------------------------- app -------------------------------- */

const app = express();
app.disable('x-powered-by');
if (process.env.TRUST_PROXY === '1') app.set('trust proxy', 1);

// Basic hardening headers.
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: false, limit: '20kb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8, // 8 submissions per visitor per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) =>
    respond(req, res, 429, false, 'Too many submissions. Please try again in a few minutes.'),
});

function respond(req, res, status, ok, message, errors) {
  if (req.accepts(['json', 'html']) === 'json') {
    return res.status(status).json({ ok, message, errors: errors || undefined });
  }
  // Fallback for browsers with JavaScript disabled.
  const colour = ok ? '#2e7d32' : '#c62828';
  return res.status(status).type('html').send(
    `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
     <title>Dolamo Attorneys</title>
     <body style="font-family:Arial,sans-serif;max-width:560px;margin:15vh auto;padding:0 20px;text-align:center">
     <h2 style="color:${colour}">${escapeHtml(message)}</h2>
     <p><a href="javascript:history.back()">&larr; Go back</a> &nbsp;|&nbsp; <a href="/index.html">Home</a></p></body>`
  );
}

// Equivalent of ContactSubmit(ContactForm model)
app.post('/api/contact', limiter, async (req, res) => {
  const body = req.body || {};
  const type = clean(body.formType, 30);

  if (!Object.prototype.hasOwnProperty.call(FORMS, type)) {
    return respond(req, res, 400, false, 'Unknown form.');
  }

  // Honeypot: real visitors never see/fill this field. Pretend success to bots.
  if (clean(body.website, 200)) {
    return respond(req, res, 200, true, FORMS[type].success);
  }

  const { data, errors } = validate(type, body);
  if (Object.keys(errors).length) {
    return respond(req, res, 422, false, 'Please correct the highlighted details and try again.', errors);
  }

  if (!mailConfigured) {
    console.error('Form received but SMTP_USER / SMTP_PASS are not set in server/.env');
    return respond(req, res, 503, false, 'Our enquiry form is temporarily unavailable. Please email or call us directly.');
  }

  try {
    const def = FORMS[type];
    const { html, text } = buildEmail(type, data);
    const replyName = oneLine(def.replyName(data));

    await transporter.sendMail({
      from: MAIL_FROM,
      to: MAIL_TO,
      // Hitting "Reply" in the inbox answers the client directly.
      replyTo: data.email ? { name: replyName.replace(/["<>]/g, ''), address: data.email } : undefined,
      subject: oneLine(def.subject(data)),
      text,
      html,
    });

    return respond(req, res, 200, true, def.success);
  } catch (err) {
    // Log the technical detail on the server only – never show SMTP errors to visitors.
    console.error('Email send failed:', err && err.message);
    return respond(req, res, 500, false, 'Error sending your message. Please try again later or contact us directly.');
  }
});

/* ---------------------------- static website ------------------------- */

// Never expose the server code, .env, git or GitHub files over HTTP.
app.use((req, res, next) => {
  let p;
  try {
    p = path.posix.normalize(decodeURIComponent(req.path)).toLowerCase();
  } catch (e) {
    return res.status(400).end();
  }
  if (/^\/(server|\.git|\.github|node_modules)(\/|$)/.test(p) || /(^|\/)\.env/.test(p)) {
    return res.status(404).sendFile(path.join(SITE_ROOT, 'error-page.html'));
  }
  next();
});

app.use(express.static(SITE_ROOT, { dotfiles: 'deny', extensions: ['html'] }));

app.use((req, res) => {
  res.status(404).sendFile(path.join(SITE_ROOT, 'error-page.html'));
});

app.listen(PORT, () => {
  console.log(`Dolamo Attorneys site running at http://localhost:${PORT}`);
  console.log(`Enquiries will be emailed to: ${MAIL_TO}`);
  if (!mailConfigured) {
    console.warn('WARNING: SMTP_USER / SMTP_PASS missing. Copy server/.env.example to server/.env and fill it in.');
  }
});
