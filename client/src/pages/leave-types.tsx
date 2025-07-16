import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, Edit, Trash2, MoreHorizontal, Calendar, Clock, CheckCircle, XCircle } from "lucide-react";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const leaveTypeSchema = z.object({
  name: z.string().min(1, "Leave type name is required"),
  nameAr: z.string().min(1, "Arabic name is required"),
  description: z.string().min(1, "Description is required"),
  descriptionAr: z.string().min(1, "Arabic description is required"),
  maxDays: z.number().min(1, "Maximum days must be at least 1"),
  carryOver: z.boolean().default(false),
  requiresApproval: z.boolean().default(true),
  color: z.string().default("#3B82F6"),
});

type LeaveTypeFormData = z.infer<typeof leaveTypeSchema>;

interface LeaveType {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  maxDays: number;
  carryOver: boolean;
  requiresApproval: boolean;
  color: string;
  createdAt: string;
  updatedAt?: string;
}

export default function LeaveTypes() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState<LeaveType | null>(null);
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<LeaveTypeFormData>({
    resolver: zodResolver(leaveTypeSchema),
    defaultValues: {
      name: "",
      nameAr: "",
      description: "",
      descriptionAr: "",
      maxDays: 21,
      carryOver: false,
      requiresApproval: true,
      color: "#3B82F6",
    },
  });

  const editForm = useForm<LeaveTypeFormData>({
    resolver: zodResolver(leaveTypeSchema),
    defaultValues: {
      name: "",
      nameAr: "",
      description: "",
      descriptionAr: "",
      maxDays: 21,
      carryOver: false,
      requiresApproval: true,
      color: "#3B82F6",
    },
  });

  // Fetch leave types
  const { data: leaveTypesData = [], isLoading, error } = useQuery({
    queryKey: ['/api/LeaveType'],
    queryFn: async () => {
      try {
        const result = await apiClient.getLeaveTypes({ pageSize: 100 });
        console.log('Leave types fetched:', result);
        return Array.isArray(result) ? result : [];
      } catch (error: any) {
        console.error('Error fetching leave types:', error);
        return [];
      }
    },
    retry: false,
  });

  // Filter leave types based on search
  const leaveTypes = leaveTypesData.filter((type: LeaveType) =>
    type.name.toLowerCase().includes(search.toLowerCase()) ||
    type.nameAr.toLowerCase().includes(search.toLowerCase()) ||
    type.description.toLowerCase().includes(search.toLowerCase())
  );

  // Create leave type mutation - disabled for now since the API doesn't support POST
  const createLeaveTypeMutation = useMutation({
    mutationFn: (data: LeaveTypeFormData) => {
      // Since the API doesn't support POST, we'll show a message
      throw new Error("Creating leave types is not supported by the current API version");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/LeaveType'] });
      toast({
        title: "Success",
        description: "Leave type created successfully",
      });
      setShowAddModal(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Info",
        description: "Creating leave types is not supported by the current API version. Please contact system administrator.",
        variant: "destructive",
      });
    },
  });

  // Update leave type mutation
  const updateLeaveTypeMutation = useMutation({
    mutationFn: (data: { id: string; leaveType: LeaveTypeFormData }) => {
      return apiClient.updateLeaveType(data.id, data.leaveType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/LeaveType'] });
      toast({
        title: "Success",
        description: "Leave type updated successfully",
      });
      setShowEditModal(false);
      editForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update leave type",
        variant: "destructive",
      });
    },
  });

  // Delete leave type mutation
  const deleteLeaveTypeMutation = useMutation({
    mutationFn: (id: string) => {
      return apiClient.deleteLeaveType(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/LeaveType'] });
      toast({
        title: "Success",
        description: "Leave type deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete leave type",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LeaveTypeFormData) => {
    createLeaveTypeMutation.mutate(data);
  };

  const onEditSubmit = (data: LeaveTypeFormData) => {
    if (!selectedLeaveType) return;
    updateLeaveTypeMutation.mutate({ id: selectedLeaveType.id, leaveType: data });
  };

  const handleEdit = (leaveType: LeaveType) => {
    setSelectedLeaveType(leaveType);
    editForm.reset({
      name: leaveType.name,
      nameAr: leaveType.nameAr,
      description: leaveType.description,
      descriptionAr: leaveType.descriptionAr,
      maxDays: leaveType.maxDays,
      carryOver: leaveType.carryOver,
      requiresApproval: leaveType.requiresApproval,
      color: leaveType.color,
    });
    setShowEditModal(true);
  };

  const handleDelete = (leaveType: LeaveType) => {
    if (confirm(`Are you sure you want to delete the leave type "${leaveType.name}"?`)) {
      deleteLeaveTypeMutation.mutate(leaveType.id);
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <p className="text-red-600">Error loading leave types: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <MainLayout title="Leave Types" breadcrumb="Management / Leave Types">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Leave Types Management</h1>
            <p className="text-gray-600">Configure different types of leave and their policies</p>
          </div>
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Leave Type
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Leave Type</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Leave Type Name (English)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Annual Leave" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nameAr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Leave Type Name (Arabic)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., إجازة سنوية" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (English)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Description of the leave type" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="descriptionAr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Arabic)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="وصف نوع الإجازة" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="maxDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Days</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            placeholder="21"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="carryOver"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Carry Over</FormLabel>
                          <div className="text-sm text-gray-600">
                            Allow unused days to carry over to next year
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="requiresApproval"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Requires Approval</FormLabel>
                          <div className="text-sm text-gray-600">
                            Requires manager approval
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createLeaveTypeMutation.isPending}>
                    {createLeaveTypeMutation.isPending ? "Creating..." : "Create Leave Type"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search Leave Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Search leave types..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Leave Types Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Leave Types ({leaveTypes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading leave types...</div>
          ) : leaveTypes.length === 0 ? (
            <div className="text-center py-8">No leave types found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Leave Type</TableHead>
                  <TableHead>Arabic Name</TableHead>
                  <TableHead>Max Days</TableHead>
                  <TableHead>Carry Over</TableHead>
                  <TableHead>Requires Approval</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaveTypes.map((leaveType: LeaveType) => (
                  <TableRow key={leaveType.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: leaveType.color }}
                        />
                        <div>
                          <div className="font-medium">{leaveType.name}</div>
                          <div className="text-sm text-gray-600 truncate max-w-xs">
                            {leaveType.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{leaveType.nameAr}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {leaveType.maxDays} days
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {leaveType.carryOver ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                    </TableCell>
                    <TableCell>
                      {leaveType.requiresApproval ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(leaveType.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(leaveType)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(leaveType)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Leave Type Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Leave Type</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Leave Type Name (English)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Annual Leave" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="nameAr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Leave Type Name (Arabic)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., إجازة سنوية" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (English)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Description of the leave type" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="descriptionAr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Arabic)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="وصف نوع الإجازة" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={editForm.control}
                  name="maxDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Days</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="21"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="carryOver"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Carry Over</FormLabel>
                        <div className="text-sm text-gray-600">
                          Allow unused days to carry over to next year
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="requiresApproval"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Requires Approval</FormLabel>
                        <div className="text-sm text-gray-600">
                          Requires manager approval
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateLeaveTypeMutation.isPending}>
                  {updateLeaveTypeMutation.isPending ? "Updating..." : "Update Leave Type"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      </div>
    </MainLayout>
  );
}