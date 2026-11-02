# WWH3 content admin

The public site is a static Vite app. Editing is powered by two Netlify
Functions plus Netlify Blobs, so there is no separate database or server to run.

| Path | Purpose |
| --- | --- |
| `/admin` | Password-protected editor for runs, events and gallery photos |
| `/api/login`, `/api/logout`, `/api/session` | Session handling (httpOnly cookie) |
| `/api/content` | `GET` published content, `PUT` authenticated save |
| `/api/cloudinary-sign` | Authenticated, server-signed Cloudinary uploads |

Content lives in a Netlify Blobs store named `wwh3`, key `content.json`. The
first save creates it automatically. Until then the site uses the seed data in
`src/data/*.ts`, so the public pages never go blank.

## 1. Generate secrets

From the project root:

```powershell
# Password hash used to sign in at /admin
npm run hash-password -- "choose-a-strong-club-password"

# Random value that signs the 8-hour session cookie
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Keep both outputs. They are secrets; never commit them.

## 2. Set environment variables in Netlify

Netlify dashboard → **Site configuration → Environment variables → Add a
variable**. Add these for the production (and deploy-preview if you want to test)
contexts:

| Variable | Value |
| --- | --- |
| `ADMIN_PASSWORD_HASH` | the `scrypt:…:…` output from above |
| `SESSION_SECRET` | the random 64-character string |
| `CLOUDINARY_CLOUD_NAME` | from your Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | from your Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | from your Cloudinary dashboard (server only) |
| `CLOUDINARY_FOLDER` | optional, defaults to `wwh3` |

Photo uploads are optional. If the three Cloudinary variables are missing, text
editing still works; only the “Upload photo” buttons fail with a clear message.

## 3. Cloudinary (one-time)

1. Create a free account at <https://cloudinary.com>.
2. Copy the cloud name, API key and API secret from the dashboard into Netlify.
3. That is all — uploads use signed requests, so the API secret never reaches
   the browser.

## 4. Deploy

Pushing to `main` triggers the normal Netlify build (`npm run build`). The
included `netlify.toml` already points Netlify at:

- publish directory `dist`
- functions directory `netlify/functions`
- `/api/*` → `/.netlify/functions/:splat`
- everything else → `/index.html` (SPA routing)

## 5. Editing content

1. Visit `https://wwh3-run-club.netlify.app/admin` (or `/admin` from the site
   header) and enter the club password.
2. Pick **Runs**, **Events** or **Photos**.
3. Edit fields on the right, then press **Save changes**.
4. The public site re-checks `/api/content` every 30 seconds and on tab focus,
   so visitors see the update without a hard refresh.

Guides for safe publishing:

- **Published** controls whether a record appears on the public site.
- A photo also needs **Consent confirmed**; without it the photo stays hidden.
- **Reload** discards local changes and pulls the server copy.
- **From title** fills a URL slug from the title. Keep slugs stable once shared.
- Governance text (club rules, history) is intentionally not editable here.

## 6. Offline editing

`/admin` keeps a draft in the browser’s `localStorage`:

- Edits are written to the draft as you type.
- If a save fails (no signal, server error), the draft is marked pending and
  Pending changes retry automatically every 20 seconds and when the browser
  reports it is back online.
- A service worker (production only) caches the app shell so `/admin` still
  opens after a connection drop.
- The draft is per-browser. Clearing site data, or editing from another device,
  will not see it.

## 7. Security notes

- Sessions are stateless, HMAC-signed cookies, `HttpOnly`, `Secure`,
  `SameSite=Lax`, valid for 8 hours. Signing out clears the cookie.
- Login failures are rate limited per IP (8 per 10 minutes). Netlify Functions
  scale horizontally, so treat this as a speed bump, not a hard lockout.
- `PUT /api/content` and `/api/cloudinary-sign` require a valid session.
- Same-origin `Origin`/`Referer` headers are checked on writes as CSRF defence.
- Rotating `SESSION_SECRET` signs everyone out. Rotating
  `ADMIN_PASSWORD_HASH` changes the password.

## 8. Local development

```powershell
npm install
npm run dev            # public site on http://localhost:5173
```

The admin API needs the Netlify Functions runtime:

```powershell
npm install -g netlify-cli
netlify login
netlify link           # connect to the WWH3 Netlify site
# put the variables from .env.example into .env.local
netlify dev            # site + functions on http://localhost:8888
```

Without `netlify dev`, the public site still renders seed content and `/admin`
still opens drafts, but sign-in and saving report a network error.

## 9. Troubleshooting

| Symptom | Check |
| --- | --- |
| “Could not sign in.” | `ADMIN_PASSWORD_HASH` exists and starts with `scrypt:`. Regenerate if unsure. |
| Save says “Unauthorized.” right after signing in | `SESSION_SECRET` is missing or shorter than 16 characters, so the cookie cannot be verified. |
| Upload says “Cloudinary is not configured.” | The three `CLOUDINARY_*` variables are set. |
| Saved, but the public page is unchanged | Wait 30 seconds or focus the tab; check that **Published** is on. |
| Photo is hidden after publishing | **Consent confirmed** is off. |
| Signed out after every deploy | `SESSION_SECRET` changed between deploys. |
