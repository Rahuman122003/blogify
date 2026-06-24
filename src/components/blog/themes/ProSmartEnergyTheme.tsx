// ─── ProSmart Energy Theme ───────────────────────────────────────────────────
// Dark green-black bg, featured hero card (text left + image right),
// green pill category tags, 3-col grid below with category·readtime labels

import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { DbBlog, BlogWithContent } from '@/types/database';
import { BlogContentRenderer } from '../BlogContent';
import prosmartLogo from '@/assets/prosmart-logo.png';

const BG = '#0b1510';
const CARD_BG = '#101d17';
const GREEN = '#22c55e';
const GREEN_DIM = '#16a34a';

export function ProSmartEnergyHeader() {
  return (
    <header className="border-b sticky top-0 z-50" style={{ background: BG, borderColor: '#1e2d24' }}>
      <div className="max-w-6xl mx-auto px-8 py-3 flex items-center justify-between">
        <Link to="/prosmart-energy/blogs">
          <img src={prosmartLogo} alt="Prosmart Energy" className="h-9 w-auto object-contain" />
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm" style={{ color: '#6b8f78' }}>
          <Link to="/prosmart-energy/blogs" className="hover:text-white transition-colors">Blog</Link>
          <Link to="/" className="hover:text-white transition-colors">All Sites</Link>
        </nav>
      </div>
    </header>
  );
}

export function ProSmartEnergyFooter() {
  return (
    <footer className="border-t py-10 mt-20" style={{ background: BG, borderColor: '#1e2d24' }}>
      <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <img src={prosmartLogo} alt="Prosmart Energy" className="h-7 w-auto object-contain" />
        <div className="flex items-center gap-6 text-xs" style={{ color: '#4a6b58' }}>
          <Link to="/" className="hover:text-white transition-colors">All Publications</Link>
          <span>© {new Date().getFullYear()} Probiz Connect</span>
        </div>
      </div>
    </footer>
  );
}

function GreenPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full"
      style={{ background: 'rgba(34,197,94,0.15)', color: GREEN, border: '1px solid rgba(34,197,94,0.3)' }}>
      {label}
    </span>
  );
}

interface ListProps { blogs: DbBlog[]; isLoading: boolean; error: unknown; }

