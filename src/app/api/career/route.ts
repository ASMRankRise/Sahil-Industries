import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract form fields
    const fullname = formData.get('fullname') as string;
    const email = formData.get('email') as string;
    const mobile = formData.get('mobile') as string;
    const city = formData.get('city') as string;
    const message = formData.get('message') as string;
    const captcha = formData.get('captcha') as string;
    const resume = formData.get('uploaded_file') as File | null;
    
    // Validate required fields
    if (!fullname || !email || !mobile || !message || !captcha) {
      return NextResponse.json(
        { error: 'All required fields must be filled' },
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

    // Validate resume file if provided
    if (resume) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(resume.type)) {
        return NextResponse.json(
          { error: 'Please upload a PDF, DOC, or DOCX file' },
          { status: 400 }
        );
      }
      
      if (resume.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'File size must be less than 5MB' },
          { status: 400 }
        );
      }
    }

    // Create transporter using nodemailer (same as contact form)
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

    // Prepare email content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f6c515 0%, #e6b314 100%); padding: 30px; border-radius: 10px 10px 0 0;">
          <h1 style="color: #0c131a; margin: 0; font-size: 24px;">New Career Application Received</h1>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #eee;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555; width: 120px;">Name:</td>
              <td style="padding: 10px 0; color: #333;">${fullname}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555;">Email:</td>
              <td style="padding: 10px 0; color: #333;"><a href="mailto:${email}" style="color: #f6c515; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555;">Phone:</td>
              <td style="padding: 10px 0; color: #333;"><a href="tel:${mobile}" style="color: #f6c515; text-decoration: none;">${mobile}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555;">City:</td>
              <td style="padding: 10px 0; color: #333;">${city || 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555; vertical-align: top;">Message:</td>
              <td style="padding: 10px 0; color: #333; white-space: pre-wrap;">${message}</td>
            </tr>
          </table>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #888; font-size: 12px; margin: 0;">
            This email was sent from the Career Form on Sahil Industries website.
          </p>
        </div>
      </body>
      </html>
    `;

    // Send email to admin
    const mailOptions: any = {
      from: `"Sahil Industries Website" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || 'sahilcranes@gmail.com',
      subject: `New Career Application: ${fullname}`,
      html: htmlContent,
      replyTo: email,
    };

    // Attach resume if provided
    if (resume) {
      const buffer = Buffer.from(await resume.arrayBuffer());
      mailOptions.attachments = [{
        filename: resume.name,
        content: buffer,
        contentType: resume.type,
      }];
    }

    await transporter.sendMail(mailOptions);

    // Send confirmation email to applicant
    await transporter.sendMail({
      from: `"Sahil Industries" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Thank you for your application - Sahil Industries',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f6c515 0%, #e6b314 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: #0c131a; margin: 0; font-size: 24px;">Thank You for Applying!</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #eee;">
            <p style="font-size: 16px; color: #333;">Dear ${fullname},</p>
            <p style="color: #555;">We have received your career application and will review it shortly. Our team will contact you if your profile matches our requirements.</p>
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f6c515;">
              <p style="margin: 0; color: #666;"><strong>Your application summary:</strong></p>
              <p style="margin: 10px 0 0; color: #333;">Position: General Application</p>
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
      { message: 'Application submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Career form error:', error);
    // Return more specific error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to submit application: ${errorMessage}` },
      { status: 500 }
    );
  }
}