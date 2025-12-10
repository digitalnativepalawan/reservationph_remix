import { Button } from "@/components/ui/button";
import { MapPin, Home, Laptop } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center space-y-8 animate-fade-in">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight">
              List Your Accommodation<br />on{" "}
              <span className="text-primary">Nomad.One</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Reach digital nomads and long-stay guests across the Philippines — free forever.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Button
                size="lg"
                onClick={() => navigate("/register")}
                className="text-lg px-8 py-6 w-full sm:w-auto"
              >
                Start Registration
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/admin")}
                className="text-lg px-8 py-6 w-full sm:w-auto"
              >
                Admin Dashboard
              </Button>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-slide-up-delay">
            <div className="bg-card rounded-2xl p-6 shadow-soft text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Philippines Focused</h3>
              <p className="text-sm text-muted-foreground">
                Connect with guests exploring the Philippines
              </p>
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-soft text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Trusted Hosts</h3>
              <p className="text-sm text-muted-foreground">
                Join a curated network of quality accommodations
              </p>
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-soft text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Laptop className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Remote-Work Ready</h3>
              <p className="text-sm text-muted-foreground">
                Attract digital nomads seeking workspaces
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg">
              Get listed in just 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Property Details</h3>
              <p className="text-muted-foreground">
                Tell us about your accommodation, location, and units
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Amenities & Links</h3>
              <p className="text-muted-foreground">
                Share what makes your property special
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Submit & Go Live</h3>
              <p className="text-muted-foreground">
                Review and submit — we'll handle the rest
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              onClick={() => navigate("/register")}
              className="text-lg px-8 py-6"
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card py-8 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Nomad.One. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;