import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Shield, Users, Edit, Trash2, UserPlus } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";

const roleSchema = z.object({
  name: z.string().min(1, "Role name is required"),
  description: z.string().min(1, "Description is required"),
});

const assignRoleSchema = z.object({
  userId: z.string().min(1, "User is required"),
  roleId: z.string().min(1, "Role is required"),
});

type RoleFormData = z.infer<typeof roleSchema>;
type AssignRoleFormData = z.infer<typeof assignRoleSchema>;

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: string[];
  userCount?: number;
}

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
}

export default function Roles() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: rolesData = [], isLoading: rolesLoading } = useQuery({
    queryKey: ['/api/Role'],
    queryFn: () => apiClient.getRoles(),
  });

  const { data: usersData = [] } = useQuery({
    queryKey: ['/api/User'],
    queryFn: () => apiClient.getUsers(),
  });

  const roles = Array.isArray(rolesData) ? rolesData as Role[] : [];
  const users = Array.isArray(usersData) ? usersData as User[] : [];

  const roleForm = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const assignForm = useForm<AssignRoleFormData>({
    resolver: zodResolver(assignRoleSchema),
    defaultValues: {
      userId: "",
      roleId: "",
    },
  });

  const createRoleMutation = useMutation({
    mutationFn: (data: RoleFormData) => apiClient.createRole(data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Role created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/Role'] });
      setIsAddModalOpen(false);
      roleForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create role",
        variant: "destructive",
      });
    },
  });

  const assignRoleMutation = useMutation({
    mutationFn: (data: AssignRoleFormData) => {
      const updateData = { role: roles.find(r => r.id.toString() === data.roleId)?.name || data.roleId };
      return apiClient.updateUser(data.userId, updateData);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Role assigned successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/User'] });
      queryClient.invalidateQueries({ queryKey: ['/api/Role'] });
      setIsAssignModalOpen(false);
      assignForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to assign role",
        variant: "destructive",
      });
    },
  });

  const deleteRoleMutation = useMutation({
    mutationFn: (id: string) => apiClient.deleteRole(id),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Role deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/Role'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete role",
        variant: "destructive",
      });
    },
  });

  const onCreateRole = (data: RoleFormData) => {
    createRoleMutation.mutate(data);
  };

  const onAssignRole = (data: AssignRoleFormData) => {
    assignRoleMutation.mutate(data);
  };

  const handleDeleteRole = (id: number) => {
    if (confirm("Are you sure you want to delete this role?")) {
      deleteRoleMutation.mutate(id.toString());
    }
  };

  if (rolesLoading) {
    return (
      <MainLayout title="Roles" breadcrumb="Roles" requiredRoles={["general_manager", "hr_manager"]}>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading roles...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Roles" breadcrumb="Roles" requiredRoles={["general_manager", "hr_manager"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-black">Roles Management</h1>
            <p className="text-gray-600">Create roles dynamically and assign them to users</p>
          </div>
          <div className="flex space-x-2">
            <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Assign Role
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Assign Role to User</DialogTitle>
                </DialogHeader>
                <Form {...assignForm}>
                  <form onSubmit={assignForm.handleSubmit(onAssignRole)} className="space-y-4">
                    <FormField
                      control={assignForm.control}
                      name="userId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select User</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select user" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {users.map((user: User) => (
                                <SelectItem key={user.id} value={user.id}>
                                  {user.name} ({user.username})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={assignForm.control}
                      name="roleId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Role</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {roles.map((role: Role) => (
                                <SelectItem key={role.id} value={role.id.toString()}>
                                  {role.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAssignModalOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={assignRoleMutation.isPending}>
                        {assignRoleMutation.isPending ? "Assigning..." : "Assign Role"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Role
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Role</DialogTitle>
                </DialogHeader>
                <Form {...roleForm}>
                  <form onSubmit={roleForm.handleSubmit(onCreateRole)} className="space-y-4">
                    <FormField
                      control={roleForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter role name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={roleForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Enter role description" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddModalOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createRoleMutation.isPending}>
                        {createRoleMutation.isPending ? "Creating..." : "Create Role"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role: Role) => (
            <Card key={role.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Shield className="w-8 h-8 text-green-600" />
                  <Badge variant="secondary">
                    {role.userCount || 0} users
                  </Badge>
                </div>
                <CardTitle className="text-lg font-bold text-black">{role.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4 min-h-[40px]">
                  {role.description}
                </CardDescription>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteRole(role.id)}
                    disabled={deleteRoleMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {roles.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Shield className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No roles found</h3>
              <p className="text-gray-500 mb-4">Get started by creating your first role.</p>
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Role
              </Button>
            </CardContent>
          </Card>
        )}

        {/* User Role Assignments */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-black">Current User Role Assignments</CardTitle>
            <CardDescription>View current role assignments for all users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {users.map((user: User) => (
                <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-black">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.username} • {user.email}</p>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {user.role?.replace('_', ' ') || 'No Role'}
                  </Badge>
                </div>
              ))}
              {users.length === 0 && (
                <p className="text-gray-500 text-center py-4">No users found</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}