import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useToast } from "@/hooks/use-toast";
import { Plus, FileText, Edit, Trash2, Calendar } from "lucide-react";

export default function Policies() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: policiesData, isLoading } = useQuery({
    queryKey: ["/api/Policies", search],
    queryFn: async () => {
      try {
        const result = await apiClient.getPolicies({ search });
        console.log('Policies fetched:', result);
        
        // Handle KMT backend response structure: { data: [...], message: "...", success: true }
        if (result && typeof result === 'object' && 'data' in result) {
          const responseData = (result as { data: any[] }).data;
          if (Array.isArray(responseData)) {
            return responseData;
          }
        }
        
        // If response is already an array, return as is
        if (Array.isArray(result)) {
          return result;
        }
        
        return [];
      } catch (error: any) {
        console.error('Error fetching policies:', error);
        throw error;
      }
    },
    retry: false,
  });

  const policies = Array.isArray(policiesData) ? policiesData : [];

  const createPolicyMutation = useMutation({
    mutationFn: (policy: any) => apiClient.createPolicy(policy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/Policies"] });
      setShowCreateModal(false);
      toast({
        title: "Success",
        description: "Policy created successfully",
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

  const deletePolicyMutation = useMutation({
    mutationFn: (id: number) => apiClient.deletePolicy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/Policies"] });
      toast({
        title: "Success",
        description: "Policy deleted successfully",
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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <MainLayout 
      title="Policy Management" 
      breadcrumb="Home"
      requiredRoles={["general_manager", "hr_manager"]}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-secondary">Policy Management</h2>
            <p className="text-gray-600">Manage company policies and procedures</p>
          </div>
          <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Policy
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Policy</DialogTitle>
                <DialogDescription>
                  Add a new company policy or procedure
                </DialogDescription>
              </DialogHeader>
              <CreatePolicyForm 
                onSubmit={(data) => createPolicyMutation.mutate(data)}
                isLoading={createPolicyMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="max-w-md">
              <Label htmlFor="search">Search Policies</Label>
              <Input
                id="search"
                placeholder="Search by title or content..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Policies Table */}
        <Card>
          <CardHeader>
            <CardTitle>Company Policies</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="w-8 h-8 rounded" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                ))}
              </div>
            ) : policies.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No policies found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Effective Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {policies.map((policy: any) => (
                    <TableRow key={policy.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{policy.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {policy.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {policy.category || "General"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          {policy.effectiveDate ? formatDate(policy.effectiveDate) : "N/A"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            policy.isActive ? 
                            "bg-green-100 text-green-800" : 
                            "bg-gray-100 text-gray-800"
                          }
                        >
                          {policy.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => deletePolicyMutation.mutate(policy.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

// Create Policy Form Component
function CreatePolicyForm({ onSubmit, isLoading }: any) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "",
    effectiveDate: "",
    isActive: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Policy Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>
      
      <div>
        <Label htmlFor="content">Policy Content</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          rows={6}
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            placeholder="e.g., HR, IT, Safety"
          />
        </div>
        <div>
          <Label htmlFor="effectiveDate">Effective Date</Label>
          <Input
            id="effectiveDate"
            type="date"
            value={formData.effectiveDate}
            onChange={(e) => setFormData(prev => ({ ...prev, effectiveDate: e.target.value }))}
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Policy"}
        </Button>
      </div>
    </form>
  );
}