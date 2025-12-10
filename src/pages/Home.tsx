import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/reservations/Navbar';
import { HeroSearch } from '@/components/reservations/HeroSearch';
import { PropertyCard } from '@/components/reservations/PropertyCard';
import { DestinationCard } from '@/components/reservations/DestinationCard';
import { Footer } from '@/components/reservations/Footer';
import { DESTINATIONS, PropertyListing } from '@/types/booking';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [properties, setProperties] = useState<PropertyListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProperties() {
      const { data: accommodations } = await supabase
        .from('accommodations')
        .select('*, images(*), unit_types(*), reviews(*)')
        .limit(8);

      if (accommodations) {
        const mapped: PropertyListing[] = accommodations.map((acc: any) => ({
          id: acc.id,
          name: acc.name,
          resort_title: acc.resort_title,
          destination: acc.destination || acc.municipality_city || 'Palawan',
          description: acc.description,
          images: acc.images?.map((img: any) => img.image_url) || [],
          price_per_night: acc.unit_types?.[0]?.price || 2500,
          max_guests: acc.unit_types?.[0]?.guests || acc.number_of_units * 2 || 4,
          amenities: Array.isArray(acc.amenities) ? acc.amenities : [],
          rating: acc.reviews?.length > 0 
            ? acc.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / acc.reviews.length 
            : undefined,
          review_count: acc.reviews?.length || 0,
          featured: acc.featured,
        }));
        setProperties(mapped);
      }
      setLoading(false);
    }
    fetchProperties();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSearch />

      {/* Destinations */}
      <section className="py-12 md:py-16">
        <div className="container-app">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-urbanist text-2xl md:text-3xl font-bold">Explore Palawan</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/destinations">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {DESTINATIONS.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        </div>
      </section>

      {/* Properties */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container-app">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-urbanist text-2xl md:text-3xl font-bold">Recommended Stays</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/stays">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-card rounded-xl animate-pulse aspect-[4/5]" />
              ))}
            </div>
          ) : properties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {properties.slice(0, 8).map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No properties yet.</p>
              <Button asChild>
                <Link to="/register">List your property</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
