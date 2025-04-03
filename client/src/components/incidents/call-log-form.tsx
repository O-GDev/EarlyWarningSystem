import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { incidentTypes, severityLevels } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';

// Define actions for the callLog form
const immediateActionsOptions = [
  { id: 'security', label: 'Security Response' },
  { id: 'medical', label: 'Medical Aid' },
  { id: 'evacuation', label: 'Evacuation' },
  { id: 'humanitarian', label: 'Humanitarian Relief' },
  { id: 'mediation', label: 'Mediation' }
];

// Define the form schema
const callLogFormSchema = z.object({
  callerName: z.string().min(3, "Caller's name is required"),
  contactNumber: z.string().min(5, "Contact number is required"),
  location: z.string().min(3, "Location is required"),
  incidentType: z.string().min(1, "Incident type is required"),
  severity: z.string().min(1, "Severity level is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  immediateActions: z.array(z.string()).optional(),
});

type CallLogFormValues = z.infer<typeof callLogFormSchema>;

interface CallLogFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CallLogForm({ onSuccess, onCancel }: CallLogFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedActions, setSelectedActions] = useState<string[]>([]);

  const form = useForm<CallLogFormValues>({
    resolver: zodResolver(callLogFormSchema),
    defaultValues: {
      callerName: '',
      contactNumber: '',
      location: '',
      incidentType: '',
      severity: '',
      description: '',
      immediateActions: [],
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: CallLogFormValues) => {
      const response = await apiRequest('POST', '/api/call-logs', {
        ...data,
        immediateActions: selectedActions,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Call log submitted",
        description: "The call log has been successfully submitted.",
      });
      form.reset();
      setSelectedActions([]);
      queryClient.invalidateQueries({ queryKey: ['/api/call-logs'] });
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to submit call log: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const toggleAction = (actionId: string) => {
    setSelectedActions(prev => {
      if (prev.includes(actionId)) {
        return prev.filter(id => id !== actionId);
      } else {
        return [...prev, actionId];
      }
    });
  };

  const onSubmit = (data: CallLogFormValues) => {
    mutate({
      ...data,
      immediateActions: selectedActions,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Log New Crisis Call</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="callerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Caller's Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter caller's name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Incident Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter location details" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="incidentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Incident Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select incident type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {incidentTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="severity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Severity Level</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select severity level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {severityLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Incident Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter detailed description of the incident..." 
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Immediate Actions Needed</FormLabel>
              <div className="flex flex-wrap gap-2 mt-2">
                {immediateActionsOptions.map((action) => (
                  <div 
                    key={action.id}
                    className="inline-flex items-center px-3 py-1.5 border border-neutral-300 rounded-md"
                  >
                    <Checkbox 
                      id={action.id}
                      checked={selectedActions.includes(action.id)}
                      onCheckedChange={() => toggleAction(action.id)}
                      className="mr-2"
                    />
                    <label htmlFor={action.id} className="text-sm cursor-pointer">
                      {action.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Submit Call Log
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
