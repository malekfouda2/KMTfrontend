import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { AttendanceChart } from "@/components/dashboard/AttendanceChart";
import { DepartmentChart } from "@/components/dashboard/DepartmentChart";
import { RecentActivities } from "@/components/dashboard/RecentActivities";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  CheckCircle,
  CalendarX,
  Briefcase,
} from "lucide-react";

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/Dashboard/stats"],
    queryFn: () => apiClient.getDashboardStats(),
  });

  const defaultStats = {
    totalEmployees: 247,
    presentToday: 234,
    onLeave: 8,
    activeMissions: 15,
    attendanceRate: 94.7,
    pendingApprovals: 5,
    overtimeHours: 23.5,
  };

  const dashboardStats = stats || defaultStats;

  return (
    <MainLayout title="Dashboard" breadcrumb="Home">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            <>
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </>
          ) : (
            <>
              <StatsCard
                title="Total Employees"
                value={dashboardStats.totalEmployees}
                change="+12%"
                changeType="positive"
                subtitle="from last month"
                icon={Users}
                iconColor="text-primary"
              />
              <StatsCard
                title="Present Today"
                value={dashboardStats.presentToday}
                change={`${dashboardStats.attendanceRate}%`}
                changeType="positive"
                subtitle="attendance rate"
                icon={CheckCircle}
                iconColor="text-accent"
              />
              <StatsCard
                title="On Leave"
                value={dashboardStats.onLeave}
                change="3.2%"
                changeType="neutral"
                subtitle="of workforce"
                icon={CalendarX}
                iconColor="text-warning"
              />
              <StatsCard
                title="Active Missions"
                value={dashboardStats.activeMissions}
                change={`${dashboardStats.pendingApprovals} pending`}
                changeType="neutral"
                subtitle="approval"
                icon={Briefcase}
                iconColor="text-info"
              />
            </>
          )}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AttendanceChart />
          <DepartmentChart />
        </div>

        {/* Recent Activities */}
        <RecentActivities />
      </div>
    </MainLayout>
  );
}
