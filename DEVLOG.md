# development progress log

## phase 1: foundation (2026-02-01)
- expo project initialized with TypeScript, all dependencies installed
- project structure created (src/ with screens, components, hooks, services)
- TypeScript types defined, theme constants configured, firebase config template created

## phase 2: navigation & screens (2026-02-01)
- navigation skeleton built (AuthNavigator, AppNavigator, MainNavigator)
- auth screens, placeholder screens for all tabs, reusable common components
- mock data services set up for UI development without firebase

## phase 3: instagram-style UI (2026-02-03)
- profile, friends, conversations, chat screens built with instagram-style patterns
- components: Avatar, SearchBar, EmptyState, ClosetCard, FriendListItem, MessageBubble, etc.
- material top tabs, pull-to-refresh, empty states across all screens

## phase 4: modal flows & navigation restructure (2026-02-06)
- create listing refactored to modal presentation
- PlaceholderImage system replaced all external image URLs
- bottom navigation finalized to 5 tabs

## phase 5: auth simplification & profile redesign (2026-02-07)
- auth simplified to login + signup toggle on single screen
- profile redesigned to pinterest saved ideas pattern (search + filter tags + closet grid)
- closet management flow, listing detail updates, messages added to FeedStack
- dropdown component for closet selection, privacy toggle switch

## phase 6: dark mode & polish (2026-02-09)
- dark mode implemented (MD3DarkTheme + custom navigation DarkTheme)
- all emoji icons replaced with Ionicons
- headers unified via navigator screenOptions
- scrollbar visibility enforced

## phase 7: firebase integration (2026-02-10) -- COMPLETE
- firebase project configured (markit-80348), auth working on device
- 3 service files created (listing, friend, message)
- 6 custom hooks created (profile, listings, listingDetail, friends, conversations, chat)
- all 9 screens migrated from mock data to real firestore
- security rules + composite indexes written (NOT YET DEPLOYED)
- seed data script ready (needs test account UIDs)

## phase 8: UI overhaul (2026-02-10)
- header separator line added to all screens via defaultScreenOptions
- "board" renamed to "closet" everywhere (types, components, screens, hooks, nav)
- feed tabs restyled to BeReal pattern (no underline, "my friends" / "friends+")
- notifications dummy data removed, filter tag sizing tightened
- conversations header now has + icon (placeholder for new message flow)
- create/edit listing forms use floating labels (react-native-paper TextInput), counters below inputs, decimal-pad for price with $ prefix, $9,999.99 max
- settings page created (instagram-style list, functional log out)
- edit profile page created (name, username, bio; username uniqueness check)
- hamburger menu icon added to profile header

## phase 9: UI spot fixes (2026-02-10, session 3)
- feed tab label color fixed (explicit color in tabBarLabelStyle)
- messages "+" button now navigates to "coming soon" screen (reuses SettingsPlaceholderScreen)
- photo validation removed from create listing (upload not functional yet)
- price input: $ prefix via PaperTextInput.Affix, decimal-pad keyboard, 2-decimal limit, inline error if over $9,999.99
- edit profile save navigates back immediately (no success alert)
- profile header now shows name (bold) / @username (gray) / bio in left-aligned stack
- listing confirmation screen added (ListingConfirmScreen) -- replaces success alert after create
- notifications filter tags fixed (wrapped ScrollView to prevent vertical stretching)
- Input component supports `left` prop for PaperTextInput affixes

## phase 10: transaction & purchase flow (2026-02-11, session 4) -- COMPLETE
- types updated: Listing (soldAt, archivedAt, buyerId; status: 'available'|'sold'|'archived'), Transaction interface
- services: transactionService.ts created; listingService updated (markAsSold atomic batch, archive/unarchive)
- hooks: useTransactions created, useProfile updated (purchase/sales counts), useListingDetail updated
- screens created: TransactionSuccessScreen, TransactionHistoryScreen, TransactionDetailScreen, ArchivedListingsScreen
- screens updated: ListingDetailScreen (seller actions, sold badge), SettingsScreen (archive/history links)
- navigation: all transaction routes registered in AppNavigator + MainNavigator
- firebase config: firestore.rules + firestore.indexes.json updated for transactions
- implementation: 19/19 tasks complete

## phase 11: listing creation debug & UI fixes (2026-02-12, session 5) -- COMPLETE
- critical bug fix: dotenv installed, `require('dotenv').config()` added to app.config.js
- type system fix: all optional Listing fields changed from `field?: type` to `field: type | null`
- listing creation working: createListing initializes all fields with null defaults
- dropdown improvements: anchored to selector using measureInWindow, closet options ordered
- custom closet creation: Alert.prompt for iOS
- validation: removed 3-word minimum for description
- profile grid fix: ClosetCard maxWidth: '50%' for odd counts
- debug logging: console.log added to listingService
- button loading state: Button component shows loading indicator during async

## status as of session 5 (2026-02-12)
- **working:** listing creation, auth, all screens on firebase, transaction flow
- **deployed:** firestore.rules, firestore.indexes.json, dotenv
- **needs testing:** all session 5 changes on device
- **known limitation:** Alert.prompt iOS-only
- **deferred:** firebase storage (paid plan), phone auth, push notifications
- **mock data:** preserved in src/services/mock/ for reference (still uses `Board` type)
