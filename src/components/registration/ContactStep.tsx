import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Upload, FileText, X } from "lucide-react";
import { PropertyInfo, AmenitiesInfo, ContactInfo } from "@/types/registration";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(1, "Contact name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Contact number is required"),
  consent: z.boolean().refine((val) => val === true, {
    message: "You must consent to proceed",
  }),
});

type FormData = z.infer<typeof schema>;

interface ContactStepProps {
  onSubmit: (data: ContactInfo) => void;
  onBack: () => void;
  propertyInfo: PropertyInfo | null;
  amenitiesInfo: AmenitiesInfo | null;
  isSubmitting: boolean;
}

const ContactStep = ({ onSubmit, onBack, propertyInfo, amenitiesInfo, isSubmitting }: ContactStepProps) => {
  const [secDownloadUrl, setSecDownloadUrl] = useState<string>("");
  const [gisDocumentUrl, setGisDocumentUrl] = useState<string>("");
  const [permitDocumentUrl, setPermitDocumentUrl] = useState<string>("");
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      consent: false,
    },
  });

  const consent = watch("consent");

  const handleDocumentUpload = async (file: File, docType: 'sec' | 'gis' | 'permit') => {
    setUploadingDoc(docType);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${docType}-${Date.now()}.${fileExt}`;
      const filePath = `documents/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('property-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(filePath);

      if (docType === 'sec') setSecDownloadUrl(publicUrl);
      else if (docType === 'gis') setGisDocumentUrl(publicUrl);
      else setPermitDocumentUrl(publicUrl);

      toast.success(`${docType.toUpperCase()} document uploaded successfully`);
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(`Failed to upload document: ${error.message}`);
    } finally {
      setUploadingDoc(null);
    }
  };

  const handleFormSubmit = (data: FormData) => {
    onSubmit({
      name: data.name,
      email: data.email,
      phone: data.phone,
      consent: data.consent,
      secDownloadUrl: secDownloadUrl || undefined,
      gisDocumentUrl: gisDocumentUrl || undefined,
      permitDocumentUrl: permitDocumentUrl || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Card className="p-6 sm:p-8 space-y-8">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Contact Information</h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Contact Name *</Label>
              <Input id="name" {...register("name")} placeholder="John Doe" />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Contact Email *</Label>
              <Input id="email" type="email" {...register("email")} placeholder="john@example.com" />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Contact Number *</Label>
              <Input id="phone" {...register("phone")} placeholder="+63 912 345 6789" />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Required Documents</h2>
          <p className="text-sm text-muted-foreground">Please upload the following documents for verification</p>
          
          <div className="grid gap-4">
            {/* SEC Download */}
            <div className="border rounded-lg p-4 space-y-3">
              <Label className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                SEC Download
              </Label>
              {secDownloadUrl ? (
                <div className="flex items-center gap-2 bg-muted/50 p-2 rounded">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="text-sm flex-1 truncate">Document uploaded</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setSecDownloadUrl("")}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleDocumentUpload(file, 'sec');
                    }}
                    disabled={uploadingDoc === 'sec'}
                    className="cursor-pointer"
                  />
                  {uploadingDoc === 'sec' && <Loader2 className="w-4 h-4 animate-spin" />}
                </div>
              )}
            </div>

            {/* Updated GIS */}
            <div className="border rounded-lg p-4 space-y-3">
              <Label className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Updated GIS
              </Label>
              {gisDocumentUrl ? (
                <div className="flex items-center gap-2 bg-muted/50 p-2 rounded">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="text-sm flex-1 truncate">Document uploaded</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setGisDocumentUrl("")}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleDocumentUpload(file, 'gis');
                    }}
                    disabled={uploadingDoc === 'gis'}
                    className="cursor-pointer"
                  />
                  {uploadingDoc === 'gis' && <Loader2 className="w-4 h-4 animate-spin" />}
                </div>
              )}
            </div>

            {/* Updated Permit */}
            <div className="border rounded-lg p-4 space-y-3">
              <Label className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Updated Permit
              </Label>
              {permitDocumentUrl ? (
                <div className="flex items-center gap-2 bg-muted/50 p-2 rounded">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="text-sm flex-1 truncate">Document uploaded</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setPermitDocumentUrl("")}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleDocumentUpload(file, 'permit');
                    }}
                    disabled={uploadingDoc === 'permit'}
                    className="cursor-pointer"
                  />
                  {uploadingDoc === 'permit' && <Loader2 className="w-4 h-4 animate-spin" />}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Summary</h2>
          
          <div className="space-y-4 bg-muted/30 p-6 rounded-xl">
            <div>
              <p className="text-sm text-muted-foreground">Property Name</p>
              <p className="font-semibold">{propertyInfo?.name}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-semibold">
                {propertyInfo?.address.municipality}, {propertyInfo?.address.province}
              </p>
            </div>

            {propertyInfo?.unitTypes && propertyInfo.unitTypes.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Unit Types</p>
                <div className="space-y-1">
                  {propertyInfo.unitTypes.map((unit, index) => (
                    <p key={index} className="text-sm">
                      {unit.name} - ₱{unit.price}/night
                    </p>
                  ))}
                </div>
              </div>
            )}

            {amenitiesInfo?.selectedAmenities && amenitiesInfo.selectedAmenities.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {amenitiesInfo.selectedAmenities.map((amenity, index) => (
                    <Badge key={index} variant="secondary">{amenity}</Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-sm text-muted-foreground">Images Uploaded</p>
              <p className="font-semibold">{propertyInfo?.imageUrls.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl">
            <Checkbox
              id="consent"
              checked={consent}
              onCheckedChange={(checked) => setValue("consent", checked as boolean)}
            />
            <div className="flex-1">
              <Label htmlFor="consent" className="cursor-pointer">
                I consent to the use of my data for listing and promotional purposes. *
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Your information will be used to create and promote your property listing on Nomad.One
              </p>
            </div>
          </div>
          {errors.consent && <p className="text-sm text-destructive">{errors.consent.message}</p>}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onBack} size="lg" className="sm:flex-1" disabled={isSubmitting}>
            Back
          </Button>
          <Button type="submit" size="lg" className="sm:flex-1" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Registration"
            )}
          </Button>
        </div>
      </Card>
    </form>
  );
};

export default ContactStep;