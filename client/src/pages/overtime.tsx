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
import { Clock, User, Calendar, CheckCircle, XCircle, Plus } from "lucide-react";
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
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch overtime requests
  const { data: overtimeRequests = [], isLoading } = useQuery({
    queryKey: ["/api/Overtime"],
    queryFn: () => kmtApiClient.getOvertimeRequests(),
    onError: (error: Error) => {
      console.error("Error fetching overtime requests:", error);
      toast({
        title: "Error",
        description: "Failed to load overtime requests",
        variant: "destructive",
      });
    },
  });

  // Fetch users for dropdown
  const { data: users = [] } = useQuery({
    queryKey: ["/api/User"],
    queryFn: () => kmtApiClient.getUsers(),
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
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to reject overtime request",
        variant: "destructive",
      });
    },
  });

  const filteredOvertimeRequests = overtimeRequests.filter((request: OvertimeRequest) => {
    const matchesSearch = request.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "" || 
      (statusFilter === "approved" && request.isApproved) ||
      (statusFilter === "pending" && !request.isApproved);
    return matchesSearch && matchesStatus;
  });

  const handleCreateOvertime = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const overtimeData = {
      userId: formData.get("userId"),
      checkInOutId: formData.get("checkInOutId"),
      minutes: parseInt(formData.get("minutes") as string),
      note: formData.get("note"),
    };
    createOvertimeMutation.mutate(overtimeData);
  };

  const handleApproveOvertime = (id: string) => {
    approveOvertimeMutation.mutate({ id });
  };

  const handleRejectOvertime = (id: string) => {
    rejectOvertimeMutation.mutate({ id });
  };

  const getStatusBadge = (request: OvertimeRequest) => {
    if (request.isApproved) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Approved</Badge>;
    } else {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
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
          <h1 className="text-3xl font-bold text-gray-900">Overtime Management</h1>
          <p className="text-gray-600 mt-2">Manage employee overtime requests and approvals</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Overtime Request
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Overtime Request</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateOvertime} className="space-y-4">
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
                <Label htmlFor="minutes">Overtime Minutes</Label>
                <Input
                  id="minutes"
                  name="minutes"
                  type="number"
                  placeholder="Enter overtime minutes"
                  required
                />
              </div>
              <div>
                <Label htmlFor="note">Note</Label>
                <Textarea
                  id="note"
                  name="note"
                  placeholder="Enter note or reason for overtime"
                  rows={3}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full"
                disabled={createOvertimeMutation.isPending}
              >
                {createOvertimeMutation.isPending ? "Creating..." : "Create Overtime Request"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Overtime Requests
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
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
                  <TableHead>Check-In</TableHead>
                  <TableHead>Check-Out</TableHead>
                  <TableHead>Overtime Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Approved By</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOvertimeRequests.map((request: OvertimeRequest) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        {request.userName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {format(new Date(request.checkInAt), "MMM dd, HH:mm")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {format(new Date(request.checkOutAt), "MMM dd, HH:mm")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {formatMinutes(request.minutes)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(request)}
                    </TableCell>
                    <TableCell>
                      {request.approvedByName ? (
                        <div className="text-sm">
                          {request.approvedByName}
                          <br />
                          <span className="text-gray-500">
                            {format(new Date(request.approvedAt!), "MMM dd, HH:mm")}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate text-sm">
                        {request.note || "No note"}
                      </div>
                    </TableCell>
                    <TableCell>
                      {!request.isApproved && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 border-green-600 hover:bg-green-50"
                            onClick={() => handleApproveOvertime(request.id)}
                            disabled={approveOvertimeMutation.isPending}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => handleRejectOvertime(request.id)}
                            disabled={rejectOvertimeMutation.isPending}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
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