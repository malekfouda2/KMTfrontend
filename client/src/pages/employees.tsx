import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { Employee, FilterParams } from "@/types";
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
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Filter } from "lucide-react";

export default function Employees() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [filters, setFilters] = useState<FilterParams>({
    department: "",
    employeeType: "",
    status: "",
  });
  const [search, setSearch] = useState("");

  const { data: employees, isLoading } = useQuery({
    queryKey: ["/api/User", filters, search],
    queryFn: () => apiClient.getUsers({ ...filters, search }),
  });

  // Fetch departments for filter dropdown
  const { data: departmentsData, isLoading: departmentsLoading, error: departmentsError } = useQuery({
    queryKey: ["/api/Department"],
    queryFn: async () => {
      console.log("Fetching departments...");
      try {
        const result = await apiClient.getDepartments();
        console.log("Departments fetched successfully:", result);
        return result;
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

  const handleViewEmployee = (employee: Employee) => {
    // TODO: Implement employee detail view
    console.log("View employee:", employee);
  };

  const handleEditEmployee = (employee: Employee) => {
    // TODO: Implement employee edit modal
    console.log("Edit employee:", employee);
  };

  const clearFilters = () => {
    setFilters({
      department: "",
      employeeType: "",
      status: "",
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
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-secondary">Employee Management</h2>
            <p className="text-gray-600">Manage employee information and records</p>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Employee
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                      <SelectItem key={dept.id} value={dept.id || dept.name}>
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
                      <SelectItem key={title.id} value={title.id || title.name}>
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
    </MainLayout>
  );
}
