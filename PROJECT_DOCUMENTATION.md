# HR Management System - Comprehensive Developer Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & Technology Stack](#architecture--technology-stack)
3. [Backend Integration](#backend-integration)
4. [Frontend Structure](#frontend-structure)
5. [Core Features & Implementation](#core-features--implementation)
6. [Authentication System](#authentication-system)
7. [API Integration Guide](#api-integration-guide)
8. [Database Schema & Types](#database-schema--types)
9. [UI Components & Styling](#ui-components--styling)
10. [State Management](#state-management)
11. [Form Handling](#form-handling)
12. [Routing & Navigation](#routing--navigation)
13. [Error Handling](#error-handling)
14. [Development Workflow](#development-workflow)
15. [Testing & Debugging](#testing--debugging)
16. [Deployment & Production](#deployment--production)
17. [Troubleshooting Guide](#troubleshooting-guide)
18. [Future Enhancements](#future-enhancements)

---

## Project Overview

This HR Management System is a comprehensive React.js-based web application designed for modern organizational management. The system integrates with the KMT backend API and provides a full suite of HR functionalities including employee management, attendance tracking, leave management, mission workflows, and administrative controls.

### Key Features
- **Employee Management**: Complete CRUD operations for employee data
- **Attendance System**: Check-in/out, overtime tracking, late arrival management
- **Leave Management**: Request/approval workflows, balance tracking, policy enforcement
- **Mission Management**: Assignment, tracking, and reporting with bilingual support
- **Administrative Tools**: Department, role, title, and policy management
- **Analytics Dashboard**: KPI tracking and comprehensive reporting
- **Mobile-Responsive Design**: Optimized for all device sizes
- **Role-Based Access Control**: Granular permission system

---

## Architecture & Technology Stack

### Frontend Stack
```
React.js 18+ with TypeScript
├── Build Tool: Vite
├── UI Framework: Shadcn/ui + Radix UI primitives
├── Styling: Tailwind CSS
├── State Management: TanStack Query (React Query)
├── Routing: Wouter
├── Form Handling: React Hook Form + Zod validation
├── Date Handling: date-fns
├── Charts: Recharts
└── Icons: Lucide React + React Icons
```

### Backend Integration
```
Primary: KMT Backend API (External)
├── Base URL: https://5daadc7b4a4d.ngrok-free.app
├── Authentication: JWT Token-based
├── Response Format: { data: [...], message: "...", success: true }
├── Headers: Includes ngrok-skip-browser-warning
└── Fallback: Local Express.js server for development
```

### Development Tools
```
TypeScript for type safety
├── Drizzle ORM for local database operations
├── Express.js for development server
├── PostgreSQL 16 for local storage
└── ESBuild for fast compilation
```

---

## Backend Integration

### KMT API Client (`client/src/lib/kmt-api.ts`)

The project uses a dedicated API client for all backend communications:

```typescript
// Core API client structure
export const kmtApiClient = {
  get: (endpoint: string) => Promise<any>,
  post: (endpoint: string, data: any) => Promise<any>,
  put: (endpoint: string, data: any) => Promise<any>,
  delete: (endpoint: string) => Promise<any>
}
```

### Key API Endpoints

#### Authentication
- `POST /auth/login` - User authentication
- `POST /auth/refresh` - Token refresh
- `POST /auth/logout` - User logout

#### Employee Management
- `GET /employees` - Fetch all employees
- `POST /employees` - Create new employee
- `PUT /employees/{id}` - Update employee
- `DELETE /employees/{id}` - Delete employee

#### Attendance Management
- `GET /checkinout` - Fetch attendance records
- `POST /checkinout` - Create check-in/out record
- `GET /overtime` - Fetch overtime records
- `POST /overtime` - Create overtime request

#### Leave Management
- `GET /leaves` - Fetch leave requests
- `POST /leaves` - Create leave request
- `PUT /leaves/{id}/approve` - Approve leave
- `PUT /leaves/{id}/decline` - Decline leave
- `GET /leavebalances` - Fetch leave balances
- `GET /leavetypes` - Fetch leave types

#### Mission Management
- `GET /missions` - Fetch missions
- `POST /missions` - Create mission
- `PUT /missions/{id}` - Update mission status

#### Administrative
- `GET /departments` - Fetch departments
- `POST /departments` - Create department
- `GET /roles` - Fetch roles
- `GET /titles` - Fetch job titles
- `POST /titles` - Create job title

### Response Format
All KMT API responses follow this structure:
```typescript
interface KMTResponse<T> {
  data: T;
  message: string;
  success: boolean;
}
```

### Error Handling
The API client includes comprehensive error handling:
- Network errors
- Authentication failures
- Validation errors
- Server errors
- Timeout handling

---

## Frontend Structure

### Directory Organization
```
client/src/
├── components/
│   ├── layout/           # Layout components (MainLayout, Sidebar)
│   ├── ui/              # Shadcn UI components
│   └── common/          # Reusable components
├── pages/               # Route components
│   ├── dashboard.tsx    # Main dashboard
│   ├── employees.tsx    # Employee management
│   ├── attendance.tsx   # Attendance tracking
│   ├── leave.tsx        # Leave management
│   ├── missions.tsx     # Mission management
│   ├── departments.tsx  # Department management
│   ├── roles.tsx        # Role management
│   ├── titles.tsx       # Job title management
│   ├── analytics.tsx    # Analytics dashboard
│   └── ...
├── lib/                 # Utility functions and configurations
│   ├── api.ts          # Local API utilities
│   ├── auth.ts         # Authentication utilities
│   ├── kmt-api.ts      # KMT API client
│   ├── queryClient.ts  # TanStack Query configuration
│   └── utils.ts        # General utilities
├── types/              # TypeScript type definitions
├── hooks/              # Custom React hooks
├── App.tsx            # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles
```

### Main Layout Component (`components/layout/MainLayout.tsx`)
The application uses a consistent layout structure:
- **Responsive sidebar navigation**
- **Header with user info and logout**
- **Breadcrumb navigation**
- **Mobile-optimized hamburger menu**
- **Dark/light theme support**

---

## Core Features & Implementation

### 1. Employee Management (`pages/employees.tsx`)

**Key Features:**
- Complete CRUD operations
- Advanced search and filtering
- Role assignment
- Department assignment
- Profile management
- Bulk operations

**Implementation Details:**
```typescript
// Employee data structure
interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  department: string;
  title: string;
  role: string;
  hireDate: string;
  status: 'Active' | 'Inactive';
}

// Key functions
const { data: employees, isLoading } = useQuery({
  queryKey: ['/api/employees'],
  enabled: !!authToken
});
```

### 2. Attendance System

**Components:**
- `check-in-out.tsx` - Daily attendance tracking
- `attendance.tsx` - Attendance overview and management
- `overtime.tsx` - Overtime request and approval
- `late-arrival.tsx` - Late arrival tracking

**Key Features:**
- Real-time check-in/out
- Overtime calculation
- Late arrival penalties
- Attendance analytics
- Approval workflows

### 3. Leave Management (`pages/leave.tsx`)

**Features:**
- Leave request submission
- Multi-level approval workflow
- Leave balance tracking
- Policy enforcement
- Leave type management
- Calendar integration

**Critical Implementation:**
```typescript
// Leave request structure
interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Declined';
  approvedBy?: string;
  declineReason?: string;
}

// Decline functionality with reason
const handleDeclineLeave = async (leaveId: string, reason: string) => {
  await kmtApiClient.put(`/leaves/${leaveId}/decline`, { reason });
  queryClient.invalidateQueries({ queryKey: ['/api/leaves'] });
};
```

### 4. Mission Management (`pages/missions.tsx`)

**Features:**
- Mission assignment
- Progress tracking
- Bilingual support (Arabic/English)
- Status management
- Reporting and analytics

**Bilingual Structure:**
```typescript
interface Mission {
  id: string;
  description: string;
  descriptionAr: string;
  location: string;
  locationAr: string;
  missionDate: string;
  status: string;
  priority: number;
  assignedTo: string;
}
```

### 5. Administrative Features

#### Department Management (`pages/departments.tsx`)
- Hierarchical department structure
- Employee assignments
- Budget tracking
- Manager assignments

#### Role Management (`pages/roles.tsx`)
- Permission-based access control
- Role hierarchy
- Feature-level permissions
- User role assignments

#### Job Title Management (`pages/titles.tsx`)
- Bilingual title support
- Employee count tracking
- View assigned employees
- CRUD operations

---

## Authentication System

### JWT Token Management (`lib/auth.ts`)

The authentication system handles:
- Token storage in localStorage
- Automatic token refresh
- Role-based access control
- Session management
- Secure logout

```typescript
// Authentication utilities
export const authUtils = {
  getToken: () => localStorage.getItem('authToken'),
  setToken: (token: string) => localStorage.setItem('authToken', token),
  removeToken: () => localStorage.removeItem('authToken'),
  isAuthenticated: () => !!authUtils.getToken(),
  getUserRole: () => JSON.parse(localStorage.getItem('userRole') || '{}')
};
```

### Login Flow
1. User submits credentials
2. API validates and returns JWT token
3. Token stored in localStorage
4. User redirected to dashboard
5. Token included in all subsequent requests

### Protected Routes
Routes are protected using authentication checks:
```typescript
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authUtils.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};
```

---

## API Integration Guide

### Using the KMT API Client

**Basic Usage:**
```typescript
import { kmtApiClient } from '@/lib/kmt-api';

// GET request
const employees = await kmtApiClient.get('/employees');

// POST request
const newEmployee = await kmtApiClient.post('/employees', employeeData);

// PUT request
const updatedEmployee = await kmtApiClient.put(`/employees/${id}`, updateData);

// DELETE request
await kmtApiClient.delete(`/employees/${id}`);
```

**With TanStack Query:**
```typescript
// Fetch data
const { data, isLoading, error } = useQuery({
  queryKey: ['/api/employees'],
  enabled: !!authToken
});

// Mutations
const createEmployeeMutation = useMutation({
  mutationFn: (data) => kmtApiClient.post('/employees', data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['/api/employees'] });
    toast({ title: "Employee created successfully" });
  }
});
```

### Error Handling Patterns

```typescript
try {
  const response = await kmtApiClient.get('/employees');
  if (response.success) {
    return response.data;
  } else {
    throw new Error(response.message);
  }
} catch (error) {
  console.error('API Error:', error);
  toast({
    title: "Error",
    description: error.message || "Something went wrong",
    variant: "destructive"
  });
}
```

---

## Database Schema & Types

### Core Type Definitions (`shared/schema.ts`)

```typescript
// User/Employee types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phoneNumber?: string;
  department?: string;
  title?: string;
  role?: string;
  status: 'Active' | 'Inactive';
  hireDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Leave types
export interface LeaveType {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  isSeniorityBased: boolean;
  allowCarryOver: boolean;
}

// Department types
export interface Department {
  id: string;
  name: string;
  nameAr: string;
  description?: string;
  managerId?: string;
  parentDepartmentId?: string;
  createdAt: string;
}

// Role types
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: string;
}
```

### Validation Schemas (Zod)

```typescript
import { z } from 'zod';

export const employeeCreateSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format"),
  phoneNumber: z.string().optional(),
  departmentId: z.string().optional(),
  titleId: z.string().optional(),
  roleId: z.string().optional()
});

export const leaveRequestSchema = z.object({
  leaveTypeId: z.string().min(1, "Leave type is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  reason: z.string().min(10, "Reason must be at least 10 characters")
});
```

---

## UI Components & Styling

### Shadcn/ui Components
The project uses a comprehensive set of pre-built, accessible UI components:

**Core Components:**
- `Button` - Various styles and sizes
- `Input` - Form input fields
- `Select` - Dropdown selections
- `Dialog` - Modal dialogs
- `Table` - Data tables
- `Card` - Content containers
- `Badge` - Status indicators
- `Textarea` - Multi-line text input
- `Checkbox` - Boolean inputs
- `Switch` - Toggle controls

**Usage Example:**
```typescript
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

<Card>
  <CardHeader>
    <CardTitle>Employee Details</CardTitle>
  </CardHeader>
  <CardContent>
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edit Employee</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Employee</DialogTitle>
        </DialogHeader>
        {/* Form content */}
      </DialogContent>
    </Dialog>
  </CardContent>
</Card>
```

### Tailwind CSS Configuration

**Custom Theme (`tailwind.config.ts`):**
```typescript
export default {
  darkMode: ["class"],
  content: ["./client/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // ... additional color definitions
      }
    }
  }
}
```

### Responsive Design Patterns

**Mobile-First Approach:**
```css
/* Mobile styles (default) */
.container { padding: 1rem; }

/* Tablet styles */
@media (min-width: 768px) {
  .container { padding: 2rem; }
}

/* Desktop styles */
@media (min-width: 1024px) {
  .container { padding: 3rem; }
}
```

**Tailwind Classes:**
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card className="p-4 sm:p-6">
    <h3 className="text-lg sm:text-xl font-semibold">Title</h3>
  </Card>
</div>
```

---

## State Management

### TanStack Query Configuration (`lib/queryClient.ts`)

```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false,
      queryFn: async ({ queryKey }) => {
        const response = await fetch(queryKey[0], {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          }
        });
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        return response.json();
      }
    },
    mutations: {
      retry: 1
    }
  }
});
```

### Query Patterns

**Data Fetching:**
```typescript
// Basic query
const { data: employees, isLoading, error } = useQuery({
  queryKey: ['/api/employees'],
  enabled: !!authToken
});

// Dependent query
const { data: employee } = useQuery({
  queryKey: ['/api/employees', employeeId],
  enabled: !!employeeId
});

// Parameterized query
const { data: filteredData } = useQuery({
  queryKey: ['/api/leaves', { status, department }],
  enabled: !!(status || department)
});
```

**Mutations:**
```typescript
const createEmployeeMutation = useMutation({
  mutationFn: (employeeData) => kmtApiClient.post('/employees', employeeData),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['/api/employees'] });
    toast({ title: "Employee created successfully" });
  },
  onError: (error) => {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive"
    });
  }
});
```

### Cache Management

**Invalidation Strategies:**
```typescript
// Invalidate specific query
queryClient.invalidateQueries({ queryKey: ['/api/employees'] });

// Invalidate multiple related queries
queryClient.invalidateQueries({ queryKey: ['/api/employees'] });
queryClient.invalidateQueries({ queryKey: ['/api/departments'] });

// Optimistic updates
queryClient.setQueryData(['/api/employees'], (oldData) => {
  return [...oldData, newEmployee];
});
```

---

## Form Handling

### React Hook Form + Zod Integration

**Form Setup:**
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
});

type FormData = z.infer<typeof formSchema>;

export default function EmployeeForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    }
  });

  const onSubmit = async (data: FormData) => {
    try {
      await kmtApiClient.post('/employees', data);
      toast({ title: "Employee created successfully" });
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="firstName">First Name</Label>
        <Input
          {...form.register("firstName")}
          placeholder="Enter first name"
        />
        {form.formState.errors.firstName && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.firstName.message}
          </p>
        )}
      </div>
      
      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Creating..." : "Create Employee"}
      </Button>
    </form>
  );
}
```

### Complex Form Patterns

**Multi-step Forms:**
```typescript
const [currentStep, setCurrentStep] = useState(1);
const [formData, setFormData] = useState({});

const handleNextStep = async (stepData) => {
  setFormData(prev => ({ ...prev, ...stepData }));
  setCurrentStep(prev => prev + 1);
};

const handleSubmit = async () => {
  await kmtApiClient.post('/employees', formData);
};
```

**Dynamic Form Fields:**
```typescript
const { fields, append, remove } = useFieldArray({
  control: form.control,
  name: "skills"
});

<div>
  {fields.map((field, index) => (
    <div key={field.id} className="flex gap-2">
      <Input {...form.register(`skills.${index}.name`)} />
      <Button type="button" onClick={() => remove(index)}>
        Remove
      </Button>
    </div>
  ))}
  <Button type="button" onClick={() => append({ name: "" })}>
    Add Skill
  </Button>
</div>
```

---

## Routing & Navigation

### Wouter Router Configuration

**Main App Router (`App.tsx`):**
```typescript
import { Route, Switch, Redirect } from 'wouter';

function App() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/" component={Dashboard} />
      <Route path="/employees" component={Employees} />
      <Route path="/attendance" component={Attendance} />
      <Route path="/leave" component={Leave} />
      <Route path="/missions" component={Missions} />
      <Route path="/departments" component={Departments} />
      <Route path="/roles" component={Roles} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/:rest*" component={NotFound} />
    </Switch>
  );
}
```

**Navigation Component:**
```typescript
import { Link, useLocation } from 'wouter';

const Navigation = () => {
  const [location] = useLocation();
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: HomeIcon },
    { path: '/employees', label: 'Employees', icon: UsersIcon },
    { path: '/attendance', label: 'Attendance', icon: ClockIcon },
    // ... more items
  ];

  return (
    <nav className="space-y-2">
      {navItems.map(item => (
        <Link key={item.path} href={item.path}>
          <a className={`flex items-center space-x-2 p-2 rounded-lg ${
            location === item.path 
              ? 'bg-primary text-primary-foreground' 
              : 'hover:bg-accent'
          }`}>
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </a>
        </Link>
      ))}
    </nav>
  );
};
```

**Programmatic Navigation:**
```typescript
import { useLocation } from 'wouter';

const [, navigate] = useLocation();

const handleSubmit = async (data) => {
  await createEmployee(data);
  navigate('/employees');
};
```

---

## Error Handling

### Global Error Boundaries

**Error Boundary Component:**
```typescript
import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Something went wrong
            </h1>
            <p className="text-gray-600 mt-2">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <Button 
              onClick={() => window.location.reload()}
              className="mt-4"
            >
              Reload Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### API Error Handling

**Centralized Error Handler:**
```typescript
export const handleApiError = (error: any) => {
  let message = 'An unexpected error occurred';
  
  if (error.response) {
    // Server responded with error status
    message = error.response.data.message || `Error: ${error.response.status}`;
  } else if (error.request) {
    // Network error
    message = 'Network error. Please check your connection.';
  } else if (error.message) {
    message = error.message;
  }
  
  toast({
    title: "Error",
    description: message,
    variant: "destructive"
  });
  
  console.error('API Error:', error);
};
```

### Form Error Handling

**Field-level Validation:**
```typescript
const validateField = (value: string, field: string) => {
  const errors: string[] = [];
  
  if (!value.trim()) {
    errors.push(`${field} is required`);
  }
  
  if (field === 'email' && !isValidEmail(value)) {
    errors.push('Invalid email format');
  }
  
  return errors;
};

// In component
{form.formState.errors.email && (
  <p className="text-red-500 text-sm">
    {form.formState.errors.email.message}
  </p>
)}
```

---

## Development Workflow

### Getting Started

1. **Clone and Install:**
   ```bash
   git clone [repository-url]
   cd hr-management-system
   npm install
   ```

2. **Environment Setup:**
   ```bash
   # Create .env file
   VITE_KMT_API_URL=https://5daadc7b4a4d.ngrok-free.app
   DATABASE_URL=postgresql://user:password@localhost:5432/hrms
   ```

3. **Database Setup:**
   ```bash
   # Generate database schema
   npm run db:generate
   
   # Push to database
   npm run db:push
   ```

4. **Start Development Server:**
   ```bash
   npm run dev
   ```

### Code Organization Best Practices

**File Naming Conventions:**
- Components: PascalCase (`EmployeeCard.tsx`)
- Pages: kebab-case (`employee-details.tsx`)
- Utilities: camelCase (`userUtils.ts`)
- Types: PascalCase (`UserTypes.ts`)

**Import Organization:**
```typescript
// React and third-party imports
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

// Internal imports (by directory)
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { kmtApiClient } from '@/lib/kmt-api';
import { Employee } from '@/types/employee';

// Relative imports
import './EmployeePage.css';
```

**Component Structure:**
```typescript
// 1. Imports
// 2. Types/Interfaces
// 3. Constants
// 4. Main component
// 5. Sub-components (if any)
// 6. Export

interface EmployeePageProps {
  employeeId?: string;
}

const ITEMS_PER_PAGE = 10;

export default function EmployeePage({ employeeId }: EmployeePageProps) {
  // Hooks
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading } = useQuery(/* ... */);
  
  // Event handlers
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };
  
  // Render
  return (
    <MainLayout>
      {/* Component JSX */}
    </MainLayout>
  );
}
```

### Git Workflow

**Branch Naming:**
- Feature: `feature/employee-management`
- Bug fix: `fix/login-validation`
- Hotfix: `hotfix/security-patch`

**Commit Messages:**
```
feat: add employee search functionality
fix: resolve authentication token expiry issue
docs: update API documentation
refactor: optimize employee data fetching
```

---

## Testing & Debugging

### Debugging Tools

**Console Logging:**
```typescript
// Structured logging
const debugLog = (component: string, action: string, data?: any) => {
  console.log(`[${component}] ${action}:`, data);
};

// Usage
debugLog('EmployeePage', 'User search', { term: searchTerm });
```

**React Query DevTools:**
```typescript
// Add to main.tsx in development
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <>
      <QueryClient>
        {/* App content */}
      </QueryClient>
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </>
  );
}
```

### Common Issues & Solutions

**User Display Problems:**
The `getUserDisplayName` utility handles inconsistent user data:
```typescript
export const getUserDisplayName = (user: any): string => {
  console.log('getUserDisplayName input:', user);
  
  if (!user) return 'Unknown User';
  
  // Try different field combinations
  if (user.name) return user.name;
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  if (user.firstName) return user.firstName;
  if (user.lastName) return user.lastName;
  if (user.username) return user.username;
  if (user.email) return user.email;
  
  return 'Unknown User';
};
```

**API Connection Issues:**
```typescript
// Check API connectivity
const testConnection = async () => {
  try {
    const response = await kmtApiClient.get('/health');
    console.log('API connection successful:', response);
  } catch (error) {
    console.error('API connection failed:', error);
  }
};
```

**Authentication Debugging:**
```typescript
// Token validation
const debugAuth = () => {
  const token = localStorage.getItem('authToken');
  console.log('Auth token:', token ? 'Present' : 'Missing');
  
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Token payload:', payload);
      console.log('Token expires:', new Date(payload.exp * 1000));
    } catch (e) {
      console.error('Invalid token format');
    }
  }
};
```

---

## Deployment & Production

### Build Process

**Production Build:**
```bash
npm run build
```

**Environment Variables:**
```env
# Production environment
NODE_ENV=production
VITE_KMT_API_URL=https://your-api-domain.com
DATABASE_URL=postgresql://prod_user:password@db-host:5432/hrms_prod
```

### Performance Optimization

**Code Splitting:**
```typescript
// Lazy loading for routes
const EmployeePage = lazy(() => import('./pages/employees'));
const DashboardPage = lazy(() => import('./pages/dashboard'));

