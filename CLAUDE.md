# CLAUDE.md - mark.it

> last updated: 2026-03-20 (session 12)

---

## hard rules

- **NEVER** use emojis or emoticons anywhere in this project (code, docs, comments, UI)
- **text casing:** all regular text lowercase. only capitalize code identifiers, file names, or proper technical names
- **NEVER** use `undefined` in firestore documents -- use `null` for optional fields (`field: type | null`, not `field?: type`)
- **terminal:** macOS (native zsh) -- run node/npx directly, no WSL
- **ALWAYS** check this document before writing code

---

## project overview

**mark.it** -- cross-platform mobile app (iOS + Android) for peer-to-peer selling among friends

- **stack:** React Native (Expo managed workflow), TypeScript, Firebase (Auth, Firestore, Storage, FCM)
- **dev env:** macOS (Apple Silicon M5) -- native terminal, iOS Simulator for testing
- **firebase project:** markit-80348

---

## architecture quick reference

| layer | choice |
|-------|--------|
| platform | React Native + Expo (managed workflow) |
| backend | Firebase (Auth, Firestore, Storage, FCM) |
| state | React Context + custom hooks (no Redux) |
| navigation | React Navigation v6 |
| UI library | react-native-paper (Material, dark mode only) |
| data model | denormalized Firestore (seller info on listings) |
| config format | app.config.js uses CommonJS (`module.exports`), NOT ES modules |
| env vars | `require('dotenv').config()` at top of app.config.js -- CRITICAL |

---

## design system

**theme:** background #121212, surface #1E1E1E, primary #BB86FC, text #FFFFFF
**icons:** lucide-react-native only (NEVER emoji, NEVER Ionicons)
**fonts:** system (San Francisco / Roboto)
**button text on primary bg:** always `'#FFFFFF'` (not colors.background)
**placeholder images:** PlaceholderImage component (triangle icon)
**scrollbars:** always visible (`showsVerticalScrollIndicator={true}`)
**headers:** ALWAYS via navigator screenOptions with shared defaultScreenOptions -- never custom in-screen
**header separator:** #2C2C2C border line below all headers

---

## key patterns

