// ─── ProSmart Energy Theme ────────────────────────────────────────────────────

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { DbBlog, BlogWithContent, SITE_CATEGORIES } from '@/types/database';
import { BlogContentRenderer } from '../BlogContent';
import prosmartLogo from '@/assets/prosmart-logo.png';

const BG = '#0b1510';
const CARD_BG = '#101d17';
const GREEN = '#22c55e';
const TEXT_PRIMARY = '#e2f0e8';    // bright near-white with green tint
const TEXT_SECONDARY = '#9dbfaa';  // readable muted green-grey
const TEXT_DIM = '#6b9e7d';        // dimmer but still visible

function GreenPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full"
      style={{ background: 'rgba(34,197,94,0.15)', color: GREEN, border: '1px solid rgba(34,197,94,0.3)' }}>
      {label}
    </span>
  );
}

export function ProSmartEnergyHeader() {
  return (
    <header className="border-b sticky top-0 z-50" style={{ background: BG, borderColor: '#1e2d24' }}>
      <div className="max-w-6xl mx-auto px-8 py-3 flex items-center justify-between">
        <Link to="/prosmart-energy/blogs">
          <img src={prosmartLogo} alt="Prosmart Energy" className="h-9 w-auto object-contain" />
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm" style={{ color: TEXT_SECONDARY }}>
          <Link to="/prosmart-energy/blogs" className="hover:text-white transition-colors font-medium">Blog</Link>
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
        <span className="text-xs" style={{ color: TEXT_DIM }}>© {new Date().getFullYear()} Probiz Technologies. All rights reserved.</span>
      </div>
    </footer>
  );
}

interface ListProps { blogs: DbBlog[]; isLoading: boolean; error: unknown; }

export function ProSmartEnergyList({ blogs, isLoading, error }: ListProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = SITE_CATEGORIES['prosmart-energy'];

  const filtered = activeCategory === 'All'
    ? blogs
    : blogs.filter(b => b.category === activeCategory);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="min-h-screen" style={{ background: BG }}>
      <ProSmartEnergyHeader />

      <div className="max-w-6xl mx-auto px-8 py-10">
        {isLoading && <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin" style={{ color: GREEN }} /></div>}
        {error && <p className="text-center py-16" style={{ color: '#f87171' }}>Failed to load posts.</p>}

        {/* Category pills — styled like the real site */}
        {!isLoading && !error && (
          <div className="flex flex-wrap gap-2 mb-12">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
                style={
                  activeCategory === cat
                    ? { background: GREEN, color: '#000', border: '1px solid transparent' }
                    : { background: 'transparent', color: TEXT_SECONDARY, border: '1px solid #2a4035' }
                }
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {!isLoading && !error && filtered.length === 0 && (
          <p className="text-center py-16 text-sm" style={{ color: TEXT_SECONDARY }}>No posts in this category yet.</p>
        )}

        {/* Featured hero card */}
        {!isLoading && !error && featured && (
          <Link
            to={`/prosmart-energy/blogs/${featured.slug}`}
            className="group flex flex-col md:flex-row gap-0 rounded-2xl overflow-hidden mb-14"
            style={{ background: CARD_BG, border: '1px solid #1e2d24' }}
          >
            <div className="flex-1 p-8 md:p-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-5 flex-wrap">
                  {featured.category
                    ? <GreenPill label={featured.category} />
                    : <GreenPill label="Featured" />
                  }
                  <GreenPill label="Case Studies" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white leading-snug group-hover:opacity-80 transition-opacity mb-4">
                  {featured.title}
                </h2>
                {featured.description && (
                  <p className="text-sm leading-relaxed mb-6" style={{ color: TEXT_SECONDARY }}>{featured.description}</p>
                )}
              </div>
              <div className="flex items-center gap-4 text-xs flex-wrap" style={{ color: TEXT_DIM }}>
                {featured.author && <span>{featured.author}</span>}
                <span>{format(new Date(featured.created_at), 'MMM d, yyyy')}</span>
                <span>{featured.reading_time || '5 min read'}</span>
              </div>
              <span className="mt-5 text-sm font-medium" style={{ color: GREEN }}>Read the story →</span>
            </div>
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
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={blog.cover_image || '/placeholder.svg'}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {blog.category && (
                    <span className="absolute bottom-3 left-3 text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded"
                      style={{ background: 'rgba(34,197,94,0.2)', color: GREEN, border: '1px solid rgba(34,197,94,0.3)' }}>
                      {blog.category}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <p className="text-xs uppercase tracking-widest mb-3" style={{ color: TEXT_SECONDARY }}>
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
      <div className="w-full h-72 md:h-96 overflow-hidden">
        <img src={blog.cover_image || '/placeholder.svg'} alt={blog.title} className="w-full h-full object-cover" style={{ opacity: 0.75 }} />
      </div>
      <div className="max-w-3xl mx-auto px-6 py-12 pb-20">
        <article className="rounded-2xl p-8 md:p-12 overflow-hidden" style={{ background: CARD_BG, border: '1px solid #1e2d24' }}>
          <Link to={`/${siteKey}/blogs`} className="inline-flex items-center gap-2 text-sm mb-6 transition-colors"
            style={{ color: TEXT_SECONDARY }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = TEXT_SECONDARY)}>
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            {blog.category && <GreenPill label={blog.category} />}
            {blog.author && <GreenPill label={blog.author} />}
          </div>
          <p className="text-xs mb-4 break-words" style={{ color: TEXT_DIM }}>
            {format(new Date(blog.created_at), 'MMMM d, yyyy')} · {blog.reading_time || '5 min read'}
          </p>
          <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight mb-8 break-words">{blog.title}</h1>
          <div className="pt-6 overflow-hidden" style={{ borderTop: '1px solid #1e2d24' }}>
            <div className="[&_h2]:text-white [&_h2]:font-bold [&_h2]:text-xl [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:break-words [&_h3]:text-white [&_h3]:font-semibold [&_h3]:text-lg [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:break-words [&_p]:text-white [&_p]:leading-relaxed [&_p]:mb-4 [&_p]:break-words [&_img]:rounded-lg [&_img]:w-full" style={{ color: TEXT_PRIMARY }}>
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
