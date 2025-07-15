import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, RotateCcw, Edit } from "lucide-react";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { KMTUser } from "@/types";

interface LeaveBalance {
  id: string;
  userId: string;
  user?: KMTUser;
  leaveTypeId: string;
  leaveType?: {
    id: string;
    name: string;
    nameAr: string;
    maxDays: number;
    carryOver: boolean;
  };
  allocatedDays: number;
  usedDays: number;
  remainingDays: number;
  year: number;
  createdAt: string;
  updatedAt: string;
}

export default function LeaveBalance() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedUser, setSelectedUser] = useState<string>("all");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedBalance, setSelectedBalance] = useState<LeaveBalance | null>(null);
  const [updateValues, setUpdateValues] = useState({ allocatedDays: 0, usedDays: 0 });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch leave balances
  const { data: leaveBalances = [], isLoading: balancesLoading } = useQuery({
    queryKey: ["/api/LeaveBalance", selectedYear, selectedUser],
    queryFn: async () => {
      try {
        if (selectedUser && selectedUser !== "all") {
          return await apiClient.getLeaveBalance(selectedUser, parseInt(selectedYear));
        }
        
        // Get all users' leave balances (implementation depends on backend)
        const users = await apiClient.getUsers();
        const allBalances = [];
        
        for (const user of users) {
          try {
            const userBalance = await apiClient.getLeaveBalance(user.id, parseInt(selectedYear));
            if (Array.isArray(userBalance)) {
              allBalances.push(...userBalance);
            } else if (userBalance) {
              allBalances.push(userBalance);
            }
          } catch (error) {
            console.log(`No balance found for user ${user.id}`);
          }
        }
        
        return allBalances;
      } catch (error: any) {
        console.error('Error fetching leave balances:', error);
        return [];
      }
    },
    retry: false,
  });

  // Fetch users for dropdown
  const { data: users = [] } = useQuery({
    queryKey: ["/api/User"],
    queryFn: async () => {
      try {
        return await apiClient.getUsers({ pageSize: 100 });
      } catch (error) {
        return [];
      }
    },
    retry: false,
  });

  // Fetch leave types
  const { data: leaveTypes = [] } = useQuery({
    queryKey: ["/api/LeaveType"],
    queryFn: async () => {
      try {
        return await apiClient.getLeaveTypes();
      } catch (error) {
        return [];
      }
    },
    retry: false,
  });

  // Update leave balance mutation
  const updateBalanceMutation = useMutation({
    mutationFn: async (data: { id: string; allocatedDays: number; usedDays: number }) => {
      return await apiClient.updateLeaveBalance(data.id, {
        allocatedDays: data.allocatedDays,
        usedDays: data.usedDays,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/LeaveBalance"] });
      toast({
        title: "Success",
        description: "Leave balance updated successfully",
      });
      setShowUpdateModal(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update leave balance",
        variant: "destructive",
      });
    },
  });

  // Reset leave balance mutation
  const resetBalanceMutation = useMutation({
    mutationFn: async (year: number) => {
      return await apiClient.resetLeaveBalance(year);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/LeaveBalance"] });
      toast({
        title: "Success",
        description: "Leave balances reset successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to reset leave balances",
        variant: "destructive",
      });
    },
  });

  const handleUpdateBalance = (balance: LeaveBalance) => {
    setSelectedBalance(balance);
    setUpdateValues({
      allocatedDays: balance.allocatedDays,
      usedDays: balance.usedDays,
    });
    setShowUpdateModal(true);
  };

  const handleSubmitUpdate = () => {
    if (!selectedBalance) return;
    
    updateBalanceMutation.mutate({
      id: selectedBalance.id,
      allocatedDays: updateValues.allocatedDays,
      usedDays: updateValues.usedDays,
    });
  };

  const handleResetBalances = () => {
    if (confirm(`Are you sure you want to reset all leave balances for ${selectedYear}?`)) {
      resetBalanceMutation.mutate(parseInt(selectedYear));
    }
  };

  const getStatusColor = (remainingDays: number, allocatedDays: number) => {
    const percentage = (remainingDays / allocatedDays) * 100;
    if (percentage > 50) return "bg-green-500";
    if (percentage > 25) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Leave Balance Management</h1>
          <p className="text-gray-600">Manage employee leave balances and allocations</p>
        </div>
        <Button
          onClick={handleResetBalances}
          variant="outline"
          className="flex items-center gap-2"
          disabled={resetBalanceMutation.isPending}
        >
          <RotateCcw className="h-4 w-4" />
          Reset Year Balances
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="year">Year</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2026">2026</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="user">Employee</Label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Employees</SelectItem>
                  {users.map((user: KMTUser) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.username} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leave Balances Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {balancesLoading ? (
          <div className="col-span-full text-center py-8">Loading leave balances...</div>
        ) : leaveBalances.length === 0 ? (
          <div className="col-span-full text-center py-8">No leave balances found</div>
        ) : (
          leaveBalances.map((balance: LeaveBalance) => (
            <Card key={balance.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{balance.user?.username || 'Unknown User'}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUpdateBalance(balance)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-sm text-gray-600">
                  {balance.leaveType?.name || 'Unknown Leave Type'}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Allocated</span>
                    <Badge variant="secondary">{balance.allocatedDays} days</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Used</span>
                    <Badge variant="outline">{balance.usedDays} days</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Remaining</span>
                    <Badge 
                      className={`text-white ${getStatusColor(balance.remainingDays, balance.allocatedDays)}`}
                    >
                      {balance.remainingDays} days
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getStatusColor(balance.remainingDays, balance.allocatedDays)}`}
                      style={{
                        width: `${Math.max(0, (balance.remainingDays / balance.allocatedDays) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Update Balance Modal */}
      <Dialog open={showUpdateModal} onOpenChange={setShowUpdateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Leave Balance</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="allocatedDays">Allocated Days</Label>
              <Input
                id="allocatedDays"
                type="number"
                value={updateValues.allocatedDays}
                onChange={(e) =>
                  setUpdateValues(prev => ({
                    ...prev,
                    allocatedDays: parseInt(e.target.value) || 0,
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="usedDays">Used Days</Label>
              <Input
                id="usedDays"
                type="number"
                value={updateValues.usedDays}
                onChange={(e) =>
                  setUpdateValues(prev => ({
                    ...prev,
                    usedDays: parseInt(e.target.value) || 0,
                  }))
                }
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowUpdateModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmitUpdate}
                disabled={updateBalanceMutation.isPending}
              >
                {updateBalanceMutation.isPending ? "Updating..." : "Update"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}