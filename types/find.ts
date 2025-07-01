export interface MissingReport {
  id: string;
  pet_id: string;
  reporter_id: string;
  latitude: number;
  longitude: number;
  full_address?: string;
  address?: string;
  street?: string;
  city?: string;
  region?: string;
  postcode?: string;
  country?: string;
  photo_urls?: string[];
  description?: string;
  reported_at: string;
  pet: { id: string; name: string; photo_url?: string };
  reporter: { id: string; name: string };
}

export interface FoundReport {
  id: string;
  missingPetId: string;
  helper: { id: string; name: string };
  pet: { id: string; name: string; photo_url?: string };
  photo_urls?: string[];
  description?: string;
  latitude: number;
  longitude: number;
  full_address?: string;
  address?: string;
  street?: string;
  city?: string;
  region?: string;
  postcode?: string;
  country?: string;
  reported_at: string;
}

export type AddressComponents = {
  full_address: string;
  address?: string;
  street?: string;
  city?: string;
  region?: string;
  postcode?: string;
  country?: string;
};
