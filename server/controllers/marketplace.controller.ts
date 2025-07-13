import {
  createMarketplaceItem as createItemService,
  listMarketplaceItems as listItemsService,
  listUserItems as listUserItemsService,
  listUserSoldItems as listUserSoldItemsService,
  softDeleteMarketplaceItem as softDeleteService,
  markItemAsSold as markAsSoldService,
} from "@/server/services/marketplace.service";
import {
  createItemSchema,
  listFiltersSchema,
  deleteItemSchema,
  markSoldSchema,
} from "@/server/validations/marketplace.validation";
import type { MarketplaceItemInput, ListFilters, MarketplaceItem } from "@/types/marketplace";

/**
 * Crear un anuncio.
 */
export const createMarketplaceItem = async (
  userId: string,
  body: any
) => {
  const parseResult = createItemSchema.safeParse(body);
  if (!parseResult.success) {
    return new Response(JSON.stringify({ error: parseResult.error.format() }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const data = parseResult.data as MarketplaceItemInput;
  try {
    const item = await createItemService(userId, data);
    const output = {
      id: item.id.toString(),
      user_id: item.user_id,
      title: item.title,
      description: item.description,
      category: item.category,
      condition: item.condition,
      price: item.price.toString(),
      photo_urls: item.photo_urls,
      latitude: item.latitude,
      longitude: item.longitude,
      city: item.city,
      region: item.region,
      country: item.country,
      status: item.status,
      created_at: item.created_at.toISOString(),
      updated_at: item.updated_at.toISOString(),
    };
    return new Response(JSON.stringify(output), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    const msg = err.message || "Error al crear anuncio.";
    const status = msg.includes("imagen") ? 400 : 500;
    return new Response(JSON.stringify({ error: msg }), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }
};

/**
 * Listar anuncios públicos.
 */
export const fetchPublicMarketplaceItems = async (
  body: any
) => {
  const parseResult = listFiltersSchema.safeParse(body);
  if (!parseResult.success) {
    return new Response(JSON.stringify({ error: parseResult.error.format() }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const filters = parseResult.data as ListFilters;
  const list = await listItemsService(filters);
  const output = list.map((item: MarketplaceItem) => ({
    id: item.id.toString(),
    user_id: item.user_id,
    title: item.title,
    description: item.description,
    category: item.category,
    condition: item.condition,
    price: item.price.toString(),
    photo_urls: item.photo_urls,
    latitude: item.latitude,
    longitude: item.longitude,
    city: item.city,
    region: item.region,
    country: item.country,
    status: item.status,
    created_at: item.created_at.toISOString(),
    updated_at: item.updated_at.toISOString(),
  }));

  return new Response(JSON.stringify(output), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

/**
 * Listar anuncios activos de un usuario.
 */
export const fetchUserMarketplaceItems = async (
  userId: string
) => {
  const list = await listUserItemsService(userId);
  const output = list.map(item => ({
    id: item.id.toString(),
    title: item.title,
    status: item.status,
    created_at: item.created_at.toISOString(),
  }));

  return new Response(JSON.stringify(output), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

/**
 * Listar anuncios vendidos de un usuario.
 */
export const fetchUserSoldMarketplaceItems = async (
  userId: string
) => {
  const list = await listUserSoldItemsService(userId);
  const output = list.map(item => ({
    id: item.id.toString(),
    title: item.title,
    sold_at: item.updated_at.toISOString(),
  }));

  return new Response(JSON.stringify(output), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

/**
 * Eliminar anuncio.
 */
export const deleteMarketplaceItem = async (
  userId: string,
  params: { id: string }
) => {
  const parseResult = deleteItemSchema.safeParse(params);
  if (!parseResult.success) {
    return new Response(JSON.stringify({ error: parseResult.error.format() }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const itemId = BigInt(params.id);
  try {
    await softDeleteService(itemId, userId);
    return new Response(null, { status: 204 });
  } catch (err: any) {
    const msg = err.message || "No autorizado.";
    return new Response(JSON.stringify({ error: msg }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }
};

/**
 * Marcar anuncio como vendido.
 */
export const markMarketplaceItemAsSold = async (
  userId: string,
  params: { id: string }
) => {
  const parseResult = markSoldSchema.safeParse(params);
  if (!parseResult.success) {
    return new Response(JSON.stringify({ error: parseResult.error.format() }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const itemId = BigInt(params.id);
  try {
    await markAsSoldService(itemId, userId);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    const msg = err.message || "No autorizado.";
    return new Response(JSON.stringify({ error: msg }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }
};
