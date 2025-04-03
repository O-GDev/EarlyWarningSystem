import { useState } from 'react';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import CallLogForm from '@/components/incidents/call-log-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/ui/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { useSidebar } from '@/contexts/sidebar-context';
import { timeAgo, getSeverityColor } from '@/lib/utils';
import { Phone, Plus, Filter, FileCog, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function CallLogs() {
  const { isOpen } = useSidebar();
  const [callLogDialogOpen, setCallLogDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: callLogs, isLoading } = useQuery({
    queryKey: ['/api/call-logs'],
    staleTime: 60000, // 1 minute
  });

  const handleDialogOpenChange = (open: boolean) => {
    setCallLogDialogOpen(open);
  };

  const handleFormSuccess = () => {
    setCallLogDialogOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex h-screen">
        <Sidebar />
        
        <main className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isOpen ? 'md:ml-64' : ''}`}>
          <Header title="Call Agent Logs" />
          
          <div className="flex-1 overflow-auto p-4 bg-neutral-50">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl flex items-center">
                      <Phone className="mr-2 h-5 w-5" />
                      Call Agent Logs
                    </CardTitle>
                    <CardDescription>
                      Review and manage incoming crisis call reports
                    </CardDescription>
                  </div>
                  <Dialog open={callLogDialogOpen} onOpenChange={handleDialogOpenChange}>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Log New Call
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl">
                      <CallLogForm onSuccess={handleFormSuccess} onCancel={() => setCallLogDialogOpen(false)} />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
                    <Input 
                      placeholder="Search by caller name, location, or description..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <FileCog className="h-4 w-4" />
                    Export
                  </Button>
                </div>
                
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : (
                  <div className="border rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-neutral-200">
                      <thead className="bg-neutral-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                            Caller
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                            Location
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                            Incident Type
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                            Severity
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                            Time
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-neutral-200">
                        {callLogs && callLogs.length > 0 ? (
                          callLogs.map((log: any) => {
                            const severityColor = getSeverityColor(log.severity);
                            
                            return (
                              <tr key={log.id} className="hover:bg-neutral-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div>
                                      <div className="text-sm font-medium text-neutral-900">{log.callerName}</div>
                                      <div className="text-sm text-neutral-500">{log.contactNumber}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-neutral-900">{log.location}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-neutral-900">
                                    {log.incidentType.charAt(0).toUpperCase() + log.incidentType.slice(1).replace('-', ' ')}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <Badge variant="outline" className={`${severityColor.bg} ${severityColor.text} ${severityColor.border}`}>
                                    {log.severity.charAt(0).toUpperCase() + log.severity.slice(1)}
                                  </Badge>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <Badge variant={log.status === 'pending' ? 'default' : 'secondary'}>
                                    {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                                  </Badge>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                                  {timeAgo(log.loggedAt)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <Button variant="ghost" size="sm">View</Button>
                                  <Button variant="ghost" size="sm">Process</Button>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={7} className="px-6 py-4 text-center text-neutral-500">
                              No call logs found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Call Response Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 flex items-center">
                  <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center mr-4">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-neutral-500">Total Calls</div>
                    <div className="text-2xl font-semibold">{callLogs?.length || 0}</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 flex items-center">
                  <div className="bg-amber-100 h-12 w-12 rounded-full flex items-center justify-center mr-4">
                    <div className="h-6 w-6 text-amber-500 flex items-center justify-center">⏳</div>
                  </div>
                  <div>
                    <div className="text-sm text-neutral-500">Pending</div>
                    <div className="text-2xl font-semibold">
                      {callLogs?.filter((log: any) => log.status === 'pending').length || 0}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 flex items-center">
                  <div className="bg-blue-100 h-12 w-12 rounded-full flex items-center justify-center mr-4">
                    <div className="h-6 w-6 text-blue-500 flex items-center justify-center">🔄</div>
                  </div>
                  <div>
                    <div className="text-sm text-neutral-500">In Progress</div>
                    <div className="text-2xl font-semibold">
                      {callLogs?.filter((log: any) => log.status === 'processing').length || 0}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 flex items-center">
                  <div className="bg-green-100 h-12 w-12 rounded-full flex items-center justify-center mr-4">
                    <div className="h-6 w-6 text-green-500 flex items-center justify-center">✓</div>
                  </div>
                  <div>
                    <div className="text-sm text-neutral-500">Resolved</div>
                    <div className="text-2xl font-semibold">
                      {callLogs?.filter((log: any) => log.status === 'resolved').length || 0}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
