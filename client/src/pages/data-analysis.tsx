import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import { useSidebar } from '@/contexts/sidebar-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Info, Database, Brain, Filter, TrendingUp, ChevronRight } from 'lucide-react';
import { capitalize } from '@/lib/utils';
import { getTrendAnalysis } from '@/lib/openai';

// Helper functions for risk level styling
function getRiskLevelColor(riskLevel: string): string {
  switch (riskLevel.toLowerCase()) {
    case 'critical': return 'bg-red-500';
    case 'high': return 'bg-orange-500';
    case 'medium': return 'bg-amber-500';
    case 'low': return 'bg-green-500';
    default: return 'bg-blue-500';
  }
}

function getRiskLevelTextColor(riskLevel: string): string {
  switch (riskLevel.toLowerCase()) {
    case 'critical': return 'text-red-700';
    case 'high': return 'text-orange-700';
    case 'medium': return 'text-amber-700';
    case 'low': return 'text-green-700';
    default: return 'text-blue-700';
  }
}

export default function DataAnalysis() {
  const [location] = useLocation();
  const { isOpen } = useSidebar();
  const [pageTitle, setPageTitle] = useState('Data Analysis');
  const [pageDescription, setPageDescription] = useState('Analyze and process collected data for early warning insights');
  
  // AI Analysis state
  const [isOpenAIConfigured] = useState(false); // In production, check if OPENAI_API_KEY exists
  const [aiAnalysisLoading, setAiAnalysisLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<{
    insights: string;
    recommendations: string;
    riskLevel: 'critical' | 'high' | 'medium' | 'low';
    confidence: number;
  } | null>(null);
  const [trendData, setTrendData] = useState<any>(null);
  
  // Function to fetch trend data and generate AI insights
  async function generateAIInsights() {
    setAiAnalysisLoading(true);
    try {
      // First, fetch trend data if we don't have it yet
      if (!trendData) {
        const response = await fetch('/api/test/trend-data');
        const data = await response.json();
        setTrendData(data);
      }
      
      // Then get AI analysis based on the trend data
      const analysis = await getTrendAnalysis(trendData || {});
      setAiAnalysis(analysis);
    } catch (error) {
      console.error('Error generating AI insights:', error);
    } finally {
      setAiAnalysisLoading(false);
    }
  }
  
  // Determine the current sub-page based on the location
  useEffect(() => {
    switch (location) {
      case '/data-analysis/data-cleaning':
        setPageTitle('Data Cleaning');
        setPageDescription('Clean and preprocess data for analysis');
        break;
      case '/data-analysis/risk-indicators':
        setPageTitle('Risk Indicators');
        setPageDescription('Configure and monitor early warning indicators');
        break;
      case '/data-analysis/trend-analysis':
        setPageTitle('Trend Analysis');
        setPageDescription('Analyze patterns and trends in historical data');
        break;
      case '/data-analysis/ai-prediction':
        setPageTitle('AI Prediction Models');
        setPageDescription('Machine learning models for predicting conflict emergence');
        break;
      default:
        setPageTitle('Data Analysis');
        setPageDescription('Analyze and process collected data for early warning insights');
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
              
              {location === '/data-analysis' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="bg-blue-50">
                      <CardTitle className="flex items-center text-blue-700">
                        <Filter className="mr-2 h-5 w-5" />
                        Data Cleaning
                      </CardTitle>
                      <CardDescription>Preprocess and clean collected data</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-neutral-600 text-sm mb-4">
                        Clean, normalize, and validate data to ensure accuracy for analysis.
                      </p>
                      <Button 
                        variant="outline" 
                        className="w-full flex justify-between items-center"
                        onClick={() => window.location.href = '/data-analysis/data-cleaning'}
                      >
                        Access Module <ChevronRight className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="bg-purple-50">
                      <CardTitle className="flex items-center text-purple-700">
                        <Database className="mr-2 h-5 w-5" />
                        Risk Indicators
                      </CardTitle>
                      <CardDescription>Monitor early warning indicators</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-neutral-600 text-sm mb-4">
                        Define, track, and evaluate key risk indicators for early warning.
                      </p>
                      <Button 
                        variant="outline" 
                        className="w-full flex justify-between items-center"
                        onClick={() => window.location.href = '/data-analysis/risk-indicators'}
                      >
                        Access Module <ChevronRight className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="bg-green-50">
                      <CardTitle className="flex items-center text-green-700">
                        <TrendingUp className="mr-2 h-5 w-5" />
                        Trend Analysis
                      </CardTitle>
                      <CardDescription>Analyze patterns and historical data</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-neutral-600 text-sm mb-4">
                        Identify patterns, trends, and anomalies in historical conflict data.
                      </p>
                      <Button 
                        variant="outline" 
                        className="w-full flex justify-between items-center"
                        onClick={() => window.location.href = '/data-analysis/trend-analysis'}
                      >
                        Access Module <ChevronRight className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="bg-red-50">
                      <CardTitle className="flex items-center text-red-700">
                        <Brain className="mr-2 h-5 w-5" />
                        AI Prediction Models
                      </CardTitle>
                      <CardDescription>Machine learning for conflict prediction</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-neutral-600 text-sm mb-4">
                        Advanced AI models to predict conflict emergence and escalation.
                      </p>
                      <Button 
                        variant="outline" 
                        className="w-full flex justify-between items-center"
                        onClick={() => window.location.href = '/data-analysis/ai-prediction'}
                      >
                        Access Module <ChevronRight className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {location === '/data-analysis/data-cleaning' && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">Data Cleaning Module</h2>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-gray-600">Clean and preprocess data to ensure quality for analysis and reporting</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline">Import Data</Button>
                      <Button className="bg-blue-600 hover:bg-blue-700">Run Cleaner</Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-blue-50 px-4 py-3 border-b">
                        <h3 className="font-medium text-blue-700">Data Quality Issues</h3>
                      </div>
                      <div className="p-4">
                        <ul className="space-y-4">
                          <li className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                              <span className="text-sm">Duplicate entries</span>
                            </div>
                            <span className="text-sm font-medium">42 issues</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                              <span className="text-sm">Missing coordinates</span>
                            </div>
                            <span className="text-sm font-medium">67 issues</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                              <span className="text-sm">Inconsistent location names</span>
                            </div>
                            <span className="text-sm font-medium">28 issues</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                              <span className="text-sm">Incomplete incident descriptions</span>
                            </div>
                            <span className="text-sm font-medium">15 issues</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span className="text-sm">Date format inconsistencies</span>
                            </div>
                            <span className="text-sm font-medium">4 issues</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-blue-50 px-4 py-3 border-b">
                        <h3 className="font-medium text-blue-700">Cleaning Actions</h3>
                      </div>
                      <div className="p-4">
                        <div className="space-y-3">
                          <div>
                            <label className="flex items-center space-x-2 mb-1">
                              <input type="checkbox" className="rounded text-blue-500 focus:ring-blue-500" checked />
                              <span className="text-sm font-medium">Remove duplicate entries</span>
                            </label>
                            <p className="text-xs text-gray-500 ml-5">Identify and remove duplicate incident reports based on matching timestamps, locations, and descriptions.</p>
                          </div>
                          
                          <div>
                            <label className="flex items-center space-x-2 mb-1">
                              <input type="checkbox" className="rounded text-blue-500 focus:ring-blue-500" checked />
                              <span className="text-sm font-medium">Geocode missing locations</span>
                            </label>
                            <p className="text-xs text-gray-500 ml-5">Use Google Maps API to geocode location names and fill in missing coordinates.</p>
                          </div>
                          
                          <div>
                            <label className="flex items-center space-x-2 mb-1">
                              <input type="checkbox" className="rounded text-blue-500 focus:ring-blue-500" checked />
                              <span className="text-sm font-medium">Standardize location names</span>
                            </label>
                            <p className="text-xs text-gray-500 ml-5">Match location names against our gazetteer to ensure consistency.</p>
                          </div>
                          
                          <div>
                            <label className="flex items-center space-x-2 mb-1">
                              <input type="checkbox" className="rounded text-blue-500 focus:ring-blue-500" />
                              <span className="text-sm font-medium">Generate descriptions for incomplete reports</span>
                            </label>
                            <p className="text-xs text-gray-500 ml-5">Use AI to expand incomplete incident descriptions based on available data.</p>
                          </div>
                          
                          <div>
                            <label className="flex items-center space-x-2 mb-1">
                              <input type="checkbox" className="rounded text-blue-500 focus:ring-blue-500" checked />
                              <span className="text-sm font-medium">Standardize date/time formats</span>
                            </label>
                            <p className="text-xs text-gray-500 ml-5">Convert all timestamps to ISO 8601 format for consistency.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-medium mb-3">Data Preview (After Cleaning)</h3>
                    <div className="border rounded overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coordinates</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                              <td className="px-3 py-2 text-xs">INC-2025-0105</td>
                              <td className="px-3 py-2 text-xs">2025-03-28T14:22:00Z</td>
                              <td className="px-3 py-2 text-xs">Civil Unrest</td>
                              <td className="px-3 py-2 text-xs">Lagos, Western Region</td>
                              <td className="px-3 py-2 text-xs">6.4550° N, 3.3841° E</td>
                              <td className="px-3 py-2 text-xs"><span className="px-1.5 py-0.5 text-xs rounded-full bg-green-100 text-green-800">Clean</span></td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2 text-xs">INC-2025-0106</td>
                              <td className="px-3 py-2 text-xs">2025-03-28T10:15:00Z</td>
                              <td className="px-3 py-2 text-xs">Displacement</td>
                              <td className="px-3 py-2 text-xs">Maiduguri, Northern Region</td>
                              <td className="px-3 py-2 text-xs">11.8311° N, 13.1511° E</td>
                              <td className="px-3 py-2 text-xs"><span className="px-1.5 py-0.5 text-xs rounded-full bg-green-100 text-green-800">Clean</span></td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2 text-xs">INC-2025-0107</td>
                              <td className="px-3 py-2 text-xs">2025-03-27T18:40:00Z</td>
                              <td className="px-3 py-2 text-xs">Infrastructure</td>
                              <td className="px-3 py-2 text-xs">Abuja, Central Region</td>
                              <td className="px-3 py-2 text-xs">9.0765° N, 7.3986° E</td>
                              <td className="px-3 py-2 text-xs"><span className="px-1.5 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">Updated</span></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded">
                    <h3 className="font-medium mb-2">Automatic Cleaning Schedule</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Data cleaning runs automatically every 12 hours</p>
                        <p className="text-xs text-gray-500 mt-1">Next scheduled run: March 31, 2025 20:00 UTC</p>
                      </div>
                      <div>
                        <Button variant="outline" size="sm">Change Schedule</Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {location === '/data-analysis/risk-indicators' && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">Risk Indicators Module</h2>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-gray-600">Configure and monitor early warning indicators to identify emerging risks</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline">View Documentation</Button>
                      <Button className="bg-purple-600 hover:bg-purple-700">New Indicator</Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div className="col-span-1 lg:col-span-2">
                      <h3 className="font-medium mb-3">Active Risk Indicators</h3>
                      <div className="border rounded overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Indicator</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Value</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Threshold</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr>
                                <td className="px-3 py-2 text-xs font-medium">Social Media Sentiment</td>
                                <td className="px-3 py-2 text-xs">Social</td>
                                <td className="px-3 py-2 text-xs">-0.65</td>
                                <td className="px-3 py-2 text-xs">-0.50</td>
                                <td className="px-3 py-2 text-xs"><span className="px-1.5 py-0.5 text-xs rounded-full bg-red-100 text-red-800">Alert</span></td>
                                <td className="px-3 py-2 text-xs space-x-1">
                                  <Button size="sm" variant="outline" className="h-6 px-2 text-xs">Edit</Button>
                                  <Button size="sm" variant="outline" className="h-6 px-2 text-xs">History</Button>
                                </td>
                              </tr>
                              <tr>
                                <td className="px-3 py-2 text-xs font-medium">Protest Frequency</td>
                                <td className="px-3 py-2 text-xs">Political</td>
                                <td className="px-3 py-2 text-xs">6 per week</td>
                                <td className="px-3 py-2 text-xs">5 per week</td>
                                <td className="px-3 py-2 text-xs"><span className="px-1.5 py-0.5 text-xs rounded-full bg-red-100 text-red-800">Alert</span></td>
                                <td className="px-3 py-2 text-xs space-x-1">
                                  <Button size="sm" variant="outline" className="h-6 px-2 text-xs">Edit</Button>
                                  <Button size="sm" variant="outline" className="h-6 px-2 text-xs">History</Button>
                                </td>
                              </tr>
                              <tr>
                                <td className="px-3 py-2 text-xs font-medium">Communal Violence</td>
                                <td className="px-3 py-2 text-xs">Security</td>
                                <td className="px-3 py-2 text-xs">3 incidents</td>
                                <td className="px-3 py-2 text-xs">5 incidents</td>
                                <td className="px-3 py-2 text-xs"><span className="px-1.5 py-0.5 text-xs rounded-full bg-green-100 text-green-800">Normal</span></td>
                                <td className="px-3 py-2 text-xs space-x-1">
                                  <Button size="sm" variant="outline" className="h-6 px-2 text-xs">Edit</Button>
                                  <Button size="sm" variant="outline" className="h-6 px-2 text-xs">History</Button>
                                </td>
                              </tr>
                              <tr>
                                <td className="px-3 py-2 text-xs font-medium">Food Price Increase</td>
                                <td className="px-3 py-2 text-xs">Economic</td>
                                <td className="px-3 py-2 text-xs">18% monthly</td>
                                <td className="px-3 py-2 text-xs">15% monthly</td>
                                <td className="px-3 py-2 text-xs"><span className="px-1.5 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800">Warning</span></td>
                                <td className="px-3 py-2 text-xs space-x-1">
                                  <Button size="sm" variant="outline" className="h-6 px-2 text-xs">Edit</Button>
                                  <Button size="sm" variant="outline" className="h-6 px-2 text-xs">History</Button>
                                </td>
                              </tr>
                              <tr>
                                <td className="px-3 py-2 text-xs font-medium">Displacement Rate</td>
                                <td className="px-3 py-2 text-xs">Humanitarian</td>
                                <td className="px-3 py-2 text-xs">240 people/day</td>
                                <td className="px-3 py-2 text-xs">500 people/day</td>
                                <td className="px-3 py-2 text-xs"><span className="px-1.5 py-0.5 text-xs rounded-full bg-green-100 text-green-800">Normal</span></td>
                                <td className="px-3 py-2 text-xs space-x-1">
                                  <Button size="sm" variant="outline" className="h-6 px-2 text-xs">Edit</Button>
                                  <Button size="sm" variant="outline" className="h-6 px-2 text-xs">History</Button>
                                </td>
                              </tr>
                              <tr>
                                <td className="px-3 py-2 text-xs font-medium">Water Scarcity Reports</td>
                                <td className="px-3 py-2 text-xs">Environmental</td>
                                <td className="px-3 py-2 text-xs">12 reports</td>
                                <td className="px-3 py-2 text-xs">10 reports</td>
                                <td className="px-3 py-2 text-xs"><span className="px-1.5 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800">Warning</span></td>
                                <td className="px-3 py-2 text-xs space-x-1">
                                  <Button size="sm" variant="outline" className="h-6 px-2 text-xs">Edit</Button>
                                  <Button size="sm" variant="outline" className="h-6 px-2 text-xs">History</Button>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-span-1">
                      <h3 className="font-medium mb-3">Risk Dashboard</h3>
                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium text-gray-700">Overall Risk Level</h4>
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Medium</span>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-xs font-medium text-gray-700">Political</span>
                                <span className="text-xs text-red-600 font-medium">High</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div className="bg-red-500 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-xs font-medium text-gray-700">Economic</span>
                                <span className="text-xs text-yellow-600 font-medium">Medium</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: '55%' }}></div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-xs font-medium text-gray-700">Security</span>
                                <span className="text-xs text-green-600 font-medium">Low</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '30%' }}></div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-xs font-medium text-gray-700">Social</span>
                                <span className="text-xs text-red-600 font-medium">High</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div className="bg-red-500 h-1.5 rounded-full" style={{ width: '80%' }}></div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-xs font-medium text-gray-700">Environmental</span>
                                <span className="text-xs text-yellow-600 font-medium">Medium</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-xs font-medium text-gray-700">Humanitarian</span>
                                <span className="text-xs text-green-600 font-medium">Low</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '25%' }}></div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-xs text-gray-500 mb-3">Active alerts by region</p>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-xs">Northern Region</span>
                                <span className="bg-red-100 text-red-800 text-xs px-1.5 py-0.5 rounded-full">4 alerts</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs">Western Region</span>
                                <span className="bg-yellow-100 text-yellow-800 text-xs px-1.5 py-0.5 rounded-full">2 alerts</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs">Eastern Region</span>
                                <span className="bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded-full">0 alerts</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs">Southern Region</span>
                                <span className="bg-yellow-100 text-yellow-800 text-xs px-1.5 py-0.5 rounded-full">1 alert</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-medium mb-3">Composite Risk Indicators</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">Political Instability Index</h4>
                          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">High Risk</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Combines protest frequency, political statements, and public sentiment indicators</p>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Updated: 2 hours ago</span>
                          <Button size="sm" variant="outline" className="h-6 px-2 text-xs">View Details</Button>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">Resource Conflict Potential</h4>
                          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Medium Risk</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Combines water scarcity, food prices, and resource dispute indicators</p>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Updated: 6 hours ago</span>
                          <Button size="sm" variant="outline" className="h-6 px-2 text-xs">View Details</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">Indicator Templates</h3>
                      <Button size="sm" variant="outline">
                        Manage Templates
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-purple-50 p-3 rounded-md border border-purple-200">
                        <h4 className="font-medium text-purple-800 mb-1">Electoral Violence Monitoring</h4>
                        <p className="text-xs text-purple-700 mb-2">Pre-configured indicator set for election periods</p>
                        <Button size="sm" variant="outline" className="h-6 px-2 text-xs w-full">Apply Template</Button>
                      </div>
                      
                      <div className="bg-purple-50 p-3 rounded-md border border-purple-200">
                        <h4 className="font-medium text-purple-800 mb-1">Ethnic Tensions</h4>
                        <p className="text-xs text-purple-700 mb-2">Indicators for monitoring ethnic or religious conflicts</p>
                        <Button size="sm" variant="outline" className="h-6 px-2 text-xs w-full">Apply Template</Button>
                      </div>
                      
                      <div className="bg-purple-50 p-3 rounded-md border border-purple-200">
                        <h4 className="font-medium text-purple-800 mb-1">Resource Scarcity</h4>
                        <p className="text-xs text-purple-700 mb-2">Water, land, and resource-based conflict indicators</p>
                        <Button size="sm" variant="outline" className="h-6 px-2 text-xs w-full">Apply Template</Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {location === '/data-analysis/trend-analysis' && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">Trend Analysis Module</h2>
                  <p className="mb-4">Identify patterns, trends, and anomalies in historical conflict data to predict future events.</p>
                  
                  {/* Analysis Options */}
                  <div className="flex flex-wrap gap-3 mb-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Analysis Type</label>
                      <select className="w-full text-sm p-2 border border-gray-300 rounded-md">
                        <option value="time_series">Time Series Analysis</option>
                        <option value="regional">Regional Distribution</option>
                        <option value="incident_type">Incident Type Comparison</option>
                        <option value="correlation">Factor Correlation</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Time Period</label>
                      <select className="w-full text-sm p-2 border border-gray-300 rounded-md">
                        <option value="1m">Last Month</option>
                        <option value="3m" selected>Last 3 Months</option>
                        <option value="6m">Last 6 Months</option>
                        <option value="1y">Last Year</option>
                        <option value="5y">Last 5 Years</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Data Resolution</label>
                      <select className="w-full text-sm p-2 border border-gray-300 rounded-md">
                        <option value="daily">Daily</option>
                        <option value="weekly" selected>Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <Button className="bg-blue-600 hover:bg-blue-700">Apply Filters</Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div className="lg:col-span-2">
                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-blue-50 px-4 py-3 border-b flex justify-between items-center">
                          <h3 className="font-medium text-blue-700">Time Series Analysis</h3>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="text-xs h-7">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="8" y1="12" x2="16" y2="12"></line>
                                <line x1="12" y1="16" x2="12" y2="8"></line>
                              </svg>
                              <span className="ml-1">Zoom</span>
                            </Button>
                            <Button variant="outline" size="sm" className="text-xs h-7">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                              </svg>
                              <span className="ml-1">Detail</span>
                            </Button>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex flex-col space-y-4">
                            <div className="flex flex-wrap gap-3 mb-2">
                              <Button variant="outline" size="sm" className="text-xs">All Incidents</Button>
                              <Button variant="outline" size="sm" className="text-xs bg-blue-50">Violent Conflicts</Button>
                              <Button variant="outline" size="sm" className="text-xs">Protests</Button>
                              <Button variant="outline" size="sm" className="text-xs">Terrorism</Button>
                              <Button variant="outline" size="sm" className="text-xs">Displacement</Button>
                            </div>
                            
                            <div className="h-64 bg-gray-50 rounded-lg border flex items-center justify-center relative">
                              {/* Interactive Time Series Chart with Animation */}
                              <div className="absolute top-2 right-2 z-10 bg-white/80 text-xs px-2 py-1 rounded border shadow-sm">
                                <div className="flex items-center gap-1">
                                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                                  <span>Current</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                                  <span>Historical Average</span>
                                </div>
                              </div>
                              
                              <div className="w-full h-full px-2 relative">
                                {/* Enhanced Time Series Chart with Animation Effect */}
                                <svg width="100%" height="100%" viewBox="0 0 800 300" preserveAspectRatio="none">
                                  {/* Background Grid */}
                                  <defs>
                                    <pattern id="smallGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f3f4f6" strokeWidth="0.5" />
                                    </pattern>
                                    <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                                      <rect width="80" height="80" fill="url(#smallGrid)" />
                                      <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                                    </pattern>
                                  </defs>
                                  
                                  <rect width="100%" height="100%" fill="url(#grid)" />
                                  
                                  {/* Month markers with improved styling */}
                                  <line x1="0" y1="290" x2="800" y2="290" stroke="#94a3b8" strokeWidth="1" />
                                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                    <g key={i}>
                                      <line x1={i*100} y1="285" x2={i*100} y2="295" stroke="#94a3b8" strokeWidth="1" />
                                      <text x={i*100} y="320" fontSize="10" textAnchor="middle" fill="#64748b" fontFamily="sans-serif">
                                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'][i]}
                                      </text>
                                    </g>
                                  ))}
                                  
                                  {/* Average line (historical) with animation */}
                                  <path 
                                    d="M0,170 L100,180 L200,165 L300,190 L400,200 L500,170 L600,180 L700,190 L800,170" 
                                    fill="none" 
                                    stroke="#94a3b8" 
                                    strokeWidth="2" 
                                    strokeDasharray="5,5"
                                  />
                                  
                                  {/* Current trend line with animation */}
                                  <path 
                                    d="M0,200 L100,220 L200,180 L300,250 L400,100 L500,150 L600,80 L700,120 L800,70" 
                                    fill="none" 
                                    stroke="#ef4444" 
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <animate 
                                      attributeName="stroke-dashoffset" 
                                      from="1000" 
                                      to="0" 
                                      dur="1.5s" 
                                      begin="0s" 
                                      fill="freeze"
                                    />
                                    <animate 
                                      attributeName="stroke-dasharray" 
                                      from="0,1000" 
                                      to="1000,0" 
                                      dur="1.5s" 
                                      begin="0s" 
                                      fill="freeze"
                                    />
                                  </path>
                                  
                                  {/* Forecast area (with gradient and animation) */}
                                  <defs>
                                    <linearGradient id="trendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
                                      <stop offset="100%" stopColor="#ef4444" stopOpacity="0.05" />
                                    </linearGradient>
                                  </defs>
                                  
                                  {/* Forecast section (dashed) */}
                                  <path 
                                    d="M600,80 L700,120 L800,70" 
                                    fill="none" 
                                    stroke="#ef4444" 
                                    strokeWidth="3" 
                                    strokeDasharray="6,3"
                                    opacity="0.7"
                                  />
                                  
                                  {/* Confidence interval */}
                                  <path 
                                    d="M600,100 L700,140 L800,100 L800,50 L700,100 L600,60 Z" 
                                    fill="url(#trendGradient)"
                                    opacity="0.6"
                                  >
                                    <animate 
                                      attributeName="opacity" 
                                      from="0" 
                                      to="0.6" 
                                      dur="1s" 
                                      begin="1s" 
                                      fill="freeze"
                                    />
                                  </path>
                                  
                                  {/* Anomaly detection points with pulsating animation */}
                                  <circle cx="400" cy="100" r="5" fill="#ef4444">
                                    <animate
                                      attributeName="r"
                                      values="5;7;5"
                                      dur="1.5s"
                                      repeatCount="indefinite"
                                    />
                                    <animate
                                      attributeName="opacity"
                                      values="1;0.8;1"
                                      dur="1.5s"
                                      repeatCount="indefinite"
                                    />
                                  </circle>
                                  <circle cx="600" cy="80" r="5" fill="#ef4444">
                                    <animate
                                      attributeName="r"
                                      values="5;7;5"
                                      dur="1.5s"
                                      repeatCount="indefinite"
                                    />
                                    <animate
                                      attributeName="opacity"
                                      values="1;0.8;1"
                                      dur="1.5s"
                                      repeatCount="indefinite"
                                    />
                                  </circle>
                                  
                                  {/* Tooltip on hover point */}
                                  <g transform="translate(400, 70)">
                                    <rect x="-40" y="-30" width="80" height="25" rx="4" fill="#18181b" opacity="0.9" />
                                    <text x="0" y="-15" fontSize="10" textAnchor="middle" fill="#ffffff" fontFamily="sans-serif">April 15, 2025</text>
                                    <text x="0" y="-5" fontSize="10" textAnchor="middle" fill="#ffffff" fontFamily="sans-serif" fontWeight="bold">
                                      +136% vs. Average
                                    </text>
                                    <line x1="0" y1="0" x2="0" y2="30" stroke="#18181b" strokeWidth="1" strokeDasharray="2,1" />
                                  </g>
                                </svg>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                                <div className="flex justify-between items-center">
                                  <h4 className="text-xs font-medium text-gray-700">ANOMALIES DETECTED</h4>
                                  <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center">
                                    <span className="text-xs font-semibold text-red-700">2</span>
                                  </div>
                                </div>
                                <p className="text-xs text-red-700 mt-1">Significant spikes in April and June exceeding 3σ threshold</p>
                              </div>
                              
                              <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                                <div className="flex justify-between items-center">
                                  <h4 className="text-xs font-medium text-gray-700">FORECAST TREND</h4>
                                  <div className="text-amber-600 text-xs font-semibold">+27.3%</div>
                                </div>
                                <p className="text-xs text-amber-700 mt-1">Projected increase over next 30 days (87% confidence)</p>
                              </div>
                              
                              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                <div className="flex justify-between items-center">
                                  <h4 className="text-xs font-medium text-gray-700">RELATED FACTORS</h4>
                                  <Button variant="ghost" size="sm" className="h-6 text-xs text-blue-700 p-0">View</Button>
                                </div>
                                <p className="text-xs text-blue-700 mt-1">Social media activity, economic indicators</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-blue-50 px-4 py-3 border-b">
                          <h3 className="font-medium text-blue-700">Trend Metrics</h3>
                        </div>
                        <div className="p-4">
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-gray-700">Month-over-Month Change</span>
                                <span className="text-sm font-medium text-red-600">+12.3%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-red-500 h-2 rounded-full" style={{ width: '62%' }}>
                                  <animate
                                    attributeName="width"
                                    from="0%"
                                    to="62%"
                                    dur="1s"
                                    fill="freeze"
                                  />
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-gray-700">Seasonal Trend</span>
                                <span className="text-sm font-medium text-green-600">-3.7%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '43%' }}>
                                  <animate
                                    attributeName="width"
                                    from="0%"
                                    to="43%"
                                    dur="1s"
                                    fill="freeze"
                                  />
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-gray-700">Predictive Confidence</span>
                                <span className="text-sm font-medium text-blue-600">87%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '87%' }}>
                                  <animate
                                    attributeName="width"
                                    from="0%"
                                    to="87%"
                                    dur="1s"
                                    fill="freeze"
                                  />
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-gray-700">Data Quality</span>
                                <span className="text-sm font-medium text-amber-600">72%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '72%' }}>
                                  <animate
                                    attributeName="width"
                                    from="0%"
                                    to="72%"
                                    dur="1s"
                                    fill="freeze"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-blue-50 px-4 py-3 border-b flex justify-between items-center">
                          <h3 className="font-medium text-blue-700">AI Insights</h3>
                          <div className="bg-blue-200 text-blue-800 text-xs py-1 px-2 rounded">
                            Powered by GPT-4o
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="space-y-3">
                            {false ? ( // Using false instead of isOpenAIConfigured for testing
                              <>
                                <div className="flex items-center gap-2 text-sm text-amber-700 mb-3">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                  </svg>
                                  <span>OpenAI API key not configured</span>
                                </div>
                                <p className="text-sm text-gray-600">
                                  Request AI analysis of current trend patterns and prediction recommendations.
                                </p>
                              </>
                            ) : aiAnalysisLoading ? (
                              <div className="flex flex-col items-center justify-center py-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
                                <p className="text-sm text-gray-600 mt-2">Analyzing trends...</p>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-center gap-2 mb-2">
                                  <div className={`w-2 h-2 rounded-full ${getRiskLevelColor(aiAnalysis?.riskLevel || 'medium')}`}></div>
                                  <span className={`text-sm font-medium ${getRiskLevelTextColor(aiAnalysis?.riskLevel || 'medium')}`}>
                                    {capitalize(aiAnalysis?.riskLevel || 'Medium')} Risk Level
                                  </span>
                                  <span className="text-xs text-gray-500 ml-auto">
                                    {aiAnalysis?.confidence || 0}% confidence
                                  </span>
                                </div>
                                
                                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                  <h4 className="text-sm font-medium text-blue-800 mb-1">Key Insights</h4>
                                  <p className="text-xs text-blue-700">
                                    {aiAnalysis?.insights || 'No insights available'}
                                  </p>
                                </div>
                              </>
                            )}
                            
                            <div className="flex space-x-2">
                              <Button 
                                onClick={generateAIInsights} 
                                className="bg-blue-600 hover:bg-blue-700 text-xs"
                                disabled={aiAnalysisLoading}
                              >
                                {aiAnalysisLoading ? 'Analyzing...' : 'Generate Insights'}
                              </Button>
                              <Button 
                                variant="outline" 
                                className="text-xs"
                                onClick={() => setAiAnalysis(null)}
                                disabled={!aiAnalysis || aiAnalysisLoading}
                              >
                                Reset
                              </Button>
                            </div>
                            
                            {aiAnalysis?.recommendations && (
                              <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                                <h4 className="text-sm font-medium text-amber-800 mb-1">AI Recommendations</h4>
                                <div className="text-xs text-amber-700 whitespace-pre-line">
                                  {aiAnalysis.recommendations}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg overflow-hidden mb-6">
                    <div className="bg-blue-50 px-4 py-3 border-b flex justify-between items-center">
                      <h3 className="font-medium text-blue-700">Regional Risk Analysis</h3>
                      <select className="text-xs border border-blue-200 rounded px-2 py-1 bg-white">
                        <option value="all">All Regions</option>
                        <option value="north">Northern</option>
                        <option value="south">Southern</option>
                        <option value="east">Eastern</option>
                        <option value="west">Western</option>
                      </select>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div className="bg-white p-3 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Northern Region</h4>
                          <div className="flex justify-between items-center">
                            <div className="text-2xl font-bold text-red-600">32%</div>
                            <div className="text-xs text-red-500 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="18 15 12 9 6 15"></polyline>
                              </svg>
                              8.4%
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Increase in conflict incidents</p>
                          <div className="mt-2 pt-2 border-t">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-500">Risk Level:</span>
                              <span className="font-medium text-red-600">High</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white p-3 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Southern Region</h4>
                          <div className="flex justify-between items-center">
                            <div className="text-2xl font-bold text-green-600">4%</div>
                            <div className="text-xs text-green-500 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9"></polyline>
                              </svg>
                              2.1%
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Decrease in conflict incidents</p>
                          <div className="mt-2 pt-2 border-t">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-500">Risk Level:</span>
                              <span className="font-medium text-green-600">Low</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white p-3 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Eastern Region</h4>
                          <div className="flex justify-between items-center">
                            <div className="text-2xl font-bold text-amber-600">12%</div>
                            <div className="text-xs text-amber-500 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="18 15 12 9 6 15"></polyline>
                              </svg>
                              1.7%
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Moderate increase in activity</p>
                          <div className="mt-2 pt-2 border-t">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-500">Risk Level:</span>
                              <span className="font-medium text-amber-600">Medium</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white p-3 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Western Region</h4>
                          <div className="flex justify-between items-center">
                            <div className="text-2xl font-bold text-blue-600">8%</div>
                            <div className="text-xs text-blue-500 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                              </svg>
                              0.3%
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Stable with minor fluctuations</p>
                          <div className="mt-2 pt-2 border-t">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-500">Risk Level:</span>
                              <span className="font-medium text-blue-600">Stable</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg border p-3">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-sm font-medium text-gray-700">Key Insights</h4>
                          <Button variant="ghost" size="sm" className="h-6 text-xs">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                              <polyline points="7 10 12 15 17 10"></polyline>
                              <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            Export
                          </Button>
                        </div>
                        <ul className="text-sm text-gray-600 space-y-1 list-disc pl-4">
                          <li>Northern regions showing concerning upward trend requiring immediate attention</li>
                          <li>Southern stabilization measures appear to be effective</li>
                          <li>Eastern region showing early warning signs that should be monitored</li>
                          <li>Cyclical patterns detected in Western region align with seasonal expectations</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Button variant="outline" className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="7 10 12 15 17 10"></polyline>
                          <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        Export Data
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="8" x2="8" y2="8"></line>
                          <line x1="16" y1="16" x2="8" y2="16"></line>
                          <line x1="10" y1="12" x2="3" y2="12"></line>
                          <line x1="21" y1="12" x2="14" y2="12"></line>
                        </svg>
                        Print Report
                      </Button>
                    </div>
                    <div className="space-x-3">
                      <Button variant="outline" className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        Schedule Analysis
                      </Button>
                      <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"></path>
                        </svg>
                        Generate Alert
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {location === '/data-analysis/ai-prediction' && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">AI Prediction Models Module</h2>
                  <p className="mb-4">Deploy and manage AI-driven predictive models for conflict forecasting and early warning.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="col-span-2 border rounded-lg overflow-hidden">
                      <div className="bg-red-50 px-4 py-3 border-b">
                        <h3 className="font-medium text-red-700">Model Performance Dashboard</h3>
                      </div>
                      <div className="p-4">
                        <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-gray-50 p-3 rounded-lg border">
                            <h4 className="text-xs font-medium text-gray-500 uppercase">Active Models</h4>
                            <div className="mt-1 flex items-end">
                              <div className="text-2xl font-bold text-gray-800">3</div>
                              <div className="text-xs text-green-600 ml-2 mb-1">
                                <span className="mr-1">↑</span>1 new
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 p-3 rounded-lg border">
                            <h4 className="text-xs font-medium text-gray-500 uppercase">Avg. Accuracy</h4>
                            <div className="mt-1 flex items-end">
                              <div className="text-2xl font-bold text-gray-800">82.7%</div>
                              <div className="text-xs text-green-600 ml-2 mb-1">
                                <span className="mr-1">↑</span>3.2%
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 p-3 rounded-lg border">
                            <h4 className="text-xs font-medium text-gray-500 uppercase">Predictions This Month</h4>
                            <div className="mt-1 flex items-end">
                              <div className="text-2xl font-bold text-gray-800">247</div>
                              <div className="text-xs text-amber-600 ml-2 mb-1">
                                <span className="mr-1">↑</span>14.3%
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg mb-4">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Model Name</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Accuracy</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Run</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr>
                                <td className="px-4 py-3 text-sm text-gray-900">ConflictNet-V3</td>
                                <td className="px-4 py-3 text-sm text-gray-500">Time Series (LSTM)</td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center">
                                    <span className="text-sm font-medium text-gray-900 mr-2">86.4%</span>
                                    <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                      <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '86.4%' }}></div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-500">Today, 09:45 AM</td>
                                <td className="px-4 py-3 text-sm">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    Active
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 text-sm text-gray-900">RegionalForecaster</td>
                                <td className="px-4 py-3 text-sm text-gray-500">Ensemble (XGBoost)</td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center">
                                    <span className="text-sm font-medium text-gray-900 mr-2">82.1%</span>
                                    <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                      <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '82.1%' }}></div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-500">Yesterday, 6:30 PM</td>
                                <td className="px-4 py-3 text-sm">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    Active
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 text-sm text-gray-900">TrendPredictor-2023</td>
                                <td className="px-4 py-3 text-sm text-gray-500">Neural Network</td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center">
                                    <span className="text-sm font-medium text-gray-900 mr-2">79.5%</span>
                                    <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                      <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: '79.5%' }}></div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-500">2 days ago</td>
                                <td className="px-4 py-3 text-sm">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    Active
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 text-sm text-gray-900">SentimentAnalyzer-Pro</td>
                                <td className="px-4 py-3 text-sm text-gray-500">NLP (BERT)</td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center">
                                    <span className="text-sm font-medium text-gray-900 mr-2">73.8%</span>
                                    <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                      <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: '73.8%' }}></div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-500">1 week ago</td>
                                <td className="px-4 py-3 text-sm">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                    Training
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <Button variant="outline" size="sm">Deploy New Model</Button>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">View All Models</Button>
                            <Button size="sm" className="bg-red-600 hover:bg-red-700">Run Prediction</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-red-50 px-4 py-3 border-b">
                        <h3 className="font-medium text-red-700">Current Predictions</h3>
                      </div>
                      <div className="p-4">
                        <div className="space-y-4">
                          <div className="bg-gray-50 p-3 rounded-lg border">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="text-sm font-medium text-gray-800">Conflict Escalation Risk</h4>
                                <p className="text-xs text-gray-500 mt-0.5">Northern Region</p>
                              </div>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                High Risk
                              </span>
                            </div>
                            <div className="mt-2">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-red-600 h-2.5 rounded-full" style={{ width: '78%' }}></div>
                              </div>
                              <div className="flex justify-between mt-1">
                                <span className="text-xs text-gray-500">Probability</span>
                                <span className="text-xs font-medium text-gray-700">78%</span>
                              </div>
                            </div>
                            <div className="mt-2 text-xs text-gray-600">
                              <span className="font-medium">Model:</span> ConflictNet-V3
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 p-3 rounded-lg border">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="text-sm font-medium text-gray-800">Social Unrest Probability</h4>
                                <p className="text-xs text-gray-500 mt-0.5">Urban Centers</p>
                              </div>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                Medium Risk
                              </span>
                            </div>
                            <div className="mt-2">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '42%' }}></div>
                              </div>
                              <div className="flex justify-between mt-1">
                                <span className="text-xs text-gray-500">Probability</span>
                                <span className="text-xs font-medium text-gray-700">42%</span>
                              </div>
                            </div>
                            <div className="mt-2 text-xs text-gray-600">
                              <span className="font-medium">Model:</span> RegionalForecaster
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 p-3 rounded-lg border">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="text-sm font-medium text-gray-800">Resource Scarcity Impact</h4>
                                <p className="text-xs text-gray-500 mt-0.5">Eastern Region</p>
                              </div>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Low Risk
                              </span>
                            </div>
                            <div className="mt-2">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '23%' }}></div>
                              </div>
                              <div className="flex justify-between mt-1">
                                <span className="text-xs text-gray-500">Probability</span>
                                <span className="text-xs font-medium text-gray-700">23%</span>
                              </div>
                            </div>
                            <div className="mt-2 text-xs text-gray-600">
                              <span className="font-medium">Model:</span> TrendPredictor-2023
                            </div>
                          </div>
                          
                          <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                            <h4 className="text-xs font-medium text-red-800 uppercase">Prediction Accuracy</h4>
                            <p className="text-xs text-red-700 mt-1">
                              Model predictions are based on historical data patterns and contextual factors. Current accuracy level: <span className="font-medium">82.7%</span>
                            </p>
                            <Button className="mt-2 w-full bg-red-600 hover:bg-red-700 text-xs h-7">
                              View Detailed Forecast Report
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg overflow-hidden mb-6">
                    <div className="bg-red-50 px-4 py-3 border-b">
                      <h3 className="font-medium text-red-700">Model Training & Configuration</h3>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Current Training Data</h4>
                          <div className="bg-gray-50 p-3 rounded-lg border space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Incident Reports</span>
                              <span className="text-sm font-medium text-gray-800">3,428 records</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Social Media Analysis</span>
                              <span className="text-sm font-medium text-gray-800">12,750 samples</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">News Articles</span>
                              <span className="text-sm font-medium text-gray-800">2,189 sources</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Call Center Logs</span>
                              <span className="text-sm font-medium text-gray-800">5,632 calls</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Demographic Data</span>
                              <span className="text-sm font-medium text-gray-800">237 regions</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Model Configuration</h4>
                          <div className="bg-gray-50 p-3 rounded-lg border">
                            <div className="space-y-2">
                              <div>
                                <label className="text-xs text-gray-500">Select Model Type</label>
                                <select className="mt-1 block w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50">
                                  <option>Time Series (LSTM)</option>
                                  <option>Ensemble (XGBoost)</option>
                                  <option>Neural Network</option>
                                  <option>NLP (BERT)</option>
                                  <option>Random Forest</option>
                                </select>
                              </div>
                              <div>
                                <label className="text-xs text-gray-500">Prediction Horizon</label>
                                <select className="mt-1 block w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50">
                                  <option>7 days</option>
                                  <option>14 days</option>
                                  <option>30 days</option>
                                  <option>90 days</option>
                                  <option>180 days</option>
                                </select>
                              </div>
                              <div>
                                <label className="text-xs text-gray-500">Feature Importance</label>
                                <div className="mt-1 flex items-center">
                                  <input type="range" className="w-full h-2 bg-gray-200 rounded-lg appearance-none" />
                                </div>
                              </div>
                              <div className="pt-2">
                                <Button className="w-full bg-red-600 hover:bg-red-700">
                                  Retrain Model
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="h-5 w-5 mr-1 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span>AI prediction models should be used as decision support tools, not as the sole basis for critical decisions.</span>
                    </div>
                    <div className="space-x-3">
                      <Button variant="outline">Export Forecast</Button>
                      <Button className="bg-red-600 hover:bg-red-700">Generate Alert</Button>
                    </div>
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