# Production deployment

## Primary platform: Vercel

Deploy this Next.js application to **Vercel using the Node.js runtime**. Cloudflare
is an external data service, not the application runtime:

- D1 is accessed through the Cloudflare REST API (`src/lib/d1-client.ts`).
- R2 is accessed through its S3-compatible API (`src/lib/r2-client.ts`).
- There is no Cloudflare Worker or native `DB` binding in production.

Do not deploy this repository with Wrangler/OpenNext. The old Worker binding
configuration was removed to prevent the two deployment models from being mixed.

## Required Vercel environment variables

Add these variables in Vercel for **Production** (and Preview if previews use
real data). Keep them server-side; none should use the `NEXT_PUBLIC_` prefix.

### Cloudflare D1 REST API

| Variable | Value |
| --- | --- |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID |
| `CLOUDFLARE_D1_DATABASE_ID` | ID of the production D1 database |
| `CLOUDFLARE_API_TOKEN` | Scoped token with D1 read/write permission |

Apply the SQL migrations to the production D1 database before the first deploy.
Use the Cloudflare dashboard or Cloudflare's D1 migration tooling; Wrangler is
not used to run the Vercel application.

### Cloudflare R2 S3 API

| Variable | Value |
| --- | --- |
| `R2_ENDPOINT` | `https://<account-id>.r2.cloudflarestorage.com` |
| `R2_ACCESS_KEY_ID` | R2 API token access key |
| `R2_SECRET_ACCESS_KEY` | R2 API token secret |
| `R2_BUCKET_NAME` | Production R2 bucket name |

### SMTP and application security

| Variable | Value |
| --- | --- |
| `SMTP_HOST` | SMTP provider hostname |
| `SMTP_PORT` | Usually `587` or `465` |
| `SMTP_SECURE` | `true` for implicit TLS, otherwise `false` |
| `SMTP_USER` | SMTP username |
| `SMTP_PASS` | SMTP password or app password |
| `SMTP_FROM_EMAIL` | Sender permitted by the SMTP provider |
| `CONTACT_EMAIL` | Address that receives contact/career notifications |
| `ADMIN_EMAIL` | Admin login email, if configured by the application |
| `ADMIN_PASSWORD` | Admin password, if used by the admin creation script |
| `TURNSTILE_SECRET_KEY` | Optional Cloudflare Turnstile secret |

Only set variables that the application uses; never commit `.env`, `.env.local`,
API tokens, SMTP credentials, or R2 secrets.

## Platform capability confirmation

This configuration is compatible with Vercel's Node.js serverless runtime:

- Next.js API route handlers run as Node.js functions.
- `nodemailer` can open outbound SMTP connections from Node.js functions.
- `request.formData()` supports career resume uploads and gallery image uploads.
- `Buffer` is available in the Node.js runtime and is used for SMTP attachments.
- The AWS SDK S3 client works with R2 over HTTPS.

Vercel function limits still apply. The project sets a 60-second maximum for API
functions. Upload size limits and SMTP provider connection limits should be
verified against the selected Vercel plan and provider before launch.

## Deploy and verify

```powershell
npm ci
npm run lint
npm run build
```

Import the repository into Vercel, select the Next.js framework, add the
environment variables above, and deploy. Verify contact submission, career PDF
upload, admin login, and gallery upload against the production services.
