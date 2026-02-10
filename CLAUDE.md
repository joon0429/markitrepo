# CLAUDE.md - project context & design system

> this file is automatically read by claude code at the start of every conversation.
> last updated: 2026-02-10 (session 2)

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

---

## project overview

**project name:** mark.it
**type:** mobile app (cross-platform iOS + Android)
**tech stack:** React Native (Expo managed workflow), TypeScript, Firebase (Auth, Firestore, Storage, FCM)
**development environment:** ubuntu terminal (WSL on windows); claude code runs in git bash (windows) and cannot run node/npx directly

---

## design principles

### interaction patterns

- **navigation:** bottom tabs (5 slots): home, notifs, create (modal trigger), map, profile
- **modal flows:** create listing slides up from bottom as modal, maintains page position when dismissed
- **feed browsing:** tabbed interface ("my friends" vs "friends+"), BeReal-style tabs (no underline indicator, active=white bold, inactive=gray), pull-to-refresh, infinite scroll
- **photo viewing:** swipeable carousel with dot indicators (instagram-style)
- **photo upload:** horizontal row of 4 image slots, first slot has darker border to indicate primary
- **"mark.it" action:** soft reservation system - seller sees who marked
- **messaging:** real-time chat tied to specific listings with listing context card
- **instagram-style UX:** friends list with search, DM-style conversations
- **dropdown selectors:** modal overlay with option list for structured inputs (closets)
- **header separator:** subtle border line (#2C2C2C) below all screen headers via defaultScreenOptions
- **settings access:** hamburger menu icon (menu-outline) in profile header top-right -> settings page
- **edit profile:** instagram-style edit screen (name, username, bio, profile picture placeholder)
- **search:** instant filtering (no debounce) for small datasets like friends list
- **unread indicators:** primary-colored dot + bold text for unread conversations/messages
- **message bubbles:** primary color (right-aligned) for own messages, surface color (left-aligned) for others
- **listing detail:** share button (top right), simplified seller info, mark count badge, bottom action buttons (mark it + send message)
- **messages access:** envelope icon in feed header navigates to conversations
- **privacy toggle:** native switch component instead of button groups

### visual design

- **design system:** react-native-paper with iOS overrides, dark mode only
- **theme:** background #121212, surface #1E1E1E, primary #BB86FC, text #FFFFFF
- **typography:** system fonts (San Francisco on iOS, Roboto on Android)
- **icons:** Ionicons from @expo/vector-icons (NEVER use emoji as icons)
- **placeholder images:** PlaceholderImage component with triangle icon for missing/unloaded images
- **scrollbars:** always visible (showsVerticalScrollIndicator={true})
- **text on primary buttons:** always '#FFFFFF' (not colors.background, which is dark in dark mode)

### feedback & affordances

- **loading states:** pull-to-refresh indicators, LoadingSpinner for async data, empty states when data is loaded but empty
- **error handling:** toast notifications for transient errors, inline validation for forms
- **success feedback:** animated "mark" button, haptic feedback on key actions

---

## technical decisions

### architecture

| decision | choice | reasoning |
|----------|--------|-----------|
| platform | React Native + Expo (managed workflow) | fastest cross-platform development, EAS Build deployment |
| backend | Firebase (Auth, Firestore, Storage, FCM) | fully managed, real-time sync, no backend code for MVP |
| state management | React Context + custom hooks | MVP doesn't warrant Redux; firebase listeners fit with Context |
| navigation | React Navigation v6 | mature, excellent TypeScript support |
| UI components | react-native-paper (Material) | cross-platform consistency, customizable theme |
| data model | denormalized Firestore | seller info on listings to reduce reads; acceptable at MVP scale |
| friends+ network | client-side filtering | firestore can't do graph queries; acceptable for <100 friends |
| payments | external (Venmo/Cash App) | no in-app payment for MVP |
| firebase storage | DEFERRED (requires paid plan) | all photo fields use 'placeholder' strings for now |
| auth method | email/password now, phone auth later | phone auth needs native modules (won't work in Expo Go) |
| closets | computed client-side from listing.closet field | no closets collection in firestore; useProfile groups by closet name |
| floating labels | react-native-paper TextInput mode="outlined" | Input component supports `floatingLabel` prop for Pinterest-style labels |

### key patterns

- **navigation params:** use serializable versions with ISO strings (React Navigation can't handle Timestamp objects)
- **component organization:** feature folders (profile/, friends/, messages/)
- **form input limits:** title 50 chars, description 50 words, price max $9,999.99; counters shown BELOW input boxes
- **create listing:** modal presentation at root level (not in tab navigator)
- **closet selection:** dropdown with preset options (unnamed, clothes, shoes, furniture + "add more...")
- **closet management flow:** profile -> closet detail -> edit item (no multi-select)
- **firestore 'in' query batching:** batch friendIds into groups of 30 for getFeedListings
- **real-time chat:** useChat subscribes via onSnapshot; other screens use one-time getDocs
- **conversation deduplication:** findConversation checks before creating new one
- **headers:** all via navigator screenOptions with shared defaultScreenOptions (never custom in-screen)

### firebase service layer

| service file | responsibility |
|-------------|---------------|
| `src/services/firebase/config.ts` | firebase init (auth + firestore), reads from app.config.js extra |
| `src/services/firebase/userService.ts` | user CRUD (createUserProfile, getUserProfile, updateUserProfile) |
| `src/services/firebase/listingService.ts` | listing CRUD + mark/unmark + feed queries with batching |
| `src/services/firebase/friendService.ts` | friends + requests + search (atomic accept with batch writes) |
| `src/services/firebase/messageService.ts` | conversations + real-time messages + unread tracking |

### custom hooks

| hook | screen concern |
|------|---------------|
| `useProfile` | profile + computed closets/stats from listings |
| `useListings` | feed data by visibility using friendIds |
| `useListingDetail` | mark/unmark with optimistic UI |
| `useFriends` | friends + requests + accept/decline/send/search |
| `useConversations` | conversation list sorted by updatedAt |
| `useChat` | real-time messages via onSnapshot, auto-marks as read |

### code conventions

- **file naming:** PascalCase for components, camelCase for utilities
- **components:** functional with hooks, TypeScript interfaces, organized by feature
- **imports:** absolute paths using TypeScript aliases (@components/*, @hooks/*, etc.)
- **config:** app.config.js uses CommonJS (`module.exports`), NOT ES modules

---

## lessons learned (DO NOT REPEAT)

<!-- claude: add issues we've fixed here so you don't reintroduce them -->

| issue | correct approach |
|-------|-----------------|
| scope creep during planning | explicitly define MVP vs post-MVP; skip analytics, QR codes, search, reputation for v1 |
| emojis in documentation | NEVER use emojis or emoticons anywhere in the project |
| navigation params with Timestamp | create serializable versions with ISO string dates + helper functions |
| keyboard overlap in chat | use KeyboardAvoidingView with platform-specific behavior and offset |
| avatar spam in messages | group consecutive messages; only show avatar on first from each sender |
| image defaultSource with @assets | remove defaultSource prop; rely on backgroundColor in styles as fallback |
| external image URLs in mock data | use 'placeholder' string + PlaceholderImage component |
| colors.background for button text | use '#FFFFFF' hardcoded for text on primary-colored backgrounds |
| emoji icons in components | use Ionicons from @expo/vector-icons; EmptyState accepts Ionicons name strings |
| undefined color references | always reference colors defined in theme.ts; use colors.surface for elevated backgrounds |
| custom headers vs navigator headers | always configure via navigator screenOptions; share defaultScreenOptions across stacks |
| app.config.js ES module syntax | use `module.exports` (CommonJS) -- expo expects CommonJS format |
| expo start after config changes | always run `npx expo start --clear` to reset metro bundler cache |
| node/npx not available in windows terminal | user must test in WSL terminal; claude cannot run expo commands directly |
| "board" terminology in code | renamed to "closet" everywhere -- types, components, screens, hooks, nav routes; firestore `closet` field unchanged |
| form counters above input boxes | counters (char count, word count) go BELOW input boxes, not in a header row above |
| tab underline indicator on dark bg | remove indicator entirely for BeReal-style tabs; use color contrast only (white active, gray inactive) |

---

## reminders for claude

1. **before writing code:** check this document for relevant patterns/decisions
2. **after making decisions:** offer to update this document
3. **when uncertain:** ask rather than assume
4. **at session end:** prompt user: "should i update CLAUDE.md with today's decisions?"
5. **NO EMOJIS:** never use emojis or emoticons anywhere
6. **text casing:** keep regular text lowercase; only capitalize code, files, or proper technical names

---

## current priorities

### MVP feature set (must have)
1. authentication (email/password; Google/Facebook SSO later)
2. user profiles with bio, city, custom closets
3. friend system (username search, friend requests, friends vs friends+ network)
4. listings (create with 1-4 photos, organize in closets, privacy toggle)
5. feed (friends/friends+ tabs, category filtering, browse-only)
6. "mark it" system (soft reservation, seller sees who marked)
7. real-time messaging (firestore chat, tied to listings)
8. push notifications (marks and messages only)

### explicitly OUT of MVP
- analytics dashboard, QR code friend adding, reputation/rating system
- search functionality, precise location/maps, in-app payments, price editing notifications

### next steps
1. test all screens on device
2. deploy firestore security rules (firebase console or CLI)
3. create composite indexes (firebase console or deploy firestore.indexes.json)
4. run seed data script (requires pasting test account UIDs)
5. push notifications (FCM integration -- post-MVP if needed)

---

## development progress

### phase 1: foundation (2026-02-01)
- expo project initialized with TypeScript, all dependencies installed
- project structure created (src/ with screens, components, hooks, services)
- TypeScript types defined, theme constants configured, firebase config template created

### phase 2: navigation & screens (2026-02-01)
- navigation skeleton built (AuthNavigator, AppNavigator, MainNavigator)
- auth screens, placeholder screens for all tabs, reusable common components
- mock data services set up for UI development without firebase

### phase 3: instagram-style UI (2026-02-03)
- profile, friends, conversations, chat screens built with instagram-style patterns
- components: Avatar, SearchBar, EmptyState, BoardCard, FriendListItem, MessageBubble, etc.
- material top tabs, pull-to-refresh, empty states across all screens

### phase 4: modal flows & navigation restructure (2026-02-06)
- create listing refactored to modal presentation
- PlaceholderImage system replaced all external image URLs
- bottom navigation finalized to 5 tabs

### phase 5: auth simplification & profile redesign (2026-02-07)
- auth simplified to login + signup toggle on single screen
- profile redesigned to pinterest saved ideas pattern (search + filter tags + boards grid)
- board management flow, listing detail updates, messages added to FeedStack
- dropdown component for board/closet selection, privacy toggle switch

### phase 6: dark mode & polish (2026-02-09)
- dark mode implemented (MD3DarkTheme + custom navigation DarkTheme)
- all emoji icons replaced with Ionicons
- headers unified via navigator screenOptions
- scrollbar visibility enforced

### phase 7: firebase integration (2026-02-10) -- COMPLETE
- firebase project configured (markit-80348), auth working on device
- 3 service files created (listing, friend, message)
- 6 custom hooks created (profile, listings, listingDetail, friends, conversations, chat)
- all 9 screens migrated from mock data to real firestore
- security rules + composite indexes written (NOT YET DEPLOYED)
- seed data script ready (needs test account UIDs)

### phase 8: UI overhaul (2026-02-10)
- header separator line added to all screens via defaultScreenOptions
- "board" renamed to "closet" everywhere (types, components, screens, hooks, nav)
- feed tabs restyled to BeReal pattern (no underline, "my friends" / "friends+")
- notifications dummy data removed, filter tag sizing tightened
- conversations header now has + icon (placeholder for new message flow)
- create/edit listing forms use floating labels (react-native-paper TextInput), counters below inputs, number-pad for price, $9,999.99 max
- settings page created (instagram-style list, functional log out)
- edit profile page created (name, username, bio; username uniqueness check)
- hamburger menu icon added to profile header

### current status
- **working:** auth, all screens wired to firebase
- **not deployed:** firestore security rules, composite indexes
- **deferred:** firebase storage (paid plan), phone auth (needs native modules), push notifications
- **mock data files preserved** in src/services/mock/ for reference (still references `Board` type -- not updated)

### needs device testing (phase 8 changes)
- header separator visibility on all screens
- feed tab styling (no underline, correct empty state messages per tab)
- notifications empty state with tighter filter tags
- conversations + icon and "coming soon" alert
- floating label inputs on create listing and edit item screens
- number-pad keyboard for price input
- price max validation ($9,999.99)
- settings page navigation and log out flow
- edit profile form (save, username uniqueness check)
- closet rename throughout (profile grid, closet detail, navigation)