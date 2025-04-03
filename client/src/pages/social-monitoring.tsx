import { useState } from 'react';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { useSidebar } from '@/contexts/sidebar-context';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend,
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  Area, 
  AreaChart
} from 'recharts';
import { 
  Search, 
  Filter, 
  Twitter, 
  Facebook, 
  Instagram, 
  Hash, 
  AlertTriangle, 
  ArrowUp, 
  ArrowDown,
  BarChart2,
  MapPin,
  MoreHorizontal,
  Plus,
  BellRing,
  Activity,
  TrendingUp,
  X,
  RefreshCw,
  AlertCircle,
  Hourglass,
  Send
} from 'lucide-react';

interface SocialTrend {
  id: number;
  platform: string;
  keyword: string;
  volume: number;
  sentiment: number;
  location?: string;
  source: string;
  createdAt: string;
  relatedIncidentTypes?: string[];
}

export default function SocialMonitoring() {
  const { isOpen } = useSidebar();
  const [platform, setPlatform] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeframe, setTimeframe] = useState('day');
  const [monitoringTab, setMonitoringTab] = useState('dashboard');
  const [selectedTrend, setSelectedTrend] = useState<SocialTrend | null>(null);
  const [keywordInput, setKeywordInput] = useState('');
  const [showAddKeywordDialog, setShowAddKeywordDialog] = useState(false);
  const { toast } = useToast();
  
  const { data: socialTrends = [], isLoading, refetch } = useQuery<SocialTrend[]>({
    queryKey: ['/api/social-trends'],
    staleTime: 60000, // 1 minute
  });

  const addKeywordMutation = useMutation({
    mutationFn: async (newKeyword: { keyword: string, platform: string }) => {
      return apiRequest('/api/social-trends/keywords', 'POST', newKeyword);
    },
    onSuccess: () => {
      toast({
        title: "Keyword added successfully",
        description: "The system will now monitor this keyword across social media platforms.",
      });
      setShowAddKeywordDialog(false);
      setKeywordInput('');
      // Refetch social trends to update the list
      queryClient.invalidateQueries({ queryKey: ['/api/social-trends'] });
    },
    onError: (error) => {
      toast({
        title: "Error adding keyword",
        description: "There was a problem adding the keyword. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  const createAlertMutation = useMutation({
    mutationFn: async (trend: SocialTrend) => {
      return apiRequest('/api/alerts', 'POST', {
        title: `Social Media Alert: ${trend.keyword}`,
        description: `High risk social media activity detected related to "${trend.keyword}" on ${trend.platform}. Sentiment score: ${trend.sentiment.toFixed(2)}, Volume: ${trend.volume}`,
        severity: trend.sentiment < -0.7 ? 'critical' : trend.sentiment < -0.5 ? 'high' : 'medium',
        source: 'social_monitoring',
        relatedIncidentId: null,
        status: 'active',
        sentTo: ['analyst', 'admin']
      });
    },
    onSuccess: () => {
      toast({
        title: "Alert created",
        description: "An alert has been created and sent to relevant personnel.",
      });
      // Refetch alerts
      queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
    },
    onError: (error) => {
      toast({
        title: "Error creating alert",
        description: "There was a problem creating the alert. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleAddKeyword = () => {
    if (!keywordInput.trim()) {
      toast({
        title: "Keyword required",
        description: "Please enter a keyword to monitor",
        variant: "destructive"
      });
      return;
    }
    
    addKeywordMutation.mutate({
      keyword: keywordInput,
      platform: platform === 'all' ? 'twitter' : platform  // Default to Twitter if "all platforms" is selected
    });
  };
  
  const handleCreateAlert = (trend: SocialTrend) => {
    createAlertMutation.mutate(trend);
  };
  
  const handleRefresh = () => {
    refetch();
    toast({
      title: "Refreshing data",
      description: "Social media data is being updated..."
    });
  };

  // Sample location data for the Geographic Analysis tab
  const locationData = [
    { name: 'North East', value: 340 },
    { name: 'North West', value: 210 },
    { name: 'North Central', value: 185 },
    { name: 'South West', value: 150 },
    { name: 'South East', value: 95 },
    { name: 'South South', value: 80 }
  ];
  
  // Sample realtime data for the line chart
  const realtimeData = [
    { time: '1h ago', twitter: 35, facebook: 28, instagram: 20 },
    { time: '45m ago', twitter: 42, facebook: 30, instagram: 25 },
    { time: '30m ago', twitter: 50, facebook: 28, instagram: 30 },
    { time: '15m ago', twitter: 65, facebook: 30, instagram: 35 },
    { time: 'Now', twitter: 75, facebook: 30, instagram: 40 }
  ];
  
  // Enhanced data for visualizations - still simulated but more comprehensive
  const platformData = [
    { name: 'Twitter', value: 45, color: '#1DA1F2' },
    { name: 'Facebook', value: 30, color: '#4267B2' },
    { name: 'Instagram', value: 15, color: '#C13584' },
    { name: 'TikTok', value: 10, color: '#000000' },
    { name: 'WhatsApp', value: 5, color: '#25D366' },
  ];

  const sentimentData = [
    { name: 'Very Negative', value: 25, color: '#FF5630' },
    { name: 'Negative', value: 35, color: '#FFAB00' },
    { name: 'Neutral', value: 30, color: '#6554C0' },
    { name: 'Positive', value: 10, color: '#36B37E' },
  ];

  const trendData = [
    { date: '2023-01', value: 25, incidents: 5 },
    { date: '2023-02', value: 30, incidents: 8 },
    { date: '2023-03', value: 45, incidents: 12 },
    { date: '2023-04', value: 40, incidents: 10 },
    { date: '2023-05', value: 50, incidents: 15 },
    { date: '2023-06', value: 75, incidents: 18 },
    { date: '2023-07', value: 100, incidents: 25 },
  ];
  


  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex h-screen">
        <Sidebar />
        
        <main className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isOpen ? 'md:ml-64' : ''}`}>
          <Header title="Social Media Monitoring" />
          
          <div className="flex-1 overflow-auto p-4 bg-neutral-50">
            {/* Actions Bar */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Social Media Monitoring</h1>
                <p className="text-sm text-gray-600">Real-time analysis of social media trends for early crisis detection</p>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center gap-1" onClick={handleRefresh}>
                  <RefreshCw className="h-4 w-4" />
                  Refresh Data
                </Button>
                <Button 
                  className="flex items-center gap-1"
                  onClick={() => setShowAddKeywordDialog(true)}
                >
                  <Plus className="h-4 w-4" />
                  Add Keyword
                </Button>
              </div>
            </div>
            
            {/* Search and filter section */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
                    <Input 
                      placeholder="Search keywords, hashtags..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Filter
                    </Button>
                    <Button>Search</Button>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Tabs defaultValue="all" onValueChange={setPlatform}>
                    <TabsList>
                      <TabsTrigger value="all">All Platforms</TabsTrigger>
                      <TabsTrigger value="twitter" className="flex items-center gap-1">
                        <Twitter className="h-4 w-4" />
                        Twitter
                      </TabsTrigger>
                      <TabsTrigger value="facebook" className="flex items-center gap-1">
                        <Facebook className="h-4 w-4" />
                        Facebook
                      </TabsTrigger>
                      <TabsTrigger value="instagram" className="flex items-center gap-1">
                        <Instagram className="h-4 w-4" />
                        Instagram
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
            
            {/* Dashboard overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Platform Distribution</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  {isLoading ? (
                    <Skeleton className="h-64 w-full" />
                  ) : (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={platformData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {platformData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <RechartsTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Sentiment Analysis</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  {isLoading ? (
                    <Skeleton className="h-64 w-full" />
                  ) : (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={sentimentData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {sentimentData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <RechartsTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Alert Volume Trend</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  {isLoading ? (
                    <Skeleton className="h-64 w-full" />
                  ) : (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <RechartsTooltip />
                          <Line type="monotone" dataKey="value" stroke="#0A2463" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Monitoring Tool */}
            <div className="mb-6">
              <Tabs defaultValue="dashboard" onValueChange={setMonitoringTab}>
                <div className="flex justify-between items-center mb-4">
                  <TabsList>
                    <TabsTrigger value="dashboard" className="flex items-center gap-1">
                      <BarChart2 className="h-4 w-4" />
                      Dashboard
                    </TabsTrigger>
                    <TabsTrigger value="realtime" className="flex items-center gap-1">
                      <Activity className="h-4 w-4" />
                      Real-time Monitor
                    </TabsTrigger>
                    <TabsTrigger value="keywords" className="flex items-center gap-1">
                      <Hash className="h-4 w-4" />
                      Monitored Keywords
                    </TabsTrigger>
                    <TabsTrigger value="locations" className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      Geographic Analysis
                    </TabsTrigger>
                  </TabsList>
                  
                  <div className="flex gap-2">
                    <Select value={timeframe} onValueChange={setTimeframe}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Time Range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hour">Last Hour</SelectItem>
                        <SelectItem value="day">Last 24 Hours</SelectItem>
                        <SelectItem value="week">Last 7 Days</SelectItem>
                        <SelectItem value="month">Last 30 Days</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button variant="outline" onClick={handleRefresh} className="flex items-center gap-1">
                      <RefreshCw className="h-4 w-4" />
                      Refresh
                    </Button>
                  </div>
                </div>
                
                <TabsContent value="dashboard">
                  {/* Dashboard content is already rendered above */}
                </TabsContent>
                
                <TabsContent value="realtime">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Real-time Activity Monitor</CardTitle>
                      <CardDescription>Live tracking of social media conversations and trends</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={realtimeData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" />
                            <YAxis />
                            <RechartsTooltip />
                            <Legend />
                            <Area type="monotone" dataKey="twitter" stackId="1" stroke="#1DA1F2" fill="#1DA1F2" />
                            <Area type="monotone" dataKey="facebook" stackId="1" stroke="#4267B2" fill="#4267B2" />
                            <Area type="monotone" dataKey="instagram" stackId="1" stroke="#C13584" fill="#C13584" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Twitter className="h-5 w-5 text-[#1DA1F2]" />
                              <h3 className="font-medium">Twitter</h3>
                            </div>
                            <Badge variant="outline" className="bg-blue-100">Live</Badge>
                          </div>
                          <div className="mt-2">
                            <div className="text-2xl font-bold">75</div>
                            <div className="text-sm text-blue-600">mentions/minute</div>
                          </div>
                          <div className="flex items-center mt-1 text-xs text-green-600">
                            <ArrowUp className="h-3 w-3 mr-1" />
                            <span>25% increase from average</span>
                          </div>
                        </div>
                        
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Facebook className="h-5 w-5 text-[#4267B2]" />
                              <h3 className="font-medium">Facebook</h3>
                            </div>
                            <Badge variant="outline" className="bg-blue-100">Live</Badge>
                          </div>
                          <div className="mt-2">
                            <div className="text-2xl font-bold">30</div>
                            <div className="text-sm text-blue-600">mentions/minute</div>
                          </div>
                          <div className="flex items-center mt-1 text-xs text-red-600">
                            <ArrowDown className="h-3 w-3 mr-1" />
                            <span>5% decrease from average</span>
                          </div>
                        </div>
                        
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Instagram className="h-5 w-5 text-[#C13584]" />
                              <h3 className="font-medium">Instagram</h3>
                            </div>
                            <Badge variant="outline" className="bg-blue-100">Live</Badge>
                          </div>
                          <div className="mt-2">
                            <div className="text-2xl font-bold">40</div>
                            <div className="text-sm text-blue-600">mentions/minute</div>
                          </div>
                          <div className="flex items-center mt-1 text-xs text-green-600">
                            <ArrowUp className="h-3 w-3 mr-1" />
                            <span>15% increase from average</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="keywords">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle className="text-lg">Monitored Keywords</CardTitle>
                          <CardDescription>Current terms being tracked across social media platforms</CardDescription>
                        </div>
                        <Button 
                          onClick={() => setShowAddKeywordDialog(true)}
                          className="flex items-center gap-1"
                        >
                          <Plus className="h-4 w-4" /> Add Keyword
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* These would ideally come from the API */}
                        <div className="border rounded-lg p-4 hover:shadow transition">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium flex items-center">
                              <Hash className="h-4 w-4 mr-1 text-blue-500" />
                              conflict
                            </h3>
                            <Badge variant="secondary">Active</Badge>
                          </div>
                          <div className="text-sm text-neutral-500 mt-2">
                            Platforms: Twitter, Facebook
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <div className="text-xs">Added: 15 days ago</div>
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-4 hover:shadow transition">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium flex items-center">
                              <Hash className="h-4 w-4 mr-1 text-blue-500" />
                              protest
                            </h3>
                            <Badge variant="secondary">Active</Badge>
                          </div>
                          <div className="text-sm text-neutral-500 mt-2">
                            Platforms: All
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <div className="text-xs">Added: 7 days ago</div>
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-4 hover:shadow transition">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium flex items-center">
                              <Hash className="h-4 w-4 mr-1 text-blue-500" />
                              election
                            </h3>
                            <Badge variant="secondary">Active</Badge>
                          </div>
                          <div className="text-sm text-neutral-500 mt-2">
                            Platforms: Twitter, Facebook, Instagram
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <div className="text-xs">Added: 30 days ago</div>
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="locations">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Geographic Analysis</CardTitle>
                      <CardDescription>Distribution of monitored social media activity by region</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <div className="mb-4">
                            <h3 className="text-base font-medium mb-2">Regional Activity Distribution</h3>
                            <div className="h-72">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                  data={locationData}
                                  layout="vertical"
                                >
                                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                  <XAxis type="number" />
                                  <YAxis dataKey="name" type="category" width={100} />
                                  <RechartsTooltip />
                                  <Bar dataKey="value" fill="#8884d8" />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                          
                          <div className="bg-neutral-50 p-4 rounded-lg">
                            <h3 className="text-base font-medium mb-2">Hotspot Analysis</h3>
                            <p className="text-sm text-neutral-600 mb-3">
                              Current social media activity is concentrated in the North East region, with significant 
                              spikes in urban centers of Borno, Yobe and Adamawa states.
                            </p>
                            <Button className="w-full" variant="outline">View Detailed Map</Button>
                          </div>
                        </div>
                        
                        <div>
                          <div className="border rounded-lg">
                            <div className="bg-blue-50 p-3 border-b">
                              <h3 className="font-medium">Regional Risk Assessment</h3>
                            </div>
                            <div className="divide-y">
                              <div className="p-3 hover:bg-neutral-50">
                                <div className="flex justify-between items-center">
                                  <h4 className="font-medium">North East</h4>
                                  <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Critical</Badge>
                                </div>
                                <div className="flex items-center mt-1">
                                  <TrendingUp className="h-3 w-3 text-red-500 mr-1" />
                                  <span className="text-xs text-neutral-600">65% increase in negative sentiment</span>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                  <span className="text-xs text-neutral-500">
                                    Primary hashtags: #conflict, #security, #violence
                                  </span>
                                  <Button variant="ghost" size="sm" className="h-6 text-xs">Details</Button>
                                </div>
                              </div>
                              
                              <div className="p-3 hover:bg-neutral-50">
                                <div className="flex justify-between items-center">
                                  <h4 className="font-medium">South West</h4>
                                  <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Moderate</Badge>
                                </div>
                                <div className="flex items-center mt-1">
                                  <TrendingUp className="h-3 w-3 text-amber-500 mr-1" />
                                  <span className="text-xs text-neutral-600">28% increase in negative sentiment</span>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                  <span className="text-xs text-neutral-500">
                                    Primary hashtags: #protest, #politics, #economy
                                  </span>
                                  <Button variant="ghost" size="sm" className="h-6 text-xs">Details</Button>
                                </div>
                              </div>
                              
                              <div className="p-3 hover:bg-neutral-50">
                                <div className="flex justify-between items-center">
                                  <h4 className="font-medium">North Central</h4>
                                  <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Moderate</Badge>
                                </div>
                                <div className="flex items-center mt-1">
                                  <TrendingUp className="h-3 w-3 text-amber-500 mr-1" />
                                  <span className="text-xs text-neutral-600">15% increase in negative sentiment</span>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                  <span className="text-xs text-neutral-500">
                                    Primary hashtags: #farmers, #herders, #conflict
                                  </span>
                                  <Button variant="ghost" size="sm" className="h-6 text-xs">Details</Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Trending topics */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Trending Topics</CardTitle>
                <CardDescription>Most discussed keywords and hashtags monitored across social media</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {socialTrends.slice(0, 10).map((trend: SocialTrend, index: number) => (
                      <div key={index} className="flex items-center border-b border-neutral-100 pb-4">
                        <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center mr-4">
                          <Hash className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{trend.keyword}</h4>
                            <span className="text-xs bg-neutral-100 text-neutral-700 px-2 py-1 rounded">
                              {trend.platform}
                            </span>
                          </div>
                          <div className="flex items-center mt-1">
                            <span className="text-sm text-neutral-500 mr-4">Volume: {trend.volume}</span>
                            <div className="flex items-center">
                              <span className="text-sm mr-1">Sentiment:</span>
                              {trend.sentiment < -0.5 ? (
                                <span className="text-sm text-red-500 flex items-center">
                                  <ArrowDown className="h-3 w-3 mr-1" /> Very Negative
                                </span>
                              ) : trend.sentiment < 0 ? (
                                <span className="text-sm text-amber-500 flex items-center">
                                  <ArrowDown className="h-3 w-3 mr-1" /> Negative
                                </span>
                              ) : trend.sentiment > 0.5 ? (
                                <span className="text-sm text-green-500 flex items-center">
                                  <ArrowUp className="h-3 w-3 mr-1" /> Positive
                                </span>
                              ) : (
                                <span className="text-sm text-blue-500">Neutral</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="ml-4" onClick={() => setSelectedTrend(trend)}>View Details</Button>
                      </div>
                    ))}
                    
                    {socialTrends.length === 0 && !isLoading && (
                      <div className="text-center py-8 text-neutral-500">
                        No social media trends found
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Alert Mentions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Critical Alert Mentions</CardTitle>
                <CardDescription>High-risk conversations requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-28 w-full" />
                    <Skeleton className="h-28 w-full" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {socialTrends.filter((t: SocialTrend) => t.sentiment < -0.6).slice(0, 5).map((mention: SocialTrend, index: number) => (
                      <div key={index} className="bg-neutral-50 p-4 rounded-lg">
                        <div className="flex items-start">
                          <div className="bg-red-100 h-10 w-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium flex items-center">
                                {mention.platform === 'twitter' ? (
                                  <Twitter className="h-4 w-4 mr-1 text-[#1DA1F2]" />
                                ) : mention.platform === 'facebook' ? (
                                  <Facebook className="h-4 w-4 mr-1 text-[#4267B2]" />
                                ) : (
                                  <Instagram className="h-4 w-4 mr-1 text-[#C13584]" />
                                )}
                                {mention.keyword}
                              </h4>
                              <span className="text-xs text-neutral-500">
                                {new Date(mention.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-neutral-600 mt-1">
                              Location: {mention.location || 'Nationwide'}
                            </p>
                            <div className="flex items-center mt-2">
                              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full mr-3">
                                High Risk
                              </span>
                              <span className="text-xs">
                                Sentiment: {mention.sentiment.toFixed(2)}
                              </span>
                              <span className="text-xs ml-4">
                                Volume: {mention.volume}
                              </span>
                              <Button variant="link" size="sm" className="ml-auto" onClick={() => setSelectedTrend(mention)}>
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {socialTrends.filter((t: SocialTrend) => t.sentiment < -0.6).length === 0 && !isLoading && (
                      <div className="text-center py-8 text-neutral-500">
                        No critical alert mentions found
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Add Keyword Dialog */}
            <Dialog open={showAddKeywordDialog} onOpenChange={setShowAddKeywordDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Monitoring Keyword</DialogTitle>
                  <DialogDescription>
                    Enter a keyword or hashtag to monitor across social media platforms
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Keyword or Hashtag</label>
                    <Input 
                      placeholder="e.g., protest, conflict, election"
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                    />
                    <p className="text-xs text-neutral-500">
                      Do not include the # symbol for hashtags
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Platforms</label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="Select platforms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Platforms</SelectItem>
                        <SelectItem value="twitter">Twitter Only</SelectItem>
                        <SelectItem value="facebook">Facebook Only</SelectItem>
                        <SelectItem value="instagram">Instagram Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddKeywordDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddKeyword} disabled={!keywordInput.trim()}>
                    Add Keyword
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            {/* Trend Details Dialog */}
            {selectedTrend && (
              <Dialog open={!!selectedTrend} onOpenChange={() => setSelectedTrend(null)}>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center">
                      {selectedTrend.platform === 'twitter' ? (
                        <Twitter className="h-5 w-5 mr-2 text-[#1DA1F2]" />
                      ) : selectedTrend.platform === 'facebook' ? (
                        <Facebook className="h-5 w-5 mr-2 text-[#4267B2]" />
                      ) : (
                        <Instagram className="h-5 w-5 mr-2 text-[#C13584]" />
                      )}
                      Trend Analysis: {selectedTrend.keyword}
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-base font-medium mb-2">Trend Overview</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Keyword:</span>
                          <span className="font-medium">{selectedTrend.keyword}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Platform:</span>
                          <span className="font-medium">{selectedTrend.platform}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Detected at:</span>
                          <span className="font-medium">{new Date(selectedTrend.createdAt).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Location:</span>
                          <span className="font-medium">{selectedTrend.location || 'Nationwide'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Volume:</span>
                          <span className="font-medium">{selectedTrend.volume} mentions</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Sentiment score:</span>
                          <span className={`font-medium ${
                            selectedTrend.sentiment < -0.5 ? 'text-red-600' : 
                            selectedTrend.sentiment < 0 ? 'text-amber-600' : 
                            'text-green-600'
                          }`}>
                            {selectedTrend.sentiment.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h3 className="text-base font-medium mb-2">Risk Assessment</h3>
                        <div className="bg-red-50 p-3 rounded-lg">
                          <div className="flex items-center mb-2">
                            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                            <span className="font-medium text-red-700">High Risk Detected</span>
                          </div>
                          <p className="text-sm text-red-600">
                            This social media trend shows highly negative sentiment combined with increasing volume, 
                            indicating a potential escalation in conflict or civil unrest. Immediate action recommended.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-base font-medium mb-2">Volume Trend (Last 24h)</h3>
                      <div className="h-48 mb-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={[
                            { hour: '00:00', volume: Math.floor(selectedTrend.volume * 0.2) },
                            { hour: '06:00', volume: Math.floor(selectedTrend.volume * 0.3) },
                            { hour: '12:00', volume: Math.floor(selectedTrend.volume * 0.6) },
                            { hour: '18:00', volume: Math.floor(selectedTrend.volume * 0.8) },
                            { hour: 'Now', volume: selectedTrend.volume },
                          ]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="hour" />
                            <YAxis />
                            <RechartsTooltip />
                            <Line type="monotone" dataKey="volume" stroke="#FF0000" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <h3 className="text-base font-medium mb-2">Recommended Actions</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                          <span className="text-sm">Create system alert for relevant agencies</span>
                        </div>
                        <div className="flex items-center">
                          <Hourglass className="h-4 w-4 text-amber-500 mr-2" />
                          <span className="text-sm">Increase monitoring frequency for this keyword</span>
                        </div>
                        <div className="flex items-center">
                          <Send className="h-4 w-4 text-amber-500 mr-2" />
                          <span className="text-sm">Deploy field agents to verify information</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        <Button className="w-full" onClick={() => handleCreateAlert(selectedTrend)}>
                          Create Alert
                        </Button>
                        <Button variant="outline" className="w-full" onClick={() => setSelectedTrend(null)}>
                          Close
                        </Button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
