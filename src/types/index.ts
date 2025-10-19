export type Platform = 'instagram' | 'facebook';

export type PostType = 'image' | 'video' | 'carousel' | 'reel' | 'story' | 'text';

export interface UploadedPost {
  id: string;
  platform: Platform;
  type: PostType;
  caption: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  createdAt: Date;
  status: 'success' | 'error';
}

export interface UploadFormData {
  caption: string;
  hashtags: string;
  mediaUrls: string[];
  postType: PostType;
}
