import nodemailer from "nodemailer";
import path from "node:path";

export function getMailer() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error("SMTP_HOST, SMTP_USER, and SMTP_PASS are required");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === "true",
    auth: { user, pass },
  });
}

export function getMailConfig() {
  return {
    from: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
    to: process.env.CONTACT_EMAIL || "sahilcranes@gmail.com",
  };
}

export function getBrandLogoAttachment() {
  return {
    filename: "sahil-industries-logo.png",
    path: path.join(process.cwd(), "public", "sahilcrane", "logo", "logo-footer.png"),
    cid: "sahil-industries-logo",
  };
}

const escapeHtml = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const field = (label: string, value: unknown, link?: string) => `
  <tr>
    <td style="padding:12px 0;color:#667085;font-size:13px;font-weight:600;width:30%;vertical-align:top">${escapeHtml(label)}</td>
    <td style="padding:12px 0;color:#17202a;font-size:14px;vertical-align:top">${link || escapeHtml(value || "Not provided")}</td>
  </tr>`;

export function renderSubmissionEmail({
  title,
  intro,
  fields,
  message,
}: {
  title: string;
  intro: string;
  fields: Array<{ label: string; value: unknown; link?: string }>;
  message?: unknown;
}) {
  return `<!doctype html><html><body style="margin:0;background:#f3f5f7;font-family:Arial,sans-serif;color:#17202a">
    <div style="max-width:640px;margin:28px auto;padding:0 16px">
      <div style="background:#101820;padding:24px 28px;border-radius:12px 12px 0 0">
        <table role="presentation" style="width:100%;border-collapse:collapse"><tr>
          <td style="width:190px;vertical-align:middle"><img src="cid:sahil-industries-logo" width="170" alt="Sahil Industries" style="display:block;width:170px;height:auto;border:0"></td>
          <td style="vertical-align:middle;padding-left:18px;border-left:1px solid #34404b"><div style="color:#f6c515;font-size:13px;font-weight:bold;letter-spacing:1px">SAHIL INDUSTRIES</div><h1 style="margin:8px 0 0;color:#fff;font-size:24px">${escapeHtml(title)}</h1></td>
        </tr></table>
      </div>
      <div style="background:#fff;padding:28px;border:1px solid #e5e7eb;border-top:0;border-radius:0 0 12px 12px">
        <p style="margin:0 0 20px;color:#475467;font-size:15px">${escapeHtml(intro)}</p>
        <table style="width:100%;border-collapse:collapse">${fields.map((item) => field(item.label, item.value, item.link)).join("")}</table>
        ${message ? `<div style="margin-top:20px;padding:18px;background:#f8fafc;border-left:4px solid #f6c515;border-radius:4px"><div style="color:#667085;font-size:13px;font-weight:bold;margin-bottom:8px">MESSAGE</div><div style="color:#17202a;font-size:14px;line-height:1.6;white-space:pre-wrap">${escapeHtml(message)}</div></div>` : ""}
        <p style="margin:28px 0 0;padding-top:16px;border-top:1px solid #eaecf0;color:#98a2b3;font-size:12px">Submitted through the Sahil Industries website.</p>
      </div>
    </div>
  </body></html>`;
}

export { escapeHtml };
