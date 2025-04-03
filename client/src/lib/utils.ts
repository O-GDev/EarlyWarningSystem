import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | number): string {
  if (!date) return '';
  const d = new Date(date);
  
  return d.toLocaleDateString('en-US', {
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function timeAgo(date: Date | string | number): string {
  if (!date) return '';
  
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);
  
  if (diffSec < 60) {
    return `${diffSec} sec ago`;
  } else if (diffMin < 60) {
    return `${diffMin} min ago`;
  } else if (diffHour < 24) {
    return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
  } else if (diffDay < 30) {
    return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  } else {
    return formatDate(date);
  }
}

export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getSeverityColor(severity: string): { bg: string, text: string, border: string } {
  switch(severity.toLowerCase()) {
    case 'critical':
      return { 
        bg: 'bg-red-100', 
        text: 'text-red-700',
        border: 'border-red-200'
      };
    case 'high':
      return { 
        bg: 'bg-amber-100', 
        text: 'text-amber-700',
        border: 'border-amber-200'
      };
    case 'medium':
      return { 
        bg: 'bg-green-100', 
        text: 'text-green-700',
        border: 'border-green-200'
      };
    case 'low':
      return { 
        bg: 'bg-blue-100', 
        text: 'text-blue-700',
        border: 'border-blue-200'
      };
    default:
      return { 
        bg: 'bg-gray-100', 
        text: 'text-gray-700',
        border: 'border-gray-200'
      };
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function createWebSocketConnection(): WebSocket {
  // Use a relative URL for WebSocket which will connect to the same server
  // that served the page, which should work with Replit's proxying
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsUrl = `${protocol}//${window.location.host}`;
  
  console.log('Connecting WebSocket to:', wsUrl);
  const ws = new WebSocket(wsUrl);
  
  ws.onopen = () => {
    console.log('WebSocket connection established');
    
    // Send a ping message
    try {
      ws.send(JSON.stringify({ type: 'PING' }));
    } catch (error) {
      console.warn('Unable to send initial ping, but connection established:', error);
    }
  };
  
  ws.onclose = (event) => {
    console.log(`WebSocket connection closed: ${event.code} ${event.reason}`);
    
    // Add automatic reconnection logic after a delay
    if (event.code !== 1000) { // 1000 is normal closure
      console.log('Attempting to reconnect WebSocket in 5 seconds...');
      setTimeout(() => {
        console.log('Reconnecting WebSocket...');
        // We don't actually reconnect here to avoid infinite loops during development
        // but in production, you might want to call createWebSocketConnection() again
      }, 5000);
    }
  };
  
  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
    // Don't close the connection on error, let the onclose handler deal with it
  };
  
  return ws;
}

export const incidentTypes = [
  { value: 'banditry', label: 'Banditry' },
  { value: 'militancy', label: 'Militancy' },
  { value: 'secession', label: 'Secession' },
  { value: 'farmer-herder', label: 'Farmer-Herder Conflict' },
  { value: 'political', label: 'Political Crisis' },
  { value: 'boundary', label: 'Boundary Dispute' },
  { value: 'communal', label: 'Communal Clash' },
  { value: 'other', label: 'Other' }
];

export const severityLevels = [
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' }
];
