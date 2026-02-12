// Database types matching Supabase schema

export interface DbBlog {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_image: string | null;
  author: string | null;
  reading_time: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbBlogContent {
  id: string;
  blog_id: string;
  type: 'paragraph' | 'heading2' | 'heading3' | 'image';
  content: string;
  alt: string | null;
  position: number;
  created_at: string;
}

export interface DbUserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'user';
  created_at: string;
}

// Insert types
export type DbBlogInsert = Omit<DbBlog, 'id' | 'created_at' | 'updated_at'>;
export type DbBlogContentInsert = Omit<DbBlogContent, 'id' | 'created_at'>;

// Blog with content for full display
export interface BlogWithContent extends DbBlog {
  blog_content: DbBlogContent[];
}
