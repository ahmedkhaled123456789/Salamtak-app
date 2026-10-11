# CareFlow Mobile — API Integration Plan

Base: `{API_BASE_URL}/api/v1`. All JSON responses use the envelope `{ success, data, message?, errorCode? }`; lists return `{ items, meta? }`.
Source of truth: `docs/openapi.json` and `care-backend/src/modules/*`, cross-checked with `website/src/utils/liveAdapter.ts` (which already drives the same patient flow in production code).

## 1. Authentication

| Flow | Endpoint | Mobile use |
| --- | --- | --- |
| Register | `POST /auth/register` `{firstName,lastName,email,phone(E.164),password,role}` | patients (`role: PATIENT`); nurses self-register as `NURSE` but must complete verification on the web/admin side (no document upload UI in v1) |
| Login | `POST /auth/login` → `{user{role…}, tokens{accessToken,refreshToken}}` | tokens → Expo SecureStore (web preview: sessionStorage) |
| Refresh | `POST /auth/refresh` `{refreshToken}` (rotating) | one shared refresh promise on 401, then retry once; failure → session-expired event → sign-in |
| Logout | `POST /auth/logout` `{refreshToken}` | always clears local tokens first |
| Forgot password | `POST /auth/forgot-password` `{email}` | implemented |
| Reset password | `POST /auth/reset-password` `{token,newPassword}` | implemented (token entered/pasted from the email, or opened via `careflow://reset-password?token=`) |
| Change password | `POST /auth/change-password` | Profile → security |
| Rate limits | login limiter 5/min per email | 429 surfaced as "try again shortly" |

Role routing: `PATIENT` → patient app; `NURSE` → nurse app; `ADMIN`/`FINANCE_APPROVER` → blocked screen (dashboard only). Security is enforced by the backend; navigation is UX only.

## 2. Public catalogue (no auth)

| Endpoint | Use |
| --- | --- |
| `GET /public/services` | service list: `id, name, slug, description, category, min/maxDurationMinutes, imageUrl, baseRatesMinor.daily` |
| `GET /public/services/:slug` | service detail |
| `GET /public/nurses?serviceId&gender&sort&limit` | nurse cards (ACTIVE + VERIFIED only): `displayName, imageUrl, serviceIds, dailyRateMinor, price, specializations, languages, yearsOfExperience, averageRating, city` |
| `GET /public/nurses/:id` | nurse profile |
| `GET /media/:id` | pictures (public, immutable) — absolute URL = `API_BASE_URL + imageUrl` |

