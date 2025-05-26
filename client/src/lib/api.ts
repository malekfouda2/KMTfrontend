import { authService } from "./auth";

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
      throw new Error(`${response.status}: ${errorText || response.statusText}`);
    }

    // Handle empty responses
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }

    return response.text() as any;
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

  // Users (KMT Backend uses Users instead of Employees)
  async getUsers(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params)}` : "";
    return this.request(`/Users${queryString}`);
  }

  async getUser(id: string) {
    return this.request(`/Users/${id}`);
  }

  async createUser(user: any) {
    return this.request("/Users", {
      method: "POST",
      body: JSON.stringify(user),
    });
  }

  async updateUser(id: string, user: any) {
    return this.request(`/Users/${id}`, {
      method: "PUT",
      body: JSON.stringify(user),
    });
  }

  async deleteUser(id: string) {
    return this.request(`/Users/${id}`, {
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

  // Leave Requests
  async getLeaveRequests(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params)}` : "";
    return this.request(`/LeaveRequests${queryString}`);
  }

  async createLeaveRequest(request: any) {
    return this.request("/LeaveRequests", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  async approveLeaveRequest(id: number, comments?: string) {
    return this.request(`/LeaveRequests/${id}/approve`, {
      method: "PATCH",
      body: JSON.stringify({ comments }),
    });
  }

  async rejectLeaveRequest(id: number, comments?: string) {
    return this.request(`/LeaveRequests/${id}/reject`, {
      method: "PATCH",
      body: JSON.stringify({ comments }),
    });
  }

  // Missions
  async getMissions(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params)}` : "";
    return this.request(`/Missions${queryString}`);
  }

  async createMission(mission: any) {
    return this.request("/Missions", {
      method: "POST",
      body: JSON.stringify(mission),
    });
  }

  async updateMission(id: string, mission: any) {
    return this.request(`/Missions/${id}`, {
      method: "PUT",
      body: JSON.stringify(mission),
    });
  }

  async deleteMission(id: string) {
    return this.request(`/Missions/${id}`, {
      method: "DELETE",
    });
  }

  async assignMission(id: string, userId: string) {
    return this.request(`/Missions/${id}/assign`, {
      method: "PATCH",
      body: JSON.stringify({ userId }),
    });
  }

  async updateMissionTransportation(id: string, transportationDetails: any) {
    return this.request(`/Missions/${id}/transportation`, {
      method: "PATCH",
      body: JSON.stringify(transportationDetails),
    });
  }

  // Policies
  async getPolicies(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params)}` : "";
    return this.request(`/Policies${queryString}`);
  }

  async createPolicy(policy: any) {
    return this.request("/Policies", {
      method: "POST",
      body: JSON.stringify(policy),
    });
  }

  async updatePolicy(id: number, policy: any) {
    return this.request(`/Policies/${id}`, {
      method: "PUT",
      body: JSON.stringify(policy),
    });
  }

  async deletePolicy(id: number) {
    return this.request(`/Policies/${id}`, {
      method: "DELETE",
    });
  }

  // Departments
  async getDepartments(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params)}` : "";
    return this.request(`/Departments${queryString}`);
  }

  async createDepartment(department: any) {
    return this.request("/Departments", {
      method: "POST",
      body: JSON.stringify(department),
    });
  }

  async updateDepartment(id: string, department: any) {
    return this.request(`/Departments/${id}`, {
      method: "PUT",
      body: JSON.stringify(department),
    });
  }

  async deleteDepartment(id: string) {
    return this.request(`/Departments/${id}`, {
      method: "DELETE",
    });
  }

  // Titles
  async getTitles(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params)}` : "";
    return this.request(`/Titles${queryString}`);
  }

  async createTitle(title: any) {
    return this.request("/Titles", {
      method: "POST",
      body: JSON.stringify(title),
    });
  }

  async updateTitle(id: string, title: any) {
    return this.request(`/Titles/${id}`, {
      method: "PUT",
      body: JSON.stringify(title),
    });
  }

  async deleteTitle(id: string) {
    return this.request(`/Titles/${id}`, {
      method: "DELETE",
    });
  }

  // Roles
  async getRoles(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params)}` : "";
    return this.request(`/Roles${queryString}`);
  }

  async createRole(role: any) {
    return this.request("/Roles", {
      method: "POST",
      body: JSON.stringify(role),
    });
  }

  async updateRole(id: string, role: any) {
    return this.request(`/Roles/${id}`, {
      method: "PUT",
      body: JSON.stringify(role),
    });
  }

  async deleteRole(id: string) {
    return this.request(`/Roles/${id}`, {
      method: "DELETE",
    });
  }

  async assignRole(userId: string, roleId: string) {
    return this.request("/Roles/assign", {
      method: "POST",
      body: JSON.stringify({ userId, roleId }),
    });
  }

  // Permissions
  async getPermissions() {
    return this.request("/Permissions");
  }

  async assignPermission(roleId: string, permission: string) {
    return this.request("/Permissions/assign", {
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

export const apiClient = new ApiClient(API_BASE_URL);
