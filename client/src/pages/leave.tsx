import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Calendar, CheckCircle, XCircle } from "lucide-react";

export default function Leave() {
  const { data: leaveRequests, isLoading } = useQuery({
    queryKey: ["/api/LeaveRequests"],
    queryFn: () => apiClient.getLeaveRequests(),
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case "vacation":
        return "bg-blue-100 text-blue-800";
      case "sick":
        return "bg-red-100 text-red-800";
      case "personal":
        return "bg-purple-100 text-purple-800";
      case "emergency":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <MainLayout title="Leave Management" breadcrumb="Home">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-secondary">Leave Management</h2>
            <p className="text-gray-600">Manage employee leave requests and approvals</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Leave Request
          </Button>
        </div>

        {/* Leave Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle>Leave Requests</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6">
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-4 w-1/6" />
                      <Skeleton className="h-4 w-1/6" />
                      <Skeleton className="h-4 w-1/6" />
                      <Skeleton className="h-4 w-1/6" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Leave Type</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Days</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(leaveRequests || []).map((request: any) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">
                              Employee {request.employeeId}
                            </div>
                            <div className="text-sm text-gray-500">
                              {request.reason}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={getLeaveTypeColor(request.leaveType)}
                          >
                            {request.leaveType}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(request.startDate)}</TableCell>
                        <TableCell>{formatDate(request.endDate)}</TableCell>
                        <TableCell>{request.days}</TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={getStatusColor(request.status)}
                          >
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {request.status === "pending" && (
                            <div className="flex items-center justify-end space-x-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-600 hover:text-red-700"
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!leaveRequests || leaveRequests.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6">
                          <p className="text-gray-500">No leave requests found</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
