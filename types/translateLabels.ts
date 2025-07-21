import { ItemCategory, ItemCondition, PetCategory, ItemStatus } from "@prisma/client"

export const PET_CATEGORY_LABELS: Record<PetCategory, string> = {
  ALL: "Todos",
  DOG: "Perro",
  CAT: "Gato",
  RABBIT: "Conejo",
  HAMSTER: "Hámster",
  TURTLE: "Tortuga",
  BIRD: "Ave",
  FISH: "Pez",
  GUINEA_PIG: "Cobaya",
  FERRET: "Hurón",
  MOUSE: "Ratón",
  CHINCHILLA: "Chinchilla",
  HEDGEHOG: "Erizo",
  SNAKE: "Serpiente",
  FROG: "Rana",
  LIZARD: "Lagarto",
  OTHER: "Otro",
}

export const ITEM_CATEGORY_LABELS: Record<ItemCategory, string> = {
  FOOD: "Comida",
  TOYS: "Juguetes",
  BEDDING: "Camas",
  WALK_WEAR: "Paseo",
  HEALTH_GROOM: "Salud",
  TRAVEL: "Viajes",
  OTHER: "Otros",
}

export const ITEM_CONDITION_LABELS: Record<ItemCondition, string> = {
  NEW: "Nuevo",
  USED: "Usado",
}

export const ITEM_STATUS_LABELS: Record<ItemStatus, string> = {
  ACTIVE: "Activo",
  SOLD: "Vendido",
  REMOVED: "Eliminado",
}

export function getPetCategoryLabel(cat: PetCategory): string {
  return PET_CATEGORY_LABELS[cat] ?? cat
}

export function getItemCategoryLabel(cat: ItemCategory): string {
  return ITEM_CATEGORY_LABELS[cat] ?? cat
}

export function getItemConditionLabel(cond: ItemCondition): string {
  return ITEM_CONDITION_LABELS[cond] ?? cond
}

export function getItemStatusLabel(status: ItemStatus): string {
  return ITEM_STATUS_LABELS[status] ?? status
}