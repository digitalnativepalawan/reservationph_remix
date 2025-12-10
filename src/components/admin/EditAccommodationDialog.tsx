import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Plus, X, Wifi, Wind, Droplets, Utensils, Waves, Dumbbell, Car, Briefcase, Coffee, Tv, Home, Upload } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WiFiDialog, { WiFiData } from "../registration/WiFiDialog";

interface EditAccommodationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accommodation: any;
  onSuccess: () => void;
}

const amenityOptions = [
  { name: "Wi-Fi", icon: Wifi },
  { name: "Aircon", icon: Wind },
  { name: "Hot Water", icon: Droplets },
  { name: "Kitchen", icon: Utensils },
  { name: "Pool", icon: Waves },
  { name: "Gym", icon: Dumbbell },
  { name: "Parking", icon: Car },
  { name: "Workspace", icon: Briefcase },
  { name: "Coffee/Tea", icon: Coffee },
  { name: "Netflix", icon: Tv },
  { name: "Balcony/Terrace", icon: Home },
];

const EditAccommodationDialog = ({ open, onOpenChange, accommodation, onSuccess }: EditAccommodationDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [resortTitle, setResortTitle] = useState("");
  const [name, setName] = useState("");
  const [numberOfUnits, setNumberOfUnits] = useState(0);
  const [street, setStreet] = useState("");
  const [barangay, setBarangay] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [province, setProvince] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [region, setRegion] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [website, setWebsite] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [googleMaps, setGoogleMaps] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [unitTypes, setUnitTypes] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [editingUnitIndex, setEditingUnitIndex] = useState<number | null>(null);
  const [editUnit, setEditUnit] = useState({ unit_name: "", price: "" });
  const [wifiDialogOpen, setWifiDialogOpen] = useState(false);
  const [wifiData, setWifiData] = useState<WiFiData>({
    providers: [],
    downloadSpeed: "",
    uploadSpeed: "",
    ping: "",
    jitter: "",
  });

  useEffect(() => {
    if (accommodation) {
      setResortTitle(accommodation.resort_title || "");
      setName(accommodation.name || "");
      setNumberOfUnits(accommodation.number_of_units || 0);
      setStreet(accommodation.street_address || "");
      setBarangay(accommodation.barangay || "");
      setMunicipality(accommodation.municipality_city || "");
      setProvince(accommodation.province || "");
      setZipCode(accommodation.zip_code || "");
      setRegion(accommodation.region || "");
      setSelectedAmenities(accommodation.amenities || []);
      setWebsite(accommodation.website || "");
      setFacebook(accommodation.facebook_page || "");
      setInstagram(accommodation.instagram || "");
      setGoogleMaps(accommodation.google_maps_link || "");
      setContactName(accommodation.contact_name || "");
      setContactEmail(accommodation.contact_email || "");
      setContactNumber(accommodation.contact_number || "");
      setUnitTypes(accommodation.unitTypes || []);
      setImages(accommodation.images || []);
      setWifiData({
        providers: accommodation.wifi_providers || [],
        downloadSpeed: accommodation.wifi_download_speed?.toString() || "",
        uploadSpeed: accommodation.wifi_upload_speed?.toString() || "",
        ping: accommodation.wifi_ping?.toString() || "",
        jitter: accommodation.wifi_jitter?.toString() || "",
      });
    }
  }, [accommodation]);

  const toggleAmenity = (amenity: string) => {
    if (amenity === "Wi-Fi") {
      if (selectedAmenities.includes("Wi-Fi")) {
        setSelectedAmenities(selectedAmenities.filter((a) => a !== "Wi-Fi"));
        setWifiData({
          providers: [],
          downloadSpeed: "",
          uploadSpeed: "",
          ping: "",
          jitter: "",
        });
      } else {
        setSelectedAmenities([...selectedAmenities, "Wi-Fi"]);
        setWifiDialogOpen(true);
      }
    } else {
      if (selectedAmenities.includes(amenity)) {
        setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
      } else {
        setSelectedAmenities([...selectedAmenities, amenity]);
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from("property-images")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("property-images")
          .getPublicUrl(filePath);

        return publicUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      // Insert images into database
      const imagesData = uploadedUrls.map((url) => ({
        accommodation_id: accommodation.id,
        image_url: url,
      }));

      const { data: newImages, error: imgError } = await supabase
        .from("images")
        .insert(imagesData)
        .select();

      if (imgError) throw imgError;

      setImages([...images, ...newImages]);
      toast.success(`${uploadedUrls.length} image(s) uploaded successfully`);
    } catch (error: any) {
      console.error("Error uploading images:", error);
      toast.error("Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      const { error } = await supabase
        .from("images")
        .delete()
        .eq("id", imageId);

      if (error) throw error;

      setImages(images.filter((img) => img.id !== imageId));
      toast.success("Image deleted");
    } catch (error: any) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
    }
  };

  const addUnitType = () => {
    setUnitTypes([...unitTypes, { unit_name: "", price: 0, isNew: true }]);
  };

  const updateUnitType = (index: number, field: string, value: any) => {
    const updated = [...unitTypes];
    updated[index] = { ...updated[index], [field]: value };
    setUnitTypes(updated);
  };

  const removeUnitType = async (index: number) => {
    const unit = unitTypes[index];
    if (unit.id) {
      try {
        const { error } = await supabase
          .from("unit_types")
          .delete()
          .eq("id", unit.id);

        if (error) throw error;
        toast.success("Unit type deleted");
      } catch (error: any) {
        console.error("Error deleting unit type:", error);
        toast.error("Failed to delete unit type");
        return;
      }
    }
    setUnitTypes(unitTypes.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Update accommodation
      const { error: updateError } = await supabase
        .from("accommodations")
        .update({
          resort_title: resortTitle || null,
          name,
          number_of_units: numberOfUnits,
          street_address: street,
          barangay,
          municipality_city: municipality,
          province,
          zip_code: zipCode,
          region,
          amenities: selectedAmenities,
          website: website || null,
          facebook_page: facebook || null,
          instagram: instagram || null,
          google_maps_link: googleMaps || null,
          contact_name: contactName,
          contact_email: contactEmail,
          contact_number: contactNumber,
          wifi_providers: wifiData.providers,
          wifi_download_speed: wifiData.downloadSpeed ? parseFloat(wifiData.downloadSpeed) : null,
          wifi_upload_speed: wifiData.uploadSpeed ? parseFloat(wifiData.uploadSpeed) : null,
          wifi_ping: wifiData.ping ? parseFloat(wifiData.ping) : null,
          wifi_jitter: wifiData.jitter ? parseFloat(wifiData.jitter) : null,
        })
        .eq("id", accommodation.id);

      if (updateError) throw updateError;

      // Handle unit types
      for (const unit of unitTypes) {
        if (unit.isNew) {
          const { error } = await supabase
            .from("unit_types")
            .insert({
              accommodation_id: accommodation.id,
              unit_name: unit.unit_name,
              price: unit.price,
            });
          if (error) throw error;
        } else if (unit.id) {
          const { error } = await supabase
            .from("unit_types")
            .update({
              unit_name: unit.unit_name,
              price: unit.price,
            })
            .eq("id", unit.id);
          if (error) throw error;
        }
      }

      toast.success("Accommodation updated successfully");
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error updating accommodation:", error);
      toast.error("Failed to update accommodation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Accommodation</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="amenities">Amenities</TabsTrigger>
              <TabsTrigger value="units">Unit Types</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label>Resort or Property Title</Label>
                  <Input 
                    value={resortTitle} 
                    onChange={(e) => setResortTitle(e.target.value)} 
                    placeholder="e.g., Binga Beach Resort"
                  />
                  <p className="text-xs text-muted-foreground">The official name of your resort or property</p>
                </div>
                <div className="space-y-2">
                  <Label>Property Name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Number of Units</Label>
                  <Input type="number" value={numberOfUnits} onChange={(e) => setNumberOfUnits(parseInt(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label>Street Address</Label>
                  <Input value={street} onChange={(e) => setStreet(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Barangay</Label>
                  <Input value={barangay} onChange={(e) => setBarangay(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Municipality/City</Label>
                  <Input value={municipality} onChange={(e) => setMunicipality(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Province</Label>
                  <Input value={province} onChange={(e) => setProvince(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Zip Code</Label>
                  <Input value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Region</Label>
                  <Input value={region} onChange={(e) => setRegion(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Contact Name</Label>
                  <Input value={contactName} onChange={(e) => setContactName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Contact Email</Label>
                  <Input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Contact Number</Label>
                  <Input value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Website</Label>
                  <Input value={website} onChange={(e) => setWebsite(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Facebook</Label>
                  <Input value={facebook} onChange={(e) => setFacebook(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Instagram</Label>
                  <Input value={instagram} onChange={(e) => setInstagram(e.target.value)} />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Google Maps Link</Label>
                  <Input value={googleMaps} onChange={(e) => setGoogleMaps(e.target.value)} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="amenities" className="space-y-4 mt-4">
              <div className="grid grid-cols-3 gap-3">
                {amenityOptions.map((amenity) => {
                  const Icon = amenity.icon;
                  const isSelected = selectedAmenities.includes(amenity.name);
                  return (
                    <div key={amenity.name} className="relative">
                      <button
                        type="button"
                        onClick={() => toggleAmenity(amenity.name)}
                        className={`w-full flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                          isSelected
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                        <span className="text-sm font-medium text-center">{amenity.name}</span>
                      </button>
                      {amenity.name === "Wi-Fi" && isSelected && (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => setWifiDialogOpen(true)}
                          className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs h-6 px-2"
                        >
                          Configure
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="units" className="space-y-4 mt-4">
              <Button type="button" onClick={addUnitType} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Unit Type
              </Button>
              <div className="space-y-3">
                {unitTypes.map((unit, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex gap-3 items-end">
                      <div className="flex-1 space-y-2">
                        <Label>Unit Name</Label>
                        <Input
                          value={unit.unit_name}
                          onChange={(e) => updateUnitType(index, "unit_name", e.target.value)}
                          placeholder="e.g., Deluxe Room"
                        />
                      </div>
                      <div className="w-32 space-y-2">
                        <Label>Price/Night</Label>
                        <Input
                          type="number"
                          value={unit.price}
                          onChange={(e) => updateUnitType(index, "price", parseFloat(e.target.value))}
                          placeholder="0"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeUnitType(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="images" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="image-upload">Upload Images</Label>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="mt-2"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {images.map((img) => (
                    <div key={img.id} className="relative group">
                      <img
                        src={img.image_url}
                        alt="Property"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDeleteImage(img.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <WiFiDialog
        open={wifiDialogOpen}
        onOpenChange={setWifiDialogOpen}
        onSave={(data) => {
          setWifiData(data);
          toast.success("Wi-Fi configuration saved");
        }}
        initialData={wifiData}
      />
    </>
  );
};

export default EditAccommodationDialog;
