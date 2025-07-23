import { ItemCategory, ItemCondition, ItemStatus, PetCategory } from "@prisma/client";

export interface MarketplaceItem {
  id: bigint;
  user_id: string;
  seller: {
    name: string;
    email: string;
    avatar_url: string;
    instagram?: string;
    phone?: string;
  }
  title: string;
  description?: string;
  pet_category: PetCategory;
  category: ItemCategory;
  condition: ItemCondition;
  price: number;
  photo_urls: string[];
  latitude: number;
  longitude: number;
  city?: string;
  region?: string;
  country?: string;
  status: ItemStatus;
  created_at: Date;
  updated_at: Date;
}

export type Item = Omit<
  MarketplaceItem,
  "id" | "price" | "created_at" | "updated_at"
> & {
  id: string;
  price: number;
  created_at: string;
  updated_at: string;
};

export interface MarketplaceItemInput {
  title: string;
  description?: string;
  condition: ItemCondition;
  price: number;
  category: ItemCategory;
  pet_category: PetCategory;
  photo_urls: string[];
  latitude: number;
  longitude: number;
}

export interface EditableItem extends MarketplaceItemInput {
  id: string;
  status: ItemStatus;
  city?: string;
  region?: string;
  country?: string;
  updated_at: Date;
}

export type UpdateItemPayload = Pick<
  MarketplaceItem,
  | "title"
  | "description"
  | "pet_category"
  | "category"
  | "condition"
  | "price"
  | "photo_urls"
  | "latitude"
  | "longitude"
  | "city"
  | "region"
  | "country"
>;

export interface ListFilters {
  category?: ItemCategory;
  pet_category?: PetCategory;
  minPrice?: number;
  maxPrice?: number;
  lat?: number;
  lng?: number;
  radiusKm?: number;
  order?: "recent" | "priceAsc" | "priceDesc";
  page?: number;            // 0-based
  pageSize?: number;        // default 20
}

export type UserArticle = Omit<
  MarketplaceItem, 
  "user_id" | "seller"
> & {
  id: number;
  price: number;
  created_at: string;
  sold_price?: number;
  sold_at?: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export const CATEGORY_OPTIONS: SelectOption[] = [
  { label: "Comida", value: ItemCategory.FOOD },
  { label: "Juguetes", value: ItemCategory.TOYS },
  { label: "Camas", value: ItemCategory.BEDDING },
  { label: "Paseo", value: ItemCategory.WALK_WEAR },
  { label: "Salud", value: ItemCategory.HEALTH_GROOM },
  { label: "Viajes", value: ItemCategory.TRAVEL },
  { label: "Otros", value: ItemCategory.OTHER },
];

export const CONDITION_OPTIONS: SelectOption[] = [
  { label: "Nuevo", value: ItemCondition.NEW },
  { label: "Usado", value: ItemCondition.USED },
];

export const PET_OPTIONS: SelectOption[] = [
  { label: "Todos", value: PetCategory.ALL },
  { label: "Perro", value: PetCategory.DOG },
  { label: "Gato", value: PetCategory.CAT },
  { label: "Conejo", value: PetCategory.RABBIT },
  { label: "Hámster", value: PetCategory.HAMSTER },
  { label: "Tortuga", value: PetCategory.TURTLE },
  { label: "Ave", value: PetCategory.BIRD },
  { label: "Pez", value: PetCategory.FISH },
  { label: "Cobaya", value: PetCategory.GUINEA_PIG },
  { label: "Hurón", value: PetCategory.FERRET },
  { label: "Ratón", value: PetCategory.MOUSE },
  { label: "Chinchilla", value: PetCategory.CHINCHILLA },
  { label: "Erizo", value: PetCategory.HEDGEHOG },
  { label: "Serpiente", value: PetCategory.SNAKE },
  { label: "Rana", value: PetCategory.FROG },
  { label: "Lagarto", value: PetCategory.LIZARD },
  { label: "Otro", value: PetCategory.OTHER },
];

export interface ImageUploadResult {
  urls: string[];
  error?: string;
}

export const FILE_CONSTRAINTS = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ACCEPTED_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
} as const;