import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Destination } from '@/types/booking';

interface DestinationCardProps {
  destination: Destination;
}

export function DestinationCard({ destination }: DestinationCardProps) {
  return (
    <Link
      to={`/search?destination=${destination.slug}`}
      className="group relative block rounded-2xl overflow-hidden aspect-[3/4] sm:aspect-[4/5]"
    >
      {/* Background Image */}
      <img
        src={destination.image}
        alt={destination.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 p-5 flex flex-col justify-end">
        <h3 className="font-urbanist text-xl sm:text-2xl font-bold text-white mb-1">
          {destination.name}
        </h3>
        <p className="text-white/80 text-sm mb-3 line-clamp-2">
          {destination.description}
        </p>
        <div className="flex items-center gap-2 text-white/90 text-sm font-medium group-hover:text-white transition-colors">
          <span>Explore</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
