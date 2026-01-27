export interface Post {
  id: number;
  user_id: number;
  message: string;
  image_url: string | null;
  status: 'active' | 'inactive';
  created_at: Date;
}

export interface PostWithUser extends Post {
  username: string;
}

export interface CreatePostRequest {
  message: string;
  image?: Express.Multer.File;
}

export interface PostResponse {
  id: number;
  user_id: number;
  username: string;
  message: string;
  image_url: string | null;
  created_at: Date;
}

export interface JWTPayload {
  id: number;
  username: string;
}