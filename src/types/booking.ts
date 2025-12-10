export interface Destination {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  propertyCount?: number;
}

export interface PropertyListing {
  id: string;
  name: string;
  resort_title?: string;
  destination: string;
  description?: string;
  images: string[];
  price_per_night: number;
  max_guests: number;
  amenities: string[];
  rating?: number;
  review_count?: number;
  featured?: boolean;
  latitude?: number;
  longitude?: number;
  cleaning_fee?: number;
  host_name?: string;
  host_image?: string;
}

export interface Experience {
  id: string;
  title: string;
  destination: string;
  price: number;
  images: string[];
  description?: string;
  duration?: string;
  included?: string[];
}

export interface Booking {
  id: string;
  accommodation_id: string;
  unit_type_id?: string;
  check_in: string;
  check_out: string;
  guest_count: number;
  guest_name: string;
  guest_email: string;
  guest_phone?: string;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  created_at: string;
}

export interface Review {
  id: string;
  accommodation_id: string;
  guest_name: string;
  guest_email?: string;
  rating: number;
  review_text?: string;
  created_at: string;
}

export interface SearchFilters {
  destination?: string;
  checkIn?: Date;
  checkOut?: Date;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
}

export const DESTINATIONS: Destination[] = [
  {
    id: 'puerto-princesa',
    name: 'Puerto Princesa',
    slug: 'puerto-princesa',
    image: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=800&q=80',
    description: 'The capital city, gateway to the Underground River',
  },
  {
    id: 'port-barton',
    name: 'Port Barton',
    slug: 'port-barton',
    image: 'https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=800&q=80',
    description: 'Hidden gem with pristine beaches and island hopping',
  },
  {
    id: 'san-vicente',
    name: 'San Vicente',
    slug: 'san-vicente',
    image: 'https://images.unsplash.com/photo-1559628233-100c798642d4?w=800&q=80',
    description: 'Home to Long Beach, the longest white sand beach',
  },
  {
    id: 'el-nido',
    name: 'El Nido',
    slug: 'el-nido',
    image: 'https://images.unsplash.com/photo-1553551473-c29c6c30be31?w=800&q=80',
    description: 'Famous for limestone cliffs and lagoons',
  },
];
