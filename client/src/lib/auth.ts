import { User, AuthResponse } from "@/types";

const TOKEN_KEY = "kmt_token";
const USER_KEY = "kmt_user";

export const authService = {
  // Store authentication data
  setAuth: (authData: AuthResponse) => {
    localStorage.setItem(TOKEN_KEY, authData.token);
    localStorage.setItem(USER_KEY, JSON.stringify(authData.user));
  },

  // Get stored token
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Get stored user
  getUser: (): User | null => {
    try {
      const userData = localStorage.getItem(USER_KEY);
      if (!userData || userData === "undefined") {
        return null;
      }
      return JSON.parse(userData);
    } catch (error) {
      console.error("Error parsing user data:", error);
      // Clear corrupted data
      localStorage.removeItem(USER_KEY);
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = authService.getToken();
    return token !== null;
  },

  // Clear authentication data
  clearAuth: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // Check if user has required role
  hasRole: (user: User | null, requiredRoles: string[]): boolean => {
    if (!user) return false;
    
    // Direct role check for KMT backend roles
    if (requiredRoles.includes(user.role)) {
      return true;
    }
    
    // Fallback mapping for backwards compatibility
    const roleMapping: { [key: string]: string[] } = {
      "Super Admin": ["general_manager", "hr_manager", "team_leader"],
      "Admin": ["hr_manager", "team_leader"],
      "HR Manager": ["hr_manager"],
      "Team Leader": ["team_leader"],
      "Manager": ["hr_manager"],
      "Employee": []
    };
    
    const userMappedRoles = roleMapping[user.role] || [];
    return requiredRoles.some(role => userMappedRoles.includes(role));
  },

  // Get user permissions based on role
  getPermissions: (user: User | null) => {
    if (!user) return {};

    const basePermissions = {
      canViewDashboard: true,
      canViewAttendance: true,
      canViewLeave: true,
      canViewMissions: true,
    };

    // Handle both KMT backend role names and frontend role names
    switch (user.role) {
      case "Super Admin":
      case "general_manager":
        return {
          ...basePermissions,
          canManageEmployees: true,
          canManagePolicies: true,
          canViewAnalytics: true,
          canApproveAll: true,
          canAssignMissions: true,
          canManageDepartments: true,
          canManageRoles: true,
          canViewReports: true,
          canDeleteRecords: true,
        };

      case "Admin":
      case "HR Manager":
      case "hr_manager":
        return {
          ...basePermissions,
          canManageEmployees: true,
          canManagePolicies: true,
          canViewAnalytics: true,
          canApproveLeave: true,
          canManageAttendance: true,
          canManageDepartments: true,
          canViewReports: true,
        };

      case "Manager":
      case "Team Leader":
      case "team_leader":
        return {
          ...basePermissions,
          canApproveTeamAttendance: true,
          canApproveTeamLeave: true,
          canViewTeamData: true,
          canManageTeamMembers: true,
        };

      case "Employee":
      default:
        return basePermissions;
    }
  },
};

// JWT token decoder (simple implementation)
export const decodeToken = (token: string) => {
  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
