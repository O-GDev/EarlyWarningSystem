import { useState } from 'react';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import IncidentMap from '@/components/incidents/incident-map';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { incidentTypes, severityLevels } from '@/lib/utils';
import { useSidebar } from '@/contexts/sidebar-context';

export default function IncidentMapPage() {
  const { isOpen } = useSidebar();
  const [incidentTypeFilter, setIncidentTypeFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [timeRangeFilter, setTimeRangeFilter] = useState('30');

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex h-screen">
        <Sidebar />
        
        <main className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isOpen ? 'md:ml-64' : ''}`}>
          <Header title="Incident Mapping" />
          
          <div className="flex-1 overflow-auto p-4 bg-neutral-50">
            <Card className="mb-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Filter Map Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Incident Type</label>
                    <Select value={incidentTypeFilter} onValueChange={setIncidentTypeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Incident Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Incident Types</SelectItem>
                        {incidentTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Severity Level</label>
                    <Select value={severityFilter} onValueChange={setSeverityFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Severity Levels" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Severity Levels</SelectItem>
                        {severityLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Time Range</label>
                    <Select value={timeRangeFilter} onValueChange={setTimeRangeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Last 30 Days" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">Last 7 Days</SelectItem>
                        <SelectItem value="30">Last 30 Days</SelectItem>
                        <SelectItem value="90">Last 90 Days</SelectItem>
                        <SelectItem value="365">Last Year</SelectItem>
                        <SelectItem value="all">All Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" className="mr-2">
                    Reset Filters
                  </Button>
                  <Button>
                    Apply Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="h-[calc(100vh-280px)]">
              <IncidentMap />
            </div>
            
            {/* Statistics summary at the bottom */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-neutral-500">Total Incidents</div>
                  <div className="text-2xl font-semibold mt-1">78</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-neutral-500">Critical Incidents</div>
                  <div className="text-2xl font-semibold mt-1 text-red-600">12</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-neutral-500">Active Response</div>
                  <div className="text-2xl font-semibold mt-1 text-amber-600">24</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-neutral-500">Resolved</div>
                  <div className="text-2xl font-semibold mt-1 text-green-600">42</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
