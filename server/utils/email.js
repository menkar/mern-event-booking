const dns = require('dns');
const nodemailer = require('nodemailer');

const BRAND_NAME = 'Swap Events Hub Client';
const BRAND_COLOR = '#4f46e5';
const BRAND_DARK = '#0f172a';

const strip = (value) => String(value || '').trim();

const isLocalEnvironment = () =>
  process.env.NODE_ENV !== 'production' && process.env.RENDER !== 'true';

const resolveProvider = () => {
  const explicit = strip(process.env.EMAIL_PROVIDER).toLowerCase();
  if (explicit) return explicit;

  if (isLocalEnvironment()) {
    return 'smtp';
  }

  if (strip(process.env.RESEND_API_KEY)) return 'resend';
  if (strip(process.env.BREVO_API_KEY)) return 'brevo';
  return 'smtp';
};

const getFromAddress = () => {
  const from = strip(process.env.EMAIL_FROM);
  if (from) return from.includes('<') ? from : `"${BRAND_NAME}" <${from}>`;
  const user = strip(process.env.EMAIL_USER);
  if (user) return `"${BRAND_NAME}" <${user}>`;
  return `"${BRAND_NAME}" <onboarding@resend.dev>`;
};

const isEmailConfigured = () => {
  if (isLocalEnvironment()) {
    return Boolean(strip(process.env.EMAIL_USER) && strip(process.env.EMAIL_PASS));
  }

  const provider = resolveProvider();
  if (provider === 'resend') return Boolean(strip(process.env.RESEND_API_KEY));
  if (provider === 'brevo') return Boolean(strip(process.env.BREVO_API_KEY));
  return Boolean(strip(process.env.EMAIL_USER) && strip(process.env.EMAIL_PASS));
};

let transporter = null;

const getTransporter = () => {
  if (!strip(process.env.EMAIL_USER) || !strip(process.env.EMAIL_PASS)) {
    throw new Error('EMAIL_USER and EMAIL_PASS must be set for SMTP');
  }

  if (!transporter) {
    const host = strip(process.env.EMAIL_HOST) || 'smtp.gmail.com';
    const port = parseInt(process.env.EMAIL_PORT || '587', 10);
    const secure = process.env.EMAIL_SECURE === 'true';

    transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user: strip(process.env.EMAIL_USER),
        pass: strip(process.env.EMAIL_PASS).replace(/\s/g, ''),
      },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 20000,
      requireTLS: !secure && port === 587,
      tls: { minVersion: 'TLSv1.2' },
      lookup: (hostname, options, callback) => {
        dns.lookup(hostname, { ...options, family: 4 }, callback);
      },
    });
  }

  return transporter;
};

const sendViaResend = async ({ to, subject, html }) => {
  const apiKey = strip(process.env.RESEND_API_KEY);
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is required when EMAIL_PROVIDER=resend');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: getFromAddress(),
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Resend API error (${response.status})`);
  }

  return data;
};

const sendViaBrevo = async ({ to, subject, html }) => {
  const apiKey = strip(process.env.BREVO_API_KEY);
  if (!apiKey) {
    throw new Error('BREVO_API_KEY is required when EMAIL_PROVIDER=brevo');
  }

  const fromMatch = getFromAddress().match(/<([^>]+)>/);
  const senderEmail = fromMatch ? fromMatch[1] : strip(process.env.EMAIL_USER);

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { name: BRAND_NAME, email: senderEmail },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Brevo API error (${response.status})`);
  }

  return data;
};

const sendViaSmtp = async (mailOptions) => {
  try {
    return await getTransporter().sendMail(mailOptions);
  } catch (error) {
    console.error('SMTP send failed:', error.code, error.message);

    if (error.code === 'EAUTH') {
      throw new Error(
        'Email authentication failed. For Gmail, enable 2-Step Verification and use an App Password as EMAIL_PASS.'
      );
    }

    if (['ETIMEDOUT', 'ESOCKET', 'ENETUNREACH', 'ECONNREFUSED'].includes(error.code)) {
      throw new Error(
        'SMTP connection failed. Verify EMAIL_HOST, EMAIL_PORT, and network access.'
      );
    }

    throw new Error(error.message || 'Failed to send email via SMTP');
  }
};

const sendMail = async (mailOptions) => {
  const provider = resolveProvider();

  if (provider === 'resend') {
    return sendViaResend(mailOptions);
  }

  if (provider === 'brevo') {
    return sendViaBrevo(mailOptions);
  }

  return sendViaSmtp(mailOptions);
};

const verifyEmailTransport = async () => {
  if (!isEmailConfigured()) {
    throw new Error('Email service is not configured');
  }

  const provider = resolveProvider();

  if (provider === 'resend' || provider === 'brevo') {
    return;
  }

  await getTransporter().verify();
};

