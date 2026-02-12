import { useParams, Link } from 'react-router-dom';
import { useBlogBySlug, usePublishedBlogs } from '@/hooks/useBlogs';
import { BlogHeader } from '@/components/blog/BlogHeader';
import { BlogFooter } from '@/components/blog/BlogFooter';
import { BlogContentRenderer } from '@/components/blog/BlogContent';
import { format } from 'date-fns';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: blog, isLoading, error } = useBlogBySlug(slug || '');
  const { data: allBlogs = [] } = usePublishedBlogs();
  
  // Get related posts (excluding current)
  const relatedPosts = allBlogs
    .filter(b => b.id !== blog?.id)
    .slice(0, 3);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <BlogHeader />
        <main className="container mx-auto px-4 py-24 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </main>
        <BlogFooter />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-background">
        <BlogHeader />
        <main className="container mx-auto px-4 py-24 text-center">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-4">
            Post Not Found
          </h1>
          <p className="text-muted-foreground mb-8">
            The post you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/blogs" className="blog-link text-lg">
            ← Back to all posts
          </Link>
        </main>
        <BlogFooter />
      </div>
    );
  }

  // Transform blog content for renderer
  const contentForRenderer = blog.blog_content.map(block => ({
    id: block.id,
    type: block.type,
    content: block.content,
    alt: block.alt || undefined,
  }));

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />
      
      <main>
        {/* Hero Section */}
        <div className="relative">
          <div className="h-[50vh] md:h-[60vh] overflow-hidden">
            <img
              src={blog.cover_image || '/placeholder.svg'}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blog-image-overlay/80 via-blog-image-overlay/20 to-transparent" />
          </div>
          
          <div className="container mx-auto px-4">
            <div className="relative -mt-32 max-w-3xl mx-auto">
              <article className="bg-background rounded-t-2xl p-8 md:p-12 slide-up">
                <Link 
                  to="/blogs"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to posts
                </Link>
                
                <p className="blog-meta mb-4">
                  {format(new Date(blog.created_at), 'MMMM d, yyyy')} • {blog.reading_time || '5 min read'}
                </p>
                
                <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6">
                  {blog.title}
                </h1>
                
                {blog.author && (
                  <p className="text-muted-foreground">
                    By <span className="font-medium text-foreground">{blog.author}</span>
                  </p>
                )}
              </article>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto pb-16">
            <div className="bg-background px-8 md:px-12">
              <BlogContentRenderer content={contentForRenderer} />
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="bg-card py-16">
            <div className="container mx-auto px-4">
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-8 text-center">
                Continue Reading
              </h2>
              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {relatedPosts.map(post => (
                  <Link
                    key={post.id}
                    to={`/blogs/${post.slug}`}
                    className="group"
                  >
                    <div className="overflow-hidden rounded-lg mb-4">
                      <img
                        src={post.cover_image || '/placeholder.svg'}
                        alt={post.title}
                        className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <BlogFooter />
    </div>
  );
}
