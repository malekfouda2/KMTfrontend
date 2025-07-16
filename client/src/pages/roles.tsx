import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Shield, Users, Edit, Trash2, UserPlus, CheckCircle, X } from "lucide-react";
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
  nameAr: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  descriptionAr: z.string().optional(),
});

const assignRoleSchema = z.object({
  userId: z.string().min(1, "User is required"),
  roleId: z.string().min(1, "Role is required"),
});

const assignPermissionSchema = z.object({
  roleId: z.string().min(1, "Role is required"),
  permission: z.string().min(1, "Permission is required"),
});

type RoleFormData = z.infer<typeof roleSchema>;
type AssignRoleFormData = z.infer<typeof assignRoleSchema>;
type AssignPermissionFormData = z.infer<typeof assignPermissionSchema>;

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
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: rolesData = [], isLoading: rolesLoading } = useQuery({
    queryKey: ['/api/Role'],
    queryFn: async () => {
      try {
        const result = await apiClient.getRoles();
        console.log('Roles fetched:', result);
        
        // API client automatically extracts data from KMT response structure
        return Array.isArray(result) ? result : [];
      } catch (error: any) {
        console.error('Error fetching roles:', error);
        return [];
      }
    },
    retry: false,
  });

  const { data: usersData = [] } = useQuery({
    queryKey: ['/api/User'],
    queryFn: async () => {
      try {
        const result = await apiClient.getUsers();
        console.log('Users fetched:', result);
        
        // API client automatically extracts data from KMT response structure
        return Array.isArray(result) ? result : [];
      } catch (error: any) {
        console.error('Error fetching users:', error);
        return [];
      }
    },
    retry: false,
  });

  const { data: permissionsData = [] } = useQuery({
    queryKey: ['/api/Permission'],
    queryFn: async () => {
      try {
        const result = await apiClient.getPermissions();
        console.log('Permissions fetched:', result);
        
        // API client automatically extracts data from KMT response structure
        return Array.isArray(result) ? result : [];
      } catch (error: any) {
        console.error('Error fetching permissions:', error);
        return [];
      }
    },
    retry: false,
  });

  // Map the KMT backend role structure to our interface
  const roles: Role[] = Array.isArray(rolesData) 
    ? rolesData.map((role: any) => {
        console.log('Raw role data from backend:', role);
        return {
          id: role.id,
          name: role.name,
          description: role.description || '',
          permissions: Array.isArray(role.permissions) 
            ? role.permissions.map((p: any) => typeof p === 'string' ? p : p.description || p.code || p.id)
            : [],
          userCount: role.userCount || role.users?.length || 0
        };
      })
    : [];

  console.log('Processed roles data:', roles);

  // Map the KMT backend user structure to our interface
  const users: User[] = Array.isArray(usersData) 
    ? usersData.map((user: any) => ({
        id: user.id,
        name: user.name || user.firstName + ' ' + user.lastName,
        username: user.username || user.email,
        email: user.email,
        role: user.role || 'user'
      }))
    : [];

  const roleForm = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: "",
      nameAr: "",
      description: "",
      descriptionAr: "",
    },
  });

  const assignForm = useForm<AssignRoleFormData>({
    resolver: zodResolver(assignRoleSchema),
    defaultValues: {
      userId: "",
      roleId: "",
    },
  });

  const permissionForm = useForm<AssignPermissionFormData>({
    resolver: zodResolver(assignPermissionSchema),
    defaultValues: {
      roleId: "",
      permission: "",
    },
  });

  const createRoleMutation = useMutation({
    mutationFn: (data: RoleFormData) => {
      // Format data for KMT backend structure
      const roleData = {
        name: data.name,
        nameAr: data.nameAr || data.name,
        description: data.description,
        descriptionAr: data.descriptionAr || data.description,
      };
      console.log("Sending role to API:", roleData);
      return apiClient.createRole(roleData);
    },
    onSuccess: (response) => {
      console.log("Role created successfully:", response);
      toast({
        title: "Success",
        description: "Role created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/Role'] });
      setIsAddModalOpen(false);
      roleForm.reset();
    },
    onError: (error: Error) => {
      console.error("Role creation error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create role",
        variant: "destructive",
      });
    },
  });

  const assignRoleMutation = useMutation({
    mutationFn: (data: AssignRoleFormData) => {
      console.log('Role assignment mutation data:', data);
      return apiClient.assignRole(data.userId, data.roleId);
    },
    onSuccess: (result) => {
      console.log('Role assignment successful:', result);
      toast({
        title: "Success",
        description: "Role assigned successfully",
      });
      
      // Force refresh of both users and roles data
      queryClient.invalidateQueries({ queryKey: ['/api/User'] });
      queryClient.invalidateQueries({ queryKey: ['/api/Role'] });
      
      // Also try to refetch immediately to see updated data
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ['/api/User'] });
        queryClient.refetchQueries({ queryKey: ['/api/Role'] });
      }, 1000);
      
      setIsAssignModalOpen(false);
      assignForm.reset();
    },
    onError: (error: Error) => {
      console.error('Role assignment failed:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to assign role",
        variant: "destructive",
      });
    },
  });

  const assignPermissionMutation = useMutation({
    mutationFn: (data: AssignPermissionFormData) => {
      return apiClient.assignPermission(data.roleId, data.permission);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Permission assigned successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/Role'] });
      permissionForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to assign permission",
        variant: "destructive",
      });
    },
  });

  const removePermissionMutation = useMutation({
    mutationFn: ({ roleId, permissionId }: { roleId: string; permissionId: string }) => {
      return apiClient.removePermission(roleId, permissionId);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Permission removed successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/Role'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove permission",
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

  const onAssignPermission = (data: AssignPermissionFormData) => {
    assignPermissionMutation.mutate(data);
  };

  const handleManagePermissions = (role: Role) => {
    setSelectedRole(role);
    permissionForm.setValue("roleId", role.id.toString());
    setIsPermissionsModalOpen(true);
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
                                <SelectItem key={user.id} value={String(user.id)}>
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
                                <SelectItem key={role.id} value={String(role.id)}>
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
                          <FormLabel>Role Name (English)</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter role name in English" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={roleForm.control}
                      name="nameAr"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role Name (Arabic)</FormLabel>
                          <FormControl>
                            <Input placeholder="أدخل اسم الدور بالعربية" {...field} />
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
                          <FormLabel>Description (English)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Enter role description in English" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={roleForm.control}
                      name="descriptionAr"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (Arabic)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="أدخل وصف الدور بالعربية" {...field} />
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

            {/* Permissions Management Modal */}
            <Dialog open={isPermissionsModalOpen} onOpenChange={setIsPermissionsModalOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Manage Permissions for {selectedRole?.name}</DialogTitle>
                </DialogHeader>
                <Form {...permissionForm}>
                  <form onSubmit={permissionForm.handleSubmit(onAssignPermission)} className="space-y-4">
                    <div className="space-y-3">
                      <FormLabel>Select Permission to Add</FormLabel>
                      <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                        {Array.isArray(permissionsData) && permissionsData.length > 0 ? (
                          permissionsData.map((permission: any) => {
                            const isAlreadyAssigned = selectedRole?.permissions.some((p: any) => 
                              typeof p === 'string' ? p === permission.description : p.id === permission.id
                            );
                            
                            return (
                              <Button
                                key={permission.id}
                                type="button"
                                variant={isAlreadyAssigned ? "secondary" : "outline"}
                                size="sm"
                                disabled={isAlreadyAssigned}
                                onClick={() => {
                                  permissionForm.setValue("permission", permission.id);
                                  permissionForm.handleSubmit(onAssignPermission)();
                                }}
                                className="text-left justify-start h-auto p-2 whitespace-normal"
                              >
                                <div className="flex items-center gap-2">
                                  {isAlreadyAssigned && <CheckCircle className="w-3 h-3 text-green-600" />}
                                  <div>
                                    <div className="font-medium text-xs">{permission.code}</div>
                                    <div className="text-xs text-gray-500">{permission.description}</div>
                                  </div>
                                </div>
                              </Button>
                            );
                          })
                        ) : (
                          <div className="col-span-2 text-center text-gray-500 py-4">
                            No permissions available
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {selectedRole && selectedRole.permissions.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">Current Permissions (click to remove):</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedRole.permissions.map((permission: string, index: number) => {
                            // Find the full permission object to get the ID
                            const fullPermission = Array.isArray(permissionsData) 
                              ? permissionsData.find((p: any) => p.description === permission || p.code === permission)
                              : null;
                            const permissionId = fullPermission?.id || permission;
                            
                            return (
                              <Button
                                key={index}
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                  if (selectedRole) {
                                    removePermissionMutation.mutate({
                                      roleId: selectedRole.id.toString(),
                                      permissionId: permissionId
                                    });
                                  }
                                }}
                                className="h-6 px-2 py-1 text-xs hover:bg-red-100 hover:text-red-700 transition-colors"
                                disabled={removePermissionMutation.isPending}
                              >
                                <span className="mr-1">{permission}</span>
                                <X className="w-3 h-3" />
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsPermissionsModalOpen(false)}
                      >
                        Close
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
                    onClick={() => handleManagePermissions(role)}
                  >
                    <Shield className="w-4 h-4 mr-1" />
                    Permissions
                  </Button>
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