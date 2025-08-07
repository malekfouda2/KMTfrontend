# Component Reference Guide

This document provides detailed information about all components in the HR Management System, including their props, usage examples, and implementation details.

## Table of Contents
1. [Layout Components](#layout-components)
2. [UI Components](#ui-components)
3. [Page Components](#page-components)
4. [Form Components](#form-components)
5. [Utility Components](#utility-components)
6. [Custom Hooks](#custom-hooks)

---

## Layout Components

### MainLayout
**File:** `client/src/components/layout/MainLayout.tsx`

Main application layout wrapper with sidebar navigation, header, and breadcrumbs.

**Props:**
```typescript
interface MainLayoutProps {
  title?: string;
  breadcrumb?: string;
  children: React.ReactNode;
  className?: string;
}
```

**Usage:**
```tsx
<MainLayout title="Employee Management" breadcrumb="Employees">
  <div>Page content goes here</div>
</MainLayout>
```

**Features:**
- Responsive sidebar navigation
- Mobile hamburger menu
- User profile dropdown
- Logout functionality
- Breadcrumb navigation
- Dark/light theme support

### Sidebar
**File:** `client/src/components/layout/Sidebar.tsx`

Navigation sidebar with menu items and user information.

**Props:**
```typescript
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
}
```

**Navigation Items:**
```typescript
const navItems = [
  { path: '/', label: 'Dashboard', icon: Home },
  { path: '/employees', label: 'Employees', icon: Users },
  { path: '/attendance', label: 'Attendance', icon: Clock },
  { path: '/leave', label: 'Leave Management', icon: Calendar },
  { path: '/missions', label: 'Missions', icon: MapPin },
  { path: '/departments', label: 'Departments', icon: Building },
  { path: '/roles', label: 'Roles', icon: Shield },
  { path: '/titles', label: 'Job Titles', icon: Briefcase },
  { path: '/analytics', label: 'Analytics', icon: BarChart }
];
```

---

## UI Components

All UI components are based on Shadcn/ui and Radix UI primitives. They are located in `client/src/components/ui/`.

### Button
**File:** `client/src/components/ui/button.tsx`

**Variants:**
- `default`: Primary blue button
- `destructive`: Red danger button
- `outline`: Outlined button
- `secondary`: Gray secondary button
- `ghost`: Transparent button
- `link`: Link-style button

**Sizes:**
- `default`: Standard size
- `sm`: Small button
- `lg`: Large button
- `icon`: Square icon button

**Usage:**
```tsx
<Button variant="default" size="sm" onClick={handleClick}>
  <Plus className="h-4 w-4 mr-2" />
  Add New
</Button>
```

### Card
**File:** `client/src/components/ui/card.tsx`

Container component for content sections.

**Components:**
- `Card`: Main container
- `CardHeader`: Header section
- `CardTitle`: Title text
- `CardDescription`: Subtitle text
- `CardContent`: Main content area
- `CardFooter`: Footer section

**Usage:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Employee Details</CardTitle>
    <CardDescription>View and edit employee information</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Save Changes</Button>
  </CardFooter>
</Card>
```

### Dialog
**File:** `client/src/components/ui/dialog.tsx`

Modal dialog component for forms and detailed views.

**Components:**
- `Dialog`: Root component
- `DialogTrigger`: Trigger element
- `DialogContent`: Modal content
- `DialogHeader`: Modal header
- `DialogTitle`: Modal title
- `DialogDescription`: Modal description
- `DialogFooter`: Modal footer

**Usage:**
```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent className="max-w-md">
    <DialogHeader>
      <DialogTitle>Create Employee</DialogTitle>
      <DialogDescription>
        Add a new employee to the system
      </DialogDescription>
    </DialogHeader>
    <form>
      {/* Form fields */}
    </form>
    <DialogFooter>
      <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button type="submit">Create</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Table
**File:** `client/src/components/ui/table.tsx`

Data table components for displaying structured data.

**Components:**
- `Table`: Main table
- `TableHeader`: Header section
- `TableBody`: Body section
- `TableFooter`: Footer section
- `TableRow`: Table row
- `TableHead`: Header cell
- `TableCell`: Data cell
- `TableCaption`: Table caption

**Usage:**
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Department</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {employees.map((employee) => (
      <TableRow key={employee.id}>
        <TableCell>{employee.name}</TableCell>
        <TableCell>{employee.department}</TableCell>
        <TableCell>
          <Badge variant={employee.status === 'Active' ? 'default' : 'secondary'}>
            {employee.status}
          </Badge>
        </TableCell>
        <TableCell>
          <Button variant="outline" size="sm">Edit</Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Form Components
**File:** `client/src/components/ui/form.tsx`

Form components integrated with React Hook Form and Zod validation.

**Components:**
- `Form`: Form provider
- `FormField`: Field wrapper
- `FormItem`: Field container
- `FormLabel`: Field label
- `FormControl`: Input control wrapper
- `FormDescription`: Help text
- `FormMessage`: Error message

**Usage:**
```tsx
const form = useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: { name: "", email: "" }
});

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input placeholder="Enter name" {...field} />
          </FormControl>
          <FormDescription>Employee full name</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
    <Button type="submit">Submit</Button>
  </form>
</Form>
```

### Input
**File:** `client/src/components/ui/input.tsx`

Text input component with various types and states.

**Props:**
```typescript
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}
```

**Usage:**
```tsx
<Input
  type="email"
  placeholder="Enter email address"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

### Select
**File:** `client/src/components/ui/select.tsx`

Dropdown select component with search and multi-select capabilities.

**Components:**
- `Select`: Root component
- `SelectTrigger`: Trigger button
- `SelectValue`: Selected value display
- `SelectContent`: Dropdown content
- `SelectItem`: Option item
- `SelectSeparator`: Visual separator

**Usage:**
```tsx
<Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
  <SelectTrigger>
    <SelectValue placeholder="Select department" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="hr">Human Resources</SelectItem>
    <SelectItem value="it">Information Technology</SelectItem>
    <SelectItem value="finance">Finance</SelectItem>
  </SelectContent>
</Select>
```

### Badge
**File:** `client/src/components/ui/badge.tsx`

Status indicator component.

**Variants:**
- `default`: Blue background
- `secondary`: Gray background
- `destructive`: Red background
- `outline`: Bordered badge

**Usage:**
```tsx
<Badge variant="default">Active</Badge>
<Badge variant="destructive">Inactive</Badge>
<Badge variant="outline">Pending</Badge>
```

---

## Page Components

### Dashboard
**File:** `client/src/pages/dashboard.tsx`

Main dashboard with analytics and quick actions.

**Features:**
- Employee statistics cards
- Recent activities
- Attendance overview
- Leave requests summary
- Quick action buttons
- Charts and graphs

**Key Sections:**
```tsx
// Statistics Cards
const StatCard = ({ title, value, icon, trend }) => (
  <Card>
    <CardContent className="flex items-center p-6">
      <div className="flex-1">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        {trend && <p className="text-xs text-green-600">{trend}</p>}
      </div>
      {icon}
    </CardContent>
  </Card>
);

// Quick Actions
const QuickActions = () => (
  <Card>
    <CardHeader>
      <CardTitle>Quick Actions</CardTitle>
    </CardHeader>
    <CardContent className="grid grid-cols-2 gap-4">
      <Button asChild>
        <Link href="/employees">
          <Users className="h-4 w-4 mr-2" />
          Manage Employees
        </Link>
      </Button>
      {/* More actions */}
    </CardContent>
  </Card>
);
```

### Employees
**File:** `client/src/pages/employees.tsx`

Employee management page with CRUD operations.

**Features:**
- Employee list with search and filters
- Create/edit employee form
- Employee details view
- Bulk operations
- Export functionality

**Key Components:**
```tsx
// Employee List
const EmployeeList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredEmployees = employees?.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (departmentFilter === '' || employee.department === departmentFilter) &&
    (statusFilter === '' || employee.status === statusFilter)
  );

  return (
    <div className="space-y-4">
      <EmployeeFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        departmentFilter={departmentFilter}
        onDepartmentChange={setDepartmentFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />
      <EmployeeTable employees={filteredEmployees} />
    </div>
  );
};

// Employee Form
const EmployeeForm = ({ employee, onSubmit, onCancel }) => {
  const form = useForm({
    resolver: zodResolver(employeeSchema),
    defaultValues: employee || {}
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField name="firstName" />
          <FormField name="lastName" />
        </div>
        <FormField name="email" />
        <FormField name="department" />
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
};
```

### Attendance
**File:** `client/src/pages/attendance.tsx`

Attendance tracking and management.

**Features:**
- Daily attendance overview
- Check-in/check-out records
- Attendance reports
- Late arrival tracking
- Overtime management

### Leave Management
**File:** `client/src/pages/leave.tsx`

Leave request and approval system.

**Features:**
- Leave request form
- Approval workflow
- Leave calendar
- Leave balance tracking
- Leave types management

**Key Functions:**
```tsx
// Leave Approval
const handleApproveLeave = async (leaveId: string) => {
  try {
    await kmtApiClient.put(`/leaves/${leaveId}/approve`);
    queryClient.invalidateQueries({ queryKey: ['/api/leaves'] });
    toast({ title: "Leave approved successfully" });
  } catch (error) {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive"
    });
  }
};

// Leave Decline with Reason
const handleDeclineLeave = async (leaveId: string, reason: string) => {
  try {
    await kmtApiClient.put(`/leaves/${leaveId}/decline`, { reason });
    queryClient.invalidateQueries({ queryKey: ['/api/leaves'] });
    toast({ title: "Leave declined" });
  } catch (error) {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive"
    });
  }
};
```

---

## Form Components

### SearchAndFilter
**File:** `client/src/components/common/SearchAndFilter.tsx`

Reusable search and filter component.

**Props:**
```typescript
interface SearchAndFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters?: FilterOption[];
  onFilterChange?: (key: string, value: string) => void;
  placeholder?: string;
}

interface FilterOption {
  key: string;
  label: string;
  options: { value: string; label: string }[];
  value: string;
}
```

**Usage:**
```tsx
<SearchAndFilter
  searchValue={searchTerm}
  onSearchChange={setSearchTerm}
  placeholder="Search employees..."
  filters={[
    {
      key: 'department',
      label: 'Department',
      options: departmentOptions,
      value: departmentFilter
    },
    {
      key: 'status',
      label: 'Status',
      options: statusOptions,
      value: statusFilter
    }
  ]}
  onFilterChange={(key, value) => {
    if (key === 'department') setDepartmentFilter(value);
    if (key === 'status') setStatusFilter(value);
  }}
/>
```

### DataTable
**File:** `client/src/components/common/DataTable.tsx`

Enhanced table component with sorting, pagination, and actions.

**Props:**
```typescript
interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  isLoading?: boolean;
  onRowClick?: (row: T) => void;
  actions?: TableAction<T>[];
  pagination?: PaginationConfig;
}

interface TableAction<T> {
  label: string;
  icon?: React.ComponentType;
  onClick: (row: T) => void;
  variant?: 'default' | 'destructive';
  disabled?: (row: T) => boolean;
}
```

**Usage:**
```tsx
const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <div className="flex items-center space-x-3">
        <Avatar>
          <AvatarFallback>{getInitials(row.original.name)}</AvatarFallback>
        </Avatar>
        <span className="font-medium">{row.original.name}</span>
      </div>
    )
  },
  {
    accessorKey: 'department',
    header: 'Department'
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={row.original.status === 'Active' ? 'default' : 'secondary'}>
        {row.original.status}
      </Badge>
    )
  }
];

