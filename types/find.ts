export interface MissingReport {
  id: string;
  pet_id: string;
  reporter_id: string;
  latitude: number;
  longitude: number;
  photo_urls?: string[];
  description?: string;
  reported_at: string;
  pet: { id: string; name: string; photo_url?: string };
  reporter: { id: string; name: string };
}