import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export const AttendanceChart = () => {
  const { data: attendanceTrends, isLoading } = useQuery({
    queryKey: ["/api/Dashboard/attendance-trends"],
    queryFn: () => apiClient.getAttendanceTrends(7),
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Attendance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const chartData = attendanceTrends || [
    { day: "Mon", present: 234, late: 12 },
    { day: "Tue", present: 241, late: 8 },
    { day: "Wed", present: 238, late: 15 },
    { day: "Thu", present: 245, late: 7 },
    { day: "Fri", present: 239, late: 11 },
    { day: "Sat", present: 156, late: 5 },
    { day: "Sun", present: 89, late: 3 },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Attendance Trends</CardTitle>
          <Select defaultValue="7">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 3 months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="present"
              stroke="hsl(var(--accent))"
              strokeWidth={2}
              name="Present"
            />
            <Line
              type="monotone"
              dataKey="late"
              stroke="hsl(var(--warning))"
              strokeWidth={2}
              name="Late"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
