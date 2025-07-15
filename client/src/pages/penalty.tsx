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
import { AlertTriangle, User, Calendar, DollarSign, Plus, Edit, Trash2 } from "lucide-react";
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
  lateArrivalId?: string;
  value: number;
  note: string;
  reason: string;
  type: number;
  applied: boolean;
  createdAt: string;
}

const PenaltyTypes = {
  1: "Late Arrival",
  2: "Unauthorized Absence",
  3: "Policy Violation",
  4: "Performance Issue",
  5: "Dress Code Violation",
  6: "Other"
};

export default function Penalty() {
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedFilter, setAppliedFilter] = useState<string>("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPenalty, setEditingPenalty] = useState<Penalty | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch penalties
  const { data: penalties = [], isLoading } = useQuery({
    queryKey: ["/api/Penalty"],
    queryFn: () => kmtApiClient.getPenalties(),
    onError: (error: Error) => {
      console.error("Error fetching penalties:", error);
      toast({
        title: "Error",
        description: "Failed to load penalties",
        variant: "destructive",
      });
    },
  });

  // Fetch users for dropdown
  const { data: users = [] } = useQuery({
    queryKey: ["/api/User"],
    queryFn: () => kmtApiClient.getUsers(),
  });

  // Create penalty mutation
  const createPenaltyMutation = useMutation({
    mutationFn: (data: any) => kmtApiClient.createPenalty(data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Penalty created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/Penalty"] });
      setIsCreateModalOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to create penalty",
        variant: "destructive",
      });
    },
  });

  // Update penalty mutation
  const updatePenaltyMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => kmtApiClient.updatePenalty(id, data),
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

  const filteredPenalties = penalties.filter((penalty: Penalty) => {
    const matchesSearch = penalty.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = appliedFilter === "" || 
      (appliedFilter === "applied" && penalty.applied) ||
      (appliedFilter === "pending" && !penalty.applied);
    return matchesSearch && matchesFilter;
  });

  const handleCreatePenalty = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const penaltyData = {
      userId: formData.get("userId"),
      value: parseFloat(formData.get("value") as string),
      note: formData.get("note"),
      reason: formData.get("reason"),
      type: parseInt(formData.get("type") as string),
      applied: false,
    };
    createPenaltyMutation.mutate(penaltyData);
  };

  const handleUpdatePenalty = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingPenalty) return;
    
    const formData = new FormData(event.currentTarget);
    const penaltyData = {
      userId: editingPenalty.userId,
      value: parseFloat(formData.get("value") as string),
      note: formData.get("note"),
      reason: formData.get("reason"),
      type: parseInt(formData.get("type") as string),
      applied: formData.get("applied") === "true",
    };
    updatePenaltyMutation.mutate({ id: editingPenalty.id, data: penaltyData });
  };

  const handleEditPenalty = (penalty: Penalty) => {
    setEditingPenalty(penalty);
    setIsEditModalOpen(true);
  };

  const handleDeletePenalty = (id: string) => {
    if (window.confirm("Are you sure you want to delete this penalty?")) {
      deletePenaltyMutation.mutate(id);
    }
  };

  const getAppliedBadge = (applied: boolean) => {
    if (applied) {
      return <Badge variant="default" className="bg-red-100 text-red-800">Applied</Badge>;
    } else {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  const getTotalPenaltyValue = () => {
    return penalties.reduce((total: number, penalty: Penalty) => total + penalty.value, 0);
  };

  const getAppliedPenaltyValue = () => {
    return penalties.filter((penalty: Penalty) => penalty.applied).reduce((total: number, penalty: Penalty) => total + penalty.value, 0);
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
          <h1 className="text-3xl font-bold text-gray-900">Penalty Management</h1>
          <p className="text-gray-600 mt-2">Manage employee penalties and deductions</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Penalty
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Penalty</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreatePenalty} className="space-y-4">
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
                <Label htmlFor="value">Penalty Amount</Label>
                <Input
                  id="value"
                  name="value"
                  type="number"
                  step="0.01"
                  placeholder="Enter penalty amount"
                  required
                />
              </div>
              <div>
                <Label htmlFor="type">Penalty Type</Label>
                <Select name="type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select penalty type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PenaltyTypes).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="reason">Reason</Label>
                <Input
                  id="reason"
                  name="reason"
                  placeholder="Enter reason for penalty"
                  required
                />
              </div>
              <div>
                <Label htmlFor="note">Note</Label>
                <Textarea
                  id="note"
                  name="note"
                  placeholder="Additional notes (optional)"
                  rows={3}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={createPenaltyMutation.isPending}
              >
                {createPenaltyMutation.isPending ? "Creating..." : "Create Penalty"}
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
                <p className="text-sm font-medium text-gray-600">Total Penalties</p>
                <p className="text-2xl font-bold text-gray-900">{penalties.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-red-600">${getTotalPenaltyValue().toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Applied</p>
                <p className="text-2xl font-bold text-orange-600">
                  {penalties.filter((penalty: Penalty) => penalty.applied).length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Applied Value</p>
                <p className="text-2xl font-bold text-orange-600">${getAppliedPenaltyValue().toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Penalty Records
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
            <Select value={appliedFilter} onValueChange={setAppliedFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="applied">Applied</SelectItem>
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
                {filteredPenalties.map((penalty: Penalty) => (
                  <TableRow key={penalty.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        {penalty.userName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-red-600">
                        ${penalty.value.toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-red-200">
                        {PenaltyTypes[penalty.type as keyof typeof PenaltyTypes] || `Type ${penalty.type}`}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate text-sm">
                        {penalty.reason}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getAppliedBadge(penalty.applied)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {penalty.madeByName || "System"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        {format(new Date(penalty.createdAt), "MMM dd, yyyy")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditPenalty(penalty)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => handleDeletePenalty(penalty.id)}
                          disabled={deletePenaltyMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Penalty</DialogTitle>
          </DialogHeader>
          {editingPenalty && (
            <form onSubmit={handleUpdatePenalty} className="space-y-4">
              <div>
                <Label htmlFor="value">Penalty Amount</Label>
                <Input
                  id="value"
                  name="value"
                  type="number"
                  step="0.01"
                  defaultValue={editingPenalty.value}
                  required
                />
              </div>
              <div>
                <Label htmlFor="type">Penalty Type</Label>
                <Select name="type" defaultValue={editingPenalty.type.toString()} required>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PenaltyTypes).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="reason">Reason</Label>
                <Input
                  id="reason"
                  name="reason"
                  defaultValue={editingPenalty.reason}
                  required
                />
              </div>
              <div>
                <Label htmlFor="note">Note</Label>
                <Textarea
                  id="note"
                  name="note"
                  defaultValue={editingPenalty.note}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="applied">Status</Label>
                <Select name="applied" defaultValue={editingPenalty.applied.toString()}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">Pending</SelectItem>
                    <SelectItem value="true">Applied</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={updatePenaltyMutation.isPending}
              >
                {updatePenaltyMutation.isPending ? "Updating..." : "Update Penalty"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}