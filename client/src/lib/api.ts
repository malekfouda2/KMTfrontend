import { authService } from "./auth";
import { kmtApiClient } from "./kmt-api";

const API_BASE_URL = "http://localhost:5114/api";

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = authService.getToken();

    console.log('API Request:', { 
      url, 
      method: options.method || 'GET',
      hasToken: !!token,
      tokenLength: token ? token.length : 0
    });

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        url,
        method: options.method || 'GET',
        headers: Object.fromEntries(Object.entries(config.headers || {})),
        body: errorText
      });
      
      // Handle authentication errors
      if (response.status === 401) {
        console.log('Authentication failed, clearing auth data');
        authService.clearAuth();
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      
      throw new Error(`${response.status}: ${errorText || response.statusText}`);
    }

    try {
      const data = await response.json();
      console.log('API Response:', { url, data });
      
      // Handle KMT backend response structure: { data: [...], message: "...", success: true }
      if (data && typeof data === 'object' && 'data' in data) {
        return data.data;
      }
      
      return data;
    } catch (error) {
      console.error('Failed to parse JSON response:', error);
      // Handle non-JSON responses
      return response.text() as any;
    }
  }

  // Authentication
  async login(email: string, password: string) {
    return this.request("/Auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    return this.request("/Auth/logout", {
      method: "POST",
    });
  }

  // Users (KMT Backend uses User endpoint)
  async getUsers(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params)}` : "";
    return this.request(`/User${queryString}`);
  }

  async getUser(id: string) {
    return this.request(`/User/${id}`);
  }

  async createUser(user: any) {
    return this.request("/User", {
      method: "POST",
      body: JSON.stringify(user),
    });
  }

  async updateUser(id: string, user: any) {
    return this.request(`/User/${id}`, {
      method: "PUT",
      body: JSON.stringify(user),
    });
  }

  async deleteUser(id: string) {
    return this.request(`/User/${id}`, {
      method: "DELETE",
    });
  }

  // Keep employee methods for backward compatibility
  async getEmployees(params?: any) {
    return this.getUsers(params);
  }

  async getEmployee(id: any) {
    return this.getUser(id);
  }

  async createEmployee(employee: any) {
    return this.createUser(employee);
  }

  async updateEmployee(id: any, employee: any) {
    return this.updateUser(id, employee);
  }

  async deleteEmployee(id: any) {
    return this.deleteUser(id);
  }

  // Attendance
  async getAttendance(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params)}` : "";
    return this.request(`/Attendance${queryString}`);
  }

  async createAttendance(attendance: any) {
    return this.request("/Attendance", {
      method: "POST",
      body: JSON.stringify(attendance),
    });
  }

  async approveAttendance(id: number) {
    return this.request(`/Attendance/${id}/approve`, {
      method: "PATCH",
    });
  }

  // Leave Requests - Updated for KMT backend
  async getLeaveRequests(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params)}` : "";
    return this.request(`/LeaveRequest${queryString}`);
  }

  async createLeaveRequest(request: any) {
    return this.request("/LeaveRequest", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  async updateLeaveRequest(id: string, request: any) {
    return this.request(`/LeaveRequest/${id}`, {
      method: "PUT",
      body: JSON.stringify(request),
    });
  }

  async deleteLeaveRequest(id: string) {
    return this.request(`/LeaveRequest/${id}`, {
      method: "DELETE",
    });
  }

  async approveLeaveRequest(id: number, comments?: string) {
    return this.request(`/LeaveRequest/${id}/approve`, {
      method: "PATCH",
      body: JSON.stringify({ comments }),
    });
  }

  async rejectLeaveRequest(id: number, comments?: string) {
    return this.request(`/LeaveRequest/${id}/reject`, {
      method: "PATCH",
      body: JSON.stringify({ comments }),
    });
  }

  // Missions
  async getMissions(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params)}` : "";
    return this.request(`/Mission${queryString}`);
  }

  async createMission(mission: any) {
    return this.request("/Mission", {
      method: "POST",
      body: JSON.stringify(mission),
    });
  }

  async updateMission(id: string, mission: any) {
    return this.request(`/Mission/${id}`, {
      method: "PUT",
      body: JSON.stringify(mission),
    });
  }

  async deleteMission(id: string) {
    return this.request(`/Mission/${id}`, {
      method: "DELETE",
    });
  }

  async assignMission(id: string, userId: string) {
    return this.request(`/Mission/${id}/assign`, {
      method: "PATCH",
      body: JSON.stringify({ userId }),
    });
  }

  async updateMissionTransportation(id: string, transportationDetails: any) {
    return this.request(`/Mission/${id}/transportation`, {
      method: "PATCH",
      body: JSON.stringify(transportationDetails),
    });
  }

  // Policies
  async getPolicies(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params)}` : "";
    return this.request(`/Policy${queryString}`);
  }

  async createPolicy(policy: any) {
    return this.request("/Policy", {
      method: "POST",
      body: JSON.stringify(policy),
    });
  }

  async updatePolicy(id: number, policy: any) {
    return this.request(`/Policy/${id}`, {
      method: "PUT",
      body: JSON.stringify(policy),
    });
  }

  async deletePolicy(id: number) {
    return this.request(`/Policy/${id}`, {
      method: "DELETE",
    });
  }

  // Departments
  async getDepartments(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params)}` : "";
    return this.request(`/Department${queryString}`);
  }

  async createDepartment(department: any) {
    return this.request("/Department", {
      method: "POST",
      body: JSON.stringify(department),
    });
  }

  async updateDepartment(id: string, department: any) {
    return this.request(`/Department/${id}`, {
      method: "PUT",
      body: JSON.stringify(department),
    });
  }

  async deleteDepartment(id: string) {
    return this.request(`/Department/${id}`, {
      method: "DELETE",
    });
  }

  // Titles
  async getTitles(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params)}` : "";
    return this.request(`/Title${queryString}`);
  }

  async createTitle(title: any) {
    return this.request("/Title", {
      method: "POST",
      body: JSON.stringify(title),
    });
  }

  async updateTitle(id: string, title: any) {
    return this.request(`/Title/${id}`, {
      method: "PUT",
      body: JSON.stringify(title),
    });
  }

  async deleteTitle(id: string) {
    return this.request(`/Title/${id}`, {
      method: "DELETE",
    });
  }

  // Roles
  async getRoles(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params)}` : "";
    return this.request(`/Role${queryString}`);
  }

  async createRole(role: any) {
    return this.request("/Role", {
      method: "POST",
      body: JSON.stringify(role),
    });
  }

  async updateRole(id: string, role: any) {
    return this.request(`/Role/${id}`, {
      method: "PUT",
      body: JSON.stringify(role),
    });
  }

  async deleteRole(id: string) {
    return this.request(`/Role/${id}`, {
      method: "DELETE",
    });
  }

  async assignRole(userId: string, roleId: string) {
    return this.request("/Role/assign", {
      method: "POST",
      body: JSON.stringify({ userId, roleId }),
    });
  }

  // Permissions
  async getPermissions() {
    return this.request("/Permission");
  }

  async assignPermission(roleId: string, permission: string) {
    return this.request("/Permission/assign", {
      method: "POST",
      body: JSON.stringify({ roleId, permission }),
    });
  }

  // Dashboard (keep for compatibility, but may need adjustment based on actual endpoints)
  async getDashboardStats() {
    // This might need to be adapted based on actual KMT backend endpoints
    return this.request("/Dashboard/stats");
  }

  async getAttendanceTrends(days: number = 7) {
    return this.request(`/Dashboard/attendance-trends?days=${days}`);
  }

  async getDepartmentDistribution() {
    return this.getDepartments();
  }

  async getRecentActivities(limit: number = 10) {
    return this.request(`/Dashboard/recent-activities?limit=${limit}`);
  }
}

// Use KMT-optimized API client for all backend communication
export const apiClient = kmtApiClient;
