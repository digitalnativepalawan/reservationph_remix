import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center animate-fade-in">
        <div className="bg-card rounded-2xl p-8 sm:p-12 shadow-medium">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-accent" />
            </div>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Thank You!
          </h1>
          
          <p className="text-lg text-muted-foreground mb-6">
            Your listing has been submitted successfully.
          </p>
          
          <div className="bg-muted/50 rounded-xl p-6 mb-8">
            <p className="text-sm text-foreground">
              Our team will review your submission within <strong>24–48 hours</strong>. 
              You'll receive a confirmation email once your property is live on Nomad.One.
            </p>
          </div>

          <Button
            onClick={() => navigate("/")}
            className="w-full"
            size="lg"
          >
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Success;