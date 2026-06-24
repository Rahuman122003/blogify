import { useParams, Link } from 'react-router-dom';
import { usePublishedBlogs } from '@/hooks/useBlogs';
import { getSiteConfig, SiteKey } from '@/types/database';
import { ProbizConnectList } from '@/components/blog/themes/ProbizConnectTheme';
import { ProSmartEnergyList } from '@/components/blog/themes/ProSmartEnergyTheme';
import { ProbizRetailList } from '@/components/blog/themes/ProbizRetailTheme';
import { BlynTechList } from '@/components/blog/themes/BlynTechTheme';

export default function BlogList() {
  const { site } = useParams<{ site: string }>();
  const siteKey = site as SiteKey;
  const siteConfig = getSiteConfig(siteKey);
  const { data: blogs = [], isLoading, error } = usePublishedBlogs(siteKey);

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

  const props = { blogs, isLoading, error: error ?? null };

  switch (siteKey) {
    case 'probiz-connect':   return <ProbizConnectList {...props} />;
    case 'prosmart-energy':  return <ProSmartEnergyList {...props} />;
    case 'probiz-retail':    return <ProbizRetailList {...props} />;
    case 'blyn-tech':        return <BlynTechList {...props} />;
    default:                 return <ProbizConnectList {...props} />;
  }
}