- **navigation params:** serializable only -- ISO strings, never Timestamp objects
- **file naming:** PascalCase for components, camelCase for utilities
- **imports:** absolute paths with TypeScript aliases (@components/*, @hooks/*, etc.)
- **closet normalization:** `name.trim().toLowerCase()` for matching; displayName preserves user casing
- **firestore 'in' queries:** use `batchInQuery()` from `@utils/firestore` (handles 30-item batching)
- **conversations:** one per user pair (NOT per listing), multiple listings via listingIds[]
- **batch writes:** used for all denormalized updates (closets, transactions, listing status changes)
- **listing status values:** `'available' | 'sold' | 'archived'`
- **form inputs:** counters BELOW input boxes, never silently cap values (show inline error instead)
- **success actions:** no alert -- navigate directly or to confirm screen
- **"coming soon" screens:** reuse SettingsPlaceholderScreen with generic route typing
- **listing forms:** shared ListingForm component used by CreateListingScreen and EditItemScreen
- **async data hooks:** useAsyncData generic hook handles loading/error/refresh boilerplate
- **hardcoded colors:** use `colors.white` from theme, never `'#FFFFFF'`

---

## interaction patterns

- **nav:** bottom tabs (5): home, notifs, create (modal), map, profile
- **feed:** "my friends" / "friends+" BeReal-style tabs (no underline, white bold active, gray inactive)
- **create listing:** modal slides up -> on success -> ListingConfirm screen -> "return to home"
- **"mark.it" action:** soft reservation -- seller sees who marked
- **messaging:** real-time chat, one conversation per user pair, facebook marketplace style
- **dropdown selectors:** modal anchored to selector (not centered), order: unnamed -> alphabetical -> "add more..."
- **closet creation:** Alert.prompt (iOS-only -- needs cross-platform modal for Android)
- **transaction flow:** mark as sold -> buyer selector modal (from markedBy list) -> atomic batch write -> success screen
- **profile:** name/username/bio left-aligned stack, hamburger menu -> settings, pinterest-style closet grid
- **profile stats:** tapping followers/following counts navigates to FriendsScreen with initialTab param
- **friends screen:** instagram-style followers/following material-top-tabs, inline friend requests row at top of followers tab, person-add icon -> AddFriendsScreen
- **friend requests:** dedicated FriendRequestsScreen with confirm/delete buttons side by side
- **add friends:** search by username, send friend request, shows "friends"/"requested" status badges
- **edit profile:** save navigates back immediately (no alert)

---

## firebase services

| file | handles |
|------|---------|
| `config.ts` | firebase init, reads from app.config.js extra |
| `userService.ts` | user CRUD |
| `listingService.ts` | listing CRUD, mark/unmark, feed queries, markAsSold (atomic batch), archive |
| `transactionService.ts` | buildTransactionData, purchase/sales history |
| `friendService.ts` | friends, requests, search, atomic accept |
| `messageService.ts` | conversations (user-pair dedup), real-time messages, unread tracking |

all in `src/services/firebase/`

## hooks

| hook | concern |
|------|---------|
| `useAsyncData` | generic async data fetching (loading/error/refresh) |
| `useProfile` | profile + stats + computed closets (includes purchase/sales counts) |
| `useListings` | feed by visibility, filters sold/archived |
| `useListingDetail` | mark/unmark (optimistic UI), markAsSold, archive |
| `useTransactions` | purchase or sales history |
| `useFriends` | friends, requests, accept/decline/send/search |
| `useConversations` | conversation list sorted by updatedAt |
| `useChat` | real-time messages via onSnapshot, auto-read |

---

## lessons learned -- DO NOT REPEAT

### firestore gotchas
- `undefined` breaks firestore -- always use `null` for optional fields
- `field?: type` creates `undefined` -- use `field: type | null` instead
- single-field indexes are automatic -- only add composite indexes (2+ fields) to firestore.indexes.json
- firestore 'in' queries max 30 items -- batch into groups
- migration scripts must be idempotent (check before migrating, handle null/empty)
- `require('dotenv').config()` MUST be at top of app.config.js or firebase config is undefined

### firebase + expo / metro gotchas
- `npm install` must run before `npx expo install` on a fresh machine -- otherwise deps like dotenv won't be found
- Firebase v10+ uses package exports in package.json causing Metro to pick up ESM files Hermes can't run -- fix: `config.resolver.unstable_enablePackageExports = false` in `metro.config.js`
- `initializeAuth` + `getReactNativePersistence` causes "Component auth has not been registered yet" crash on iOS Simulator with Hermes -- use `getAuth(app)` instead (no persistence across full app kills, but works)
- import `./src/services/firebase/config` as the second import in App.tsx (after gesture handler) to guarantee Firebase initializes before any other module

### react native gotchas
- navigation params must be serializable (ISO strings, not Timestamps)
- `colors.background` is dark in dark mode -- use `'#FFFFFF'` for text on primary buttons
- FlatList numColumns + `flex: 1` stretches odd items -- add `maxWidth: '50%'`
- ScrollView in flex container stretches -- wrap in plain View
- Alert.prompt is iOS-only -- need custom modal for Android
- KeyboardAvoidingView needs platform-specific behavior + offset for chat
- `KeyboardAvoidingView` inside a modal (`presentation: 'modal'`) is unreliable on iOS -- use `automaticallyAdjustKeyboardInsets={true}` on the ScrollView + plain `View` wrapper instead
- `presentation: 'modal'` swipe-to-dismiss gesture intercepts ScrollView scroll events -- add `gestureEnabled: false` to modal screen options when the screen contains a ScrollView
- `.env` file is not committed and must be recreated on each new machine from Firebase Console (project settings → your apps → SDK config)
- horizontal ScrollView: wrap in View to prevent flex expansion
- after config changes: `npx expo start --clear` in terminal

### UI/UX rules
- NEVER use emojis as icons -- lucide-react-native only (Ionicons removed)
- headers via navigator screenOptions only, never custom in-screen
- form counters below inputs, never above
- never silently change user input -- show inline error
- skip success alerts -- navigate directly or to confirm screen
- BeReal-style tabs: no underline indicator, color contrast only
- group consecutive chat messages -- avatar on first only

### codebase rules
- app.config.js = CommonJS (`module.exports`), not ES modules
- "closet" not "board" everywhere (types, components, screens, hooks, nav)
- common components should accept optional `style` prop (ViewStyle)
- SettingsPlaceholderScreen uses generic route typing for reuse across stacks
- conversations are per user pair, NOT per listing
- listing status: 'available' | 'sold' | 'archived' (not 'active' | 'deleted')
- markAsSold must use atomic batch (transaction doc + listing update)
- empty closets persist (itemCount=0) -- don't auto-delete
- closet stats: only count status='available' listings
- EmptyState `icon` prop takes ReactNode (lucide component), not a string
- signOut must NOT set loading=true (unmounts entire nav tree, breaks sign-out flow)
- material-top-tabs: use `tabBarActiveTintColor`/`tabBarInactiveTintColor` -- do NOT also set `color` in `tabBarLabelStyle` (conflicts)

---

## current priorities

### MVP features (must have)
1. auth (email/password; Google/Facebook SSO later)
2. user profiles with bio, city, custom closets
3. friend system (username search, requests, friends vs friends+)
4. listings (1-4 photos, closets, privacy toggle)
5. feed (friends/friends+ tabs, category filtering)
6. "mark it" system (soft reservation)
7. real-time messaging
8. push notifications (marks + messages only)

### out of MVP
analytics, QR codes, reputation, search, maps, in-app payments, price edit notifications

### next steps
1. **simulator testing** -- test friends screens, add friends search, icon migration, logout (iOS Simulator running)
2. **seed data** -- run seed.ts (needs user UIDs updated)
3. **restore auth persistence** -- re-add `initializeAuth` + `getReactNativePersistence` once app is stable
4. **cross-platform closet modal** -- replace iOS-only Alert.prompt (lower priority)

### current status
- **working:** iOS Simulator running, Firebase auth + .env configured, all deps installed, sell an item scrolling fixed
- **needs testing:** friends screens (followers/following/requests/add), lucide icon migration, logout, full auth flow
- **known tradeoff:** auth state not persisted across full app kills (using `getAuth` not `initializeAuth`)
- **deferred:** firebase storage (paid plan), phone auth, push notifications

---

## development log

@docs/DEVLOG.md

---

## reminders

1. check this document before writing code
2. after decisions, offer to update CLAUDE.md
3. when uncertain, ask -- don't assume
4. at session end, ask: "should i update CLAUDE.md with today's decisions?"
5. NO EMOJIS. lowercase text. always.
