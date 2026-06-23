const nodemailer = require('nodemailer');

// If real mail settings exist in .env we use them; otherwise we just log
// the email to the console so you can develop without any SMTP setup.
let transporter = null;
if (process.env.SMTP_HOST) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

module.exports = async function sendMail(to, subject, text) {
  if (!transporter) {
    console.log(`[email] would send -> ${to} | ${subject}\n        ${text}`);
    return;
  }
  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'Beanback <no-reply@beanback.app>',
    to,
    subject,
    text,
  });
};