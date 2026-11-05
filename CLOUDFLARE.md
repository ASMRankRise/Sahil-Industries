# Cloudflare foundation

## One-time account and resource setup

Install Wrangler (it is also included in this project) and authenticate:

```powershell
npx wrangler login
npx wrangler whoami
```

Create the remote resources:

```powershell
npx wrangler d1 create sahil-industries-gallery
npx wrangler r2 bucket create sahil-industries-gallery-images
```

Copy the D1 `database_id` from the create command into `wrangler.jsonc`. The R2
bucket name must match exactly. Cloudflare accounts are created at
<https://dash.cloudflare.com/sign-up>; Wrangler cannot create an account.

## Local verification

```powershell
npm run cf:d1:migrations
npm run cf:preview
```

Open the local URL printed by Wrangler (normally `http://localhost:8787`).

## Remote deployment

Apply the schema and deploy after replacing the D1 ID:

```powershell
npm run cf:d1:migrations:remote
npm run cf:deploy
```

The deployed URL is printed by `wrangler deploy`. Keep credentials in Wrangler's
local authentication store; do not commit API tokens or `.env` files.
