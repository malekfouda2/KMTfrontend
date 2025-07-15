import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, Edit, Trash2, MoreHorizontal, Briefcase, Users } from "lucide-react";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const titleSchema = z.object({
  name: z.string().min(1, "Title name is required"),
  nameAr: z.string().min(1, "Arabic title name is required"),
  description: z.string().min(1, "Description is required"),
  descriptionAr: z.string().min(1, "Arabic description is required"),
});

type TitleFormData = z.infer<typeof titleSchema>;

interface Title {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  employeeCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export default function Titles() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState<Title | null>(null);
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<TitleFormData>({
    resolver: zodResolver(titleSchema),
    defaultValues: {
      name: "",
      nameAr: "",
      description: "",
      descriptionAr: "",
    },
  });

  const editForm = useForm<TitleFormData>({
    resolver: zodResolver(titleSchema),
    defaultValues: {
      name: "",
      nameAr: "",
      description: "",
      descriptionAr: "",
    },
  });

  // Fetch titles
  const { data: titlesData = [], isLoading, error } = useQuery({
    queryKey: ['/api/Title'],
    queryFn: async () => {
      try {
        const result = await apiClient.getTitles({ pageSize: 100 });
        console.log('Titles fetched:', result);
        return Array.isArray(result) ? result : [];
      } catch (error: any) {
        console.error('Error fetching titles:', error);
        return [];
      }
    },
    retry: false,
  });

  // Filter titles based on search
  const titles = titlesData.filter((title: Title) =>
    title.name.toLowerCase().includes(search.toLowerCase()) ||
    title.nameAr.toLowerCase().includes(search.toLowerCase()) ||
    title.description.toLowerCase().includes(search.toLowerCase())
  );

  // Create title mutation
  const createTitleMutation = useMutation({
    mutationFn: (data: TitleFormData) => {
      return apiClient.createTitle(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/Title'] });
      toast({
        title: "Success",
        description: "Title created successfully",
      });
      setShowAddModal(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create title",
        variant: "destructive",
      });
    },
  });

  // Update title mutation
  const updateTitleMutation = useMutation({
    mutationFn: (data: { id: string; title: TitleFormData }) => {
      return apiClient.updateTitle(data.id, data.title);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/Title'] });
      toast({
        title: "Success",
        description: "Title updated successfully",
      });
      setShowEditModal(false);
      editForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update title",
        variant: "destructive",
      });
    },
  });

  // Delete title mutation
  const deleteTitleMutation = useMutation({
    mutationFn: (id: string) => {
      return apiClient.deleteTitle(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/Title'] });
      toast({
        title: "Success",
        description: "Title deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete title",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: TitleFormData) => {
    createTitleMutation.mutate(data);
  };

  const onEditSubmit = (data: TitleFormData) => {
    if (!selectedTitle) return;
    updateTitleMutation.mutate({ id: selectedTitle.id, title: data });
  };

  const handleEdit = (title: Title) => {
    setSelectedTitle(title);
    editForm.reset({
      name: title.name,
      nameAr: title.nameAr,
      description: title.description,
      descriptionAr: title.descriptionAr,
    });
    setShowEditModal(true);
  };

  const handleDelete = (title: Title) => {
    if (confirm(`Are you sure you want to delete the title "${title.name}"?`)) {
      deleteTitleMutation.mutate(title.id);
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <p className="text-red-600">Error loading titles: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Job Titles Management</h1>
          <p className="text-gray-600">Manage job titles and positions within your organization</p>
        </div>
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Title
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Title</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title Name (English)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Software Engineer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nameAr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title Name (Arabic)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., مهندس برمجيات" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (English)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Job description and responsibilities" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="descriptionAr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Arabic)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="وصف الوظيفة والمسؤوليات" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createTitleMutation.isPending}>
                    {createTitleMutation.isPending ? "Creating..." : "Create Title"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search Titles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Search titles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Titles Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Job Titles ({titles.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading titles...</div>
          ) : titles.length === 0 ? (
            <div className="text-center py-8">No titles found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title Name</TableHead>
                  <TableHead>Arabic Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {titles.map((title: Title) => (
                  <TableRow key={title.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{title.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{title.nameAr}</TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={title.description}>
                        {title.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {title.employeeCount || 0}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(title.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(title)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(title)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Title Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Title</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title Name (English)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Software Engineer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="nameAr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title Name (Arabic)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., مهندس برمجيات" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (English)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Job description and responsibilities" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="descriptionAr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Arabic)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="وصف الوظيفة والمسؤوليات" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateTitleMutation.isPending}>
                  {updateTitleMutation.isPending ? "Updating..." : "Update Title"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}