export interface ImageUploadResult {
  url: string | null;
  error?: string;
}

export const PROFILE_FILE_CONSTRAINTS = {
  MAX_SIZE: 2 * 1024 * 1024, 
  ACCEPTED_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
} as const;
