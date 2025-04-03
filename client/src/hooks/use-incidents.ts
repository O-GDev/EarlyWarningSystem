import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// Type for creating incident
interface CreateIncidentData {
  title: string;
  description: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  incidentType: string;
  severity: string;
  affectedPopulation?: number;
  tags?: string[];
  mediaLinks?: string[];
}

// Type for incident
interface Incident extends CreateIncidentData {
  id: number;
  status: string;
  reportedBy: number;
  reportedAt: string;
  verifiedBy?: number;
  verifiedAt?: string;
}

export function useIncidents() {
  const { toast } = useToast();

  // Get all incidents
  const {
    data: incidents,
    isLoading,
    error,
    refetch,
  } = useQuery<Incident[]>({
    queryKey: ['/api/incidents'],
    staleTime: 60000, // 1 minute
  });

  // Create incident
  const createIncident = useMutation({
    mutationFn: async (data: CreateIncidentData) => {
      const response = await apiRequest('POST', '/api/incidents', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Incident Created",
        description: "The incident has been successfully reported",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/incidents'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create incident: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Update incident
  const updateIncident = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CreateIncidentData> }) => {
      const response = await apiRequest('PUT', `/api/incidents/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Incident Updated",
        description: "The incident has been successfully updated",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/incidents'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update incident: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Filter incidents
  const filterIncidents = (params: {
    incidentType?: string;
    severity?: string;
    status?: string;
    timeRange?: number;
  }) => {
    if (!incidents) return [];

    const now = new Date();
    
    return incidents.filter(incident => {
      // Filter by incident type
      if (params.incidentType && params.incidentType !== 'all' && incident.incidentType !== params.incidentType) {
        return false;
      }

      // Filter by severity
      if (params.severity && params.severity !== 'all' && incident.severity !== params.severity) {
        return false;
      }

      // Filter by status
      if (params.status && params.status !== 'all' && incident.status !== params.status) {
        return false;
      }

      // Filter by time range
      if (params.timeRange && params.timeRange > 0) {
        const incidentDate = new Date(incident.reportedAt);
        const diffTime = Math.abs(now.getTime() - incidentDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays > params.timeRange) {
          return false;
        }
      }

      return true;
    });
  };

  // Get incident by id
  const getIncidentById = (id: number) => {
    if (!incidents) return null;
    return incidents.find(incident => incident.id === id) || null;
  };

  return {
    incidents,
    isLoading,
    error,
    refetch,
    createIncident,
    updateIncident,
    filterIncidents,
    getIncidentById
  };
}
