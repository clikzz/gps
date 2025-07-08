import prisma from "@/lib/db";
import { reverseGeocode } from "@/utils/geocode";
import { ItemCategory, ItemCondition, ItemStatus } from "@prisma/client";

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

/**
 * Crea un nuevo anuncio en el marketplace.
 */
export const createMarketplaceItem = async (
  userId: string,
  data: MarketplaceItemInput
) => {
  const { city, region, country } = await reverseGeocode(
    data.latitude,
    data.longitude
  );

  return prisma.$transaction(async (tx) => {
    const item = await tx.marketplaceItem.create({
      data: {
        user_id: userId,
        title: data.title,
        description: data.description ?? "",
        condition: data.condition,
        price: data.price,
        category: data.category,
        photo_urls: data.photo_urls,
        latitude: data.latitude,
        longitude: data.longitude,
        city: city ?? null,
        region: region ?? null,
        country: country ?? null,
        status: ItemStatus.ACTIVE,
      },
    });

    return item;
  });
}

/**
 * Elimina un anuncio del marketplace cambiando su estado a REMOVED.
 */
export const softDeleteMarketplaceItem = async (
  itemId: bigint,
  userId: string
) => {
  const res = await prisma.marketplaceItem.updateMany({
    where: {
      id: itemId,
      user_id: userId,
      status: ItemStatus.ACTIVE,
    },
    data: {
      status: ItemStatus.REMOVED,
    },
  });

  if (res.count === 0) {
    throw new Error("No tienes permiso o el anuncio ya no está activo.");
  }
  return true;
}

/**
 * Marcar un anuncio como vendido cambiando su estado a SOLD.
 */
export const markItemAsSold = async (
  itemId: bigint,
  userId: string
) => {
  const res = await prisma.marketplaceItem.updateMany({
    where: {
      id: itemId,
      user_id: userId,
      status: ItemStatus.ACTIVE,
    },
    data: {
      status: ItemStatus.SOLD,
    },
  });

  if (res.count === 0) {
    throw new Error("No tienes permiso o el anuncio ya no está activo.");
  }
  return true;
}

/**
 * Listar los anuncios activos del usuario.
 */
export const listUserItems = async (userId: string) => {
  return prisma.marketplaceItem.findMany({
    where: { user_id: userId, status: ItemStatus.ACTIVE },
    orderBy: { created_at: "desc" },
  });
}

/**
 * Listar los anuncios vendidos del usuario.
 */
export const listUserSoldItems = async (userId: string) => {
  return prisma.marketplaceItem.findMany({
    where: { user_id: userId, status: ItemStatus.SOLD },
    orderBy: { created_at: "desc" },
  });
}