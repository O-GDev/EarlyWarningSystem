import { useState } from 'react';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useSidebar } from '@/contexts/sidebar-context';
import { 
  Save, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Database, 
  MessageSquare,
  Lock,
  CheckCircle
} from 'lucide-react';

export default function Settings() {
  const { isOpen } = useSidebar();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('general');
  const [saveLoading, setSaveLoading] = useState(false);

  const handleSaveSettings = () => {
    setSaveLoading(true);
    
    // Simulate saving settings
    setTimeout(() => {
      setSaveLoading(false);
      toast({
        title: "Settings Saved",
        description: "Your settings have been successfully updated.",
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex h-screen">
        <Sidebar />
        
        <main className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isOpen ? 'md:ml-64' : ''}`}>
          <Header title="Settings" />
          
          <div className="flex-1 overflow-auto p-4 bg-neutral-50">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Settings</CardTitle>
                <CardDescription>
                  Configure your EWERS system settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="general" onValueChange={setActiveTab} value={activeTab}>
                  <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8">
                    <TabsTrigger value="general" className="flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      <span>General</span>
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      <span>Notifications</span>
                    </TabsTrigger>
                    <TabsTrigger value="security" className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <span>Security</span>
                    </TabsTrigger>
                    <TabsTrigger value="integrations" className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <span>Integrations</span>
                    </TabsTrigger>
                    <TabsTrigger value="advanced" className="flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      <span>Advanced</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="general" className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Appearance Settings</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="theme">Theme</Label>
                            <Select defaultValue="light">
                              <SelectTrigger id="theme">
                                <SelectValue placeholder="Select theme" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="dark">Dark</SelectItem>
                                <SelectItem value="system">System</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="accent-color">Accent Color</Label>
                            <Select defaultValue="blue">
                              <SelectTrigger id="accent-color">
                                <SelectValue placeholder="Select accent color" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="blue">Blue</SelectItem>
                                <SelectItem value="red">Red</SelectItem>
                                <SelectItem value="green">Green</SelectItem>
                                <SelectItem value="purple">Purple</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="compact-mode">Compact Mode</Label>
                              <p className="text-sm text-neutral-500">Reduce spacing and size of UI elements</p>
                            </div>
                            <Switch id="compact-mode" />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="animations">Interface Animations</Label>
                              <p className="text-sm text-neutral-500">Enable animations in the interface</p>
                            </div>
                            <Switch id="animations" defaultChecked />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Default Settings</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="default-page">Default Landing Page</Label>
                          <Select defaultValue="dashboard">
                            <SelectTrigger id="default-page">
                              <SelectValue placeholder="Select default page" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="dashboard">Dashboard</SelectItem>
                              <SelectItem value="incident-map">Incident Map</SelectItem>
                              <SelectItem value="data-collection">Data Collection</SelectItem>
                              <SelectItem value="social-monitoring">Social Monitoring</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="language">System Language</Label>
                          <Select defaultValue="en">
                            <SelectTrigger id="language">
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="fr">French</SelectItem>
                              <SelectItem value="ha">Hausa</SelectItem>
                              <SelectItem value="yo">Yoruba</SelectItem>
                              <SelectItem value="ig">Igbo</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="notifications" className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Critical Alerts</Label>
                            <p className="text-sm text-neutral-500">Notifications for critical severity incidents</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>High Priority Alerts</Label>
                            <p className="text-sm text-neutral-500">Notifications for high severity incidents</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Medium Priority Alerts</Label>
                            <p className="text-sm text-neutral-500">Notifications for medium severity incidents</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Low Priority Alerts</Label>
                            <p className="text-sm text-neutral-500">Notifications for low severity incidents</p>
                          </div>
                          <Switch />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>System Notifications</Label>
                            <p className="text-sm text-neutral-500">Updates and maintenance notifications</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Notification Channels</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Email Notifications</Label>
                            <p className="text-sm text-neutral-500">Receive alerts via email</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>SMS Notifications</Label>
                            <p className="text-sm text-neutral-500">Receive alerts via SMS</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Push Notifications</Label>
                            <p className="text-sm text-neutral-500">Receive browser push notifications</p>
                          </div>
                          <Switch />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>In-App Notifications</Label>
                            <p className="text-sm text-neutral-500">Show alerts within the application</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notification-quiet-hours">Quiet Hours</Label>
                      <p className="text-sm text-neutral-500 mb-2">Set time period when notifications are silenced</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm">Start Time</Label>
                          <Input type="time" defaultValue="22:00" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm">End Time</Label>
                          <Input type="time" defaultValue="06:00" />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="security" className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Account Security</h3>
                      
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Current Password</Label>
                          <Input id="current-password" type="password" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <Input id="new-password" type="password" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <Input id="confirm-password" type="password" />
                        </div>
                        
                        <Button className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Change Password
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
                      
                      <Card className="bg-neutral-50 border">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="font-medium">Two-Factor Authentication</h4>
                              <p className="text-sm text-neutral-500">Add an extra layer of security to your account</p>
                            </div>
                            <Switch />
                          </div>
                          
                          <Button variant="outline" className="w-full" disabled>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Set Up 2FA
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Session Management</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Auto-logout after inactivity</Label>
                            <p className="text-sm text-neutral-500">Automatically log out after period of inactivity</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="timeout">Inactivity Timeout (minutes)</Label>
                          <Input id="timeout" type="number" defaultValue="30" min="5" max="240" />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="integrations" className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Social Media Integration</h3>
                      
                      <div className="space-y-4">
                        <Card className="bg-neutral-50 border">
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center">
                                <div className="bg-[#1DA1F2] h-10 w-10 rounded-full flex items-center justify-center text-white mr-4">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                                </div>
                                <div>
                                  <h4 className="font-medium">Twitter</h4>
                                  <p className="text-sm text-neutral-500">Connect Twitter API for social monitoring</p>
                                </div>
                              </div>
                              <Button variant="outline">Configure</Button>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-neutral-50 border">
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center">
                                <div className="bg-[#4267B2] h-10 w-10 rounded-full flex items-center justify-center text-white mr-4">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                                </div>
                                <div>
                                  <h4 className="font-medium">Facebook</h4>
                                  <p className="text-sm text-neutral-500">Connect Facebook API for social monitoring</p>
                                </div>
                              </div>
                              <Button variant="outline">Configure</Button>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-neutral-50 border">
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center">
                                <div className="bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] h-10 w-10 rounded-full flex items-center justify-center text-white mr-4">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                                </div>
                                <div>
                                  <h4 className="font-medium">Instagram</h4>
                                  <p className="text-sm text-neutral-500">Connect Instagram API for social monitoring</p>
                                </div>
                              </div>
                              <Button variant="outline">Configure</Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">SMS Integration</h3>
                      
                      <div className="space-y-4">
                        <Card className="bg-neutral-50 border">
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center">
                                <div className="bg-[#E12029] h-10 w-10 rounded-full flex items-center justify-center text-white mr-4">
                                  C
                                </div>
                                <div>
                                  <h4 className="font-medium">Clickatell</h4>
                                  <p className="text-sm text-neutral-500">Configure Clickatell SMS API for alerts</p>
                                </div>
                              </div>
                              <Button variant="outline">Configure</Button>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-neutral-50 border">
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center">
                                <div className="bg-[#F22F46] h-10 w-10 rounded-full flex items-center justify-center text-white mr-4">
                                  T
                                </div>
                                <div>
                                  <h4 className="font-medium">Twilio</h4>
                                  <p className="text-sm text-neutral-500">Configure Twilio SMS API for alerts</p>
                                </div>
                              </div>
                              <Button variant="outline">Configure</Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="advanced" className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">System Settings</h3>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="data-retention">Data Retention Period (days)</Label>
                          <Input id="data-retention" type="number" defaultValue="365" min="30" max="1825" />
                          <p className="text-sm text-neutral-500">Number of days to keep incident data before archiving</p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="map-refresh">Map Refresh Interval (seconds)</Label>
                          <Input id="map-refresh" type="number" defaultValue="30" min="10" max="300" />
                          <p className="text-sm text-neutral-500">How often to refresh incident map data</p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Enable AI Assistant</Label>
                            <p className="text-sm text-neutral-500">Use AI for incident analysis and recommendations</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Advanced Analytics</Label>
                            <p className="text-sm text-neutral-500">Enable advanced analytics features</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Debug Mode</Label>
                            <p className="text-sm text-neutral-500">Enable extended logging for troubleshooting</p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Data Management</h3>
                      
                      <div className="space-y-4">
                        <Card className="bg-white border border-neutral-200">
                          <CardContent className="pt-6">
                            <h4 className="font-medium mb-2">Export System Data</h4>
                            <p className="text-sm text-neutral-500 mb-4">Download system data in standard formats</p>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">Export as CSV</Button>
                              <Button variant="outline" size="sm">Export as JSON</Button>
                              <Button variant="outline" size="sm">Export as Excel</Button>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-white border border-neutral-200">
                          <CardContent className="pt-6">
                            <h4 className="font-medium mb-2">Backup and Restore</h4>
                            <p className="text-sm text-neutral-500 mb-4">Manage system backup and restoration</p>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">Create Backup</Button>
                              <Button variant="outline" size="sm">Restore from Backup</Button>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-red-50 border border-red-200">
                          <CardContent className="pt-6">
                            <h4 className="font-medium text-red-600 mb-2">Danger Zone</h4>
                            <p className="text-sm text-red-600 mb-4">These actions cannot be undone</p>
                            <div className="flex gap-2">
                              <Button variant="destructive" size="sm">Reset System Settings</Button>
                              <Button variant="destructive" size="sm">Clear All Data</Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="border-t pt-6 flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button 
                  className="flex items-center gap-2" 
                  onClick={handleSaveSettings}
                  disabled={saveLoading}
                >
                  {saveLoading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Settings
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
