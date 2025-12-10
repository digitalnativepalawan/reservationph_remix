export interface UnitType {
  name: string;
  price: number;
}

export interface PropertyInfo {
  resortTitle?: string;
  name: string;
  numberOfUnits: number;
  address: {
    street: string;
    barangay: string;
    municipality: string;
    province: string;
    zipCode: string;
    region: string;
  };
  imageUrls: string[];
  unitTypes: UnitType[];
}

export interface AmenitiesInfo {
  selectedAmenities: string[];
  otherAmenities: string;
  website: string;
  facebook: string;
  instagram: string;
  googleMaps: string;
  extraLinks: string[];
  wifiProviders: string[];
  wifiDownloadSpeed: string;
  wifiUploadSpeed: string;
  wifiPing: string;
  wifiJitter: string;
}

export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  consent: boolean;
  secDownloadUrl?: string;
  gisDocumentUrl?: string;
  permitDocumentUrl?: string;
}