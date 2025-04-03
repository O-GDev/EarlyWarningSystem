import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import { useSidebar } from '@/contexts/sidebar-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Info, FileText, Satellite, Handshake, AlertTriangle, ChevronRight } from 'lucide-react';

interface ModuleInfo {
  title: string;
  description: string;
  bgColor: string;
  textColor: string;
  icon: JSX.Element;
}

export default function ModuleTemplate() {
  const [location] = useLocation();
  const { isOpen } = useSidebar();
  const [pageTitle, setPageTitle] = useState('Module');
  const [pageDescription, setPageDescription] = useState('Module description');
  const [moduleType, setModuleType] = useState('');
  const [moduleColor, setModuleColor] = useState('blue');
  
  const moduleMap: Record<string, ModuleInfo> = {
    "risk-assessment": {
      title: "Risk Assessment",
      description: "Configure and monitor early warning risk indicators and thresholds",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-700",
      icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />
    },
    "communication": {
      title: "Communication",
      description: "Manage communication channels and alert notification systems",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-700", 
      icon: <Satellite className="h-5 w-5 text-indigo-500" />
    },
    "response": {
      title: "Response Coordination",
      description: "Coordinate response efforts across agencies and partners",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      icon: <Handshake className="h-5 w-5 text-green-500" />
    }
  };
  
  // Determine the current module and subpage based on the location
  useEffect(() => {
    const path = location.split('/');
    if (path.length > 1) {
      const mainModule = path[1];
      
      if (moduleMap[mainModule]) {
        setModuleType(mainModule);
        setModuleColor(mainModule === 'risk-assessment' ? 'yellow' : mainModule === 'communication' ? 'indigo' : 'green');
        
        if (path.length === 2) {
          // Main module page
          setPageTitle(moduleMap[mainModule].title);
          setPageDescription(moduleMap[mainModule].description);
        } else if (path.length > 2) {
          // Subpage
          const subModule = path[2];
          setPageTitle(formatTitle(subModule));
          setPageDescription(`${formatTitle(subModule)} module within ${moduleMap[mainModule].title}`);
        }
      }
    }
  }, [location]);
  
  // Helper to format URL path to readable title
  const formatTitle = (path: string): string => {
    return path
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  // Generate subpages based on module type
  const getSubpages = () => {
    const subpageMap: Record<string, string[]> = {
      "risk-assessment": ['thresholds', 'risk-scoring', 'generate-alerts', 'notification-settings', 'scenarios'],
      "communication": ['multi-channel', 'stakeholders', 'secure-channels'],
      "response": ['response-plans', 'task-assignment', 'resources', 'agencies']
    };
    
    return subpageMap[moduleType] || [];
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex h-screen">
        <Sidebar />
        
        <main className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isOpen ? 'md:ml-64' : ''}`}>
          <Header title={pageTitle} />
          
          <div className="flex-1 overflow-auto p-4 bg-neutral-50">
            <div className="max-w-7xl mx-auto">
              {moduleMap[moduleType] && (
                <Alert className={`mb-6 ${moduleMap[moduleType].bgColor} border-${moduleColor}-200`}>
                  {moduleMap[moduleType].icon}
                  <AlertTitle className={moduleMap[moduleType].textColor}>Module Information</AlertTitle>
                  <AlertDescription className={`text-${moduleColor}-600`}>
                    {pageDescription}
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Main module page with list of submodules */}
              {location === `/${moduleType}` && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getSubpages().map((subpage, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardHeader className={`bg-${moduleColor}-50`}>
                        <CardTitle className={`flex items-center text-${moduleColor}-700`}>
                          <FileText className="mr-2 h-5 w-5" />
                          {formatTitle(subpage)}
                        </CardTitle>
                        <CardDescription>Manage {formatTitle(subpage).toLowerCase()}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="text-neutral-600 text-sm mb-4">
                          Tools and features for {formatTitle(subpage).toLowerCase()} in the EWERS system.
                        </p>
                        <Button 
                          variant="outline" 
                          className="w-full flex justify-between items-center"
                          onClick={() => window.location.href = `/${moduleType}/${subpage}`}
                        >
                          Access Module <ChevronRight className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              
              {/* Risk Scoring Submodule */}
              {location === '/risk-assessment/risk-scoring' && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">Risk Scoring Configuration</h2>
                  <p className="mb-4">Configure how different risk factors contribute to the overall risk score for incidents.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h3 className="font-medium text-yellow-800 mb-2">Current Risk Model</h3>
                      <p className="text-yellow-700 text-sm mb-4">Composite Risk Score (0-100) calculated from weighted factors below</p>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">Incident Severity</span>
                            <span className="text-sm text-gray-600">40%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">Population Density</span>
                            <span className="text-sm text-gray-600">20%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">Historical Patterns</span>
                            <span className="text-sm text-gray-600">15%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">Social Media Activity</span>
                            <span className="text-sm text-gray-600">15%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">Resource Availability</span>
                            <span className="text-sm text-gray-600">10%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-800 mb-2">Risk Scoring Algorithms</h3>
                      <p className="text-gray-700 text-sm mb-4">Current algorithm: Weighted Composite Score</p>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Algorithm</label>
                        <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500">
                          <option value="weighted">Weighted Composite Score</option>
                          <option value="maximal">Maximal Risk Factor</option>
                          <option value="threshold">Threshold-based Scoring</option>
                          <option value="machine_learning">Machine Learning Model</option>
                          <option value="bayesian">Bayesian Network Model</option>
                        </select>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button className="text-xs px-3 h-8 bg-yellow-600 hover:bg-yellow-700">
                          Compare Models
                        </Button>
                        <Button variant="outline" className="text-xs px-3 h-8">
                          View Documentation
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6 mb-6">
                    <h3 className="font-medium text-lg mb-4">Adjust Risk Factor Weights</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <label className="text-sm font-medium text-gray-700">Incident Severity</label>
                          <span className="text-sm text-gray-600">40%</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value="40" 
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <label className="text-sm font-medium text-gray-700">Population Density</label>
                          <span className="text-sm text-gray-600">20%</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value="20" 
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <label className="text-sm font-medium text-gray-700">Historical Patterns</label>
                          <span className="text-sm text-gray-600">15%</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value="15" 
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <label className="text-sm font-medium text-gray-700">Social Media Activity</label>
                          <span className="text-sm text-gray-600">15%</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value="15" 
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <label className="text-sm font-medium text-gray-700">Resource Availability</label>
                          <span className="text-sm text-gray-600">10%</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value="10" 
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4 text-sm text-gray-600">
                      <span className="font-semibold">Note:</span> Total weights should equal 100%. Adjustments will be normalized automatically.
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-4">
                    <Button variant="outline">Reset to Default</Button>
                    <Button className="bg-yellow-600 hover:bg-yellow-700">Save Changes</Button>
                  </div>
                </div>
              )}
              
              {/* Generate Alerts Submodule */}
              {location === '/risk-assessment/generate-alerts' && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">Alert Generation System</h2>
                  <p className="mb-4">Configure and manage automatic alerts based on risk thresholds and indicators</p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div className="lg:col-span-2">
                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-yellow-50 px-4 py-3 border-b">
                          <h3 className="font-medium text-yellow-800">Active Alert Rules</h3>
                        </div>
                        <div className="p-4">
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead>
                                <tr className="bg-gray-50">
                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rule Name</th>
                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Condition</th>
                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Severity</th>
                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Recipients</th>
                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                <tr>
                                  <td className="px-3 py-2 text-xs">Critical Violence Alert</td>
                                  <td className="px-3 py-2 text-xs">Violence incidents ≥ 3 in 24 hours</td>
                                  <td className="px-3 py-2 text-xs"><span className="px-1.5 py-0.5 text-xs rounded-full bg-red-100 text-red-800">Critical</span></td>
                                  <td className="px-3 py-2 text-xs">Security team, Regional managers</td>
                                  <td className="px-3 py-2 text-xs space-x-1">
                                    <Button size="sm" variant="outline" className="h-6 px-2 text-xs">Edit</Button>
                                    <Button size="sm" variant="outline" className="h-6 px-2 text-xs">Test</Button>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="px-3 py-2 text-xs">Negative Social Sentiment</td>
                                  <td className="px-3 py-2 text-xs">Social sentiment score &lt; -0.6</td>
                                  <td className="px-3 py-2 text-xs"><span className="px-1.5 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800">Medium</span></td>
                                  <td className="px-3 py-2 text-xs">Communications team</td>
                                  <td className="px-3 py-2 text-xs space-x-1">
                                    <Button size="sm" variant="outline" className="h-6 px-2 text-xs">Edit</Button>
                                    <Button size="sm" variant="outline" className="h-6 px-2 text-xs">Test</Button>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="px-3 py-2 text-xs">Resource Scarcity Warning</td>
                                  <td className="px-3 py-2 text-xs">Water/food shortage reports &gt; 10</td>
                                  <td className="px-3 py-2 text-xs"><span className="px-1.5 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800">Medium</span></td>
                                  <td className="px-3 py-2 text-xs">Humanitarian team, Local authorities</td>
                                  <td className="px-3 py-2 text-xs space-x-1">
                                    <Button size="sm" variant="outline" className="h-6 px-2 text-xs">Edit</Button>
                                    <Button size="sm" variant="outline" className="h-6 px-2 text-xs">Test</Button>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="px-3 py-2 text-xs">Political Tension Alert</td>
                                  <td className="px-3 py-2 text-xs">Political risk score &gt; 75%</td>
                                  <td className="px-3 py-2 text-xs"><span className="px-1.5 py-0.5 text-xs rounded-full bg-red-100 text-red-800">Critical</span></td>
                                  <td className="px-3 py-2 text-xs">All stakeholders</td>
                                  <td className="px-3 py-2 text-xs space-x-1">
                                    <Button size="sm" variant="outline" className="h-6 px-2 text-xs">Edit</Button>
                                    <Button size="sm" variant="outline" className="h-6 px-2 text-xs">Test</Button>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="flex justify-end mt-4">
                            <Button className="bg-yellow-600 hover:bg-yellow-700 text-xs h-7">
                              Add New Alert Rule
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-yellow-50 px-4 py-3 border-b">
                          <h3 className="font-medium text-yellow-800">Alert Statistics</h3>
                        </div>
                        <div className="p-4">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Alerts Today</span>
                              <span className="text-lg font-bold">7</span>
                            </div>
                            
                            <div>
                              <div className="flex justify-between text-xs text-gray-600 mb-1">
                                <span>Critical</span>
                                <span>3</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div className="bg-red-500 h-1.5 rounded-full" style={{ width: '42%' }}></div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between text-xs text-gray-600 mb-1">
                                <span>Medium</span>
                                <span>2</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: '28%' }}></div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between text-xs text-gray-600 mb-1">
                                <span>Low</span>
                                <span>2</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '28%' }}></div>
                              </div>
                            </div>
                            
                            <div className="border-t border-gray-200 pt-4 mt-4">
                              <div className="text-sm font-medium mb-2">Alert Trend</div>
                              <div className="flex items-end space-x-1 h-20">
                                <div className="bg-gray-200 h-6 w-6"></div>
                                <div className="bg-gray-200 h-10 w-6"></div>
                                <div className="bg-gray-200 h-8 w-6"></div>
                                <div className="bg-yellow-200 h-12 w-6"></div>
                                <div className="bg-yellow-200 h-9 w-6"></div>
                                <div className="bg-red-200 h-16 w-6"></div>
                                <div className="bg-red-200 h-20 w-6"></div>
                              </div>
                              <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>Mar 25</span>
                                <span>Mar 31</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg overflow-hidden mt-4">
                        <div className="bg-yellow-50 px-4 py-3 border-b">
                          <h3 className="font-medium text-yellow-800">Quick Actions</h3>
                        </div>
                        <div className="p-4">
                          <div className="space-y-2">
                            <Button variant="outline" size="sm" className="w-full justify-start text-left">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                              </svg>
                              Send Test Alert
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start text-left">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              View Alert Logs
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start text-left">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              Configure Settings
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-3">Alert Delivery Channels</h3>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded text-yellow-500 focus:ring-yellow-500" defaultChecked />
                          <span className="text-sm">Email notifications</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded text-yellow-500 focus:ring-yellow-500" defaultChecked />
                          <span className="text-sm">SMS alerts</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded text-yellow-500 focus:ring-yellow-500" defaultChecked />
                          <span className="text-sm">Mobile app push notifications</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded text-yellow-500 focus:ring-yellow-500" />
                          <span className="text-sm">Webhook integrations</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded text-yellow-500 focus:ring-yellow-500" />
                          <span className="text-sm">Emergency broadcast system</span>
                        </label>
                      </div>
                      <div className="mt-3">
                        <Button size="sm" variant="outline">Configure Channels</Button>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-3">Alert Recipients</h3>
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs mr-2">S</div>
                            <span className="text-sm">Security Team</span>
                          </div>
                          <span className="text-xs text-gray-500">5 members</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs mr-2">R</div>
                            <span className="text-sm">Regional Managers</span>
                          </div>
                          <span className="text-xs text-gray-500">4 members</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs mr-2">C</div>
                            <span className="text-sm">Communications Team</span>
                          </div>
                          <span className="text-xs text-gray-500">3 members</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs mr-2">H</div>
                            <span className="text-sm">Humanitarian Team</span>
                          </div>
                          <span className="text-xs text-gray-500">6 members</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <Button size="sm" variant="outline">Manage Recipients</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-medium mb-3">Recent Alerts</h3>
                    <div className="space-y-3">
                      <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                        <div className="flex justify-between">
                          <span className="font-medium text-yellow-800">Political Tension Alert</span>
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">Critical</span>
                        </div>
                        <p className="text-sm text-yellow-700 mt-1">Political risk score has reached 78% in Northern Region</p>
                        <div className="flex justify-between text-xs text-yellow-600 mt-2">
                          <span>March 31, 2025 - 09:15 AM</span>
                          <span>Sent to 18 recipients</span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-800">Negative Social Sentiment</span>
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">Medium</span>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">Social sentiment score reached -0.68 regarding recent water shortages</p>
                        <div className="flex justify-between text-xs text-gray-600 mt-2">
                          <span>March 30, 2025 - 16:42 PM</span>
                          <span>Sent to 3 recipients</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center mt-4">
                      <Button variant="link" className="text-sm">View All Alerts</Button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Notification Settings Submodule */}
              {location === '/risk-assessment/notification-settings' && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
                  <p className="mb-4">Configure notification preferences, recipients, and delivery methods for different alert types</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="col-span-1 md:col-span-2">
                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-yellow-50 px-4 py-3 border-b">
                          <h3 className="font-medium text-yellow-800">User Notification Preferences</h3>
                        </div>
                        <div className="p-4">
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead>
                                <tr className="bg-gray-50">
                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">User/Group</th>
                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">SMS</th>
                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Push</th>
                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                <tr>
                                  <td className="px-3 py-2 text-xs font-medium">Ahmed Ibrahim</td>
                                  <td className="px-3 py-2 text-xs">Security Coordinator</td>
                                  <td className="px-3 py-2 text-xs">
                                    <div className="flex items-center">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                      </svg>
                                      <span className="ml-1">High, Medium</span>
                                    </div>
                                  </td>
                                  <td className="px-3 py-2 text-xs">
                                    <div className="flex items-center">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                      </svg>
                                      <span className="ml-1">High only</span>
                                    </div>
                                  </td>
                                  <td className="px-3 py-2 text-xs">
                                    <div className="flex items-center">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                      </svg>
                                      <span className="ml-1">All</span>
                                    </div>
                                  </td>
                                  <td className="px-3 py-2 text-xs">
                                    <Button size="sm" variant="outline" className="h-6 px-2 text-xs">Edit</Button>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="px-3 py-2 text-xs font-medium">Maria Nkosi</td>
                                  <td className="px-3 py-2 text-xs">Regional Manager</td>
                                  <td className="px-3 py-2 text-xs">
                                    <div className="flex items-center">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                      </svg>
                                      <span className="ml-1">All</span>
                                    </div>
                                  </td>
                                  <td className="px-3 py-2 text-xs">
                                    <div className="flex items-center">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                      </svg>
                                      <span className="ml-1">High only</span>
                                    </div>
                                  </td>
                                  <td className="px-3 py-2 text-xs">
                                    <div className="flex items-center">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                      </svg>
                                      <span className="ml-1">Off</span>
                                    </div>
                                  </td>
                                  <td className="px-3 py-2 text-xs">
                                    <Button size="sm" variant="outline" className="h-6 px-2 text-xs">Edit</Button>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="px-3 py-2 text-xs font-medium">Security Team</td>
                                  <td className="px-3 py-2 text-xs">Team (5 members)</td>
                                  <td className="px-3 py-2 text-xs">
                                    <div className="flex items-center">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                      </svg>
                                      <span className="ml-1">All</span>
                                    </div>
                                  </td>
                                  <td className="px-3 py-2 text-xs">
                                    <div className="flex items-center">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                      </svg>
                                      <span className="ml-1">Security only</span>
                                    </div>
                                  </td>
                                  <td className="px-3 py-2 text-xs">
                                    <div className="flex items-center">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                      </svg>
                                      <span className="ml-1">All</span>
                                    </div>
                                  </td>
                                  <td className="px-3 py-2 text-xs">
                                    <Button size="sm" variant="outline" className="h-6 px-2 text-xs">Edit</Button>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="flex justify-end mt-4">
                            <Button className="bg-yellow-600 hover:bg-yellow-700 text-xs h-7">
                              Add User/Group
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-span-1">
                      <div className="border rounded-lg overflow-hidden mb-4">
                        <div className="bg-yellow-50 px-4 py-3 border-b">
                          <h3 className="font-medium text-yellow-800">Notification Channels</h3>
                        </div>
                        <div className="p-4">
                          <div className="space-y-4">
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium">Email Notifications</span>
                                <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">Active</span>
                              </div>
                              <p className="text-xs text-gray-500">Send alerts to registered email addresses</p>
                              <Button size="sm" variant="link" className="text-xs pl-0 mt-1">Configure</Button>
                            </div>
                            
                            <div className="border-t border-gray-100 pt-4">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium">SMS Alerts</span>
                                <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full">Limited</span>
                              </div>
                              <p className="text-xs text-gray-500">Send text messages via Twilio (credit balance: 245 messages)</p>
                              <Button size="sm" variant="link" className="text-xs pl-0 mt-1">Configure</Button>
                            </div>
                            
                            <div className="border-t border-gray-100 pt-4">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium">Push Notifications</span>
                                <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">Active</span>
                              </div>
                              <p className="text-xs text-gray-500">Send alerts to mobile application users</p>
                              <Button size="sm" variant="link" className="text-xs pl-0 mt-1">Configure</Button>
                            </div>
                            
                            <div className="border-t border-gray-100 pt-4">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium">Radio Broadcast</span>
                                <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-800 rounded-full">Inactive</span>
                              </div>
                              <p className="text-xs text-gray-500">Emergency broadcast to field radios (requires setup)</p>
                              <Button size="sm" variant="link" className="text-xs pl-0 mt-1">Configure</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-yellow-50 px-4 py-3 border-b">
                          <h3 className="font-medium text-yellow-800">Schedule</h3>
                        </div>
                        <div className="p-4">
                          <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quiet Hours</label>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">From</label>
                                <select className="w-full text-sm p-1 border border-gray-300 rounded">
                                  <option>10:00 PM</option>
                                  <option>11:00 PM</option>
                                  <option>12:00 AM</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">To</label>
                                <select className="w-full text-sm p-1 border border-gray-300 rounded">
                                  <option>5:00 AM</option>
                                  <option>6:00 AM</option>
                                  <option>7:00 AM</option>
                                </select>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <label className="flex items-center space-x-2 mb-2">
                              <input type="checkbox" className="rounded text-yellow-500 focus:ring-yellow-500" defaultChecked />
                              <span className="text-sm">Override for critical alerts</span>
                            </label>
                            
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded text-yellow-500 focus:ring-yellow-500" />
                              <span className="text-sm">Daily digest instead of individual alerts</span>
                            </label>
                          </div>
                          
                          <Button size="sm" className="w-full text-xs h-7 bg-yellow-600 hover:bg-yellow-700 mt-2">
                            Save Settings
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-3">Alert Type Settings</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="block text-sm font-medium">Security Incidents</span>
                            <span className="text-xs text-gray-500">Violence, terrorism, armed conflict</span>
                          </div>
                          <div>
                            <Button size="sm" variant="outline" className="h-6 px-2 text-xs">Edit</Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="block text-sm font-medium">Political Events</span>
                            <span className="text-xs text-gray-500">Elections, protests, political statements</span>
                          </div>
                          <div>
                            <Button size="sm" variant="outline" className="h-6 px-2 text-xs">Edit</Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="block text-sm font-medium">Resource Scarcity</span>
                            <span className="text-xs text-gray-500">Water, food, energy shortages</span>
                          </div>
                          <div>
                            <Button size="sm" variant="outline" className="h-6 px-2 text-xs">Edit</Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="block text-sm font-medium">Environmental Events</span>
                            <span className="text-xs text-gray-500">Floods, droughts, natural disasters</span>
                          </div>
                          <div>
                            <Button size="sm" variant="outline" className="h-6 px-2 text-xs">Edit</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-3">Message Templates</h3>
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">Critical Alert</span>
                            <Button size="sm" variant="outline" className="h-6 px-2 text-xs">Edit</Button>
                          </div>
                          <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                            🚨 CRITICAL ALERT: [Incident Type] reported in [Location]. [Brief Description]. Status: [Status]. Take immediate precautions. More info: [Link]
                          </p>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">Medium Alert</span>
                            <Button size="sm" variant="outline" className="h-6 px-2 text-xs">Edit</Button>
                          </div>
                          <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                            ⚠️ WARNING: [Incident Type] reported in [Location]. [Brief Description]. Monitor situation closely. More info: [Link]
                          </p>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">Daily Digest</span>
                            <Button size="sm" variant="outline" className="h-6 px-2 text-xs">Edit</Button>
                          </div>
                          <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                            📊 EWERS Daily Summary: [Date] - [Total] alerts ([Critical] critical, [Medium] medium, [Low] low). Top areas: [Areas]. View report: [Link]
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-medium mb-3">Notification Test</h3>
                    <p className="text-sm text-gray-600 mb-4">Send a test notification to verify your settings are configured correctly</p>
                    
                    <div className="flex space-x-4">
                      <Button className="bg-yellow-600 hover:bg-yellow-700">Send Test Email</Button>
                      <Button className="bg-yellow-600 hover:bg-yellow-700">Send Test SMS</Button>
                      <Button className="bg-yellow-600 hover:bg-yellow-700">Send Test Push</Button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Communication Multi-Channel Submodule */}
              {location === '/communication/multi-channel' && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">Multi-Channel Communication</h2>
                  <p className="mb-4">Configure and manage communication channels for alerts and notifications.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-indigo-800 mb-3">Active Channels</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                          <div className="flex items-center">
                            <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
                            <span className="font-medium">SMS Alerts</span>
                          </div>
                          <Button variant="ghost" size="sm" className="h-8 text-xs">Configure</Button>
                        </div>
                        
                        <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                          <div className="flex items-center">
                            <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
                            <span className="font-medium">Email Notifications</span>
                          </div>
                          <Button variant="ghost" size="sm" className="h-8 text-xs">Configure</Button>
                        </div>
                        
                        <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                          <div className="flex items-center">
                            <div className="h-3 w-3 bg-yellow-500 rounded-full mr-2"></div>
                            <span className="font-medium">Mobile App Push</span>
                          </div>
                          <Button variant="ghost" size="sm" className="h-8 text-xs">Configure</Button>
                        </div>
                        
                        <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                          <div className="flex items-center">
                            <div className="h-3 w-3 bg-red-500 rounded-full mr-2"></div>
                            <span className="font-medium">Radio Broadcasting</span>
                          </div>
                          <Button variant="ghost" size="sm" className="h-8 text-xs">Configure</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-indigo-800 mb-3">Add New Channel</h3>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Channel Type</label>
                          <select className="w-full p-2 border border-gray-300 rounded-md">
                            <option value="">Select channel type</option>
                            <option value="whatsapp">WhatsApp</option>
                            <option value="telegram">Telegram</option>
                            <option value="social">Social Media</option>
                            <option value="tv">TV Broadcast</option>
                            <option value="custom">Custom API</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Channel Name</label>
                          <input className="w-full p-2 border border-gray-300 rounded-md" placeholder="e.g., Local Community WhatsApp" />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Priority Level</label>
                          <select className="w-full p-2 border border-gray-300 rounded-md">
                            <option value="high">High - Critical Alerts</option>
                            <option value="medium">Medium - Important Updates</option>
                            <option value="low">Low - Routine Information</option>
                          </select>
                        </div>
                        
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Add Channel</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-indigo-50 p-4 rounded mt-4">
                    <h3 className="font-medium text-indigo-800 mb-2">API Integration</h3>
                    <p className="text-indigo-700 text-sm mb-4">Connect with Twilio, SendGrid, and other communication services</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-2 bg-white rounded">
                        <div className="flex items-center">
                          <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
                          <span className="font-medium">Twilio SMS</span>
                        </div>
                        <span className="text-xs text-gray-600">Connected</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-2 bg-white rounded">
                        <div className="flex items-center">
                          <div className="h-3 w-3 bg-red-500 rounded-full mr-2"></div>
                          <span className="font-medium">SendGrid Email</span>
                        </div>
                        <span className="text-xs text-gray-600">Setup Required</span>
                      </div>
                      
                      <Button className="w-full" variant="outline">Manage API Connections</Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Response Plans Submodule */}
              {location === '/response/response-plans' && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">Response Plans Management</h2>
                  <p className="mb-4">Create, manage, and deploy standardized response plans for different types of crises.</p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div className="lg:col-span-2">
                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-green-50 p-3 border-b">
                          <h3 className="font-medium text-green-800">Active Response Plans</h3>
                        </div>
                        
                        <div className="divide-y">
                          <div className="p-4 hover:bg-gray-50">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium text-gray-900">Armed Conflict Response - North East</h4>
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mb-3">
                              <span className="mr-3">Last updated: 2 days ago</span>
                              <span>Agency: Military & Police Joint Task Force</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              Coordinated response to armed insurgency in northeastern regions. Includes evacuation procedures, secure zones establishment, and humanitarian corridors.
                            </p>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" className="text-xs">View Details</Button>
                              <Button variant="outline" size="sm" className="text-xs">Edit Plan</Button>
                              <Button variant="outline" size="sm" className="text-xs text-red-500 border-red-200 hover:bg-red-50">Deactivate</Button>
                            </div>
                          </div>
                          
                          <div className="p-4 hover:bg-gray-50">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium text-gray-900">Election Violence Mitigation</h4>
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Standby</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mb-3">
                              <span className="mr-3">Last updated: 1 week ago</span>
                              <span>Agency: Electoral Commission & Security Agencies</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              Preventive and responsive measures for election-related violence. Includes rapid response teams, polling station security, and civil unrest containment.
                            </p>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" className="text-xs">View Details</Button>
                              <Button variant="outline" size="sm" className="text-xs">Edit Plan</Button>
                              <Button variant="outline" size="sm" className="text-xs text-green-500 border-green-200 hover:bg-green-50">Activate</Button>
                            </div>
                          </div>
                          
                          <div className="p-4 hover:bg-gray-50">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium text-gray-900">Flood Disaster Response</h4>
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Seasonal</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mb-3">
                              <span className="mr-3">Last updated: 1 month ago</span>
                              <span>Agency: Emergency Management Agency</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              Response plan for seasonal flooding in riverside communities. Includes early warning protocols, evacuation routes, temporary shelter management, and relief distribution.
                            </p>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" className="text-xs">View Details</Button>
                              <Button variant="outline" size="sm" className="text-xs">Edit Plan</Button>
                              <Button variant="outline" size="sm" className="text-xs text-green-500 border-green-200 hover:bg-green-50">Activate</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="bg-green-50 p-4 rounded-lg mb-6">
                        <h3 className="font-medium text-green-800 mb-3">Create New Response Plan</h3>
                        <Button className="w-full bg-green-600 hover:bg-green-700">New Response Plan</Button>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium text-gray-800 mb-3">Response Plan Templates</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-2 bg-white rounded border">
                            <span className="font-medium text-sm">Armed Conflict</span>
                            <Button variant="ghost" size="sm" className="h-7 text-xs">Use</Button>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-white rounded border">
                            <span className="font-medium text-sm">Natural Disaster</span>
                            <Button variant="ghost" size="sm" className="h-7 text-xs">Use</Button>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-white rounded border">
                            <span className="font-medium text-sm">Civil Unrest</span>
                            <Button variant="ghost" size="sm" className="h-7 text-xs">Use</Button>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-white rounded border">
                            <span className="font-medium text-sm">Health Emergency</span>
                            <Button variant="ghost" size="sm" className="h-7 text-xs">Use</Button>
                          </div>
                          <Button variant="outline" size="sm" className="w-full text-xs mt-2">
                            View All Templates
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mt-6">
                    <h3 className="font-medium text-lg mb-3">Response Plan Analytics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-3 rounded border">
                        <div className="text-sm text-gray-500">Active Plans</div>
                        <div className="text-2xl font-semibold">4</div>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <div className="text-sm text-gray-500">Deployments (Last 30 days)</div>
                        <div className="text-2xl font-semibold">7</div>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <div className="text-sm text-gray-500">Avg. Response Time</div>
                        <div className="text-2xl font-semibold">28<span className="text-sm font-normal text-gray-500 ml-1">mins</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Task Assignment Submodule */}
              {location === '/response/task-assignment' && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">Task Assignment & Resource Management</h2>
                  <p className="mb-4">Assign tasks to response teams and manage resource allocation during crisis response operations.</p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
                    <div className="lg:col-span-3">
                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-green-50 p-3 border-b flex justify-between items-center">
                          <h3 className="font-medium text-green-800">Active Tasks & Assignments</h3>
                          <div className="flex space-x-2">
                            <select className="text-xs p-1 border rounded">
                              <option>All Tasks</option>
                              <option>Critical Priority</option>
                              <option>High Priority</option>
                              <option>Medium Priority</option>
                              <option>Low Priority</option>
                            </select>
                            <Button variant="outline" size="sm" className="h-7 text-xs">Filter</Button>
                          </div>
                        </div>
                        
                        <div className="divide-y">
                          <div className="p-4 hover:bg-gray-50">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium text-gray-900">Evacuation Coordination - Borno IDP Camp</h4>
                              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Critical Priority</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
                              <div className="text-sm">
                                <span className="text-gray-500">Assigned to:</span> 
                                <span className="font-medium ml-1">Rapid Response Team Alpha</span>
                              </div>
                              <div className="text-sm">
                                <span className="text-gray-500">Due by:</span> 
                                <span className="font-medium ml-1">Today, 18:00</span>
                              </div>
                              <div className="text-sm">
                                <span className="text-gray-500">Status:</span> 
                                <span className="text-amber-600 font-medium ml-1">In Progress (75%)</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">
                              Coordinate evacuation of civilians from conflict area to designated safe zones. Provide transportation, security, and basic necessities.
                            </p>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" className="text-xs">View Details</Button>
                              <Button variant="outline" size="sm" className="text-xs">Reassign</Button>
                              <Button size="sm" className="text-xs bg-green-600 hover:bg-green-700">Update Status</Button>
                            </div>
                          </div>
                          
                          <div className="p-4 hover:bg-gray-50">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium text-gray-900">Medical Aid Distribution - Yobe</h4>
                              <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">High Priority</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
                              <div className="text-sm">
                                <span className="text-gray-500">Assigned to:</span> 
                                <span className="font-medium ml-1">Medical Emergency Team</span>
                              </div>
                              <div className="text-sm">
                                <span className="text-gray-500">Due by:</span> 
                                <span className="font-medium ml-1">Tomorrow, 12:00</span>
                              </div>
                              <div className="text-sm">
                                <span className="text-gray-500">Status:</span> 
                                <span className="text-green-600 font-medium ml-1">On Schedule (40%)</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">
                              Distribute medical supplies and provide emergency medical care to affected communities in Yobe State.
                            </p>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" className="text-xs">View Details</Button>
                              <Button variant="outline" size="sm" className="text-xs">Reassign</Button>
                              <Button size="sm" className="text-xs bg-green-600 hover:bg-green-700">Update Status</Button>
                            </div>
                          </div>
                          
                          <div className="p-4 hover:bg-gray-50">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium text-gray-900">Security Perimeter - Lagos Protest</h4>
                              <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">High Priority</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
                              <div className="text-sm">
                                <span className="text-gray-500">Assigned to:</span> 
                                <span className="font-medium ml-1">Police Tactical Unit</span>
                              </div>
                              <div className="text-sm">
                                <span className="text-gray-500">Due by:</span> 
                                <span className="font-medium ml-1">Today, 16:00</span>
                              </div>
                              <div className="text-sm">
                                <span className="text-gray-500">Status:</span> 
                                <span className="text-red-600 font-medium ml-1">Delayed (30%)</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">
                              Establish security perimeter around protest area to prevent violence and protect critical infrastructure.
                            </p>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" className="text-xs">View Details</Button>
                              <Button variant="outline" size="sm" className="text-xs">Reassign</Button>
                              <Button size="sm" className="text-xs bg-green-600 hover:bg-green-700">Update Status</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="bg-green-50 p-4 rounded-lg mb-6">
                        <h3 className="font-medium text-green-800 mb-3">Create New Task</h3>
                        <Button className="w-full bg-green-600 hover:bg-green-700">Assign New Task</Button>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <h3 className="font-medium text-gray-800 mb-3">Quick Stats</h3>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">Tasks Pending</span>
                              <span className="font-medium">8</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '40%' }}></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">Tasks In Progress</span>
                              <span className="font-medium">12</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">Tasks Completed</span>
                              <span className="font-medium">24</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-medium text-blue-800 mb-3">Resource Status</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between items-center">
                            <span>Rapid Response Teams</span>
                            <span className="font-medium text-red-600">Critical (2/8)</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Medical Personnel</span>
                            <span className="font-medium text-amber-600">Limited (15/40)</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Vehicles</span>
                            <span className="font-medium text-green-600">Available (32/50)</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Relief Supplies</span>
                            <span className="font-medium text-green-600">Sufficient</span>
                          </div>
                          <Button variant="outline" size="sm" className="w-full text-xs mt-2">
                            Manage Resources
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Threshold Monitoring Submodule */}
              {location === '/risk-assessment/thresholds' && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">Risk Threshold Monitoring</h2>
                  <p className="mb-4">Configure and monitor threshold values that trigger alerts and automated responses.</p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div className="lg:col-span-2">
                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-yellow-50 p-3 border-b flex justify-between items-center">
                          <h3 className="font-medium text-yellow-800">Active Thresholds</h3>
                          <div className="flex space-x-2">
                            <select className="text-xs p-1 border rounded">
                              <option>All Types</option>
                              <option>Armed Conflict</option>
                              <option>Civil Unrest</option>
                              <option>Natural Disaster</option>
                              <option>Health Crisis</option>
                            </select>
                            <Button variant="outline" size="sm" className="h-7 text-xs">Filter</Button>
                          </div>
                        </div>
                        
                        <div className="divide-y">
                          <div className="p-4 hover:bg-gray-50">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <div className="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"></div>
                                <h4 className="font-medium text-gray-900">Armed Conflict - Insurgent Activity</h4>
                              </div>
                              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Critical</span>
                            </div>
                            <div className="mb-3">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-500">Current value: <span className="font-medium">87%</span> of threshold</span>
                                <span className="text-gray-500">Alert at: <span className="font-medium">75%</span></span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-red-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-3">
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded">North-East Region</span>
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded">Triggers SMS Alert</span>
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded">Military Response</span>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" className="text-xs">View History</Button>
                              <Button variant="outline" size="sm" className="text-xs">Edit Threshold</Button>
                              <Button size="sm" className="text-xs bg-red-600 hover:bg-red-700">Acknowledge Alert</Button>
                            </div>
                          </div>
                          
                          <div className="p-4 hover:bg-gray-50">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <div className="h-2.5 w-2.5 rounded-full bg-amber-500 mr-2"></div>
                                <h4 className="font-medium text-gray-900">Civil Unrest - Protest Scale</h4>
                              </div>
                              <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">Warning</span>
                            </div>
                            <div className="mb-3">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-500">Current value: <span className="font-medium">62%</span> of threshold</span>
                                <span className="text-gray-500">Alert at: <span className="font-medium">50%</span></span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '62%' }}></div>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-3">
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded">Lagos</span>
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded">Abuja</span>
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded">Triggers Email Alert</span>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" className="text-xs">View History</Button>
                              <Button variant="outline" size="sm" className="text-xs">Edit Threshold</Button>
                              <Button size="sm" className="text-xs bg-amber-600 hover:bg-amber-700">Acknowledge Alert</Button>
                            </div>
                          </div>
                          
                          <div className="p-4 hover:bg-gray-50">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                                <h4 className="font-medium text-gray-900">Flood Risk - Water Levels</h4>
                              </div>
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Normal</span>
                            </div>
                            <div className="mb-3">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-500">Current value: <span className="font-medium">30%</span> of threshold</span>
                                <span className="text-gray-500">Alert at: <span className="font-medium">70%</span></span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-3">
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded">Riverine Areas</span>
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded">Seasonal Monitoring</span>
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded">Multi-Agency</span>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" className="text-xs">View History</Button>
                              <Button variant="outline" size="sm" className="text-xs">Edit Threshold</Button>
                              <Button variant="outline" size="sm" className="text-xs">Set Manual Status</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="bg-yellow-50 p-4 rounded-lg mb-6">
                        <h3 className="font-medium text-yellow-800 mb-3">Configure New Threshold</h3>
                        <Button className="w-full bg-yellow-600 hover:bg-yellow-700">Add Threshold</Button>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <h3 className="font-medium text-gray-800 mb-3">Threshold Summary</h3>
                        <div className="space-y-2 text-sm mb-4">
                          <div className="flex items-center justify-between">
                            <span>Critical Alerts:</span>
                            <span className="font-medium text-red-600">2</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Warning Alerts:</span>
                            <span className="font-medium text-amber-600">4</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Normal Status:</span>
                            <span className="font-medium text-green-600">7</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Inactive:</span>
                            <span className="font-medium text-gray-600">3</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full text-xs">
                          View Alert History
                        </Button>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-medium text-blue-800 mb-3">Data Sources</h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center">
                            <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                            <span>Real-time satellite imagery</span>
                          </li>
                          <li className="flex items-center">
                            <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                            <span>Social media analysis</span>
                          </li>
                          <li className="flex items-center">
                            <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                            <span>Field reports</span>
                          </li>
                          <li className="flex items-center">
                            <div className="h-2 w-2 bg-red-500 rounded-full mr-2"></div>
                            <span>Weather station network</span>
                          </li>
                          <li className="flex items-center">
                            <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                            <span>Security agency reports</span>
                          </li>
                        </ul>
                        <Button variant="outline" size="sm" className="w-full text-xs mt-4">
                          Manage Data Sources
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Resources Tracking Module */}
              {location === '/response/resources' && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">Resources Tracking & Management</h2>
                  <p className="mb-4">Monitor, allocate, and manage resources for effective crisis response and early warning operations.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="md:col-span-3">
                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-green-50 px-4 py-3 border-b flex justify-between items-center">
                          <h3 className="font-medium text-green-700">Available Resources</h3>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="text-xs h-7">Filter</Button>
                            <Button variant="outline" size="sm" className="text-xs h-7">Export</Button>
                            <Button className="bg-green-600 hover:bg-green-700 text-xs h-7">Add Resource</Button>
                          </div>
                        </div>
                        <div className="p-0">
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource Name</th>
                                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                <tr>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">Emergency Vehicles</div>
                                    <div className="text-xs text-gray-500">4x4 SUVs with emergency equipment</div>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <span className="text-sm text-gray-900">Vehicle</span>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <span className="text-sm text-gray-900">12 / 15</span>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <span className="text-sm text-gray-900">Central Headquarters</span>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                      Available
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                    <div className="flex space-x-2">
                                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                      </Button>
                                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">Medical Supplies</div>
                                    <div className="text-xs text-gray-500">First aid kits and emergency medical equipment</div>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <span className="text-sm text-gray-900">Medical</span>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <span className="text-sm text-gray-900">48 / 50</span>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <span className="text-sm text-gray-900">Medical Storage</span>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                      Available
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                    <div className="flex space-x-2">
                                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                      </Button>
                                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">Communication Devices</div>
                                    <div className="text-xs text-gray-500">Handheld radios and satellite phones</div>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <span className="text-sm text-gray-900">Communication</span>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <span className="text-sm text-red-600 font-medium">8 / 20</span>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <span className="text-sm text-gray-900">Equipment Room</span>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                      Low Stock
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                    <div className="flex space-x-2">
                                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                      </Button>
                                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">Emergency Food & Water</div>
                                    <div className="text-xs text-gray-500">Non-perishable food and bottled water</div>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <span className="text-sm text-gray-900">Supplies</span>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <span className="text-sm text-gray-900">200 / 300</span>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <span className="text-sm text-gray-900">Main Warehouse</span>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                      Available
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                    <div className="flex space-x-2">
                                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                      </Button>
                                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">Generator & Fuel</div>
                                    <div className="text-xs text-gray-500">Portable power generators</div>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <span className="text-sm text-gray-900">Equipment</span>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <span className="text-sm text-red-600 font-medium">3 / 10</span>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <span className="text-sm text-gray-900">Field Deployment</span>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                      Deployed
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                    <div className="flex space-x-2">
                                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                      </Button>
                                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="space-y-6">
                        <div className="border rounded-lg overflow-hidden">
                          <div className="bg-green-50 px-4 py-3 border-b">
                            <h3 className="font-medium text-green-700">Resource Summary</h3>
                          </div>
                          <div className="p-4">
                            <div className="space-y-4">
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm font-medium text-gray-700">Total Resources</span>
                                  <span className="text-sm text-gray-900">24 categories</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                                </div>
                              </div>
                              
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm font-medium text-gray-700">Currently Deployed</span>
                                  <span className="text-sm text-gray-900">8 categories</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '33%' }}></div>
                                </div>
                              </div>
                              
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm font-medium text-gray-700">Low Stock Alert</span>
                                  <span className="text-sm text-gray-900">3 categories</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '12%' }}></div>
                                </div>
                              </div>
                              
                              <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-700">
                                <div className="font-medium mb-1">Resource Utilization</div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                                    <span>Available</span>
                                  </div>
                                  <span>65%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                                    <span>Deployed</span>
                                  </div>
                                  <span>25%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></span>
                                    <span>Maintenance</span>
                                  </div>
                                  <span>10%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg overflow-hidden">
                          <div className="bg-green-50 px-4 py-3 border-b">
                            <h3 className="font-medium text-green-700">Quick Actions</h3>
                          </div>
                          <div className="p-4">
                            <div className="space-y-2">
                              <Button className="w-full bg-green-600 hover:bg-green-700 flex justify-between items-center">
                                <span>Add New Resource</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                              </Button>
                              
                              <Button variant="outline" className="w-full flex justify-between items-center">
                                <span>Generate Inventory Report</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                              </Button>
                              
                              <Button variant="outline" className="w-full flex justify-between items-center">
                                <span>Resource Allocation</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                              </Button>
                              
                              <Button variant="outline" className="w-full flex justify-between items-center">
                                <span>Check Requisitions</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg overflow-hidden mb-6">
                    <div className="bg-green-50 px-4 py-3 border-b flex justify-between items-center">
                      <h3 className="font-medium text-green-700">Resource Allocation & Requests</h3>
                      <Button size="sm" className="h-7 text-xs">View All Requests</Button>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded-lg overflow-hidden">
                          <div className="bg-gray-50 px-3 py-2 border-b">
                            <h4 className="text-sm font-medium text-gray-700">Pending Resource Requests</h4>
                          </div>
                          <div className="p-3">
                            <div className="space-y-3">
                              <div className="bg-white border rounded-md p-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="font-medium">Medical Supplies</span>
                                  <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs">Urgent</span>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  <div>Requested by: Northern Field Team</div>
                                  <div>Quantity: 5 kits</div>
                                  <div>Date: Today, 10:23 AM</div>
                                </div>
                                <div className="flex justify-end space-x-2 mt-2">
                                  <Button size="sm" variant="ghost" className="h-6 text-xs px-2">Reject</Button>
                                  <Button size="sm" className="h-6 text-xs px-2 bg-green-600 hover:bg-green-700">Approve</Button>
                                </div>
                              </div>
                              
                              <div className="bg-white border rounded-md p-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="font-medium">Emergency Vehicles</span>
                                  <span className="px-1.5 py-0.5 bg-green-100 text-green-800 rounded text-xs">Normal</span>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  <div>Requested by: Eastern Response Team</div>
                                  <div>Quantity: 2 vehicles</div>
                                  <div>Date: Yesterday, 4:45 PM</div>
                                </div>
                                <div className="flex justify-end space-x-2 mt-2">
                                  <Button size="sm" variant="ghost" className="h-6 text-xs px-2">Reject</Button>
                                  <Button size="sm" className="h-6 text-xs px-2 bg-green-600 hover:bg-green-700">Approve</Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg overflow-hidden">
                          <div className="bg-gray-50 px-3 py-2 border-b">
                            <h4 className="text-sm font-medium text-gray-700">Recent Allocations</h4>
                          </div>
                          <div className="p-3">
                            <div className="space-y-3">
                              <div className="bg-white border rounded-md p-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="font-medium">Communication Devices</span>
                                  <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">Completed</span>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  <div>Allocated to: Southern Response Unit</div>
                                  <div>Quantity: 12 radios</div>
                                  <div>Date: 2 days ago</div>
                                </div>
                                <div className="flex justify-end mt-2">
                                  <Button size="sm" variant="outline" className="h-6 text-xs px-2">View Details</Button>
                                </div>
                              </div>
                              
                              <div className="bg-white border rounded-md p-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="font-medium">Generator & Fuel</span>
                                  <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">Completed</span>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  <div>Allocated to: Northern Field Office</div>
                                  <div>Quantity: 2 generators, 200L fuel</div>
                                  <div>Date: 3 days ago</div>
                                </div>
                                <div className="flex justify-end mt-2">
                                  <Button size="sm" variant="outline" className="h-6 text-xs px-2">View Details</Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <div>
                      <Button variant="outline" className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
                        Resource Categories
                      </Button>
                    </div>
                    <div className="space-x-3">
                      <Button variant="outline">Manage Suppliers</Button>
                      <Button className="bg-green-600 hover:bg-green-700">Request Resources</Button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Default template for other pages */}
              {location !== `/${moduleType}` && 
               location !== '/risk-assessment/risk-scoring' && 
               location !== '/communication/multi-channel' &&
               location !== '/response/response-plans' &&
               location !== '/response/task-assignment' &&
               location !== '/response/resources' &&
               location !== '/risk-assessment/thresholds' && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">{pageTitle}</h2>
                  <p className="mb-4">This module is under development. It will provide tools and features for {pageTitle.toLowerCase()} management.</p>
                  
                  <ul className="list-disc pl-5 mb-6 space-y-2">
                    <li>Configure and manage {pageTitle.toLowerCase()} settings</li>
                    <li>View historical data and analytics</li>
                    <li>Integrate with other EWERS modules</li>
                    <li>Generate reports and notifications</li>
                    <li>Customize access and permissions</li>
                  </ul>
                  
                  <div className={`bg-${moduleColor}-50 p-4 rounded`}>
                    <p className={`text-${moduleColor}-700 font-medium`}>Coming Soon</p>
                    <p className={`text-${moduleColor}-600 text-sm`}>This feature is scheduled for development in the next sprint.</p>
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