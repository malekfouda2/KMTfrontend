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
    onSuccess: (data: AuthResponse) => {
      authService.setAuth(data);
      setUser(data.user);
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
    if (token) {
      // In a real app, you might want to validate the token with the server
      const currentUser = authService.getUser();
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        logout();
      }
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
