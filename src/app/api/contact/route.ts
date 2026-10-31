import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message, formType } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Verify transporter
    await transporter.verify();

    // Email content
    const isEnquiry = formType === 'enquiry';
    const emailSubject = isEnquiry 
      ? `New Enquiry: ${subject || 'General Enquiry'}`
      : `New Contact Form: ${subject || 'General Contact'}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f6c515 0%, #e6b314 100%); padding: 30px; border-radius: 10px 10px 0 0;">
          <h1 style="color: #0c131a; margin: 0; font-size: 24px;">${isEnquiry ? 'New Enquiry Received' : 'New Contact Form Submission'}</h1>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #eee;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555; width: 120px;">Name:</td>
              <td style="padding: 10px 0; color: #333;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555;">Email:</td>
              <td style="padding: 10px 0; color: #333;"><a href="mailto:${email}" style="color: #f6c515; text-decoration: none;">${email}</a></td>
            </tr>
            ${phone ? `
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555;">Phone:</td>
              <td style="padding: 10px 0; color: #333;"><a href="tel:${phone}" style="color: #f6c515; text-decoration: none;">${phone}</a></td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555;">Subject:</td>
              <td style="padding: 10px 0; color: #333;">${subject || 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555; vertical-align: top;">Message:</td>
              <td style="padding: 10px 0; color: #333; white-space: pre-wrap;">${message}</td>
            </tr>
          </table>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #888; font-size: 12px; margin: 0;">
            This email was sent from the ${isEnquiry ? 'Enquiry Form' : 'Contact Form'} on Sahil Industries website.
          </p>
        </div>
      </body>
      </html>
    `;

    // Send email to admin
    await transporter.sendMail({
      from: `"Sahil Industries Website" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || 'sahilcranes@gmail.com',
      subject: emailSubject,
      html: htmlContent,
      replyTo: email,
    });

    // Send confirmation email to user
    await transporter.sendMail({
      from: `"Sahil Industries" <${process.env.SMTP_USER}>`,
      to: email,
      subject: isEnquiry 
        ? 'Thank you for your enquiry - Sahil Industries'
        : 'Thank you for contacting us - Sahil Industries',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f6c515 0%, #e6b314 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: #0c131a; margin: 0; font-size: 24px;">Thank You for Contacting Us!</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #eee;">
            <p style="font-size: 16px; color: #333;">Dear ${name},</p>
            <p style="color: #555;">We have received your ${isEnquiry ? 'enquiry' : 'message'} and will get back to you within 24 hours.</p>
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f6c515;">
              <p style="margin: 0; color: #666;"><strong>Your ${isEnquiry ? 'enquiry' : 'message'} summary:</strong></p>
              <p style="margin: 10px 0 0; color: #333;">${subject || 'General'}</p>
            </div>
            <p style="color: #555;">For immediate assistance, you can also call us at <a href="tel:+919623242324" style="color: #f6c515;">+91 96 2324 2324</a> or email us at <a href="mailto:sahilcranes@gmail.com" style="color: #f6c515;">sahilcranes@gmail.com</a>.</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="color: #888; font-size: 12px; margin: 0; text-align: center;">
              Sahil Industries<br>
              Plot No. B 88, 89, 90 Kagal Hatkanagale Five Star MIDC,<br>
              Village – Halsawade, Tal.- Karveer, Dist.- Kolhapur - 416 236
            </p>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json(
      { message: 'Form submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to submit form. Please try again later.' },
      { status: 500 }
    );
  }
}