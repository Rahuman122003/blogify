import { useParams, Link } from 'react-router-dom';
import { useBlogBySlug, usePublishedBlogs } from '@/hooks/useBlogs';
import { getSiteConfig, SiteKey } from '@/types/database';
import { Loader2 } from 'lucide-react';
import { ProbizConnectDetail } from '@/components/blog/themes/ProbizConnectTheme';
import { ProSmartEnergyDetail } from '@/components/blog/themes/ProSmartEnergyTheme';
import { ProbizRetailDetail } from '@/components/blog/themes/ProbizRetailTheme';
import { BlynTechDetail } from '@/components/blog/themes/BlynTechTheme';

export default function BlogDetail() {
  const { site, slug } = useParams<{ site: string; slug: string }>();
  const siteKey = site as SiteKey;
  const siteConfig = getSiteConfig(siteKey);

  const { data: blog, isLoading, error } = useBlogBySlug(slug || '', siteKey);
  const { data: allBlogs = [] } = usePublishedBlogs(siteKey);
  const relatedPosts = allBlogs.filter(b => b.id !== blog?.id).slice(0, 3);

  if (!siteConfig) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-3xl font-bold mb-4">Site Not Found</h1>
          <Link to="/" className="text-primary hover:underline">← Back to Home</Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="font-serif text-3xl font-bold mb-4">Post Not Found</h1>
          <Link to={`/${siteKey}/blogs`} className="text-primary hover:underline">← Back to posts</Link>
        </div>
      </div>
    );
  }

  const props = { blog, relatedPosts, siteKey };

  switch (siteKey) {
    case 'probiz-connect':  return <ProbizConnectDetail {...props} />;
    case 'prosmart-energy': return <ProSmartEnergyDetail {...props} />;
    case 'probiz-retail':   return <ProbizRetailDetail {...props} />;
    case 'blyn-tech':       return <BlynTechDetail {...props} />;
    default:                return <ProbizConnectDetail {...props} />;
  }
}
