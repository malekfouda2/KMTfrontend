import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { MainLayout } from "@/components/layout/MainLayout";
import { AttendanceChart } from "@/components/dashboard/AttendanceChart";
import { DepartmentChart } from "@/components/dashboard/DepartmentChart";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
} from "lucide-react";

export default function Analytics() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/Dashboard/stats"],
    queryFn: () => apiClient.getDashboardStats(),
  });

  // Sample data for analytics charts
  const monthlyTrends = [
    { month: "Jan", employees: 220, attendance: 92.5, leaves: 15 },
    { month: "Feb", employees: 225, attendance: 94.2, leaves: 12 },
    { month: "Mar", employees: 230, attendance: 91.8, leaves: 18 },
    { month: "Apr", employees: 235, attendance: 93.1, leaves: 14 },
    { month: "May", employees: 240, attendance: 94.7, leaves: 16 },
    { month: "Jun", employees: 247, attendance: 95.2, leaves: 13 },
  ];

  const departmentPerformance = [
    { department: "Engineering", performance: 95, satisfaction: 88 },
    { department: "HR", performance: 92, satisfaction: 94 },
    { department: "Finance", performance: 89, satisfaction: 85 },
    { department: "Marketing", performance: 91, satisfaction: 90 },
    { department: "Operations", performance: 87, satisfaction: 82 },
  ];

  return (
    <MainLayout 
      title="Analytics" 
      breadcrumb="Home"
      requiredRoles={["general_manager", "hr_manager"]}
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-secondary">HR Analytics</h2>
          <p className="text-gray-600">Comprehensive insights and reports</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard
            title="Employee Growth"
            value="+12%"
            subtitle="vs last quarter"
            change="+2.5%"
            changeType="positive"
            icon={TrendingUp}
            iconColor="text-green-600"
          />
          <StatsCard
            title="Retention Rate"
            value="94.2%"
            subtitle="this year"
            change="+1.2%"
            changeType="positive"
            icon={Users}
            iconColor="text-blue-600"
          />
          <StatsCard
            title="Avg. Leave Days"
            value="14.5"
            subtitle="per employee"
            change="-0.8"
            changeType="positive"
            icon={Calendar}
            iconColor="text-purple-600"
          />
          <StatsCard
            title="Turnover Rate"
            value="5.8%"
            subtitle="this year"
            change="-0.5%"
            changeType="positive"
            icon={TrendingDown}
            iconColor="text-red-600"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="employees"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    name="Total Employees"
                  />
                  <Line
                    type="monotone"
                    dataKey="attendance"
                    stroke="hsl(var(--accent))"
                    strokeWidth={2}
                    name="Attendance %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Department Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Department Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="performance"
                    fill="hsl(var(--primary))"
                    name="Performance %"
                  />
                  <Bar
                    dataKey="satisfaction"
                    fill="hsl(var(--accent))"
                    name="Satisfaction %"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Attendance Chart */}
          <AttendanceChart />

          {/* Department Distribution */}
          <DepartmentChart />
        </div>

        {/* Detailed Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Employee Satisfaction
                </h4>
                <p className="text-2xl font-bold text-primary mb-1">87.3%</p>
                <p className="text-sm text-gray-500">Overall satisfaction score</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Training Completion
                </h4>
                <p className="text-2xl font-bold text-accent mb-1">92.1%</p>
                <p className="text-sm text-gray-500">Mandatory training completed</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Performance Rating
                </h4>
                <p className="text-2xl font-bold text-warning mb-1">4.2/5</p>
                <p className="text-sm text-gray-500">Average performance score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
