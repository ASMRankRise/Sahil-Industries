import { NextRequest, NextResponse } from "next/server";
import { getD1Client } from "@/lib/d1-client";
import {
  escapeHtml,
  getMailConfig,
  getMailer,
  renderSubmissionEmail,
} from "@/lib/mail";
import {
  clean,
  clientAddress,
  emailPattern,
  rateLimited,
  verifyMathCaptcha,
} from "@/lib/form-security";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    if (rateLimited(`contact:${clientAddress(request)}`))
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429 },
      );
    const body = await request.json();
    const name = clean(body.name, 100),
      email = clean(body.email, 254),
      phone = clean(body.phone, 30);
    const subject = clean(body.subject, 150),
      message = clean(body.message, 5000),
      formType = body.formType;
    if (!name || !email || !message || !subject) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 },
      );
    }
    if (
      !emailPattern.test(email) ||
      !/^[\p{L}\s.'-]+$/u.test(name) ||
      message.length < 10
    ) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }
    // Contact forms can use the same lightweight challenge as career forms.
    // If Turnstile is configured, it is mandatory and takes precedence.
    if (process.env.TURNSTILE_SECRET_KEY) {
      const token = clean(body.captchaToken, 2048);
      const result = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: { "content-type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            secret: process.env.TURNSTILE_SECRET_KEY,
            response: token,
            remoteip: clientAddress(request),
          }),
        },
      );
      if (
        !token ||
        !result.ok ||
        !((await result.json()) as { success?: boolean }).success
      )
        return NextResponse.json(
          { error: "Invalid security verification" },
          { status: 400 },
        );
    } else if (!verifyMathCaptcha(body.captcha, body.captchaQuestion)) {
      return NextResponse.json(
        { error: "Invalid security verification" },
        { status: 400 },
      );
    }

    const isEnquiry = formType === "enquiry";
    const db = getD1Client();
    if (isEnquiry) {
      // The admin enquiry screens read from this table. Keep public enquiries
      // in the same table so a successful submission is visible to admins.
      await db
        .prepare(
          `INSERT INTO enquiries (id, name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?, ?)`,
        )
        .bind(
          crypto.randomUUID(),
          name,
          email,
          phone || "",
          subject || "",
          message,
        )
        .run();
    } else {
      await db
        .prepare(
          `INSERT INTO form_submissions (id, form_type, name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(
          crypto.randomUUID(),
          "contact",
          name,
          email,
          phone || "",
          subject || "",
          message,
        )
        .run();
    }

    await getMailer().sendMail({
      from: getMailConfig().from,
      to: getMailConfig().to,
      replyTo: email,
      subject: `${isEnquiry ? "New Enquiry" : "New Contact Form"}: ${subject || "General"}`,
      html: renderSubmissionEmail({
        title: isEnquiry ? "New Product Enquiry" : "New Contact Message",
        intro: isEnquiry
          ? "A new product enquiry has been received."
          : "A new contact request has been received.",
        fields: [
          { label: "Name", value: name },
          {
            label: "Email",
            value: email,
            link: `<a href="mailto:${escapeHtml(email)}" style="color:#b48600">${escapeHtml(email)}</a>`,
          },
          {
            label: "Phone",
            value: phone,
            link: phone
              ? `<a href="tel:${escapeHtml(phone)}" style="color:#b48600">${escapeHtml(phone)}</a>`
              : undefined,
          },
          { label: "Subject", value: subject },
        ],
        message,
      }),
    });
    return NextResponse.json({ message: "Form submitted successfully" });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to submit form. Please try again later." },
      { status: 500 },
    );
  }
}
