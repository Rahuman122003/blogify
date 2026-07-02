// Database types matching Supabase schema

export type SiteKey = 'probiz-connect' | 'prosmart-energy' | 'probiz-retail' | 'blyn-tech';

// Categories per site
export const SITE_CATEGORIES: Record<SiteKey, string[]> = {
  'probiz-connect': ['All', 'Sales', 'Distribution', 'Technology', 'Case Studies', 'News'],
  'prosmart-energy': ['All', 'Energy', 'Automation', 'Compliance', 'Case Studies', 'Sustainability'],
  'probiz-retail': ['All', 'Press', 'Product', 'Retail Tech', 'Funding', 'Partnerships'],
  'blyn-tech': ['All', 'Design Systems', 'Engineering', 'Brand', 'AI', 'Insights'],
};

export interface SiteConfig {
  key: SiteKey;
  name: string;
  description: string;
  color: string;        // tailwind bg color class
  textColor: string;   // tailwind text color class
  borderColor: string; // tailwind border color class
  emoji: string;
}

export const SITES: SiteConfig[] = [
  {
    key: 'probiz-connect',
    name: 'Probiz Connect Blog',
    description: 'News, insights and stories from Probiz Connect',
    color: 'bg-blue-600',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-600',
    emoji: '',
  },
  {
    key: 'prosmart-energy',
    name: 'ProSmart Energy',
    description: 'Smart energy solutions and sustainability insights',
    color: 'bg-green-600',
    textColor: 'text-green-600',
    borderColor: 'border-green-600',
    emoji: '',
  },
  {
    key: 'probiz-retail',
    name: 'Probiz Retail',
    description: 'Retail trends, strategies and business insights',
    color: 'bg-orange-500',
    textColor: 'text-orange-500',
    borderColor: 'border-orange-500',
    emoji: '',
  },
  {
    key: 'blyn-tech',
    name: 'BLYN Tech',
    description: 'Technology, innovation and digital transformation',
    color: 'bg-purple-600',
    textColor: 'text-purple-600',
    borderColor: 'border-purple-600',
    emoji: '',
  },
];

export function getSiteConfig(key: string): SiteConfig | undefined {
  return SITES.find(s => s.key === key);
}

export interface DbBlog {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_image: string | null;
  author: string | null;
  reading_time: string | null;
  published: boolean;
  site: SiteKey;
  category: string | null;
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
