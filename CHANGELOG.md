# Changelog

## 2026-08-15 - Migrate sanjitchakrabarti.com to Sites and add PhonePe checkout

### What changed

- Preserved the existing personal-business homepage, responsive cream/gold design, policy pages, robots file, sitemap, pricing, contact details, and exact refund wording.
- Added a dedicated any-amount PhonePe checkout at `/checkout`, a verified payment-status page at `/checkout/status`, and protected order, status, and webhook APIs.
- Added Sites-compatible Worker/Vite hosting, D1 migrations, local tests, and deployment metadata for a new project that is separate from Finest Clients.

### Behavior and configuration

- Customers enter their name, email, phone number with country code, and any INR amount from ₹1 up to ₹1 crore before continuing to PhonePe's hosted checkout.
- PhonePe redirects customers to `/checkout/status`, where the server checks the provider order and exact amount before showing success.
- Production requires protected `PHONEPE_CLIENT_ID`, `PHONEPE_CLIENT_SECRET`, `PHONEPE_CLIENT_VERSION`, `PHONEPE_WEBHOOK_USERNAME`, and `PHONEPE_WEBHOOK_PASSWORD` values. The webhook subscribes only to `checkout.order.completed` and `checkout.order.failed`.
- The apex and `www` domains move from GitHub Pages to the dedicated Sites project; the GitHub repository remains the source of truth on `master`.

### Security and data implications

- Credentials and OAuth tokens remain server-side and are never committed, returned to the browser, or stored in D1.
- Order creation requires an exact same-origin browser request and is rate-limited. Webhooks use constant-time SHA-256 authorization checks, and completed payments require an exact provider amount match.
- D1 stores payer name, normalized email, multiple phone numbers per email, amount, provider order identifiers, payment state, and timestamps. It never stores card, bank, or UPI credentials.
- This Sites project and D1 database are independent from the Finest Clients repository, production project, database, and custom domains.

### Verification performed

- Ran `npm run lint`, `npm test`, `git diff --check`, dependency vulnerability checks, local desktop/mobile checks, and post-deployment production checks for the homepage, policies, checkout, status page, and APIs.

### Rollback

- Repoint the apex A records and `www` CNAME to GitHub Pages, re-enable GitHub Pages for `master`, and remove the Sites custom domains. Revert this commit only if the checkout source should also be removed. Removing the D1 database would permanently delete payment audit records and is not part of routine rollback.