Editorial extras (Arabic titles, "what's included", qualifications) come from the bundled website data, matched by **service slug / nurse name**, and are never used for ids, prices or images (same rule as the website's live adapter). A service/nurse unknown to the bundle shows its backend text in both languages.

## 3. Patient booking flow

| Step | Endpoint | Notes |
| --- | --- | --- |
| Quote | `POST /bookings/quote` `{serviceId,nurseId,startDateTime,endDateTime,location?,genderPreference?}` → price lines, `patientPayableMinor`, `quoteToken` | backend-calculated; the UI never computes the payable amount itself. A care day = 24 h block from 09:00 platform time (`+04:00`, configurable) |
| Create | `POST /bookings` + header `Idempotency-Key` + body incl. `quoteToken`, `location{lat,lng,address,city}` | one key per wizard session; retries re-use it. 409 → "professional no longer available" → back to the nurse step |
| List / detail / history | `GET /bookings`, `/bookings/:id`, `/bookings/:id/history` | 16 backend states are shown as-is (see §6) |
| Cancel | `POST /bookings/:id/cancel` | offered only for states the backend allows (`PAYMENT_PENDING, NURSE_PENDING, NURSE_ACCEPTED, CONFIRMED`); server may still reject |
| Review | `POST /bookings/:id/review` | out of scope v1 |

## 4. Payments

* `POST /payments/create {bookingId}` → `{id, status, clientSecret, redirectUrl}`.
* If `redirectUrl` exists it is opened with `expo-web-browser`; afterwards the app **polls `GET /bookings/:id`** (and `GET /payments/:id`) until the backend reports a paid state.
* **Success is never assumed**: "Payment successful" is shown only when the booking is in `PAID / NURSE_PENDING / NURSE_ACCEPTED / CONFIRMED / CARE_*` / `COMPLETED`. Otherwise the UI shows pending/processing and keeps polling (bounded), with a manual refresh.
* The backend confirms payments only from the provider's signed webhook. With the development mock provider there is no hosted page, so the booking stays "processing" until a webhook arrives (`POST /payments/dev/simulate` is admin-only and is **not** called by the app).
* A native card form needs the chosen provider's SDK — not available yet; documented as a gap.

## 5. Patient account

`GET/PATCH /users/me`, `GET/PATCH /patients/me` (address, city), `PUT /users/me/avatar` (multipart `file`, JPEG/PNG/WebP ≤ 5 MB via `expo-image-picker`). Phone is verified server-side → read-only in the app. Language preference is stored on the device (no API field).

## 6. Booking states (backend → UI)

`PENDING, PAYMENT_PENDING, PAID, NURSE_PENDING, NURSE_ACCEPTED, NURSE_REJECTED, CONFIRMED, CARE_STARTED, CARE_IN_PROGRESS, COMPLETED, CANCELLED, EXPIRED, REFUND_PENDING, REFUNDED, DISPUTED, FAILED`.
Patient tabs: **Upcoming** (pending/payment/paid/nurse-*/confirmed), **In progress**, **Completed**, **Cancelled/other** (cancelled, expired, rejected, failed, refund*). Actions: *Pay* only for `PAYMENT_PENDING`; *Cancel* per §3.

## 7. Nurse workflows (supported by the backend → implemented)

| Feature | Endpoint |
| --- | --- |
| Profile / services / status | `GET/PATCH /nurses/me`, `GET /nurses/me/services`, `PATCH /nurses/me/status {status: ACTIVE|INACTIVE}` (pause/resume) |
| Availability (weekly) | `GET/POST/PATCH/DELETE /nurses/me/availability` (`kind: WEEKLY` `dayOfWeek 1–7`, `startTime`, `endTime`) |
| Holidays / time off | same resource, `kind: BLOCKED` `{type: VACATION|BLOCKED|HOLIDAY, dateFrom, dateTo, reason}`; date overrides `kind: DATE` |
| Requests / schedule / completed | `GET /bookings` (server scopes by role), `GET /bookings/:id` |
| Accept / reject | `POST /bookings/:id/accept`, `POST /bookings/:id/reject {reason?}` — buttons shown only for `NURSE_PENDING`; `409` shown inline |
| Start / complete care | `POST /bookings/:id/start`, `/complete` — `CONFIRMED` / `CARE_*` only |
| Earnings | `GET /wallets/me` (available, pending, total earned, withdrawn), `GET /wallets/me/transactions` |
| Not in v1 | verification documents upload, payout requests/method, chat (REST+Socket.IO), push devices, emergency offers, reviews |

Nurse screens never request `/admin/*` and only render fields the server returns for the nurse role (patients' addresses are shown only on the nurse's own bookings, as returned by the API).

## 8. Missing / limited backend capabilities

| Need | Status |
| --- | --- |
| Newsletter subscription | **No endpoint** — form validates only, tells the user nothing is saved |
| Contact form | **No endpoint** — mobile shows contact info "to be confirmed" like the website |
| Articles / FAQs / testimonials | **No endpoint** — bundled website editorial content (testimonials marked sample) |
| Arabic service/nurse text | API has no localized fields → bundled translations matched by slug/name |
| Geocoding | none → city-centre coordinates (Riyadh/Jeddah/Dammam, from the website adapter) are sent as `location`; the API checks the nurse's service radius against them |
| Currency | backend prices in AED; the app formats whatever `currency` the API returns |
| Hosted card payment | needs provider redirect or SDK; mock provider has no hosted page |
| Reset-password email deep link | token must be entered manually unless the email template targets `careflow://` |

## 9. Client architecture

```
src/api/client.ts      fetch wrapper, envelope, refresh-once, timeout, ApiError, mediaUrl
src/api/tokens.ts      SecureStore (native) / sessionStorage (web) token store
src/api/auth.ts catalog.ts bookings.ts payments.ts profile.ts nurse.ts   typed modules
src/hooks/*            TanStack Query hooks + mutations (invalidate on success)
src/state/auth.tsx     session bootstrap (refresh → /users/me), role, sign-in/out
src/state/bookingDraft.tsx   wizard state + idempotency key (AsyncStorage-backed)
```

* Config: `EXPO_PUBLIC_API_BASE_URL`; when unset in development the host is derived from Expo's dev server host (physical device) or `10.0.2.2` (Android emulator). Never a hard-coded personal IP.
* No secrets in the app. Tokens, OTPs and payment payloads are never logged.
