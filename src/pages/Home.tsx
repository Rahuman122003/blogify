import { Link } from 'react-router-dom';
import { SITES } from '@/types/database';

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-6 py-5 flex items-center justify-between max-w-4xl">
          <span className="font-serif text-lg font-semibold text-foreground tracking-tight">
            Probiz Blogs
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 container mx-auto px-6 max-w-4xl">

        {/* Hero */}
        <div className="py-20 fade-in">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-5">
            Probiz Group
          </p>
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-foreground leading-tight mb-5">
            Our Publications
          </h1>
          <p className="text-base text-muted-foreground max-w-xs leading-relaxed">
            Insights and stories from across the Probiz family of companies.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Site List */}
        <div className="divide-y divide-border">
          {SITES.map((site, index) => (
            <Link
              key={site.key}
              to={`/${site.key}/blogs`}
              className="group flex items-center justify-between py-8 fade-in"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div>
                <h2 className="font-serif text-xl font-semibold text-foreground group-hover:text-muted-foreground transition-colors">
                  {site.name}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {site.description}
                </p>
              </div>
              <span className="text-muted-foreground group-hover:text-foreground transition-colors ml-8 flex-shrink-0">
                →
              </span>
            </Link>
          ))}
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="container mx-auto px-6 py-6 max-w-4xl">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Probiz Connect. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}
