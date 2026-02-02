# CLAUDE.md - project context & design system

> this file is automatically read by claude code at the start of every conversation.
> last updated: 2026-02-01

---

**DO NOT USE EMOJIS OR EMOTICONS ON ANY PART OF THIS PROJECT, INCLUDING THE CLAUDE.md FILE AND OTHER DOCUMENTATION**
**FOR REGULAR TEXT, DO NOT CAPITALIZE ANYTHING. MOST THINGS SHOULD BE ALL CAPS OR ALL LOWER CASE. THIS IS EXEMPT FOR CODE, FILE STRUCTURE, OR OTHER NAMING CONVENTION. THIS IS JUST FOR TEXT**

---

## how to use this document

### prompting techniques

| Syntax | Purpose | Example |
|--------|---------|---------|
| `**bold text**` | emphasize critical constraints | `**never use inline styles**` |
| `[PLACEHOLDER]` | indicate variables/options | `create a [component-name] component` |
| `MUST` / `NEVER` / `ALWAYS` | trigger strict adherence | `MUST use TypeScript for all new files` |
| `@update-claude-md` | ask claude to update this doc | `@update-claude-md add our button pattern decision` |
| `@design-check` | ask claude to verify against design principles | `@design-check does this follow our swipe patterns?` |
| `@explain-decision` | ask claude to explain reasoning with design context | `@explain-decision why this approach?` |

### quick commands

- `"save this to claude.md"` - add current decision/pattern to this document
- `"what does claude.md say about [topic]?"` - query specific guidance
- `"review claude.md"` - get a summary of current principles/constraints

---

## project overview

**project name:** mark.it
**type:** mobile app (cross-platform iOS + Android)
**tech stack:** React Native (Expo), TypeScript, Firebase (Auth, Firestore, Storage, FCM)
**development environment:** ubuntu terminal (WSL on windows)

---

## design principles (hci fundamentals)

### interaction patterns

- **navigation:** bottom tabs for main sections (Feed, Create, Messages, Friends, Profile)
- **feed browsing:** tabbed interface (friends vs friends+), pull-to-refresh, infinite scroll
- **photo viewing:** swipeable carousel with dot indicators
- **"mark.it" action:** soft reservation system - seller sees who marked
- **messaging:** real-time chat tied to specific listings
- **touch targets:** platform-native sizing (iOS HIG / Material Design standards)

### visual design

- **design system:** platform-native UI (react-native-paper with iOS overrides)
- **typography:** system fonts (San Francisco on iOS, Roboto on Android)
- **color system:** platform defaults with customization via react-native-paper theming
- **spacing system:** consistent padding/margins using theme constants
- **images:** photo carousels for listings (1-4 photos), compressed thumbnails in feed

### feedback & affordances

- **loading states:** pull-to-refresh indicators, inline spinners for async actions
- **error handling:** toast notifications for transient errors, inline validation for forms
- **success feedback:** animated "mark" button, haptic feedback on key actions
- **empty states:** friendly messages with call-to-action for empty feeds/lists
- **notifications:** push notifications for marks and messages

---

## technical decisions

### architecture patterns

| decision | choice | reasoning | date |
|----------|--------|-----------|------|
| platform | React Native + Expo (managed workflow) | fastest cross-platform development, built-in modules, EAS Build deployment | 2026-02-01 |
| backend | Firebase (Auth, Firestore, Storage, FCM) | fully managed, real-time sync, no backend code needed for MVP | 2026-02-01 |
| state management | React Context + Custom Hooks | MVP complexity doesn't warrant Redux; Firebase listeners fit naturally with Context | 2026-02-01 |
| navigation | React Navigation v6 | mature library, excellent TypeScript support, flexible navigation patterns | 2026-02-01 |
| UI components | react-native-paper (Material) | cross-platform consistency, extensive components, customizable theme | 2026-02-01 |
| TypeScript | strict mode enabled | type safety, better DX, catch bugs at compile time | 2026-02-01 |
| data model | denormalized Firestore | store seller info on listings to reduce reads; acceptable duplication at MVP scale | 2026-02-01 |
| friends+ network | client-side filtering | Firestore doesn't support graph queries efficiently; acceptable for MVP scale (<100 friends) | 2026-02-01 |
| payments | external (Venmo/Cash App) | no in-app payment for MVP; users coordinate externally | 2026-02-01 |

