export * from "@shared/schema";

export type UserRole = "general_manager" | "hr_manager" | "team_leader" | "Super Admin" | "Admin" | "HR Manager" | "Team Leader" | "Manager" | "Employee";

export type NavigationItem = {
  id: string;
  label: string;
  icon: string;
  route: string;
  roles?: UserRole[];
};

export type ToastType = "success" | "error" | "warning" | "info";

export type Toast = {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
};

export type ApiError = {
  message: string;
  status?: number;
  details?: any;
};

export type PaginationParams = {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export type FilterParams = {
  department?: string;
  employeeType?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
};

// KMT Backend UserResponse structure
export type KMTUser = {
  id: string;
  username: string;
  email: string;
  phoneNumber: string;
  department?: {
    id: string;
    name: string;
    nameAr: string;
    description: string;
    descriptionAr: string;
    createdAt: string;
    userCount?: number;
  };
  title?: {
    id: string;
    name: string;
    nameAr: string;
    description: string;
    descriptionAr: string;
    createdAt: string;
  };
  createdAt: string;
  updatedAt?: string;
};
