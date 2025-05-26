import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { Attendance } from "@/types";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Check, Eye } from "lucide-react";

interface AttendanceTableProps {
  attendanceRecords: Attendance[];
}

export const AttendanceTable = ({ attendanceRecords }: AttendanceTableProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const approveAttendanceMutation = useMutation({
    mutationFn: (id: number) => apiClient.approveAttendance(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/Attendance"] });
      toast({
        title: "Success",
        description: "Attendance approved successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800";
      case "late":
        return "bg-yellow-100 text-yellow-800";
      case "absent":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatTime = (time: string | null) => {
    if (!time) return "-";
    return new Date(time).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateWorkingHours = (checkIn: string | null, checkOut: string | null) => {
    if (!checkIn || !checkOut) return "-";
    
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = end.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Check-in</TableHead>
            <TableHead>Check-out</TableHead>
            <TableHead>Working Hours</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendanceRecords.map((record) => (
            <TableRow key={record.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gray-300 text-gray-600">
                      {/* This would normally come from employee data */}
                      EM
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Employee {record.employeeId}
                    </div>
                    <div className="text-xs text-gray-500">
                      Department
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{formatTime(record.checkIn)}</TableCell>
              <TableCell>{formatTime(record.checkOut)}</TableCell>
              <TableCell>
                {calculateWorkingHours(record.checkIn, record.checkOut)}
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={getStatusColor(record.status)}
                >
                  {record.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-2">
                  {record.status === "pending" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => approveAttendanceMutation.mutate(record.id)}
                      disabled={approveAttendanceMutation.isPending}
                      className="text-accent hover:text-accent"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-info hover:text-info"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
