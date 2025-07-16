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
import { Clock, User, Calendar, CheckCircle, XCircle, Plus, Edit, Eye } from "lucide-react";
import { kmtApiClient } from "@/lib/kmt-api";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface OvertimeRequest {
  id: string;
  userId: string;
  userName: string;
  checkInOutId: string;
  checkInAt: string;
  checkOutAt: string;
  minutes: number;
  note: string;
  autoCreated: boolean;
  isApproved: boolean;
  approvedAt?: string;
  approvedBy?: string;
  approvedByName?: string;
  createdAt: string;
}

export default function Overtime() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<OvertimeRequest | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch overtime requests
  const { data: overtimeRequests = [], isLoading } = useQuery({
    queryKey: ["/api/Overtime"],
    queryFn: async () => {
      const response = await kmtApiClient.getOvertimeRequests();
      return response?.data || [];
    },
  });

  // Fetch users for dropdown
  const { data: users = [] } = useQuery({
    queryKey: ["/api/User"],
    queryFn: async () => {
      try {
        const response = await kmtApiClient.getUsers();
        console.log('Users fetched for overtime:', response);
        return Array.isArray(response) ? response : [];
      } catch (error) {
        console.error('Error fetching users:', error);
        return [];
      }
    },
  });

  // Create overtime request mutation
  const createOvertimeMutation = useMutation({
    mutationFn: (data: any) => kmtApiClient.createOvertimeRequest(data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Overtime request created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/Overtime"] });
      setIsCreateModalOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to create overtime request",
        variant: "destructive",
      });
    },
  });

  // Approve overtime request mutation
  const approveOvertimeMutation = useMutation({
    mutationFn: ({ id, comments }: { id: string; comments?: string }) => 
      kmtApiClient.approveOvertimeRequest(id, comments),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Overtime request approved successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/Overtime"] });
      setIsDetailsModalOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to approve overtime request",
        variant: "destructive",
      });
    },
  });

  // Reject overtime request mutation
  const rejectOvertimeMutation = useMutation({
    mutationFn: ({ id, comments }: { id: string; comments?: string }) => 
      kmtApiClient.rejectOvertimeRequest(id, comments),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Overtime request rejected successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/Overtime"] });
      setIsDetailsModalOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to reject overtime request",
        variant: "destructive",
      });
    },
  });

  // Delete overtime request mutation
  const deleteOvertimeMutation = useMutation({
    mutationFn: (id: string) => kmtApiClient.deleteOvertime(id),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Overtime request deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/Overtime"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to delete overtime request",
        variant: "destructive",
      });
    },
  });

  // Filter requests
  const filteredRequests = overtimeRequests.filter((request: OvertimeRequest) => {
    const matchesSearch = request.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.note?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || 
      (statusFilter === "approved" && request.isApproved) ||
      (statusFilter === "pending" && !request.isApproved) ||
      (statusFilter === "auto" && request.autoCreated);
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (request: OvertimeRequest) => {
    setSelectedRequest(request);
    setIsDetailsModalOpen(true);
  };

  const handleCreateOvertime = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      userId: formData.get("userId"),
      minutes: parseInt(formData.get("minutes") as string),
      note: formData.get("note"),
      checkInAt: formData.get("checkInAt"),
      checkOutAt: formData.get("checkOutAt"),
    };
    createOvertimeMutation.mutate(data);
  };

  const handleApprove = (id: string, comments?: string) => {
    approveOvertimeMutation.mutate({ id, comments });
  };

  const handleReject = (id: string, comments?: string) => {
    rejectOvertimeMutation.mutate({ id, comments });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this overtime request?")) {
      deleteOvertimeMutation.mutate(id);
    }
  };

  const getStatusBadge = (request: OvertimeRequest) => {
    if (request.isApproved) {
      return <Badge variant="secondary" className="bg-green-100 text-green-800">Approved</Badge>;
    } else {
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
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
    return `${hours}h ${mins}m`;
  };

  // Calculate statistics
  const totalRequests = filteredRequests.length;
  const approvedRequests = filteredRequests.filter((req: OvertimeRequest) => req.isApproved).length;
  const pendingRequests = filteredRequests.filter((req: OvertimeRequest) => !req.isApproved).length;
  const autoCreatedRequests = filteredRequests.filter((req: OvertimeRequest) => req.autoCreated).length;
  const totalMinutes = filteredRequests.reduce((sum: number, req: OvertimeRequest) => sum + req.minutes, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading overtime requests...</p>
        </div>
      </div>
    );
  }

  return (
    <MainLayout title="Overtime Management" breadcrumb="Overtime">
      <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Overtime Management</h1>
          <p className="text-gray-600 mt-1">Manage employee overtime requests and approvals</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Overtime Request
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Overtime Request</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateOvertime} className="space-y-4">
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
                      {user.name || user.firstName + ' ' + user.lastName || user.username || user.email}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="minutes">Overtime Minutes</Label>
                <Input
                  id="minutes"
                  name="minutes"
                  type="number"
                  min="1"
                  required
                  placeholder="Enter overtime minutes"
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
                <Label htmlFor="checkOutAt">Check Out Time</Label>
                <Input
                  id="checkOutAt"
                  name="checkOutAt"
                  type="datetime-local"
                  required
                />
              </div>
              <div>
                <Label htmlFor="note">Note</Label>
                <Textarea
                  id="note"
                  name="note"
                  placeholder="Optional note about the overtime"
                  className="min-h-[80px]"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={createOvertimeMutation.isPending}>
                  {createOvertimeMutation.isPending ? "Creating..." : "Create"}
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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">{totalRequests}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{approvedRequests}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingRequests}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Auto Created</p>
                <p className="text-2xl font-bold text-blue-600">{autoCreatedRequests}</p>
              </div>
              <User className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Hours</p>
                <p className="text-2xl font-bold text-purple-600">{formatMinutes(totalMinutes)}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Requests</CardTitle>
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
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="auto">Auto Created</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Overtime Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request: OvertimeRequest) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                          {request.userName?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-medium">{request.userName || 'Unknown User'}</p>
                          <p className="text-sm text-gray-500">ID: {request.userId}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{formatMinutes(request.minutes)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {request.checkInAt ? formatDateTime(request.checkInAt) : '-'}
                    </TableCell>
                    <TableCell>
                      {request.checkOutAt ? formatDateTime(request.checkOutAt) : '-'}
                    </TableCell>
                    <TableCell>{getTypeBadge(request.autoCreated)}</TableCell>
                    <TableCell>{getStatusBadge(request)}</TableCell>
                    <TableCell>
                      <div className="max-w-32 truncate" title={request.note}>
                        {request.note || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(request)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {!request.isApproved && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleApprove(request.id)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReject(request.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
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
            <DialogTitle>Overtime Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Employee</label>
                <p className="text-sm text-gray-900">{selectedRequest.userName || 'Unknown User'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Duration</label>
                <p className="text-sm text-gray-900">{formatMinutes(selectedRequest.minutes)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Check In Time</label>
                <p className="text-sm text-gray-900">
                  {selectedRequest.checkInAt ? formatDateTime(selectedRequest.checkInAt) : '-'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Check Out Time</label>
                <p className="text-sm text-gray-900">
                  {selectedRequest.checkOutAt ? formatDateTime(selectedRequest.checkOutAt) : '-'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Type</label>
                <div className="mt-1">{getTypeBadge(selectedRequest.autoCreated)}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <div className="mt-1">{getStatusBadge(selectedRequest)}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Note</label>
                <p className="text-sm text-gray-900">{selectedRequest.note || '-'}</p>
              </div>
              {selectedRequest.isApproved && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Approved By</label>
                  <p className="text-sm text-gray-900">{selectedRequest.approvedByName || 'Unknown'}</p>
                  <p className="text-xs text-gray-500">
                    {selectedRequest.approvedAt ? formatDateTime(selectedRequest.approvedAt) : '-'}
                  </p>
                </div>
              )}
              {!selectedRequest.isApproved && (
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => handleApprove(selectedRequest.id)}
                    className="flex-1"
                    disabled={approveOvertimeMutation.isPending}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleReject(selectedRequest.id)}
                    className="flex-1"
                    disabled={rejectOvertimeMutation.isPending}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      </div>
    </MainLayout>
  );
}