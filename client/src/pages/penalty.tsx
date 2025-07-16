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
import { AlertTriangle, User, Calendar, DollarSign, Plus, Edit, Trash2, Eye } from "lucide-react";
import { kmtApiClient } from "@/lib/kmt-api";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Penalty {
  id: string;
  userId: string;
  userName: string;
  madeBy: string;
  madeByName: string;
  payrollId: string;
  value: number;
  note: string;
  reason: string;
  applied: boolean;
  createdAt: string;
}

const PenaltyReasons = [
  "Late Arrival",
  "Unauthorized Absence",
  "Policy Violation",
  "Performance Issue",
  "Disciplinary Action",
  "Other"
];

export default function Penalty() {
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedFilter, setAppliedFilter] = useState<string>("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPenalty, setSelectedPenalty] = useState<Penalty | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [editingPenalty, setEditingPenalty] = useState<Penalty | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch penalties
  const { data: penalties = [], isLoading } = useQuery({
    queryKey: ["/api/Penalty"],
    queryFn: async () => {
      try {
        const response = await kmtApiClient.getPenalties();
        console.log('Penalties fetched:', response);
        return response?.data || [];
      } catch (error) {
        console.error('Error fetching penalties:', error);
        return [];
      }
    },
  });

  // Fetch users for dropdown
  const { data: users = [] } = useQuery({
    queryKey: ["/api/User"],
    queryFn: async () => {
      try {
        const response = await kmtApiClient.getUsers();
        console.log('Users fetched for penalty:', response);
        return Array.isArray(response) ? response : [];
      } catch (error) {
        console.error('Error fetching users for penalty:', error);
        return [];
      }
    },
  });

  // Create penalty mutation
  const createPenaltyMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log('Creating penalty with data:', data);
      const response = await kmtApiClient.createPenalty(data);
      console.log('Penalty creation response:', response);
      return response;
    },
    onSuccess: (data) => {
      console.log('Penalty created successfully:', data);
      toast({
        title: "Success",
        description: "Penalty created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/Penalty"] });
      // Force refetch to ensure UI updates
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ["/api/Penalty"] });
      }, 100);
      setIsCreateModalOpen(false);
    },
    onError: (error: Error) => {
      console.error('Error creating penalty:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create penalty",
        variant: "destructive",
      });
    },
  });

  // Update penalty mutation
  const updatePenaltyMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      kmtApiClient.updatePenalty(id, data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Penalty updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/Penalty"] });
      setIsEditModalOpen(false);
      setEditingPenalty(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to update penalty",
        variant: "destructive",
      });
    },
  });

  // Delete penalty mutation
  const deletePenaltyMutation = useMutation({
    mutationFn: (id: string) => kmtApiClient.deletePenalty(id),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Penalty deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/Penalty"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to delete penalty",
        variant: "destructive",
      });
    },
  });

  // Filter penalties
  const filteredPenalties = penalties.filter((penalty: Penalty) => {
    const matchesSearch = penalty.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         penalty.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         penalty.note?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesApplied = !appliedFilter || 
      (appliedFilter === "applied" && penalty.applied) ||
      (appliedFilter === "pending" && !penalty.applied);
    return matchesSearch && matchesApplied;
  });

  const handleViewDetails = (penalty: Penalty) => {
    setSelectedPenalty(penalty);
    setIsDetailsModalOpen(true);
  };

  const handleEditPenalty = (penalty: Penalty) => {
    setEditingPenalty(penalty);
    setIsEditModalOpen(true);
  };

  const handleCreatePenalty = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      userId: formData.get("userId"),
      value: parseFloat(formData.get("value") as string),
      reason: formData.get("reason"),
      note: formData.get("note"),
    };
    createPenaltyMutation.mutate(data);
  };

  const handleUpdatePenalty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPenalty) return;
    
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      userId: formData.get("userId"),
      value: parseFloat(formData.get("value") as string),
      reason: formData.get("reason"),
      note: formData.get("note"),
    };
    updatePenaltyMutation.mutate({ id: editingPenalty.id, data });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this penalty?")) {
      deletePenaltyMutation.mutate(id);
    }
  };

  const getAppliedBadge = (applied: boolean) => {
    return applied ? 
      <Badge variant="secondary" className="bg-green-100 text-green-800">Applied</Badge> :
      <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
  };

  const getReasonBadge = (reason: string) => {
    const colors = {
      "Late Arrival": "bg-yellow-100 text-yellow-800",
      "Unauthorized Absence": "bg-red-100 text-red-800",
      "Policy Violation": "bg-orange-100 text-orange-800",
      "Performance Issue": "bg-blue-100 text-blue-800",
      "Disciplinary Action": "bg-purple-100 text-purple-800",
      "Other": "bg-gray-100 text-gray-800"
    };
    return (
      <Badge variant="outline" className={colors[reason as keyof typeof colors] || "bg-gray-100 text-gray-800"}>
        {reason}
      </Badge>
    );
  };

  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy HH:mm");
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Calculate statistics
  const totalPenalties = filteredPenalties.length;
  const appliedPenalties = filteredPenalties.filter((penalty: Penalty) => penalty.applied).length;
  const pendingPenalties = filteredPenalties.filter((penalty: Penalty) => !penalty.applied).length;
  const totalValue = filteredPenalties.reduce((sum: number, penalty: Penalty) => sum + penalty.value, 0);
  const appliedValue = filteredPenalties.filter((penalty: Penalty) => penalty.applied).reduce((sum: number, penalty: Penalty) => sum + penalty.value, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading penalties...</p>
        </div>
      </div>
    );
  }

  return (
    <MainLayout title="Penalty Management" breadcrumb="Penalty">
      <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Penalty Management</h1>
          <p className="text-gray-600 mt-1">Manage employee penalties and deductions</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Penalty
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Penalty</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreatePenalty} className="space-y-4">
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
                      {user.name || (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName || user.lastName || user.username || user.email || 'Unknown User')}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="value">Penalty Amount</Label>
                <Input
                  id="value"
                  name="value"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  placeholder="Enter penalty amount"
                />
              </div>
              <div>
                <Label htmlFor="reason">Reason</Label>
                <select
                  id="reason"
                  name="reason"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select reason</option>
                  {PenaltyReasons.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
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
                <Button type="submit" className="flex-1" disabled={createPenaltyMutation.isPending}>
                  {createPenaltyMutation.isPending ? "Creating..." : "Create"}
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
                <p className="text-sm font-medium text-gray-600">Total Penalties</p>
                <p className="text-2xl font-bold text-gray-900">{totalPenalties}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Applied</p>
                <p className="text-2xl font-bold text-green-600">{appliedPenalties}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingPenalties}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalValue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Applied Value</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(appliedValue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Penalties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by employee name, reason, or note..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-48">
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={appliedFilter}
                onChange={(e) => setAppliedFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="applied">Applied</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Penalties Table */}
      <Card>
        <CardHeader>
          <CardTitle>Penalties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPenalties.map((penalty: Penalty) => (
                  <TableRow key={penalty.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-sm font-medium">
                          {penalty.userName?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-medium">{penalty.userName || 'Unknown User'}</p>
                          <p className="text-sm text-gray-500">ID: {penalty.userId}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-red-600">{formatCurrency(penalty.value)}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getReasonBadge(penalty.reason)}</TableCell>
                    <TableCell>{getAppliedBadge(penalty.applied)}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{penalty.madeByName || 'Unknown'}</p>
                        <p className="text-sm text-gray-500">ID: {penalty.madeBy}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {penalty.createdAt ? formatDateTime(penalty.createdAt) : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(penalty)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditPenalty(penalty)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(penalty.id)}
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
            <DialogTitle>Penalty Details</DialogTitle>
          </DialogHeader>
          {selectedPenalty && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Employee</label>
                <p className="text-sm text-gray-900">{selectedPenalty.userName || 'Unknown User'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Amount</label>
                <p className="text-sm text-gray-900">{formatCurrency(selectedPenalty.value)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Reason</label>
                <div className="mt-1">{getReasonBadge(selectedPenalty.reason)}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <div className="mt-1">{getAppliedBadge(selectedPenalty.applied)}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Created By</label>
                <p className="text-sm text-gray-900">{selectedPenalty.madeByName || 'Unknown'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Date</label>
                <p className="text-sm text-gray-900">
                  {selectedPenalty.createdAt ? formatDateTime(selectedPenalty.createdAt) : '-'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Note</label>
                <p className="text-sm text-gray-900">{selectedPenalty.note || '-'}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Penalty</DialogTitle>
          </DialogHeader>
          {editingPenalty && (
            <form onSubmit={handleUpdatePenalty} className="space-y-4">
              <div>
                <Label htmlFor="edit_userId">Employee</Label>
                <select
                  id="edit_userId"
                  name="userId"
                  required
                  defaultValue={editingPenalty.userId}
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
                <Label htmlFor="edit_value">Penalty Amount</Label>
                <Input
                  id="edit_value"
                  name="value"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  defaultValue={editingPenalty.value}
                  placeholder="Enter penalty amount"
                />
              </div>
              <div>
                <Label htmlFor="edit_reason">Reason</Label>
                <select
                  id="edit_reason"
                  name="reason"
                  required
                  defaultValue={editingPenalty.reason}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select reason</option>
                  {PenaltyReasons.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="edit_note">Note</Label>
                <Textarea
                  id="edit_note"
                  name="note"
                  defaultValue={editingPenalty.note}
                  placeholder="Additional notes (optional)"
                  className="min-h-[80px]"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={updatePenaltyMutation.isPending}>
                  {updatePenaltyMutation.isPending ? "Updating..." : "Update"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingPenalty(null);
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