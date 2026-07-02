// ─── BLYN Tech Theme ─────────────────────────────────────────────────────────

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { DbBlog, BlogWithContent, SITE_CATEGORIES } from '@/types/database';
import { BlogContentRenderer } from '../BlogContent';
import blynLogo from '@/assets/blyn-logo.png';

export function BlynTechHeader() {
  return (
    <header className="bg-[#0e0e10] border-b border-white/8 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-8 py-3 flex items-center justify-between">
        <Link to="/blyn-tech/blogs">
          <img src={blynLogo} alt="BLYN" className="h-10 w-auto object-contain" />
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-white/50">
          <Link to="/blyn-tech/blogs" className="hover:text-white transition-colors font-medium">Insights</Link>
        </nav>
      </div>
    </header>
  );
}

export function BlynTechFooter() {
  return (
    <footer className="bg-[#0e0e10] border-t border-white/8 py-10 mt-20">
      <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <img src={blynLogo} alt="BLYN" className="h-8 w-auto object-contain" />
        <span className="text-xs text-white/30">© {new Date().getFullYear()} Probiz Technologies. All rights reserved.</span>
      </div>
    </footer>
  );
}

interface ListProps { blogs: DbBlog[]; isLoading: boolean; error: unknown; }

export function BlynTechList({ blogs, isLoading, error }: ListProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = SITE_CATEGORIES['blyn-tech'];

  const filtered = activeCategory === 'All'
    ? blogs
    : blogs.filter(b => b.category === activeCategory);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="min-h-screen" style={{ background: '#0e0e10' }}>
      <BlynTechHeader />

      <div className="max-w-6xl mx-auto px-8 py-16">
        {isLoading && <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-white/30" /></div>}
        {error && <p className="text-center text-red-400 py-16">Failed to load posts.</p>}

        {/* Category pills — minimal dark style */}
        {!isLoading && !error && (
          <div className="flex flex-wrap gap-2 mb-14">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-white text-black'
                    : 'bg-transparent text-white/40 border border-white/10 hover:border-white/30 hover:text-white/70'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {!isLoading && !error && filtered.length === 0 && (
          <p className="text-center text-white/30 py-16 text-sm">No posts in this category yet.</p>
        )}

        {/* Featured hero */}
        {!isLoading && !error && featured && (
          <Link
            to={`/blyn-tech/blogs/${featured.slug}`}
            className="group flex flex-col md:flex-row gap-8 mb-16 pb-16 border-b border-white/8"
          >
            <div className="flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <p className="text-xs text-white/30 uppercase tracking-widest">
                  {format(new Date(featured.created_at), 'MMM d, yyyy')} · {featured.reading_time || '5 min read'}
                </p>
                {featured.category && (
                  <span className="text-xs font-semibold text-white/50 border border-white/10 rounded-full px-3 py-0.5 uppercase tracking-wider">
                    {featured.category}
                  </span>
                )}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-snug group-hover:text-white/80 transition-colors mb-4">
                {featured.title}
              </h2>
              {featured.description && (
                <p className="text-white/40 text-base leading-relaxed mb-6 max-w-md">{featured.description}</p>
              )}
              <span className="text-sm text-white/50 group-hover:text-white/80 transition-colors">Read essay ↗</span>
            </div>
            <div className="md:w-[420px] shrink-0 rounded-2xl overflow-hidden bg-white/5 h-64 md:h-auto">
              <img
                src={featured.cover_image || '/placeholder.svg'}
                alt={featured.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
              />
            </div>
          </Link>
        )}

        {/* Grid */}
        {!isLoading && !error && rest.length > 0 && (
          <>
            <div className="mb-8">
              <p className="text-xs text-white/30 uppercase tracking-widest mb-2">Library</p>
              <h3 className="text-2xl font-bold text-white">More from the team.</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {rest.map(blog => (
                <Link key={blog.id} to={`/blyn-tech/blogs/${blog.slug}`} className="group">
                  <div className="rounded-xl overflow-hidden bg-white/5 h-48 mb-4 relative">
                    <img
                      src={blog.cover_image || '/placeholder.svg'}
                      alt={blog.title}
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    />
                    {blog.category && (
                      <span className="absolute top-3 left-3 text-xs font-semibold text-white/70 border border-white/20 rounded-full px-3 py-1 bg-black/30 backdrop-blur-sm uppercase tracking-wider">
                        {blog.category}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/30 uppercase tracking-widest mb-2">
                    {blog.author ? `${blog.author} · ` : ''}{blog.reading_time || '5 min read'}
                  </p>
                  <h3 className="text-base font-semibold text-white/80 group-hover:text-white transition-colors leading-snug line-clamp-2">
                    {blog.title}
                  </h3>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
      <BlynTechFooter />
    </div>
  );
}

interface DetailProps { blog: BlogWithContent; relatedPosts: DbBlog[]; siteKey: string; }

export function BlynTechDetail({ blog, relatedPosts, siteKey }: DetailProps) {
  const content = blog.blog_content.map(b => ({ id: b.id, type: b.type, content: b.content, alt: b.alt || undefined }));
  return (
    <div className="min-h-screen" style={{ background: '#0e0e10' }}>
      <BlynTechHeader />
      <div className="w-full h-72 md:h-96 overflow-hidden">
        <img src={blog.cover_image || '/placeholder.svg'} alt={blog.title} className="w-full h-full object-cover opacity-60" />
      </div>
      <div className="max-w-3xl mx-auto px-6 py-12 pb-20">
        <article className="bg-[#16161c] rounded-2xl border border-white/8 p-8 md:p-12 overflow-hidden">
          <Link to={`/${siteKey}/blogs`} className="inline-flex items-center gap-2 text-sm text-white/30 hover:text-white/70 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            {blog.category && (
              <span className="text-xs font-semibold text-white/50 border border-white/10 rounded-full px-3 py-1 uppercase tracking-wider">
                {blog.category}
              </span>
            )}
            <p className="text-xs text-white/30 uppercase tracking-widest break-words">
              {format(new Date(blog.created_at), 'MMMM d, yyyy')} · {blog.reading_time || '5 min read'}
            </p>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight mb-5 break-words">{blog.title}</h1>
          {blog.author && (
            <p className="text-white/30 text-sm mb-8">By <span className="text-white/60 font-medium">{blog.author}</span></p>
          )}
          <div className="border-t border-white/8 pt-8 [&_h2]:text-white [&_h2]:font-bold [&_h2]:text-xl [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:break-words [&_h3]:text-white/80 [&_h3]:font-semibold [&_h3]:text-lg [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:break-words [&_p]:text-white/50 [&_p]:leading-relaxed [&_p]:mb-4 [&_p]:break-words [&_img]:rounded-lg [&_img]:w-full">
            <BlogContentRenderer content={content} />
          </div>
        </article>
        {relatedPosts.length > 0 && (
          <section className="pt-14">
            <p className="text-xs text-white/30 uppercase tracking-widest mb-2">Library</p>
            <h2 className="text-2xl font-bold text-white mb-8">More from the team.</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map(post => (
                <Link key={post.id} to={`/${siteKey}/blogs/${post.slug}`} className="group">
                  <div className="rounded-xl overflow-hidden h-36 bg-white/5 mb-3">
                    <img src={post.cover_image || '/placeholder.svg'} alt={post.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-opacity" />
                  </div>
                  <h3 className="font-semibold text-white/60 group-hover:text-white transition-colors line-clamp-2 text-sm break-words">{post.title}</h3>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
      <BlynTechFooter />
    </div>
  );
}
