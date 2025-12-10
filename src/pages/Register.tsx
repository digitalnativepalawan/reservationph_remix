import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import PropertyInfoStep from "@/components/registration/PropertyInfoStep";
import AmenitiesStep from "@/components/registration/AmenitiesStep";
import ContactStep from "@/components/registration/ContactStep";
import ProgressStepper from "@/components/registration/ProgressStepper";
import { PropertyInfo, AmenitiesInfo, ContactInfo } from "@/types/registration";

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [propertyInfo, setPropertyInfo] = useState<PropertyInfo | null>(null);
  const [amenitiesInfo, setAmenitiesInfo] = useState<AmenitiesInfo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handlePropertyInfoSubmit = (data: PropertyInfo) => {
    setPropertyInfo(data);
    setCurrentStep(2);
  };

  const handleAmenitiesSubmit = (data: AmenitiesInfo) => {
    setAmenitiesInfo(data);
    setCurrentStep(3);
  };

  const handleFinalSubmit = async (contactInfo: ContactInfo) => {
    if (!propertyInfo || !amenitiesInfo) return;

    setIsSubmitting(true);

    console.log("Submitting with images:", propertyInfo.imageUrls);

    try {
      // Insert accommodation
      const { data: accommodation, error: accError } = await supabase
        .from("accommodations")
        .insert({
          resort_title: propertyInfo.resortTitle || null,
          name: propertyInfo.name,
          number_of_units: propertyInfo.numberOfUnits,
          street_address: propertyInfo.address.street,
          barangay: propertyInfo.address.barangay,
          municipality_city: propertyInfo.address.municipality,
          province: propertyInfo.address.province,
          zip_code: propertyInfo.address.zipCode,
          region: propertyInfo.address.region,
          amenities: amenitiesInfo.selectedAmenities,
          website: amenitiesInfo.website || null,
          facebook_page: amenitiesInfo.facebook || null,
          instagram: amenitiesInfo.instagram || null,
          google_maps_link: amenitiesInfo.googleMaps || null,
          contact_name: contactInfo.name,
          contact_email: contactInfo.email,
          contact_number: contactInfo.phone,
          consent_given: contactInfo.consent,
          sec_download_url: contactInfo.secDownloadUrl || null,
          gis_document_url: contactInfo.gisDocumentUrl || null,
          permit_document_url: contactInfo.permitDocumentUrl || null,
          wifi_providers: amenitiesInfo.wifiProviders,
          wifi_download_speed: amenitiesInfo.wifiDownloadSpeed ? parseFloat(amenitiesInfo.wifiDownloadSpeed) : null,
          wifi_upload_speed: amenitiesInfo.wifiUploadSpeed ? parseFloat(amenitiesInfo.wifiUploadSpeed) : null,
          wifi_ping: amenitiesInfo.wifiPing ? parseFloat(amenitiesInfo.wifiPing) : null,
          wifi_jitter: amenitiesInfo.wifiJitter ? parseFloat(amenitiesInfo.wifiJitter) : null,
        })
        .select()
        .single();

      if (accError) throw accError;

      // Insert unit types
      if (propertyInfo.unitTypes.length > 0) {
        const unitTypesData = propertyInfo.unitTypes.map((unit) => ({
          accommodation_id: accommodation.id,
          unit_name: unit.name,
          price: unit.price,
        }));

        const { error: unitError } = await supabase
          .from("unit_types")
          .insert(unitTypesData);

        if (unitError) throw unitError;
      }

      // Insert images
      if (propertyInfo.imageUrls.length > 0) {
        console.log("Inserting images:", propertyInfo.imageUrls);
        const imagesData = propertyInfo.imageUrls.map((url) => ({
          accommodation_id: accommodation.id,
          image_url: url,
        }));

        const { error: imgError } = await supabase
          .from("images")
          .insert(imagesData);

        if (imgError) {
          console.error("Image insert error:", imgError);
          throw imgError;
        }
        console.log("Images inserted successfully");
      } else {
        console.log("No images to insert");
      }

      // Insert extra links
      if (amenitiesInfo.extraLinks.length > 0) {
        const linksData = amenitiesInfo.extraLinks.map((url) => ({
          accommodation_id: accommodation.id,
          url: url,
        }));

        const { error: linkError } = await supabase
          .from("extra_links")
          .insert(linksData);

        if (linkError) throw linkError;
      }

      toast.success("Registration submitted successfully!");
      navigate("/success");
    } catch (error: any) {
      console.error("Error submitting registration:", error);
      toast.error(error.message || "Failed to submit registration. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        
        <div className="mb-8 text-center animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Property Registration
          </h1>
          <p className="text-muted-foreground">
            Complete the steps below to list your accommodation
          </p>
        </div>

        <ProgressStepper currentStep={currentStep} />

        <div className="mt-8 animate-slide-up">
          {currentStep === 1 && (
            <PropertyInfoStep
              onNext={handlePropertyInfoSubmit}
              initialData={propertyInfo}
            />
          )}
          {currentStep === 2 && (
            <AmenitiesStep
              onNext={handleAmenitiesSubmit}
              onBack={() => setCurrentStep(1)}
              initialData={amenitiesInfo}
            />
          )}
          {currentStep === 3 && (
            <ContactStep
              onSubmit={handleFinalSubmit}
              onBack={() => setCurrentStep(2)}
              propertyInfo={propertyInfo}
              amenitiesInfo={amenitiesInfo}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;