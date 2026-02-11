# transaction & purchase flow implementation plan

**created:** 2026-02-11
**scope:** add transaction tracking, listing status management, purchase/sales history

---

## current state

**existing collections:**
- `users` - profile data
- `listings` - item listings with `marks` array (userIds who marked)
- `friendships`, `friendRequests` - social graph
- `conversations`, `messages` - real-time chat

**user flow (clarified):**
1. buyer marks item (adds userId to listing.marks array)
2. buyer messages seller via real-time chat
3. buyer and seller arrange payment externally (Venmo/Cash App)
4. seller manually marks item as "sold" in app
5. transaction record created for history tracking

**missing:**
- listing status field (available/sold/archived)
- transactions collection for purchase/sales history
- archived listings view (instagram-style)
- "mark as sold" functionality

---

## firestore schema updates

### 1. listings collection (update existing)

**add fields:**
```typescript
status: 'available' | 'sold' | 'archived'  // default: 'available'
soldAt?: Timestamp                          // when marked as sold
archivedAt?: Timestamp                      // when archived by seller
buyerId?: string                            // userId of buyer (set when sold)
```

**updated Listing type:**
```typescript
export interface Listing {
  id: string
  title: string
  description: string
  price: number
  photos: string[]                          // 'placeholder' until storage enabled
  closet: string
  visibility: 'friends' | 'friendsPlus'
  status: 'available' | 'sold' | 'archived' // NEW
  sellerId: string
  sellerUsername: string
  sellerAvatar: string
  marks: string[]                           // userIds who marked it
  createdAt: Timestamp
  updatedAt: Timestamp
  soldAt?: Timestamp                        // NEW
  archivedAt?: Timestamp                    // NEW
  buyerId?: string                          // NEW
}
```

### 2. transactions collection (new)

**purpose:** track completed sales for purchase/sales history

**schema:**
```typescript
export interface Transaction {
  id: string
  buyerId: string
  buyerUsername: string                     // denormalized for display
  buyerAvatar: string
  sellerId: string
  sellerUsername: string
  sellerAvatar: string
  listingId: string                         // reference to original listing
  listingSnapshot: {                        // snapshot data at time of sale
    title: string
    description: string
    price: number
    photos: string[]
    closet: string
  }
  price: number                             // price at time of sale
  createdAt: Timestamp                      // when transaction was created
}
```

**firestore path:** `/transactions/{transactionId}`

### 3. users collection (no schema changes)

purchase/sales stats will be computed client-side from transactions collection

---

## backend implementation tasks

### task 1: update types (src/types/index.ts)

- [x] add status field to Listing interface
- [x] add soldAt, archivedAt, buyerId optional fields
- [x] create Transaction interface
- [x] export new types

### task 2: create transaction service (src/services/firebase/transactionService.ts)

**new file with functions:**

```typescript
// create transaction record (called when seller marks as sold)
async function createTransaction(
  listing: Listing,
  buyerId: string
): Promise<string>

// get user's purchase history (where user is buyer)
async function getUserPurchases(userId: string): Promise<Transaction[]>

// get user's sales history (where user is seller)
async function getUserSales(userId: string): Promise<Transaction[]>

// get single transaction by id
async function getTransaction(transactionId: string): Promise<Transaction | null>
```

**implementation notes:**
- use batch writes to ensure atomicity
- denormalize user data (username, avatar) for display
- snapshot listing data to preserve sale details
- sort transactions by createdAt DESC

### task 3: update listing service (src/services/firebase/listingService.ts)

**add functions:**

```typescript
// mark listing as sold - creates transaction + updates listing
async function markListingAsSold(
  listingId: string,
  buyerId: string
): Promise<void>

// archive listing (seller removes without selling)
async function archiveListing(listingId: string): Promise<void>

// unarchive listing (restore to available)
async function unarchiveListing(listingId: string): Promise<void>

// get seller's archived listings
async function getArchivedListings(sellerId: string): Promise<Listing[]>
```

**update existing functions:**
- `getFeedListings` - filter out sold/archived listings
- `getUserListings` - add optional status filter parameter

**batch write for markListingAsSold:**
```typescript
// atomic operation:
// 1. create transaction document
// 2. update listing (status=sold, soldAt=now, buyerId=buyerId)
// 3. commit batch
```

### task 4: create transaction hook (src/hooks/useTransactions.ts)

**new file with hook:**

