import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import { AuthProvider } from "./contexts/auth-context";
import { SidebarProvider } from "./contexts/sidebar-context";
import HomePage from "./pages/home";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard-fixed";
import DataCollection from "./pages/data-collection";
import DataAnalysis from "./pages/data-analysis";
import ModuleTemplate from "./pages/module-template";
import IncidentMap from "./pages/incident-map";
import SocialMonitoring from "./pages/social-monitoring";
import CallLogs from "./pages/call-logs";
import AiAssistant from "./pages/ai-assistant";
import UserManagement from "./pages/user-management";
import Settings from "./pages/settings";
import { useAuth } from "./hooks/use-auth";
import { useEffect } from "react";

interface PrivateRouteProps {
  component: React.ComponentType<any>;
  path: string;
}

function PrivateRoute({ component: Component }: PrivateRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, loading, setLocation]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  return isAuthenticated ? <Component /> : null;
}

function AppRoutes() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/login" component={Login} />
      
      {/* Main Routes */}
      <Route path="/dashboard">
        <PrivateRoute component={Dashboard} path="/dashboard" />
      </Route>
      
      {/* Data Collection Routes */}
      <Route path="/data-collection">
        <PrivateRoute component={DataCollection} path="/data-collection" />
      </Route>
      <Route path="/data-collection/submit-incident">
        <PrivateRoute component={DataCollection} path="/data-collection/submit-incident" />
      </Route>
      <Route path="/data-collection/social-media">
        <PrivateRoute component={DataCollection} path="/data-collection/social-media" />
      </Route>
      <Route path="/data-collection/community-reports">
        <PrivateRoute component={DataCollection} path="/data-collection/community-reports" />
      </Route>
      <Route path="/data-collection/automated-feeds">
        <PrivateRoute component={DataCollection} path="/data-collection/automated-feeds" />
      </Route>
      <Route path="/data-collection/field-reports">
        <PrivateRoute component={DataCollection} path="/data-collection/field-reports" />
      </Route>
      
      {/* Data Analysis Routes */}
      <Route path="/data-analysis">
        <PrivateRoute component={DataAnalysis} path="/data-analysis" />
      </Route>
      <Route path="/data-analysis/data-cleaning">
        <PrivateRoute component={DataAnalysis} path="/data-analysis/data-cleaning" />
      </Route>
      <Route path="/data-analysis/risk-indicators">
        <PrivateRoute component={DataAnalysis} path="/data-analysis/risk-indicators" />
      </Route>
      <Route path="/data-analysis/trend-analysis">
        <PrivateRoute component={DataAnalysis} path="/data-analysis/trend-analysis" />
      </Route>
      <Route path="/data-analysis/ai-prediction">
        <PrivateRoute component={DataAnalysis} path="/data-analysis/ai-prediction" />
      </Route>
      
      {/* Risk Assessment Routes */}
      <Route path="/risk-assessment">
        <PrivateRoute component={ModuleTemplate} path="/risk-assessment" />
      </Route>
      <Route path="/risk-assessment/thresholds">
        <PrivateRoute component={ModuleTemplate} path="/risk-assessment/thresholds" />
      </Route>
      <Route path="/risk-assessment/risk-scoring">
        <PrivateRoute component={ModuleTemplate} path="/risk-assessment/risk-scoring" />
      </Route>
      <Route path="/risk-assessment/generate-alerts">
        <PrivateRoute component={ModuleTemplate} path="/risk-assessment/generate-alerts" />
      </Route>
      <Route path="/risk-assessment/notification-settings">
        <PrivateRoute component={ModuleTemplate} path="/risk-assessment/notification-settings" />
      </Route>
      <Route path="/risk-assessment/scenarios">
        <PrivateRoute component={ModuleTemplate} path="/risk-assessment/scenarios" />
      </Route>
      
      {/* Communication Routes */}
      <Route path="/communication">
        <PrivateRoute component={ModuleTemplate} path="/communication" />
      </Route>
      <Route path="/communication/multi-channel">
        <PrivateRoute component={ModuleTemplate} path="/communication/multi-channel" />
      </Route>
      <Route path="/communication/stakeholders">
        <PrivateRoute component={ModuleTemplate} path="/communication/stakeholders" />
      </Route>
      <Route path="/communication/secure-channels">
        <PrivateRoute component={ModuleTemplate} path="/communication/secure-channels" />
      </Route>
      
      {/* Response Coordination Routes */}
      <Route path="/response">
        <PrivateRoute component={ModuleTemplate} path="/response" />
      </Route>
      <Route path="/response/response-plans">
        <PrivateRoute component={ModuleTemplate} path="/response/response-plans" />
      </Route>
      <Route path="/response/task-assignment">
        <PrivateRoute component={ModuleTemplate} path="/response/task-assignment" />
      </Route>
      <Route path="/response/resources">
        <PrivateRoute component={ModuleTemplate} path="/response/resources" />
      </Route>
      <Route path="/response/agencies">
        <PrivateRoute component={ModuleTemplate} path="/response/agencies" />
      </Route>
      
      {/* Other Main Routes */}
      <Route path="/incident-map">
        <PrivateRoute component={IncidentMap} path="/incident-map" />
      </Route>
      
      <Route path="/social-monitoring">
        <PrivateRoute component={SocialMonitoring} path="/social-monitoring" />
      </Route>
      
      <Route path="/call-logs">
        <PrivateRoute component={CallLogs} path="/call-logs" />
      </Route>
      
      <Route path="/ai-assistant">
        <PrivateRoute component={AiAssistant} path="/ai-assistant" />
      </Route>
      
      <Route path="/user-management">
        <PrivateRoute component={UserManagement} path="/user-management" />
      </Route>
      
      <Route path="/settings">
        <PrivateRoute component={Settings} path="/settings" />
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SidebarProvider>
          <AppRoutes />
          <Toaster />
        </SidebarProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
