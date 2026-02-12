import { usePublishedBlogs } from '@/hooks/useBlogs';
import { BlogHeader } from '@/components/blog/BlogHeader';
import { BlogFooter } from '@/components/blog/BlogFooter';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function BlogList() {
  const { data: blogs = [], isLoading, error } = usePublishedBlogs();

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />
      
      <main className="container mx-auto px-6 py-16 max-w-4xl">
        {/* Page Title */}
        <div className="mb-12 fade-in">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
            Blog Articles
          </h1>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <p className="text-xl text-destructive">Failed to load posts.</p>
            <p className="text-muted-foreground mt-2">Please try again later.</p>
          </div>
        )}

        {/* Blog List View */}
        {!isLoading && !error && blogs.length > 0 && (
          <div className="divide-y divide-border">
            {blogs.map((blog, index) => {
              const coverImage = blog.cover_image || '/placeholder.svg';
              const createdAt = new Date(blog.created_at);

              return (
                <article
                  key={blog.id}
                  className="py-10 first:pt-0 fade-in"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                    {/* Thumbnail */}
                    <Link
                      to={`/blogs/${blog.slug}`}
                      className="shrink-0 w-full md:w-64 h-44 rounded-lg overflow-hidden bg-muted"
                    >
                      <img
                        src={coverImage}
                        alt={blog.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </Link>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-sm text-primary mb-2">
                        <time dateTime={createdAt.toISOString()}>
                          {format(createdAt, 'd MMMM yyyy')}
                        </time>
                      </div>

                      <Link to={`/blogs/${blog.slug}`}>
                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground leading-tight hover:text-primary transition-colors mb-2">
                          {blog.title}
                        </h2>
                      </Link>

                      {blog.description && (
                        <p className="text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                          {blog.description}
                        </p>
                      )}

                      <Link
                        to={`/blogs/${blog.slug}`}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Continue Reading
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && blogs.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">No posts published yet.</p>
            <p className="text-muted-foreground mt-2">Check back soon!</p>
          </div>
        )}
      </main>

      <BlogFooter />
    </div>
  );
}
