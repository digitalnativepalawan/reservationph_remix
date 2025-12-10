import { Link } from 'react-router-dom';
import { Star, MapPin, Users } from 'lucide-react';
import { PropertyListing } from '@/types/booking';

interface PropertyCardProps {
  property: PropertyListing;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const mainImage = property.images?.[0] || 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80';

  return (
    <Link
      to={`/property/${property.id}`}
      className="group block card-tropical"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={mainImage}
          alt={property.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {property.featured && (
          <div className="absolute top-3 left-3">
            <span className="bg-accent text-accent-foreground text-xs font-semibold px-2.5 py-1 rounded-full">
              Featured
            </span>
          </div>
        )}
        {property.rating && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-card/90 backdrop-blur-sm px-2 py-1 rounded-full">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{property.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            {property.resort_title && (
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                {property.resort_title}
              </p>
            )}
            <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {property.name}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-3">
          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="truncate">{property.destination}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
            <Users className="h-3.5 w-3.5" />
            <span>Up to {property.max_guests} guests</span>
          </div>
          <div className="text-right">
            <span className="font-semibold text-foreground">₱{property.price_per_night.toLocaleString()}</span>
            <span className="text-muted-foreground text-sm"> / night</span>
          </div>
        </div>

        {/* Amenities Preview */}
        {property.amenities && property.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-border/50">
            {property.amenities.slice(0, 3).map((amenity, i) => (
              <span
                key={i}
                className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full"
              >
                {amenity}
              </span>
            ))}
            {property.amenities.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{property.amenities.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