```typescript
export function useTransactions(userId: string, type: 'purchases' | 'sales') {
  // returns: { transactions, loading, error, refresh }
  // fetches getUserPurchases or getUserSales based on type
  // supports pull-to-refresh
}
```

### task 5: update existing hooks

**src/hooks/useProfile.ts:**
- add `purchaseCount` and `salesCount` to computed stats (fetch from transactions)

**src/hooks/useListings.ts:**
- filter out listings with status='sold' or status='archived'

**src/hooks/useListingDetail.ts:**
- add `markAsSold` function for seller
- add `archive` function for seller

---

## ui implementation tasks

### task 6: listing detail screen updates (src/screens/listings/ListingDetailScreen.tsx)

**for sellers only:**
- add "mark as sold" button (visible if status='available' and marks.length > 0)
- show modal to select buyer from marks list
- on confirm: call markListingAsSold, navigate to transaction success screen
- add "archive" button (visible if status='available')

**for all users:**
- show "sold" badge if status='sold'
- disable "mark it" button if status='sold' or status='archived'

### task 7: create transaction screens

**src/screens/transactions/TransactionSuccessScreen.tsx:**
- shown after seller marks item as sold
- displays buyer info, sale price, transaction summary
- "done" button navigates back to profile

**src/screens/transactions/TransactionHistoryScreen.tsx:**
- tab view: "purchases" vs "sales"
- list of transactions with listing snapshot
- tap to view transaction detail

**src/screens/transactions/TransactionDetailScreen.tsx:**
- full transaction info
- listing snapshot
- buyer/seller info
- timestamp
- button to view conversation (if exists)

### task 8: profile screen updates (src/screens/profile/ProfileScreen.tsx)

**add sections:**
- "archived" row in settings (like instagram archive)
- "purchase history" row in settings
- "sales history" row in settings

**navigation routes:**
- ProfileStack: ArchivedListings screen
- ProfileStack: PurchaseHistory screen (uses TransactionHistoryScreen with type='purchases')
- ProfileStack: SalesHistory screen (uses TransactionHistoryScreen with type='sales')

### task 9: create archived listings screen (src/screens/profile/ArchivedListingsScreen.tsx)

- similar to ProfileScreen closet grid view
- shows listings with status='archived'
- tap item to view detail
- option to unarchive (restore to available)

---

## firebase configuration updates

### task 10: update firestore security rules (firestore.rules)

**add transactions collection rules:**
```
match /transactions/{transactionId} {
  allow read: if request.auth != null
    && (resource.data.buyerId == request.auth.uid
        || resource.data.sellerId == request.auth.uid);
  allow create: if request.auth != null
    && request.resource.data.sellerId == request.auth.uid;
  allow update, delete: if false; // transactions are immutable
}
```

**update listings collection rules:**
```
// allow seller to update status field
allow update: if request.auth.uid == resource.data.sellerId
  && request.resource.data.keys().hasOnly([
    'status', 'soldAt', 'archivedAt', 'buyerId', 'updatedAt'
  ]);
```

### task 11: create composite indexes (firestore.indexes.json)

**add indexes:**
```json
{
  "indexes": [
    {
      "collectionGroup": "transactions",
      "queryScope": "COLLECTION",
      "fields": [
        {"fieldPath": "buyerId", "order": "ASCENDING"},
        {"fieldPath": "createdAt", "order": "DESCENDING"}
      ]
    },
    {
      "collectionGroup": "transactions",
      "queryScope": "COLLECTION",
      "fields": [
        {"fieldPath": "sellerId", "order": "ASCENDING"},
        {"fieldPath": "createdAt", "order": "DESCENDING"}
      ]
    },
    {
      "collectionGroup": "listings",
      "queryScope": "COLLECTION",
      "fields": [
        {"fieldPath": "sellerId", "order": "ASCENDING"},
        {"fieldPath": "status", "order": "ASCENDING"},
        {"fieldPath": "updatedAt", "order": "DESCENDING"}
      ]
    }
  ]
}
```

---

## firebase cloud functions (optional - recommended)

