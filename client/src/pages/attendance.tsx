import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { MainLayout } from "@/components/layout/MainLayout";
import { AttendanceTable } from "@/components/attendance/AttendanceTable";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LogIn,
  Clock,
  HourglassIcon,
  Plus,
  Download,
  Filter,
} from "lucide-react";

export default function Attendance() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [filters, setFilters] = useState({
    department: "",
    status: "",
  });

  const { data: attendanceData, isLoading } = useQuery({
    queryKey: ["/api/Attendance", selectedDate, filters],
    queryFn: () => apiClient.getAttendance({ 
      date: selectedDate,
      ...filters 
    }),
  });

  const attendanceRecords = Array.isArray(attendanceData) ? attendanceData : [];

  // Calculate summary stats
  const stats = {
    totalCheckins: attendanceRecords.length,
    lateArrivals: attendanceRecords.filter((r: any) => r.status === "late").length,
    pendingApproval: attendanceRecords.filter((r: any) => r.status === "pending").length,
    overtimeHours: attendanceRecords.reduce((sum: number, r: any) => 
      sum + (parseFloat(r.overtimeHours?.toString() || "0")), 0
    ),
  };

  return (
    <MainLayout title="Attendance Management" breadcrumb="Home">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-secondary">Attendance Management</h2>
            <p className="text-gray-600">Monitor and approve employee attendance records</p>
          </div>
          <div className="flex items-center space-x-4">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-40"
            />
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard
            title="Total Check-ins"
            value={stats.totalCheckins}
            icon={LogIn}
            iconColor="text-accent"
          />
          <StatsCard
            title="Late Arrivals"
            value={stats.lateArrivals}
            icon={Clock}
            iconColor="text-warning"
          />
          <StatsCard
            title="Pending Approval"
            value={stats.pendingApproval}
            icon={HourglassIcon}
            iconColor="text-info"
          />
          <StatsCard
            title="Overtime Hours"
            value={stats.overtimeHours.toFixed(1)}
            icon={Plus}
            iconColor="text-primary"
          />
        </div>

        {/* Attendance Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Today's Attendance</CardTitle>
              <div className="flex items-center space-x-2">
                <Select
                  value={filters.department}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, department: value }))
                  }
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-1" />
                  Filter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6">
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-3 w-1/4" />
                      </div>
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  ))}
                </div>
              </div>
            ) : attendanceRecords.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-500">No attendance records found for this date</p>
              </div>
            ) : (
              <AttendanceTable attendanceRecords={attendanceRecords} />
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
