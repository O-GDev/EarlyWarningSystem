import { useState } from 'react';
import { useLocation } from 'wouter';
import { Bell, Search, ChevronDown, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useSidebar } from '@/contexts/sidebar-context';
import { useAuth } from '@/hooks/use-auth';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const [location, setLocation] = useLocation();
  const { openSidebar } = useSidebar();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Search query:', searchQuery);
  };

  const handleLogout = async () => {
    await logout();
    setLocation('/login');
  };

  const getBreadcrumbs = () => {
    const pathSegments = location.split('/').filter(Boolean);
    
    // Return breadcrumbs based on current path
    return (
      <div className="px-4 py-1 border-t border-neutral-100 flex items-center text-sm text-neutral-500">
        <a href="/" className="hover:text-primary">Home</a>
        {pathSegments.map((segment, index) => (
          <div key={index} className="flex items-center">
            <span className="mx-2 text-neutral-400 text-xs">
              <ChevronDown className="h-3 w-3 rotate-270" />
            </span>
            <span className={index === pathSegments.length - 1 ? "text-neutral-700" : "hover:text-primary"}>
              {segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex justify-between items-center px-4 py-2">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden mr-2 text-neutral-600"
            onClick={openSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-primary">{title}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <form onSubmit={handleSearch}>
              <Input
                type="text"
                placeholder="Search..."
                className="w-64 pl-10 pr-4 py-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
            </form>
          </div>
          
          {/* Notifications */}
          <div className="relative">
            <Button variant="ghost" size="icon" className="relative p-2 text-neutral-600 hover:text-primary">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-4 w-4 flex items-center justify-center bg-accent text-white text-xs rounded-full">3</span>
            </Button>
          </div>
          
          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center text-sm focus:outline-none p-1">
                <Avatar className="h-8 w-8 mr-2 border-2 border-secondary">
                  <AvatarImage src={`https://avatar.vercel.sh/${user?.username || 'user'}`} />
                  <AvatarFallback>{user?.fullName?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <span className="hidden md:inline font-medium">{user?.fullName || 'User'}</span>
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocation('/settings')}>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Breadcrumbs */}
      {getBreadcrumbs()}
    </header>
  );
}
