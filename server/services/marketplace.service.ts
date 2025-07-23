import prisma from "@/lib/db";
import { reverseGeocode } from "@/utils/geocode";
import type { MarketplaceItemInput, ListFilters } from "@/types/marketplace";
import { ItemStatus, PetCategory, Prisma } from "@prisma/client";

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

/** Editar un anuncio existente en el marketplace.
 */
export const updateMarketplaceItem = async (
  itemId: bigint,
  userId: string,
  data: Partial<MarketplaceItemInput>
) => {
  return prisma.$transaction(async (tx) => {
    const item = await tx.marketplaceItem.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      throw new Error("Anuncio no encontrado.");
    }

    if (item.user_id !== userId) {
      throw new Error("No tienes permiso para editar este anuncio.");
    }

    const updatedItem = await tx.marketplaceItem.update({
      where: { id: itemId },
      data: {
        ...data,
      },
    });

    return updatedItem;
  });
}

/**
 * Obtener anuncio por ID.
 */
export const getMarketplaceItemById = async (itemId: bigint) => {
  const item = await prisma.marketplaceItem.findUnique({
    where: { id: itemId },
  });

  if (!item) {
    throw new Error("Anuncio no encontrado.");
  }

  return item;
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
  userId: string,
  soldPrice: number,
  soldAt: Date,
  notes?: string
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

  const sale = await prisma.sale.create({
    data: {
      item_id: itemId,
      user_id: userId,
      price: soldPrice,
      sold_at: soldAt,
      notes,
    },
  });

  return sale;
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
    include: { sales: true },
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
export const listMarketplaceCities = async (): Promise<{ country: string; city: string }[]> => {
  const raws = await prisma.marketplaceItem.findMany({
    where: { status: ItemStatus.ACTIVE },
    select: { city: true, country: true },
    distinct: ["city", "country"],
    orderBy: [
      { city: "asc" },
      { country: "asc" },
    ],
  });

  return raws
    .filter(r => r.country && r.city)
    .map(r => ({ country: r.country!, city: r.city! }));
};

/**
 * Listar los tipos de mascotas existentes en el marketplace.
 */
export const listMarketplacePetCategories = async (): Promise<string[]> => {
  const raws = await prisma.marketplaceItem.findMany({
    where: { status: ItemStatus.ACTIVE },
    select: { pet_category: true },
    distinct: ["pet_category"],
    orderBy: { pet_category: "asc" },
  });

  return raws
    .map((r) => r.pet_category)
    .filter((c): c is PetCategory => Boolean(c));
};

/**
 * Listar cantidad de articulos ha publicado un usuario, cuantos tiene 
 * activos y cuantos vendidos.
 */
export async function countUserMarketplaceItems(userId: string) {
  const [total, active, sold] = await Promise.all([
    prisma.marketplaceItem.count({
      where: { user_id: userId },
    }),
    prisma.marketplaceItem.count({
      where: { user_id: userId, status: ItemStatus.ACTIVE },
    }),
    prisma.marketplaceItem.count({
      where: { user_id: userId, status: ItemStatus.SOLD },
    }),
  ])

  return { total, active, sold };
};