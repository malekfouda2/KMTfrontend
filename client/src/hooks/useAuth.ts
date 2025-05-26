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
      console.log("Login response:", data);
      
      // Handle different possible response formats from .NET API
      let authData: AuthResponse;
      if (data.token && data.user) {
        // Already in correct format
        authData = data;
      } else if (data.token) {
        // Token only - create a minimal user object
        authData = {
          token: data.token,
          user: {
            id: data.userId || 1,
            name: data.name || variables.email.split('@')[0],
            email: variables.email,
            password: '',
            role: data.role || 'hr_manager',
            department: data.department || null,
            isActive: true,
            createdAt: new Date()
          }
        };
      } else {
        throw new Error("Invalid login response format");
      }

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
