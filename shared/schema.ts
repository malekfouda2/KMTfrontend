import { pgTable, text, serial, integer, boolean, timestamp, decimal, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(), // general_manager, hr_manager, team_leader
  department: text("department"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Employees table
export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  employeeType: text("employee_type").notNull(), // engineer, worker
  department: text("department").notNull(),
  position: text("position").notNull(),
  salary: decimal("salary", { precision: 10, scale: 2 }),
  startDate: timestamp("start_date").notNull(),
  managerId: integer("manager_id"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Attendance records
export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").notNull(),
  date: timestamp("date").notNull(),
  checkIn: timestamp("check_in"),
  checkOut: timestamp("check_out"),
  workingHours: decimal("working_hours", { precision: 4, scale: 2 }),
  overtimeHours: decimal("overtime_hours", { precision: 4, scale: 2 }),
  status: text("status").notNull(), // present, absent, late, approved, pending
  approvedBy: integer("approved_by"),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Leave requests
export const leaveRequests = pgTable("leave_requests", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").notNull(),
  leaveType: text("leave_type").notNull(), // vacation, sick, personal, emergency
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  days: integer("days").notNull(),
  reason: text("reason"),
  status: text("status").notNull(), // pending, approved, rejected
  approvedBy: integer("approved_by"),
  approvedAt: timestamp("approved_at"),
  comments: text("comments"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Missions
export const missions = pgTable("missions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  assignedTo: integer("assigned_to").notNull(),
  assignedBy: integer("assigned_by").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  location: text("location"),
  status: text("status").notNull(), // pending, approved, in_progress, completed, cancelled
  approvedBy: integer("approved_by"),
  approvedAt: timestamp("approved_at"),
  transportationDetails: text("transportation_details"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Policies
export const policies = pgTable("policies", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // overtime, vacation, deduction, bonus
  name: text("name").notNull(),
  description: text("description"),
  rules: text("rules").notNull(), // JSON string containing policy rules
  isActive: boolean("is_active").default(true),
  createdBy: integer("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Schema exports
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertEmployeeSchema = createInsertSchema(employees).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAttendanceSchema = createInsertSchema(attendance).omit({
  id: true,
  createdAt: true,
});

export const insertLeaveRequestSchema = createInsertSchema(leaveRequests).omit({
  id: true,
  createdAt: true,
});

export const insertMissionSchema = createInsertSchema(missions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPolicySchema = createInsertSchema(policies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;
export type Attendance = typeof attendance.$inferSelect;
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;
export type LeaveRequest = typeof leaveRequests.$inferSelect;
export type InsertLeaveRequest = z.infer<typeof insertLeaveRequestSchema>;
export type Mission = typeof missions.$inferSelect;
export type InsertMission = z.infer<typeof insertMissionSchema>;
export type Policy = typeof policies.$inferSelect;
export type InsertPolicy = z.infer<typeof insertPolicySchema>;

// Auth response type
export type AuthResponse = {
  token: string;
  user: User;
};

// Dashboard stats type
export type DashboardStats = {
  totalEmployees: number;
  presentToday: number;
  onLeave: number;
  activeMissions: number;
  attendanceRate: number;
  pendingApprovals: number;
  overtimeHours: number;
};
