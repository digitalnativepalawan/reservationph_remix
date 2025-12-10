import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Wifi, Wind, Droplets, Utensils, Waves, Dumbbell, Car, Briefcase, Coffee, Tv, Home } from "lucide-react";
import { AmenitiesInfo } from "@/types/registration";
import { toast } from "sonner";
import WiFiDialog, { WiFiData } from "./WiFiDialog";

interface AmenitiesStepProps {
  onNext: (data: AmenitiesInfo) => void;
  onBack: () => void;
  initialData: AmenitiesInfo | null;
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

const AmenitiesStep = ({ onNext, onBack, initialData }: AmenitiesStepProps) => {
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(initialData?.selectedAmenities || []);
  const [otherAmenities, setOtherAmenities] = useState(initialData?.otherAmenities || "");
  const [website, setWebsite] = useState(initialData?.website || "");
  const [facebook, setFacebook] = useState(initialData?.facebook || "");
  const [instagram, setInstagram] = useState(initialData?.instagram || "");
  const [googleMaps, setGoogleMaps] = useState(initialData?.googleMaps || "");
  const [extraLinks, setExtraLinks] = useState<string[]>(initialData?.extraLinks || []);
  const [newLink, setNewLink] = useState("");
  const [wifiDialogOpen, setWifiDialogOpen] = useState(false);
  const [wifiData, setWifiData] = useState<WiFiData>({
    providers: initialData?.wifiProviders || [],
    downloadSpeed: initialData?.wifiDownloadSpeed || "",
    uploadSpeed: initialData?.wifiUploadSpeed || "",
    ping: initialData?.wifiPing || "",
    jitter: initialData?.wifiJitter || "",
  });

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

  const handleWiFiConfigure = () => {
    setWifiDialogOpen(true);
  };

  const handleWiFiSave = (data: WiFiData) => {
    setWifiData(data);
    toast.success("Wi-Fi configuration saved");
  };

  const addExtraLink = () => {
    if (!newLink) return;
    if (!newLink.startsWith("http://") && !newLink.startsWith("https://")) {
      toast.error("Please enter a valid URL starting with http:// or https://");
      return;
    }
    setExtraLinks([...extraLinks, newLink]);
    setNewLink("");
    toast.success("Link added");
  };

  const removeExtraLink = (index: number) => {
    setExtraLinks(extraLinks.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    const data: AmenitiesInfo = {
      selectedAmenities,
      otherAmenities,
      website,
      facebook,
      instagram,
      googleMaps,
      extraLinks,
      wifiProviders: wifiData.providers,
      wifiDownloadSpeed: wifiData.downloadSpeed,
      wifiUploadSpeed: wifiData.uploadSpeed,
      wifiPing: wifiData.ping,
      wifiJitter: wifiData.jitter,
    };
    onNext(data);
  };

  return (
    <Card className="p-6 sm:p-8 space-y-8">
      {/* Amenities */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Amenities</h2>
        <p className="text-sm text-muted-foreground">Select all amenities that apply</p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
                    onClick={handleWiFiConfigure}
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs h-6 px-2"
                  >
                    Configure
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        <div className="space-y-2">
          <Label htmlFor="otherAmenities">Other Amenities</Label>
          <Textarea
            id="otherAmenities"
            placeholder="List any additional amenities..."
            value={otherAmenities}
            onChange={(e) => setOtherAmenities(e.target.value)}
            rows={3}
          />
        </div>
      </div>

      {/* Online Presence */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Online Presence</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              placeholder="https://yourwebsite.com"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="facebook">Facebook Page</Label>
            <Input
              id="facebook"
              type="url"
              placeholder="https://facebook.com/yourpage"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              type="url"
              placeholder="https://instagram.com/yourprofile"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="googleMaps">Google Maps Link</Label>
            <Input
              id="googleMaps"
              type="url"
              placeholder="https://maps.google.com/..."
              value={googleMaps}
              onChange={(e) => setGoogleMaps(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label>Additional Links</Label>
          <div className="flex gap-2">
            <Input
              placeholder="https://..."
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addExtraLink())}
            />
            <Button type="button" onClick={addExtraLink} size="icon">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {extraLinks.length > 0 && (
            <div className="space-y-2">
              {extraLinks.map((link, index) => (
                <div key={index} className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
                  <span className="text-sm truncate flex-1">{link}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExtraLink(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onBack} size="lg" className="sm:flex-1">
          Back
        </Button>
        <Button type="button" onClick={handleNext} size="lg" className="sm:flex-1">
          Continue to Contact
        </Button>
      </div>

      <WiFiDialog
        open={wifiDialogOpen}
        onOpenChange={setWifiDialogOpen}
        onSave={handleWiFiSave}
        initialData={wifiData}
      />
    </Card>
  );
};

export default AmenitiesStep;