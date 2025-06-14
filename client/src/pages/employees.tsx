import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { KMTUser, FilterParams } from "@/types";
import { MainLayout } from "@/components/layout/MainLayout";
import { EmployeeTable } from "@/components/employees/EmployeeTable";
import { AddEmployeeModal } from "@/components/employees/AddEmployeeModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Filter, User, Mail, Phone, Calendar, Building, Briefcase } from "lucide-react";

export default function Employees() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<KMTUser | null>(null);
  const [filters, setFilters] = useState<FilterParams>({
    department: "all",
    employeeType: "all",
    status: "all",
  });
  const [search, setSearch] = useState("");

  const { data: employees, isLoading } = useQuery({
    queryKey: ["/api/User", filters, search],
    queryFn: async () => {
      try {
        // Build proper search and filter parameters for KMT backend
        const searchParams: any = {};
        
        if (search.trim()) {
          searchParams.search = search.trim();
        }
        
        if (filters.department && filters.department !== "all") {
          searchParams.departmentId = filters.department;
        }
        
        if (filters.employeeType && filters.employeeType !== "all") {
          searchParams.titleId = filters.employeeType;
        }
        
        if (filters.status && filters.status !== "all" && filters.status !== "") {
          searchParams.status = filters.status;
        }
        
        searchParams.pageNumber = 1;
        searchParams.pageSize = 100;
        
        console.log('Fetching employees with params:', searchParams);
        const result = await apiClient.getUsers(searchParams);
        console.log('Users/Employees fetched:', result);
        
        let employees = Array.isArray(result) ? result : [];
        
        // Client-side filtering as fallback if backend doesn't support filters
        if (employees.length > 0) {
          // Filter by search term
          if (search.trim()) {
            const searchTerm = search.trim().toLowerCase();
            employees = employees.filter((emp: any) => 
              emp.username?.toLowerCase().includes(searchTerm) ||
              emp.email?.toLowerCase().includes(searchTerm) ||
              emp.phoneNumber?.toLowerCase().includes(searchTerm)
            );
          }
          
          // Filter by department
          if (filters.department && filters.department !== "all") {
            employees = employees.filter((emp: any) => 
              emp.department?.id?.toString() === filters.department ||
              emp.departmentId?.toString() === filters.department
            );
          }
          
          // Filter by title/job type
          if (filters.employeeType && filters.employeeType !== "all") {
            employees = employees.filter((emp: any) => 
              emp.title?.id?.toString() === filters.employeeType ||
              emp.titleId?.toString() === filters.employeeType
            );
          }
          
          console.log('Filtered employees:', employees);
        }
        
        return employees;
      } catch (error: any) {
        console.error('Error fetching employees:', error);
        return [];
      }
    },
    retry: false,
  });

  // Fetch departments for filter dropdown
  const { data: departmentsData, isLoading: departmentsLoading, error: departmentsError } = useQuery({
    queryKey: ["/api/Department"],
    queryFn: async () => {
      try {
        const result = await apiClient.getDepartments();
        console.log("Departments fetched successfully:", result);
        
        // Handle KMT backend response structure: { data: [...], message: "...", success: true }
        if (result && typeof result === 'object' && 'data' in result) {
          const responseData = (result as { data: any[] }).data;
          if (Array.isArray(responseData)) {
            return responseData;
          }
        }
        
        // If response is already an array, return as is
        if (Array.isArray(result)) {
          return result;
        }
        
        return [];
      } catch (error) {
        console.error("Department fetch error:", error);
        throw error;
      }
    },
    refetchOnMount: true,
  });

  // Fetch titles for filter dropdown
  const { data: titlesData, isLoading: titlesLoading, error: titlesError } = useQuery({
    queryKey: ["/api/Title"],
    queryFn: async () => {
      console.log("Fetching titles...");
      try {
        const result = await apiClient.getTitles();
        console.log("Titles fetched successfully:", result);
        return result;
      } catch (error) {
        console.error("Title fetch error:", error);
        throw error;
      }
    },
  });

  const departments = Array.isArray(departmentsData) ? departmentsData : [];
  const titles = Array.isArray(titlesData) ? titlesData : [];

  // Debug logging
  console.log("Final departments array:", departments);
  console.log("Final titles array:", titles);
  console.log("Departments loading:", departmentsLoading);
  console.log("Titles loading:", titlesLoading);

  const handleViewEmployee = (employee: KMTUser) => {
    setSelectedEmployee(employee);
    setShowDetailsModal(true);
  };

  const handleEditEmployee = (employee: KMTUser) => {
    // TODO: Implement employee edit modal
    console.log("Edit employee:", employee);
  };

  const clearFilters = () => {
    setFilters({
      department: "all",
      employeeType: "all",
      status: "all",
    });
    setSearch("");
  };

  const employeeList = Array.isArray(employees) ? employees : [];

  return (
    <MainLayout 
      title="Employee Management" 
      breadcrumb="Home"
      requiredRoles={["general_manager", "hr_manager"]}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-black">Employee Management</h2>
            <p className="text-sm sm:text-base text-gray-600">Manage employee information and records</p>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add Employee
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Search employees..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div>
                <Label>Department</Label>
                <Select
                  value={filters.department}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, department: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map((dept: any) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Title</Label>
                <Select
                  value={filters.employeeType}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, employeeType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Titles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Titles</SelectItem>
                    {titles.map((title: any) => (
                      <SelectItem key={title.id} value={title.id.toString()}>
                        {title.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button variant="outline" onClick={clearFilters} className="w-full">
                  <Filter className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employee Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6">
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="w-12 h-12 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-3 w-1/4" />
                      </div>
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  ))}
                </div>
              </div>
            ) : employeeList.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-500">No employees found</p>
              </div>
            ) : (
              <EmployeeTable
                employees={employeeList}
                onViewEmployee={handleViewEmployee}
                onEditEmployee={handleEditEmployee}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <AddEmployeeModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
      />

      {/* Employee Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Employee Details</DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedEmployee.username}</h3>
                  <p className="text-gray-600">{selectedEmployee.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-xs text-gray-500">Username</Label>
                      <p className="font-medium">{selectedEmployee.username}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Email</Label>
                      <p className="font-medium">{selectedEmployee.email}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Phone</Label>
                      <p className="font-medium">{selectedEmployee.phoneNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Created</Label>
                      <p className="font-medium">
                        {selectedEmployee.createdAt ? new Date(selectedEmployee.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium flex items-center">
                      <Building className="w-4 h-4 mr-2" />
                      Work Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-xs text-gray-500">Department</Label>
                      <p className="font-medium">{selectedEmployee.department?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Title</Label>
                      <p className="font-medium">{selectedEmployee.title?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Employee ID</Label>
                      <p className="font-medium">{selectedEmployee.id}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {selectedEmployee.department?.description && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Department Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{selectedEmployee.department.description}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
