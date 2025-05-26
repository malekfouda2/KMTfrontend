import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/lib/auth";
import { apiClient } from "@/lib/api";
import { User, AuthResponse } from "@/types";
import { useToast } from "@/hooks/use-toast";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(authService.getUser());
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      apiClient.login(email, password),
    onSuccess: (data: any, variables) => {
      console.log("Full login response:", JSON.stringify(data, null, 2));
      
      // Handle different possible response formats from .NET API
      let authData: AuthResponse;
      
      // Check if data has token property (most common .NET auth responses)
      if (data && (data.token || data.accessToken || data.access_token)) {
        const token = data.token || data.accessToken || data.access_token;
        
        authData = {
          token: token,
          user: {
            id: data.userId || data.id || 1,
            name: data.name || data.userName || data.fullName || variables.email.split('@')[0],
            email: data.email || variables.email,
            password: '',
            role: data.role || data.userRole || 'hr_manager',
            department: data.department || null,
            isActive: true,
            createdAt: new Date()
          }
        };
      } 
      // Check if the entire response is a token string
      else if (typeof data === 'string') {
        authData = {
          token: data,
          user: {
            id: 1,
            name: variables.email.split('@')[0],
            email: variables.email,
            password: '',
            role: 'hr_manager',
            department: null,
            isActive: true,
            createdAt: new Date()
          }
        };
      }
      // Handle nested user object structure
      else if (data && data.user && (data.user.token || data.token)) {
        authData = {
          token: data.token || data.user.token,
          user: {
            id: data.user.id || 1,
            name: data.user.name || data.user.userName || variables.email.split('@')[0],
            email: data.user.email || variables.email,
            password: '',
            role: data.user.role || 'hr_manager',
            department: data.user.department || null,
            isActive: true,
            createdAt: new Date()
          }
        };
      }
      else {
        console.error("Unexpected login response format:", data);
        throw new Error(`Login succeeded but response format not recognized. Expected token field.`);
      }

      console.log("Processed auth data:", authData);
      
      authService.setAuth(authData);
      setUser(authData.user);
      setIsAuthenticated(true);
      queryClient.invalidateQueries();
      toast({
        title: "Success",
        description: "Logged in successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => apiClient.logout(),
    onSuccess: () => {
      logout();
    },
    onError: () => {
      // Even if API call fails, clear local auth
      logout();
    },
  });

  const login = (email: string, password: string) => {
    // Clear any existing corrupted data first
    authService.clearAuth();
    loginMutation.mutate({ email, password });
  };

  const logout = () => {
    authService.clearAuth();
    setUser(null);
    setIsAuthenticated(false);
    queryClient.clear();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  const hasRole = (requiredRoles: string[]) => {
    return authService.hasRole(user, requiredRoles);
  };

  const getPermissions = () => {
    return authService.getPermissions(user);
  };

  // Check token validity on app load
  useEffect(() => {
    const token = authService.getToken();
    const currentUser = authService.getUser();
    
    if (token && currentUser) {
      setUser(currentUser);
      setIsAuthenticated(true);
    } else if (token && !currentUser) {
      // Clear invalid state
      authService.clearAuth();
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  return {
    user,
    isAuthenticated,
    login,
    logout: () => logoutMutation.mutate(),
    hasRole,
    getPermissions,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
};
