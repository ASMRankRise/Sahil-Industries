import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getMailConfig, getMailer, renderSubmissionEmail } from '@/lib/mail';

export const runtime = 'nodejs';

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
    await getMailer().sendMail({
      from: getMailConfig().from,
      to: getMailConfig().to,
      replyTo: email,
      subject: `${isEnquiry ? 'New Enquiry' : 'New Contact Form'}: ${subject || 'General'}`,
      html: renderSubmissionEmail({
        title: isEnquiry ? 'New Product Enquiry' : 'New Contact Message',
        intro: isEnquiry ? 'A new product enquiry has been received.' : 'A new contact request has been received.',
        fields: [
          { label: 'Name', value: name },
          { label: 'Email', value: email, link: `<a href="mailto:${email}" style="color:#b48600">${email}</a>` },
          { label: 'Phone', value: phone, link: phone ? `<a href="tel:${phone}" style="color:#b48600">${phone}</a>` : undefined },
          { label: 'Subject', value: subject },
        ],
        message,
      }),
    });
    return NextResponse.json({ message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Failed to submit form. Please try again later.' }, { status: 500 });
  }
}
