# CareFlow Mobile — Design Parity Plan

## 1. Reference source (actual paths)

| Item | Location |
| --- | --- |
| Customer website (Magic Patterns export, Vite + React 18 + Tailwind 3.4) | `E:\new\health\website\` |
| Home page composition | `website/src/pages/Home.tsx` (18 sections, see §4) |
| Design tokens | `website/tailwind.config.js`, `website/src/index.css` |
| Photography | `website/public/*.jpg` (37 files, mapped in `website/src/data/images.ts`) |
| Editorial content + dictionaries | `website/src/data/*.ts` (services, nurses, articles, faqs, testimonials, translationsEn/Ar) |
| Website ⇄ API mapping (reference for the mobile API layer) | `website/src/utils/liveAdapter.ts`, `docs/website-integration.md` |
| Admin dashboard (not a design reference) | `care-frontend/` |

Nothing was missing: the website source and every image were available, so no design reference is guessed.

## 2. Design system extracted from the website

### Colours (tailwind.config.js → `src/theme/colors.ts`)
| Token | Hex | Use |
| --- | --- | --- |
| `brand` | `#0F766E` | primary buttons, links, accents |
| `brand-dark` | `#115E59` | pressed state, badge text, price figure |
| `brand-deep` | `#0B3F3B` | announcement bar, footer, final CTA, dark quote cards |
| `mint` | `#DDF5EC` | tinted sections, icon discs, active chips |
| `mint-soft` | `#EEF9F4` | soft fills |
| `ivory` | `#FAFAF7` | page background |
| `ink` | `#172B2A` | text |
| `muted` | `#6B7C7A` | secondary text |
| `line` | `#E5ECE9` | borders / dividers |
| `coral` / `coral-soft` | `#D9694A` / `#FCEDE7` | errors, "In focus" kicker, cancelled |
| amber badge | `#FDF3DC` on `#7A5310` | pending states |

Sections alternate `ivory → white → mint` exactly like the website.

### Typography
* Latin body/UI: **Manrope** (400–800). Display headings: **Newsreader** (400/500/600 + italic; hero line 2 is italic brand-colour).
* Arabic (body and headings): **IBM Plex Sans Arabic** (400–700) — the website swaps display headings to Plex Arabic with letter-spacing 0 in RTL; the app does the same.
* All three families are bundled via `@expo-google-fonts/*` (the same Google families the website imports) — no substitution needed.
* Scale (mobile-adapted from the website's responsive classes): hero 54/0.98 → 46/1.02 on narrow phones; section titles 34–38/1.06; body 17/1.6; labels 13–15.

### Shape, elevation, motion
* Pill buttons (`rounded-full`), heights 36 / 44 / 52; primary has a soft brand shadow, secondary is white with `line` border.
* Cards: `rounded-3xl` (24) with 1 px `line` border on white; large photos `rounded-[32px]`; service cards `rounded-2xl` (16) on 4:3 images.
* Shadows `soft` / `lift` reproduced with iOS shadow props + Android elevation.
* Press feedback replaces hover: scale 0.97 on buttons, opacity on cards. Entrance motion limited to the booking-total pop; respects reduce-motion.
* Icons: Lucide (same set as the website) via `lucide-react-native`.
* Logo: website's SVG mark (roof arc + smile arc in a rounded square, "Care**Flow**" wordmark) re-drawn with `react-native-svg` — dark and light variants.

## 3. Mobile adaptations (what changes vs. the desktop site)

| Website pattern | Mobile adaptation |
| --- | --- |
| Sticky top nav with services mega-menu | Compact branded header (logo, language toggle, menu button) + slide-in menu sheet with the website's 10 links; bottom tabs instead of top nav |
| Hero 2-column + floating "next visit" card + search panel | Stacked: trust kicker → headline → body → CTAs → photo with overlapping visit card → search panel card (service sheet / gender chips / duration chips) |
| 4-column service grid | 2-column grid of image cards on Home (8 services); full list screen with search + category chips |
| Nurse grid with filter bar | Horizontal carousel on Home; Find-a-nurse screen = FlatList + filter bottom sheet (service, gender, sort) |
| Life-stage grid, gallery slider | Horizontal snap carousels |
| Radix accordion FAQ | Animated accordion (`LayoutAnimation`) |
| Hover states | Pressed states |
| Multi-step `/book` page | Full-screen stepper with progress bar, per-step validation, sticky bottom bar (Back / Continue) that never covers content |
| Footer | Native equivalent: brand-deep block with links, language, contact, legal |

## 4. Homepage section inventory → mobile component

| # | Website section (`components/home/*`) | Mobile component (`src/features/home/*`) | Notes |
| - | --- | --- | --- |
| 0 | `AnnouncementBar` | `AnnouncementBar` | brand-deep strip, link to services |
| 0 | `SiteHeader` | `AppHeader` | logo, language switch, menu |
| 1 | `HomeHero` (+`HeroVisitCard`, `HeroSearchPanel`) | `HomeHero` | photo `hero`; visit card uses first real nurse if the API returns one, labelled "Sample" |
| 2 | `TrustStrip` | `TrustStrip` | 4 items stacked |
| 3 | `ServicesShowcase` | `ServicesShowcase` | live services (API), 2-col grid |
| 4 | `EditorialStory` | `EditorialStory` | photo `story` + dark quote card |
| 5 | `NurseFinder` | `NurseFinder` | service picker, gender chips, available toggle, 4 live nurse cards |
| 6 | `HowItWorksSteps` | `HowItWorksSteps` | mint background, vertical timeline |
| 7 | `LifeStages` | `LifeStages` | 4 photo cards, horizontal snap |
| 8 | `WhyChoose` | `WhyChoose` | 3 photos + 4 benefits |
| 9 | `RealLifeBanner` | `RealLifeBanner` | full-bleed photo with overlapping white card |
| 10 | `BookingPreview` | `BookingPreview` | days stepper, estimate = daily rate × days (labelled illustrative; real price comes from `/bookings/quote`) |
| 11 | `CareProfessionals` | `CareProfessionals` | spotlight card + list |
| 12 | `ServiceGallery` | `ServiceGallery` | 4 photos, snap carousel |
| 13 | `FamilyStories` | `FamilyStories` | lead quote on brand-deep + cards; **labelled sample** (the website marks them illustrative) |
| 14 | `CareStandards` | `CareStandards` | 4 points + photo |
| 15 | `HomeJournal` | `HomeJournal` | featured + rows |
| 16 | `HomeFaq` | `HomeFaq` | accordion (first 7) |
| 17 | `FinalCta` | `FinalCta` | brand-deep card with photo |
| 18 | `NewsletterSection` | `NewsletterSection` | validated, **not submitted** — the backend has no subscription endpoint; the UI says so |
| 19 | `SiteFooter` | `SiteFooter` | native equivalent |

## 5. Reusable components (`src/components`)

* `ui/`: `Text`, `Button`, `Badge`, `Chip`, `TextField`, `SelectSheet`, `Stepper (days)`, `Accordion`, `SmartImage` (expo-image, placeholder + fallback), `Skeleton`, `StateMessage` (loading / empty / error+retry), `SectionHeader`, `SampleNote`, `Logo`, `Icon wrappers (RTL-aware arrows)`.
* `layout/`: `Screen`, `Section` (background tone + spacing), `AppHeader`, `MenuSheet`, `BottomSheet`, `AnnouncementBar`, `SiteFooter`, `StickyBar`.
* `cards/`: `ServiceCard`, `NurseCard`, `ArticleCard`, `BookingCard`, `TestimonialCard`.
* `booking/`: `BookingProgress`, `BookingSummary`, `StatusTimeline`, `PriceBreakdown`.

## 6. Navigation

* **Signed out**: tabs `Home · Services · Find a nurse · Resources · Account`(→ sign in). Menu sheet carries the rest of the website links (How it works, Why CareFlow, About, Stories, FAQs, Contact, legal).
* **Patient**: tabs `Home · Explore · My bookings · Profile`. "Explore" = services + nurses + resources segmented hub.
* **Nurse**: tabs `Dashboard · Bookings · Earnings · Profile` (availability / time-off are reached from Profile & Dashboard). No patient booking route is mounted.
* **Staff roles (ADMIN / FINANCE_APPROVER)**: blocked screen pointing to the web dashboard.

## 7. Assets

* 37 website photos copied to `assets/images/` (unchanged, ~100–300 KB each, 1.0–1.4 MP). They are referenced from the website data files as `/uuid.jpg`; `src/assets/imageMap.ts` resolves each path to a static `require` so Metro bundles them. `expo-image` decodes at display size.
* Nurse/service pictures that the backend serves (`/api/v1/media/:id`) take precedence over bundled photos whenever the API returns them; bundled photos are the editorial/marketing imagery only (hero, story, gallery, stages …) exactly as on the website.
* Logo: vector (SVG). App icon / splash regenerated from the same mark in brand colours.

## 8. Known limits / honest notes

* Parity is judged by side-by-side visual comparison (see README "Verification"), not claimed pixel-perfect.
* Website testimonials, nurse qualifications and some FAQ answers are labelled "sample" on the website; the app keeps those labels.
* Social profile and contact details are "to be confirmed" on the website; the app repeats that rather than inventing details.
