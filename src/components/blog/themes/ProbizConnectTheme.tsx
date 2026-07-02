// ─── Probiz Connect Theme ────────────────────────────────────────────────────

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { DbBlog, BlogWithContent, SITE_CATEGORIES } from '@/types/database';
import { BlogContentRenderer } from '../BlogContent';
import probizConnectLogo from '@/assets/probiz-connect-logo.png';

export function ProbizConnectHeader() {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/probiz-connect/blogs">
          <img src={probizConnectLogo} alt="ProbizConnect" className="h-9 w-auto object-contain" />
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-gray-500">
          <Link to="/probiz-connect/blogs" className="hover:text-gray-900 transition-colors font-medium">Blogs</Link>
        </nav>
      </div>
    </header>
  );
}

export function ProbizConnectFooter() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 py-10 mt-20">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <img src={probizConnectLogo} alt="ProbizConnect" className="h-7 w-auto object-contain" />
        <span className="text-xs text-gray-400">© {new Date().getFullYear()} Probiz Technologies. All rights reserved.</span>
      </div>
    </footer>
  );
}

interface ListProps { blogs: DbBlog[]; isLoading: boolean; error: unknown; }

export function ProbizConnectList({ blogs, isLoading, error }: ListProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = SITE_CATEGORIES['probiz-connect'];

  const filtered = activeCategory === 'All'
    ? blogs
    : blogs.filter(b => b.category === activeCategory);

  return (
    <div className="min-h-screen bg-white">
      <ProbizConnectHeader />

      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3">Insights & Updates</p>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            Transform Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Business</span>
          </h1>
          <p className="text-gray-500 mt-4 text-lg max-w-xl">News, insights and strategies from Probiz Connect.</p>
        </div>
      </div>

      {/* Category Pills */}
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-2">
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all border ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white border-transparent shadow-sm'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        {isLoading && <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-blue-400" /></div>}
        {error && <p className="text-center text-red-500 py-16">Failed to load posts.</p>}
        {!isLoading && !error && filtered.length === 0 && (
          <p className="text-center text-gray-400 py-16">No posts in this category yet.</p>
        )}
        {!isLoading && !error && filtered.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(blog => (
              <Link
                key={blog.id}
                to={`/probiz-connect/blogs/${blog.slug}`}
                className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="h-48 overflow-hidden bg-gray-50 relative">
                  <img
                    src={blog.cover_image || '/placeholder.svg'}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {blog.category && (
                    <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {blog.category}
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <p className="text-xs text-blue-600 font-medium mb-2">
                    {format(new Date(blog.created_at), 'MMM d, yyyy')}
                    {blog.reading_time && ` · ${blog.reading_time}`}
                  </p>
                  <h2 className="font-bold text-gray-900 text-lg leading-snug group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                    {blog.title}
                  </h2>
                  {blog.description && (
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{blog.description}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <ProbizConnectFooter />
    </div>
  );
}

interface DetailProps { blog: BlogWithContent; relatedPosts: DbBlog[]; siteKey: string; }

export function ProbizConnectDetail({ blog, relatedPosts, siteKey }: DetailProps) {
  const content = blog.blog_content.map(b => ({ id: b.id, type: b.type, content: b.content, alt: b.alt || undefined }));
  return (
    <div className="min-h-screen bg-white">
      <ProbizConnectHeader />
      <div className="w-full h-72 md:h-96 overflow-hidden">
        <img src={blog.cover_image || '/placeholder.svg'} alt={blog.title} className="w-full h-full object-cover" />
      </div>
      <div className="max-w-3xl mx-auto px-6 py-12 pb-20">
        <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 overflow-hidden">
          <Link to={`/${siteKey}/blogs`} className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to posts
          </Link>
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            {blog.category && (
              <span className="text-xs font-semibold bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100">
                {blog.category}
              </span>
            )}
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest break-words">
              {format(new Date(blog.created_at), 'MMMM d, yyyy')} · {blog.reading_time || '5 min read'}
            </p>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight mb-5 break-words">{blog.title}</h1>
          {blog.author && (
            <p className="text-gray-400 text-sm mb-8">By <span className="text-gray-700 font-medium">{blog.author}</span></p>
          )}
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
                  <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm break-words">{post.title}</h3>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
      <ProbizConnectFooter />
    </div>
  );
}
