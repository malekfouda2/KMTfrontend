# HR Management System - KMT Backend Integration

## Overview
This project is a comprehensive HR Management System designed to streamline human resource operations. It features a modern, responsive React.js frontend deeply integrated with the KMT backend. The system aims to provide a centralized platform for managing employees, attendance, leave requests, missions, departments, roles, and company policies, ensuring full compatibility with the KMT backend's structure and API. The vision is to offer a robust, user-friendly solution for HR management, improving operational efficiency and employee lifecycle management.

## User Preferences
- **Communication Style**: Simple, everyday language
- **Documentation Priority**: Comprehensive developer documentation for project handover
- **Code Quality**: Consistent user display utilities, robust error handling, mobile-responsive design

## System Architecture

### Frontend Architecture
- **Framework**: React.js with TypeScript
- **Build Tool**: Vite
- **UI Components**: Shadcn/ui (leveraging Radix UI primitives)
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter
- **Form Handling**: React Hook Form with Zod validation
- **UI/UX Decisions**: Responsive design (mobile-first), Dark/Light theme support, consistent design system, ARIA compliance for accessibility.

### Backend Integration
- **Primary Backend**: KMT Backend (external API endpoint)
- **Fallback**: Local Express.js server for development/mock data
- **Authentication**: JWT token-based with automatic refresh and role-based access control.
- **API Response Format**: KMT-specific structure (`{ data: [...], message: "...", success: true }`).
- **CORS Handling**: Includes `ngrok-skip-browser-warning` header.

### Core Modules and Features
- **Authentication System**: JWT, role-based access, token validation, automatic redirection on failures.
- **API Integration**: Dedicated KMT API client, robust response and error handling, all endpoints aligned with KMT.
- **Employee Management**: User registration, profile, role assignments, search/filtering.
- **Attendance Tracking**: Check-in/out, overtime, approval workflows.
- **Leave Management**: Requests, approvals, policy enforcement, leave balance, leave types.
- **Mission Management**: Assignment, tracking, status updates, reporting, bilingual support.
- **Department Management**: Organizational structure, employee assignments.
- **Role Management**: Permission-based access control with granular permissions and comprehensive assignment functionality.
- **Policy Management**: Company policy documentation.
- **Analytics Dashboard**: KPI tracking and reporting.
- **Job Title Management**: Bilingual CRUD operations for titles.
- **Additional Management**: CheckInOut, Overtime, LateArrival, Bonus, Penalty, Payroll management with full CRUD operations and reporting.

### Data Flow
- **Authentication**: User login generates/validates JWT, stored in localStorage, used for API authorization.
- **API Communication**: Frontend requests via KMT API Client to backend, response processing, state updates, error handling.
- **State Management**: Server state managed by TanStack Query, local component state for UI, form state by React Hook Form.

## External Dependencies

- **Production Dependencies**:
    - React 18+ (with TypeScript)
    - Radix UI primitives / Shadcn/ui
    - Fetch API (with custom wrapper for KMT)
    - React Hook Form / Zod
    - Tailwind CSS / PostCSS
    - Recharts (for data visualization)
    - date-fns (for date manipulation)
- **Development Dependencies**:
    - Vite (build system)
    - Drizzle ORM (with PostgreSQL support)
    - TypeScript
    - Express.js (for local development server)
- **Databases**:
    - PostgreSQL 16
- **APIs/Services**:
    - KMT Backend API (primary external service)
```