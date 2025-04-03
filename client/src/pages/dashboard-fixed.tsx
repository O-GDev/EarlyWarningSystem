import { useState } from 'react';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import StatCard from '@/components/dashboard/stat-card';
import CrisisChart from '@/components/dashboard/crisis-chart';
import IncidentPieChart from '@/components/dashboard/incident-pie-chart';
import TimeSeriesChart from '@/components/dashboard/time-series-chart';
import SocialTrends from '@/components/dashboard/social-trends';
import IncidentMap from '@/components/incidents/incident-map';
import AssistantDialog from '@/components/ai-assistant/assistant-dialog';
import { AlertMonitor } from '@/components/dashboard/alert-monitor';
import { RealTimeFeed } from '@/components/dashboard/real-time-feed';
import { useSidebar } from '@/contexts/sidebar-context';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Bot, ChevronDown, Maximize2, Minimize2, LayoutPanelTop, Sparkles } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { 
  AlertCircle, 
  FileText, 
  Hash, 
  CheckCircle,
  Calendar,
  MapPin,
  BarChart4,
  Radio,
  Bell
} from 'lucide-react';

export default function Dashboard() {
  const { toast } = useToast();
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const { isOpen } = useSidebar();
  const [dashboardView, setDashboardView] = useState('overview');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  
  // Define types for our stats data
  interface DashboardStats {
    activeIncidents: number;
    newReportsToday: number;
    socialMediaAlerts: number;
    resolvedIncidents: number;
  }

  // Define types for incident data
  interface Incident {
    id: number;
    title: string;
    description: string;
    severity: string;
    status: string;
    location: string;
    incidentType: string;
    reportedAt: string;
  }

  // Fetch stats for dashboard with default empty stats to prevent undefined errors
  const { data: stats = {
    activeIncidents: 0,
    newReportsToday: 0,
    socialMediaAlerts: 0,
    resolvedIncidents: 0,
  }, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/stats'],
    staleTime: 60000, // 1 minute
  });

  // Fetch recent incidents for dashboard alerts with default empty array to prevent undefined errors
  const { data: incidents = [], isLoading: incidentsLoading } = useQuery<Incident[]>({
    queryKey: ['/api/incidents'],
    staleTime: 60000, // 1 minute
  });

  // Check if we have critical incidents to show an alert banner
  const criticalIncidents = incidents.filter((incident) => 
    incident.severity === 'critical' && incident.status === 'active'
  );
  
  const toggleExpandSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };
  
  const isExpanded = (section: string) => expandedSection === section;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex h-screen">
        <Sidebar />
        
        <main className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isOpen ? 'md:ml-64' : ''}`}>
          <Header title="Dashboard" />
          
          <div className="flex-1 overflow-auto p-4 bg-neutral-50">
            {/* Alert Banner */}
            {criticalIncidents && criticalIncidents.length > 0 && (
              <Alert variant="destructive" className="bg-accent/10 border-l-4 border-accent p-4 rounded mb-6 flex items-start">
                <AlertCircle className="h-5 w-5 text-accent mr-3 mt-0.5" />
                <div>
                  <AlertTitle className="font-medium text-accent">
                    Critical Alert: {criticalIncidents[0].title}
                  </AlertTitle>
                  <AlertDescription className="text-neutral-700 text-sm">
                    {criticalIncidents[0].description.substring(0, 120)}...
                    <a href={`/incidents/${criticalIncidents[0].id}`} className="text-primary hover:underline ml-1">
                      View details
                    </a>
                  </AlertDescription>
                </div>
              </Alert>
            )}
            
            {/* Dashboard Tabs */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex bg-white rounded-md shadow-sm overflow-hidden">
                  <button 
                    onClick={() => setDashboardView('overview')}
                    className={`px-5 py-2.5 text-sm font-medium transition-all duration-200 flex items-center ${dashboardView === 'overview' 
                      ? 'bg-primary text-white' 
                      : 'bg-white hover:bg-neutral-50 text-neutral-700'}`}
                  >
                    <AlertCircle className="w-4 h-4 mr-2" /> Overview
                  </button>
                  <button 
                    onClick={() => setDashboardView('analytics')}
                    className={`px-5 py-2.5 text-sm font-medium transition-all duration-200 flex items-center ${dashboardView === 'analytics' 
                      ? 'bg-secondary text-white' 
                      : 'bg-white hover:bg-neutral-50 text-neutral-700'}`}
                  >
                    <Hash className="w-4 h-4 mr-2" /> Analytics
                  </button>
                  <button 
                    onClick={() => setDashboardView('map')}
                    className={`px-5 py-2.5 text-sm font-medium transition-all duration-200 flex items-center ${dashboardView === 'map' 
                      ? 'bg-info text-white' 
                      : 'bg-white hover:bg-neutral-50 text-neutral-700'}`}
                  >
                    <MapPin className="w-4 h-4 mr-2" /> Map View
                  </button>
                </div>
                <div className="text-xs text-neutral-500">
                  Last updated: {new Date().toLocaleString()}
                </div>
              </div>
              
              {/* Overview Tab */}
              {dashboardView === 'overview' && (
                <div className="space-y-6">
                  {/* Stats overview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                      title="Active Incidents"
                      value={statsLoading ? "-" : stats?.activeIncidents || 0}
                      icon={<AlertCircle className="text-primary" />}
                      iconBgClass="bg-primary/10"
                      changeValue={-12}
                      changeText="vs last month"
                      isLoading={statsLoading}
                    />
                    
                    <StatCard
                      title="New Reports Today"
                      value={statsLoading ? "-" : stats?.newReportsToday || 0}
                      icon={<FileText className="text-secondary" />}
                      iconBgClass="bg-secondary/10"
                      changeValue={8}
                      changeText="vs yesterday"
                      isLoading={statsLoading}
                    />
                    
                    <StatCard
                      title="Social Media Alerts"
                      value={statsLoading ? "-" : stats?.socialMediaAlerts || 0}
                      icon={<Hash className="text-info" />}
                      iconBgClass="bg-info/10"
                      changeValue={23}
                      changeText="vs last week"
                      isLoading={statsLoading}
                    />
                    
                    <StatCard
                      title="Resolved Incidents"
                      value={statsLoading ? "-" : stats?.resolvedIncidents || 0}
                      icon={<CheckCircle className="text-success" />}
                      iconBgClass="bg-success/10"
                      changeValue={5}
                      changeText="vs last month"
                      isLoading={statsLoading}
                    />
                  </div>

                  {/* Main content grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Crisis Map Card */}
                    <div className="lg:col-span-2 h-[500px]">
                      <div className="bg-white rounded-lg shadow-sm h-full overflow-hidden">
                        <div className="p-3 border-b border-neutral-100 flex justify-between items-center">
                          <h3 className="font-medium flex items-center">
                            <MapPin className="h-4 w-4 text-primary mr-2" />
                            Incident Map
                          </h3>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => setDashboardView('map')}
                          >
                            <Maximize2 className="h-4 w-4 text-neutral-500" />
                          </Button>
                        </div>
                        <IncidentMap />
                      </div>
                    </div>
                    
                    {/* Recent Alerts Card */}
                    <div className="h-[500px]">
                      <AlertMonitor />
                    </div>
                    
                    {/* Crisis Chart */}
                    <div className={`transition-all duration-300 ${isExpanded('crisis') ? 'lg:col-span-3' : 'lg:col-span-2'}`}>
                      <div className="relative">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="absolute right-2 top-3 z-10 h-8 w-8 p-0"
                          onClick={() => toggleExpandSection('crisis')}
                        >
                          {isExpanded('crisis') ? (
                            <ChevronDown className="h-4 w-4 text-neutral-500" />
                          ) : (
                            <Maximize2 className="h-4 w-4 text-neutral-500" />
                          )}
                        </Button>
                        <CrisisChart isLoading={incidentsLoading} />
                      </div>
                    </div>
                    
                    {/* Social Media Monitoring Card */}
                    <div className={`transition-all duration-300 ${isExpanded('social') ? 'lg:col-span-3' : 'lg:col-span-1'}`}>
                      <div className="relative">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="absolute right-2 top-3 z-10 h-8 w-8 p-0"
                          onClick={() => toggleExpandSection('social')}
                        >
                          {isExpanded('social') ? (
                            <ChevronDown className="h-4 w-4 text-neutral-500" />
                          ) : (
                            <Maximize2 className="h-4 w-4 text-neutral-500" />
                          )}
                        </Button>
                        <SocialTrends />
                      </div>
                    </div>
                  </div>
                  
                  {/* Real-Time Feed */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div className={`transition-all duration-300 ${isExpanded('feed') ? 'lg:col-span-2' : 'lg:col-span-1'}`}>
                      <div className="relative">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="absolute right-2 top-3 z-10 h-8 w-8 p-0"
                          onClick={() => toggleExpandSection('feed')}
                        >
                          {isExpanded('feed') ? (
                            <ChevronDown className="h-4 w-4 text-neutral-500" />
                          ) : (
                            <Maximize2 className="h-4 w-4 text-neutral-500" />
                          )}
                        </Button>
                        <RealTimeFeed />
                      </div>
                    </div>
                    
                    {/* AI Assistant Preview Card */}
                    <div className={`transition-all duration-300 ${isExpanded('feed') ? 'hidden' : 'block'} bg-white rounded-lg shadow-sm p-4 overflow-hidden`}>
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="font-medium text-lg flex items-center">
                          <Bot className="text-secondary mr-2" />
                          AI Assistant
                        </h2>
                        <button 
                          onClick={() => setAiDialogOpen(true)}
                          className="text-primary hover:underline text-sm"
                        >
                          Open Full Assistant
                        </button>
                      </div>
                    
                      <div className="bg-neutral-50 rounded p-4">
                        <div className="flex space-x-3">
                          <div className="h-10 w-10 bg-secondary rounded-full flex items-center justify-center text-white">
                            <Bot className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">EWERS AI Assistant</div>
                            <p className="text-sm text-neutral-700 mt-1">Based on recent data analysis, I've identified three potential emerging conflict patterns:</p>
                            <ul className="mt-2 space-y-1 text-sm text-neutral-700">
                              <li><span className="inline-block h-2 w-2 bg-accent rounded-full mr-2"></span>Increasing tensions between farming communities and herders in Benue state</li>
                              <li><span className="inline-block h-2 w-2 bg-amber-500 rounded-full mr-2"></span>Coordinated social media campaigns targeting ethnic minorities in Kaduna area</li>
                              <li><span className="inline-block h-2 w-2 bg-primary rounded-full mr-2"></span>Unusual movement patterns of armed groups near Sokoto border</li>
                            </ul>
                            <p className="text-sm text-neutral-700 mt-2">Would you like me to provide more detailed analysis on any of these patterns?</p>
                          </div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <button 
                            onClick={() => setAiDialogOpen(true)}
                            className="px-3 py-1.5 bg-primary text-white text-sm rounded hover:bg-primary-dark transition"
                          >
                            Analyze Benue Situation
                          </button>
                          <button 
                            onClick={() => setAiDialogOpen(true)}
                            className="px-3 py-1.5 border border-neutral-200 text-neutral-700 text-sm rounded hover:bg-neutral-50 transition"
                          >
                            View Social Media Data
                          </button>
                          <button 
                            onClick={() => setAiDialogOpen(true)}
                            className="px-3 py-1.5 border border-neutral-200 text-neutral-700 text-sm rounded hover:bg-neutral-50 transition"
                          >
                            Track Armed Groups
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Analytics Tab */}
              {dashboardView === 'analytics' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard
                      title="Critical Incidents"
                      value="18"
                      icon={<AlertCircle className="text-accent" />}
                      iconBgClass="bg-accent/10"
                      changeValue={5}
                      changeText="vs last month"
                      isChangeNegative={false}
                    />
                    
                    <StatCard
                      title="High Risk States"
                      value="4"
                      icon={<MapPin className="text-amber-500" />}
                      iconBgClass="bg-amber-500/10"
                      changeValue={1}
                      changeText="vs last month"
                      isChangeNegative={false}
                    />
                    
                    <StatCard
                      title="Early Warnings"
                      value="32"
                      icon={<Calendar className="text-info" />}
                      iconBgClass="bg-info/10"
                      changeValue={8}
                      changeText="vs last week"
                      isChangeNegative={false}
                    />
                    
                    <StatCard
                      title="Response Plans Active"
                      value="12"
                      icon={<CheckCircle className="text-success" />}
                      iconBgClass="bg-success/10"
                      changeValue={3}
                      changeText="vs last month"
                      isChangeNegative={false}
                    />
                  </div>
                  
                  {/* Analytics Charts */}
                  <div className="grid grid-cols-1 gap-6 mb-6">
                    <TimeSeriesChart />
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <IncidentPieChart />
                    <SocialTrends />
                  </div>
                </div>
              )}
              
              {/* Map Tab */}
              {dashboardView === 'map' && (
                <div className="space-y-4">
                  <div className="bg-white rounded-lg shadow-sm p-4">
                    <h3 className="text-lg font-medium mb-2">Interactive Incident Map</h3>
                    <p className="text-neutral-600 text-sm">
                      View all incidents geographically with filtering options. Zoom in to see detailed regional patterns.
                    </p>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm h-[700px] overflow-hidden">
                    <IncidentMap />
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <AssistantDialog 
        defaultOpen={aiDialogOpen} 
        onOpenChange={setAiDialogOpen} 
      />
    </div>
  );
}