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
- **Primary Backend**: KMT Backend (https://5daadc7b4a4d.ngrok-free.app/api)
- **Fallback**: Local Express.js server for development/mock data
- **Authentication**: JWT token-based authentication
- **API Response Format**: KMT-specific structure `{ data: [...], message: "...", success: true }`
- **CORS Headers**: Includes ngrok-skip-browser-warning header for seamless API access

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

### Major Backend Integration Update (July 15, 2025)
- ✅ Updated base URL to https://1dfd82980d7b.ngrok-free.app/api
- ✅ Comprehensive API client overhaul with all new KMT Backend endpoints
- ✅ Added LeaveBalance management endpoints (User/{userId}, Reset, etc.)
- ✅ Enhanced User Role assignment with proper User/{userId}/Roles endpoint
- ✅ Added Mission transportation and assignment endpoints
- ✅ Implemented Title management endpoints
- ✅ Added Permission management endpoints
- ✅ Updated Leave Request endpoints with Approve/Reject actions
- ✅ Enhanced Department Leave Request filtering
- ✅ Added User Password management endpoints
- ✅ Fixed Mission assignment with proper user arrays
- ✅ Updated all endpoint methods to match new KMT backend structure
- ✅ Enhanced error handling and response processing for new backend
- ✅ Added client-side filtering fallback for employees and departments
- ✅ Removed deprecated endpoints and updated method signatures

### New Frontend Pages and Features (July 15, 2025)
- ✅ Created comprehensive Leave Balance management page (/leave-balance)
  - Employee leave balance tracking with visual progress indicators
  - Leave type integration and balance updates
  - Year-based filtering and bulk balance reset functionality
  - Real-time balance calculation and remaining days display
- ✅ Created Job Titles management page (/titles)
  - Bilingual title management (English/Arabic)
  - Title CRUD operations with proper validation
  - Employee count tracking per title
  - Comprehensive search and filtering capabilities
- ✅ Created Leave Types management page (/leave-types)
  - Leave type configuration with max days, carry over, and approval settings
  - Bilingual support for leave type names and descriptions
  - Visual indicators for leave type policies
  - Color-coded leave type management
- ✅ Enhanced API client with LeaveType management endpoints
  - Create, read, update, delete leave types
  - Proper form validation and error handling
  - Integration with existing leave management system
- ✅ Updated routing system to include all new pages
- ✅ Enhanced sidebar navigation with new management sections
- ✅ Fixed duplicate method issues in KMT API client
- ✅ Improved error handling and user feedback throughout the application

### Complete Missing Endpoints Implementation (July 15, 2025)
- ✅ Added all remaining 9 missing endpoint categories to KMT API client:
  - CheckInOut management with user tracking and monthly reports
  - Overtime management with approval/rejection workflows
  - LateArrival tracking with auto-creation and penalty integration
  - Bonus management with type categorization and payroll integration
  - Penalty management with comprehensive reason tracking
  - Payroll management with status tracking and payment processing
  - WorkPolicy management for company policies
  - Mobile API endpoints for mobile application support
- ✅ Created 6 comprehensive new management pages with full CRUD operations:
  - Check-In/Check-Out page (/check-in-out) with real-time attendance tracking
  - Overtime Management page (/overtime) with approval workflows
  - Late Arrival Management page (/late-arrival) with penalty integration
  - Bonus Management page (/bonus) with type categorization
  - Penalty Management page (/penalty) with comprehensive tracking
  - Payroll Management page (/payroll) with status and payment tracking
- ✅ Updated routing system to include all 6 new pages
- ✅ Enhanced sidebar navigation with proper icons (Gift, AlertTriangle, DollarSign)
- ✅ All pages feature comprehensive search, filtering, and real-time data updates
- ✅ Implemented proper error handling and user feedback throughout
- ✅ Added statistics cards and visual indicators for better user experience

## Changelog

- June 14, 2025: Initial setup
- June 14, 2025: Major backend integration overhaul
  - Fixed CreateUserRequest structure to match KMT backend (username, email, phoneNumber, password, titleId, departmentId, hireDate, priorWorkExperienceMonths, gender)
  - Updated leave management to use CreateLeaveRequestRequest format (leaveTypeId, startDate, endDate, isHourlyLeave, startTime)
  - Enhanced search/filtering functionality for employees with proper query parameters
  - Added proper KMT API client with response structure handling
  - Fixed Super Admin role permissions and navigation access

- July 15, 2025: Comprehensive Backend Integration Update
  - Updated base URL to new ngrok endpoint (https://5daadc7b4a4d.ngrok-free.app/api)
  - Complete API client rewrite with all new KMT Backend endpoints from Postman collection
  - Added comprehensive LeaveBalance, Permission, Title management endpoints
  - Enhanced User Role assignment and Mission management with proper endpoint structure
  - Fixed all endpoint methods to match new backend structure (POST vs PATCH vs PUT)
  - Added client-side filtering fallback and enhanced error handling
  - Removed deprecated endpoints and updated method signatures

- July 15, 2025: New Frontend Pages and Features Implementation
  - Created comprehensive Leave Balance management page with visual progress indicators
  - Implemented Job Titles management page with bilingual support and CRUD operations
  - Added Leave Types management page with policy configuration and approval settings
  - Enhanced API client with LeaveType management endpoints
  - Updated routing system and sidebar navigation for all new pages
  - Fixed duplicate method issues in KMT API client
  - Improved error handling and user feedback throughout the application

- July 15, 2025: Complete Missing Endpoints Implementation
  - Added all remaining 9 endpoint categories to KMT API client (CheckInOut, Overtime, LateArrival, Bonus, Penalty, Payroll, WorkPolicy, Mobile endpoints)
  - Created 6 comprehensive new management pages with full CRUD operations
  - Check-In/Check-Out page with real-time attendance tracking and location support
  - Overtime Management page with approval workflows and automatic calculation
  - Late Arrival Management page with penalty integration and severity tracking
  - Bonus Management page with type categorization and payroll integration
  - Penalty Management page with comprehensive reason tracking and application status
  - Payroll Management page with status tracking and payment processing workflows
  - Updated routing system and sidebar navigation with proper icons for all new pages
  - All pages feature comprehensive search, filtering, statistics cards, and real-time data updates
  - Implemented proper error handling, user feedback, and responsive design throughout

### Runtime Error Fixes (July 15, 2025)
- ✅ Systematically fixed all 6 new management pages to eliminate runtime errors
- ✅ Enhanced Check-In/Check-Out page with proper approval workflows and backend data integration
- ✅ Fixed Overtime Management page with comprehensive request management and approval/rejection actions
- ✅ Fixed Late Arrival Management page with severity tracking and auto-creation indicators
- ✅ Fixed Bonus Management page with type categorization and payroll integration
- ✅ Fixed Penalty Management page with comprehensive reason tracking and application status
- ✅ Fixed Payroll Management page with status tracking and payment processing workflows
- ✅ All pages now properly handle backend data with comprehensive error handling and loading states
- ✅ Enhanced user experience with proper statistics cards, filtering, and action buttons
- ✅ Implemented proper TypeScript interfaces for all data structures
- ✅ Added comprehensive CRUD operations for all management pages
- ✅ Proper form validation and error handling throughout all pages

### UI/UX Integration Update (July 15, 2025)
- ✅ Added MainLayout component integration to all 6 new management pages
- ✅ Fixed JSX syntax errors in Late Arrival page (replaced comparison operators with HTML entities)
- ✅ Fixed connection issue - changed KMT API base URL from external ngrok to local /api endpoint
- ✅ All pages now properly display sidebar navigation and header components
- ✅ Consistent layout structure across all management pages with proper breadcrumb navigation
- ✅ Removed all dummy data - application now exclusively uses backend data from KMT API
- ✅ Enhanced mobile responsiveness with sidebar integration
- ✅ All pages maintain proper MainLayout wrapping with title and breadcrumb support
- ✅ Fixed Vite React plugin runtime error by adding proper React imports to main.tsx and App.tsx
- ✅ Resolved preamble detection issue that was causing build errors
- ✅ Updated KMT API client to use correct ngrok backend URL (https://5daadc7b4a4d.ngrok-free.app/api)
- ✅ Added ngrok-skip-browser-warning header for seamless API access without browser warnings
- ✅ Fixed missions page runtime error by adding null checks for mission.status property
- ✅ Enhanced getStatusColor function to handle undefined status values safely
- ✅ Added proper React import to missions page to prevent preamble detection issues
- ✅ Fixed mission form validation errors by converting time format to integer minutes and adding required request field
- ✅ Enhanced employee deletion error handling with proper logging and user feedback
- ✅ Added React imports to all pages to prevent Vite React plugin preamble detection issues
- ✅ Fixed MainLayout integration for titles, leave-balance, and leave-types pages to ensure sidebar navigation
- ✅ All pages now have proper sidebar navigation and consistent layout structure

### Backend URL Update (July 16, 2025)
- ✅ Updated KMT API base URL to new ngrok endpoint (https://5daadc7b4a4d.ngrok-free.app/api)
- ✅ Tested API connectivity and confirmed authentication endpoints are responding correctly
- ✅ All API requests now use the updated backend URL with proper ngrok headers

### Critical Bug Fixes (July 16, 2025)
- ✅ Fixed 405 Method Not Allowed errors in leave management by changing approval/rejection endpoints from POST to PUT
- ✅ Fixed 400 Bad Request errors in mission creation by correcting DTO structure (lowercase field names)
- ✅ Fixed 400 Bad Request errors in leave type creation by adding proper request structure with bilingual support
- ✅ Fixed user data mapping across all management pages (overtime, bonus, penalty, payroll, late arrival, leave balance, roles)
- ✅ Enhanced user dropdown displays to handle different name formats (name, firstName+lastName, username, email)
- ✅ Added comprehensive error handling and logging for user data fetching across all forms
- ✅ Fixed "undefined" display issues in user-related fields throughout the application
- ✅ Updated mission creation to include all required fields: description, descriptionAr, missionDate, location, locationAr, status, priority
- ✅ Fixed leave type creation with proper bilingual support and validation
- ✅ Added reason handling for leave request decline with modal dialog for reason input
- ✅ Fixed leave balance filter showing "unknown user" by implementing getUserDisplayName utility
- ✅ Enhanced bonus/penalty creation with better debugging and forced query refresh
- ✅ Fixed mission creation time format to use hours (0-23) instead of minutes for backend validation
- ✅ Fixed titles page to dynamically show employee counts from backend data
- ✅ Added view employees button to titles page with detailed employee modal
- ✅ Updated all user display forms to use getUserDisplayName utility consistently
- ✅ Enhanced getUserDisplayName function with comprehensive debugging and field detection

## User Preferences

Preferred communication style: Simple, everyday language.
