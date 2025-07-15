import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, User, Calendar, FileText, Plus, Edit, Eye } from "lucide-react";
import { kmtApiClient } from "@/lib/kmt-api";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Payroll {
  id: string;
  userId: string;
  userName: string;
  payrollStatus: number;
  baseSalary: number;
  toBePaidAmount: number;
  toBePaidAt: string;
  createdAt: string;
}

const PayrollStatus = {
  1: "Draft",
  2: "Pending",
  3: "Approved",
  4: "Paid",
  5: "Cancelled"
};

const PayrollStatusColors = {
  1: "bg-gray-100 text-gray-800",
  2: "bg-yellow-100 text-yellow-800",
  3: "bg-green-100 text-green-800",
  4: "bg-blue-100 text-blue-800",
  5: "bg-red-100 text-red-800"
};

export default function Payroll() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingPayroll, setEditingPayroll] = useState<Payroll | null>(null);
  const [viewingPayroll, setViewingPayroll] = useState<Payroll | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch payrolls
  const { data: payrolls = [], isLoading } = useQuery({
    queryKey: ["/api/Payroll"],
    queryFn: () => kmtApiClient.getPayrolls(),
    onError: (error: Error) => {
      console.error("Error fetching payrolls:", error);
      toast({
        title: "Error",
        description: "Failed to load payrolls",
        variant: "destructive",
      });
    },
  });

  // Fetch users for dropdown
  const { data: users = [] } = useQuery({
    queryKey: ["/api/User"],
    queryFn: () => kmtApiClient.getUsers(),
  });

  // Create payroll mutation
  const createPayrollMutation = useMutation({
    mutationFn: (data: any) => kmtApiClient.createPayroll(data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Payroll created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/Payroll"] });
      setIsCreateModalOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to create payroll",
        variant: "destructive",
      });
    },
  });

  // Update payroll mutation
  const updatePayrollMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => kmtApiClient.updatePayroll(id, data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Payroll updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/Payroll"] });
      setIsEditModalOpen(false);
      setEditingPayroll(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to update payroll",
        variant: "destructive",
      });
    },
  });

  // Update payroll amount mutation
  const updatePayrollAmountMutation = useMutation({
    mutationFn: ({ id, amount }: { id: string; amount: number }) => kmtApiClient.updatePayrollAmount(id, amount),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Payroll amount updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/Payroll"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to update payroll amount",
        variant: "destructive",
      });
    },
  });

  // Delete payroll mutation
  const deletePayrollMutation = useMutation({
    mutationFn: (id: string) => kmtApiClient.deletePayroll(id),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Payroll deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/Payroll"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to delete payroll",
        variant: "destructive",
      });
    },
  });

  const filteredPayrolls = payrolls.filter((payroll: Payroll) => {
    const matchesSearch = payroll.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "" || payroll.payrollStatus.toString() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreatePayroll = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payrollData = {
      userId: formData.get("userId"),
      baseSalary: parseFloat(formData.get("baseSalary") as string),
      toBePaidAmount: parseFloat(formData.get("toBePaidAmount") as string),
      toBePaidAt: formData.get("toBePaidAt"),
      payrollStatus: parseInt(formData.get("payrollStatus") as string),
    };
    createPayrollMutation.mutate(payrollData);
  };

  const handleUpdatePayroll = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingPayroll) return;
    
    const formData = new FormData(event.currentTarget);
    const payrollData = {
      userId: editingPayroll.userId,
      baseSalary: parseFloat(formData.get("baseSalary") as string),
      toBePaidAmount: parseFloat(formData.get("toBePaidAmount") as string),
      toBePaidAt: formData.get("toBePaidAt"),
      payrollStatus: parseInt(formData.get("payrollStatus") as string),
    };
    updatePayrollMutation.mutate({ id: editingPayroll.id, data: payrollData });
  };

  const handleEditPayroll = (payroll: Payroll) => {
    setEditingPayroll(payroll);
    setIsEditModalOpen(true);
  };

  const handleViewPayroll = (payroll: Payroll) => {
    setViewingPayroll(payroll);
    setIsViewModalOpen(true);
  };

  const handleDeletePayroll = (id: string) => {
    if (window.confirm("Are you sure you want to delete this payroll?")) {
      deletePayrollMutation.mutate(id);
    }
  };

  const getStatusBadge = (status: number) => {
    const statusText = PayrollStatus[status as keyof typeof PayrollStatus] || `Status ${status}`;
    const colorClass = PayrollStatusColors[status as keyof typeof PayrollStatusColors] || "bg-gray-100 text-gray-800";
    return <Badge className={colorClass}>{statusText}</Badge>;
  };

  const getTotalPayroll = () => {
    return payrolls.reduce((total: number, payroll: Payroll) => total + payroll.toBePaidAmount, 0);
  };

  const getPaidPayroll = () => {
    return payrolls.filter((payroll: Payroll) => payroll.payrollStatus === 4).reduce((total: number, payroll: Payroll) => total + payroll.toBePaidAmount, 0);
  };

  const getPendingPayroll = () => {
    return payrolls.filter((payroll: Payroll) => payroll.payrollStatus === 2).reduce((total: number, payroll: Payroll) => total + payroll.toBePaidAmount, 0);
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
          <h1 className="text-3xl font-bold text-gray-900">Payroll Management</h1>
          <p className="text-gray-600 mt-2">Manage employee payrolls and salary processing</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Payroll
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Payroll</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreatePayroll} className="space-y-4">
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
                <Label htmlFor="baseSalary">Base Salary</Label>
                <Input
                  id="baseSalary"
                  name="baseSalary"
                  type="number"
                  step="0.01"
                  placeholder="Enter base salary"
                  required
                />
              </div>
              <div>
                <Label htmlFor="toBePaidAmount">Amount to be Paid</Label>
                <Input
                  id="toBePaidAmount"
                  name="toBePaidAmount"
                  type="number"
                  step="0.01"
                  placeholder="Enter amount to be paid"
                  required
                />
              </div>
              <div>
                <Label htmlFor="toBePaidAt">Payment Date</Label>
                <Input
                  id="toBePaidAt"
                  name="toBePaidAt"
                  type="datetime-local"
                  required
                />
              </div>
              <div>
                <Label htmlFor="payrollStatus">Status</Label>
                <Select name="payrollStatus" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PayrollStatus).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={createPayrollMutation.isPending}
              >
                {createPayrollMutation.isPending ? "Creating..." : "Create Payroll"}
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
                <p className="text-sm font-medium text-gray-600">Total Payrolls</p>
                <p className="text-2xl font-bold text-gray-900">{payrolls.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-blue-600">${getTotalPayroll().toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Paid Amount</p>
                <p className="text-2xl font-bold text-green-600">${getPaidPayroll().toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Amount</p>
                <p className="text-2xl font-bold text-yellow-600">${getPendingPayroll().toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Payroll Records
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
                {Object.entries(PayrollStatus).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value}
                  </SelectItem>
                ))}
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
                  <TableHead>Base Salary</TableHead>
                  <TableHead>Amount to Pay</TableHead>
                  <TableHead>Payment Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayrolls.map((payroll: Payroll) => (
                  <TableRow key={payroll.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        {payroll.userName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        ${payroll.baseSalary.toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-green-600">
                        ${payroll.toBePaidAmount.toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        {format(new Date(payroll.toBePaidAt), "MMM dd, yyyy")}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(payroll.payrollStatus)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {format(new Date(payroll.createdAt), "MMM dd, yyyy")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewPayroll(payroll)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditPayroll(payroll)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => handleDeletePayroll(payroll.id)}
                          disabled={deletePayrollMutation.isPending}
                        >
                          Delete
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
            <DialogTitle>Edit Payroll</DialogTitle>
          </DialogHeader>
          {editingPayroll && (
            <form onSubmit={handleUpdatePayroll} className="space-y-4">
              <div>
                <Label htmlFor="baseSalary">Base Salary</Label>
                <Input
                  id="baseSalary"
                  name="baseSalary"
                  type="number"
                  step="0.01"
                  defaultValue={editingPayroll.baseSalary}
                  required
                />
              </div>
              <div>
                <Label htmlFor="toBePaidAmount">Amount to be Paid</Label>
                <Input
                  id="toBePaidAmount"
                  name="toBePaidAmount"
                  type="number"
                  step="0.01"
                  defaultValue={editingPayroll.toBePaidAmount}
                  required
                />
              </div>
              <div>
                <Label htmlFor="toBePaidAt">Payment Date</Label>
                <Input
                  id="toBePaidAt"
                  name="toBePaidAt"
                  type="datetime-local"
                  defaultValue={new Date(editingPayroll.toBePaidAt).toISOString().slice(0, 16)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="payrollStatus">Status</Label>
                <Select name="payrollStatus" defaultValue={editingPayroll.payrollStatus.toString()} required>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PayrollStatus).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={updatePayrollMutation.isPending}
              >
                {updatePayrollMutation.isPending ? "Updating..." : "Update Payroll"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Payroll Details</DialogTitle>
          </DialogHeader>
          {viewingPayroll && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Employee</Label>
                  <p className="text-lg font-semibold">{viewingPayroll.userName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Status</Label>
                  <div className="mt-1">
                    {getStatusBadge(viewingPayroll.payrollStatus)}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Base Salary</Label>
                  <p className="text-lg font-semibold">${viewingPayroll.baseSalary.toFixed(2)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Amount to Pay</Label>
                  <p className="text-lg font-semibold text-green-600">${viewingPayroll.toBePaidAmount.toFixed(2)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Payment Date</Label>
                  <p className="text-lg">{format(new Date(viewingPayroll.toBePaidAt), "MMM dd, yyyy HH:mm")}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Created Date</Label>
                  <p className="text-lg">{format(new Date(viewingPayroll.createdAt), "MMM dd, yyyy HH:mm")}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}