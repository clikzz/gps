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
  pet: { id: string; name: string; photo_url?: string, species: string };
  reporter: { id: string; name: string, phone?: string; instagram?: string, email?: string };
}

export interface FoundReport {
  id: string;
  missingPetId: string;
  ownerId: string;
  helper: { id: string; name: string, phone?: string; instagram?: string; email?: string };
  pet: { id: string; name: string; photo_url?: string, species: string };
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

export type Added = { file: File; preview: string };

export type ReportDraft = {
  petId: string;
  description: string;
  photos: Added[];
};

export const EMPTY_DRAFT: ReportDraft = {
  petId: "",
  description: "",
  photos: [],
}

export interface FoundDraft {
  photos: Added[]
  description: string
}
export const EMPTY_FOUND_DRAFT: FoundDraft = { photos: [], description: "" }
