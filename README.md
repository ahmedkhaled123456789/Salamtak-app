# CareFlow Mobile

React Native (Expo SDK 57, TypeScript strict, Expo Router) app for the CareFlow home-care marketplace. It recreates the
customer website in `../website/` (same colours, fonts, photography, section order and copy) as native screens and talks to the
real `../care-backend/` API. Patients browse services and nurses, book and pay; nurses manage requests, availability and earnings.

* Design reference & mapping: [docs/DESIGN_PARITY_PLAN.md](docs/DESIGN_PARITY_PLAN.md)
* Endpoints, flows, gaps: [docs/API_INTEGRATION_PLAN.md](docs/API_INTEGRATION_PLAN.md)

## Run on Android

Prerequisites: Node 20+, the backend running (see below), and either an Android emulator (Android Studio) or a phone with **Expo Go**
(or a development build).

```bash
cd care-mobile
npm install
cp .env.example .env          # optional, see "API connectivity"
npx expo start                # then press "a" (emulator) or scan the QR code with Expo Go
# or directly:
npm run android
```

Other targets: `npm run ios` (macOS), `npm run web` (browser preview; useful for quick visual checks).

Production-style bundle check (no device needed): `npm run export:android` → Hermes bytecode in `dist/`.

### API connectivity

`src/lib/config.ts` resolves the backend origin in this order:

1. `EXPO_PUBLIC_API_BASE_URL` (always wins; required for release builds, e.g. `https://api.example.com`).
2. Development only: the Expo dev-server host (works for a physical phone on the same Wi-Fi) on port `EXPO_PUBLIC_API_DEV_PORT` (default `5050`).
3. Android emulator fallback `http://10.0.2.2:5050`, otherwise `http://localhost:5050`.

Nothing is hard-coded to a developer IP. For a physical device make sure the PC firewall allows the backend port and the backend's
`CORS_ORIGINS` is irrelevant to native apps (it only matters for the web preview, where you add `http://localhost:8081`).
Release builds without `EXPO_PUBLIC_API_BASE_URL` show the "offline" state instead of guessing a host.

Backend (separate terminal), local database/Redis of your choice — **never point development at the Atlas cluster**:

```bash
cd care-backend
MONGODB_URI=mongodb://127.0.0.1:27017/care?replicaSet=rs0 REDIS_URL=redis://127.0.0.1:6379 RATE_LIMIT_STORE=memory PORT=5050 npx tsx src/server.ts
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run typecheck` | `tsc --noEmit` (strict) |
| `npm run lint` | `expo lint` (eslint-config-expo, React Compiler rules) |
| `npm test` | unit tests (jest-expo, Testing Library) |
| `npm run test:live` | opt-in end-to-end API checks against a running **disposable** backend (see `src/api/live.test.ts`) |
| `npm run export:android` / `export:web` | production bundle checks |

## Structure

```
src/app/            Expo Router routes: (tabs)/ (role-aware tab bar), book, checkout/[id], bookings/[id], sign-in …
src/components/ui|layout|cards|booking/   design system & reusable components
src/features/home|browse/                 homepage sections, service/nurse/resource browsers
src/theme/          colors, typography (Manrope / Newsreader / IBM Plex Sans Arabic), spacing, radii, shadows
src/api/            typed client (refresh-once, timeout, envelope) + auth/catalog/bookings/nurse modules
src/hooks/          TanStack Query hooks and mutations
src/state/          auth session (SecureStore tokens) and booking wizard draft (idempotency key)
src/i18n/ src/data/ i18next, website dictionaries (reused) + mobile strings; bundled editorial content
assets/images/      the website's 37 photographs (unchanged)
```

## Navigation

| Audience | Bottom tabs | Extras |
| --- | --- | --- |
| Signed out | Home · Services · Find a nurse · Resources · Account | header menu: the website's 10 links |
| Patient | Home · Explore · Bookings · Profile | wizard `/book`, checkout, booking detail |
| Nurse | Dashboard · Bookings · Earnings · Profile | availability & time off |
| Admin / finance | none — "use the web dashboard" screen | no admin data is requested |

Role gating is UX only; the backend enforces authorization.

## Arabic / English

All UI strings exist in both languages (`src/data/translations{En,Ar}.ts` from the website + `src/i18n/mobile{En,Ar}.ts`; a unit test
fails if a key or placeholder is missing). Arabic uses IBM Plex Sans Arabic, RTL layout, mirrored arrows/chevrons and Arabic plurals.
On a device the native layout direction only changes after a reload, so switching language restarts the app once (`expo-updates`
`reloadAsync`, falling back to the dev reload). The web preview accepts `?lang=ar`.

## Security notes

