import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DESTINATIONS } from '@/types/booking';

const FILTER_TABS = ['All', 'Stays', 'Experiences', 'Transport'];

export function HeroSearch() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [destination, setDestination] = useState('');
  const [showDestinations, setShowDestinations] = useState(false);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (destination) params.set('destination', destination);
    if (activeTab !== 'All') params.set('type', activeTab.toLowerCase());
    navigate(`/search?${params.toString()}`);
  };

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      <div className="container-app relative">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12 animate-fade-in">
          <h1 className="font-urbanist text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 tracking-tight">
            Discover Palawan
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-2xl mx-auto">
            Find your perfect stay in the Philippines' last frontier
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-6 animate-slide-up">
          <div className="inline-flex bg-card rounded-full p-1 shadow-soft border border-border/50">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 sm:px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Search Box */}
        <div className="max-w-3xl mx-auto animate-slide-up-delay">
          <div className="bg-card rounded-2xl shadow-card border border-border/50 p-2">
            <div className="flex flex-col md:flex-row gap-2">
              {/* Destination Input */}
              <div className="flex-1 relative">
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Where in Palawan?"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    onFocus={() => setShowDestinations(true)}
                    onBlur={() => setTimeout(() => setShowDestinations(false), 200)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-muted/50 border-0 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                {/* Destination Dropdown */}
                {showDestinations && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl shadow-elevated border border-border/50 overflow-hidden z-10 animate-scale-in">
                    {DESTINATIONS.map((dest) => (
                      <button
                        key={dest.id}
                        onMouseDown={() => setDestination(dest.name)}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted transition-colors text-left"
                      >
                        <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                          <img
                            src={dest.image}
                            alt={dest.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{dest.name}</p>
                          <p className="text-sm text-muted-foreground">{dest.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Date Inputs - Desktop */}
              <div className="hidden md:flex items-center gap-2 px-4 py-3 rounded-xl bg-muted/50">
                <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm whitespace-nowrap">Check in</span>
                  <span className="text-muted-foreground">-</span>
                  <span className="text-muted-foreground text-sm whitespace-nowrap">Check out</span>
                </div>
              </div>

              {/* Guests - Desktop */}
              <div className="hidden md:flex items-center gap-2 px-4 py-3 rounded-xl bg-muted/50">
                <Users className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground text-sm whitespace-nowrap">Guests</span>
              </div>

              {/* Search Button */}
              <Button
                onClick={handleSearch}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-6 h-14 md:h-auto"
              >
                <Search className="h-5 w-5 md:mr-2" />
                <span className="md:inline">Search</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
