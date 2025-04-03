import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, MessageCircle, Users, AlertCircle } from 'lucide-react';
import { timeAgo, getSeverityColor } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface RecentAlertProps {
  alert: {
    id: number;
    title: string;
    description: string;
    severity: string;
    createdAt: string;
    alertType: string;
  };
}

function getAlertIcon(alertType: string) {
  switch (alertType) {
    case 'security':
      return <AlertTriangle className="text-red-500" />;
    case 'social_media':
      return <MessageCircle className="text-amber-500" />;
    case 'humanitarian':
      return <Users className="text-blue-500" />;
    default:
      return <AlertCircle className="text-green-500" />;
  }
}

function RecentAlert({ alert }: RecentAlertProps) {
  const severityColor = getSeverityColor(alert.severity);
  
  return (
    <div className="p-4 hover:bg-neutral-50">
      <div className="flex items-start">
        <div className={`h-10 w-10 flex-shrink-0 ${severityColor.bg} rounded-full flex items-center justify-center mr-3`}>
          {getAlertIcon(alert.alertType)}
        </div>
        <div className="flex-1">
          <h4 className="font-medium">{alert.title}</h4>
          <p className="text-sm text-neutral-600 mt-1">{alert.description}</p>
          <div className="flex items-center justify-between mt-2">
            <span className={`inline-flex items-center px-2 py-1 ${severityColor.bg} ${severityColor.text} text-xs rounded-full`}>
              {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
            </span>
            <span className="text-xs text-neutral-500">{timeAgo(alert.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AlertSkeleton() {
  return (
    <div className="p-4">
      <div className="flex items-start">
        <Skeleton className="h-10 w-10 rounded-full mr-3" />
        <div className="flex-1">
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <div className="flex items-center justify-between mt-2">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RecentAlerts() {
  const { data: alerts, isLoading, refetch } = useQuery({
    queryKey: ['/api/alerts'],
    staleTime: 60000, // 1 minute
  });
  
  const handleRefresh = () => {
    refetch();
  };
  
  return (
    <Card className="bg-white rounded-lg shadow-sm h-full flex flex-col">
      <CardHeader className="p-4 border-b border-neutral-100 flex flex-row justify-between items-center">
        <CardTitle className="text-lg font-medium">Recent Alerts</CardTitle>
        <Button variant="ghost" size="icon" onClick={handleRefresh} className="text-neutral-500 hover:text-primary">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <div className="divide-y divide-neutral-100 flex-grow overflow-auto">
        {isLoading ? (
          <>
            <AlertSkeleton />
            <AlertSkeleton />
            <AlertSkeleton />
          </>
        ) : alerts && alerts.length > 0 ? (
          alerts.map((alert: any) => (
            <RecentAlert key={alert.id} alert={alert} />
          ))
        ) : (
          <div className="p-8 text-center text-neutral-500">
            No recent alerts found
          </div>
        )}
      </div>
      <CardContent className="p-3 border-t border-neutral-100 text-center mt-auto">
        <Button variant="link" className="text-primary text-sm">
          View All Alerts
        </Button>
      </CardContent>
    </Card>
  );
}
