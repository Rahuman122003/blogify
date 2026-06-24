import { useParams, useNavigate } from 'react-router-dom';
import { useBlogById, useUpdateBlog } from '@/hooks/useBlogs';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { BlogEditor } from '@/components/admin/BlogEditor';
import { DbBlogContentInsert, SiteKey } from '@/types/database';
import { Loader2 } from 'lucide-react';

export default function AdminEditBlog() {
  const { id } = useParams<{ id: string }>();
  const { data: blog, isLoading } = useBlogById(id || '');
  const updateBlog = useUpdateBlog();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  if (!blog) {
    return (
      <AdminLayout>
        <div className="text-center py-16">
          <h1 className="font-serif text-2xl font-bold text-foreground mb-4">Post Not Found</h1>
          <p className="text-muted-foreground">The post you're looking for doesn't exist.</p>
        </div>
      </AdminLayout>
    );
  }

  const initialData = {
    id: blog.id,
    title: blog.title,
    slug: blog.slug,
    description: blog.description || '',
    coverImage: blog.cover_image || '',
    author: blog.author || '',
    published: blog.published,
    site: blog.site,
    content: blog.blog_content.map(block => ({
      id: block.id,
      type: block.type,
      content: block.content,
      alt: block.alt || undefined,
    })),
  };

  const handleSave = (data: {
    title: string;
    slug: string;
    description: string;
    coverImage: string;
    content: Array<{ type: 'paragraph' | 'heading2' | 'heading3' | 'image'; content: string; alt?: string }>;
    published: boolean;
    author: string;
    readingTime: string;
    site: SiteKey;
  }) => {
    const blogData = {
      title: data.title,
      slug: data.slug,
      description: data.description,
      cover_image: data.coverImage,
      published: data.published,
      author: data.author,
      reading_time: data.readingTime,
      site: data.site,
    };

    const contentData: Omit<DbBlogContentInsert, 'blog_id'>[] = data.content.map((block, index) => ({
      type: block.type,
      content: block.content,
      alt: block.alt || null,
      position: index,
    }));

    updateBlog.mutate(
      { id: blog.id, blog: blogData, content: contentData },
      { onSuccess: () => navigate('/admin/dashboard') }
    );
  };

  return (
    <AdminLayout>
      <div className="fade-in">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-foreground">Edit Post</h1>
          <p className="text-muted-foreground mt-1">Update your blog post</p>
        </div>
        <BlogEditor initialData={initialData} onSave={handleSave} isLoading={updateBlog.isPending} />
      </div>
    </AdminLayout>
  );
}
