import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";

// Pages
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Employees from "@/pages/employees";
import Attendance from "@/pages/attendance";
import Leave from "@/pages/leave";
import Missions from "@/pages/missions";
import Policies from "@/pages/policies";
import Analytics from "@/pages/analytics";
import Departments from "@/pages/departments";
import Roles from "@/pages/roles";
import Titles from "@/pages/titles";
import LeaveBalance from "@/pages/leave-balance";
import LeaveTypes from "@/pages/leave-types";
import NotFound from "@/pages/not-found";

function AuthenticatedRoutes() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return (
    <Switch>
      <Route path="/" component={() => <Redirect to="/dashboard" />} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/employees" component={Employees} />
      <Route path="/attendance" component={Attendance} />
      <Route path="/leave" component={Leave} />
      <Route path="/missions" component={Missions} />
      <Route path="/policies" component={Policies} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/departments" component={Departments} />
      <Route path="/roles" component={Roles} />
      <Route path="/titles" component={Titles} />
      <Route path="/leave-balance" component={LeaveBalance} />
      <Route path="/leave-types" component={LeaveTypes} />
      <Route component={NotFound} />
    </Switch>
  );
}

function Router() {
  const { isAuthenticated } = useAuth();

  return (
    <Switch>
      <Route path="/login">
        {isAuthenticated ? <Redirect to="/dashboard" /> : <Login />}
      </Route>
      <Route path="*" component={AuthenticatedRoutes} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
