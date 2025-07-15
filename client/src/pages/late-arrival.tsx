import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, User, Calendar, AlertTriangle, Plus } from "lucide-react";
import { kmtApiClient } from "@/lib/kmt-api";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface LateArrival {
  id: string;
  userId: string;
  userName: string;
  checkInOutId: string;
  checkInAt: string;
  minutes: number;
  reason: string;
  autoCreated: boolean;
  createdAt: string;
}

export default function LateArrival() {
  const [searchTerm, setSearchTerm] = useState("");
  const [autoCreatedFilter, setAutoCreatedFilter] = useState<string>("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch late arrivals
  const { data: lateArrivals = [], isLoading } = useQuery({
    queryKey: ["/api/LateArrival"],
    queryFn: () => kmtApiClient.getLateArrivals(),
    onError: (error: Error) => {
      console.error("Error fetching late arrivals:", error);
      toast({
        title: "Error",
        description: "Failed to load late arrivals",
        variant: "destructive",
      });
    },
  });

  // Fetch users for dropdown
  const { data: users = [] } = useQuery({
    queryKey: ["/api/User"],
    queryFn: () => kmtApiClient.getUsers(),
  });

  // Create late arrival mutation
  const createLateArrivalMutation = useMutation({
    mutationFn: (data: any) => kmtApiClient.createLateArrival(data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Late arrival record created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/LateArrival"] });
      setIsCreateModalOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to create late arrival record",
        variant: "destructive",
      });
    },
  });

  // Delete late arrival mutation
  const deleteLateArrivalMutation = useMutation({
    mutationFn: (id: string) => kmtApiClient.deleteLateArrival(id),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Late arrival record deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/LateArrival"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to delete late arrival record",
        variant: "destructive",
      });
    },
  });

  const filteredLateArrivals = lateArrivals.filter((lateArrival: LateArrival) => {
    const matchesSearch = lateArrival.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = autoCreatedFilter === "" || 
      (autoCreatedFilter === "auto" && lateArrival.autoCreated) ||
      (autoCreatedFilter === "manual" && !lateArrival.autoCreated);
    return matchesSearch && matchesFilter;
  });

  const handleCreateLateArrival = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const lateArrivalData = {
      userId: formData.get("userId"),
      checkInOutId: formData.get("checkInOutId"),
      minutes: parseInt(formData.get("minutes") as string),
      reason: formData.get("reason"),
      autoCreated: false,
    };
    createLateArrivalMutation.mutate(lateArrivalData);
  };

  const handleDeleteLateArrival = (id: string) => {
    if (window.confirm("Are you sure you want to delete this late arrival record?")) {
      deleteLateArrivalMutation.mutate(id);
    }
  };

  const getCreationBadge = (autoCreated: boolean) => {
    if (autoCreated) {
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Auto-Created</Badge>;
    } else {
      return <Badge variant="outline" className="bg-gray-100 text-gray-800">Manual</Badge>;
    }
  };

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${remainingMinutes}m`;
  };

  const getSeverityColor = (minutes: number) => {
    if (minutes <= 15) return "text-yellow-600";
    if (minutes <= 30) return "text-orange-600";
    if (minutes <= 60) return "text-red-600";
    return "text-red-800";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Late Arrival Management</h1>
          <p className="text-gray-600 mt-2">Track and manage employee late arrivals</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Late Arrival
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Late Arrival Record</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateLateArrival} className="space-y-4">
              <div>
                <Label htmlFor="userId">Employee</Label>
                <Select name="userId" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user: any) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="checkInOutId">Check-In/Out ID</Label>
                <Input
                  id="checkInOutId"
                  name="checkInOutId"
                  placeholder="Enter check-in/out ID"
                  required
                />
              </div>
              <div>
                <Label htmlFor="minutes">Late Minutes</Label>
                <Input
                  id="minutes"
                  name="minutes"
                  type="number"
                  placeholder="Enter late minutes"
                  required
                />
              </div>
              <div>
                <Label htmlFor="reason">Reason</Label>
                <Textarea
                  id="reason"
                  name="reason"
                  placeholder="Enter reason for late arrival"
                  rows={3}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-orange-600 hover:bg-orange-700"
                disabled={createLateArrivalMutation.isPending}
              >
                {createLateArrivalMutation.isPending ? "Creating..." : "Add Late Arrival"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Late Arrivals</p>
                <p className="text-2xl font-bold text-gray-900">{lateArrivals.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Auto-Created</p>
                <p className="text-2xl font-bold text-blue-600">
                  {lateArrivals.filter((la: LateArrival) => la.autoCreated).length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Manual Records</p>
                <p className="text-2xl font-bold text-gray-600">
                  {lateArrivals.filter((la: LateArrival) => !la.autoCreated).length}
                </p>
              </div>
              <User className="w-8 h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Late Minutes</p>
                <p className="text-2xl font-bold text-red-600">
                  {lateArrivals.length > 0 
                    ? Math.round(lateArrivals.reduce((acc: number, la: LateArrival) => acc + la.minutes, 0) / lateArrivals.length)
                    : 0}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Late Arrival Records
          </CardTitle>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex-1">
              <Input
                placeholder="Search by employee name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={autoCreatedFilter} onValueChange={setAutoCreatedFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Records" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Records</SelectItem>
                <SelectItem value="auto">Auto-Created</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Check-In Time</TableHead>
                  <TableHead>Late Duration</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLateArrivals.map((lateArrival: LateArrival) => (
                  <TableRow key={lateArrival.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        {lateArrival.userName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {format(new Date(lateArrival.checkInAt), "MMM dd, HH:mm")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`font-medium ${getSeverityColor(lateArrival.minutes)}`}>
                        {formatMinutes(lateArrival.minutes)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate text-sm">
                        {lateArrival.reason || "No reason provided"}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getCreationBadge(lateArrival.autoCreated)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        {format(new Date(lateArrival.createdAt), "MMM dd, yyyy")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteLateArrival(lateArrival.id)}
                        disabled={deleteLateArrivalMutation.isPending}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}