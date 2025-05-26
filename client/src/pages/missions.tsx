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
import { Plus, MapPin, Calendar, CheckCircle } from "lucide-react";

export default function Missions() {
  const { data: missions, isLoading } = useQuery({
    queryKey: ["/api/Missions"],
    queryFn: () => apiClient.getMissions(),
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
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
    <MainLayout title="Missions" breadcrumb="Home">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-secondary">Mission Management</h2>
            <p className="text-gray-600">Manage and track employee missions</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Mission
          </Button>
        </div>

        {/* Missions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Active Missions</CardTitle>
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
                      <TableHead>Mission</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(missions || []).map((mission: any) => (
                      <TableRow key={mission.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">
                              {mission.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {mission.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>Employee {mission.assignedTo}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                            {mission.location || "Not specified"}
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(mission.startDate)}</TableCell>
                        <TableCell>
                          {mission.endDate ? formatDate(mission.endDate) : "Ongoing"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={getStatusColor(mission.status)}
                          >
                            {mission.status.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {mission.status === "pending" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!missions || missions.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6">
                          <p className="text-gray-500">No missions found</p>
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
