import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getMailConfig, getResend } from '@/lib/resend';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, subject, message, formType } = await request.json();
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const { env } = getCloudflareContext();
    const db = (env as unknown as { GALLERY_DB: { prepare: (query: string) => { bind: (...values: string[]) => { run: () => Promise<unknown> } } } }).GALLERY_DB;
    await db.prepare(`INSERT INTO form_submissions (id, form_type, name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?, ?, ?)`)
      .bind(crypto.randomUUID(), formType === 'enquiry' ? 'enquiry' : 'contact', name, email, phone || '', subject || '', message).run();

    const isEnquiry = formType === 'enquiry';
    await getResend().emails.send({
      from: getMailConfig().from,
      to: getMailConfig().to,
      replyTo: email,
      subject: `${isEnquiry ? 'New Enquiry' : 'New Contact Form'}: ${subject || 'General'}`,
      html: `<h2>${isEnquiry ? 'New enquiry' : 'New contact submission'}</h2><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Phone:</strong> ${phone || 'Not provided'}</p><p><strong>Subject:</strong> ${subject || 'Not specified'}</p><p><strong>Message:</strong></p><p>${String(message).replace(/\n/g, '<br>')}</p>`,
    });
    return NextResponse.json({ message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Failed to submit form. Please try again later.' }, { status: 500 });
  }
}
