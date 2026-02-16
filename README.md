# mark.it

peer-to-peer selling app for friends. list items, browse what your friends are selling, soft-reserve with "mark it", and chat to close the deal.

built with React Native (Expo), TypeScript, and Firebase.

---

## stack

| layer | tech |
|-------|------|
| platform | React Native + Expo (managed workflow) |
| language | TypeScript |
| backend | Firebase (Auth, Firestore, Storage, FCM) |
| state | React Context + custom hooks |
| navigation | React Navigation v6 |
| UI | react-native-paper (Material Design, dark mode) |

## features

- **auth** -- email/password login and signup
- **profiles** -- name, username, bio, city, custom closets (pinterest-style grid)
- **friends** -- username search, friend requests, friends vs friends+ visibility
- **listings** -- 1-4 photos, closet assignment, friends/friends+ privacy toggle
- **feed** -- friends / friends+ tabs (BeReal-style), category filtering
- **mark it** -- soft reservation system; sellers see who marked their items
- **messaging** -- real-time chat, one conversation per user pair
- **transactions** -- mark as sold flow, purchase/sales history, archived listings

## project structure

```
src/
  components/     UI components (common, friends, listings, messages, profile)
  constants/      theme colors, firebase config
  contexts/       AuthContext (React Context for auth state)
  hooks/          data hooks (useProfile, useListings, useFriends, useChat, etc.)
  navigation/     stack + tab navigators, route types
  screens/        all app screens grouped by feature
  services/       firebase service layer (auth, listings, friends, messages, transactions)
  types/          TypeScript interfaces
  utils/          validation helpers
```

## setup

```bash
# install dependencies
npm install

# copy env and fill in firebase config
cp .env.example .env

# start dev server (in WSL if on windows)
npx expo start --clear
```

requires a firebase project with Auth, Firestore, and Storage enabled. see `.env.example` for required config values.

## firebase

- `firebase/firestore.rules` -- security rules (deploy with `firebase deploy --only firestore:rules`)
- `firebase/firestore.indexes.json` -- composite indexes for queries
- `firebase.json` -- firebase project config
- `scripts/seed.ts` -- test data seeder (needs user UIDs)

## design

dark mode only. background `#121212`, surface `#1E1E1E`, primary `#BB86FC`, white text. icons from Ionicons. system fonts.

## status

MVP in progress. auth, listing creation, friends, messaging, and transactions are functional. push notifications and image upload (firebase storage) are deferred.