### code conventions

- **file naming:** PascalCase for components (ListingCard.tsx), camelCase for utilities (imageCompression.ts)
- **component structure:** functional components with hooks, TypeScript interfaces, organized by feature
- **state management:** custom hooks per feature (useListings, useFriends, useMessages)
- **imports:** absolute paths using TypeScript aliases (@components/*, @hooks/*, etc.)
- **folder structure:** feature-based organization (screens, components, hooks, services)

---

## lessons learned (DO NOT REPEAT)

<!-- claude: add issues we've fixed here so you don't reintroduce them -->

| issue | what went wrong | correct approach | date |
|-------|-----------------|------------------|------|
| scope creep during planning | initial feature discussions could expand infinitely | explicitly define MVP vs post-MVP features; skip analytics, QR codes, search, reputation system for v1 | 2026-02-01 |
| emojis in documentation | used emojis in summaries and documentation | NEVER use emojis or emoticons anywhere in the project | 2026-02-01 |
| improper text casing | capitalized regular text unnecessarily | keep regular text lowercase; use ALL CAPS or all lowercase for emphasis; exempt code/file names | 2026-02-01 |

---

## reminders for claude

1. **before writing code:** check if this document has relevant patterns/decisions
2. **after making decisions:** offer to update this document
3. **when uncertain:** ask rather than assume - reference this doc for established patterns
4. **at session end:** prompt user: "should i update CLAUDE.md with today's decisions?"
5. **NO EMOJIS:** never use emojis or emoticons anywhere
6. **text casing:** keep regular text lowercase; only capitalize code, files, or proper technical names

---

## current priorities

### MVP feature set (must have)
1. authentication (email/password, Google, Facebook SSO)
2. user profiles with bio, city, custom closets
3. friend system (username search, friend requests, friends vs friends+ network)
4. listings (create with 1-4 photos, organize in closets, privacy toggle)
5. feed (friends/friends+ tabs, category filtering, browse-only)
6. "mark it" system (soft reservation, seller sees who marked)
7. real-time messaging (Firestore chat, tied to listings)
8. push notifications (marks and messages only)

### explicitly OUT of MVP
- analytics dashboard
- QR code friend adding
- reputation/rating system
- search functionality
- precise location/maps
- in-app payments
- price editing notifications

### next steps
1. ~~initialize expo project with TypeScript~~
2. ~~set up folder structure~~
3. ~~create core TypeScript types~~
4. build navigation skeleton (hollow frame)
5. create placeholder screens with mock data
6. implement UI framework without firebase
7. configure firebase later for backend integration

---

## session log

### 2026-02-01 - initial planning & architecture design
- conducted comprehensive requirements interview using AskUserQuestion
- defined complete tech stack: React Native (Expo) + Firebase + TypeScript
- established MVP feature boundaries (8 core features, 6 explicitly excluded)
- designed Firestore data model with denormalization strategy
- created navigation hierarchy (bottom tabs + stacks)
- planned 11-phase implementation roadmap
- key decisions: Context over Redux, client-side friends+ filtering, platform-native UI

### 2026-02-01 - phase 1 implementation (foundation)
- installed Node.js v24.13.0 via nvm in ubuntu/WSL environment
- installed 1106 npm packages (React Native, Expo, Firebase, navigation, etc.)
- created complete project structure (src/, components/, screens/, hooks/, services/)
- defined all TypeScript types (user, listing, friend, message, notification)
- configured theme constants and app config
- created firebase config template (ready for credentials)
- established text casing rules (lowercase for regular text, no emojis)
