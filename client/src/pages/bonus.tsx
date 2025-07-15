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
import { Gift, User, Calendar, DollarSign, Plus, Edit, Trash2 } from "lucide-react";
import { kmtApiClient } from "@/lib/kmt-api";
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
  const [editingBonus, setEditingBonus] = useState<Bonus | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch bonuses
  const { data: bonuses = [], isLoading } = useQuery({
    queryKey: ["/api/Bonus"],
    queryFn: () => kmtApiClient.getBonuses(),
    onError: (error: Error) => {
      console.error("Error fetching bonuses:", error);
      toast({
        title: "Error",
        description: "Failed to load bonuses",
        variant: "destructive",
      });
    },
  });

  // Fetch users for dropdown
  const { data: users = [] } = useQuery({
    queryKey: ["/api/User"],
    queryFn: () => kmtApiClient.getUsers(),
  });

  // Create bonus mutation
  const createBonusMutation = useMutation({
    mutationFn: (data: any) => kmtApiClient.createBonus(data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Bonus created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/Bonus"] });
      setIsCreateModalOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to create bonus",
        variant: "destructive",
      });
    },
  });

  // Update bonus mutation
  const updateBonusMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => kmtApiClient.updateBonus(id, data),
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

  const filteredBonuses = bonuses.filter((bonus: Bonus) => {
    const matchesSearch = bonus.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = appliedFilter === "" || 
      (appliedFilter === "applied" && bonus.applied) ||
      (appliedFilter === "pending" && !bonus.applied);
    return matchesSearch && matchesFilter;
  });

  const handleCreateBonus = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const bonusData = {
      userId: formData.get("userId"),
      value: parseFloat(formData.get("value") as string),
      note: formData.get("note"),
      reason: formData.get("reason"),
      type: parseInt(formData.get("type") as string),
      applied: false,
    };
    createBonusMutation.mutate(bonusData);
  };

  const handleUpdateBonus = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingBonus) return;
    
    const formData = new FormData(event.currentTarget);
    const bonusData = {
      userId: editingBonus.userId,
      value: parseFloat(formData.get("value") as string),
      note: formData.get("note"),
      reason: formData.get("reason"),
      type: parseInt(formData.get("type") as string),
      applied: formData.get("applied") === "true",
    };
    updateBonusMutation.mutate({ id: editingBonus.id, data: bonusData });
  };

  const handleEditBonus = (bonus: Bonus) => {
    setEditingBonus(bonus);
    setIsEditModalOpen(true);
  };

  const handleDeleteBonus = (id: string) => {
    if (window.confirm("Are you sure you want to delete this bonus?")) {
      deleteBonusMutation.mutate(id);
    }
  };

  const getAppliedBadge = (applied: boolean) => {
    if (applied) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Applied</Badge>;
    } else {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  const getTotalBonusValue = () => {
    return bonuses.reduce((total: number, bonus: Bonus) => total + bonus.value, 0);
  };

  const getAppliedBonusValue = () => {
    return bonuses.filter((bonus: Bonus) => bonus.applied).reduce((total: number, bonus: Bonus) => total + bonus.value, 0);
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
          <h1 className="text-3xl font-bold text-gray-900">Bonus Management</h1>
          <p className="text-gray-600 mt-2">Manage employee bonuses and incentives</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Bonus
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Bonus</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateBonus} className="space-y-4">
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
                <Label htmlFor="value">Bonus Amount</Label>
                <Input
                  id="value"
                  name="value"
                  type="number"
                  step="0.01"
                  placeholder="Enter bonus amount"
                  required
                />
              </div>
              <div>
                <Label htmlFor="type">Bonus Type</Label>
                <Select name="type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select bonus type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(BonusTypes).map(([key, value]) => (
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
                  placeholder="Enter reason for bonus"
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
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={createBonusMutation.isPending}
              >
                {createBonusMutation.isPending ? "Creating..." : "Create Bonus"}
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
                <p className="text-sm font-medium text-gray-600">Total Bonuses</p>
                <p className="text-2xl font-bold text-gray-900">{bonuses.length}</p>
              </div>
              <Gift className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-green-600">${getTotalBonusValue().toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Applied</p>
                <p className="text-2xl font-bold text-blue-600">
                  {bonuses.filter((bonus: Bonus) => bonus.applied).length}
                </p>
              </div>
              <Gift className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Applied Value</p>
                <p className="text-2xl font-bold text-blue-600">${getAppliedBonusValue().toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5" />
            Bonus Records
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
                {filteredBonuses.map((bonus: Bonus) => (
                  <TableRow key={bonus.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        {bonus.userName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-green-600">
                        ${bonus.value.toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {BonusTypes[bonus.type as keyof typeof BonusTypes] || `Type ${bonus.type}`}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate text-sm">
                        {bonus.reason}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getAppliedBadge(bonus.applied)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {bonus.madeByName || "System"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        {format(new Date(bonus.createdAt), "MMM dd, yyyy")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditBonus(bonus)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteBonus(bonus.id)}
                          disabled={deleteBonusMutation.isPending}
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
            <DialogTitle>Edit Bonus</DialogTitle>
          </DialogHeader>
          {editingBonus && (
            <form onSubmit={handleUpdateBonus} className="space-y-4">
              <div>
                <Label htmlFor="value">Bonus Amount</Label>
                <Input
                  id="value"
                  name="value"
                  type="number"
                  step="0.01"
                  defaultValue={editingBonus.value}
                  required
                />
              </div>
              <div>
                <Label htmlFor="type">Bonus Type</Label>
                <Select name="type" defaultValue={editingBonus.type.toString()} required>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(BonusTypes).map(([key, value]) => (
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
                  defaultValue={editingBonus.reason}
                  required
                />
              </div>
              <div>
                <Label htmlFor="note">Note</Label>
                <Textarea
                  id="note"
                  name="note"
                  defaultValue={editingBonus.note}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="applied">Status</Label>
                <Select name="applied" defaultValue={editingBonus.applied.toString()}>
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
                disabled={updateBonusMutation.isPending}
              >
                {updateBonusMutation.isPending ? "Updating..." : "Update Bonus"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}