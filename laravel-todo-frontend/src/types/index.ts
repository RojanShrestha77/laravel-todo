export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  category_id: number | null;
}

export interface Category {
  id: number;
  name: string;
  color: string;
}
