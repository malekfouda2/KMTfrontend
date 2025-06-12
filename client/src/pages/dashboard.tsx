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
    queryFn: async () => {
      try {
        const result = await apiClient.getDashboardStats();
        console.log('Dashboard stats fetched:', result);
        
        // Handle KMT backend response structure: { data: {...}, message: "...", success: true }
        if (result && typeof result === 'object' && 'data' in result) {
          return (result as { data: any }).data;
        }
        
        return result;
      } catch (error: any) {
        console.error('Error fetching dashboard stats:', error);
        // Return null to indicate no data available from backend
        return null;
      }
    },
    retry: false,
  });

  // Only show dashboard if we have actual data from backend
  const dashboardStats = stats;

  return (
    <MainLayout title="Dashboard" breadcrumb="Home">
      <div className="space-y-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : dashboardStats && dashboardStats.totalEmployees !== undefined ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AttendanceChart />
              <DepartmentChart />
            </div>

            {/* Recent Activities */}
            <RecentActivities />
          </>
        ) : (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Dashboard Data Not Available</h3>
                <p className="text-gray-600 mt-2">
                  The dashboard statistics endpoints are not yet implemented in the KMT backend.
                  <br />
                  Please implement the following endpoints:
                </p>
                <ul className="text-sm text-gray-500 mt-3 space-y-1 text-left">
                  <li>• GET /api/Dashboard/stats</li>
                  <li>• GET /api/Dashboard/attendance-trends</li>
                  <li>• GET /api/Dashboard/department-distribution</li>
                  <li>• GET /api/Dashboard/recent-activities</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
