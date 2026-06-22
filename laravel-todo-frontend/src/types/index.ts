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