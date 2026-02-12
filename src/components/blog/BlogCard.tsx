import { Link } from 'react-router-dom';
import { DbBlog } from '@/types/database';
import { format } from 'date-fns';
import { ArrowUpRight } from 'lucide-react';

interface BlogCardProps {
  blog: DbBlog;
  featured?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function BlogCard({ blog, featured = false, size = 'medium' }: BlogCardProps) {
  const category = 'Blog'; // Default category
  const coverImage = blog.cover_image || '/placeholder.svg';
  const createdAt = new Date(blog.created_at);

  if (featured) {
    return (
      <Link 
        to={`/blogs/${blog.slug}`}
        className="group block relative overflow-hidden rounded-3xl"
      >
        <div className="relative aspect-[4/5] md:aspect-[3/4]">
          <img
            src={coverImage}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Overlay badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <span className="bg-white text-foreground text-xs font-medium px-3 py-1.5 rounded-full">
              {format(createdAt, 'MMM d, yyyy')}
            </span>
            <span className="bg-foreground text-white text-xs font-medium px-3 py-1.5 rounded-full">
              • {category}
            </span>
          </div>
          {/* Arrow button */}
          <div className="absolute top-4 right-4">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center group-hover:bg-foreground group-hover:text-white transition-colors">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (size === 'large') {
    return (
      <div className="group flex flex-col md:flex-row gap-6 items-center">
        <Link 
          to={`/blogs/${blog.slug}`}
          className="relative overflow-hidden rounded-3xl flex-1"
        >
          <div className="relative aspect-[4/5]">
            <img
              src={coverImage}
              alt={blog.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Overlay badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className="bg-white text-foreground text-xs font-medium px-3 py-1.5 rounded-full">
                {format(createdAt, 'MMM d, yyyy')}
              </span>
              <span className="bg-foreground text-white text-xs font-medium px-3 py-1.5 rounded-full">
                • {category}
              </span>
            </div>
          </div>
        </Link>
        <div className="flex-1 space-y-4">
          <Link to={`/blogs/${blog.slug}`}>
            <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground leading-tight group-hover:text-primary transition-colors">
              {blog.title}
            </h2>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center text-white group-hover:bg-primary transition-colors cursor-pointer">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link 
      to={`/blogs/${blog.slug}`}
      className="group block"
    >
      <div className="relative overflow-hidden rounded-3xl mb-4">
        <div className="relative aspect-[4/5]">
          <img
            src={coverImage}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Overlay badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <span className="bg-white text-foreground text-xs font-medium px-3 py-1.5 rounded-full">
              {format(createdAt, 'MMM d, yyyy')}
            </span>
            <span className="bg-foreground text-white text-xs font-medium px-3 py-1.5 rounded-full">
              • {category}
            </span>
          </div>
          {/* Arrow button */}
          <div className="absolute top-4 right-4">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center group-hover:bg-foreground group-hover:text-white transition-colors">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="font-serif text-xl font-medium text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2">
          {blog.title}
        </h3>
      </div>
    </Link>
  );
}
