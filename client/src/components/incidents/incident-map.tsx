import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getSeverityColor, timeAgo } from '@/lib/utils';
import { X, Plus, Minus, Layers } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

// Import leaflet for mapping
import 'leaflet/dist/leaflet.css';

// We need to wait until runtime to import Leaflet since it requires DOM
export default function IncidentMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const leafletRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const { toast } = useToast();
  
  const { data: incidents, isLoading, error } = useQuery({
    queryKey: ['/api/incidents'],
    staleTime: 60000, // 1 minute
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && !leafletRef.current) {
      // Dynamically import Leaflet
      import('leaflet').then((L) => {
        leafletRef.current = L;
        
        if (mapRef.current && !map) {
          // Center on Nigeria
          const nigeriaMap = L.map(mapRef.current).setView([9.082, 8.6753], 6);
          
          // Add OpenStreetMap tiles
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(nigeriaMap);
          
          setMap(nigeriaMap);
        }
      }).catch(err => {
        console.error('Failed to load Leaflet:', err);
        toast({
          title: 'Error',
          description: 'Failed to load map component',
          variant: 'destructive'
        });
      });
    }
    
    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  // Add markers when incidents data changes
  useEffect(() => {
    if (map && leafletRef.current && incidents && incidents.length > 0) {
      const L = leafletRef.current;
      
      // Clear existing markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      
      // Add new markers
      incidents.forEach((incident: any) => {
        if (incident.coordinates && incident.coordinates.lat && incident.coordinates.lng) {
          // Create custom marker icon based on severity
          const markerHtmlStyles = `
            background-color: ${getSeverityColor(incident.severity).bg.replace('bg-', '')};
            width: 2rem;
            height: 2rem;
            display: block;
            border-radius: 50%;
            position: relative;
            transform: rotate(45deg);
            border: 1px solid white;
            box-shadow: 0 0 8px rgba(0,0,0,0.3);
          `;

          const icon = L.divIcon({
            className: `incident-marker ${incident.severity}`,
            html: `<span style="${markerHtmlStyles}" />`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          });
          
          // Create marker
          const marker = L.marker([incident.coordinates.lat, incident.coordinates.lng], { icon })
            .addTo(map)
            .on('click', () => {
              setSelectedIncident(incident);
            });
          
          markersRef.current.push(marker);
        }
      });
    }
  }, [incidents, map]);

  const handleZoomIn = () => {
    if (map) map.zoomIn();
  };

  const handleZoomOut = () => {
    if (map) map.zoomOut();
  };

  const handleToggleLayers = () => {
    // Implement layer toggling
    toast({
      title: 'Layers',
      description: 'Layer functionality would be implemented here',
    });
  };

  const handleCloseIncidentInfo = () => {
    setSelectedIncident(null);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="px-4 py-3 border-b border-neutral-100 flex flex-row justify-between items-center">
        <CardTitle className="text-lg">Live Crisis Map</CardTitle>
        <div className="flex space-x-2">
          {/* Map controls will be added here */}
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 z-10 flex items-center justify-center">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 bg-white bg-opacity-70 z-10 flex items-center justify-center">
            <div className="bg-red-50 text-red-700 p-4 rounded-md">
              Failed to load map data
            </div>
          </div>
        )}
        
        <div className="relative h-full rounded overflow-hidden map-container">
          <div ref={mapRef} className="w-full h-full"></div>
          
          {/* Map controls */}
          <div className="absolute top-3 left-3 bg-white rounded shadow p-1">
            <Button variant="ghost" size="icon" onClick={handleZoomIn} className="text-neutral-600 hover:text-primary">
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleZoomOut} className="text-neutral-600 hover:text-primary">
              <Minus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="absolute top-3 right-3 bg-white rounded shadow">
            <Button variant="ghost" size="icon" onClick={handleToggleLayers} className="text-neutral-600 hover:text-primary">
              <Layers className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Selected incident info */}
          {selectedIncident && (
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-white rounded shadow-lg p-3 w-80 max-w-full">
              <div className="flex items-start">
                <div className={`h-4 w-4 rounded-full mt-1 mr-2 flex-shrink-0 ${getSeverityColor(selectedIncident.severity).bg}`}></div>
                <div className="flex-1">
                  <h4 className="font-medium">{selectedIncident.title}</h4>
                  <p className="text-sm text-neutral-600">{selectedIncident.description}</p>
                  <div className="flex items-center mt-2 text-xs text-neutral-500">
                    <span className="flex items-center"><span className="mr-1">📍</span> {selectedIncident.location}</span>
                    <span className="mx-2">•</span>
                    <span className="flex items-center"><span className="mr-1">⏱️</span> {timeAgo(selectedIncident.reportedAt)}</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={handleCloseIncidentInfo} className="text-neutral-400 hover:text-neutral-600">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2 pt-2 border-t border-neutral-100">
                <div className="flex justify-between">
                  <Button size="sm" variant="default" className="text-xs">View Details</Button>
                  <Button size="sm" variant="secondary" className="text-xs">Respond</Button>
                  <Button size="sm" variant="outline" className="text-xs">Mark Reviewed</Button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between mt-3">
          <div className="flex flex-wrap items-center space-x-4 text-sm">
            <div className="flex items-center">
              <span className="h-3 w-3 rounded-full bg-red-500 mr-2"></span>
              <span>Critical</span>
            </div>
            <div className="flex items-center">
              <span className="h-3 w-3 rounded-full bg-amber-500 mr-2"></span>
              <span>High</span>
            </div>
            <div className="flex items-center">
              <span className="h-3 w-3 rounded-full bg-green-500 mr-2"></span>
              <span>Medium</span>
            </div>
            <div className="flex items-center">
              <span className="h-3 w-3 rounded-full bg-blue-500 mr-2"></span>
              <span>Low</span>
            </div>
          </div>
          {incidents && incidents.length > 0 && (
            <div className="text-sm text-primary">
              {incidents.length} incidents displayed
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
