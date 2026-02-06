import { Board, UserStats } from '@types/profile';
import { mockListings } from './listings';

// mock boards for users
export const mockBoards: Board[] = [
  // user-1 (sarah_parker) boards
  {
    id: 'board-1',
    userId: 'user-1',
    name: 'all my items',
    itemCount: 7, // sarah has 7 listings total
    previewPhotos: [
      'placeholder',
      'placeholder',
      'placeholder',
      'placeholder',
    ],
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'board-2',
    userId: 'user-1',
    name: 'vintage finds',
    itemCount: 3,
    previewPhotos: [
      'placeholder',
      'placeholder',
      'placeholder',
      'placeholder',
    ],
    createdAt: new Date('2024-01-20'),
  },
  {
    id: 'board-3',
    userId: 'user-1',
    name: 'accessories',
    itemCount: 2,
    previewPhotos: [
      'placeholder',
      'placeholder',
    ],
    createdAt: new Date('2024-01-25'),
  },
  {
    id: 'board-4',
    userId: 'user-1',
    name: 'outdoor gear',
    itemCount: 2,
    previewPhotos: [
      'placeholder',
      'placeholder',
    ],
    createdAt: new Date('2024-02-01'),
  },

  // user-2 (alex_kim) boards
  {
    id: 'board-5',
    userId: 'user-2',
    name: 'all my items',
    itemCount: 6,
    previewPhotos: [
      'placeholder',
      'placeholder',
      'placeholder',
      'placeholder',
    ],
    createdAt: new Date('2024-02-01'),
  },
  {
    id: 'board-6',
    userId: 'user-2',
    name: 'streetwear',
    itemCount: 4,
    previewPhotos: [
      'placeholder',
      'placeholder',
      'placeholder',
      'placeholder',
    ],
    createdAt: new Date('2024-02-05'),
  },
  {
    id: 'board-7',
    userId: 'user-2',
    name: 'sneakers',
    itemCount: 1,
    previewPhotos: [
      'placeholder',
    ],
    createdAt: new Date('2024-02-10'),
  },
  {
    id: 'board-8',
    userId: 'user-2',
    name: 'cameras',
    itemCount: 1,
    previewPhotos: [
      'placeholder',
      'placeholder',
    ],
    createdAt: new Date('2024-02-12'),
  },

  // user-3 (jordan_lee) boards
  {
    id: 'board-9',
    userId: 'user-3',
    name: 'all my items',
    itemCount: 5,
    previewPhotos: [
      'placeholder',
      'placeholder',
      'placeholder',
      'placeholder',
    ],
    createdAt: new Date('2024-01-20'),
  },
  {
    id: 'board-10',
    userId: 'user-3',
    name: 'tech',
    itemCount: 4,
    previewPhotos: [
      'placeholder',
      'placeholder',
      'placeholder',
      'placeholder',
    ],
    createdAt: new Date('2024-01-25'),
  },
  {
    id: 'board-11',
    userId: 'user-3',
    name: 'gaming',
    itemCount: 1,
    previewPhotos: [
      'placeholder',
    ],
    createdAt: new Date('2024-02-01'),
  },

  // user-4 (taylor_wong) boards
  {
    id: 'board-12',
    userId: 'user-4',
    name: 'all my items',
    itemCount: 6,
    previewPhotos: [
      'placeholder',
      'placeholder',
      'placeholder',
      'placeholder',
    ],
    createdAt: new Date('2024-02-10'),
  },
  {
    id: 'board-13',
    userId: 'user-4',
    name: 'home & garden',
    itemCount: 3,
    previewPhotos: [
      'placeholder',
      'placeholder',
      'placeholder',
    ],
    createdAt: new Date('2024-02-12'),
  },
  {
    id: 'board-14',
    userId: 'user-4',
    name: 'photography',
    itemCount: 1,
    previewPhotos: [
      'placeholder',
      'placeholder',
    ],
    createdAt: new Date('2024-02-15'),
  },
  {
    id: 'board-15',
    userId: 'user-4',
    name: 'fitness',
    itemCount: 1,
    previewPhotos: [
      'placeholder',
    ],
    createdAt: new Date('2024-02-18'),
  },
];

// mock user stats
export const mockUserStats: { [userId: string]: UserStats } = {
  'user-1': {
    friendCount: 12,
    salesCount: 3,
    listingCount: 7,
  },
  'user-2': {
    friendCount: 8,
    salesCount: 5,
    listingCount: 6,
  },
  'user-3': {
    friendCount: 15,
    salesCount: 2,
    listingCount: 5,
  },
  'user-4': {
    friendCount: 6,
    salesCount: 1,
    listingCount: 6,
  },
};

// helper function to get boards by user
export function getBoardsByUser(userId: string): Board[] {
  return mockBoards.filter(board => board.userId === userId);
}

// helper function to get user stats
export function getUserStats(userId: string): UserStats {
  return mockUserStats[userId] || {
    friendCount: 0,
    salesCount: 0,
    listingCount: 0,
  };
}

// helper function to get a specific board by id
export function getBoardById(boardId: string): Board | undefined {
  return mockBoards.find(board => board.id === boardId);
}
