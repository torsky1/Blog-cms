export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image: string | null;
  author: string;
  created_at: string;
  updated_at: string;
}
