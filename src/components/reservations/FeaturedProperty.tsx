import { Link } from 'react-router-dom';
import { Star, MapPin, Wifi, Car, Coffee, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PropertyListing } from '@/types/booking';

interface FeaturedPropertyProps {
  property: PropertyListing;
}

export function FeaturedProperty({ property }: FeaturedPropertyProps) {
  const mainImage = property.images?.[0] || 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80';

  const amenityIcons: Record<string, any> = {
    'Wi-Fi': Wifi,
    'Parking': Car,
    'Breakfast': Coffee,
  };

  return (
    <section className="py-12 md:py-16">
      <div className="container-app">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Featured</span>
            <h2 className="font-urbanist text-2xl md:text-3xl font-bold text-foreground mt-1">
              Binga Beach Resort
            </h2>
          </div>
          <Button variant="ghost" asChild className="hidden sm:flex">
            <Link to={`/property/${property.id}`}>
              View Details
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <Link
          to={`/property/${property.id}`}
          className="group block bg-card rounded-2xl shadow-card border border-border/50 overflow-hidden"
        >
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image */}
            <div className="relative aspect-[4/3] md:aspect-auto overflow-hidden">
              <img
                src={mainImage}
                alt={property.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent md:hidden" />
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{property.destination}</span>
                {property.rating && (
                  <div className="flex items-center gap-1 ml-auto">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{property.rating.toFixed(1)}</span>
                    {property.review_count && (
                      <span className="text-muted-foreground text-sm">
                        ({property.review_count} reviews)
                      </span>
                    )}
                  </div>
                )}
              </div>

              <h3 className="font-urbanist text-xl md:text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                {property.name}
              </h3>

              <p className="text-muted-foreground mb-4 line-clamp-3">
                {property.description || 'Experience tropical paradise with stunning beachfront views, modern amenities, and authentic Filipino hospitality.'}
              </p>

              {/* Amenities */}
              <div className="flex flex-wrap gap-2 mb-6">
                {property.amenities?.slice(0, 4).map((amenity, i) => {
                  const Icon = amenityIcons[amenity];
                  return (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground bg-muted px-3 py-1.5 rounded-full"
                    >
                      {Icon && <Icon className="h-3.5 w-3.5" />}
                      {amenity}
                    </span>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <div>
                  <span className="text-2xl font-bold text-foreground">
                    ₱{property.price_per_night.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground"> / night</span>
                </div>
                <Button className="bg-primary hover:bg-primary/90">
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
