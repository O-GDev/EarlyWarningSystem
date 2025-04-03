import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/contexts/sidebar-context';
import {
  ChevronDown,
  LayoutDashboard,
  Database,
  Brain,
  Bell,
  Satellite,
  Handshake,
  Globe,
  MapPin,
  Phone,
  Bot,
  Users,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

interface SidebarItemProps {
  icon: React.ReactNode;
  title: string;
  href?: string;
  onClick?: () => void;
  isActive?: boolean;
  children?: React.ReactNode;
}

function SidebarItem({ icon, title, href, onClick, isActive, children }: SidebarItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const hasChildren = Boolean(children);

  useEffect(() => {
    if (hasChildren && location.startsWith(href || '')) {
      setIsOpen(true);
    }
  }, [location, href, hasChildren]);

  const toggleSubmenu = () => {
    setIsOpen(!isOpen);
  };

  const handleClick = () => {
    if (hasChildren) {
      toggleSubmenu();
    }
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className="sidebar-section mb-1">
      {href && !hasChildren ? (
        <Link href={href}>
          <a className={cn(
            "sidebar-item flex items-center justify-between py-2 px-4 text-white hover:bg-white hover:bg-opacity-10 transition",
            isActive && "bg-white bg-opacity-20"
          )}>
            <div className="flex items-center">
              <span className="w-5 text-center mr-3">{icon}</span>
              <span>{title}</span>
            </div>
          </a>
        </Link>
      ) : (
        <>
          <div 
            className={cn(
              "sidebar-item flex items-center justify-between py-2 px-4 text-white hover:bg-white hover:bg-opacity-10 cursor-pointer",
              isActive && "bg-white bg-opacity-20"
            )}
            onClick={handleClick}
          >
            <div className="flex items-center">
              <span className="w-5 text-center mr-3">{icon}</span>
              <span>{title}</span>
            </div>
            {hasChildren && (
              <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "transform rotate-180")} />
            )}
          </div>
          {hasChildren && (
            <div className={cn("sidebar-submenu pl-12 bg-primary-dark overflow-hidden transition-all", 
              isOpen ? "max-h-[1000px]" : "max-h-0"
            )}>
              {children}
            </div>
          )}
        </>
      )}
    </div>
  );
}

interface SubMenuItemProps {
  title: string;
  href: string;
}

function SubMenuItem({ title, href }: SubMenuItemProps) {
  const [location] = useLocation();
  const isActive = location === href;

  return (
    <Link href={href}>
      <a className={cn(
        "block py-2 px-2 text-sm text-white text-opacity-90 hover:text-opacity-100 hover:bg-white hover:bg-opacity-10",
        isActive && "bg-white bg-opacity-10 text-opacity-100"
      )}>
        {title}
      </a>
    </Link>
  );
}

export default function Sidebar() {
  const [location] = useLocation();
  const { isOpen, closeSidebar } = useSidebar();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed md:static top-0 left-0 h-full md:flex flex-col w-64 bg-primary text-white shadow-lg z-50 transition-transform duration-300 transform",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-4 border-b border-white border-opacity-20 flex items-center">
          <div className="w-10 h-10 bg-white rounded-full mr-3 flex items-center justify-center">
            <span className="text-primary font-bold">EW</span>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">EWERS</h1>
            <p className="text-xs text-white text-opacity-80">Early Warning & Response</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-2">
          <nav>
            <SidebarItem 
              icon={<LayoutDashboard size={18} />} 
              title="Dashboard" 
              href="/dashboard"
              isActive={location === "/dashboard"}
            />
            
            <SidebarItem 
              icon={<Database size={18} />} 
              title="Data Collection" 
              href="/data-collection"
              isActive={location.startsWith("/data-collection")}
            >
              <SubMenuItem title="Submit Incident Report" href="/data-collection/submit-incident" />
              <SubMenuItem title="Social Media Mining" href="/data-collection/social-media" />
              <SubMenuItem title="Community Reports" href="/data-collection/community-reports" />
              <SubMenuItem title="Automated Data Feeds" href="/data-collection/automated-feeds" />
              <SubMenuItem title="Field Reports" href="/data-collection/field-reports" />
            </SidebarItem>
            
            <SidebarItem 
              icon={<Brain size={18} />} 
              title="Data Analysis" 
              href="/data-analysis"
              isActive={location.startsWith("/data-analysis")}
            >
              <SubMenuItem title="Data Cleaning" href="/data-analysis/data-cleaning" />
              <SubMenuItem title="Risk Indicators" href="/data-analysis/risk-indicators" />
              <SubMenuItem title="Trend Analysis" href="/data-analysis/trend-analysis" />
              <SubMenuItem title="AI Prediction" href="/data-analysis/ai-prediction" />
            </SidebarItem>
            
            <SidebarItem 
              icon={<Bell size={18} />} 
              title="Risk Assessment" 
              href="/risk-assessment"
              isActive={location.startsWith("/risk-assessment")}
            >
              <SubMenuItem title="Threshold Monitoring" href="/risk-assessment/thresholds" />
              <SubMenuItem title="Risk Scoring" href="/risk-assessment/risk-scoring" />
              <SubMenuItem title="Generate Alerts" href="/risk-assessment/generate-alerts" />
              <SubMenuItem title="Notification Settings" href="/risk-assessment/notification-settings" />
              <SubMenuItem title="Scenario Simulations" href="/risk-assessment/scenarios" />
            </SidebarItem>
            
            <SidebarItem 
              icon={<Satellite size={18} />} 
              title="Communication" 
              href="/communication"
              isActive={location.startsWith("/communication")}
            >
              <SubMenuItem title="Multi-Channel Alerts" href="/communication/multi-channel" />
              <SubMenuItem title="Stakeholder Mapping" href="/communication/stakeholders" />
              <SubMenuItem title="Secure Channels" href="/communication/secure-channels" />
            </SidebarItem>
            
            <SidebarItem 
              icon={<Handshake size={18} />} 
              title="Response Coordination" 
              href="/response"
              isActive={location.startsWith("/response")}
            >
              <SubMenuItem title="Response Plans" href="/response/response-plans" />
              <SubMenuItem title="Task Assignment" href="/response/task-assignment" />
              <SubMenuItem title="Resource Tracking" href="/response/resources" />
              <SubMenuItem title="Inter-Agency Coordination" href="/response/agencies" />
            </SidebarItem>
            
            <SidebarItem 
              icon={<Globe size={18} />} 
              title="Social Media Monitoring" 
              href="/social-monitoring"
              isActive={location === "/social-monitoring"}
            />
            
            <SidebarItem 
              icon={<MapPin size={18} />} 
              title="Incident Mapping" 
              href="/incident-map"
              isActive={location === "/incident-map"}
            />
            
            <SidebarItem 
              icon={<Phone size={18} />} 
              title="Call Agent Logs" 
              href="/call-logs"
              isActive={location === "/call-logs"}
            />
            
            <SidebarItem 
              icon={<Bot size={18} />} 
              title="AI Assistant" 
              href="/ai-assistant"
              isActive={location === "/ai-assistant"}
            />
            
            <SidebarItem 
              icon={<Users size={18} />} 
              title="User Management" 
              href="/user-management"
              isActive={location === "/user-management"}
            />
            
            <SidebarItem 
              icon={<Settings size={18} />} 
              title="Settings" 
              href="/settings"
              isActive={location === "/settings"}
            />
          </nav>
        </div>
        
        <div className="p-4 border-t border-white border-opacity-20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center py-2 px-4 bg-primary-dark hover:bg-primary-light text-white rounded transition"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