* Tokens live in Expo SecureStore (sessionStorage only in the web preview). No tokens, passwords, OTPs or payment payloads are logged.
* Only `EXPO_PUBLIC_*` public configuration exists; no database, Redis, payment or backend secrets are in the app.
* Booking creation sends an `Idempotency-Key` and re-uses the same quote token on retry; payment success is shown only once the
  backend reports a paid booking state (the provider's signed webhook), never because a button was tapped.
* The `next` return-path parameter only accepts in-app absolute paths.

## Verification performed (2026-10-10)

See the "Results" section of the hand-off for exact output. Summary of what was run: `tsc --noEmit`, `expo lint`, `jest` (32 unit
tests), `expo export --platform android` (Hermes bundle), `expo export --platform web`, live API tests and a Chrome (Playwright) UI
walk-through — all against a **disposable in-memory MongoDB + local Redis + local backend**, never Atlas. Not performed: running on a
real Android emulator/device (no Android SDK on this machine), a card payment against a real provider, push notifications.

### Audit update (2026-10-11)

Re-verified after the audit changes (see `../docs/FULL_PROJECT_AUDIT.md`, IDs M1–M8): `npm run typecheck` ✅, `npm run lint` ✅,
`npm test` ✅ 35/35, `expo export --platform android` ✅ (export 14 MB → 12 MB). Changes: branded icon/adaptive icon/splash
(`python scripts/brand-assets.py` regenerates them — the previous files were the Expo template), WebP bundled photos, per-weight
font imports, bounded and offline-safe token refresh, font-error fallback, stricter `safeNext`. Live API tests were **not** re-run
(they need a seeded disposable backend). Rebuild the native app to pick up the new icon and splash.

## Push notifications

`src/lib/push.ts` registers the device with the backend (`POST /devices`) using an **Expo push token**. Permission is
requested right after the user creates a booking — never on first launch — and later sessions re-register silently only
if permission was already granted. Signing out unregisters the device first. Requirements: an EAS project id
(`eas init` writes `extra.eas.projectId` to `app.json`; without it push is skipped quietly) and `PUSH_PROVIDER=expo` on the
backend. Android uses a `bookings` notification channel; `POST_NOTIFICATIONS` is declared in `app.json`.

## Builds (EAS)

`eas.json` has `development`/`preview` (internal APK) and `production` (store bundle) profiles, each with its own
`EXPO_PUBLIC_API_BASE_URL` — replace the `example.ae` placeholders with the real API URLs. Release builds have no
development fallback, so a missing URL shows a clear "not configured" error instead of calling the wrong server.

```bash
npm i -g eas-cli && eas login && eas init
eas build --profile preview --platform android     # installable APK for testers
eas build --profile production --platform android  # Play Store bundle
```

## Device test checklist (before each release)

Run on at least one small Android phone (≈5.5", Android 10–11) and one large recent phone (Android 14+), in English and Arabic:

1. Cold start shows the CareFlow splash, then the home screen within a few seconds; airplane mode at launch still opens the app (signed out) with a clear offline message on data screens.
2. Sign up → phone code SMS arrives → verify; sign out; sign in again; kill the app and reopen → still signed in.
3. Browse services and nurses (scroll long lists smoothly); open a nurse profile; images load and are not distorted.
4. Book: pick service, dates, **emirate**, address; nurse; review the price; submit once (double-tap does not create two bookings); notification permission prompt appears after booking.
5. Pay with a Stripe test card; booking shows "processing" then "confirmed" only after the backend confirms; cancel a booking and check the refund shown matches the policy on the FAQ.
6. Receive a push notification for a booking update (app in background and closed); tapping it opens the app.
7. Bookings tab: scroll to load older bookings; pull to refresh.
8. Arabic: whole UI right-to-left, numbers and dates readable, no clipped text at the largest system font size.
9. TalkBack: every button and form field is announced with a sensible label; focus order follows the screen.
10. Nurse account: accept/reject a request, start and complete care, view earnings, edit availability.

## Known limitations / backend gaps

* **Hosted payment**: the backend confirms payments only from the provider's webhook; with the development mock provider there is no
  hosted page, so a payment stays "processing" until the webhook fires (in dev an admin calls `/payments/dev/simulate`). A native card
  form would need the real provider's SDK.
* Contact form and newsletter now use the backend (`POST /public/contact`, `/public/newsletter`). Articles, FAQs and
  testimonials are still bundled content; testimonials stay labelled "sample".
* **Arabic names** of services/nurses come from the bundled website content matched by slug/name (the API has no localized fields).
* **Nurse onboarding** (document upload, verification submission, payouts, chat, emergency offers, reviews) is not in v1.
  Nurses sign in with existing accounts; patient self-registration only.
* **Location**: no geocoder; the booking sends the chosen **UAE emirate's** centre coordinates (`src/data/emirates.ts`) for the
  service-radius check (falls back to the profile city, then the nurse's city, then Dubai).
* The bookable window is capped by the backend (e.g. 90 days ahead); the date picker doesn't pre-empt that — the server's rejection is shown.
* Photos are bundled as WebP (2.5 MB for 37 photos, was 5.8 MB of JPEG); `assets/images/*.jpg` are kept only as originals.
