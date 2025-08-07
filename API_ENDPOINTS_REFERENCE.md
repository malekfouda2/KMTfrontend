# KMT Backend API Endpoints Reference

This document provides a comprehensive reference for all KMT Backend API endpoints used in the HR Management System.

## Base Configuration

**Base URL:** `https://5daadc7b4a4d.ngrok-free.app`

**Required Headers:**
```javascript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer <jwt_token>',
  'ngrok-skip-browser-warning': 'true'
}
```

**Standard Response Format:**
```typescript
interface KMTResponse<T> {
  data: T;
  message: string;
  success: boolean;
}
```

---

## Authentication Endpoints

### Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "data": {
    "token": "jwt_token_string",
    "user": {
      "id": "string",
      "username": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "role": "string"
    }
  },
  "message": "Login successful",
  "success": true
}
```

### Token Refresh
**POST** `/auth/refresh`

**Request Body:**
```json
{
  "refreshToken": "string"
}
```

### Logout
**POST** `/auth/logout`

**Request Headers:** Authorization required

---

## Employee Management

### Get All Employees
**GET** `/employees`

**Query Parameters:**
- `page`: number (optional)
- `limit`: number (optional)
- `search`: string (optional)
- `department`: string (optional)
- `status`: string (optional)

**Response:**
```json
{
  "data": [
    {
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "phoneNumber": "string",
      "department": "string",
      "departmentName": "string",
      "title": "string",
      "titleName": "string",
      "role": "string",
      "roleName": "string",
      "hireDate": "2024-01-01",
      "status": "Active|Inactive",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "message": "Employees retrieved successfully",
  "success": true
}
```

### Get Employee by ID
**GET** `/employees/{id}`

### Create Employee
**POST** `/employees`

**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phoneNumber": "string",
  "username": "string",
  "password": "string",
  "departmentId": "string",
  "titleId": "string",
  "roleId": "string",
  "hireDate": "2024-01-01",
  "status": "Active"
}
```

### Update Employee
**PUT** `/employees/{id}`

**Request Body:** Same as create employee (all fields optional)

### Delete Employee
**DELETE** `/employees/{id}`

---

## Department Management

### Get All Departments
**GET** `/departments`

**Response:**
```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "nameAr": "string",
      "description": "string",
      "managerId": "string",
      "managerName": "string",
      "parentDepartmentId": "string",
      "employeeCount": 0,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "message": "Departments retrieved successfully",
  "success": true
}
```

### Create Department
**POST** `/departments`

**Request Body:**
```json
{
  "name": "string",
  "nameAr": "string",
  "description": "string",
  "managerId": "string",
  "parentDepartmentId": "string"
}
```

### Update Department
**PUT** `/departments/{id}`

### Delete Department
**DELETE** `/departments/{id}`

---

## Job Title Management

### Get All Titles
**GET** `/titles`

**Response:**
```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "nameAr": "string",
      "description": "string",
      "descriptionAr": "string",
      "employeeCount": 0,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "message": "Titles retrieved successfully",
  "success": true
}
```

### Create Title
**POST** `/titles`

**Request Body:**
```json
{
  "name": "string",
  "nameAr": "string",
  "description": "string",
  "descriptionAr": "string"
}
```

### Get Employees by Title
**GET** `/titles/{id}/employees`

**Response:**
```json
{
  "data": [
    {
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "department": "string",
      "hireDate": "2024-01-01"
    }
  ],
  "message": "Title employees retrieved successfully",
  "success": true
}
```

---

## Role Management

### Get All Roles
**GET** `/roles`

**Response:**
```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "permissions": ["permission1", "permission2"],
      "employeeCount": 0,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "message": "Roles retrieved successfully",
  "success": true
}
```

### Create Role
**POST** `/roles`

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "permissions": ["string"]
}
```

---

## Attendance Management

### Get Check-In/Out Records
**GET** `/checkinout`

**Query Parameters:**
- `employeeId`: string (optional)
- `date`: string (YYYY-MM-DD, optional)
- `startDate`: string (YYYY-MM-DD, optional)
- `endDate`: string (YYYY-MM-DD, optional)

**Response:**
```json
{
  "data": [
    {
      "id": "string",
      "employeeId": "string",
      "employeeName": "string",
      "checkInTime": "2024-01-01T09:00:00Z",
      "checkOutTime": "2024-01-01T17:00:00Z",
      "date": "2024-01-01",
      "totalHours": 8.0,
      "status": "Present|Absent|Late",
      "notes": "string"
    }
  ],
  "message": "Check-in/out records retrieved successfully",
  "success": true
}
```

### Create Check-In/Out Record
**POST** `/checkinout`

**Request Body:**
```json
{
  "employeeId": "string",
  "checkInTime": "2024-01-01T09:00:00Z",
  "checkOutTime": "2024-01-01T17:00:00Z",
  "date": "2024-01-01",
  "notes": "string"
}
```

### Update Check-In/Out Record
**PUT** `/checkinout/{id}`

---

## Overtime Management

### Get Overtime Records
**GET** `/overtime`

**Query Parameters:**
- `employeeId`: string (optional)
- `status`: string (optional)
- `startDate`: string (optional)
- `endDate`: string (optional)

**Response:**
```json
{
  "data": [
    {
      "id": "string",
      "employeeId": "string",
      "employeeName": "string",
      "date": "2024-01-01",
      "startTime": "18:00",
      "endTime": "20:00",
      "hours": 2.0,
      "reason": "string",
      "status": "Pending|Approved|Declined",
      "approvedBy": "string",
      "approvedAt": "2024-01-01T10:00:00Z",
      "createdAt": "2024-01-01T09:00:00Z"
    }
  ],
  "message": "Overtime records retrieved successfully",
  "success": true
}
```

### Create Overtime Request
**POST** `/overtime`

**Request Body:**
```json
{
  "employeeId": "string",
  "date": "2024-01-01",
  "startTime": "18:00",
  "endTime": "20:00",
  "reason": "string"
}
```

### Approve/Decline Overtime
**PUT** `/overtime/{id}/approve`
**PUT** `/overtime/{id}/decline`

**Request Body:**
```json
{
  "reason": "string" // Required for decline
}
```

---

## Late Arrival Management

### Get Late Arrival Records
**GET** `/latearrival`

**Response:**
```json
{
  "data": [
    {
      "id": "string",
      "employeeId": "string",
      "employeeName": "string",
      "date": "2024-01-01",
      "scheduledTime": "09:00",
      "actualTime": "09:30",
      "lateMinutes": 30,
      "reason": "string",
      "penalty": 50.0,
      "status": "Pending|Approved|Declined"
    }
  ],
  "message": "Late arrival records retrieved successfully",
  "success": true
}
```

---

## Leave Management

### Get Leave Requests
**GET** `/leaves`

**Query Parameters:**
- `employeeId`: string (optional)
- `status`: string (optional)
- `leaveType`: string (optional)
- `startDate`: string (optional)
- `endDate`: string (optional)

**Response:**
```json
{
  "data": [
    {
      "id": "string",
      "employeeId": "string",
      "employeeName": "string",
      "leaveTypeId": "string",
      "leaveTypeName": "string",
      "startDate": "2024-01-01",
      "endDate": "2024-01-05",
      "days": 5,
      "reason": "string",
      "status": "Pending|Approved|Declined",
      "approvedBy": "string",
      "approvedAt": "2024-01-01T10:00:00Z",
      "declineReason": "string",
      "createdAt": "2024-01-01T09:00:00Z"
    }
  ],
  "message": "Leave requests retrieved successfully",
  "success": true
}
```

### Create Leave Request
**POST** `/leaves`

**Request Body:**
```json
{
  "employeeId": "string",
  "leaveTypeId": "string",
  "startDate": "2024-01-01",
  "endDate": "2024-01-05",
  "reason": "string"
}
```

### Approve Leave
**PUT** `/leaves/{id}/approve`

### Decline Leave
**PUT** `/leaves/{id}/decline`

**Request Body:**
```json
{
  "reason": "string" // Decline reason (required)
}
```

### Get Leave Types
**GET** `/leavetypes`

**Response:**
```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "nameAr": "string",
      "description": "string",
      "descriptionAr": "string",
      "maxDays": 30,
      "isSeniorityBased": false,
      "allowCarryOver": true,
      "requireApproval": true
    }
  ],
  "message": "Leave types retrieved successfully",
  "success": true
}
```

### Get Leave Balances
**GET** `/leavebalances`

**Query Parameters:**
- `employeeId`: string (optional)
- `year`: number (optional)

**Response:**
```json
{
  "data": [
    {
      "id": "string",
      "employeeId": "string",
      "employeeName": "string",
      "leaveTypeId": "string",
      "leaveTypeName": "string",
      "totalDays": 30,
      "usedDays": 10,
      "remainingDays": 20,
      "year": 2024
    }
  ],
  "message": "Leave balances retrieved successfully",
  "success": true
}
```

---

## Mission Management

### Get Missions
**GET** `/missions`

**Query Parameters:**
- `employeeId`: string (optional)
- `status`: string (optional)
- `startDate`: string (optional)
- `endDate`: string (optional)

**Response:**
```json
{
  "data": [
    {
      "id": "string",
      "description": "string",
      "descriptionAr": "string",
      "location": "string",
      "locationAr": "string",
      "missionDate": "2024-01-01",
      "startTime": "09:00",
      "endTime": "17:00",
      "assignedTo": "string",
      "assignedToName": "string",
      "status": "Pending|In Progress|Completed|Cancelled",
      "priority": 1,
      "createdBy": "string",
      "createdAt": "2024-01-01T09:00:00Z"
    }
  ],
  "message": "Missions retrieved successfully",
  "success": true
}
```

### Create Mission
**POST** `/missions`

**Request Body:**
```json
{
  "description": "string",
  "descriptionAr": "string",
  "location": "string",
  "locationAr": "string",
  "missionDate": "2024-01-01",
  "startTime": "09:00",
  "endTime": "17:00",
  "assignedTo": "string",
  "priority": 1
}
```

### Update Mission Status
**PUT** `/missions/{id}`

**Request Body:**
```json
{
  "status": "In Progress|Completed|Cancelled",
  "notes": "string"
}
```

---

## Bonus Management

### Get Bonuses
**GET** `/bonuses`

**Query Parameters:**
- `employeeId`: string (optional)
- `applied`: boolean (optional)
- `type`: number (optional)

**Response:**
```json
{
  "data": [
    {
      "id": "string",
      "userId": "string",
      "userName": "string",
      "madeBy": "string",
      "madeByName": "string",
      "payrollId": "string",
      "value": 1000.0,
      "note": "string",
      "reason": "string",
      "type": 1,
      "applied": false,
      "createdAt": "2024-01-01T09:00:00Z"
    }
  ],
  "message": "Bonuses retrieved successfully",
  "success": true
}
```

### Create Bonus
**POST** `/bonuses`

**Request Body:**
```json
{
  "userId": "string",
  "value": 1000.0,
  "note": "string",
  "reason": "string",
  "type": 1
}
```

**Bonus Types:**
- 1: Performance Bonus
- 2: Holiday Bonus
- 3: Project Completion
- 4: Overtime Bonus
- 5: Special Recognition
- 6: Other

---

## Penalty Management

### Get Penalties
**GET** `/penalties`

**Query Parameters:**
- `employeeId`: string (optional)
- `applied`: boolean (optional)

**Response:**
```json
{
  "data": [
    {
      "id": "string",
      "userId": "string",
      "userName": "string",
      "madeBy": "string",
      "madeByName": "string",
      "payrollId": "string",
      "value": 100.0,
      "note": "string",
      "reason": "string",
      "applied": false,
      "createdAt": "2024-01-01T09:00:00Z"
    }
  ],
  "message": "Penalties retrieved successfully",
  "success": true
}
```

### Create Penalty
**POST** `/penalties`

**Request Body:**
```json
{
  "userId": "string",
  "value": 100.0,
  "note": "string",
  "reason": "string"
}
```

**Common Penalty Reasons:**
- Late Arrival
- Absence Without Leave
- Policy Violation
- Misconduct
- Other

---

## Payroll Management

### Get Payroll Records
**GET** `/payroll`

**Query Parameters:**
- `employeeId`: string (optional)
- `month`: number (optional)
- `year`: number (optional)

**Response:**
```json
{
  "data": [
    {
      "id": "string",
      "employeeId": "string",
      "employeeName": "string",
      "month": 1,
      "year": 2024,
      "baseSalary": 5000.0,
      "bonuses": 1000.0,
      "penalties": 100.0,
      "overtime": 500.0,
      "totalSalary": 6400.0,
      "status": "Pending|Processed|Paid",
      "processedAt": "2024-01-31T10:00:00Z"
    }
  ],
  "message": "Payroll records retrieved successfully",
  "success": true
}
```

### Process Payroll
**POST** `/payroll/process`

**Request Body:**
```json
{
  "employeeIds": ["string"],
  "month": 1,
  "year": 2024
}
```

---

## Policy Management

### Get Policies
**GET** `/policies`

**Response:**
```json
{
  "data": [
    {
      "id": "string",
      "title": "string",
      "titleAr": "string",
      "content": "string",
      "contentAr": "string",
      "category": "string",
      "version": "1.0",
      "effectiveDate": "2024-01-01",
      "createdBy": "string",
      "createdAt": "2024-01-01T09:00:00Z"
    }
  ],
  "message": "Policies retrieved successfully",
  "success": true
}
```

### Create Policy
**POST** `/policies`

**Request Body:**
```json
{
  "title": "string",
  "titleAr": "string",
  "content": "string",
  "contentAr": "string",
  "category": "string",
  "effectiveDate": "2024-01-01"
}
```

---

## Analytics & Reporting

### Get Dashboard Analytics
**GET** `/analytics/dashboard`

**Response:**
```json
{
  "data": {
    "totalEmployees": 150,
    "activeEmployees": 145,
    "totalDepartments": 12,
    "pendingLeaves": 25,
    "todayAttendance": 98.5,
    "overtimeHours": 120.5,
    "monthlyStats": {
      "newHires": 5,
      "leaveTaken": 85,
      "averageWorkingHours": 8.2
    }
  },
  "message": "Dashboard analytics retrieved successfully",
  "success": true
}
```

### Get Attendance Report
**GET** `/reports/attendance`

**Query Parameters:**
- `startDate`: string (required)
- `endDate`: string (required)
- `departmentId`: string (optional)
- `employeeId`: string (optional)

### Get Leave Report
**GET** `/reports/leaves`

**Query Parameters:**
- `startDate`: string (required)
- `endDate`: string (required)
- `status`: string (optional)
- `departmentId`: string (optional)

---

## Error Response Format

**Standard Error Response:**
```json
{
  "data": null,
  "message": "Error description",
  "success": false,
  "errors": {
    "field1": ["Validation error message"],
    "field2": ["Another validation error"]
  }
}
```

**HTTP Status Codes:**
- 200: Success
- 201: Created
- 400: Bad Request (validation errors)
- 401: Unauthorized (invalid/missing token)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 422: Unprocessable Entity (business logic errors)
- 500: Internal Server Error

---

## Authentication & Authorization

### Token Format
JWT tokens contain the following payload:
```json
{
  "sub": "user_id",
  "username": "string",
  "role": "string",
  "permissions": ["permission1", "permission2"],
  "exp": 1234567890,
  "iat": 1234567890
}
```

### Required Permissions
Different endpoints require different permissions:

- **Employee Management**: `employees.read`, `employees.write`, `employees.delete`
- **Attendance Management**: `attendance.read`, `attendance.write`
- **Leave Management**: `leaves.read`, `leaves.write`, `leaves.approve`
- **Mission Management**: `missions.read`, `missions.write`, `missions.assign`
- **Admin Operations**: `admin.departments`, `admin.roles`, `admin.policies`

---

## Rate Limiting

**Limits:**
- General endpoints: 100 requests per minute
- Authentication endpoints: 5 requests per minute
- File upload endpoints: 10 requests per minute

**Headers:**
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Requests remaining in current window
- `X-RateLimit-Reset`: Time when rate limit resets

---

## Testing Endpoints

### Health Check
**GET** `/health`

**Response:**
```json
{
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-01T09:00:00Z",
    "version": "1.0.0"
  },
  "message": "API is healthy",
  "success": true
}
```

### API Information
**GET** `/info`

**Response:**
```json
{
  "data": {
    "name": "KMT HR Management API",
    "version": "1.0.0",
    "description": "Comprehensive HR Management System API",
    "endpoints": 45,
    "lastUpdated": "2024-01-01"
  },
  "message": "API information retrieved",
  "success": true
}
```

---

**Last Updated:** January 2025
**API Version:** 1.0.0