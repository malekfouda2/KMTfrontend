import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  UserCheck,
  Calendar,
  Briefcase,
  UserPlus,
} from "lucide-react";

const activityIconMap = {
  checkin: UserCheck,
  leave_request: Calendar,
  mission: Briefcase,
  new_employee: UserPlus,
};

const activityTypeMap = {
  checkin: { label: "Check-in", color: "bg-accent" },
  leave_request: { label: "Leave Request", color: "bg-warning" },
  mission: { label: "Mission", color: "bg-info" },
  new_employee: { label: "New Employee", color: "bg-accent" },
};

export const RecentActivities = () => {
  const { data: activities, isLoading } = useQuery({
    queryKey: ["/api/Dashboard/recent-activities"],
    queryFn: () => apiClient.getRecentActivities(10),
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const activityData = activities || [
    {
      id: 1,
      type: "checkin",
      title: "John Smith checked in",
      time: "2 minutes ago",
      user: { name: "John Smith", initials: "JS" },
    },
    {
      id: 2,
      type: "leave_request",
      title: "Sarah Wilson submitted leave request",
      time: "15 minutes ago",
      user: { name: "Sarah Wilson", initials: "SW" },
    },
    {
      id: 3,
      type: "mission",
      title: "New mission assigned to Development Team",
      time: "1 hour ago",
      user: { name: "System", initials: "SY" },
    },
    {
      id: 4,
      type: "new_employee",
      title: "New employee added: Mike Johnson",
      time: "3 hours ago",
      user: { name: "HR System", initials: "HR" },
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Activities</CardTitle>
          <Button variant="ghost" size="sm" className="text-primary">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activityData.map((activity, index) => {
            const Icon = activityIconMap[activity.type as keyof typeof activityIconMap];
            const typeConfig = activityTypeMap[activity.type as keyof typeof activityTypeMap];

            return (
              <div
                key={activity.id}
                className={`flex items-center space-x-4 py-3 ${
                  index < activityData.length - 1 ? "border-b" : ""
                }`}
              >
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-gray-100">
                    <Icon className="w-4 h-4 text-gray-600" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium text-secondary">
                    {activity.title}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
                <Badge
                  variant="secondary"
                  className={`${typeConfig.color} bg-opacity-10 text-xs`}
                >
                  {typeConfig.label}
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
