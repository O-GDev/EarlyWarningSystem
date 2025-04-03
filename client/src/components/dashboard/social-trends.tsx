import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { Facebook, Twitter, Instagram, Video, ExternalLink, AlertCircle } from 'lucide-react';
import { Link } from 'wouter';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

function getPlatformIcon(platform: string) {
  switch (platform.toLowerCase()) {
    case 'twitter':
      return <Twitter className="h-4 w-4" />;
    case 'facebook':
      return <Facebook className="h-4 w-4" />;
    case 'instagram':
      return <Instagram className="h-4 w-4" />;
    case 'tiktok':
      return <Video className="h-4 w-4" />;
    default:
      return <ExternalLink className="h-4 w-4" />;
  }
}

function getProgressColor(sentiment: number | null | undefined) {
  if (sentiment === null || sentiment === undefined) return 'bg-neutral-300';
  if (sentiment < -0.6) return 'bg-accent';
  if (sentiment < -0.2) return 'bg-secondary';
  if (sentiment < 0.2) return 'bg-neutral-400';
  if (sentiment < 0.6) return 'bg-secondary-light';
  return 'bg-green-500';
}

function TrendingTopics({ topics }: { topics: any[] }) {
  if (!topics || topics.length === 0) {
    return (
      <div className="space-y-4 p-4 text-center text-neutral-500">
        No trending topics found
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {topics.slice(0, 3).map((topic, index) => (
        <div key={index} className="flex items-center">
          <div className="w-full bg-neutral-100 rounded-full h-2.5 mr-2">
            <div
              className={`${getProgressColor(topic.sentiment)} h-2.5 rounded-full`}
              style={{ width: `${Math.min(100, Math.abs(topic.volume / 10))}%` }}
            ></div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">{topic.keyword}</span>
            {getPlatformIcon(topic.platform)}
          </div>
        </div>
      ))}
    </div>
  );
}

function CriticalMentions({ mentions }: { mentions: any[] }) {
  if (!mentions || mentions.length === 0) {
    return (
      <div className="space-y-4 p-4 text-center text-neutral-500">
        No critical mentions found
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {mentions.slice(0, 2).map((mention, index) => (
        <div key={index} className="bg-neutral-50 p-3 rounded">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center gap-1">
              {getPlatformIcon(mention.platform)}
              {mention.keyword}
            </span>
            <span className="text-xs text-neutral-500">
              {new Date(mention.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm text-neutral-600 mt-1 line-clamp-2">
            Sentiment: {mention.sentiment < -0.5 ? 'Very Negative' : mention.sentiment < 0 ? 'Negative' : 'Neutral'}
          </p>
          <div className="flex items-center mt-2">
            <span className="text-xs text-accent mr-3 flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              {mention.sentiment < -0.7 ? 'High Risk' : 'Medium Risk'}
            </span>
            <button className="text-xs text-primary">View Details</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function SocialTrendsLoading() {
  return (
    <>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="space-y-3">
          <div className="flex items-center">
            <Skeleton className="w-full h-2.5 mr-2 rounded-full" />
            <Skeleton className="h-5 w-24" />
          </div>
          <div className="flex items-center">
            <Skeleton className="w-full h-2.5 mr-2 rounded-full" />
            <Skeleton className="h-5 w-24" />
          </div>
          <div className="flex items-center">
            <Skeleton className="w-full h-2.5 mr-2 rounded-full" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>
      </div>
      
      <div className="border-t border-neutral-100 pt-4 mt-4">
        <Skeleton className="h-5 w-32 mb-3" />
        <div className="space-y-3">
          <Skeleton className="h-24 w-full rounded" />
          <Skeleton className="h-24 w-full rounded" />
        </div>
      </div>
    </>
  );
}

export default function SocialTrends() {
  const { data: socialTrends, isLoading } = useQuery({
    queryKey: ['/api/social-trends'],
    staleTime: 60000, // 1 minute
  });

  // Define a string to use as the active platform
  const activePlatform = 'instagram';

  return (
    <Card className="bg-white rounded-lg shadow-sm h-full flex flex-col">
      <CardHeader className="p-4 border-b border-neutral-100 flex flex-row justify-between items-center">
        <CardTitle className="text-lg font-medium">Social Media Trends</CardTitle>
        <div className="flex space-x-2">
          {/* Hardcode the classes since we know which platform is active */}
          <Button variant="ghost" size="icon" className="p-1 text-neutral-400 hover:text-primary">
            <Twitter className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="p-1 text-neutral-400 hover:text-primary">
            <Facebook className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="p-1 text-primary">
            <Instagram className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="p-1 text-neutral-400 hover:text-primary">
            <Video className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow overflow-auto">
        {isLoading ? (
          <SocialTrendsLoading />
        ) : (
          <>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">Trending Topics</h4>
                <span className="text-xs text-neutral-500">Last 24 hours</span>
              </div>
              <TrendingTopics topics={Array.isArray(socialTrends) ? socialTrends : []} />
            </div>
            
            <div className="border-t border-neutral-100 pt-4 mt-4">
              <h4 className="font-medium text-sm mb-3">Critical Mentions</h4>
              <CriticalMentions mentions={Array.isArray(socialTrends) ? socialTrends : []} />
            </div>
          </>
        )}
      </CardContent>
      <div className="p-3 border-t border-neutral-100 text-center">
        <Link href="/social-monitoring">
          <a className="text-primary hover:underline text-sm">View All Social Media Data</a>
        </Link>
      </div>
    </Card>
  );
}
