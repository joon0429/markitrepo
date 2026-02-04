export interface Board {
  id: string;
  userId: string;
  name: string;
  itemCount: number;
  previewPhotos: string[]; // first 4 listing photos for grid preview
  createdAt: Date;
}

export interface UserStats {
  friendCount: number;
  salesCount: number;
  listingCount: number;
}