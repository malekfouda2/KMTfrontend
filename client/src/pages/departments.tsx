import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Building2, Edit, Trash2, Eye } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";

const departmentSchema = z.object({
  name: z.string().min(1, "Department name is required"),
  nameAr: z.string().min(1, "Arabic name is required"),
  description: z.string().min(1, "Description is required"),
  descriptionAr: z.string().min(1, "Arabic description is required"),
});

type DepartmentFormData = z.infer<typeof departmentSchema>;

interface Department {
  id: number;
  name: string;
  description: string;
  employeeCount?: number;
  createdAt?: string;
}

export default function Departments() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch employees for the selected department
  const { data: departmentEmployees = [] } = useQuery({
    queryKey: ['/api/User', 'department', selectedDepartment?.id],
    queryFn: async () => {
      if (!selectedDepartment?.id) return [];
      try {
        const result = await apiClient.getUsers({ departmentId: selectedDepartment.id.toString() });
        console.log('Department employees fetched for department', selectedDepartment.id, ':', result);
        return Array.isArray(result) ? result : [];
      } catch (error: any) {
        console.error('Error fetching department employees:', error);
        return [];
      }
    },
    enabled: !!selectedDepartment?.id,
    retry: false,
  });

  const { data: departmentsData = [], isLoading, error } = useQuery({
    queryKey: ['/api/Department'],
    queryFn: async () => {
      try {
        const result = await apiClient.getDepartments();
        console.log('Departments fetched:', result);
        
        // API client automatically extracts data from KMT response structure
        return Array.isArray(result) ? result : [];
      } catch (error: any) {
        console.error('Error fetching departments:', error);
        return [];
      }
    },
    retry: false,
  });

  // Map the KMT backend department structure to our interface
  const departments: Department[] = Array.isArray(departmentsData) 
    ? departmentsData.map((dept: any) => ({
        id: dept.id,
        name: dept.name,
        description: dept.description,
        employeeCount: dept.userCount || 0,
        createdAt: dept.createdAt
      }))
    : [];

  const form = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: "",
      nameAr: "",
      description: "",
      descriptionAr: "",
    },
  });

  const createDepartmentMutation = useMutation({
    mutationFn: (data: DepartmentFormData) => {
      console.log("Creating department with data:", data);
      // Send data exactly as the KMT backend expects
      const departmentData = {
        name: data.name,
        nameAr: data.nameAr,
        description: data.description,
        descriptionAr: data.descriptionAr
      };
      console.log("Sending to API:", departmentData);
      return apiClient.createDepartment(departmentData);
    },
    onSuccess: (response) => {
      console.log("Department created successfully:", response);
      toast({
        title: "Success",
        description: "Department created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/Department'] });
      setIsAddModalOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      console.error("Department creation error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create department",
        variant: "destructive",
      });
    },
  });

  const deleteDepartmentMutation = useMutation({
    mutationFn: (id: string) => apiClient.deleteDepartment(id),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Department deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/Department'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete department",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: DepartmentFormData) => {
    createDepartmentMutation.mutate(data);
  };

  const handleViewDepartment = (department: Department) => {
    setSelectedDepartment(department);
    setIsViewModalOpen(true);
  };

  const handleDeleteDepartment = (id: number) => {
    if (confirm("Are you sure you want to delete this department?")) {
      deleteDepartmentMutation.mutate(id.toString());
    }
  };

  if (isLoading) {
    return (
      <MainLayout title="Departments" breadcrumb="Departments" requiredRoles={["general_manager", "hr_manager"]}>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading departments...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Departments" breadcrumb="Departments" requiredRoles={["general_manager", "hr_manager"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-black">Departments</h1>
            <p className="text-sm sm:text-base text-gray-600">Manage organizational departments</p>
          </div>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add Department
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Department</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department Name (English)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter department name in English" {...field} />
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
                        <FormLabel>Department Name (Arabic)</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل اسم القسم بالعربية" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (English)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter department description in English" {...field} />
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
                          <Textarea placeholder="أدخل وصف القسم بالعربية" {...field} />
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
                    <Button type="submit" disabled={createDepartmentMutation.isPending}>
                      {createDepartmentMutation.isPending ? "Creating..." : "Create Department"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Debug Info */}
        {error && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              Note: Unable to fetch departments from server. You can still create new departments.
            </p>
          </div>
        )}

        {/* Departments Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {departments.map((department: Department) => (
            <Card key={department.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Building2 className="w-8 h-8 text-blue-600" />
                  <Badge variant="secondary">
                    {department.employeeCount || 0} employees
                  </Badge>
                </div>
                <CardTitle className="text-lg font-bold text-black">{department.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4 min-h-[40px]">
                  {department.description}
                </CardDescription>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDepartment(department)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteDepartment(department.id)}
                    disabled={deleteDepartmentMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {departments.length === 0 && !isLoading && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building2 className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {error ? "Unable to load departments" : "No departments found"}
              </h3>
              <p className="text-gray-500 mb-4">
                {error 
                  ? "There was an issue connecting to the server. You can still create new departments." 
                  : "Get started by creating your first department."
                }
              </p>
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Department
              </Button>
            </CardContent>
          </Card>
        )}

        {/* View Department Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Department Details</DialogTitle>
            </DialogHeader>
            {selectedDepartment && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium flex items-center">
                        <Building2 className="w-4 h-4 mr-2" />
                        Department Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <label className="text-xs text-gray-500">Department Name</label>
                        <p className="font-medium">{selectedDepartment.name}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Description</label>
                        <p className="text-sm text-gray-600">{selectedDepartment.description}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Employee Count</label>
                        <p className="font-medium">{departmentEmployees.length} employees</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Department Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-500">Total Employees:</span>
                        <span className="font-medium">{departmentEmployees.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-500">Created:</span>
                        <span className="font-medium">
                          {selectedDepartment.createdAt ? new Date(selectedDepartment.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Employees List */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Department Employees</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {departmentEmployees.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No employees assigned to this department</p>
                    ) : (
                      <div className="space-y-3">
                        {departmentEmployees.map((employee: any) => (
                          <div key={employee.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-600">
                                  {employee.username?.charAt(0)?.toUpperCase() || 'U'}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium">{employee.username}</p>
                                <p className="text-sm text-gray-500">{employee.email}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">{employee.title?.name || 'No Title'}</p>
                              <p className="text-xs text-gray-500">{employee.phoneNumber || 'No Phone'}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}