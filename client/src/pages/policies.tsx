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
import { Plus, Settings, Edit, Trash2 } from "lucide-react";

export default function Policies() {
  const { data: policies, isLoading } = useQuery({
    queryKey: ["/api/Policies"],
    queryFn: () => apiClient.getPolicies(),
  });

  const getPolicyTypeColor = (type: string) => {
    switch (type) {
      case "overtime":
        return "bg-blue-100 text-blue-800";
      case "vacation":
        return "bg-green-100 text-green-800";
      case "deduction":
        return "bg-red-100 text-red-800";
      case "bonus":
        return "bg-purple-100 text-purple-800";
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
    <MainLayout 
      title="Policies" 
      breadcrumb="Home"
      requiredRoles={["general_manager", "hr_manager"]}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-secondary">Policy Management</h2>
            <p className="text-gray-600">Manage HR policies and rules</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Policy
          </Button>
        </div>

        {/* Policy Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overtime Policies</p>
                  <p className="text-2xl font-bold text-secondary">3</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Settings className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Vacation Policies</p>
                  <p className="text-2xl font-bold text-secondary">2</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Settings className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Deduction Policies</p>
                  <p className="text-2xl font-bold text-secondary">4</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Settings className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Bonus Policies</p>
                  <p className="text-2xl font-bold text-secondary">2</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Settings className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Policies Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Policies</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6">
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-4 w-1/6" />
                      <Skeleton className="h-4 w-1/4" />
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
                      <TableHead>Policy Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(policies || []).map((policy: any) => (
                      <TableRow key={policy.id}>
                        <TableCell>
                          <div className="font-medium text-gray-900">
                            {policy.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={getPolicyTypeColor(policy.type)}
                          >
                            {policy.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-600 max-w-md truncate">
                            {policy.description}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={
                              policy.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {policy.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {formatDate(policy.updatedAt || policy.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!policies || policies.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6">
                          <p className="text-gray-500">No policies found</p>
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
