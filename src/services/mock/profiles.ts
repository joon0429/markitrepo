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
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800',
    ],
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'board-2',
    userId: 'user-1',
    name: 'vintage finds',
    itemCount: 3,
    previewPhotos: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800',
    ],
    createdAt: new Date('2024-01-20'),
  },
  {
    id: 'board-3',
    userId: 'user-1',
    name: 'accessories',
    itemCount: 2,
    previewPhotos: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800',
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800',
    ],
    createdAt: new Date('2024-01-25'),
  },
  {
    id: 'board-4',
    userId: 'user-1',
    name: 'outdoor gear',
    itemCount: 2,
    previewPhotos: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800',
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800',
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
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800',
    ],
    createdAt: new Date('2024-02-01'),
  },
  {
    id: 'board-6',
    userId: 'user-2',
    name: 'streetwear',
    itemCount: 4,
    previewPhotos: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800',
      'https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?w=800',
      'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=800',
    ],
    createdAt: new Date('2024-02-05'),
  },
  {
    id: 'board-7',
    userId: 'user-2',
    name: 'sneakers',
    itemCount: 1,
    previewPhotos: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
    ],
    createdAt: new Date('2024-02-10'),
  },
  {
    id: 'board-8',
    userId: 'user-2',
    name: 'cameras',
    itemCount: 1,
    previewPhotos: [
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800',
      'https://images.unsplash.com/photo-1606982991832-0bf81e855b2c?w=800',
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
      'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800',
      'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800',
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800',
    ],
    createdAt: new Date('2024-01-20'),
  },
  {
    id: 'board-10',
    userId: 'user-3',
    name: 'tech',
    itemCount: 4,
    previewPhotos: [
      'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800',
      'https://images.unsplash.com/photo-1588156979435-379b9a0d6f0e?w=800',
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800',
      'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800',
    ],
    createdAt: new Date('2024-01-25'),
  },
  {
    id: 'board-11',
    userId: 'user-3',
    name: 'gaming',
    itemCount: 1,
    previewPhotos: [
      'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800',
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
      'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
      'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800',
      'https://images.unsplash.com/photo-1606982991832-0bf81e855b2c?w=800',
    ],
    createdAt: new Date('2024-02-10'),
  },
  {
    id: 'board-13',
    userId: 'user-4',
    name: 'home & garden',
    itemCount: 3,
    previewPhotos: [
      'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
      'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800',
    ],
    createdAt: new Date('2024-02-12'),
  },
  {
    id: 'board-14',
    userId: 'user-4',
    name: 'photography',
    itemCount: 1,
    previewPhotos: [
      'https://images.unsplash.com/photo-1606982991832-0bf81e855b2c?w=800',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800',
    ],
    createdAt: new Date('2024-02-15'),
  },
  {
    id: 'board-15',
    userId: 'user-4',
    name: 'fitness',
    itemCount: 1,
    previewPhotos: [
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800',
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
