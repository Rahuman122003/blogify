import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DbBlog, DbBlogContent, DbBlogInsert, DbBlogContentInsert, BlogWithContent, SiteKey } from '@/types/database';
import { toast } from 'sonner';

type BlogContentType = 'paragraph' | 'heading2' | 'heading3' | 'image';

// Fetch published blogs for a specific site (public)
export function usePublishedBlogs(site: SiteKey) {
  return useQuery({
    queryKey: ['blogs', 'published', site],
    queryFn: async (): Promise<DbBlog[]> => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('published', true)
        .eq('site', site)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as DbBlog[];
    },
  });
}

// Fetch ALL blogs across all sites (admin only)
export function useAllBlogs(site?: SiteKey) {
  return useQuery({
    queryKey: ['blogs', 'all', site ?? 'all'],
    queryFn: async (): Promise<DbBlog[]> => {
      let query = supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (site) {
        query = query.eq('site', site);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as DbBlog[];
    },
  });
}

// Fetch single blog by slug + site with content
export function useBlogBySlug(slug: string, site: SiteKey) {
  return useQuery({
    queryKey: ['blog', site, slug],
    queryFn: async (): Promise<BlogWithContent | null> => {
      const { data: blog, error: blogError } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .eq('site', site)
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

      const typedContent: DbBlogContent[] = (content || []).map(item => ({
        ...item,
        type: item.type as BlogContentType,
      }));

      return { ...(blog as DbBlog), blog_content: typedContent };
    },
    enabled: !!slug && !!site,
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

      const typedContent: DbBlogContent[] = (content || []).map(item => ({
        ...item,
        type: item.type as BlogContentType,
      }));

      return { ...(blog as DbBlog), blog_content: typedContent };
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
      const { data: newBlog, error: blogError } = await supabase
        .from('blogs')
        .insert(blog)
        .select()
        .single();

      if (blogError) throw blogError;

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
      const { data: updatedBlog, error: blogError } = await supabase
        .from('blogs')
        .update(blog)
        .eq('id', id)
        .select()
        .single();

      if (blogError) throw blogError;

      const { error: deleteError } = await supabase
        .from('blog_content')
        .delete()
        .eq('blog_id', id);

      if (deleteError) throw deleteError;

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
      toast.success((data as DbBlog).published ? 'Blog published!' : 'Blog unpublished');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update publish status: ${error.message}`);
    },
  });
}
