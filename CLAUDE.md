# CLAUDE.md - project context & design system

> this file is automatically read by claude code at the start of every conversation.
> last updated: 2026-02-07 (evening session)

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

- **navigation:** bottom tabs (5 slots): home, notifs, create (modal trigger), map, profile
- **modal flows:** "temporary flow" pattern - create listing slides up from bottom as modal, maintains page position when dismissed
- **feed browsing:** tabbed interface (friends vs friends+), pull-to-refresh, infinite scroll
- **photo viewing:** swipeable carousel with dot indicators (instagram-style)
- **photo upload:** horizontal row of 4 image slots, first slot has darker border to indicate primary
- **"mark.it" action:** soft reservation system - seller sees who marked
- **messaging:** real-time chat tied to specific listings with listing context card
- **touch targets:** platform-native sizing (iOS HIG / Material Design standards)
- **pinterest-style profile:** horizontal stats row (items/followers/following), search bar, filter tags, boards grid (2 columns)
- **instagram-style UX:** friends list with search, DM-style conversations
- **dropdown selectors:** modal overlay with option list for structured inputs (boards/closets)
- **search:** instant filtering (no debounce) for small datasets like friends list
- **unread indicators:** blue dot + bold text for unread conversations/messages
- **message bubbles:** blue background (right-aligned) for own messages, gray background (left-aligned) for others
- **board management:** profile → board detail → edit item (simplified flow, no multi-select)
- **listing detail layout:** share button (top right), simplified seller info, mark count badge, bottom action buttons (mark it + send message)
- **messages access:** envelope icon in feed header navigates to conversations
- **toggle switches:** privacy settings use native switch component instead of button groups

### visual design

- **design system:** platform-native UI (react-native-paper with iOS overrides)
- **typography:** system fonts (San Francisco on iOS, Roboto on Android)
- **color system:** platform defaults with customization via react-native-paper theming
- **spacing system:** consistent padding/margins using theme constants
- **images:** photo carousels for listings (1-4 photos), compressed thumbnails in feed
- **placeholder images:** triangle icon (▲) on gray background for missing/unloaded images

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
| navigation types | serializable versions for complex objects | React Navigation can't handle Timestamp objects in params; create serializable versions with ISO strings | 2026-02-03 |
| component organization | feature folders (profile/, friends/, messages/) | keeps related components grouped; easier to find and maintain than flat structure | 2026-02-03 |
| instagram patterns | Material Top Tabs + list patterns | consistent with user expectations; tabs for friends/requests, listings/boards, etc. | 2026-02-03 |
| create listing UI | modal presentation at root level | "temporary flow" pattern - slides up from bottom, maintains page position; not in tab navigator | 2026-02-06 |
| form input limits | title: 50 chars, description: 50 words | prevents excessive input, enforced during typing with live counters | 2026-02-06 |
| placeholder images | PlaceholderImage component with triangle icon | all external image URLs replaced with 'placeholder' string; consistent fallback UI | 2026-02-06 |
| tab navigation structure | 5 slots: home, notifs, create, map, profile | removed signup flow; simplified auth to email/password only; no regex validation | 2026-02-07 |
| authentication flow | single login screen, no signup | simplified for MVP; email/password only, basic empty check validation | 2026-02-07 |
| profile layout | pinterest saved ideas pattern | horizontal stats, search bar, filter tags, boards grid; removed material tabs | 2026-02-07 |
| board/closet selection | dropdown component with preset options | unified "board" terminology; predefined options: unnamed, clothes, shoes, furniture + "add more..." | 2026-02-07 |
| listing organization | closet field (board name) + optional category field | closet = board name (user-facing), category = optional tag for filtering | 2026-02-07 |
| messages navigation | added to FeedStack (Conversations + Chat screens) | messages accessible from feed header button; maintains context within main navigation flow | 2026-02-07 |
| board management flow | profile → board detail → edit item (no multi-select) | simplified from pinterest pattern; removed organize/edit board multi-select for MVP simplicity | 2026-02-07 |
| listing detail actions | bottom action bar with mark it + send message | two primary CTAs side by side; mark button changes style when active; share in header | 2026-02-07 |
| privacy toggle | Switch component instead of button group | cleaner UI for binary choice; consistent with native patterns | 2026-02-07 |

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
| navigation params with Timestamp | passed Timestamp objects in navigation params causing serialization errors | create serializable versions (SerializableConversation, SerializableMessage) with ISO string dates + helper functions | 2026-02-03 |
| keyboard overlap in chat | keyboard covered message input without KeyboardAvoidingView | use KeyboardAvoidingView with platform-specific behavior (iOS: padding, Android: undefined) and offset | 2026-02-03 |
| avatar spam in messages | showing avatar on every message from same sender | group consecutive messages; only show avatar on first message from each sender | 2026-02-03 |
| image defaultSource with @assets | used defaultSource={require('@assets/icon.png')} causing bundler errors | remove defaultSource prop; rely on backgroundColor in styles as image fallback | 2026-02-03 |
| external image URLs in mock data | used unsplash/pravatar URLs causing slow loads and external dependencies | replace all with 'placeholder' string; use PlaceholderImage component for consistent fallback | 2026-02-06 |

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
4. ~~build navigation skeleton (hollow frame)~~
5. ~~create placeholder screens with mock data~~
6. ~~implement UI framework without firebase~~ (complete: Feed, Create, Profile, Friends, Messages/Chat)
7. configure firebase for authentication and data persistence
8. integrate firebase into existing screens

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

