import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, MapPin, User, Calendar, CheckCircle } from "lucide-react";
import { kmtApiClient } from "@/lib/kmt-api";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface CheckInOut {
  id: string;
  userId: string;
  userName: string;
  checkInAt: string;
  checkOutAt?: string;
  location?: string;
  note?: string;
  status: 'CheckedIn' | 'CheckedOut';
  createdAt: string;
}

export default function CheckInOut() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [isCheckOutModalOpen, setIsCheckOutModalOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch check-in/out records
  const { data: checkInOutData = [], isLoading } = useQuery({
    queryKey: ["/api/CheckInOut"],
    queryFn: () => kmtApiClient.getAllCheckInOut(),
    onError: (error: Error) => {
      console.error("Error fetching check-in/out records:", error);
      toast({
        title: "Error",
        description: "Failed to load check-in/out records",
        variant: "destructive",
      });
    },
  });

  // Fetch users for dropdown
  const { data: users = [] } = useQuery({
    queryKey: ["/api/User"],
    queryFn: () => kmtApiClient.getUsers(),
  });

  // Create check-in mutation
  const checkInMutation = useMutation({
    mutationFn: (data: any) => kmtApiClient.createCheckIn(data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Check-in recorded successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/CheckInOut"] });
      setIsCheckInModalOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to record check-in",
        variant: "destructive",
      });
    },
  });

  // Create check-out mutation
  const checkOutMutation = useMutation({
    mutationFn: (data: any) => kmtApiClient.createCheckOut(data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Check-out recorded successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/CheckInOut"] });
      setIsCheckOutModalOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to record check-out",
        variant: "destructive",
      });
    },
  });

  const filteredCheckInOut = checkInOutData.filter((record: CheckInOut) =>
    record.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCheckIn = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const checkInData = {
      userId: formData.get("userId"),
      location: formData.get("location"),
      note: formData.get("note"),
    };
    checkInMutation.mutate(checkInData);
  };

  const handleCheckOut = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const checkOutData = {
      userId: formData.get("userId"),
      location: formData.get("location"),
      note: formData.get("note"),
    };
    checkOutMutation.mutate(checkOutData);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CheckedIn':
        return <Badge variant="default" className="bg-green-100 text-green-800">Checked In</Badge>;
      case 'CheckedOut':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Checked Out</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Check-In/Check-Out</h1>
          <p className="text-gray-600 mt-2">Manage employee attendance and check-in/out records</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCheckInModalOpen} onOpenChange={setIsCheckInModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                Check In
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Record Check-In</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCheckIn} className="space-y-4">
                <div>
                  <Label htmlFor="userId">Employee</Label>
                  <Select name="userId" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user: any) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.username}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="Enter location"
                  />
                </div>
                <div>
                  <Label htmlFor="note">Note</Label>
                  <Textarea
                    id="note"
                    name="note"
                    placeholder="Optional note"
                    rows={3}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={checkInMutation.isPending}
                >
                  {checkInMutation.isPending ? "Recording..." : "Record Check-In"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isCheckOutModalOpen} onOpenChange={setIsCheckOutModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                <Clock className="w-4 h-4 mr-2" />
                Check Out
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Record Check-Out</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCheckOut} className="space-y-4">
                <div>
                  <Label htmlFor="userId">Employee</Label>
                  <Select name="userId" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user: any) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.username}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="Enter location"
                  />
                </div>
                <div>
                  <Label htmlFor="note">Note</Label>
                  <Textarea
                    id="note"
                    name="note"
                    placeholder="Optional note"
                    rows={3}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-red-600 hover:bg-red-700"
                  disabled={checkOutMutation.isPending}
                >
                  {checkOutMutation.isPending ? "Recording..." : "Record Check-Out"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Check-In/Check-Out Records
          </CardTitle>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex-1">
              <Input
                placeholder="Search by employee name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Check-In Time</TableHead>
                  <TableHead>Check-Out Time</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCheckInOut.map((record: CheckInOut) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        {record.userName}
                      </div>
                    </TableCell>
                    <TableCell>
                      {record.checkInAt ? (
                        <div className="text-sm">
                          {format(new Date(record.checkInAt), "HH:mm")}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {record.checkOutAt ? (
                        <div className="text-sm">
                          {format(new Date(record.checkOutAt), "HH:mm")}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        {record.location || "Not specified"}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(record.status)}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate text-sm">
                        {record.note || "No note"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        {format(new Date(record.createdAt), "MMM dd, yyyy")}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}