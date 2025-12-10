import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Link2, Loader2, Download, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UnitType } from "@/types/registration";

interface ImportedListing {
  url: string;
  name: string;
  price: number;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  description: string;
  amenities: string[];
  images: string[];
  location: {
    city: string;
    province: string;
  };
}

interface AirbnbImportProps {
  onImport: (listings: ImportedListing[]) => void;
}

export const AirbnbImport = ({ onImport }: AirbnbImportProps) => {
  const [urls, setUrls] = useState<string[]>(['']);
  const [isImporting, setIsImporting] = useState(false);
  const [importedListings, setImportedListings] = useState<ImportedListing[]>([]);

  const addUrlField = () => {
    setUrls([...urls, '']);
  };

  const removeUrlField = (index: number) => {
    setUrls(urls.filter((_, i) => i !== index));
  };

  const updateUrl = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const handleImport = async () => {
    const validUrls = urls.filter(url => url.trim() !== '');
    
    if (validUrls.length === 0) {
      toast.error("Please enter at least one Airbnb URL");
      return;
    }

    setIsImporting(true);
    const imported: ImportedListing[] = [];

    for (let url of validUrls) {
      try {
        // Normalize URL - add https:// if missing
        url = url.trim();
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          url = 'https://' + url;
        }

        toast.loading(`Importing ${url}...`);

        const { data, error } = await supabase.functions.invoke('scrape-airbnb', {
          body: { url },
        });

        if (error) throw error;

        if (data && data.name) {
          imported.push({
            url,
            name: data.name || 'Imported Listing',
            price: data.price || 0,
            guests: data.guests || 0,
            bedrooms: data.bedrooms || 0,
            bathrooms: data.bathrooms || 0,
            description: data.description || '',
            amenities: data.amenities || [],
            images: data.images || [],
            location: data.location || { city: '', province: '' },
          });

          toast.dismiss();
          toast.success(`Imported: ${data.name}`);
        } else {
          toast.dismiss();
          toast.error(`Could not import listing from ${url}`);
        }
      } catch (error) {
        console.error('Import error:', error);
        toast.dismiss();
        toast.error(`Failed to import ${url}. Please check the link or enter details manually.`);
      }
    }

    setIsImporting(false);
    setImportedListings(imported);

    if (imported.length > 0) {
      onImport(imported);
    }
  };

  return (
    <Card className="p-6 space-y-6 bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Download className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">Import from Airbnb</h3>
          <p className="text-sm text-muted-foreground">
            Automatically fill property details from your Airbnb listing
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {urls.map((url, index) => (
          <div key={index} className="flex gap-2">
            <div className="relative flex-1">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Paste Airbnb URL here..."
                value={url}
                onChange={(e) => updateUrl(index, e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            {urls.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeUrlField(index)}
                className="h-12 w-12"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={addUrlField}
            disabled={isImporting}
            className="flex-1"
          >
            <Link2 className="w-4 h-4 mr-2" />
            Add Another URL
          </Button>

          <Button
            type="button"
            onClick={handleImport}
            disabled={isImporting}
            className="flex-1"
          >
            {isImporting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Import Properties
              </>
            )}
          </Button>
        </div>
      </div>

      {importedListings.length > 0 && (
        <div className="space-y-2 pt-4 border-t">
          <h4 className="font-semibold text-sm text-muted-foreground">
            Imported {importedListings.length} listing(s)
          </h4>
          {importedListings.map((listing, index) => (
            <div key={index} className="p-3 bg-background rounded-lg border">
              <p className="font-medium">{listing.name}</p>
              <p className="text-sm text-muted-foreground">
                {listing.guests} guests • {listing.bedrooms} beds • {listing.bathrooms} baths
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="text-xs text-muted-foreground bg-background/50 p-3 rounded-lg">
        💡 <strong>Tip:</strong> After importing, you can edit any details before submitting.
      </div>
    </Card>
  );
};