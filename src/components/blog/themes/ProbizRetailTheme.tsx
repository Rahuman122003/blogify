// ─── Probiz Retail Theme ─────────────────────────────────────────────────────

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { DbBlog, BlogWithContent, SITE_CATEGORIES } from '@/types/database';
import { BlogContentRenderer } from '../BlogContent';
import probizRetailLogo from '@/assets/probiz-retail-logo.png';

export function ProbizRetailHeader() {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-8 py-3 flex items-center justify-between">
        <Link to="/probiz-retail/blogs">
          <img src={probizRetailLogo} alt="Probiz Retail" className="h-9 w-auto object-contain" />
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          <Link to="/probiz-retail/blogs" className="hover:text-gray-900 transition-colors font-medium">Blog</Link>
        </nav>
      </div>
    </header>
  );
}

export function ProbizRetailFooter() {
  return (
    <footer className="bg-white border-t border-gray-100 py-10 mt-20">
      <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <img src={probizRetailLogo} alt="Probiz Retail" className="h-7 w-auto object-contain" />
        <span className="text-xs text-gray-400">© {new Date().getFullYear()} Probiz Technologies. All rights reserved.</span>
      </div>
    </footer>
  );
}

interface ListProps { blogs: DbBlog[]; isLoading: boolean; error: unknown; }

export function ProbizRetailList({ blogs, isLoading, error }: ListProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = SITE_CATEGORIES['probiz-retail'];

  const filtered = activeCategory === 'All'
    ? blogs
    : blogs.filter(b => b.category === activeCategory);

  return (
    <div className="min-h-screen bg-white">
      <ProbizRetailHeader />

      {/* Mesh gradient hero */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 20% 60%, #dbeafe 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 30%, #f3e8ff 0%, transparent 55%), radial-gradient(ellipse 70% 70% at 50% 50%, #fce7f3 0%, transparent 70%), linear-gradient(180deg, #f8faff 0%, #f5f0ff 50%, #fdf4ff 100%)',
        }}
      >
        <div className="max-w-4xl mx-auto px-8 pt-16 pb-20 text-center">
          <div className="inline-flex items-center border border-gray-200 bg-white/60 backdrop-blur-sm rounded-full px-4 py-1.5 mb-10">
            <span className="text-xs text-gray-500 font-medium">Press</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold text-gray-900 leading-tight mb-2">Probiz in</h1>
          <h1 className="text-6xl md:text-8xl font-bold leading-tight mb-6"
            style={{ fontStyle: 'italic', fontFamily: 'Georgia, serif', background: 'linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            the news.
          </h1>
          <p className="text-gray-400 text-base max-w-sm mx-auto">Media coverage, press releases, and brand assets for journalists.</p>
        </div>
      </div>

      {/* Category pills */}
      <div className="max-w-3xl mx-auto px-8 pt-8 pb-2">
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                activeCategory === cat
                  ? 'bg-violet-600 text-white border-transparent'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-violet-300 hover:text-violet-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Article list */}
      <div className="max-w-3xl mx-auto px-8 py-10">
        {isLoading && <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-violet-400" /></div>}
        {error && <p className="text-center text-red-500 py-16">Failed to load posts.</p>}
        {!isLoading && !error && filtered.length === 0 && (
          <p className="text-center text-gray-400 py-16 text-sm">No posts in this category yet.</p>
        )}
        {!isLoading && !error && filtered.length > 0 && (
          <div className="divide-y divide-gray-100">
            {filtered.map(blog => (
              <Link
                key={blog.id}
                to={`/probiz-retail/blogs/${blog.slug}`}
                className="group block py-9 first:pt-0"
              >
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  {blog.category && (
                    <span className="text-xs font-semibold bg-violet-50 text-violet-600 px-3 py-1 rounded-full border border-violet-100">
                      {blog.category}
                    </span>
                  )}
                  <span className="text-sm font-semibold text-violet-600">{blog.author || 'Probiz Retail'}</span>
                  <span className="text-gray-300 text-sm">→</span>
                  <span className="text-sm text-gray-400">{format(new Date(blog.created_at), 'MMM yyyy')}</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 leading-snug group-hover:text-violet-700 transition-colors mb-2">
                  {blog.title}
                </h2>
                {blog.description && (
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{blog.description}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
      <ProbizRetailFooter />
    </div>
  );
}

interface DetailProps { blog: BlogWithContent; relatedPosts: DbBlog[]; siteKey: string; }

export function ProbizRetailDetail({ blog, relatedPosts, siteKey }: DetailProps) {
  const content = blog.blog_content.map(b => ({ id: b.id, type: b.type, content: b.content, alt: b.alt || undefined }));
  return (
    <div className="min-h-screen bg-white">
      <ProbizRetailHeader />
      <div className="w-full h-72 md:h-96 overflow-hidden">
        <img src={blog.cover_image || '/placeholder.svg'} alt={blog.title} className="w-full h-full object-cover" />
      </div>
      <div className="max-w-3xl mx-auto px-6 py-12 pb-20">
        <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 overflow-hidden">
          <Link to={`/${siteKey}/blogs`} className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to posts
          </Link>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {blog.category && (
              <span className="text-xs font-semibold bg-violet-50 text-violet-600 px-3 py-1 rounded-full border border-violet-100">
                {blog.category}
              </span>
            )}
            <span className="text-sm font-semibold text-violet-600">{blog.author || 'Probiz Retail'}</span>
            <span className="text-gray-300">→</span>
            <span className="text-sm text-gray-400">{format(new Date(blog.created_at), 'MMMM d, yyyy')}</span>
            <span className="text-gray-300">·</span>
            <span className="text-sm text-gray-400">{blog.reading_time || '5 min read'}</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight mb-8 break-words">{blog.title}</h1>
          <div className="border-t border-gray-100 pt-8 [&_h2]:text-gray-900 [&_h2]:font-bold [&_h2]:text-xl [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:break-words [&_h3]:text-gray-800 [&_h3]:font-semibold [&_h3]:text-lg [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:break-words [&_p]:text-gray-600 [&_p]:leading-relaxed [&_p]:mb-4 [&_p]:break-words [&_img]:rounded-xl [&_img]:w-full">
            <BlogContentRenderer content={content} />
          </div>
        </article>
        {relatedPosts.length > 0 && (
          <section className="pt-14">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Continue Reading</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map(post => (
                <Link key={post.id} to={`/${siteKey}/blogs/${post.slug}`} className="group">
                  <img src={post.cover_image || '/placeholder.svg'} alt={post.title} className="w-full h-36 object-cover rounded-xl mb-3 group-hover:opacity-90 transition-opacity" />
                  <h3 className="font-semibold text-gray-800 group-hover:text-violet-600 transition-colors line-clamp-2 text-sm break-words">{post.title}</h3>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
      <ProbizRetailFooter />
    </div>
  );
}
