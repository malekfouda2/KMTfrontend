# Development Setup and Troubleshooting Guide

This guide helps new developers quickly set up the HR Management System development environment and troubleshoot common issues.

## Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 16+ (for local development)
- Git
- Code editor (VS Code recommended)

### Environment Setup

1. **Clone and Install**
   ```bash
   git clone [repository-url]
   cd hr-management-system
   npm install
   ```

2. **Environment Variables**
   Create `.env` file in the root directory:
   ```env
   # KMT Backend API
   VITE_KMT_API_URL=https://5daadc7b4a4d.ngrok-free.app
   
   # Local Database (for development fallback)
   DATABASE_URL=postgresql://user:password@localhost:5432/hrms_dev
   
   # Development Settings
   NODE_ENV=development
   ```

3. **Database Setup** (Optional - for local development)
   ```bash
   # Create database
   createdb hrms_dev
   
   # Run migrations
   npm run db:generate
   npm run db:push
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:5000`

## File Structure Overview

```
hr-management-system/
├── client/                     # Frontend React application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── layout/        # Layout components (MainLayout, Sidebar)
│   │   │   └── ui/            # Shadcn UI components
│   │   ├── pages/             # Page components (routes)
│   │   ├── lib/               # Utilities and configurations
│   │   │   ├── api.ts         # Local API utilities
│   │   │   ├── auth.ts        # Authentication utilities  
│   │   │   ├── kmt-api.ts     # KMT Backend API client
│   │   │   ├── queryClient.ts # TanStack Query config
│   │   │   └── utils.ts       # General utilities
│   │   ├── types/             # TypeScript type definitions
│   │   ├── hooks/             # Custom React hooks
│   │   ├── App.tsx            # Main app component with routing
│   │   ├── main.tsx           # Application entry point
│   │   └── index.css          # Global styles
│   └── index.html             # HTML template
├── server/                    # Local Express server (fallback)
│   ├── index.ts              # Server entry point
│   ├── routes.ts             # API routes
│   ├── storage.ts            # Data storage interface
│   └── vite.ts              # Vite dev server integration
├── shared/
│   └── schema.ts             # Shared TypeScript schemas
├── package.json              # Dependencies and scripts
├── vite.config.ts           # Vite configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── drizzle.config.ts        # Database ORM configuration
```

## Key Development Concepts

### 1. API Integration Strategy
The system uses a **dual API approach**:
- **Primary**: KMT Backend API (external)
- **Fallback**: Local Express server (development only)

```typescript
// API client automatically handles both endpoints
const response = await kmtApiClient.get('/employees');
```

### 2. Authentication Flow
```typescript
// Login process
1. User submits credentials to /auth/login
2. API returns JWT token + user info
3. Token stored in localStorage
4. Token included in all subsequent requests
5. Automatic redirect on auth failures
```

### 3. State Management Pattern
Using TanStack Query for server state:
```typescript
// Data fetching
const { data, isLoading } = useQuery({
  queryKey: ['/api/employees'],
  enabled: !!authToken
});

// Data mutations
const createMutation = useMutation({
  mutationFn: (data) => kmtApiClient.post('/employees', data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['/api/employees'] });
  }
});
```

### 4. Form Handling Pattern
React Hook Form + Zod validation:
```typescript
const form = useForm({
  resolver: zodResolver(employeeSchema),
  defaultValues: { firstName: "", lastName: "" }
});

const onSubmit = async (data) => {
  try {
    await kmtApiClient.post('/employees', data);
    toast({ title: "Success!" });
  } catch (error) {
    toast({ title: "Error", description: error.message, variant: "destructive" });
  }
};
```

## Common Development Tasks

### Adding a New Page
1. **Create page component** in `client/src/pages/`
2. **Add route** in `client/src/App.tsx`
3. **Add navigation item** in `client/src/components/layout/Sidebar.tsx`

Example:
```typescript
// 1. Create client/src/pages/reports.tsx
export default function Reports() {
  return <MainLayout title="Reports" breadcrumb="Reports">...</MainLayout>;
}

// 2. Add route in App.tsx
<Route path="/reports" component={Reports} />

// 3. Add to navigation
{ path: '/reports', label: 'Reports', icon: BarChart }
```

### Adding a New API Endpoint
1. **Add to KMT API client** if using external API
2. **Create query/mutation hooks**
3. **Add TypeScript types**

