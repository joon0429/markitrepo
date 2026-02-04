import { Friend, FriendRequestWithMutuals } from '@types';

// mock friends for current user (sarah_parker - user-1)
export const mockFriends: Friend[] = [
  {
    uid: 'user-2',
    username: 'alex_kim',
    displayName: 'alex',
    photoURL: 'https://i.pravatar.cc/150?img=2',
    mutualFriendsCount: 5,
    friendsSince: new Date('2024-01-20'),
  },
  {
    uid: 'user-3',
    username: 'jordan_lee',
    displayName: 'jordan',
    photoURL: 'https://i.pravatar.cc/150?img=3',
    mutualFriendsCount: 3,
    friendsSince: new Date('2024-01-25'),
  },
  {
    uid: 'user-4',
    username: 'taylor_wong',
    displayName: 'taylor',
    photoURL: 'https://i.pravatar.cc/150?img=4',
    mutualFriendsCount: 2,
    friendsSince: new Date('2024-02-01'),
  },
  {
    uid: 'user-5',
    username: 'maya_chen',
    displayName: 'maya',
    photoURL: 'https://i.pravatar.cc/150?img=5',
    mutualFriendsCount: 7,
    friendsSince: new Date('2024-01-18'),
  },
  {
    uid: 'user-6',
    username: 'sam_garcia',
    displayName: 'sam',
    photoURL: 'https://i.pravatar.cc/150?img=6',
    mutualFriendsCount: 4,
    friendsSince: new Date('2024-02-05'),
  },
  {
    uid: 'user-7',
    username: 'riley_jones',
    displayName: 'riley',
    photoURL: 'https://i.pravatar.cc/150?img=7',
    mutualFriendsCount: 1,
    friendsSince: new Date('2024-02-10'),
  },
  {
    uid: 'user-8',
    username: 'casey_brown',
    displayName: 'casey',
    photoURL: 'https://i.pravatar.cc/150?img=8',
    mutualFriendsCount: 6,
    friendsSince: new Date('2024-01-22'),
  },
];

// mock friend requests for current user
export const mockFriendRequests: FriendRequestWithMutuals[] = [
  {
    id: 'req-1',
    fromUserId: 'user-9',
    fromUsername: 'avery_smith',
    fromPhotoURL: 'https://i.pravatar.cc/150?img=9',
    toUserId: 'user-1',
    toUsername: 'sarah_parker',
    status: 'pending',
    mutualFriendsCount: 3,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 'req-2',
    fromUserId: 'user-10',
    fromUsername: 'morgan_davis',
    fromPhotoURL: 'https://i.pravatar.cc/150?img=10',
    toUserId: 'user-1',
    toUsername: 'sarah_parker',
    status: 'pending',
    mutualFriendsCount: 1,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: 'req-3',
    fromUserId: 'user-11',
    fromUsername: 'jamie_wilson',
    fromPhotoURL: 'https://i.pravatar.cc/150?img=11',
    toUserId: 'user-1',
    toUsername: 'sarah_parker',
    status: 'pending',
    mutualFriendsCount: 2,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
];

// helper function to filter friends by search query
export function searchFriends(query: string, friends: Friend[] = mockFriends): Friend[] {
  if (!query.trim()) {
    return friends;
  }

  const lowerQuery = query.toLowerCase();
  return friends.filter(
    friend =>
      friend.username.toLowerCase().includes(lowerQuery) ||
      friend.displayName.toLowerCase().includes(lowerQuery)
  );
}

// helper function to get friend by id
export function getFriendById(userId: string): Friend | undefined {
  return mockFriends.find(friend => friend.uid === userId);
}

// helper function to get friend request by id
export function getFriendRequestById(requestId: string): FriendRequestWithMutuals | undefined {
  return mockFriendRequests.find(request => request.id === requestId);
}