const actions: TableAction<Employee>[] = [
  {
    label: 'Edit',
    icon: Edit,
    onClick: (employee) => setEditingEmployee(employee)
  },
  {
    label: 'Delete',
    icon: Trash,
    onClick: (employee) => handleDeleteEmployee(employee.id),
    variant: 'destructive'
  }
];

<DataTable
  data={employees}
  columns={columns}
  actions={actions}
  isLoading={isLoading}
  pagination={{ page, pageSize, total, onPageChange }}
/>
```

---

## Utility Components

### LoadingSpinner
**File:** `client/src/components/common/LoadingSpinner.tsx`

Loading indicator component.

**Props:**
```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}
```

**Usage:**
```tsx
<LoadingSpinner size="md" text="Loading employees..." />
```

### EmptyState
**File:** `client/src/components/common/EmptyState.tsx`

Empty state component for when no data is available.

**Props:**
```typescript
interface EmptyStateProps {
  icon?: React.ComponentType;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

**Usage:**
```tsx
<EmptyState
  icon={Users}
  title="No employees found"
  description="Get started by adding your first employee"
  action={{
    label: "Add Employee",
    onClick: () => setIsCreateModalOpen(true)
  }}
/>
```

### ConfirmDialog
**File:** `client/src/components/common/ConfirmDialog.tsx`

Confirmation dialog for destructive actions.

**Props:**
```typescript
interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  variant?: 'default' | 'destructive';
}
```

**Usage:**
```tsx
<ConfirmDialog
  open={isDeleteDialogOpen}
  onOpenChange={setIsDeleteDialogOpen}
  title="Delete Employee"
  description="Are you sure you want to delete this employee? This action cannot be undone."
  confirmLabel="Delete"
  variant="destructive"
  onConfirm={handleConfirmDelete}
/>
```

---

## Custom Hooks

### useAuth
**File:** `client/src/hooks/useAuth.ts`

Authentication hook for managing user session.

**Returns:**
```typescript
interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  isLoading: boolean;
}
```

**Usage:**
```tsx
const { user, isAuthenticated, login, logout, isLoading } = useAuth();

if (isLoading) return <LoadingSpinner />;

if (!isAuthenticated) {
  return <LoginPage onLogin={login} />;
}

return <Dashboard user={user} onLogout={logout} />;
```

### useLocalStorage
**File:** `client/src/hooks/useLocalStorage.ts`

Hook for managing localStorage values with React state.

**Usage:**
```tsx
const [theme, setTheme] = useLocalStorage('theme', 'light');
const [sidebarCollapsed, setSidebarCollapsed] = useLocalStorage('sidebar-collapsed', false);
```

### useDebounce
**File:** `client/src/hooks/useDebounce.ts`

Hook for debouncing values to reduce API calls.

**Usage:**
```tsx
const [searchTerm, setSearchTerm] = useState('');
const debouncedSearchTerm = useDebounce(searchTerm, 300);

useEffect(() => {
  if (debouncedSearchTerm) {
    searchEmployees(debouncedSearchTerm);
  }
}, [debouncedSearchTerm]);
```

### usePermissions
**File:** `client/src/hooks/usePermissions.ts`

Hook for checking user permissions.

**Returns:**
```typescript
interface UsePermissionsReturn {
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  userRole: string;
}
```

**Usage:**
```tsx
const { hasPermission, userRole } = usePermissions();

{hasPermission('employees.write') && (
  <Button onClick={handleCreateEmployee}>
    Add Employee
  </Button>
)}
```

---

## Styling Patterns

### CSS Classes
Common utility classes used throughout the application:

```css
/* Layout */
.container { @apply mx-auto px-4 sm:px-6 lg:px-8; }
.page-header { @apply mb-8 border-b border-gray-200 pb-4; }
.section-spacing { @apply space-y-6; }

/* Cards */
.stat-card { @apply bg-white p-6 rounded-lg border shadow-sm; }
.metric-card { @apply text-center p-4; }

/* Forms */
.form-grid { @apply grid grid-cols-1 md:grid-cols-2 gap-4; }
.form-actions { @apply flex justify-end space-x-2 pt-4 border-t; }

/* Tables */
.table-container { @apply overflow-x-auto; }
.table-actions { @apply flex items-center space-x-2; }

/* Status indicators */
.status-active { @apply bg-green-100 text-green-800; }
.status-inactive { @apply bg-red-100 text-red-800; }
.status-pending { @apply bg-yellow-100 text-yellow-800; }
```

### Responsive Patterns

```tsx
// Mobile-first responsive grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

// Responsive text sizing
<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">

// Responsive spacing
<div className="p-4 sm:p-6 lg:p-8">

// Show/hide on different screens
<div className="hidden md:block">Desktop only content</div>
<div className="block md:hidden">Mobile only content</div>
```

---

## Component Best Practices

### Performance Optimization
```tsx
// Memoize expensive computations
const expensiveValue = useMemo(() => 
  computeExpensiveValue(data), [data]
);

// Memoize callbacks to prevent re-renders
const handleClick = useCallback(() => {
  onClick(id);
}, [onClick, id]);

// Memoize components that receive complex props
const MemoizedComponent = memo(({ data, onAction }) => {
  // Component implementation
});
```

### Error Boundaries
```tsx
// Wrap components with error boundaries
<ErrorBoundary fallback={<ErrorFallback />}>
  <ComplexComponent />
</ErrorBoundary>
```

### Accessibility
```tsx
// ARIA labels and roles
<button
  aria-label="Delete employee"
  aria-describedby="delete-description"
  role="button"
>
  <Trash className="h-4 w-4" />
</button>

// Keyboard navigation
<div
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
```

### Loading States
```tsx
// Skeleton loading for tables
const TableSkeleton = () => (
  <div className="space-y-2">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex space-x-4">
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="h-10 w-1/4" />
      </div>
    ))}
  </div>
);

// Loading states in components
{isLoading ? <TableSkeleton /> : <EmployeeTable data={employees} />}
```

---

**Last Updated:** January 2025
**Component Library Version:** 1.0.0