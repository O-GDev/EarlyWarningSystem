import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Clock, MapPin, AlertTriangle, ChevronRight, User, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { capitalize, timeAgo } from '@/lib/utils';

interface Alert {
  id: number;
  title: string;
  location: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  timestamp: string;
  status: 'active' | 'acknowledged' | 'resolved';
  description: string;
  source: string;
}

export function AlertMonitor() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewAlert, setHasNewAlert] = useState(false);
  
  // Fetch alerts from API or use sample data
  useEffect(() => {
    const fetchAlerts = async () => {
      setIsLoading(true);
      try {
        // In a real app, you would fetch from API:
        // const response = await fetch('/api/alerts/recent');
        // const data = await response.json();
        // setAlerts(data);
        
        // Using sample data for now
        setAlerts([
          {
            id: 1,
            title: 'Suspected Armed Group Movement',
            location: 'Borno State, North East',
            severity: 'critical',
            timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 minutes ago
            status: 'active',
            description: 'Multiple reports of armed group sightings near Maiduguri. Potential attack preparation.',
            source: 'Field Report'
          },
          {
            id: 2,
            title: 'Unusual Social Media Activity',
            location: 'Kaduna State',
            severity: 'high',
            timestamp: new Date(Date.now() - 1000 * 60 * 55).toISOString(), // 55 minutes ago
            status: 'acknowledged',
            description: 'Surge in hate speech and incitement to violence detected on Twitter and WhatsApp.',
            source: 'Social Media Monitor'
          },
          {
            id: 3,
            title: 'Civilian Displacement Reported',
            location: 'Zamfara State',
            severity: 'medium',
            timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
            status: 'active',
            description: 'Approximately 200 civilians reported to be moving from villages following threats.',
            source: 'Community Informant'
          },
          {
            id: 4,
            title: 'Political Rally Tensions',
            location: 'Lagos State',
            severity: 'medium',
            timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
            status: 'active',
            description: 'Opposing political groups gathering in close proximity with reports of heated exchanges.',
            source: 'Police Report'
          },
          {
            id: 5,
            title: 'Flooding Affecting Food Security',
            location: 'Kebbi State',
            severity: 'high',
            timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(), // 4 hours ago
            status: 'acknowledged',
            description: 'Major flooding reported in agricultural areas, posing risks to food security and stability.',
            source: 'NEMA Alert'
          }
        ]);
      } catch (error) {
        console.error('Error fetching alerts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAlerts();
    
    // Simulate real-time alerts
    const alertTimer = setInterval(() => {
      // 20% chance of a new alert every 30 seconds
      if (Math.random() < 0.2) {
        setHasNewAlert(true);
        
        // Play notification sound
        // const audio = new Audio('/notification.mp3');
        // audio.play().catch(e => console.log('Audio play failed:', e));
      }
    }, 30000);
    
    return () => clearInterval(alertTimer);
  }, []);
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600 hover:bg-red-700';
      case 'high': return 'bg-orange-500 hover:bg-orange-600';
      case 'medium': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'low': return 'bg-blue-500 hover:bg-blue-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-800 border-red-200';
      case 'acknowledged': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const handleRefresh = () => {
    setHasNewAlert(false);
    // In a real app, this would fetch new alerts
  };
  
  const getSourceIcon = (source: string) => {
    switch (source.toLowerCase()) {
      case 'field report': return <User className="h-3 w-3" />;
      case 'social media monitor': return <Bell className="h-3 w-3" />;
      case 'community informant': return <User className="h-3 w-3" />;
      case 'police report': return <Shield className="h-3 w-3" />;
      case 'nema alert': return <AlertTriangle className="h-3 w-3" />;
      default: return <Bell className="h-3 w-3" />;
    }
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="px-4 py-3 bg-blue-50 flex flex-row items-center justify-between border-b">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Bell className="h-4 w-4 text-blue-700" />
          <span className="text-blue-900">Recent Alerts</span>
          {hasNewAlert && (
            <Badge variant="destructive" className="animate-pulse h-5">New</Badge>
          )}
        </CardTitle>
        {hasNewAlert && (
          <Button 
            onClick={handleRefresh}
            variant="ghost" 
            size="sm" 
            className="h-7 text-xs text-blue-700 hover:text-blue-800 hover:bg-blue-100"
          >
            Refresh
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="h-80 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100 max-h-80 overflow-auto">
            {alerts.map((alert) => (
              <div 
                key={alert.id}
                className="p-3 hover:bg-neutral-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Badge className={`${getSeverityColor(alert.severity)} h-5 w-5 p-0 flex items-center justify-center rounded-full`}>
                      <AlertTriangle className="h-3 w-3 text-white" />
                    </Badge>
                    <h3 className="font-medium text-sm">{alert.title}</h3>
                  </div>
                  <Badge variant="outline" className={`${getStatusColor(alert.status)} text-xs px-2 py-0.5 h-5`}>
                    {capitalize(alert.status)}
                  </Badge>
                </div>
                
                <p className="text-sm text-neutral-600 mb-2 ml-7">
                  {alert.description}
                </p>
                
                <div className="flex justify-between items-center text-xs text-neutral-500 ml-7">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{alert.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{timeAgo(new Date(alert.timestamp))}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {getSourceIcon(alert.source)}
                      <span>{alert.source}</span>
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="sm" className="h-6 text-xs text-blue-600 hover:text-blue-700 p-0">
                    <span className="mr-1">View</span>
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="bg-neutral-50 border-t p-2 flex justify-center">
          <Button variant="outline" size="sm" className="text-xs w-full">
            View All Alerts
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}