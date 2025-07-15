import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, Clock, User, Calendar, Plus, Edit, Trash2, Eye } from "lucide-react";
import { kmtApiClient } from "@/lib/kmt-api";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface LateArrival {
  id: string;
  userId: string;
  userName: string;
  checkInOutId: string;
  checkInAt: string;
  lateMinutes: number;
  note: string;
  autoCreated: boolean;
  createdAt: string;
}

export default function LateArrival() {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLateArrival, setSelectedLateArrival] = useState<LateArrival | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [editingLateArrival, setEditingLateArrival] = useState<LateArrival | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch late arrivals
  const { data: lateArrivals = [], isLoading } = useQuery({
    queryKey: ["/api/LateArrival"],
    queryFn: async () => {
      const response = await kmtApiClient.getLateArrivals();
      return response?.data || [];
    },
  });

  // Fetch users for dropdown
  const { data: users = [] } = useQuery({
    queryKey: ["/api/User"],
    queryFn: async () => {
      const response = await kmtApiClient.getUsers();
      return response?.data || [];
    },
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

  // Update late arrival mutation
  const updateLateArrivalMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      kmtApiClient.updateLateArrival(id, data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Late arrival record updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/LateArrival"] });
      setIsEditModalOpen(false);
      setEditingLateArrival(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to update late arrival record",
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

  // Filter late arrivals
  const filteredLateArrivals = lateArrivals.filter((lateArrival: LateArrival) => {
    const matchesSearch = lateArrival.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lateArrival.note?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = !severityFilter || 
      (severityFilter === "minor" && lateArrival.lateMinutes <= 15) ||
      (severityFilter === "moderate" && lateArrival.lateMinutes > 15 && lateArrival.lateMinutes <= 30) ||
      (severityFilter === "severe" && lateArrival.lateMinutes > 30);
    return matchesSearch && matchesSeverity;
  });

  const handleViewDetails = (lateArrival: LateArrival) => {
    setSelectedLateArrival(lateArrival);
    setIsDetailsModalOpen(true);
  };

  const handleEditLateArrival = (lateArrival: LateArrival) => {
    setEditingLateArrival(lateArrival);
    setIsEditModalOpen(true);
  };

  const handleCreateLateArrival = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      userId: formData.get("userId"),
      lateMinutes: parseInt(formData.get("lateMinutes") as string),
      checkInAt: formData.get("checkInAt"),
      note: formData.get("note"),
    };
    createLateArrivalMutation.mutate(data);
  };

  const handleUpdateLateArrival = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLateArrival) return;
    
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      userId: formData.get("userId"),
      lateMinutes: parseInt(formData.get("lateMinutes") as string),
      checkInAt: formData.get("checkInAt"),
      note: formData.get("note"),
    };
    updateLateArrivalMutation.mutate({ id: editingLateArrival.id, data });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this late arrival record?")) {
      deleteLateArrivalMutation.mutate(id);
    }
  };

  const getSeverityBadge = (lateMinutes: number) => {
    if (lateMinutes <= 15) {
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Minor</Badge>;
    } else if (lateMinutes <= 30) {
      return <Badge variant="outline" className="bg-orange-100 text-orange-800">Moderate</Badge>;
    } else {
      return <Badge variant="outline" className="bg-red-100 text-red-800">Severe</Badge>;
    }
  };

  const getTypeBadge = (autoCreated: boolean) => {
    return autoCreated ? 
      <Badge variant="outline" className="bg-blue-100 text-blue-800">Auto</Badge> :
      <Badge variant="outline" className="bg-gray-100 text-gray-800">Manual</Badge>;
  };

  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy HH:mm");
    } catch {
      return dateString;
    }
  };

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Calculate statistics
  const totalLateArrivals = filteredLateArrivals.length;
  const minorLateArrivals = filteredLateArrivals.filter((la: LateArrival) => la.lateMinutes <= 15).length;
  const moderateLateArrivals = filteredLateArrivals.filter((la: LateArrival) => la.lateMinutes > 15 && la.lateMinutes <= 30).length;
  const severeLateArrivals = filteredLateArrivals.filter((la: LateArrival) => la.lateMinutes > 30).length;
  const autoCreatedLateArrivals = filteredLateArrivals.filter((la: LateArrival) => la.autoCreated).length;
  const totalLateMinutes = filteredLateArrivals.reduce((sum: number, la: LateArrival) => sum + la.lateMinutes, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading late arrival records...</p>
        </div>
      </div>
    );
  }

  return (
    <MainLayout title="Late Arrival Management" breadcrumb="Late Arrival">
      <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Late Arrival Management</h1>
          <p className="text-gray-600 mt-1">Track and manage employee late arrivals</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Late Arrival Record
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Late Arrival Record</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateLateArrival} className="space-y-4">
              <div>
                <Label htmlFor="userId">Employee</Label>
                <select
                  id="userId"
                  name="userId"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select employee</option>
                  {users.map((user: any) => (
                    <option key={user.id} value={user.id}>
                      {user.firstName} {user.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="lateMinutes">Late Minutes</Label>
                <Input
                  id="lateMinutes"
                  name="lateMinutes"
                  type="number"
                  min="1"
                  required
                  placeholder="Enter late minutes"
                />
              </div>
              <div>
                <Label htmlFor="checkInAt">Check In Time</Label>
                <Input
                  id="checkInAt"
                  name="checkInAt"
                  type="datetime-local"
                  required
                />
              </div>
              <div>
                <Label htmlFor="note">Note</Label>
                <Textarea
                  id="note"
                  name="note"
                  placeholder="Additional notes (optional)"
                  className="min-h-[80px]"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={createLateArrivalMutation.isPending}>
                  {createLateArrivalMutation.isPending ? "Creating..." : "Create"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Records</p>
                <p className="text-2xl font-bold text-gray-900">{totalLateArrivals}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Minor (&le;15m)</p>
                <p className="text-2xl font-bold text-yellow-600">{minorLateArrivals}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Moderate (15-30m)</p>
                <p className="text-2xl font-bold text-orange-600">{moderateLateArrivals}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Severe (&gt;30m)</p>
                <p className="text-2xl font-bold text-red-600">{severeLateArrivals}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Auto Created</p>
                <p className="text-2xl font-bold text-blue-600">{autoCreatedLateArrivals}</p>
              </div>
              <User className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Time</p>
                <p className="text-2xl font-bold text-purple-600">{formatMinutes(totalLateMinutes)}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by employee name or note..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-48">
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
              >
                <option value="">All Severities</option>
                <option value="minor">Minor (&le;15m)</option>
                <option value="moderate">Moderate (15-30m)</option>
                <option value="severe">Severe (&gt;30m)</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Late Arrivals Table */}
      <Card>
        <CardHeader>
          <CardTitle>Late Arrival Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Late Minutes</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Check In Time</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLateArrivals.map((lateArrival: LateArrival) => (
                  <TableRow key={lateArrival.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                          {lateArrival.userName?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-medium">{lateArrival.userName || 'Unknown User'}</p>
                          <p className="text-sm text-gray-500">ID: {lateArrival.userId}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{formatMinutes(lateArrival.lateMinutes)}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getSeverityBadge(lateArrival.lateMinutes)}</TableCell>
                    <TableCell>
                      {lateArrival.checkInAt ? formatDateTime(lateArrival.checkInAt) : '-'}
                    </TableCell>
                    <TableCell>{getTypeBadge(lateArrival.autoCreated)}</TableCell>
                    <TableCell>
                      <div className="max-w-32 truncate" title={lateArrival.note}>
                        {lateArrival.note || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      {lateArrival.createdAt ? formatDateTime(lateArrival.createdAt) : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(lateArrival)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditLateArrival(lateArrival)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(lateArrival.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Late Arrival Details</DialogTitle>
          </DialogHeader>
          {selectedLateArrival && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Employee</label>
                <p className="text-sm text-gray-900">{selectedLateArrival.userName || 'Unknown User'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Late Minutes</label>
                <p className="text-sm text-gray-900">{formatMinutes(selectedLateArrival.lateMinutes)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Severity</label>
                <div className="mt-1">{getSeverityBadge(selectedLateArrival.lateMinutes)}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Check In Time</label>
                <p className="text-sm text-gray-900">
                  {selectedLateArrival.checkInAt ? formatDateTime(selectedLateArrival.checkInAt) : '-'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Type</label>
                <div className="mt-1">{getTypeBadge(selectedLateArrival.autoCreated)}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Date</label>
                <p className="text-sm text-gray-900">
                  {selectedLateArrival.createdAt ? formatDateTime(selectedLateArrival.createdAt) : '-'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Note</label>
                <p className="text-sm text-gray-900">{selectedLateArrival.note || '-'}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Late Arrival Record</DialogTitle>
          </DialogHeader>
          {editingLateArrival && (
            <form onSubmit={handleUpdateLateArrival} className="space-y-4">
              <div>
                <Label htmlFor="edit_userId">Employee</Label>
                <select
                  id="edit_userId"
                  name="userId"
                  required
                  defaultValue={editingLateArrival.userId}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select employee</option>
                  {users.map((user: any) => (
                    <option key={user.id} value={user.id}>
                      {user.firstName} {user.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="edit_lateMinutes">Late Minutes</Label>
                <Input
                  id="edit_lateMinutes"
                  name="lateMinutes"
                  type="number"
                  min="1"
                  required
                  defaultValue={editingLateArrival.lateMinutes}
                  placeholder="Enter late minutes"
                />
              </div>
              <div>
                <Label htmlFor="edit_checkInAt">Check In Time</Label>
                <Input
                  id="edit_checkInAt"
                  name="checkInAt"
                  type="datetime-local"
                  required
                  defaultValue={editingLateArrival.checkInAt ? new Date(editingLateArrival.checkInAt).toISOString().slice(0, 16) : ''}
                />
              </div>
              <div>
                <Label htmlFor="edit_note">Note</Label>
                <Textarea
                  id="edit_note"
                  name="note"
                  defaultValue={editingLateArrival.note}
                  placeholder="Additional notes (optional)"
                  className="min-h-[80px]"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={updateLateArrivalMutation.isPending}>
                  {updateLateArrivalMutation.isPending ? "Updating..." : "Update"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingLateArrival(null);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
      </div>
    </MainLayout>
  );
}