import { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [, setLocation] = useLocation();
  const { login, loading } = useAuth();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      toast({
        title: "Error",
        description: "Please enter both username and password",
        variant: "destructive",
      });
      return;
    }

    try {
      const success = await login(username, password);
      if (success) {
        setLocation('/dashboard');
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <div className="w-20 h-20 bg-primary rounded-full mx-auto border-4 border-white shadow-md mb-4 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">EW</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-800">Early Warning Early Response System</h1>
          <p className="text-neutral-600 mt-2">Sign in to access the dashboard</p>
        </div>
        
        <Card className="shadow-lg">
          <CardHeader className="bg-primary text-white rounded-t-lg">
            <CardTitle className="text-center">Administrative Login</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username" className="block text-sm font-medium text-neutral-700 mb-1">Username</Label>
                <Input 
                  type="text" 
                  id="username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md" 
                  placeholder="Enter your username"
                />
              </div>
              <div>
                <Label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">Password</Label>
                <Input 
                  type="password" 
                  id="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md" 
                  placeholder="Enter your password"
                />
              </div>
              <Button 
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded transition"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
              <div className="mt-4 text-sm text-center">
                <a href="#" className="text-primary hover:underline">Forgot password?</a>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <div className="mt-8 text-center text-sm text-neutral-600">
          <p>For access requests, please contact your system administrator.</p>
          <p className="mt-2">&copy; {new Date().getFullYear()} Institute for Peace and Conflict Resolution</p>
        </div>
      </div>
    </div>
  );
}
