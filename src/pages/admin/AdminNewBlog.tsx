import { useNavigate } from 'react-router-dom';
import { useCreateBlog } from '@/hooks/useBlogs';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { BlogEditor } from '@/components/admin/BlogEditor';
import { DbBlogContentInsert } from '@/types/database';

export default function AdminNewBlog() {
  const createBlog = useCreateBlog();
  const navigate = useNavigate();

  const handleSave = (data: {
    title: string;
    slug: string;
    description: string;
    coverImage: string;
    content: Array<{ type: 'paragraph' | 'heading2' | 'heading3' | 'image'; content: string; alt?: string }>;
    published: boolean;
    author: string;
    readingTime: string;
  }) => {
    const blogData = {
      title: data.title,
      slug: data.slug,
      description: data.description,
      cover_image: data.coverImage,
      published: data.published,
      author: data.author,
      reading_time: data.readingTime,
    };

    const contentData: Omit<DbBlogContentInsert, 'blog_id'>[] = data.content.map((block, index) => ({
      type: block.type,
      content: block.content,
      alt: block.alt || null,
      position: index,
    }));

    createBlog.mutate(
      { blog: blogData, content: contentData },
      {
        onSuccess: () => {
          navigate('/admin/dashboard');
        },
      }
    );
  };

  return (
    <AdminLayout>
      <div className="fade-in">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-foreground">Create New Post</h1>
          <p className="text-muted-foreground mt-1">Write and publish a new blog post</p>
        </div>
        <BlogEditor onSave={handleSave} isLoading={createBlog.isPending} />
      </div>
    </AdminLayout>
  );
}
