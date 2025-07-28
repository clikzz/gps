import { z } from "zod";
import { serviceSchema, createServiceSchema, serviceCategories, type ServiceCategory } from "@/server/validations/service.validation";

export type ServiceFromDB = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  description: string;
  categories: string[];
  phone: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Service = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  description: string;
  categories: ServiceCategory[];
  phone: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
};

export function transformServiceFromDB(serviceFromDB: ServiceFromDB): Service {
  return {
    id: serviceFromDB.id,
    name: serviceFromDB.name,
    latitude: serviceFromDB.latitude,
    longitude: serviceFromDB.longitude,
    description: serviceFromDB.description,
    categories: serviceFromDB.categories as ServiceCategory[],
    phone: serviceFromDB.phone || "",
    user_id: undefined,
    created_at: serviceFromDB.createdAt.toISOString(),
    updated_at: serviceFromDB.updatedAt.toISOString(),
  };
}

export type NewServiceFormData = {
  name: string;
  latitude: number;
  longitude: number;
  description: string;
  categories: ServiceCategory[];
  phone: string;
};

export const newServiceFormSchema = createServiceSchema;

export type NewServiceFormInput = z.infer<typeof createServiceSchema>;

export type EditServiceFormData = {
  name: string;
  latitude: number;
  longitude: number;
  description: string;
  categories: ServiceCategory[];
  phone: string;
};

export const editServiceFormSchema = serviceSchema.omit({ id: true, user_id: true, created_at: true, updated_at: true });

export type EditServiceFormInput = z.infer<typeof editServiceFormSchema>;

export interface SelectOption {
  value: string;
  label: string;
  emoji?: string;
}

export const CATEGORY_OPTIONS: SelectOption[] = [
  { value: "veterinaria", label: "Veterinaria", emoji: "🏥" },
  { value: "peluqueria", label: "Peluquería", emoji: "✂️" },
  { value: "tienda", label: "Tienda de mascotas", emoji: "🛒" },
  { value: "guarderia", label: "Guardería", emoji: "🏠" },
  { value: "adiestramiento", label: "Adiestramiento", emoji: "🎓" },
  { value: "adopcion", label: "Adopción", emoji: "❤️" },
  { value: "otro", label: "Otro", emoji: "🐾" },
];

export { serviceCategories, type ServiceCategory };

export const SERVICE_CONSTRAINTS = {
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  MIN_DESCRIPTION_LENGTH: 5,
  MAX_DESCRIPTION_LENGTH: 500,
  MIN_PHONE_LENGTH: 8,
  MAX_PHONE_LENGTH: 15,
  MIN_CATEGORIES: 1,
  MAX_CATEGORIES: 3,
  DEFAULT_RADIUS: 10,
  MIN_RADIUS: 0.1,
  MAX_RADIUS: 100,
} as const;

export interface ServiceWithReviews extends Service {
  reviews: {
    id: string;
    rating: number;
    comment: string | null;
    user: {
      id: string;
      full_name: string | null;
      avatar_url: string | null;
    };
    created_at: Date;
  }[];
  averageRating: number;
  totalReviews: number;
}

export interface ServiceWithDistance extends Service {
  distance?: number;
}

export interface ServiceLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  categories: ServiceCategory[];
}

export interface ServiceFilters {
  latitude?: number;
  longitude?: number;
  radius?: number;
  category?: ServiceCategory;
  searchQuery?: string;
}

export interface MapBounds {
  northEast: {
    lat: number;
    lng: number;
  };
  southWest: {
    lat: number;
    lng: number;
  };
}
