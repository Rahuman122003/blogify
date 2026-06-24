import { Link } from 'react-router-dom';
import { SiteConfig } from '@/types/database';

interface BlogFooterProps {
  site: SiteConfig;
}

export function BlogFooter({ site }: BlogFooterProps) {
  return (
    <footer className="border-t border-blog-divider mt-16 py-12 bg-card">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <p className="font-serif text-xl font-bold text-foreground">{site.name}</p>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">All Publications</Link>
            <span>·</span>
            <span>© {new Date().getFullYear()} Probiz Connect</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
