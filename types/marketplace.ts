import { ItemCategory, ItemCondition, ItemStatus } from "@prisma/client";

export interface MarketplaceItem {
  id: bigint;
  user_id: string;
  seller: {
    name: string;
    email: string;
    avatar_url: string;
  }
  title: string;
  description?: string;
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
  price: string;
  created_at: string;
  updated_at: string;
};

export interface MarketplaceItemInput {
  title: string;
  description?: string;
  condition: ItemCondition;
  price: number;
  category: ItemCategory;
  photo_urls: string[];
  latitude: number;
  longitude: number;
}

export interface ListFilters {
  category?: ItemCategory;
  minPrice?: number;
  maxPrice?: number;
  lat?: number;
  lng?: number;
  radiusKm?: number;
  order?: "recent" | "priceAsc" | "priceDesc";
  page?: number;            // 0-based
  pageSize?: number;        // default 20
}

export interface SelectOption {
  value: string;
  label: string;
}

export const ITEM_OPTIONS: SelectOption[] = [
  { label: "Comida", value: "FOOD" },
  { label: "Juguetes", value: "TOYS" },
  { label: "Camas", value: "BEDDING" },
  { label: "Paseo", value: "WALK_WEAR" },
  { label: "Salud", value: "HEALTH_GROOM" },
  { label: "Viajes", value: "TRAVEL" },
  { label: "Otros", value: "OTHER" },
];

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