import { NextResponse } from "next/server";
import {
  createMarketplaceItem as createItemService,
  listMarketplaceItems as listItemsService,
  listUserItems as listUserItemsService,
  listUserSoldItems as listUserSoldItemsService,
  softDeleteMarketplaceItem as softDeleteService,
  markItemAsSold as markAsSoldService,
  listMarketplaceCities as listCitiesService,
  listMarketplacePetCategories as listPetCategoriesService,
  countUserMarketplaceItems as countUserItemsService,
  getMarketplaceItemById as getItemByIdService,
} from "@/server/services/marketplace.service";
import {
  createItemSchema,
  listFiltersSchema,
  deleteItemSchema,
  markSoldSchema,
} from "@/server/validations/marketplace.validation";
import type { MarketplaceItemInput, ListFilters } from "@/types/marketplace";

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
      pet_category: item.pet_category,
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
 * Obtener un anuncio por ID.
 */
export const fetchMarketplaceItemById = async (params: { id?: string }) => {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: "Falta el parámetro id" }, { status: 400 });
  }

  try {
    const item = await getItemByIdService(BigInt(id));
    return NextResponse.json({
      id: item.id.toString(),
      title: item.title,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      pet_category: item.pet_category,
      condition: item.condition,
      photo_urls: item.photo_urls,
      latitude: item.latitude,
      longitude: item.longitude,
      city: item.city,
      region: item.region,
      country: item.country,
      status: item.status,
      created_at: item.created_at.toISOString(),
      updated_at: item.updated_at.toISOString(),
    }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.message === "Anuncio no encontrado." ? 404 : 500 });
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
  const output = list.map(item => ({
    id: item.id.toString(),
    user_id: item.user_id,
    seller: {
      name: item.seller.name,
      email: item.seller.email,
      avatar_url: item.seller.avatar_url,
    },
    title: item.title,
    description: item.description ?? undefined,
    category: item.category,
    pet_category: item.pet_category,
    condition: item.condition,
    price: item.price.toString(),
    photo_urls: item.photo_urls,
    latitude: item.latitude,
    longitude: item.longitude,
    city: item.city ?? undefined,
    region: item.region ?? undefined,
    country: item.country ?? undefined,
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
    price: item.price.toString(),
    pet_category: item.pet_category,
    category: item.category,
    condition: item.condition,
    photo_urls: item.photo_urls,
    city: item.city ?? undefined,
    region: item.region ?? undefined,
    country: item.country ?? undefined,
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
    status: item.status,
    price: item.price.toString(),
    photo_urls: item.photo_urls,
    category: item.category,
    condition: item.condition,
    pet_category: item.pet_category,
    city: item.city ?? undefined,
    sold_price: item.sales?.price.toString(),
    sold_at: item.sales?.sold_at.toISOString(),
    notes: item.sales?.notes ?? undefined,
    created_at: item.created_at.toISOString(),
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
  params: { id: string; sold_price: string; sold_at: string; notes?: string }
) => {
  const parseResult = markSoldSchema.safeParse(params);
  if (!parseResult.success) {
    return new Response(JSON.stringify({ error: parseResult.error.format() }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { id, sold_price, sold_at, notes } = parseResult.data;

  try {
    const sale = await markAsSoldService(
      BigInt(id),
      userId,
      sold_price,
      new Date(sold_at),
      notes,
    );
    return NextResponse.json({
      success: true,
      sale: {
        price: sale.price.toString(),
        sold_at: sale.sold_at.toISOString(),
        notes: sale.notes,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
};

/**
 * Listar ciudades existentes en el marketplace.
 */
export const fetchMarketplaceCities = async () => {
  try {
    const cities = await listCitiesService();
    return NextResponse.json({ cities }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Error interno" },
      { status: 500 }
    );
  }
};

/**
 * Listar tipos de mascotas disponibles en el marketplace.
 */
export const fetchMarketplacePetCategories = async () => {
  try {
    const categories = await listPetCategoriesService();
    return NextResponse.json({ categories }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Error interno" },
      { status: 500 }
    );
  }
};

/**
 * Listar cantidad de articulos ha publicado un usuario, cuantos tiene 
 * activos y cuantos vendidos.
 */
export const fetchUserMarketplaceStats = async (userId: string) => {
  try {
    const stats = await countUserItemsService(userId);
    return NextResponse.json(stats, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Error interno" },
      { status: 500 }
    );
  }
}