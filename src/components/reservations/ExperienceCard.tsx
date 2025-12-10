import { Link } from 'react-router-dom';
import { Clock, MapPin } from 'lucide-react';
import { Experience } from '@/types/booking';

interface ExperienceCardProps {
  experience: Experience;
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  const mainImage = experience.images?.[0] || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80';

  return (
    <Link
      to={`/experience/${experience.id}`}
      className="group block card-tropical"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={mainImage}
          alt={experience.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {experience.title}
        </h3>

        <div className="flex items-center gap-3 text-muted-foreground text-sm mb-3">
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            <span>{experience.destination}</span>
          </div>
          {experience.duration && (
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{experience.duration}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">From</span>
          <div>
            <span className="font-semibold text-foreground">₱{experience.price.toLocaleString()}</span>
            <span className="text-muted-foreground text-sm"> / person</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