const emailLayout = ({ preheader, title, bodyHtml, footerNote }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f8fafc; font-family: Arial, Helvetica, sans-serif; color: #0f172a; }
    .wrapper { width: 100%; background-color: #f8fafc; padding: 32px 12px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08); }
    .header { background: linear-gradient(135deg, ${BRAND_COLOR}, ${BRAND_DARK}); padding: 28px 32px; text-align: center; }
    .brand { color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: 0.3px; margin: 0; }
    .tagline { color: #c7d2fe; font-size: 13px; margin: 8px 0 0; }
    .content { padding: 32px; }
    .title { font-size: 24px; font-weight: 700; margin: 0 0 12px; color: #0f172a; }
    .text { font-size: 16px; line-height: 1.6; color: #475569; margin: 0 0 20px; }
    .otp-box { background: #eef2ff; border: 1px dashed #818cf8; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
    .otp-label { font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #4338ca; margin-bottom: 10px; }
    .otp-code { font-size: 34px; font-weight: 800; letter-spacing: 10px; color: #312e81; margin: 0; }
    .notice { background: #fff7ed; border-left: 4px solid #f59e0b; padding: 14px 16px; border-radius: 8px; font-size: 14px; color: #92400e; margin-top: 20px; }
    .footer { background: #f8fafc; padding: 20px 32px; text-align: center; border-top: 1px solid #e2e8f0; }
    .footer p { margin: 0; font-size: 12px; line-height: 1.6; color: #64748b; }
    .preheader { display: none !important; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0; overflow: hidden; }
    @media only screen and (max-width: 620px) {
      .content, .footer { padding: 24px 20px; }
      .otp-code { font-size: 28px; letter-spacing: 6px; }
    }
  </style>
</head>
<body>
  <div class="preheader">${preheader}</div>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <p class="brand">${BRAND_NAME}</p>
        <p class="tagline">Enterprise Event Booking Platform</p>
      </div>
      <div class="content">
        <h1 class="title">${title}</h1>
        ${bodyHtml}
        <div class="notice">
          This code expires in <strong>5 minutes</strong>. If you did not request this, please ignore this email and ensure your account is secure.
        </div>
      </div>
      <div class="footer">
        <p>${footerNote || `&copy; ${new Date().getFullYear()} ${BRAND_NAME}. All rights reserved.`}</p>
        <p style="margin-top:8px;">Secure bookings · Real-time availability · Admin controls</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

const bookingConfirmationLayout = ({ userName, eventTitle }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Booking Confirmed</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f8fafc; font-family: Arial, Helvetica, sans-serif; color: #0f172a; }
    .wrapper { width: 100%; background-color: #f8fafc; padding: 32px 12px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #059669, #047857); padding: 28px 32px; text-align: center; color: #fff; }
    .brand { font-size: 22px; font-weight: 700; margin: 0; }
    .content { padding: 32px; }
    .title { font-size: 24px; font-weight: 700; margin: 0 0 12px; }
    .text { font-size: 16px; line-height: 1.6; color: #475569; }
    .event-card { margin-top: 24px; padding: 20px; border-radius: 12px; background: #ecfdf5; border: 1px solid #a7f3d0; }
    .event-title { font-size: 18px; font-weight: 700; color: #065f46; margin: 0; }
    .footer { background: #f8fafc; padding: 20px 32px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <p class="brand">${BRAND_NAME}</p>
      </div>
      <div class="content">
        <h1 class="title">Booking Confirmed</h1>
        <p class="text">Hi <strong>${userName}</strong>,</p>
        <p class="text">Your booking has been successfully confirmed. We look forward to seeing you at the event.</p>
        <div class="event-card">
          <p class="event-title">${eventTitle}</p>
        </div>
        <p class="text" style="margin-top:24px;">You can view your booking details anytime from your dashboard.</p>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} ${BRAND_NAME}. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

const sendOTPEmail = async (userEmail, otp, type) => {
  const isAccountVerification = type === 'account_verification';
  const title = isAccountVerification ? 'Verify Your Account' : 'Verify Your Event Booking';
  const message = isAccountVerification
    ? 'Use the one-time password below to verify your Swap Events Hub Client account and complete registration.'
    : 'Use the one-time password below to verify and submit your event booking request.';
  const preheader = isAccountVerification
    ? 'Your account verification code is ready.'
    : 'Your event booking verification code is ready.';
  const subject = isAccountVerification
    ? `${BRAND_NAME} — Account Verification OTP`
    : `${BRAND_NAME} — Booking Verification OTP`;

  const bodyHtml = `
    <p class="text">${message}</p>
    <div class="otp-box">
      <div class="otp-label">Your Verification Code</div>
      <p class="otp-code">${otp}</p>
    </div>
    <p class="text">For your security, never share this code with anyone. Our team will never ask for your OTP.</p>
  `;

  await sendMail({
    to: userEmail,
    subject,
    html: emailLayout({ preheader, title, bodyHtml }),
  });

  console.log(`OTP sent to ${userEmail} for ${type}`);
};

const sendBookingEmail = async (userEmail, userName, eventTitle) => {
  await sendMail({
    to: userEmail,
    subject: `${BRAND_NAME} — Booking Confirmed: ${eventTitle}`,
    html: bookingConfirmationLayout({ userName, eventTitle }),
  });

  console.log('Booking confirmation email sent to', userEmail);
};

module.exports = {
  sendOTPEmail,
  sendBookingEmail,
  verifyEmailTransport,
  isEmailConfigured,
  resolveProvider,
};
