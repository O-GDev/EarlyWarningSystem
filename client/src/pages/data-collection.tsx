import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import { useSidebar } from '@/contexts/sidebar-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Info, ClipboardList, Globe, Users, Server, Map, ChevronRight } from 'lucide-react';

export default function DataCollection() {
  const [location] = useLocation();
  const { isOpen } = useSidebar();
  const [pageTitle, setPageTitle] = useState('Data Collection');
  const [pageDescription, setPageDescription] = useState('Collect and manage data from various sources for early warning');
  
  // Determine the current sub-page based on the location
  useEffect(() => {
    switch (location) {
      case '/data-collection/submit-incident':
        setPageTitle('Submit Incident');
        setPageDescription('Manually submit a new incident or report');
        break;
      case '/data-collection/social-media':
        setPageTitle('Social Media Monitoring');
        setPageDescription('Track and collect data from social media sources');
        break;
      case '/data-collection/community-reports':
        setPageTitle('Community Reports');
        setPageDescription('Manage reports submitted by community members');
        break;
      case '/data-collection/automated-feeds':
        setPageTitle('Automated Feeds');
        setPageDescription('Configure and manage automated data feeds');
        break;
      case '/data-collection/field-reports':
        setPageTitle('Field Reports');
        setPageDescription('Collect and manage reports from field agents');
        break;
      default:
        setPageTitle('Data Collection');
        setPageDescription('Collect and manage data from various sources for early warning');
        break;
    }
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex h-screen">
        <Sidebar />
        
        <main className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isOpen ? 'md:ml-64' : ''}`}>
          <Header title={pageTitle} />
          
          <div className="flex-1 overflow-auto p-4 bg-neutral-50">
            <div className="max-w-7xl mx-auto">
              <Alert className="mb-6 bg-blue-50 border-blue-200">
                <Info className="h-5 w-5 text-blue-500" />
                <AlertTitle className="text-blue-700">Module Information</AlertTitle>
                <AlertDescription className="text-blue-600">
                  {pageDescription}
                </AlertDescription>
              </Alert>
              
              {location === '/data-collection' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="bg-red-50">
                      <CardTitle className="flex items-center text-red-700">
                        <ClipboardList className="mr-2 h-5 w-5" />
                        Submit Incident
                      </CardTitle>
                      <CardDescription>Report a new incident</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-neutral-600 text-sm mb-4">
                        Submit and document new crisis incidents in the system.
                      </p>
                      <Button 
                        variant="outline" 
                        className="w-full flex justify-between items-center"
                        onClick={() => window.location.href = '/data-collection/submit-incident'}
                      >
                        Access Module <ChevronRight className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="bg-blue-50">
                      <CardTitle className="flex items-center text-blue-700">
                        <Globe className="mr-2 h-5 w-5" />
                        Social Media
                      </CardTitle>
                      <CardDescription>Monitor social media sources</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-neutral-600 text-sm mb-4">
                        Track and analyze social media for early warning signals.
                      </p>
                      <Button 
                        variant="outline" 
                        className="w-full flex justify-between items-center"
                        onClick={() => window.location.href = '/data-collection/social-media'}
                      >
                        Access Module <ChevronRight className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="bg-green-50">
                      <CardTitle className="flex items-center text-green-700">
                        <Users className="mr-2 h-5 w-5" />
                        Community Reports
                      </CardTitle>
                      <CardDescription>Manage community submitted reports</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-neutral-600 text-sm mb-4">
                        Collect and manage reports from community members and stakeholders.
                      </p>
                      <Button 
                        variant="outline" 
                        className="w-full flex justify-between items-center"
                        onClick={() => window.location.href = '/data-collection/community-reports'}
                      >
                        Access Module <ChevronRight className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="bg-purple-50">
                      <CardTitle className="flex items-center text-purple-700">
                        <Server className="mr-2 h-5 w-5" />
                        Automated Feeds
                      </CardTitle>
                      <CardDescription>Manage automated data sources</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-neutral-600 text-sm mb-4">
                        Configure and monitor automated data feeds from external sources.
                      </p>
                      <Button 
                        variant="outline" 
                        className="w-full flex justify-between items-center"
                        onClick={() => window.location.href = '/data-collection/automated-feeds'}
                      >
                        Access Module <ChevronRight className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="bg-yellow-50">
                      <CardTitle className="flex items-center text-yellow-700">
                        <Map className="mr-2 h-5 w-5" />
                        Field Reports
                      </CardTitle>
                      <CardDescription>Manage reports from field agents</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-neutral-600 text-sm mb-4">
                        Collect and manage firsthand reports from field agents and observers.
                      </p>
                      <Button 
                        variant="outline" 
                        className="w-full flex justify-between items-center"
                        onClick={() => window.location.href = '/data-collection/field-reports'}
                      >
                        Access Module <ChevronRight className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {location === '/data-collection/community-reports' && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">Community Reports</h2>
                  
                  <div className="flex justify-between mb-6">
                    <div className="flex space-x-2">
                      <select className="p-2 border border-gray-300 rounded-md text-sm">
                        <option value="all">All Reports</option>
                        <option value="pending">Pending Verification</option>
                        <option value="verified">Verified</option>
                        <option value="actionable">Actionable</option>
                      </select>
                      <select className="p-2 border border-gray-300 rounded-md text-sm">
                        <option value="all">All Time</option>
                        <option value="day">Last 24 Hours</option>
                        <option value="week">Last Week</option>
                        <option value="month">Last Month</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Search reports..."
                        className="p-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                    <Button className="bg-green-600 hover:bg-green-700">
                      Add New Report
                    </Button>
                  </div>
                  
                  <div className="overflow-x-auto mb-6">
                    <table className="min-w-full bg-white">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                          <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                          <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                          <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="py-3 px-3 text-sm">CR-1001</td>
                          <td className="py-3 px-3 text-sm">2025-03-25</td>
                          <td className="py-3 px-3 text-sm">Anonymous Hotline</td>
                          <td className="py-3 px-3 text-sm">Kano, Northern Region</td>
                          <td className="py-3 px-3 text-sm">Reports of increased tension in local market area</td>
                          <td className="py-3 px-3 text-sm"><span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pending</span></td>
                          <td className="py-3 px-3 text-sm space-x-2">
                            <Button variant="outline" size="sm" className="h-7 px-2 text-xs">View</Button>
                            <Button variant="outline" size="sm" className="h-7 px-2 text-xs">Verify</Button>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 px-3 text-sm">CR-1002</td>
                          <td className="py-3 px-3 text-sm">2025-03-24</td>
                          <td className="py-3 px-3 text-sm">Community Leader</td>
                          <td className="py-3 px-3 text-sm">Lagos, Western Region</td>
                          <td className="py-3 px-3 text-sm">Water shortage causing disputes between communities</td>
                          <td className="py-3 px-3 text-sm"><span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Verified</span></td>
                          <td className="py-3 px-3 text-sm space-x-2">
                            <Button variant="outline" size="sm" className="h-7 px-2 text-xs">View</Button>
                            <Button variant="outline" size="sm" className="h-7 px-2 text-xs">Actions</Button>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 px-3 text-sm">CR-1003</td>
                          <td className="py-3 px-3 text-sm">2025-03-23</td>
                          <td className="py-3 px-3 text-sm">SMS Alert</td>
                          <td className="py-3 px-3 text-sm">Abuja, Central Region</td>
                          <td className="py-3 px-3 text-sm">Political rally turned violent with multiple injuries</td>
                          <td className="py-3 px-3 text-sm"><span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Urgent</span></td>
                          <td className="py-3 px-3 text-sm space-x-2">
                            <Button variant="outline" size="sm" className="h-7 px-2 text-xs">View</Button>
                            <Button variant="outline" size="sm" className="h-7 px-2 text-xs">Escalate</Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded mb-6">
                    <h3 className="font-medium text-green-800 mb-2">Community Reporting Channels</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-3 rounded border border-green-200">
                        <p className="font-medium text-green-700">SMS Hotline</p>
                        <p className="text-sm text-gray-600">+234 800 555 1234</p>
                        <p className="text-xs text-gray-500 mt-1">24/7 monitoring active</p>
                      </div>
                      <div className="bg-white p-3 rounded border border-green-200">
                        <p className="font-medium text-green-700">Web Portal</p>
                        <p className="text-sm text-gray-600">ewers.ng/report</p>
                        <p className="text-xs text-gray-500 mt-1">Anonymous submission available</p>
                      </div>
                      <div className="bg-white p-3 rounded border border-green-200">
                        <p className="font-medium text-green-700">Mobile App</p>
                        <p className="text-sm text-gray-600">EWERS Reporter App</p>
                        <p className="text-xs text-gray-500 mt-1">Available on Android & iOS</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button variant="outline">Export Reports</Button>
                    <Button className="bg-blue-600 hover:bg-blue-700">View Analytics</Button>
                  </div>
                </div>
              )}
              
              {location === '/data-collection/automated-feeds' && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">Automated Data Feeds</h2>
                  
                  <div className="flex justify-between mb-6">
                    <h3 className="text-lg font-medium">Active Data Integrations</h3>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      Add New Feed
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-purple-50 px-4 py-3 border-b flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                          <h4 className="font-medium text-purple-800">Weather Alert Service</h4>
                        </div>
                        <div className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">Active</div>
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-gray-600 mb-3">Provides real-time weather alerts and natural disaster warnings across all monitored regions.</p>
                        <div className="flex justify-between text-xs text-gray-500 mb-3">
                          <span>Last update: 15 minutes ago</span>
                          <span>Refresh rate: 30 minutes</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="text-xs h-7">Configure</Button>
                          <Button size="sm" variant="outline" className="text-xs h-7">View Log</Button>
                          <Button size="sm" variant="outline" className="text-xs h-7 text-red-600 border-red-200 hover:bg-red-50">Disable</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-purple-50 px-4 py-3 border-b flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                          <h4 className="font-medium text-purple-800">News API Integration</h4>
                        </div>
                        <div className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">Active</div>
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-gray-600 mb-3">Monitors 15 major news outlets for keywords related to conflict, violence, and political instability.</p>
                        <div className="flex justify-between text-xs text-gray-500 mb-3">
                          <span>Last update: 5 minutes ago</span>
                          <span>Refresh rate: 15 minutes</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="text-xs h-7">Configure</Button>
                          <Button size="sm" variant="outline" className="text-xs h-7">View Log</Button>
                          <Button size="sm" variant="outline" className="text-xs h-7 text-red-600 border-red-200 hover:bg-red-50">Disable</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-purple-50 px-4 py-3 border-b flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                          <h4 className="font-medium text-purple-800">Government Alert System</h4>
                        </div>
                        <div className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">Warning</div>
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-gray-600 mb-3">Direct integration with government security alert system for emergency notifications.</p>
                        <div className="flex justify-between text-xs text-gray-500 mb-3">
                          <span>Last update: 2 hours ago</span>
                          <span>Authentication error</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="text-xs h-7">Reconnect</Button>
                          <Button size="sm" variant="outline" className="text-xs h-7">View Log</Button>
                          <Button size="sm" variant="outline" className="text-xs h-7 text-red-600 border-red-200 hover:bg-red-50">Disable</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-purple-50 px-4 py-3 border-b flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                          <h4 className="font-medium text-purple-800">NGO Incident Database</h4>
                        </div>
                        <div className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">Inactive</div>
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-gray-600 mb-3">Access to partnering NGO databases of field reported incidents and humanitarian concerns.</p>
                        <div className="flex justify-between text-xs text-gray-500 mb-3">
                          <span>Last update: 3 days ago</span>
                          <span>API key expired</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="text-xs h-7">Configure</Button>
                          <Button size="sm" variant="outline" className="text-xs h-7">View Log</Button>
                          <Button size="sm" variant="outline" className="text-xs h-7 text-green-600 border-green-200 hover:bg-green-50">Activate</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium mb-4">Feed Settings</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Default Data Retention Period</label>
                        <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                          <option value="30">30 days</option>
                          <option value="60">60 days</option>
                          <option value="90" selected>90 days</option>
                          <option value="180">180 days</option>
                          <option value="365">1 year</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Alert Threshold</label>
                        <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                          <option value="low">Low (All alerts)</option>
                          <option value="medium" selected>Medium (Important alerts)</option>
                          <option value="high">High (Critical alerts only)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {location === '/data-collection/field-reports' && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">Field Reports</h2>
                  
                  <div className="flex justify-between mb-6">
                    <div className="flex space-x-2">
                      <select className="p-2 border border-gray-300 rounded-md text-sm">
                        <option value="all">All Reports</option>
                        <option value="pending">Pending Review</option>
                        <option value="approved">Approved</option>
                        <option value="flagged">Flagged for Attention</option>
                      </select>
                      <select className="p-2 border border-gray-300 rounded-md text-sm">
                        <option value="all">All Regions</option>
                        <option value="north">Northern Region</option>
                        <option value="south">Southern Region</option>
                        <option value="east">Eastern Region</option>
                        <option value="west">Western Region</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Search reports..."
                        className="p-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                    <Button className="bg-yellow-600 hover:bg-yellow-700">
                      New Field Report
                    </Button>
                  </div>
                  
                  <div className="overflow-x-auto mb-6">
                    <table className="min-w-full bg-white">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report ID</th>
                          <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field Agent</th>
                          <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                          <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Situation</th>
                          <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                          <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="py-3 px-3 text-sm">FR-2025-0042</td>
                          <td className="py-3 px-3 text-sm">2025-03-30</td>
                          <td className="py-3 px-3 text-sm">Ahmed Buhari</td>
                          <td className="py-3 px-3 text-sm">Maiduguri, Borno State</td>
                          <td className="py-3 px-3 text-sm">Potential food shortage, market access restricted</td>
                          <td className="py-3 px-3 text-sm"><span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Medium</span></td>
                          <td className="py-3 px-3 text-sm space-x-2">
                            <Button variant="outline" size="sm" className="h-7 px-2 text-xs">View</Button>
                            <Button variant="outline" size="sm" className="h-7 px-2 text-xs">Approve</Button>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 px-3 text-sm">FR-2025-0041</td>
                          <td className="py-3 px-3 text-sm">2025-03-29</td>
                          <td className="py-3 px-3 text-sm">Gloria Emmanuel</td>
                          <td className="py-3 px-3 text-sm">Port Harcourt, Rivers State</td>
                          <td className="py-3 px-3 text-sm">Inter-community tensions rising over land dispute</td>
                          <td className="py-3 px-3 text-sm"><span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">High</span></td>
                          <td className="py-3 px-3 text-sm space-x-2">
                            <Button variant="outline" size="sm" className="h-7 px-2 text-xs">View</Button>
                            <Button variant="outline" size="sm" className="h-7 px-2 text-xs">Flag</Button>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 px-3 text-sm">FR-2025-0040</td>
                          <td className="py-3 px-3 text-sm">2025-03-28</td>
                          <td className="py-3 px-3 text-sm">Daniel Adeyemi</td>
                          <td className="py-3 px-3 text-sm">Ibadan, Oyo State</td>
                          <td className="py-3 px-3 text-sm">Political rally scheduled, heightened security recommended</td>
                          <td className="py-3 px-3 text-sm"><span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Low</span></td>
                          <td className="py-3 px-3 text-sm space-x-2">
                            <Button variant="outline" size="sm" className="h-7 px-2 text-xs">View</Button>
                            <Button variant="outline" size="sm" className="h-7 px-2 text-xs">Archive</Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-yellow-50 p-4 rounded shadow-sm">
                      <h3 className="font-medium text-yellow-800 mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Active Field Agents
                      </h3>
                      <div className="flex justify-between">
                        <span className="text-2xl font-bold text-yellow-700">47</span>
                        <span className="text-sm text-yellow-600 self-end">Across 12 states</span>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded shadow-sm">
                      <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Reports This Week
                      </h3>
                      <div className="flex justify-between">
                        <span className="text-2xl font-bold text-blue-700">23</span>
                        <span className="text-sm text-blue-600 self-end">↑ 15% from last week</span>
                      </div>
                    </div>
                    
                    <div className="bg-red-50 p-4 rounded shadow-sm">
                      <h3 className="font-medium text-red-800 mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        High Risk Reports
                      </h3>
                      <div className="flex justify-between">
                        <span className="text-2xl font-bold text-red-700">7</span>
                        <span className="text-sm text-red-600 self-end">Requiring immediate review</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium mb-4">Mobile Field Reporting App</h3>
                    <div className="bg-gray-50 p-4 rounded flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Enable field agents to submit reports directly through our secure mobile application</p>
                        <div className="flex space-x-3 mt-2">
                          <Button size="sm" variant="outline" className="text-xs h-7">App Instructions</Button>
                          <Button size="sm" variant="outline" className="text-xs h-7">Download App</Button>
                        </div>
                      </div>
                      <div className="hidden md:block">
                        <img src="https://placehold.co/100x180?text=Mobile+App" alt="Mobile App" className="h-16 opacity-70" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {location === '/data-collection/submit-incident' && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">Submit New Incident</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Incident Title</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        placeholder="Provide a clear, descriptive title" 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Incident Type</label>
                      <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="">Select incident type</option>
                        <option value="armed_conflict">Armed Conflict</option>
                        <option value="terrorism">Terrorism</option>
                        <option value="communal_violence">Communal Violence</option>
                        <option value="protests">Civil Unrest/Protests</option>
                        <option value="displacement">Population Displacement</option>
                        <option value="natural_disaster">Natural Disaster</option>
                        <option value="infrastructure">Infrastructure Failure</option>
                        <option value="health">Health Emergency</option>
                        <option value="other">Other (specify)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        placeholder="City, State, Region" 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                      <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="">Select severity level</option>
                        <option value="critical">Critical (Immediate response needed)</option>
                        <option value="high">High (Urgent response needed)</option>
                        <option value="medium">Medium (Response needed soon)</option>
                        <option value="low">Low (Monitor situation)</option>
                      </select>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Incident Description</label>
                      <textarea 
                        className="w-full p-2 border border-gray-300 rounded-md h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        placeholder="Provide detailed information about the incident including what happened, who was involved, and any other relevant details"
                      ></textarea>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                      <input 
                        type="datetime-local" 
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Affected Population</label>
                      <input 
                        type="number" 
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        placeholder="Estimated number of people affected" 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Source of Information</label>
                      <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="">Select source</option>
                        <option value="direct_observation">Direct Observation</option>
                        <option value="eyewitness">Eyewitness Account</option>
                        <option value="local_authority">Local Authority</option>
                        <option value="ngo">NGO Report</option>
                        <option value="media">Media Report</option>
                        <option value="social_media">Social Media</option>
                        <option value="other">Other (specify)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Verification Status</label>
                      <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="">Select status</option>
                        <option value="verified">Verified</option>
                        <option value="partially_verified">Partially Verified</option>
                        <option value="unverified">Unverified</option>
                      </select>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        placeholder="Add tags separated by commas (e.g., violence, rural, drought)" 
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Media Links</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        placeholder="Add links to photos, videos, or news articles (separated by commas)" 
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-4">
                    <Button variant="outline">Save as Draft</Button>
                    <Button className="bg-blue-600 hover:bg-blue-700">Submit Incident</Button>
                  </div>
                </div>
              )}
              
              {(location !== '/data-collection' && location !== '/data-collection/submit-incident') && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">{pageTitle}</h2>
                  <p className="mb-4">This module is under development. It will provide tools to:</p>
                  <ul className="list-disc pl-5 mb-6 space-y-2">
                    <li>Collect data from multiple sources</li>
                    <li>Validate and verify collected information</li>
                    <li>Categorize and tag incidents</li>
                    <li>Assign priority and severity levels</li>
                    <li>Forward reports to the appropriate responders</li>
                  </ul>
                  <div className="bg-blue-50 p-4 rounded">
                    <p className="text-blue-700 font-medium">Coming Soon</p>
                    <p className="text-blue-600 text-sm">This feature is scheduled for development in the next sprint.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}