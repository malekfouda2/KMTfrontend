import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/Auth/login", (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
      res.json({
        token: "mock-jwt-token",
        user: {
          id: 1,
          name: "Admin User",
          email: email,
          role: "Super Admin",
          department: "Administration",
          isActive: true
        }
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  });

  app.post("/api/Auth/logout", (req, res) => {
    res.json({ message: "Logged out successfully" });
  });

  // User management
  app.get("/api/User", (req, res) => {
    res.json([
      {
        id: 1,
        name: "John Doe",
        email: "john@company.com",
        role: "Team Leader",
        department: "Engineering",
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        name: "Jane Smith", 
        email: "jane@company.com",
        role: "HR Manager",
        department: "Human Resources",
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        name: "Mike Wilson",
        email: "mike@company.com", 
        role: "General Manager",
        department: "Finance",
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ]);
  });

  app.post("/api/User", (req, res) => {
    const { name, username, email, password, role, department, isActive } = req.body;
    
    // Validate required fields
    if (!username) {
      return res.status(400).json({
        errors: {
          Username: ["The Username field is required."]
        },
        type: "https://tools.ietf.org/html/rfc9110#section-15.5.1",
        title: "One or more validation errors occurred.",
        status: 400
      });
    }
    
    const newUser = { 
      id: Date.now(),
      name: name || "",
      username,
      email: email || "",
      password: password || "",
      role: role || "Team Leader",
      department: department || "Engineering",
      isActive: isActive !== undefined ? isActive : true,
      createdAt: new Date().toISOString() 
    };
    res.json(newUser);
  });

  app.put("/api/User/:id", (req, res) => {
    res.json({ id: req.params.id, ...req.body });
  });

  app.delete("/api/User/:id", (req, res) => {
    res.json({ message: "User deleted successfully" });
  });

  // Department management
  app.get("/api/Department", (req, res) => {
    res.json([
      { id: 1, name: "Engineering", description: "Software Development" },
      { id: 2, name: "Human Resources", description: "HR Management" },
      { id: 3, name: "Finance", description: "Financial Operations" },
      { id: 4, name: "Marketing", description: "Marketing & Sales" }
    ]);
  });

  // Title management
  app.get("/api/Title", (req, res) => {
    res.json([
      { id: 1, name: "Software Engineer", department: "Engineering" },
      { id: 2, name: "HR Manager", department: "Human Resources" },
      { id: 3, name: "Financial Analyst", department: "Finance" },
      { id: 4, name: "Marketing Specialist", department: "Marketing" }
    ]);
  });

  // Role management
  app.get("/api/Role", (req, res) => {
    res.json([
      { id: 1, name: "Super Admin", permissions: ["*"] },
      { id: 2, name: "HR Manager", permissions: ["users", "attendance", "leave"] },
      { id: 3, name: "Team Leader", permissions: ["attendance", "missions"] },
      { id: 4, name: "General Manager", permissions: ["users", "attendance", "leave", "missions", "policies"] }
    ]);
  });

  // Attendance management
  app.get("/api/Attendance", (req, res) => {
    res.json([
      {
        id: 1,
        employeeId: 1,
        date: new Date().toISOString(),
        checkIn: "09:00:00",
        checkOut: "17:30:00",
        status: "present",
        workingHours: "8.5",
        overtimeHours: "0.5",
        approvedBy: null,
        approvedAt: null,
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        employeeId: 2,
        date: new Date().toISOString(),
        checkIn: "09:15:00",
        checkOut: "17:00:00",
        status: "late",
        workingHours: "7.75",
        overtimeHours: "0",
        approvedBy: null,
        approvedAt: null,
        createdAt: new Date().toISOString()
      }
    ]);
  });

  app.post("/api/Attendance", (req, res) => {
    const attendance = { 
      id: Date.now(), 
      ...req.body, 
      createdAt: new Date().toISOString() 
    };
    res.json(attendance);
  });

  // Leave requests
  app.get("/api/LeaveRequests", (req, res) => {
    res.json([
      {
        id: 1,
        employeeId: 1,
        type: "vacation",
        startDate: "2024-01-15",
        endDate: "2024-01-20",
        reason: "Family vacation",
        status: "pending",
        approvedBy: null,
        comments: null,
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        employeeId: 2,
        type: "sick",
        startDate: "2024-01-10",
        endDate: "2024-01-12",
        reason: "Medical appointment",
        status: "approved",
        approvedBy: 3,
        comments: "Approved",
        createdAt: new Date().toISOString()
      }
    ]);
  });

  app.post("/api/LeaveRequests", (req, res) => {
    const leaveRequest = { 
      id: Date.now(), 
      ...req.body, 
      status: "pending",
      createdAt: new Date().toISOString() 
    };
    res.json(leaveRequest);
  });

  // Missions
  app.get("/api/Mission", (req, res) => {
    res.json([
      {
        id: 1,
        title: "Client Meeting in Dubai",
        description: "Quarterly business review with key client",
        startDate: "2024-01-20",
        endDate: "2024-01-25",
        assignedTo: 1,
        location: "Dubai, UAE",
        priority: "high",
        status: "in_progress",
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        title: "Training Workshop",
        description: "Technical training for new framework",
        startDate: "2024-01-30",
        endDate: "2024-02-02",
        assignedTo: 2,
        location: "London, UK",
        priority: "medium",
        status: "pending",
        createdAt: new Date().toISOString()
      }
    ]);
  });

  app.post("/api/Mission", (req, res) => {
    const mission = { 
      id: Date.now(), 
      ...req.body, 
      status: "pending",
      createdAt: new Date().toISOString() 
    };
    res.json(mission);
  });

  // Policies
  app.get("/api/Policy", (req, res) => {
    res.json([
      {
        id: 1,
        title: "Remote Work Policy",
        description: "Guidelines for remote work arrangements",
        category: "Work Arrangements",
        effectiveDate: "2024-01-01",
        status: "active",
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        title: "Leave Policy",
        description: "Annual leave and sick leave procedures",
        category: "Time Off",
        effectiveDate: "2024-01-01", 
        status: "active",
        createdAt: new Date().toISOString()
      }
    ]);
  });

  app.post("/api/Policy", (req, res) => {
    const policy = { 
      id: Date.now(), 
      ...req.body, 
      status: "active",
      createdAt: new Date().toISOString() 
    };
    res.json(policy);
  });

  // Role endpoints - using existing structure
  app.get("/api/Role", (req, res) => {
    res.json([
      {
        id: 1,
        name: "Super Admin",
        description: "Full system access and administration",
        permissions: ["*"],
        userCount: 1
      },
      {
        id: 2, 
        name: "HR Manager",
        description: "Human resources management and employee relations",
        permissions: ["users", "attendance", "leave"],
        userCount: 3
      },
      {
        id: 3,
        name: "Team Leader", 
        description: "Lead and coordinate team activities",
        permissions: ["attendance", "missions"],
        userCount: 8
      },
      {
        id: 4,
        name: "General Manager",
        description: "Overall management and strategic decisions",
        permissions: ["users", "attendance", "leave", "missions", "policies"],
        userCount: 2
      }
    ]);
  });

  app.post("/api/Role", (req, res) => {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({
        errors: {
          Name: ["The Name field is required."]
        },
        type: "https://tools.ietf.org/html/rfc9110#section-15.5.1", 
        title: "One or more validation errors occurred.",
        status: 400
      });
    }

    const newRole = {
      id: Date.now().toString(),
      name,
      description: description || "",
      userCount: 0,
      createdAt: new Date().toISOString()
    };
    res.json(newRole);
  });

  app.put("/api/Role/:id", (req, res) => {
    res.json({ id: req.params.id, ...req.body });
  });

  app.delete("/api/Role/:id", (req, res) => {
    res.json({ message: "Role deleted successfully" });
  });

  // Role assignment endpoint
  app.post("/api/Role/:roleId/assign/:userId", (req, res) => {
    res.json({ 
      message: "Role assigned successfully",
      roleId: req.params.roleId,
      userId: req.params.userId
    });
  });

  // Department endpoints
  app.post("/api/Department", (req, res) => {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({
        errors: {
          Name: ["The Name field is required."]
        },
        type: "https://tools.ietf.org/html/rfc9110#section-15.5.1", 
        title: "One or more validation errors occurred.",
        status: 400
      });
    }

    const newDepartment = {
      id: Date.now(),
      name,
      description: description || "",
      employeeCount: 0,
      createdAt: new Date().toISOString()
    };
    res.json(newDepartment);
  });

  app.put("/api/Department/:id", (req, res) => {
    res.json({ id: req.params.id, ...req.body });
  });

  app.delete("/api/Department/:id", (req, res) => {
    res.json({ message: "Department deleted successfully" });
  });

  // Dashboard endpoints
  app.get("/api/Dashboard/department-distribution", (req, res) => {
    res.json([
      { name: "Engineering", value: 12 },
      { name: "Human Resources", value: 8 },
      { name: "Finance", value: 6 },
      { name: "Marketing", value: 10 }
    ]);
  });

  app.get("/api/Dashboard/stats", (req, res) => {
    res.json({
      totalEmployees: 36,
      presentToday: 32,
      onLeave: 3,
      activeMissions: 5,
      attendanceRate: 88.9,
      pendingApprovals: 7,
      overtimeHours: 24
    });
  });

  app.get("/api/Dashboard/attendance-trends", (req, res) => {
    res.json([
      { date: "2024-01-08", present: 28, absent: 4 },
      { date: "2024-01-09", present: 30, absent: 2 },
      { date: "2024-01-10", present: 29, absent: 3 },
      { date: "2024-01-11", present: 32, absent: 0 },
      { date: "2024-01-12", present: 31, absent: 1 }
    ]);
  });

  const httpServer = createServer(app);
  return httpServer;
}