### 2026-02-01 - phase 2 & 3 implementation (navigation & screens)
- built complete navigation skeleton (AuthNavigator, AppNavigator, MainNavigator)
- created auth screens (LoginScreen, SignupScreen)
- created placeholder screens for all main tabs (FeedScreen, FriendsScreen, ProfileScreen, ConversationsScreen)
- implemented AuthContext for authentication state management
- built reusable common components (Button, Input, LoadingSpinner, PlaceholderScreen)
- created listing components (ListingCard, PhotoCarousel)
- implemented CreateListingScreen and ListingDetailScreen
- set up mock data services for UI development without firebase

### 2026-02-03 - phase 4-6 implementation (instagram-style screens)
- created foundation components: Avatar (with sizes + fallback), SearchBar (instant filter + clear), EmptyState
- implemented ProfileScreen: instagram-style profile with avatar, stats, bio, tabs (all listings / boards)
- created profile components: ProfileHeader, BoardCard (2x2 grid preview), ProfileListingsGrid
- implemented FriendsScreen: tabs (friends / requests), search with instant filtering, pull-to-refresh
- created friends components: FriendListItem (mutual count + message button), FriendRequestItem (accept/decline)
- extended types: Friend, FriendRequestWithMutuals with mutual friends count
- implemented ConversationsScreen: sorted by recency, unread indicators (blue dot + bold text)
- created ChatScreen: message bubbles, listing context card, keyboard handling, avatar grouping
- created message components: ConversationListItem, MessageBubble, ListingContextCard, MessageInput
- extended message types: SerializableMessage, SerializableConversation with helper functions for navigation
- created comprehensive mock data: profiles (boards + stats), friends (7 friends + 3 requests), messages (4 conversations)
- updated navigation: added ChatScreen to MessagesStack with proper types
- all screens now instagram-style with Material Top Tabs, pull-to-refresh, empty states

### 2026-02-06 - modal flows, placeholder system, navigation restructure
- refactored CreateListingScreen to modal presentation (slides up from bottom, maintains page position)
- updated create listing UI: horizontal row for images (4 slots), first slot with darker border
- added form input limits: 50 char title, 50 word description with live counters
- created PlaceholderImage component (triangle icon on gray background)
- replaced all external image URLs (unsplash, pravatar) with 'placeholder' in mock data
- updated PhotoCarousel to handle placeholder images with fallback UI
- restructured bottom navigation: 5 tabs (home, notifications placeholder, create modal trigger, hidden slot, profile)
- removed Messages and Friends from bottom tabs (kept as screens for future navigation)
- added navigation handlers in ListingDetailScreen (clickable seller profile, send message alerts)
- confirmed dot indicators working for multi-image listings

### 2026-02-07 (morning) - auth simplification, navigation finalization, profile redesign
- **auth flow:** removed SignupScreen and all signup functionality; simplified login to basic email/password (no regex validation)
- **navigation:** finalized 5 tabs: home, notifs, create, map, profile
- **notifications screen:** created with placeholder framework (tag filters, messages button, empty state)
- **map screen:** created placeholder for future map functionality
- **profile screen:** redesigned to pinterest saved ideas pattern (removed material tabs, added search + filter tags + boards grid)
- **profile header:** horizontal layout with stats row (items, followers, following), username + bio, edit button
- **board/closet system:** created Dropdown component for structured selection; unified terminology around "boards"
- **listing types:** added optional category field for additional filtering/organization
- **mock data organization:** all 20 listings assigned to 4 boards (unnamed: 9, clothes: 7, shoes: 2, furniture: 2) with category tags

### 2026-02-07 (evening) - listing detail updates, board management, navigation cleanup
- **listing detail screen:** updated to match frame - share button in header, simplified seller info (no card), mark count badge, bottom action buttons (mark it + send message side by side)
- **create listing privacy:** replaced visibility button group with toggle switch ("make this a private listing")
- **messages navigation:** added Conversations and Chat screens to FeedStack; envelope icon button in feed header navigates to messages
- **board management implementation:** created BoardDetailScreen (shows items in board) and EditItemScreen (edit/delete individual listings)
- **simplified board flow:** removed EditBoard multi-select functionality; direct flow is profile → board detail → edit item
- **navigation cleanup:** removed unused createSimpleStack helper, properly structured all stack navigators
- **updated navigation graph:** documented complete vertex/edge structure for all screens and navigation flows
