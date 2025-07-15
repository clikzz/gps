import prisma from "@/lib/db";
import { reverseGeocode } from "@/utils/geocode";
import type { MarketplaceItemInput, ListFilters, MarketplaceItem } from "@/types/marketplace";
import { Prisma, ItemStatus, ItemCategory, ItemCondition } from "@prisma/client";

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

/**
 * Lista pública de anuncios con filtros opcionales.
 */
export const listMarketplaceItems = async (
  filters: ListFilters = {}
): Promise<MarketplaceItem[]> => {
  const {
    category, minPrice, maxPrice,
    lat, lng, radiusKm,
    order = "recent", page = 0, pageSize = 20,
  } = filters;

  const clauses: Prisma.Sql[] = [
    Prisma.sql`status = ${ItemStatus.ACTIVE}`
  ];
  if (category) clauses.push(Prisma.sql` AND category = ${category}`);
  if (minPrice !== undefined) clauses.push(Prisma.sql` AND price >= ${minPrice}`);
  if (maxPrice !== undefined) clauses.push(Prisma.sql` AND price <= ${maxPrice}`);
  if (lat !== undefined && lng !== undefined && radiusKm !== undefined) {
    clauses.push(
      Prisma.sql` AND ST_DWithin(
        geography(ST_MakePoint(longitude, latitude)),
        geography(ST_MakePoint(${lng}, ${lat})),
        ${radiusKm * 1000}
      )`
    );
  }

  const orderSql =
    order === "priceAsc" ? Prisma.sql`price ASC`
    : order === "priceDesc" ? Prisma.sql`price DESC`
    : Prisma.sql`created_at DESC`;

  const rawList = await prisma.$queryRaw<
    Array<{
      id: bigint;
      user_id: string;
      title: string;
      description: string | null;
      category: ItemCategory;
      condition: ItemCondition;
      price: number;
      photo_urls: string[];
      latitude: number;
      longitude: number;
      city: string | null;
      region: string | null;
      country: string | null;
      status: ItemStatus;
      created_at: Date;
      updated_at: Date;
    }>
  >(
    Prisma.sql`
      SELECT
        id,
        user_id,
        title,
        description,
        category,
        condition,
        price::FLOAT AS price,
        photo_urls,
        latitude,
        longitude,
        city,
        region,
        country,
        status,
        created_at,
        updated_at
      FROM "MarketplaceItem"
      WHERE ${Prisma.join(clauses)}
      ORDER BY ${orderSql}
      LIMIT ${pageSize} OFFSET ${page * pageSize};
    `
  );

  return rawList.map((raw) => ({
    id: raw.id,
    user_id: raw.user_id,
    title: raw.title,
    description: raw.description ?? undefined,
    category: raw.category,
    condition: raw.condition,
    price: Number(raw.price),
    photo_urls: raw.photo_urls,
    latitude: raw.latitude,
    longitude: raw.longitude,
    city: raw.city ?? undefined,
    region: raw.region ?? undefined,
    country: raw.country ?? undefined,
    status: raw.status,
    created_at: new Date(raw.created_at),
    updated_at: new Date(raw.updated_at),
  }));
};