// Wrap with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Route path="/employees" component={EmployeePage} />
</Suspense>
```

**Query Optimization:**
```typescript
// Prefetch related data
const prefetchEmployeeData = async (employeeId: string) => {
  await queryClient.prefetchQuery({
    queryKey: ['/api/employees', employeeId],
    staleTime: 10 * 1000
  });
};
```

### Security Considerations

**Token Security:**
- Store tokens in httpOnly cookies for production
- Implement token refresh mechanism
- Use HTTPS in production
- Validate all user inputs

**API Security:**
- Implement rate limiting
- Use CORS properly
- Validate request origins
- Sanitize all inputs

---

## Troubleshooting Guide

### Common Issues

**1. "Unknown User" Display**
- **Cause:** Inconsistent user data structure from API
- **Solution:** Use `getUserDisplayName` utility function
- **Prevention:** Standardize API response format

**2. Authentication Failures**
- **Cause:** Expired tokens or invalid credentials
- **Solution:** Check token validity and refresh mechanism
- **Debug:** Use browser dev tools to inspect network requests

**3. Data Not Loading**
- **Cause:** API endpoint changes or network issues
- **Solution:** Verify API endpoints and authentication
- **Debug:** Check browser console for error messages

**4. Form Submission Errors**
- **Cause:** Validation failures or missing required fields
- **Solution:** Check form validation rules and error handling
- **Debug:** Log form state and errors

### Performance Issues

**Slow Loading:**
- Check network tab for slow API calls
- Implement proper loading states
- Consider data pagination
- Optimize query keys for caching

**Memory Leaks:**
- Clean up useEffect dependencies
- Cancel pending requests on component unmount
- Properly invalidate queries

### API Integration Issues

**CORS Errors:**
- Ensure proper headers in requests
- Verify API server CORS configuration
- Use `ngrok-skip-browser-warning` header

**Response Format Issues:**
- Validate API response structure
- Handle different response formats
- Implement proper error parsing

---

## Future Enhancements

### Planned Features
1. **Advanced Reporting**
   - Custom report builder
   - Export to PDF/Excel
   - Scheduled reports

2. **Mobile App**
   - React Native implementation
   - Push notifications
   - Offline support

3. **Integration Enhancements**
   - LDAP/Active Directory integration
   - Third-party calendar sync
   - Payroll system integration

4. **Advanced Analytics**
   - Predictive analytics
   - Machine learning insights
   - Custom dashboards

### Technical Improvements
1. **Testing Suite**
   - Unit tests with Jest
   - Integration tests
   - E2E testing with Cypress

2. **Performance**
   - Service Worker implementation
   - Advanced caching strategies
   - Bundle size optimization

3. **Accessibility**
   - WCAG 2.1 compliance
   - Screen reader optimization
   - Keyboard navigation

---

## Conclusion

This HR Management System provides a solid foundation for organizational management with modern web technologies. The modular architecture, comprehensive API integration, and responsive design make it suitable for various organizational needs.

**Key Strengths:**
- Robust authentication and authorization
- Comprehensive CRUD operations
- Mobile-responsive design
- Extensive error handling
- Modern development practices

**Development Guidelines:**
- Always test API integration thoroughly
- Maintain consistent code formatting
- Document any architectural changes
- Follow security best practices
- Keep dependencies updated

For additional support or questions, refer to the individual component documentation or contact the development team.

---

**Last Updated:** January 2025
**Version:** 1.0.0
**Maintainer:** HR Management System Development Team