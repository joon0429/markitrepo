// App configuration constants

export const APP_CONFIG = {
  name: 'Mark-it',
  version: '1.0.0',
  description: 'Friend-to-Friend Marketplace',
};

export const LISTING_CONFIG = {
  maxPhotos: 4,
  minPhotos: 1,
  maxPhotoSizeMB: 10,
  imageQuality: 0.8,
  thumbnailSize: { width: 512, height: 512 },
  fullImageSize: { width: 1024, height: 1024 },
};

export const VALIDATION = {
  username: {
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-z0-9_]+$/,
  },
  displayName: {
    minLength: 1,
    maxLength: 50,
  },
  bio: {
    maxLength: 200,
  },
  listingTitle: {
    minLength: 3,
    maxLength: 100,
  },
  listingDescription: {
    maxLength: 1000,
  },
  price: {
    min: 0,
    max: 100000,
  },
};

export const PAGINATION = {
  listingsPerPage: 20,
  messagesPerPage: 50,
  friendsPerPage: 30,
};
