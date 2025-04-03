import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Radio, MessageSquare, MapPin, Clock, RefreshCw, AlertTriangle, 
  Twitter, Facebook, Instagram, Phone, Rss, Send, Filter, ThumbsUp, MessageCircle 
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { timeAgo } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from '@/components/ui/label';

interface FeedItem {
  id: number;
  source: 'twitter' | 'facebook' | 'whatsapp' | 'call' | 'sms' | 'field';
  content: string;
  location?: string;
  timestamp: string; 
  user?: string;
  sentiment?: 'negative' | 'positive' | 'neutral';
  tags?: string[];
  verified?: boolean;
  engagement?: {
    likes?: number;
    comments?: number;
    shares?: number;
  };
}

export function RealTimeFeed() {
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [filteredFeed, setFilteredFeed] = useState<FeedItem[]>([]);
  const [activeSource, setActiveSource] = useState<string>('all');
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [newItems, setNewItems] = useState<number>(0);
  const feedContainerRef = useRef<HTMLDivElement>(null);
  
  // Sources for filtering
  const sources = [
    { id: 'all', label: 'All Sources', icon: <Rss className="h-3.5 w-3.5" /> },
    { id: 'twitter', label: 'Twitter', icon: <Twitter className="h-3.5 w-3.5" /> },
    { id: 'facebook', label: 'Facebook', icon: <Facebook className="h-3.5 w-3.5" /> },
    { id: 'whatsapp', label: 'WhatsApp', icon: <MessageCircle className="h-3.5 w-3.5" /> },
    { id: 'call', label: 'Call Center', icon: <Phone className="h-3.5 w-3.5" /> },
    { id: 'sms', label: 'SMS', icon: <Send className="h-3.5 w-3.5" /> },
    { id: 'field', label: 'Field Reports', icon: <Radio className="h-3.5 w-3.5" /> },
  ];
  
  // Sample data
  const sampleFeedItems: FeedItem[] = [
    {
      id: 1,
      source: 'twitter',
      content: 'Multiple gunshots heard near the market in Maiduguri. People are running for safety. #Borno #Security',
      location: 'Maiduguri, Borno',
      timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
      user: '@securityAlert',
      sentiment: 'negative',
      tags: ['violence', 'gunshots', 'borno'],
      verified: false,
      engagement: {
        likes: 28,
        comments: 15,
        shares: 42
      }
    },
    {
      id: 2,
      source: 'facebook',
      content: 'Parents are advised to keep children home from school tomorrow in Zaria due to credible threat information received.',
      location: 'Zaria, Kaduna',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      user: 'Zaria Community Watch',
      sentiment: 'negative',
      tags: ['school', 'threat', 'kaduna'],
      verified: true,
      engagement: {
        likes: 156,
        comments: 48,
        shares: 203
      }
    },
    {
      id: 3,
      source: 'call',
      content: 'Caller reports suspicious movement of armed persons at the edge of town. Local authorities notified.',
      location: 'Damaturu, Yobe',
      timestamp: new Date(Date.now() - 1000 * 60 * 28).toISOString(),
      sentiment: 'negative',
      verified: true
    },
    {
      id: 4,
      source: 'whatsapp',
      content: 'WhatsApp group "Peace Monitors" reports tensions rising between herders and farmers near Wase after cattle allegedly destroyed crops.',
      location: 'Wase, Plateau',
      timestamp: new Date(Date.now() - 1000 * 60 * 47).toISOString(),
      sentiment: 'negative',
      tags: ['herder-farmer', 'conflict', 'plateau'],
      verified: false
    },
    {
      id: 5,
      source: 'field',
      content: 'Peace meeting between community leaders in Takum successfully deescalated tensions following property dispute.',
      location: 'Takum, Taraba',
      timestamp: new Date(Date.now() - 1000 * 60 * 58).toISOString(),
      user: 'Field Officer Mahmoud',
      sentiment: 'positive',
      tags: ['peace', 'dialogue', 'success'],
      verified: true
    },
    {
      id: 6,
      source: 'sms',
      content: 'Road blockade reported on Maiduguri-Damaturu highway. Travelers advised to use alternative routes.',
      location: 'Borno-Yobe Border',
      timestamp: new Date(Date.now() - 1000 * 60 * 72).toISOString(),
      sentiment: 'neutral',
      tags: ['transport', 'road', 'travel'],
      verified: false
    },
    {
      id: 7,
      source: 'twitter',
      content: 'Large military convoy seen moving towards Sambisa. Possible operation underway. #BornoState',
      location: 'Konduga, Borno',
      timestamp: new Date(Date.now() - 1000 * 60 * 85).toISOString(),
      user: '@NorthEastUpdates',
      sentiment: 'neutral',
      tags: ['military', 'operations', 'borno'],
      verified: false,
      engagement: {
        likes: 76,
        comments: 22,
        shares: 54
      }
    }
  ];
  
  // Load feed and simulate real-time updates
  useEffect(() => {
    setIsLoading(true);
    
    // Initial load
    setTimeout(() => {
      setFeed(sampleFeedItems);
      setFilteredFeed(sampleFeedItems);
      setIsLoading(false);
    }, 1000);
    
    // Simulate real-time updates if auto-refresh is on
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(() => {
        // 30% chance of new data every 45 seconds
        if (Math.random() < 0.3) {
          const newItem: FeedItem = {
            id: Date.now(),
            source: ['twitter', 'facebook', 'whatsapp', 'call', 'sms', 'field'][Math.floor(Math.random() * 6)] as any,
            content: [
              'Protests reported outside government offices in Kano. Crowds estimated at 200 people. Situation peaceful but tense.',
              'Community leaders in Sokoto announce successful mediation between rival youth groups. Violence averted.',
              'Unusual military movement reported near border with Niger Republic. Locals concerned about possible operations.',
              'Market closed early in Jos due to rumors of potential unrest. Police increased presence in the area.',
              'Flash flooding reported in Lokoja affecting residential areas. Some families evacuating homes.'
            ][Math.floor(Math.random() * 5)],
            location: ['Kano', 'Sokoto', 'Jos', 'Lokoja', 'Birnin Kebbi'][Math.floor(Math.random() * 5)],
            timestamp: new Date().toISOString(),
            sentiment: ['negative', 'positive', 'neutral'][Math.floor(Math.random() * 3)] as any,
            verified: Math.random() > 0.5
          };
          
          setNewItems(prev => prev + 1);
          
          // In auto-scroll mode, add the item directly
          if (activeSource === 'all' || activeSource === newItem.source) {
            setFeed(prev => [newItem, ...prev]);
            setFilteredFeed(prev => [newItem, ...prev.slice(0, 19)]); // Keep max 20 items
          }
        }
      }, 45000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, activeSource]);
  
  // Apply filters when source changes
  useEffect(() => {
    if (activeSource === 'all') {
      setFilteredFeed(feed);
    } else {
      setFilteredFeed(feed.filter(item => item.source === activeSource));
    }
    
    // Reset new item count when switching tab
    setNewItems(0);
    
    // Scroll to top when changing source
    if (feedContainerRef.current) {
      feedContainerRef.current.scrollTop = 0;
    }
  }, [activeSource, feed]);
  
  // Apply content filters
  useEffect(() => {
    let filtered = activeSource === 'all' ? feed : feed.filter(item => item.source === activeSource);
    
    if (activeFilters.includes('verified')) {
      filtered = filtered.filter(item => item.verified);
    }
    
    if (activeFilters.includes('negative')) {
      filtered = filtered.filter(item => item.sentiment === 'negative');
    }
    
    if (activeFilters.includes('last-hour')) {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      filtered = filtered.filter(item => item.timestamp >= oneHourAgo);
    }
    
    setFilteredFeed(filtered);
  }, [activeFilters, feed, activeSource]);
  
  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'twitter': return <Twitter className="h-3.5 w-3.5 text-blue-400" />;
      case 'facebook': return <Facebook className="h-3.5 w-3.5 text-blue-600" />;
      case 'whatsapp': return <MessageCircle className="h-3.5 w-3.5 text-green-500" />;
      case 'call': return <Phone className="h-3.5 w-3.5 text-orange-500" />;
      case 'sms': return <Send className="h-3.5 w-3.5 text-purple-500" />;
      case 'field': return <Radio className="h-3.5 w-3.5 text-red-500" />;
      default: return <MessageSquare className="h-3.5 w-3.5" />;
    }
  };
  
  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'negative': return 'bg-red-100 text-red-700 border-red-200';
      case 'positive': return 'bg-green-100 text-green-700 border-green-200';
      case 'neutral': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };
  
  const handleFilterToggle = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };
  
  const loadNewItems = () => {
    setNewItems(0);
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b bg-blue-50">
        <CardTitle className="text-base font-medium flex items-center text-blue-900">
          <Rss className="h-4 w-4 mr-2 text-blue-700" />
          Real-Time Feed
          {newItems > 0 && (
            <Badge variant="destructive" className="ml-2 animate-pulse h-5 text-xs">{newItems} new</Badge>
          )}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-7 w-7 ${autoRefresh ? 'text-green-600 bg-green-50' : 'text-gray-400'}`}
            onClick={() => setAutoRefresh(!autoRefresh)}
            title={autoRefresh ? 'Auto-refresh on' : 'Auto-refresh off'}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 text-xs flex gap-1">
                <Filter className="h-3.5 w-3.5" />
                Filter
                {activeFilters.length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-4 text-[10px] px-1">
                    {activeFilters.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-52 p-3" align="end">
              <h4 className="font-medium text-sm mb-2">Filter Feed</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="filter-verified" 
                    checked={activeFilters.includes('verified')}
                    onCheckedChange={() => handleFilterToggle('verified')}
                  />
                  <Label htmlFor="filter-verified" className="text-xs">Verified only</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="filter-negative" 
                    checked={activeFilters.includes('negative')}
                    onCheckedChange={() => handleFilterToggle('negative')}
                  />
                  <Label htmlFor="filter-negative" className="text-xs">Negative sentiment</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="filter-last-hour" 
                    checked={activeFilters.includes('last-hour')}
                    onCheckedChange={() => handleFilterToggle('last-hour')}
                  />
                  <Label htmlFor="filter-last-hour" className="text-xs">Last hour only</Label>
                </div>
                
                {activeFilters.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full mt-2 text-xs h-7"
                    onClick={() => setActiveFilters([])}
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      
      <div className="border-b">
        <Tabs defaultValue="all" value={activeSource} onValueChange={setActiveSource}>
          <TabsList className="w-full h-auto py-1 bg-white flex justify-start overflow-auto">
            {sources.map(source => (
              <TabsTrigger 
                key={source.id} 
                value={source.id}
                className="text-xs py-1.5 flex items-center gap-1.5 data-[state=active]:bg-blue-50"
              >
                {source.icon}
                {source.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      
      <CardContent className="p-0">
        {isLoading ? (
          <div className="h-[400px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
          </div>
        ) : newItems > 0 ? (
          <div className="p-2 bg-blue-50 flex justify-center border-b">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs w-full bg-white"
              onClick={loadNewItems}
            >
              Load {newItems} new {newItems === 1 ? 'item' : 'items'}
            </Button>
          </div>
        ) : null}
        
        <div className="divide-y divide-neutral-100 max-h-[400px] overflow-auto" ref={feedContainerRef}>
          {filteredFeed.length === 0 ? (
            <div className="py-8 text-center text-neutral-500">
              <p>No feed items match the current filters</p>
              {activeFilters.length > 0 && (
                <Button 
                  variant="link" 
                  size="sm" 
                  className="mt-2 text-xs"
                  onClick={() => setActiveFilters([])}
                >
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            filteredFeed.map((item) => (
              <div 
                key={item.id}
                className="p-3 hover:bg-neutral-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <div className="h-7 w-7 flex items-center justify-center bg-gray-100 rounded-full">
                      {getSourceIcon(item.source)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        {item.user && (
                          <span className="font-medium text-xs text-neutral-700 mr-2">{item.user}</span>
                        )}
                        {item.verified && (
                          <Badge 
                            variant="outline"
                            className="h-4 text-[10px] px-1 bg-green-50 text-green-700 border-green-200"
                          >
                            Verified
                          </Badge>
                        )}
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`${getSentimentColor(item.sentiment)} h-4 text-[10px] px-1`}
                      >
                        {item.sentiment || 'neutral'}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-neutral-700 mb-1">{item.content}</p>
                    
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500">
                      {item.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{item.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{timeAgo(new Date(item.timestamp))}</span>
                      </div>
                      
                      {item.engagement && (
                        <div className="flex items-center gap-2">
                          {item.engagement.likes && (
                            <div className="flex items-center gap-1">
                              <ThumbsUp className="h-3 w-3" />
                              <span>{item.engagement.likes}</span>
                            </div>
                          )}
                          {item.engagement.comments && (
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              <span>{item.engagement.comments}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {item.tags.map((tag, idx) => (
                          <Badge 
                            key={idx}
                            variant="outline" 
                            className="h-4 text-[10px] px-1 bg-blue-50 text-blue-700 border-blue-200"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}