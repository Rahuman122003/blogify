import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DbBlog, DbBlogContent, DbBlogInsert, DbBlogContentInsert, BlogWithContent } from '@/types/database';
import { toast } from 'sonner';

type BlogContentType = 'paragraph' | 'heading2' | 'heading3' | 'image';

// Fetch all published blogs (public)
export function usePublishedBlogs() {
  return useQuery({
    queryKey: ['blogs', 'published'],
    queryFn: async (): Promise<DbBlog[]> => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
}

// Fetch all blogs (admin only - includes drafts)
export function useAllBlogs() {
  return useQuery({
    queryKey: ['blogs', 'all'],
    queryFn: async (): Promise<DbBlog[]> => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
}

// Fetch single blog by slug with content
export function useBlogBySlug(slug: string) {
  return useQuery({
    queryKey: ['blog', slug],
    queryFn: async (): Promise<BlogWithContent | null> => {
      const { data: blog, error: blogError } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .maybeSingle();

      if (blogError) throw blogError;
      if (!blog) return null;

      const { data: content, error: contentError } = await supabase
        .from('blog_content')
        .select('*')
        .eq('blog_id', blog.id)
        .order('position', { ascending: true });

      if (contentError) throw contentError;

      // Cast the content types properly
      const typedContent: DbBlogContent[] = (content || []).map(item => ({
        ...item,
        type: item.type as BlogContentType,
      }));

      return {
        ...blog,
        blog_content: typedContent,
      };
    },
    enabled: !!slug,
  });
}

// Fetch single blog by ID with content (admin)
export function useBlogById(id: string) {
  return useQuery({
    queryKey: ['blog', 'id', id],
    queryFn: async (): Promise<BlogWithContent | null> => {
      const { data: blog, error: blogError } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (blogError) throw blogError;
      if (!blog) return null;

      const { data: content, error: contentError } = await supabase
        .from('blog_content')
        .select('*')
        .eq('blog_id', blog.id)
        .order('position', { ascending: true });

      if (contentError) throw contentError;

      // Cast the content types properly
      const typedContent: DbBlogContent[] = (content || []).map(item => ({
        ...item,
        type: item.type as BlogContentType,
      }));

      return {
        ...blog,
        blog_content: typedContent,
      };
    },
    enabled: !!id,
  });
}

// Create blog mutation
export function useCreateBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      blog,
      content,
    }: {
      blog: DbBlogInsert;
      content: Omit<DbBlogContentInsert, 'blog_id'>[];
    }) => {
      // Insert blog
      const { data: newBlog, error: blogError } = await supabase
        .from('blogs')
        .insert(blog)
        .select()
        .single();

      if (blogError) throw blogError;

      // Insert content blocks
      if (content.length > 0) {
        const contentWithBlogId = content.map((block, index) => ({
          ...block,
          blog_id: newBlog.id,
          position: index,
        }));

        const { error: contentError } = await supabase
          .from('blog_content')
          .insert(contentWithBlogId);

        if (contentError) throw contentError;
      }

      return newBlog;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      toast.success('Blog created successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create blog: ${error.message}`);
    },
  });
}

// Update blog mutation
export function useUpdateBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      blog,
      content,
    }: {
      id: string;
      blog: Partial<DbBlogInsert>;
      content: Omit<DbBlogContentInsert, 'blog_id'>[];
    }) => {
      // Update blog
      const { data: updatedBlog, error: blogError } = await supabase
        .from('blogs')
        .update(blog)
        .eq('id', id)
        .select()
        .single();

      if (blogError) throw blogError;

      // Delete existing content
      const { error: deleteError } = await supabase
        .from('blog_content')
        .delete()
        .eq('blog_id', id);

      if (deleteError) throw deleteError;

      // Insert new content
      if (content.length > 0) {
        const contentWithBlogId = content.map((block, index) => ({
          ...block,
          blog_id: id,
          position: index,
        }));

        const { error: contentError } = await supabase
          .from('blog_content')
          .insert(contentWithBlogId);

        if (contentError) throw contentError;
      }

      return updatedBlog;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blog'] });
      toast.success('Blog updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update blog: ${error.message}`);
    },
  });
}

// Delete blog mutation
export function useDeleteBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('blogs').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      toast.success('Blog deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete blog: ${error.message}`);
    },
  });
}

// Toggle publish status
export function useTogglePublish() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      const { data, error } = await supabase
        .from('blogs')
        .update({ published })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      toast.success(data.published ? 'Blog published!' : 'Blog unpublished');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update publish status: ${error.message}`);
    },
  });
}
