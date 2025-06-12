import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { apiClient } from "@/lib/api";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Plus, MapPin, Calendar, User, Truck, Edit, Trash2, Loader2, CheckCircle, XCircle } from "lucide-react";

const missionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  assignedTo: z.string().min(1, "Assignee is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  priority: z.string().min(1, "Priority is required"),
  location: z.string().min(1, "Location is required"),
});

type MissionFormData = z.infer<typeof missionSchema>;

export default function Missions() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    assignee: "",
  });
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<MissionFormData>({
    resolver: zodResolver(missionSchema),
    defaultValues: {
      title: "",
      description: "",
      assignedTo: "",
      startDate: "",
      endDate: "",
      priority: "",
      location: "",
    },
  });

  const { data: missionsData, isLoading } = useQuery({
    queryKey: ["/api/Missions", filters, search],
    queryFn: async () => {
      try {
        const result = await apiClient.getMissions({ ...filters, search });
        console.log('Missions fetched:', result);
        
        // Handle KMT backend response structure: { data: [...], message: "...", success: true }
        if (result && typeof result === 'object' && 'data' in result) {
          const responseData = (result as { data: any[] }).data;
          if (Array.isArray(responseData)) {
            return responseData;
          }
        }
        
        // If response is already an array, return as is
        if (Array.isArray(result)) {
          return result;
        }
        
        return [];
      } catch (error: any) {
        console.error('Error fetching missions:', error);
        throw error;
      }
    },
    retry: false,
  });

  const { data: usersData } = useQuery({
    queryKey: ["/api/Users"],
    queryFn: async () => {
      try {
        const result = await apiClient.getUsers();
        console.log('Users fetched:', result);
        
        // Handle KMT backend response structure: { data: [...], message: "...", success: true }
        if (result && typeof result === 'object' && 'data' in result) {
          const responseData = (result as { data: any[] }).data;
          if (Array.isArray(responseData)) {
            return responseData;
          }
        }
        
        // If response is already an array, return as is
        if (Array.isArray(result)) {
          return result;
        }
        
        return [];
      } catch (error: any) {
        console.error('Error fetching users:', error);
        throw error;
      }
    },
    retry: false,
  });

  const missions = Array.isArray(missionsData) ? missionsData : [];
  const users = Array.isArray(usersData) ? usersData : [];

  const createMissionMutation = useMutation({
    mutationFn: (mission: MissionFormData) => apiClient.createMission(mission),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/Mission"] });
      setShowCreateModal(false);
      form.reset();
      toast({
        title: "Success",
        description: "Mission created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: MissionFormData) => {
    createMissionMutation.mutate(data);
  };

  const assignMissionMutation = useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) => 
      apiClient.assignMission(id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/Missions"] });
      toast({
        title: "Success",
        description: "Mission assigned successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMissionMutation = useMutation({
    mutationFn: (id: string) => apiClient.deleteMission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/Missions"] });
      toast({
        title: "Success",
        description: "Mission deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <MainLayout title="Missions" breadcrumb="Home">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-secondary">Mission Management</h2>
            <p className="text-gray-600">Manage and track employee missions</p>
          </div>
          <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Mission
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Mission</DialogTitle>
                <DialogDescription>
                  Fill in the details for the new mission
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mission Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter mission title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="assignedTo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assigned To</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select employee" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {users.map((user: any) => (
                                <SelectItem key={user.id} value={user.id.toString()}>
                                  {user.firstName} {user.lastName}
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
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Mission description" rows={3} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                          </Select>
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
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Mission location" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowCreateModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createMissionMutation.isPending}>
                      {createMissionMutation.isPending && (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      )}
                      Create Mission
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Missions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Active Missions</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6">
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-4 w-1/6" />
                      <Skeleton className="h-4 w-1/6" />
                      <Skeleton className="h-4 w-1/6" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mission</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(missions || []).map((mission: any) => (
                      <TableRow key={mission.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">
                              {mission.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {mission.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>Employee {mission.assignedTo}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                            {mission.location || "Not specified"}
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(mission.startDate)}</TableCell>
                        <TableCell>
                          {mission.endDate ? formatDate(mission.endDate) : "Ongoing"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={getStatusColor(mission.status)}
                          >
                            {mission.status.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {mission.status === "pending" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!missions || missions.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6">
                          <p className="text-gray-500">No missions found</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
