import prisma from "@/lib/db";
import { reverseGeocode } from "@/utils/geocode";
import type { MarketplaceItemInput, ListFilters } from "@/types/marketplace";
import { ItemStatus, Prisma } from "@prisma/client";

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
        pet_category: data.pet_category ?? "ALL",
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

/**
 * Lista pública de anuncios con filtros opcionales.
 */
export const listMarketplaceItems = async (
  filters: ListFilters = {}
) => {
  const {
    category,
    pet_category,
    minPrice,
    maxPrice,
    lat,
    lng,
    radiusKm,
    order = "recent",
    page = 0,
    pageSize = 20,
  } = filters;

  const where: any = { status: ItemStatus.ACTIVE };
  if (category) where.category = category;
  if (pet_category) where.pet_category = pet_category;
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }
  if (lat !== undefined && lng !== undefined && radiusKm !== undefined) {
    where.AND = prisma.$queryRaw`ST_DWithin(
      geography(ST_MakePoint(longitude, latitude)),
      geography(ST_MakePoint(${lng}, ${lat})),
      ${radiusKm * 1000}
    )`;
  }

  const orderBy =
    order === "priceAsc"
      ? { price: Prisma.SortOrder.asc }
      : order === "priceDesc"
      ? { price: Prisma.SortOrder.desc }
      : { created_at: Prisma.SortOrder.desc };

  const items = await prisma.marketplaceItem.findMany({
    where,
    orderBy,
    skip: page * pageSize,
    take: pageSize,
    include: {
      seller: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar_url: true,
        },
      },
    },
  });

  return items;
};

/**
 * Listar ciudades existentes en el marketplace.
 */
export const listMarketplaceCities = async (): Promise<string[]> => {
  const raws = await prisma.marketplaceItem.findMany({
    where: { status: ItemStatus.ACTIVE },
    select: { city: true },
    distinct: ["city"],
    orderBy: { city: "asc" },
  });

  return raws
    .map((r) => r.city)
    .filter((c): c is string => Boolean(c));
};