export function ProSmartEnergyList({ blogs, isLoading, error }: ListProps) {
  const featured = blogs[0];
  const rest = blogs.slice(1);

  return (
    <div className="min-h-screen" style={{ background: BG }}>
      <ProSmartEnergyHeader />

      <div className="max-w-6xl mx-auto px-8 py-10">
        <Link to="/" className="inline-flex items-center gap-2 text-sm transition-colors mb-10"
          style={{ color: '#4a6b58' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={e => (e.currentTarget.style.color = '#4a6b58')}>
          <ArrowLeft className="w-4 h-4" /> All Publications
        </Link>

        {isLoading && <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin" style={{ color: GREEN }} /></div>}
        {error && <p className="text-center py-16" style={{ color: '#f87171' }}>Failed to load posts.</p>}
        {!isLoading && !error && blogs.length === 0 && (
          <p className="text-center py-16 text-sm" style={{ color: '#4a6b58' }}>No posts published yet.</p>
        )}

        {/* Featured hero — text left, image right */}
        {!isLoading && !error && featured && (
          <Link
            to={`/prosmart-energy/blogs/${featured.slug}`}
            className="group flex flex-col md:flex-row gap-0 rounded-2xl overflow-hidden mb-14"
            style={{ background: CARD_BG, border: '1px solid #1e2d24' }}
          >
            {/* Left: text */}
            <div className="flex-1 p-8 md:p-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <GreenPill label="Featured" />
                  <GreenPill label="Case Studies" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white leading-snug group-hover:opacity-80 transition-opacity mb-4">
                  {featured.title}
                </h2>
                {featured.description && (
                  <p className="text-sm leading-relaxed mb-6" style={{ color: '#6b8f78' }}>
                    {featured.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4 text-xs" style={{ color: '#4a6b58' }}>
                {featured.author && <span>👤 {featured.author}</span>}
                <span>📅 {format(new Date(featured.created_at), 'MMM d, yyyy')}</span>
                <span>{featured.reading_time || '5 min read'}</span>
              </div>
              <span className="mt-5 text-sm font-medium transition-colors" style={{ color: GREEN }}>
                Read the story →
              </span>
            </div>
            {/* Right: image */}
            <div className="md:w-[380px] shrink-0 h-64 md:h-auto overflow-hidden">
              <img
                src={featured.cover_image || '/placeholder.svg'}
                alt={featured.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </Link>
        )}

        {/* 3-col grid */}
        {!isLoading && !error && rest.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6">
            {rest.map(blog => (
              <Link
                key={blog.id}
                to={`/prosmart-energy/blogs/${blog.slug}`}
                className="group rounded-xl overflow-hidden"
                style={{ background: CARD_BG, border: '1px solid #1e2d24' }}
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={blog.cover_image || '/placeholder.svg'}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs uppercase tracking-widest mb-3" style={{ color: GREEN_DIM }}>
                    {blog.author ? `${blog.author} · ` : ''}{blog.reading_time || '5 min read'}
                  </p>
                  <h3 className="text-base font-semibold text-white leading-snug group-hover:opacity-70 transition-opacity line-clamp-2">
                    {blog.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <ProSmartEnergyFooter />
    </div>
  );
}

interface DetailProps { blog: BlogWithContent; relatedPosts: DbBlog[]; siteKey: string; }

export function ProSmartEnergyDetail({ blog, relatedPosts, siteKey }: DetailProps) {
  const content = blog.blog_content.map(b => ({ id: b.id, type: b.type, content: b.content, alt: b.alt || undefined }));
  return (
    <div className="min-h-screen" style={{ background: BG }}>
      <ProSmartEnergyHeader />

      {/* Hero image */}
      <div className="w-full h-72 md:h-96 overflow-hidden">
        <img src={blog.cover_image || '/placeholder.svg'} alt={blog.title} className="w-full h-full object-cover" style={{ opacity: 0.75 }} />
      </div>

      {/* Article body */}
      <div className="max-w-3xl mx-auto px-6 py-12 pb-20">
        <article className="rounded-2xl p-8 md:p-12 overflow-hidden" style={{ background: CARD_BG, border: '1px solid #1e2d24' }}>
          <Link to={`/${siteKey}/blogs`} className="inline-flex items-center gap-2 text-sm mb-6 transition-colors"
            style={{ color: '#4a6b58' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = '#4a6b58')}>
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <GreenPill label={blog.author || 'Prosmart Energy'} />
          <p className="text-xs mt-3 mb-4 break-words" style={{ color: '#4a6b58' }}>
            {format(new Date(blog.created_at), 'MMMM d, yyyy')} · {blog.reading_time || '5 min read'}
          </p>
          <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight mb-8 break-words">{blog.title}</h1>
          <div className="pt-6 overflow-hidden" style={{ borderTop: '1px solid #1e2d24' }}>
            <div className="[&_h2]:text-white [&_h2]:font-bold [&_h2]:text-xl [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:break-words [&_h3]:text-white [&_h3]:font-semibold [&_h3]:text-lg [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:break-words [&_p]:leading-relaxed [&_p]:mb-4 [&_p]:break-words [&_img]:rounded-lg [&_img]:w-full" style={{ color: '#6b8f78' }}>
              <BlogContentRenderer content={content} />
            </div>
          </div>
        </article>

        {relatedPosts.length > 0 && (
          <section className="pt-14">
            <h2 className="text-2xl font-bold text-white mb-8">More Stories</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map(post => (
                <Link key={post.id} to={`/${siteKey}/blogs/${post.slug}`} className="group rounded-xl overflow-hidden"
                  style={{ background: CARD_BG, border: '1px solid #1e2d24' }}>
                  <img src={post.cover_image || '/placeholder.svg'} alt={post.title} className="w-full h-32 object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                  <div className="p-4">
                    <h3 className="font-semibold text-white/70 group-hover:text-white transition-colors line-clamp-2 text-sm break-words">{post.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
      <ProSmartEnergyFooter />
    </div>
  );
}
