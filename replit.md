# HR Management System - KMT Backend Integration

## Overview

This is a comprehensive HR Management System built with React.js frontend and integrated with the KMT backend. The application provides a modern, responsive interface for managing employees, attendance, leave requests, missions, departments, roles, and company policies. The system has been fully revised to ensure seamless compatibility with the KMT backend structure and API endpoints.

## System Architecture

### Frontend Architecture
- **Framework**: React.js with TypeScript
- **Build Tool**: Vite for development and bundling
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Integration
- **Primary Backend**: KMT Backend (http://localhost:5114/api)
- **Fallback**: Local Express.js server for development/mock data
- **Authentication**: JWT token-based authentication
- **API Response Format**: KMT-specific structure `{ data: [...], message: "...", success: true }`

## Key Components

### Authentication System
- JWT token-based authentication with automatic refresh
- Role-based access control (General Manager, HR Manager, Team Leader)
- Automatic redirection on authentication failures
- Token storage in localStorage with validation

### API Integration
- **KMT API Client**: Dedicated client for KMT backend communication
- **Response Handling**: Automatic extraction of data from nested KMT response format
- **Error Management**: Comprehensive error handling with 401 redirects
- **Endpoints**: All endpoints aligned with KMT structure (/User, /Department, /Role, etc.)

### Core Modules
1. **Employee Management**: User registration, profile management, role assignments
2. **Attendance Tracking**: Check-in/out, overtime calculation, approval workflows
3. **Leave Management**: Leave requests, approvals, policy enforcement
4. **Mission Management**: Assignment tracking, status updates, reporting
5. **Department Management**: Organization structure, employee assignments
6. **Role Management**: Permission-based access control
7. **Policy Management**: Company policy documentation and enforcement
8. **Analytics Dashboard**: KPI tracking and reporting

### UI/UX Features
- **Responsive Design**: Mobile-first approach with breakpoint optimization
- **Dark/Light Theme**: CSS custom properties for theme switching
- **Component Library**: Consistent design system with Shadcn/ui
- **Accessibility**: ARIA compliance and keyboard navigation support

## Data Flow

1. **Authentication Flow**:
   - User login → JWT token generation → Local storage → API authorization headers
   - Automatic token validation on app initialization
   - Role-based route protection and feature access

2. **API Communication**:
   - Frontend requests → KMT API Client → Backend endpoints
   - Response processing → Data extraction → Component state updates
   - Error handling → User feedback → Fallback behaviors

3. **State Management**:
   - Server state managed by TanStack Query with caching
   - Local component state for UI interactions
   - Form state handled by React Hook Form

## External Dependencies

### Production Dependencies
- **UI Framework**: React 18+ with TypeScript support
- **Component Library**: Radix UI primitives with Shadcn/ui wrappers
- **HTTP Client**: Fetch API with custom wrapper for KMT integration
- **Form Management**: React Hook Form with Zod schema validation
- **Styling**: Tailwind CSS with PostCSS processing
- **Charts**: Recharts for data visualization
- **Date Handling**: date-fns for date manipulation

### Development Dependencies
- **Build System**: Vite with React plugin
- **Database ORM**: Drizzle ORM with PostgreSQL support
- **Code Quality**: TypeScript compiler with strict mode
- **Development Server**: Express.js for local development

## Deployment Strategy

### Development Environment
- **Local Server**: `npm run dev` starts Vite development server
- **Hot Reload**: Automatic code reloading with HMR support
- **Mock Data**: Local Express server provides fallback data
- **Database**: PostgreSQL with Drizzle ORM migrations

### Production Build
- **Build Command**: `npm run build` creates optimized production bundle
- **Static Assets**: Generated in `dist/public` directory
- **Server**: Node.js Express server serves built application
- **Environment**: Replit deployment with autoscale configuration

### Configuration
- **Port Configuration**: 5000 (internal) → 80 (external)
- **Database**: PostgreSQL 16 with connection pooling
- **Environment Variables**: DATABASE_URL for database connection
- **Build Process**: Vite build + esbuild for server bundling

## Current Backend Integration Status

### Completed Fixes
- ✅ Fixed CreateUserRequest structure to match KMT backend
- ✅ Enhanced KMT API client with proper response structure handling
- ✅ Fixed Super Admin role permissions and navigation access
- ✅ Added search/filtering functionality for employees
- ✅ Updated leave management to use CreateLeaveRequestRequest format
- ✅ Fixed mission endpoints with proper CreateMissionRequest structure
- ✅ Implemented comprehensive roles permissions system
- ✅ Fixed React runtime errors in EmployeeTable component

### Mission System Enhancements
- ✅ Updated mission schema with all required fields (name, nameAr, description, descriptionAr, startDate, endDate, location, locationAr, status, priority)
- ✅ Implemented proper CreateMissionRequest mapping for KMT backend
- ✅ Added bilingual support for mission names and locations
- ✅ Status and priority management with predefined options

### Roles & Permissions System
- ✅ Complete permissions assignment functionality for roles
- ✅ Permission management modal with comprehensive permission types
- ✅ Role-based access control with granular permissions
- ✅ Permission categories: users, roles, departments, missions, attendance, leave, policies, analytics, system admin
- ✅ Visual permissions display with current role permissions

### Technical Fixes
- ✅ Employee form validation and department assignment (all CreateUserRequest fields)
- ✅ Leave types integration and form completion (CreateLeaveRequestRequest structure)
- ✅ Search parameters optimization (proper query parameter mapping)
- ✅ TimeSpan format handling for leave requests
- ✅ Gender enum mapping (1=Male, 2=Female)
- ✅ Fixed KMTUser type mapping to prevent React object rendering errors
- ✅ Mission creation fixed with exact KMT CreateMissionRequest DTO structure
- ✅ Permissions assignment implemented via role update endpoint with permissions array
- ✅ Enhanced permissions UI by replacing dropdown with floating buttons for better user experience and direct selection
- ✅ Added permission removal functionality with clickable current permissions and visual feedback
- ✅ Updated role assignment to use UserRole endpoint with correct POST body format (userId, roleIds array)
- ✅ Added comprehensive debugging for UserRole endpoint testing and data refresh issues
- ✅ Fixed employees page search and department/title filters with proper query parameters
- ✅ Implemented employee details modal with comprehensive personal and work information
- ✅ Removed policies tab from sidebar navigation
- ✅ Enhanced department details modal to display assigned employees with avatars and contact info
- ✅ Fixed leave management page with proper leave type display, employee information, and approve/decline actions

## Changelog

- June 14, 2025: Initial setup
- June 14, 2025: Major backend integration overhaul
  - Fixed CreateUserRequest structure to match KMT backend (username, email, phoneNumber, password, titleId, departmentId, hireDate, priorWorkExperienceMonths, gender)
  - Updated leave management to use CreateLeaveRequestRequest format (leaveTypeId, startDate, endDate, isHourlyLeave, startTime)
  - Enhanced search/filtering functionality for employees with proper query parameters
  - Added proper KMT API client with response structure handling
  - Fixed Super Admin role permissions and navigation access

## User Preferences

Preferred communication style: Simple, everyday language.