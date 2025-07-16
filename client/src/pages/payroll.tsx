import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, User, Calendar, CheckCircle, XCircle, Plus, Edit, Trash2, Eye } from "lucide-react";
import { kmtApiClient } from "@/lib/kmt-api";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Payroll {
  id: string;
  userId: string;
  userName: string;
  month: number;
  year: number;
  basicSalary: number;
  totalBonuses: number;
  totalPenalties: number;
  overtimeAmount: number;
  deductions: number;
  netSalary: number;
  status: string;
  paid: boolean;
  paidAt?: string;
  createdAt: string;
}

const PayrollStatus = {
  "Draft": "Draft",
  "Approved": "Approved",
  "Paid": "Paid",
  "Cancelled": "Cancelled"
};

const MonthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function Payroll() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<Payroll | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [editingPayroll, setEditingPayroll] = useState<Payroll | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch payrolls
  const { data: payrolls = [], isLoading } = useQuery({
    queryKey: ["/api/Payroll"],
    queryFn: async () => {
      const response = await kmtApiClient.getPayrolls();
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
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      kmtApiClient.updatePayroll(id, data),
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
    mutationFn: ({ id, amount }: { id: string; amount: number }) => 
      kmtApiClient.updatePayrollAmount(id, amount),
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

  // Filter payrolls
  const filteredPayrolls = payrolls.filter((payroll: Payroll) => {
    const matchesSearch = payroll.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${MonthNames[payroll.month - 1]} ${payroll.year}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || payroll.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (payroll: Payroll) => {
    setSelectedPayroll(payroll);
    setIsDetailsModalOpen(true);
  };

  const handleEditPayroll = (payroll: Payroll) => {
    setEditingPayroll(payroll);
    setIsEditModalOpen(true);
  };

  const handleCreatePayroll = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      userId: formData.get("userId"),
      month: parseInt(formData.get("month") as string),
      year: parseInt(formData.get("year") as string),
      basicSalary: parseFloat(formData.get("basicSalary") as string),
      totalBonuses: parseFloat(formData.get("totalBonuses") as string) || 0,
      totalPenalties: parseFloat(formData.get("totalPenalties") as string) || 0,
      overtimeAmount: parseFloat(formData.get("overtimeAmount") as string) || 0,
      deductions: parseFloat(formData.get("deductions") as string) || 0,
      status: formData.get("status"),
    };
    createPayrollMutation.mutate(data);
  };

  const handleUpdatePayroll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPayroll) return;
    
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      userId: formData.get("userId"),
      month: parseInt(formData.get("month") as string),
      year: parseInt(formData.get("year") as string),
      basicSalary: parseFloat(formData.get("basicSalary") as string),
      totalBonuses: parseFloat(formData.get("totalBonuses") as string) || 0,
      totalPenalties: parseFloat(formData.get("totalPenalties") as string) || 0,
      overtimeAmount: parseFloat(formData.get("overtimeAmount") as string) || 0,
      deductions: parseFloat(formData.get("deductions") as string) || 0,
      status: formData.get("status"),
    };
    updatePayrollMutation.mutate({ id: editingPayroll.id, data });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this payroll record?")) {
      deletePayrollMutation.mutate(id);
    }
  };

  const handleUpdateAmount = (id: string, amount: number) => {
    updatePayrollAmountMutation.mutate({ id, amount });
  };

  const getStatusBadge = (status: string, paid: boolean) => {
    if (paid) {
      return <Badge variant="secondary" className="bg-green-100 text-green-800">Paid</Badge>;
    }
    
    switch (status) {
      case 'Draft':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Draft</Badge>;
      case 'Approved':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Approved</Badge>;
      case 'Cancelled':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Cancelled</Badge>;
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPeriod = (month: number, year: number) => {
    return `${MonthNames[month - 1]} ${year}`;
  };

  // Calculate statistics
  const totalPayrolls = filteredPayrolls.length;
  const paidPayrolls = filteredPayrolls.filter((payroll: Payroll) => payroll.paid).length;
  const pendingPayrolls = filteredPayrolls.filter((payroll: Payroll) => !payroll.paid).length;
  const totalAmount = filteredPayrolls.reduce((sum: number, payroll: Payroll) => sum + payroll.netSalary, 0);
  const paidAmount = filteredPayrolls.filter((payroll: Payroll) => payroll.paid).reduce((sum: number, payroll: Payroll) => sum + payroll.netSalary, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payroll records...</p>
        </div>
      </div>
    );
  }

  return (
    <MainLayout title="Payroll Management" breadcrumb="Payroll">
      <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payroll Management</h1>
          <p className="text-gray-600 mt-1">Manage employee payroll and salary processing</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Payroll
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Payroll</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreatePayroll} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    name="status"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select status</option>
                    {Object.entries(PayrollStatus).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="month">Month</Label>
                  <select
                    id="month"
                    name="month"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select month</option>
                    {MonthNames.map((month, index) => (
                      <option key={index} value={index + 1}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    name="year"
                    type="number"
                    min="2020"
                    max="2030"
                    required
                    placeholder="2024"
                    defaultValue={new Date().getFullYear()}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="basicSalary">Basic Salary</Label>
                <Input
                  id="basicSalary"
                  name="basicSalary"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  placeholder="Enter basic salary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="totalBonuses">Total Bonuses</Label>
                  <Input
                    id="totalBonuses"
                    name="totalBonuses"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="totalPenalties">Total Penalties</Label>
                  <Input
                    id="totalPenalties"
                    name="totalPenalties"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="overtimeAmount">Overtime Amount</Label>
                  <Input
                    id="overtimeAmount"
                    name="overtimeAmount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="deductions">Deductions</Label>
                  <Input
                    id="deductions"
                    name="deductions"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={createPayrollMutation.isPending}>
                  {createPayrollMutation.isPending ? "Creating..." : "Create"}
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
                <p className="text-sm font-medium text-gray-600">Total Payrolls</p>
                <p className="text-2xl font-bold text-gray-900">{totalPayrolls}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Paid</p>
                <p className="text-2xl font-bold text-green-600">{paidPayrolls}</p>
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
                <p className="text-2xl font-bold text-yellow-600">{pendingPayrolls}</p>
              </div>
              <XCircle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(totalAmount)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Paid Amount</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(paidAmount)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Payrolls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by employee name or period..."
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
                {Object.entries(PayrollStatus).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payrolls Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payroll Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Basic Salary</TableHead>
                  <TableHead>Bonuses</TableHead>
                  <TableHead>Penalties</TableHead>
                  <TableHead>Net Salary</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayrolls.map((payroll: Payroll) => (
                  <TableRow key={payroll.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                          {payroll.userName?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-medium">{payroll.userName || 'Unknown User'}</p>
                          <p className="text-sm text-gray-500">ID: {payroll.userId}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>{formatPeriod(payroll.month, payroll.year)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{formatCurrency(payroll.basicSalary)}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-green-600">{formatCurrency(payroll.totalBonuses)}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-red-600">{formatCurrency(payroll.totalPenalties)}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-blue-600">{formatCurrency(payroll.netSalary)}</span>
                    </TableCell>
                    <TableCell>{getStatusBadge(payroll.status, payroll.paid)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(payroll)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditPayroll(payroll)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(payroll.id)}
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
            <DialogTitle>Payroll Details</DialogTitle>
          </DialogHeader>
          {selectedPayroll && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Employee</label>
                <p className="text-sm text-gray-900">{selectedPayroll.userName || 'Unknown User'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Period</label>
                <p className="text-sm text-gray-900">{formatPeriod(selectedPayroll.month, selectedPayroll.year)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Basic Salary</label>
                <p className="text-sm text-gray-900">{formatCurrency(selectedPayroll.basicSalary)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Total Bonuses</label>
                <p className="text-sm text-green-600">{formatCurrency(selectedPayroll.totalBonuses)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Total Penalties</label>
                <p className="text-sm text-red-600">{formatCurrency(selectedPayroll.totalPenalties)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Overtime Amount</label>
                <p className="text-sm text-gray-900">{formatCurrency(selectedPayroll.overtimeAmount)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Deductions</label>
                <p className="text-sm text-gray-900">{formatCurrency(selectedPayroll.deductions)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Net Salary</label>
                <p className="text-sm font-bold text-blue-600">{formatCurrency(selectedPayroll.netSalary)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <div className="mt-1">{getStatusBadge(selectedPayroll.status, selectedPayroll.paid)}</div>
              </div>
              {selectedPayroll.paidAt && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Paid At</label>
                  <p className="text-sm text-gray-900">{formatDateTime(selectedPayroll.paidAt)}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Payroll</DialogTitle>
          </DialogHeader>
          {editingPayroll && (
            <form onSubmit={handleUpdatePayroll} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit_userId">Employee</Label>
                  <select
                    id="edit_userId"
                    name="userId"
                    required
                    defaultValue={editingPayroll.userId}
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
                  <Label htmlFor="edit_status">Status</Label>
                  <select
                    id="edit_status"
                    name="status"
                    required
                    defaultValue={editingPayroll.status}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select status</option>
                    {Object.entries(PayrollStatus).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit_month">Month</Label>
                  <select
                    id="edit_month"
                    name="month"
                    required
                    defaultValue={editingPayroll.month}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select month</option>
                    {MonthNames.map((month, index) => (
                      <option key={index} value={index + 1}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="edit_year">Year</Label>
                  <Input
                    id="edit_year"
                    name="year"
                    type="number"
                    min="2020"
                    max="2030"
                    required
                    defaultValue={editingPayroll.year}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit_basicSalary">Basic Salary</Label>
                <Input
                  id="edit_basicSalary"
                  name="basicSalary"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  defaultValue={editingPayroll.basicSalary}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit_totalBonuses">Total Bonuses</Label>
                  <Input
                    id="edit_totalBonuses"
                    name="totalBonuses"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={editingPayroll.totalBonuses}
                  />
                </div>
                <div>
                  <Label htmlFor="edit_totalPenalties">Total Penalties</Label>
                  <Input
                    id="edit_totalPenalties"
                    name="totalPenalties"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={editingPayroll.totalPenalties}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit_overtimeAmount">Overtime Amount</Label>
                  <Input
                    id="edit_overtimeAmount"
                    name="overtimeAmount"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={editingPayroll.overtimeAmount}
                  />
                </div>
                <div>
                  <Label htmlFor="edit_deductions">Deductions</Label>
                  <Input
                    id="edit_deductions"
                    name="deductions"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={editingPayroll.deductions}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={updatePayrollMutation.isPending}>
                  {updatePayrollMutation.isPending ? "Updating..." : "Update"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingPayroll(null);
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