Example:
```typescript
// 1. In kmt-api.ts (if needed)
export const reportsApi = {
  getMonthlyReport: (month: number) => 
    kmtApiClient.get(`/reports/monthly/${month}`)
};

// 2. In component
const { data: report } = useQuery({
  queryKey: ['/api/reports/monthly', month],
  queryFn: () => reportsApi.getMonthlyReport(month)
});

// 3. Add types in shared/schema.ts
interface MonthlyReport {
  month: number;
  totalEmployees: number;
  attendance: number;
  // ...
}
```

### Adding Form Validation
```typescript
// 1. Define Zod schema
const reportSchema = z.object({
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  department: z.string().optional()
});

// 2. Create form
const form = useForm({
  resolver: zodResolver(reportSchema),
  defaultValues: { startDate: "", endDate: "", department: "" }
});

// 3. Add validation to fields
<FormField
  name="startDate"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Start Date</FormLabel>
      <FormControl>
        <Input type="date" {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

## Troubleshooting Guide

### 1. "Unknown User" Display Issue
**Problem**: Forms showing "Unknown User" instead of actual names

**Solution**: 
```typescript
// Use getUserDisplayName utility
import { getUserDisplayName } from '@/lib/utils';

// In dropdowns/forms
{users.map((user) => (
  <option key={user.id} value={user.id}>
    {getUserDisplayName(user)}
  </option>
))}
```

**Debug Steps**:
1. Check browser console for user data structure
2. Verify API response format
3. Test getUserDisplayName with actual data

### 2. Authentication Token Issues
**Problem**: "Unauthorized" errors or login redirects

**Debug Steps**:
```typescript
// Check token in browser console
console.log('Token:', localStorage.getItem('authToken'));

