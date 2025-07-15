import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface AddEmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const userFormSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email format"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  titleId: z.string().optional(),
  departmentId: z.string().optional(),
  hireDate: z.string().min(1, "Hire date is required"),
  priorWorkExperienceMonths: z.number().min(0, "Experience must be non-negative"),
  gender: z.number().min(1).max(2), // 1 = Male, 2 = Female
});

type UserFormData = z.infer<typeof userFormSchema>;

export const AddEmployeeModal = ({ open, onOpenChange }: AddEmployeeModalProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch departments and titles for dropdowns
  const { data: departmentsData, isLoading: deptLoading } = useQuery({
    queryKey: ["/api/Department"],
    queryFn: async () => {
      console.log("AddEmployeeModal: Fetching departments...");
      const result = await apiClient.getDepartments();
      console.log("AddEmployeeModal: Departments result:", result);
      return result;
    },
  });

  const { data: titlesData } = useQuery({
    queryKey: ["/api/Title"],
    queryFn: () => apiClient.getTitles(),
  });

  const departments = Array.isArray(departmentsData) ? departmentsData : [];
  const titles = Array.isArray(titlesData) ? titlesData : [];
  
  console.log("AddEmployeeModal: Final departments:", departments);
  console.log("AddEmployeeModal: Department loading:", deptLoading);

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      username: "",
      email: "",
      phoneNumber: "",
      password: "",
      titleId: "",
      departmentId: "",
      hireDate: new Date().toISOString().split('T')[0],
      priorWorkExperienceMonths: 0,
      gender: 1,
    },
  });

  const createEmployeeMutation = useMutation({
    mutationFn: (userData: UserFormData) => apiClient.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/User"] });
      toast({
        title: "Success",
        description: "Employee added successfully",
      });
      form.reset();
      onOpenChange(false);
    },
    onError: (error: Error) => {
      console.error("Create employee error:", error);
      
      // Ensure error message is a string
      let errorMessage = "Failed to add employee";
      if (error && typeof error === 'object') {
        if (error.message && typeof error.message === 'string') {
          errorMessage = error.message;
        } else if (typeof error === 'string') {
          errorMessage = error;
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: UserFormData) => {
    console.log("Submitting employee data:", data);
    
    // Ensure all fields are properly formatted
    const formattedData = {
      ...data,
      titleId: data.titleId || undefined,
      departmentId: data.departmentId || undefined,
      hireDate: data.hireDate ? new Date(data.hireDate).toISOString() : new Date().toISOString(),
      priorWorkExperienceMonths: Number(data.priorWorkExperienceMonths) || 0,
      gender: Number(data.gender) || 1
    };
    
    console.log("Formatted employee data:", formattedData);
    createEmployeeMutation.mutate(formattedData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="Enter email address" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number *</FormLabel>
                    <FormControl>
                      <Input 
                        type="tel" 
                        placeholder="Enter phone number" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password *</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Enter password" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="titleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select title" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {titles.map((title: any) => (
                          <SelectItem key={title.id} value={title.id.toString()}>
                            {title.name || title.nameAr || 'Unknown Title'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="departmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map((department: any) => (
                          <SelectItem key={department.id} value={department.id.toString()}>
                            {department.name || department.nameAr || 'Unknown Department'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hireDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hire Date *</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priorWorkExperienceMonths"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prior Experience (Months)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        placeholder="0" 
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
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender *</FormLabel>
                    <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">Male</SelectItem>
                        <SelectItem value="2">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={createEmployeeMutation.isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createEmployeeMutation.isPending}
              >
                {createEmployeeMutation.isPending && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Add Employee
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};