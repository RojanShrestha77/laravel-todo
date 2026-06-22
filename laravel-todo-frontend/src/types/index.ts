export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  body: string;
  author: string;
  created_at: string;
}

export interface Comment {
  id: number;
  body: string;
  is_private: boolean;
  author: string;
  user_id: number;
  created_at: string;
}