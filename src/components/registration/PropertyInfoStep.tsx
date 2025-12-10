import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, Upload } from "lucide-react";
import { PropertyInfo, UnitType } from "@/types/registration";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AirbnbImport } from "./AirbnbImport";

const schema = z.object({
  resortTitle: z.string().optional(),
  name: z.string().min(1, "Property name is required"),
  numberOfUnits: z.coerce.number().min(1, "Must have at least 1 unit"),
  street: z.string().min(1, "Street address is required"),
  barangay: z.string().min(1, "Barangay is required"),
  municipality: z.string().min(1, "Municipality/City is required"),
  province: z.string().min(1, "Province is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  region: z.string().min(1, "Region is required"),
});

interface PropertyInfoStepProps {
  onNext: (data: PropertyInfo) => void;
  initialData: PropertyInfo | null;
}

const regions = [
  "NCR", "CAR", "Region I", "Region II", "Region III", "Region IV-A", 
  "Region IV-B", "Region V", "Region VI", "Region VII", "Region VIII",
  "Region IX", "Region X", "Region XI", "Region XII", "Region XIII", "BARMM"
];

const PropertyInfoStep = ({ onNext, initialData }: PropertyInfoStepProps) => {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>(initialData?.imageUrls || []);
  const [unitTypes, setUnitTypes] = useState<UnitType[]>(initialData?.unitTypes || []);
  const [newUnit, setNewUnit] = useState({ name: "", price: "" });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editUnit, setEditUnit] = useState({ name: "", price: "" });
  const [uploading, setUploading] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialData ? {
      resortTitle: (initialData as any).resortTitle || "",
      name: initialData.name,
      numberOfUnits: initialData.numberOfUnits,
      street: initialData.address.street,
      barangay: initialData.address.barangay,
      municipality: initialData.address.municipality,
      province: initialData.address.province,
      zipCode: initialData.address.zipCode,
      region: initialData.address.region,
    } : {},
  });

  const selectedRegion = watch("region");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (imageFiles.length + files.length > 15) {
      toast.error("Maximum 15 images allowed");
      return;
    }

    setUploading(true);
    const uploadedUrls: string[] = [];

    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('property-images')
        .upload(filePath, file);

      if (uploadError) {
        toast.error(`Failed to upload ${file.name}`);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(filePath);

      uploadedUrls.push(publicUrl);
    }

    setImageUrls([...imageUrls, ...uploadedUrls]);
    setImageFiles([...imageFiles, ...files]);
    setUploading(false);
    toast.success(`${uploadedUrls.length} image(s) uploaded`);
  };

  const removeImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };

  const addUnitType = () => {
    if (!newUnit.name || !newUnit.price) {
      toast.error("Please fill in unit name and price");
      return;
    }
    setUnitTypes([...unitTypes, { name: newUnit.name, price: parseFloat(newUnit.price) }]);
    setNewUnit({ name: "", price: "" });
    toast.success("Unit type added");
  };

  const removeUnitType = (index: number) => {
    setUnitTypes(unitTypes.filter((_, i) => i !== index));
  };

  const startEditUnit = (index: number) => {
    setEditingIndex(index);
    setEditUnit({
      name: unitTypes[index].name,
      price: unitTypes[index].price.toString(),
    });
  };

  const saveEditUnit = () => {
    if (!editUnit.name || !editUnit.price || editingIndex === null) {
      toast.error("Please fill in unit name and price");
      return;
    }
    const updatedUnits = [...unitTypes];
    updatedUnits[editingIndex] = {
      name: editUnit.name,
      price: parseFloat(editUnit.price),
    };
    setUnitTypes(updatedUnits);
    setEditingIndex(null);
    setEditUnit({ name: "", price: "" });
    toast.success("Unit type updated");
  };

  const cancelEditUnit = () => {
    setEditingIndex(null);
    setEditUnit({ name: "", price: "" });
  };

  const onSubmit = (data: any) => {
    const propertyInfo: PropertyInfo = {
      resortTitle: data.resortTitle || "",
      name: data.name,
      numberOfUnits: data.numberOfUnits,
      address: {
        street: data.street,
        barangay: data.barangay,
        municipality: data.municipality,
        province: data.province,
        zipCode: data.zipCode,
        region: data.region,
      },
      imageUrls,
      unitTypes,
    } as any;
    onNext(propertyInfo);
  };

  const handleAirbnbImport = (listings: any[]) => {
    if (listings.length === 0) return;

    // Use the first listing for property info
    const firstListing = listings[0];
    
    if (firstListing.name) {
      setValue("name", firstListing.name);
    }
    
    if (firstListing.location) {
      setValue("municipality", firstListing.location.city || "");
      setValue("province", firstListing.location.province || "");
    }

    // Add all listings as unit types
    const newUnits: UnitType[] = listings.map(listing => ({
      name: listing.name || "Imported Unit",
      price: listing.price || 0,
    }));
    
    setUnitTypes([...unitTypes, ...newUnits]);

    // Add all images from all listings
    const allImages = listings.flatMap(listing => listing.images || []);
    if (allImages.length > 0) {
      setImageUrls([...imageUrls, ...allImages.slice(0, 15 - imageUrls.length)]);
      toast.success(`Imported ${listings.length} listing(s) with ${allImages.length} images`);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-8">
        {/* Airbnb Import */}
        <AirbnbImport onImport={handleAirbnbImport} />

        <Card className="p-6 sm:p-8 space-y-8">
          {/* Basic Details */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Basic Details</h2>
          
          <div className="space-y-2">
            <Label htmlFor="resortTitle">Resort or Property Title (Optional)</Label>
            <Input 
              id="resortTitle" 
              {...register("resortTitle")} 
              placeholder="e.g., Binga Beach Resort" 
            />
            <p className="text-xs text-muted-foreground">The official name of your resort or property</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Accommodation Name *</Label>
            <Input id="name" {...register("name")} placeholder="e.g., Sunset Beach Resort" />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="numberOfUnits">Number of Units *</Label>
            <Input id="numberOfUnits" type="number" {...register("numberOfUnits")} placeholder="10" />
            {errors.numberOfUnits && <p className="text-sm text-destructive">{errors.numberOfUnits.message}</p>}
          </div>
        </div>

        {/* Address */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Address</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="street">Street Address *</Label>
              <Input id="street" {...register("street")} placeholder="123 Main Street" />
              {errors.street && <p className="text-sm text-destructive">{errors.street.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="barangay">Barangay *</Label>
              <Input id="barangay" {...register("barangay")} placeholder="Barangay Name" />
              {errors.barangay && <p className="text-sm text-destructive">{errors.barangay.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="municipality">Municipality/City *</Label>
              <Input id="municipality" {...register("municipality")} placeholder="City Name" />
              {errors.municipality && <p className="text-sm text-destructive">{errors.municipality.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="province">Province *</Label>
              <Input id="province" {...register("province")} placeholder="Province Name" />
              {errors.province && <p className="text-sm text-destructive">{errors.province.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">Zip Code *</Label>
              <Input id="zipCode" {...register("zipCode")} placeholder="1000" />
              {errors.zipCode && <p className="text-sm text-destructive">{errors.zipCode.message}</p>}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="region">Region *</Label>
              <Select value={selectedRegion} onValueChange={(value) => setValue("region", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.region && <p className="text-sm text-destructive">{errors.region.message}</p>}
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Property Images</h2>
          <p className="text-sm text-muted-foreground">Upload up to 15 images (drag & drop)</p>
          
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                disabled={uploading || imageUrls.length >= 15}
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm font-medium">
                  {uploading ? "Uploading..." : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG up to 10MB ({imageUrls.length}/15)
                </p>
              </label>
            </div>

            {imageUrls.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Property ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Unit Types */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Unit Types & Pricing</h2>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Unit name (e.g., Deluxe Room)"
                value={newUnit.name}
                onChange={(e) => setNewUnit({ ...newUnit, name: e.target.value })}
                className="flex-1"
              />
              <Input
                type="number"
                placeholder="Price per night"
                value={newUnit.price}
                onChange={(e) => setNewUnit({ ...newUnit, price: e.target.value })}
                className="w-32"
              />
              <Button type="button" onClick={addUnitType} size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {unitTypes.length > 0 && (
              <div className="space-y-2">
                {unitTypes.map((unit, index) => (
                  <div key={index}>
                    {editingIndex === index ? (
                      <div className="flex gap-2 bg-primary/5 p-3 rounded-lg border-2 border-primary">
                        <Input
                          placeholder="Unit name"
                          value={editUnit.name}
                          onChange={(e) => setEditUnit({ ...editUnit, name: e.target.value })}
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          placeholder="Price"
                          value={editUnit.price}
                          onChange={(e) => setEditUnit({ ...editUnit, price: e.target.value })}
                          className="w-32"
                        />
                        <Button type="button" onClick={saveEditUnit} size="sm" variant="default">
                          Save
                        </Button>
                        <Button type="button" onClick={cancelEditUnit} size="sm" variant="ghost">
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg group hover:bg-muted transition-colors">
                        <div className="flex-1">
                          <p className="font-medium">{unit.name}</p>
                          <p className="text-sm text-muted-foreground">₱{unit.price}/night</p>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditUnit(index)}
                          >
                            Edit
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeUnitType(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" size="lg" className="min-w-[200px]">
              Continue to Amenities
            </Button>
          </div>
        </Card>
      </div>
    </form>
  );
};

export default PropertyInfoStep;