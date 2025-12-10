import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye, Trash2, Plus, Edit, FileDown } from "lucide-react";
import EditAccommodationDialog from "@/components/admin/EditAccommodationDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Accommodation {
  id: string;
  name: string;
  municipality_city: string;
  province: string;
  contact_name: string;
  contact_email: string;
  status: string;
  created_at: string;
  number_of_units: number;
  imported_from_airbnb?: boolean;
}

const Admin = () => {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [filteredAccommodations, setFilteredAccommodations] = useState<Accommodation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAccommodation, setSelectedAccommodation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [accommodationToDelete, setAccommodationToDelete] = useState<string | null>(null);
  const [accommodationToEdit, setAccommodationToEdit] = useState<any>(null);

  useEffect(() => {
    fetchAccommodations();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = accommodations.filter(
        (acc) =>
          acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          acc.municipality_city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          acc.province.toLowerCase().includes(searchQuery.toLowerCase()) ||
          acc.contact_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredAccommodations(filtered);
    } else {
      setFilteredAccommodations(accommodations);
    }
  }, [searchQuery, accommodations]);

  const fetchAccommodations = async () => {
    try {
      const { data, error } = await supabase
        .from("accommodations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAccommodations(data || []);
      setFilteredAccommodations(data || []);
    } catch (error: any) {
      console.error("Error fetching accommodations:", error);
      toast.error("Failed to load accommodations");
    } finally {
      setLoading(false);
    }
  };

  const viewDetails = async (id: string) => {
    try {
      const { data: accommodation, error: accError } = await supabase
        .from("accommodations")
        .select("*")
        .eq("id", id)
        .single();

      if (accError) throw accError;

      const { data: unitTypes } = await supabase
        .from("unit_types")
        .select("*")
        .eq("accommodation_id", id);

      const { data: images } = await supabase
        .from("images")
        .select("*")
        .eq("accommodation_id", id);

      const { data: extraLinks } = await supabase
        .from("extra_links")
        .select("*")
        .eq("accommodation_id", id);

      setSelectedAccommodation({
        ...accommodation,
        unitTypes: unitTypes || [],
        images: images || [],
        extraLinks: extraLinks || [],
      });
      setViewDialogOpen(true);
    } catch (error: any) {
      console.error("Error fetching details:", error);
      toast.error("Failed to load accommodation details");
    }
  };

  const editAccommodation = async (id: string) => {
    try {
      const { data: accommodation, error: accError } = await supabase
        .from("accommodations")
        .select("*")
        .eq("id", id)
        .single();

      if (accError) throw accError;

      const { data: unitTypes } = await supabase
        .from("unit_types")
        .select("*")
        .eq("accommodation_id", id);

      const { data: images } = await supabase
        .from("images")
        .select("*")
        .eq("accommodation_id", id);

      setAccommodationToEdit({
        ...accommodation,
        unitTypes: unitTypes || [],
        images: images || [],
      });
      setEditDialogOpen(true);
    } catch (error: any) {
      console.error("Error fetching accommodation:", error);
      toast.error("Failed to load accommodation details");
    }
  };

  const handleDelete = async () => {
    if (!accommodationToDelete) return;

    try {
      const { error } = await supabase
        .from("accommodations")
        .delete()
        .eq("id", accommodationToDelete);

      if (error) throw error;

      toast.success("Accommodation deleted successfully");
      setDeleteDialogOpen(false);
      setAccommodationToDelete(null);
      fetchAccommodations();
    } catch (error: any) {
      console.error("Error deleting accommodation:", error);
      toast.error("Failed to delete accommodation");
    }
  };

  const confirmDelete = (id: string) => {
    setAccommodationToDelete(id);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              View and manage property submissions
            </p>
          </div>
          <Button onClick={() => window.location.href = '/register'}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Property
          </Button>
        </div>

        <Card className="p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search by name, location, or contact..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredAccommodations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No accommodations found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAccommodations.map((acc) => (
                    <TableRow key={acc.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {acc.name}
                          {acc.imported_from_airbnb && (
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                              Airbnb Import
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {acc.municipality_city}, {acc.province}
                      </TableCell>
                      <TableCell>{acc.number_of_units}</TableCell>
                      <TableCell>
                        <Badge
                          variant={acc.status === "pending" ? "secondary" : "default"}
                        >
                          {acc.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(acc.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => viewDetails(acc.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editAccommodation(acc.id)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => confirmDelete(acc.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        <Dialog open={viewDialogOpen} onOpenChange={(open) => {
          setViewDialogOpen(open);
          if (!open) setSelectedAccommodation(null);
        }}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedAccommodation?.name}</DialogTitle>
            </DialogHeader>
            {selectedAccommodation && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Contact Information</h3>
                  <p className="text-sm"><strong>Name:</strong> {selectedAccommodation.contact_name}</p>
                  <p className="text-sm"><strong>Email:</strong> {selectedAccommodation.contact_email}</p>
                  <p className="text-sm"><strong>Phone:</strong> {selectedAccommodation.contact_number}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Address</h3>
                  <p className="text-sm">
                    {selectedAccommodation.street_address}, {selectedAccommodation.barangay}, {selectedAccommodation.municipality_city}, {selectedAccommodation.province} {selectedAccommodation.zip_code}
                  </p>
                  <p className="text-sm"><strong>Region:</strong> {selectedAccommodation.region}</p>
                </div>

                {selectedAccommodation.unitTypes?.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Unit Types</h3>
                    <div className="space-y-2">
                      {selectedAccommodation.unitTypes.map((unit: any) => (
                        <div key={unit.id} className="flex justify-between text-sm bg-muted/50 p-2 rounded">
                          <span>{unit.unit_name}</span>
                          <span className="font-medium">₱{unit.price}/night</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedAccommodation.amenities?.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedAccommodation.amenities.map((amenity: string, index: number) => (
                        <Badge key={index} variant="secondary">{amenity}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedAccommodation.images?.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Images</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedAccommodation.images.map((img: any) => (
                        <img
                          key={img.id}
                          src={img.image_url}
                          alt="Property"
                          className="w-full h-32 object-cover rounded"
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold mb-2">Documents</h3>
                  <div className="space-y-2">
                    {selectedAccommodation.sec_download_url ? (
                      <a
                        href={selectedAccommodation.sec_download_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <FileDown className="w-4 h-4" />
                        SEC Download
                      </a>
                    ) : (
                      <p className="text-sm text-muted-foreground">SEC Download: Not uploaded</p>
                    )}
                    {selectedAccommodation.gis_document_url ? (
                      <a
                        href={selectedAccommodation.gis_document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <FileDown className="w-4 h-4" />
                        Updated GIS
                      </a>
                    ) : (
                      <p className="text-sm text-muted-foreground">Updated GIS: Not uploaded</p>
                    )}
                    {selectedAccommodation.permit_document_url ? (
                      <a
                        href={selectedAccommodation.permit_document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <FileDown className="w-4 h-4" />
                        Updated Permit
                      </a>
                    ) : (
                      <p className="text-sm text-muted-foreground">Updated Permit: Not uploaded</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the accommodation
                and all associated data (unit types, images, and links).
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {accommodationToEdit && (
          <EditAccommodationDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            accommodation={accommodationToEdit}
            onSuccess={() => {
              fetchAccommodations();
              setAccommodationToEdit(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Admin;