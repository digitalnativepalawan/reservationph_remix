import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ExternalLink } from "lucide-react";

interface WiFiDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: WiFiData) => void;
  initialData?: WiFiData;
}

export interface WiFiData {
  providers: string[];
  downloadSpeed: string;
  uploadSpeed: string;
  ping: string;
  jitter: string;
}

const providerOptions = [
  "Starlink",
  "Globe Telecom",
  "Smart Telecom",
  "Other",
];

const WiFiDialog = ({ open, onOpenChange, onSave, initialData }: WiFiDialogProps) => {
  const [providers, setProviders] = useState<string[]>(initialData?.providers || []);
  const [downloadSpeed, setDownloadSpeed] = useState(initialData?.downloadSpeed || "");
  const [uploadSpeed, setUploadSpeed] = useState(initialData?.uploadSpeed || "");
  const [ping, setPing] = useState(initialData?.ping || "");
  const [jitter, setJitter] = useState(initialData?.jitter || "");

  const toggleProvider = (provider: string) => {
    if (providers.includes(provider)) {
      setProviders(providers.filter((p) => p !== provider));
    } else {
      setProviders([...providers, provider]);
    }
  };

  const handleSave = () => {
    onSave({
      providers,
      downloadSpeed,
      uploadSpeed,
      ping,
      jitter,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Wi-Fi Configuration</DialogTitle>
          <DialogDescription>
            Select your internet providers and enter speed test results
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Provider Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Internet Providers</Label>
            <p className="text-sm text-muted-foreground">Select all that apply</p>
            <div className="space-y-3">
              {providerOptions.map((provider) => (
                <div key={provider} className="flex items-center space-x-3">
                  <Checkbox
                    id={provider}
                    checked={providers.includes(provider)}
                    onCheckedChange={() => toggleProvider(provider)}
                  />
                  <label
                    htmlFor={provider}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {provider}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Speed Test Link */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <p className="text-sm font-medium mb-2">Test your internet speed</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => window.open("https://speedtest.ph/", "_blank")}
              className="w-full"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open SpeedTest.ph
            </Button>
          </div>

          {/* Speed Test Results */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Speed Test Results</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="download">Download (Mb/s)</Label>
                <Input
                  id="download"
                  type="number"
                  step="0.01"
                  placeholder="0.98"
                  value={downloadSpeed}
                  onChange={(e) => setDownloadSpeed(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="upload">Upload (Mb/s)</Label>
                <Input
                  id="upload"
                  type="number"
                  step="0.01"
                  placeholder="15.18"
                  value={uploadSpeed}
                  onChange={(e) => setUploadSpeed(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ping">Ping (ms)</Label>
                <Input
                  id="ping"
                  type="number"
                  placeholder="40"
                  value={ping}
                  onChange={(e) => setPing(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jitter">Jitter (ms)</Label>
                <Input
                  id="jitter"
                  type="number"
                  placeholder="6"
                  value={jitter}
                  onChange={(e) => setJitter(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              className="flex-1"
            >
              Save Configuration
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WiFiDialog;
