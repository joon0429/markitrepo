# CLAUDE.md - project context & design system

> this file is automatically read by claude code at the start of every conversation.
> last updated: 2026-02-12 (session 5)

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
- **dropdown selectors:** modal overlay anchored to selector (not centered), options ordered: "unnamed" first, then alphabetical, then "add more..." last
- **header separator:** subtle border line (#2C2C2C) below all screen headers via defaultScreenOptions
- **settings access:** hamburger menu icon (menu-outline) in profile header top-right -> settings page
- **edit profile:** instagram-style edit screen (name, username, bio, profile picture placeholder); save navigates back immediately (no alert)
- **profile header layout:** name (bold) / @username (gray) / bio -- left-aligned vertical stack
- **listing confirmation:** after creating a listing, navigate to a confirm screen with "return to home" button (no alert)
- **"coming soon" screens:** reuse SettingsPlaceholderScreen for placeholder routes across all stacks (not just profile)
- **search:** instant filtering (no debounce) for small datasets like friends list
- **unread indicators:** primary-colored dot + bold text for unread conversations/messages
- **message bubbles:** primary color (right-aligned) for own messages, surface color (left-aligned) for others
- **listing detail:** share button (top right), simplified seller info, mark count badge, bottom action buttons (mark it + send message)
- **messages access:** envelope icon in feed header navigates to conversations
- **privacy toggle:** native switch component instead of button groups
- **conversations:** facebook marketplace style - one conversation per user pair (not per listing), supports multiple listings per conversation, "other marks" button shows all discussed items
- **closet management:** structured firestore collection with case-insensitive matching ("Shoes" = "shoes" = " shoes "), dropdown shows existing closets + create new option via Alert.prompt (iOS-only)
- **transaction flow:** seller marks item as sold → modal with buyer selector (from markedBy list) → creates immutable transaction record → navigates to success screen
- **sold listings:** "sold" badge displayed on listing detail, mark button disabled for buyers
- **archived listings:** instagram-style archive section with unarchive option, archived items don't appear in feed or closet counts
- **transaction history:** separate screens for purchases vs sales, accessible from settings

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
| closets | firestore collection with denormalized stats | structured closets with normalized names (case-insensitive), itemCount/previewPhotos updated via batch writes |
| conversations | user-pair based (not listing based) | one conversation per user pair, supports multiple listings (listingIds[]), initialListingId tracks conversation starter |
| transactions | immutable firestore collection | snapshots listing data at sale time, tracks purchase/sales history |
| floating labels | react-native-paper TextInput mode="outlined" | Input component supports `floatingLabel` prop for Pinterest-style labels |
| firebase CLI deployment | firebase.json + .firebaserc at project root | required for `firebase deploy` commands; .firebaserc specifies project ID, firebase.json specifies rules/indexes paths |
| environment variables | dotenv package loaded in app.config.js | MUST require('dotenv').config() at top of app.config.js to load .env file before accessing process.env |
| firestore optional fields | use `null` instead of `undefined` | Firestore rejects `undefined` values; use `field: type \| null` instead of `field?: type` for optional fields |

### key patterns

- **navigation params:** use serializable versions with ISO strings (React Navigation can't handle Timestamp objects)
- **component organization:** feature folders (profile/, friends/, messages/)
- **form input limits:** title 50 chars (min 3), description 50 words max (no minimum), price max $9,999.99; counters shown BELOW input boxes
- **price input:** $ prefix via PaperTextInput.Affix, decimal-pad keyboard, 2 decimal places max, inline error (not capped) if over limit
- **create listing flow:** modal presentation at root level -> on success, navigation.replace to ListingConfirm screen -> "return to home" resets to Main
- **closet selection:** dropdown shows existing closets (from firestore) + "create new" option; normalized matching (trim + lowercase)
- **closet management flow:** profile -> closet detail -> edit item (no multi-select)
- **closet normalization:** always `name.trim().toLowerCase()` for matching; displayName preserves user casing
- **firestore 'in' query batching:** batch friendIds into groups of 30 for getFeedListings
- **real-time chat:** useChat subscribes via onSnapshot; other screens use one-time getDocs
- **conversation deduplication:** findConversation(userId1, userId2) - one conversation per user pair, multiple listings supported via listingIds[]
- **conversation listing management:** add to listingIds[] when user clicks "send message"; remove when unmarking (keep in sync)
- **batch writes for denormalization:** closet stats (itemCount, previewPhotos), listing updates, transaction creation all use atomic batch operations
- **transaction creation:** markListingAsSold uses atomic batch (creates transaction doc + updates listing status/soldAt/buyerId in single operation)
- **listing status values:** 'available' | 'sold' | 'archived' (changed from 'active'|'sold'|'deleted' in phase 10)
- **migration scripts:** must be idempotent (skip already-migrated data); handle edge cases (null/empty values, duplicates)
- **headers:** all via navigator screenOptions with shared defaultScreenOptions (never custom in-screen)

### firebase service layer

| service file | responsibility |
|-------------|---------------|
| `src/services/firebase/config.ts` | firebase init (auth + firestore), reads from app.config.js extra |
| `src/services/firebase/userService.ts` | user CRUD (createUserProfile, getUserProfile, updateUserProfile) |
| `src/services/firebase/listingService.ts` | listing CRUD + mark/unmark + feed queries with batching + markAsSold (atomic batch) + archive/unarchive |
| `src/services/firebase/closetService.ts` | closet CRUD (getOrCreateCloset, rename with batch updates, stats management) |
| `src/services/firebase/transactionService.ts` | buildTransactionData (for batch writes), purchase/sales history queries (getUserPurchases, getUserSales) |
| `src/services/firebase/friendService.ts` | friends + requests + search (atomic accept with batch writes) |
| `src/services/firebase/messageService.ts` | conversations (user-pair deduplication, multi-listing support) + real-time messages + unread tracking |

### custom hooks

| hook | screen concern |
|------|---------------|
| `useProfile` | profile + stats (includes purchaseCount from transactions) |
| `useClosets` | fetch user's closets from firestore collection |
| `useListings` | feed data by visibility using friendIds, filters sold/archived |
| `useListingDetail` | mark/unmark with optimistic UI + markAsSold + archive functions |
| `useTransactions` | purchase or sales history from transactions collection |
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
| material-top-tabs label color not visible | add explicit `color` in `tabBarLabelStyle` -- tint color props alone may not apply on all platforms |
| price input capping user value silently | never silently change user input; show inline error instead and let the user correct it |
| ScrollView stretching in flex container | wrap horizontal ScrollView in a plain View to prevent it from expanding to fill flex parent |
| success alerts before navigation | skip success alerts for simple actions (edit profile save, listing create); navigate directly or to a confirm screen |
| SettingsPlaceholderScreen typed to one stack | use generic route typing (`route.params as PlaceholderParams`) so it can be reused across any stack |
| closet name variations | (2026-02-11) always normalize with `trim().toLowerCase()` for matching; "Shoes" = "shoes" = " shoes " map to same closet |
| denormalized closet stats | (2026-02-11) update itemCount and previewPhotos via batch writes; only count listings with status='active' (exclude sold/archived) |
| empty closets | (2026-02-11) empty closets persist in firestore (itemCount=0, previewPhotos=[]); don't auto-delete when all items removed |
| conversation per listing | (2026-02-11) WRONG - use one conversation per user pair (not per listing); support multiple listings via listingIds[] array |
| migration script failures | (2026-02-11) always make migration scripts idempotent (check if already migrated, skip if so); handle null/empty values with defaults |
| listing status enum change | (2026-02-11) changing status values requires data migration for existing docs; 'active'→'available', 'deleted'→'archived' |
| atomic transaction creation | (2026-02-11) markAsSold must use batch write (transaction doc + listing update) to ensure data consistency |
| single-field firestore indexes | (2026-02-11) firestore automatically handles single-field indexes; only create composite indexes (2+ fields) in firestore.indexes.json |
| firebase CLI setup | (2026-02-11) firebase deploy requires firebase.json + .firebaserc files at project root; firebase CLI installed via `npm install -g firebase-tools` in WSL |
| Button component flexibility | (2026-02-11) common components should accept optional `style` prop (ViewStyle) for layout flexibility without duplicating component logic |
| silent form validation failures | (2026-02-11) add explicit Alert.alert() for validation failures during debugging; silent returns make issues hard to diagnose |
| .env not loading in app.config.js | (2026-02-12) CRITICAL: must add `require('dotenv').config()` at top of app.config.js; without it, firebase config values are undefined and writes fail silently |
| firestore undefined field values | (2026-02-12) Firestore rejects documents with `undefined` field values; use `null` for optional fields, never `undefined` |
| TypeScript optional vs null types | (2026-02-12) `field?: string` creates `undefined` which breaks Firestore; use `field: string \| null` and explicitly set to `null` in all documents |
| FlatList numColumns stretching | (2026-02-12) cards with `flex: 1` in FlatList with numColumns will stretch to fill row when odd number of items; add `maxWidth: '50%'` to constrain |
| Alert.prompt platform support | (2026-02-12) Alert.prompt is iOS-only; need cross-platform solution (custom modal) for Android support |

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
1. **device testing** - test all new functionality on iPhone via Expo Go:
   - listing creation flow (create → confirm screen → appears in feed/profile)
   - custom closet names (Alert.prompt)
   - dropdown positioning
   - profile grid layout with odd numbers
   - transaction flow: mark as sold → buyer selection → success screen
   - archived listings: archive → unarchive flow
   - purchase/sales history screens
2. **run seed data script** - populate test data with transactions (seed.ts ready, needs user UIDs updated)
3. **implement cross-platform closet creation** - replace iOS-only Alert.prompt with custom modal for Android support

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
- create/edit listing forms use floating labels (react-native-paper TextInput), counters below inputs, decimal-pad for price with $ prefix, $9,999.99 max
- settings page created (instagram-style list, functional log out)
- edit profile page created (name, username, bio; username uniqueness check)
- hamburger menu icon added to profile header

### phase 9: UI spot fixes (2026-02-10, session 3)
- feed tab label color fixed (explicit color in tabBarLabelStyle)
- messages "+" button now navigates to "coming soon" screen (reuses SettingsPlaceholderScreen)
- photo validation removed from create listing (upload not functional yet)
- price input: $ prefix via PaperTextInput.Affix, decimal-pad keyboard, 2-decimal limit, inline error if over $9,999.99
- edit profile save navigates back immediately (no success alert)
- profile header now shows name (bold) / @username (gray) / bio in left-aligned stack
- listing confirmation screen added (ListingConfirmScreen) -- replaces success alert after create
- notifications filter tags fixed (wrapped ScrollView to prevent vertical stretching)
- Input component supports `left` prop for PaperTextInput affixes

### current status
- **working:** auth, all screens wired to firebase
- **not deployed:** firestore security rules, composite indexes
- **deferred:** firebase storage (paid plan), phone auth (needs native modules), push notifications
- **mock data files preserved** in src/services/mock/ for reference (still references `Board` type -- not updated)

### phase 10: transaction & purchase flow (2026-02-11, session 4) -- COMPLETE
- **types updated:** Listing (added soldAt, archivedAt, buyerId fields; status enum: 'available'|'sold'|'archived'), Transaction interface created
- **services:** transactionService.ts created (buildTransactionData, getUserPurchases/Sales); listingService updated (markListingAsSold with atomic batch, archiveListing, unarchiveListing, getArchivedListings)
- **hooks:** useTransactions created, useProfile updated (purchaseCount/salesCount from transactions), useListingDetail updated (markAsSold, archive, unarchive functions)
- **screens created:** TransactionSuccessScreen, TransactionHistoryScreen, TransactionDetailScreen, ArchivedListingsScreen (4 new screens)
- **screens updated:** ListingDetailScreen (seller actions: mark as sold modal, archive button, sold badge), SettingsScreen (archive/history links)
- **navigation:** all transaction routes registered in AppNavigator + MainNavigator
- **firebase config:** firestore.rules updated (transactions collection + listing status updates), firestore.indexes.json updated (transaction indexes)
- **test data:** seed.ts updated with 3 sample transactions
- **implementation:** 19/19 tasks complete from transaction plan

### phase 11: listing creation debug & UI fixes (2026-02-12, session 5) -- COMPLETE
- **critical bug fix:** dotenv package installed, `require('dotenv').config()` added to app.config.js - firebase config was undefined
- **type system fix:** Listing interface updated - all optional fields changed from `field?: type` to `field: type | null` (Firestore rejects undefined)
- **listing creation working:** createListing now properly initializes all fields with null defaults instead of undefined
- **dropdown improvements:** anchored to selector using measureInWindow (not centered), closet options ordered (unnamed → alphabetical → add more)
- **custom closet creation:** Alert.prompt implemented for iOS (allows user to create custom closet names on the fly)
- **validation adjustments:** removed 3-word minimum requirement for description field
- **profile grid fix:** ClosetCard maxWidth: '50%' prevents stretching when odd number of closets
- **debug logging:** comprehensive console.log added to listingService for troubleshooting
- **button loading state:** Button component now shows loading indicator during async operations

### current status (session 5 - 2026-02-12)
- **working:** listing creation fully functional, auth, all screens wired to firebase, transaction flow
- **deployed:** firestore.rules, firestore.indexes.json, dotenv package installed
- **needs testing:** all session 5 changes on device (listing creation, dropdown, custom closets, profile grid)
- **known limitation:** Alert.prompt is iOS-only; need cross-platform solution for Android
- **deferred:** firebase storage (paid plan), phone auth (needs native modules), push notifications
- **mock data files preserved** in src/services/mock/ for reference (still references `Board` type -- not updated)