**why use cloud functions?**
- ensure atomic transaction creation (prevent race conditions)
- server-side validation (seller can't sell to non-marker)
- future: send push notification when item is sold

### task 12: create firebase function (functions/src/index.ts)

**function: markListingAsSold**

```typescript
// callable function (invoked from client)
export const markListingAsSold = functions.https.onCall(async (data, context) => {
  // validate auth
  // validate seller owns listing
  // validate buyer is in marks array
  // validate listing status is 'available'
  // create transaction + update listing in batch
  // return transaction id
});
```

**benefits:**
- prevents two sellers from selling same item simultaneously
- validates buyer was actually in marks list
- single source of truth for transaction creation logic
- easier to test and maintain than client-side batch writes

**setup required:**
```bash
# in WSL terminal
npm install -g firebase-tools
firebase init functions
cd functions
npm install
npm run build
firebase deploy --only functions
```

---

## navigation updates

### task 13: update navigation types (src/navigation/types.ts)

**add to ProfileStackParamList:**
```typescript
ArchivedListings: undefined
PurchaseHistory: undefined
SalesHistory: undefined
TransactionDetail: { transactionId: string }
```

**add new TransactionStackParamList (optional - if you want separate stack):**
```typescript
export type TransactionStackParamList = {
  TransactionHistory: { type: 'purchases' | 'sales' }
  TransactionDetail: { transactionId: string }
}
```

### task 14: update navigators

**src/navigation/MainNavigator.tsx:**
- add routes for archived listings, transaction history

**src/screens/listings/ListingDetailScreen.tsx:**
- add navigation to TransactionSuccess after marking as sold

---

## testing plan

### task 15: manual testing checklist

**seller flow:**
- [ ] create listing -> shows status='available'
- [ ] other user marks listing -> appears in marks array
- [ ] tap "mark as sold" -> modal shows list of users who marked
- [ ] select buyer -> creates transaction + updates listing to sold
- [ ] verify transaction appears in "sales history"
- [ ] verify listing no longer appears in feed
- [ ] verify buyer sees transaction in "purchase history"
- [ ] archive listing -> appears in "archived listings"
- [ ] unarchive listing -> appears in feed again

**buyer flow:**
- [ ] mark item -> appears in seller's marks list
- [ ] seller marks as sold to this buyer -> notification (future)
- [ ] verify transaction in "purchase history"
- [ ] cannot mark sold items

**edge cases:**
- [ ] seller cannot mark as sold if no marks
- [ ] seller cannot mark as sold to user who didn't mark
- [ ] archived listings don't appear in feed
- [ ] sold listings don't appear in feed
- [ ] transaction is immutable (cannot update/delete)

### task 16: seed data updates (scripts/seed.ts)

**add test transactions:**
- create 5-10 test transactions between users
- some users have purchase history
- some users have sales history
- verify stats compute correctly

---

## deployment checklist

### task 17: deploy to firebase

**in WSL terminal:**
```bash
# deploy security rules
firebase deploy --only firestore:rules

# deploy indexes
firebase deploy --only firestore:indexes

# (optional) deploy cloud functions
firebase deploy --only functions

# verify in firebase console:
# - transactions collection exists
# - indexes are built
# - security rules are active
```

---

## future enhancements (post-MVP)

- push notifications when item is sold
- transaction dispute/cancellation flow
- seller ratings/reviews on transactions
- transaction search/filter
- export transaction history (CSV)
- price negotiation flow (buyer makes offer)
- "mark as pending" status (reserved but not sold yet)

---

## summary

**new files to create:** 7
- `src/services/firebase/transactionService.ts`
- `src/hooks/useTransactions.ts`
- `src/screens/transactions/TransactionSuccessScreen.tsx`
- `src/screens/transactions/TransactionHistoryScreen.tsx`
- `src/screens/transactions/TransactionDetailScreen.tsx`
- `src/screens/profile/ArchivedListingsScreen.tsx`
- `functions/src/index.ts` (optional)

**files to update:** 8
- `src/types/index.ts`
- `src/services/firebase/listingService.ts`
- `src/hooks/useProfile.ts`
- `src/hooks/useListings.ts`
- `src/hooks/useListingDetail.ts`
- `src/screens/listings/ListingDetailScreen.tsx`
- `src/screens/profile/ProfileScreen.tsx`
- `src/navigation/types.ts`
- `firestore.rules`
- `firestore.indexes.json`

**estimated complexity:** medium
**estimated time:** 4-6 hours (without cloud functions), 6-8 hours (with cloud functions)

**recommended approach:**
1. start with schema + types (task 1)
2. implement services (tasks 2-3)
3. implement hooks (tasks 4-5)
4. build UI screens (tasks 6-9)
5. update firebase config (tasks 10-11)
6. test thoroughly (task 15)
7. deploy (task 17)
8. (optional) add cloud functions later (task 12)