import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, MapPin, User, Calendar, CheckCircle, XCircle, Eye } from "lucide-react";
import { kmtApiClient } from "@/lib/kmt-api";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface CheckInOut {
  id: string;
  userId: string;
  userName: string;
  checkInAt: string;
  checkOutAt?: string;
  location?: string;
  note?: string;
  status: 'CheckedIn' | 'CheckedOut';
  createdAt: string;
}

export default function CheckInOut() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedRecord, setSelectedRecord] = useState<CheckInOut | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch check-in/out records
  const { data: checkInOutData = [], isLoading } = useQuery({
    queryKey: ["/api/CheckInOut"],
    queryFn: async () => {
      const response = await kmtApiClient.getAllCheckInOut();
      return response?.data || [];
    },
  });

  // Fetch users for display
  const { data: users = [] } = useQuery({
    queryKey: ["/api/User"],
    queryFn: async () => {
      const response = await kmtApiClient.getUsers();
      return response?.data || [];
    },
  });

  // Update check-in/out mutation
  const updateCheckInOutMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      kmtApiClient.updateCheckInOut(id, data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Check-in/out record updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/CheckInOut"] });
      setIsDetailsModalOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to update check-in/out record",
        variant: "destructive",
      });
    },
  });

  // Delete check-in/out mutation
  const deleteCheckInOutMutation = useMutation({
    mutationFn: (id: string) => kmtApiClient.deleteCheckInOut(id),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Check-in/out record deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/CheckInOut"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to delete check-in/out record",
        variant: "destructive",
      });
    },
  });

  // Filter records
  const filteredCheckInOut = checkInOutData.filter((record: CheckInOut) => {
    const matchesSearch = record.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.note?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (record: CheckInOut) => {
    setSelectedRecord(record);
    setIsDetailsModalOpen(true);
  };

  const handleApprove = (id: string) => {
    updateCheckInOutMutation.mutate({
      id,
      data: { approved: true, approvedAt: new Date().toISOString() }
    });
  };

  const handleReject = (id: string) => {
    updateCheckInOutMutation.mutate({
      id,
      data: { approved: false, rejectedAt: new Date().toISOString() }
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this check-in/out record?")) {
      deleteCheckInOutMutation.mutate(id);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CheckedIn':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Checked In</Badge>;
      case 'CheckedOut':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Checked Out</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy HH:mm");
    } catch {
      return dateString;
    }
  };

  // Calculate statistics
  const totalRecords = filteredCheckInOut.length;
  const checkedInCount = filteredCheckInOut.filter((record: CheckInOut) => record.status === 'CheckedIn').length;
  const checkedOutCount = filteredCheckInOut.filter((record: CheckInOut) => record.status === 'CheckedOut').length;
  const pendingApprovalCount = filteredCheckInOut.filter((record: CheckInOut) => !record.approved).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading check-in/out records...</p>
        </div>
      </div>
    );
  }

  return (
    <MainLayout title="Check In/Out Management" breadcrumb="Check In/Out">
      <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Check-In/Out Approval</h1>
          <p className="text-gray-600 mt-1">Review and approve employee check-in/out records</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Records</p>
                <p className="text-2xl font-bold text-gray-900">{totalRecords}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Checked In</p>
                <p className="text-2xl font-bold text-green-600">{checkedInCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Checked Out</p>
                <p className="text-2xl font-bold text-red-600">{checkedOutCount}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingApprovalCount}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
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
                placeholder="Search by employee name, location, or note..."
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
                <option value="CheckedIn">Checked In</option>
                <option value="CheckedOut">Checked Out</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Check-In/Out Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Check-In Time</TableHead>
                  <TableHead>Check-Out Time</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCheckInOut.map((record: CheckInOut) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                          {record.userName?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-medium">{record.userName || 'Unknown User'}</p>
                          <p className="text-sm text-gray-500">ID: {record.userId}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell>
                      {record.checkInAt ? formatDateTime(record.checkInAt) : '-'}
                    </TableCell>
                    <TableCell>
                      {record.checkOutAt ? formatDateTime(record.checkOutAt) : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        {record.location || 'Not specified'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-32 truncate" title={record.note}>
                        {record.note || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(record)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleApprove(record.id)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReject(record.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XCircle className="h-4 w-4" />
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
            <DialogTitle>Check-In/Out Details</DialogTitle>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Employee</label>
                <p className="text-sm text-gray-900">{selectedRecord.userName || 'Unknown User'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <div className="mt-1">{getStatusBadge(selectedRecord.status)}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Check-In Time</label>
                <p className="text-sm text-gray-900">
                  {selectedRecord.checkInAt ? formatDateTime(selectedRecord.checkInAt) : '-'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Check-Out Time</label>
                <p className="text-sm text-gray-900">
                  {selectedRecord.checkOutAt ? formatDateTime(selectedRecord.checkOutAt) : '-'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Location</label>
                <p className="text-sm text-gray-900">{selectedRecord.location || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Note</label>
                <p className="text-sm text-gray-900">{selectedRecord.note || '-'}</p>
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => handleApprove(selectedRecord.id)}
                  className="flex-1"
                  disabled={updateCheckInOutMutation.isPending}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleReject(selectedRecord.id)}
                  className="flex-1"
                  disabled={updateCheckInOutMutation.isPending}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      </div>
    </MainLayout>
  );
}