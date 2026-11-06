import { Resend } from 'resend';

export function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY is not configured');
  return new Resend(apiKey);
}

export function getMailConfig() {
  return {
    from: process.env.RESEND_FROM_EMAIL || 'Sahil Industries <onboarding@resend.dev>',
    to: process.env.CONTACT_EMAIL || 'sahilcranes@gmail.com',
  };
}