// Decode JWT payload
const token = localStorage.getItem('authToken');
if (token) {
  const payload = JSON.parse(atob(token.split('.')[1]));
  console.log('Token payload:', payload);
  console.log('Expires:', new Date(payload.exp * 1000));
}
```

**Solutions**:
- Clear localStorage and re-login
- Check token expiration
- Verify API endpoint availability

### 3. API Connection Issues
**Problem**: Network errors or failed requests

**Debug Steps**:
1. **Check API endpoint**:
   ```bash
   curl -H "ngrok-skip-browser-warning: true" https://5daadc7b4a4d.ngrok-free.app/health
   ```

2. **Verify headers**:
   ```typescript
   // Check request headers in Network tab
   {
     'Content-Type': 'application/json',
     'Authorization': 'Bearer <token>',
     'ngrok-skip-browser-warning': 'true'
   }
   ```

3. **Test connectivity**:
   ```typescript
   const testConnection = async () => {
     try {
       const response = await kmtApiClient.get('/health');
       console.log('API connected:', response);
     } catch (error) {
       console.error('Connection failed:', error);
     }
   };
   ```

### 4. Data Not Loading
**Problem**: Empty tables or missing data

**Debug Steps**:
1. **Check query status**:
   ```typescript
   const { data, isLoading, error, isError } = useQuery({
     queryKey: ['/api/employees']
   });
   
   console.log('Query state:', { data, isLoading, error, isError });
   ```

2. **Verify API response**:
   ```typescript
   // Check Network tab in DevTools
   // Look for 200 status and proper response format
   {
     "data": [...],
     "message": "Success",
     "success": true
   }
   ```

3. **Check query key**:
   ```typescript
   // Make sure query keys are consistent
   const queryKey = ['/api/employees'];
   queryClient.invalidateQueries({ queryKey });
   ```

### 5. Form Submission Failures
**Problem**: Forms not submitting or validation errors

**Debug Steps**:
1. **Check form state**:
   ```typescript
   console.log('Form errors:', form.formState.errors);
   console.log('Form values:', form.getValues());
   console.log('Form valid:', form.formState.isValid);
   ```

2. **Verify request payload**:
   ```typescript
   const onSubmit = async (data) => {
     console.log('Submitting:', data);
     try {
       const response = await kmtApiClient.post('/employees', data);
       console.log('Response:', response);
     } catch (error) {
       console.error('Submission error:', error);
     }
   };
   ```

3. **Check validation schema**:
   ```typescript
   // Test schema manually
   const result = employeeSchema.safeParse(formData);
   if (!result.success) {
     console.log('Validation errors:', result.error.errors);
   }
   ```

## Performance Optimization

### 1. Query Optimization
```typescript
// Prefetch related data
const prefetchEmployeeDetails = async (employeeId) => {
  await queryClient.prefetchQuery({
    queryKey: ['/api/employees', employeeId],
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
};

// Optimize cache invalidation
queryClient.invalidateQueries({ 
  queryKey: ['/api/employees'],
  exact: false 
});
```

### 2. Component Optimization
```typescript
// Memoize expensive computations
const filteredData = useMemo(() => 
  data?.filter(item => item.name.includes(searchTerm)), 
  [data, searchTerm]
);

// Memoize callbacks
const handleDelete = useCallback((id) => {
  deleteEmployee(id);
}, [deleteEmployee]);
```

### 3. Bundle Optimization
```typescript
// Lazy load pages
const EmployeePage = lazy(() => import('./pages/employees'));
const ReportsPage = lazy(() => import('./pages/reports'));

// Wrap with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Route path="/employees" component={EmployeePage} />
</Suspense>
```

## Testing Strategies

### 1. Manual Testing Checklist
- [ ] Login/logout functionality
- [ ] All navigation links work
- [ ] CRUD operations for each entity
- [ ] Form validation
- [ ] Error handling
- [ ] Mobile responsiveness
- [ ] Data persistence

### 2. API Testing
```bash
# Test authentication
curl -X POST https://5daadc7b4a4d.ngrok-free.app/auth/login \
  -H "Content-Type: application/json" \
  -H "ngrok-skip-browser-warning: true" \
  -d '{"username":"admin","password":"password"}'

# Test protected endpoint
curl -X GET https://5daadc7b4a4d.ngrok-free.app/employees \
  -H "Authorization: Bearer <token>" \
  -H "ngrok-skip-browser-warning: true"
```

### 3. Error Boundary Testing
```typescript
// Test error scenarios
const ErrorTest = () => {
  const [shouldError, setShouldError] = useState(false);
  
  if (shouldError) {
    throw new Error('Test error');
  }
  
  return (
    <Button onClick={() => setShouldError(true)}>
      Trigger Error
    </Button>
  );
};
```

## Security Considerations

### 1. Authentication Security
- JWT tokens are stored in localStorage (consider httpOnly cookies for production)
- Tokens are validated on each request
- Automatic logout on token expiry
- HTTPS required in production

### 2. Input Validation
- All forms use Zod validation
- Server-side validation required
- XSS prevention through React's built-in escaping
- SQL injection prevention through parameterized queries

### 3. API Security
```typescript
// Always include auth headers
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
  'ngrok-skip-browser-warning': 'true'
};

// Validate responses
if (!response.success) {
  throw new Error(response.message);
}
```

## Deployment Checklist

### Pre-deployment
- [ ] Update environment variables
- [ ] Test all functionality
- [ ] Check for console errors
- [ ] Verify responsive design
- [ ] Test with production API
- [ ] Update documentation

### Production Environment
```env
NODE_ENV=production
VITE_KMT_API_URL=https://production-api-url.com
```

### Build and Deploy
```bash
# Build for production
npm run build

# Test production build locally
npm run preview
```

## Development Best Practices

### 1. Code Organization
- Use consistent naming conventions
- Group related functionality
- Keep components small and focused
- Use TypeScript for type safety

### 2. Git Workflow
```bash
# Feature development
git checkout -b feature/employee-search
git add .
git commit -m "feat: add employee search functionality"
git push origin feature/employee-search
```

### 3. Error Handling
```typescript
// Always handle errors gracefully
try {
  const result = await apiCall();
  return result;
} catch (error) {
  console.error('Operation failed:', error);
  toast({
    title: "Error",
    description: error.message || "Something went wrong",
    variant: "destructive"
  });
  throw error;
}
```

### 4. Performance Monitoring
```typescript
// Log performance metrics
console.time('employee-load');
const employees = await fetchEmployees();
console.timeEnd('employee-load');

// Monitor query performance
const { data, fetchTime } = useQuery({
  queryKey: ['/api/employees'],
  meta: { 
    logPerformance: true 
  }
});
```

## Getting Help

### Resources
- **Project Documentation**: `PROJECT_DOCUMENTATION.md`
- **API Reference**: `API_ENDPOINTS_REFERENCE.md`
- **Component Guide**: `COMPONENT_REFERENCE.md`
- **Architecture Overview**: `replit.md`

### Common Solutions Repository
- Check browser DevTools console for errors
- Verify API endpoint availability
- Test authentication token validity
- Review Network tab for failed requests
- Use React Query DevTools for state inspection

### Support Contacts
- Technical Lead: [Contact Information]
- Backend API Team: [Contact Information]
- DevOps/Infrastructure: [Contact Information]

---

**Last Updated**: January 2025  
**Environment**: Development  
**Node.js Version**: 18+  
**API Version**: KMT Backend 1.0