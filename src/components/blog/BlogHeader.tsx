import { Link } from 'react-router-dom';
import { SiteConfig } from '@/types/database';

interface BlogHeaderProps {
  site: SiteConfig;
}

export function BlogHeader({ site }: BlogHeaderProps) {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-5 flex items-center justify-between max-w-4xl">
        {/* Brand + site name */}
        <Link to={`/${site.key}/blogs`} className="flex items-center gap-3">
          <span className="font-serif text-lg font-semibold text-foreground tracking-tight">
            Probiz Blogs
          </span>
          <div className="hidden md:flex items-center gap-3">
            <div className="w-px h-4 bg-border" />
            <span className="text-sm text-muted-foreground font-medium">
              {site.name}
            </span>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-6">
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            All Sites
          </Link>
        </nav>
      </div>
    </header>
  );
}
