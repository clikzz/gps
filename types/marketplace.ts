import { ItemCategory, ItemCondition, ItemStatus } from "@prisma/client";

export interface MarketplaceItem {
  id: bigint;
  user_id: string;
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