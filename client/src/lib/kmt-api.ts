import { authService } from "./auth";

const KMT_API_BASE_URL = "http://localhost:5114/api";

interface KMTResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

class KMTApiClient {
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

    console.log('KMT API Request:', { 
      url, 
      method: options.method || 'GET',
      hasToken: !!token
    });

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('KMT API Error:', {
          status: response.status,
          statusText: response.statusText,
          url,
          errorText
        });
        
        // Handle authentication errors
        if (response.status === 401) {
          console.log('KMT Authentication failed, clearing auth data');
          authService.clearAuth();
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
        
        throw new Error(`${response.status}: ${errorText || response.statusText}`);
      }

      const data = await response.json();
      console.log('KMT API Response:', { url, data });
      
      // Handle KMT backend response structure
      if (data && typeof data === 'object' && 'data' in data) {
        return (data as KMTResponse<T>).data;
      }
      
      return data;
    } catch (error) {
      console.error('KMT API Request failed:', error);
      throw error;
    }
  }

  // Authentication
  async login(email: string, password: string) {
    return this.request<any>("/Auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    return this.request<any>("/Auth/logout", {
      method: "POST",
    });
  }

  // Users
  async getUsers(params?: any) {
    // Build proper query string with filtering support
    const queryParams = new URLSearchParams();
    
    if (params?.search) {
      queryParams.append('search', params.search);
    }
    if (params?.department) {
      queryParams.append('departmentId', params.department);
    }
    if (params?.status) {
      queryParams.append('status', params.status);
    }
    if (params?.pageNumber) {
      queryParams.append('pageNumber', params.pageNumber.toString());
    }
    if (params?.pageSize) {
      queryParams.append('pageSize', params.pageSize.toString());
    }
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
    return this.request<any[]>(`/User${queryString}`);
  }

  async getUser(id: string) {
    return this.request<any>(`/User/${id}`);
  }

  async createUser(user: any) {
    // Map frontend user data to KMT CreateUserRequest format
    const createUserRequest = {
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      password: user.password,
      titleId: user.titleId || null,
      departmentId: user.departmentId || null,
      hireDate: user.hireDate || new Date().toISOString(),
      priorWorkExperienceMonths: user.priorWorkExperienceMonths || 0,
      gender: user.gender || 1 // Default to Male (1) if not specified
    };
    return this.request<any>("/User", {
      method: "POST",
      body: JSON.stringify(createUserRequest),
    });
  }

  async updateUser(id: string, user: any) {
    return this.request<any>(`/User/${id}`, {
      method: "PUT",
      body: JSON.stringify(user),
    });
  }

  async deleteUser(id: string) {
    return this.request<any>(`/User/${id}`, {
      method: "DELETE",
    });
  }

  // Departments
  async getDepartments(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params)}` : "";
    return this.request<any[]>(`/Department${queryString}`);
  }

  async createDepartment(department: any) {
    return this.request<any>("/Department", {
      method: "POST",
      body: JSON.stringify(department),
    });
  }

  async updateDepartment(id: string, department: any) {
    return this.request<any>(`/Department/${id}`, {
      method: "PUT",
      body: JSON.stringify(department),
    });
  }

  async deleteDepartment(id: string) {
    return this.request<any>(`/Department/${id}`, {
      method: "DELETE",
    });
  }

  // Roles
  async getRoles(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params)}` : "";
    return this.request<any[]>(`/Role${queryString}`);
  }

  async createRole(role: any) {
    return this.request<any>("/Role", {
      method: "POST",
      body: JSON.stringify(role),
    });
  }

  async updateRole(id: string, role: any) {
    return this.request<any>(`/Role/${id}`, {
      method: "PUT",
      body: JSON.stringify(role),
    });
  }

  async deleteRole(id: string) {
    return this.request<any>(`/Role/${id}`, {
      method: "DELETE",
    });
  }

  // Missions
  async getMissions(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params)}` : "";
    return this.request<any[]>(`/Mission${queryString}`);
  }

  async createMission(mission: any) {
    // Use proper field mapping for KMT backend
    const createMissionRequest = {
      Description: mission.description,
      DescriptionAr: mission.descriptionAr,
      MissionDate: mission.missionDate,
      StartTime: mission.startTime,
      ...(mission.endTime && { EndTime: mission.endTime }),
      Location: mission.location
    };
    
    console.log('Creating mission with proper field mapping:', createMissionRequest);
    
    return this.request<any>("/Mission", {
      method: "POST",
      body: JSON.stringify(createMissionRequest),
    });
  }

  async updateMission(id: string, mission: any) {
    return this.request<any>(`/Mission/${id}`, {
      method: "PUT",
      body: JSON.stringify(mission),
    });
  }

  async deleteMission(id: string) {
    return this.request<any>(`/Mission/${id}`, {
      method: "DELETE",
    });
  }

  // Leave Types
  async getLeaveTypes(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params)}` : "";
    return this.request<any[]>(`/LeaveType${queryString}`);
  }

  // Leave Requests
  async getLeaveRequests(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params)}` : "";
    return this.request<any[]>(`/LeaveRequest${queryString}`);
  }

  async createLeaveRequest(request: any) {
    // Map frontend leave request data to KMT CreateLeaveRequestRequest format
    const createLeaveRequest = {
      leaveTypeId: request.leaveTypeId,
      startDate: request.startDate,
      endDate: request.endDate,
      isHourlyLeave: request.isHourlyLeave || false,
      startTime: request.startTime ? { ticks: 0 } : null // Convert time string to TimeSpan format if needed
    };
    return this.request<any>("/LeaveRequest", {
      method: "POST",
      body: JSON.stringify(createLeaveRequest),
    });
  }

  async updateLeaveRequest(id: string, request: any) {
    return this.request<any>(`/LeaveRequest/${id}`, {
      method: "PUT",
      body: JSON.stringify(request),
    });
  }

  async deleteLeaveRequest(id: string) {
    return this.request<any>(`/LeaveRequest/${id}`, {
      method: "DELETE",
    });
  }

  // Attendance
  async getAttendance(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params)}` : "";
    return this.request<any[]>(`/Attendance${queryString}`);
  }

  async createAttendance(attendance: any) {
    return this.request<any>("/Attendance", {
      method: "POST",
      body: JSON.stringify(attendance),
    });
  }

  async updateAttendance(id: string, attendance: any) {
    return this.request<any>(`/Attendance/${id}`, {
      method: "PUT",
      body: JSON.stringify(attendance),
    });
  }

  async deleteAttendance(id: string) {
    return this.request<any>(`/Attendance/${id}`, {
      method: "DELETE",
    });
  }

  // Policies
  async getPolicies(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params)}` : "";
    return this.request<any[]>(`/Policy${queryString}`);
  }

  async createPolicy(policy: any) {
    return this.request<any>("/Policy", {
      method: "POST",
      body: JSON.stringify(policy),
    });
  }

  async updatePolicy(id: string, policy: any) {
    return this.request<any>(`/Policy/${id}`, {
      method: "PUT",
      body: JSON.stringify(policy),
    });
  }

  async deletePolicy(id: string) {
    return this.request<any>(`/Policy/${id}`, {
      method: "DELETE",
    });
  }

  // Titles
  async getTitles(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params)}` : "";
    return this.request<any[]>(`/Title${queryString}`);
  }

  async createTitle(title: any) {
    return this.request<any>("/Title", {
      method: "POST",
      body: JSON.stringify(title),
    });
  }

  async updateTitle(id: string, title: any) {
    return this.request<any>(`/Title/${id}`, {
      method: "PUT",
      body: JSON.stringify(title),
    });
  }

  async deleteTitle(id: string) {
    return this.request<any>(`/Title/${id}`, {
      method: "DELETE",
    });
  }

  // Mission assignment and transportation
  async assignMission(id: string, userId: string) {
    return this.request<any>(`/Mission/${id}/assign`, {
      method: "PATCH",
      body: JSON.stringify({ userId }),
    });
  }

  async updateMissionTransportation(id: string, transportationDetails: any) {
    return this.request<any>(`/Mission/${id}/transportation`, {
      method: "PATCH",
      body: JSON.stringify(transportationDetails),
    });
  }

  // Employee methods (aliases for Users)
  async getEmployees(params?: any) {
    return this.getUsers(params);
  }

  async getEmployee(id: string) {
    return this.getUser(id);
  }

  async createEmployee(employee: any) {
    return this.createUser(employee);
  }

  async updateEmployee(id: string, employee: any) {
    return this.updateUser(id, employee);
  }

  async deleteEmployee(id: string) {
    return this.deleteUser(id);
  }

  // Dashboard and analytics (fallback to dummy data since not implemented in KMT)
  async getDashboardStats() {
    // Return dummy data since KMT backend doesn't implement dashboard endpoints
    return {
      totalEmployees: 247,
      presentToday: 234,
      onLeave: 8,
      activeMissions: 15,
      attendanceRate: 94.7,
      pendingApprovals: 5,
      overtimeHours: 23.5,
    };
  }

  async getAttendanceTrends(days: number = 7) {
    // Return dummy data for dashboard charts
    return Array.from({ length: days }, (_, i) => ({
      date: new Date(Date.now() - (days - 1 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      present: Math.floor(Math.random() * 50) + 200,
      absent: Math.floor(Math.random() * 20) + 5,
      late: Math.floor(Math.random() * 15) + 3,
    }));
  }

  async getDepartmentDistribution() {
    // Return dummy data for department chart
    return [
      { name: "Engineering", value: 45, color: "#3B82F6" },
      { name: "HR", value: 15, color: "#10B981" },
      { name: "Marketing", value: 20, color: "#F59E0B" },
      { name: "Finance", value: 12, color: "#EF4444" },
      { name: "Operations", value: 8, color: "#8B5CF6" },
    ];
  }

  async getRecentActivities(limit: number = 10) {
    // Return dummy data for recent activities
    return Array.from({ length: limit }, (_, i) => ({
      id: i + 1,
      type: ["leave_request", "mission_assignment", "attendance_approval"][i % 3],
      description: [
        "New leave request submitted",
        "Mission assigned to team member",
        "Attendance record approved"
      ][i % 3],
      user: `User ${i + 1}`,
      timestamp: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
    }));
  }

  // Leave request approval methods
  async approveLeaveRequest(id: number, comments?: string) {
    return this.request<any>(`/LeaveRequest/${id}/approve`, {
      method: "PATCH",
      body: JSON.stringify({ comments }),
    });
  }

  async rejectLeaveRequest(id: number, comments?: string) {
    return this.request<any>(`/LeaveRequest/${id}/reject`, {
      method: "PATCH",
      body: JSON.stringify({ comments }),
    });
  }

  // Attendance approval
  async approveAttendance(id: number) {
    return this.request<any>(`/Attendance/${id}/approve`, {
      method: "PATCH",
    });
  }

  // Role assignment
  async assignRole(userId: string, roleId: string) {
    return this.request<any>(`/User/${userId}/role`, {
      method: "PATCH",
      body: JSON.stringify({ roleId }),
    });
  }

  // Permissions
  async getPermissions() {
    return this.request<any[]>("/Permission");
  }

  async assignPermission(roleId: string, permission: string) {
    return this.request<any>(`/Role/${roleId}/permissions/${permission}`, {
      method: "PUT",
    });
  }
}

export const kmtApiClient = new KMTApiClient(KMT_API_BASE_URL);