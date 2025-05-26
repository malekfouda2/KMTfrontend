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

  // Employees
  async getEmployees(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params)}` : "";
    return this.request(`/Employees${queryString}`);
  }

  async getEmployee(id: number) {
    return this.request(`/Employees/${id}`);
  }

  async createEmployee(employee: any) {
    return this.request("/Employees", {
      method: "POST",
      body: JSON.stringify(employee),
    });
  }

  async updateEmployee(id: number, employee: any) {
    return this.request(`/Employees/${id}`, {
      method: "PUT",
      body: JSON.stringify(employee),
    });
  }

  async deleteEmployee(id: number) {
    return this.request(`/Employees/${id}`, {
      method: "DELETE",
    });
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

  async updateMission(id: number, mission: any) {
    return this.request(`/Missions/${id}`, {
      method: "PUT",
      body: JSON.stringify(mission),
    });
  }

  async approveMission(id: number) {
    return this.request(`/Missions/${id}/approve`, {
      method: "PATCH",
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

  // Dashboard
  async getDashboardStats() {
    return this.request("/Dashboard/stats");
  }

  async getAttendanceTrends(days: number = 7) {
    return this.request(`/Dashboard/attendance-trends?days=${days}`);
  }

  async getDepartmentDistribution() {
    return this.request("/Dashboard/department-distribution");
  }

  async getRecentActivities(limit: number = 10) {
    return this.request(`/Dashboard/recent-activities?limit=${limit}`);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
