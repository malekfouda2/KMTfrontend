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
import { Gift, User, Calendar, DollarSign, Plus, Edit, Trash2, Eye } from "lucide-react";
import { kmtApiClient } from "@/lib/kmt-api";
import { getUserDisplayName } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Bonus {
  id: string;
  userId: string;
  userName: string;
  madeBy: string;
  madeByName: string;
  payrollId: string;
  value: number;
  note: string;
  reason: string;
  type: number;
  applied: boolean;
  createdAt: string;
}

const BonusTypes = {
  1: "Performance Bonus",
  2: "Holiday Bonus",
  3: "Project Completion",
  4: "Overtime Bonus",
  5: "Special Recognition",
  6: "Other"
};

export default function Bonus() {
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedFilter, setAppliedFilter] = useState<string>("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBonus, setSelectedBonus] = useState<Bonus | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [editingBonus, setEditingBonus] = useState<Bonus | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch bonuses
  const { data: bonuses = [], isLoading } = useQuery({
    queryKey: ["/api/Bonus"],
    queryFn: async () => {
      try {
        const response = await kmtApiClient.getBonuses();
        console.log('Bonuses fetched:', response);
        return response?.data || [];
      } catch (error) {
        console.error('Error fetching bonuses:', error);
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
        console.log('Users fetched for bonus:', response);
        return Array.isArray(response) ? response : [];
      } catch (error) {
        console.error('Error fetching users:', error);
        return [];
      }
    },
  });

  // Create bonus mutation
  const createBonusMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log('Creating bonus with data:', data);
      const response = await kmtApiClient.createBonus(data);
      console.log('Bonus creation response:', response);
      return response;
    },
    onSuccess: (data) => {
      console.log('Bonus created successfully:', data);
      toast({
        title: "Success",
        description: "Bonus created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/Bonus"] });
      // Force refetch to ensure UI updates
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ["/api/Bonus"] });
      }, 100);
      setIsCreateModalOpen(false);
    },
    onError: (error: Error) => {
      console.error('Error creating bonus:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create bonus",
        variant: "destructive",
      });
    },
  });

  // Update bonus mutation
  const updateBonusMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      kmtApiClient.updateBonus(id, data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Bonus updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/Bonus"] });
      setIsEditModalOpen(false);
      setEditingBonus(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to update bonus",
        variant: "destructive",
      });
    },
  });

  // Delete bonus mutation
  const deleteBonusMutation = useMutation({
    mutationFn: (id: string) => kmtApiClient.deleteBonus(id),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Bonus deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/Bonus"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to delete bonus",
        variant: "destructive",
      });
    },
  });

  // Filter bonuses
  const filteredBonuses = bonuses.filter((bonus: Bonus) => {
    const matchesSearch = bonus.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bonus.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bonus.note?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesApplied = !appliedFilter || 
      (appliedFilter === "applied" && bonus.applied) ||
      (appliedFilter === "pending" && !bonus.applied);
    return matchesSearch && matchesApplied;
  });

  const handleViewDetails = (bonus: Bonus) => {
    setSelectedBonus(bonus);
    setIsDetailsModalOpen(true);
  };

  const handleEditBonus = (bonus: Bonus) => {
    setEditingBonus(bonus);
    setIsEditModalOpen(true);
  };

  const handleCreateBonus = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      userId: formData.get("userId"),
      value: parseFloat(formData.get("value") as string),
      type: parseInt(formData.get("type") as string),
      reason: formData.get("reason"),
      note: formData.get("note"),
    };
    createBonusMutation.mutate(data);
  };

  const handleUpdateBonus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBonus) return;
    
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      userId: formData.get("userId"),
      value: parseFloat(formData.get("value") as string),
      type: parseInt(formData.get("type") as string),
      reason: formData.get("reason"),
      note: formData.get("note"),
    };
    updateBonusMutation.mutate({ id: editingBonus.id, data });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this bonus?")) {
      deleteBonusMutation.mutate(id);
    }
  };

  const getAppliedBadge = (applied: boolean) => {
    return applied ? 
      <Badge variant="secondary" className="bg-green-100 text-green-800">Applied</Badge> :
      <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
  };

  const getTypeBadge = (type: number) => {
    const typeName = BonusTypes[type as keyof typeof BonusTypes] || "Unknown";
    const colors = {
      1: "bg-blue-100 text-blue-800",
      2: "bg-purple-100 text-purple-800",
      3: "bg-green-100 text-green-800",
      4: "bg-orange-100 text-orange-800",
      5: "bg-pink-100 text-pink-800",
      6: "bg-gray-100 text-gray-800"
    };
    return (
      <Badge variant="outline" className={colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800"}>
        {typeName}
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
  const totalBonuses = filteredBonuses.length;
  const appliedBonuses = filteredBonuses.filter((bonus: Bonus) => bonus.applied).length;
  const pendingBonuses = filteredBonuses.filter((bonus: Bonus) => !bonus.applied).length;
  const totalValue = filteredBonuses.reduce((sum: number, bonus: Bonus) => sum + bonus.value, 0);
  const appliedValue = filteredBonuses.filter((bonus: Bonus) => bonus.applied).reduce((sum: number, bonus: Bonus) => sum + bonus.value, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading bonuses...</p>
        </div>
      </div>
    );
  }

  return (
    <MainLayout title="Bonus Management" breadcrumb="Bonus">
      <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bonus Management</h1>
          <p className="text-gray-600 mt-1">Manage employee bonuses and rewards</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Bonus
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Bonus</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateBonus} className="space-y-4">
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
                      {getUserDisplayName(user)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="value">Bonus Amount</Label>
                <Input
                  id="value"
                  name="value"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  placeholder="Enter bonus amount"
                />
              </div>
              <div>
                <Label htmlFor="type">Bonus Type</Label>
                <select
                  id="type"
                  name="type"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select type</option>
                  {Object.entries(BonusTypes).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="reason">Reason</Label>
                <Input
                  id="reason"
                  name="reason"
                  required
                  placeholder="Enter reason for bonus"
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
                <Button type="submit" className="flex-1" disabled={createBonusMutation.isPending}>
                  {createBonusMutation.isPending ? "Creating..." : "Create"}
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
                <p className="text-sm font-medium text-gray-600">Total Bonuses</p>
                <p className="text-2xl font-bold text-gray-900">{totalBonuses}</p>
              </div>
              <Gift className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Applied</p>
                <p className="text-2xl font-bold text-green-600">{appliedBonuses}</p>
              </div>
              <Gift className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingBonuses}</p>
              </div>
              <Gift className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(totalValue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-500" />
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
          <CardTitle>Filter Bonuses</CardTitle>
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

      {/* Bonuses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Bonuses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBonuses.map((bonus: Bonus) => (
                  <TableRow key={bonus.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                          {bonus.userName?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-medium">{bonus.userName || 'Unknown User'}</p>
                          <p className="text-sm text-gray-500">ID: {bonus.userId}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{formatCurrency(bonus.value)}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(bonus.type)}</TableCell>
                    <TableCell>
                      <div className="max-w-32 truncate" title={bonus.reason}>
                        {bonus.reason}
                      </div>
                    </TableCell>
                    <TableCell>{getAppliedBadge(bonus.applied)}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{bonus.madeByName || 'Unknown'}</p>
                        <p className="text-sm text-gray-500">ID: {bonus.madeBy}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {bonus.createdAt ? formatDateTime(bonus.createdAt) : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(bonus)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditBonus(bonus)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(bonus.id)}
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
            <DialogTitle>Bonus Details</DialogTitle>
          </DialogHeader>
          {selectedBonus && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Employee</label>
                <p className="text-sm text-gray-900">{selectedBonus.userName || 'Unknown User'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Amount</label>
                <p className="text-sm text-gray-900">{formatCurrency(selectedBonus.value)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Type</label>
                <div className="mt-1">{getTypeBadge(selectedBonus.type)}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Reason</label>
                <p className="text-sm text-gray-900">{selectedBonus.reason}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <div className="mt-1">{getAppliedBadge(selectedBonus.applied)}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Created By</label>
                <p className="text-sm text-gray-900">{selectedBonus.madeByName || 'Unknown'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Date</label>
                <p className="text-sm text-gray-900">
                  {selectedBonus.createdAt ? formatDateTime(selectedBonus.createdAt) : '-'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Note</label>
                <p className="text-sm text-gray-900">{selectedBonus.note || '-'}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Bonus</DialogTitle>
          </DialogHeader>
          {editingBonus && (
            <form onSubmit={handleUpdateBonus} className="space-y-4">
              <div>
                <Label htmlFor="edit_userId">Employee</Label>
                <select
                  id="edit_userId"
                  name="userId"
                  required
                  defaultValue={editingBonus.userId}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select employee</option>
                  {users.map((user: any) => (
                    <option key={user.id} value={user.id}>
                      {getUserDisplayName(user)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="edit_value">Bonus Amount</Label>
                <Input
                  id="edit_value"
                  name="value"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  defaultValue={editingBonus.value}
                  placeholder="Enter bonus amount"
                />
              </div>
              <div>
                <Label htmlFor="edit_type">Bonus Type</Label>
                <select
                  id="edit_type"
                  name="type"
                  required
                  defaultValue={editingBonus.type}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select type</option>
                  {Object.entries(BonusTypes).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="edit_reason">Reason</Label>
                <Input
                  id="edit_reason"
                  name="reason"
                  required
                  defaultValue={editingBonus.reason}
                  placeholder="Enter reason for bonus"
                />
              </div>
              <div>
                <Label htmlFor="edit_note">Note</Label>
                <Textarea
                  id="edit_note"
                  name="note"
                  defaultValue={editingBonus.note}
                  placeholder="Additional notes (optional)"
                  className="min-h-[80px]"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={updateBonusMutation.isPending}>
                  {updateBonusMutation.isPending ? "Updating..." : "Update"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingBonus(null);
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