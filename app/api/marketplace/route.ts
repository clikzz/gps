import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/server/middlewares/auth.middleware";
import {
  createMarketplaceItem,
  fetchPublicMarketplaceItems,
  fetchUserMarketplaceItems,
  fetchUserSoldMarketplaceItems,
  deleteMarketplaceItem,
  markMarketplaceItemAsSold,
  fetchMarketplaceCities,
  fetchMarketplacePetCategories,
  fetchUserMarketplaceStats,
  fetchMarketplaceItemById,
  updateMarketplaceItem,
  fetchFavorites,
  createFavorite,
  deleteFavorite,
  deleteAllFavorites
} from "@/server/controllers/marketplace.controller";


export async function GET(req: NextRequest) {
  const user = await authenticateUser(req);
  if (user instanceof Response) return new NextResponse(await user.text(), { status: user.status, headers: user.headers });

  const url = new URL(req.url);
  const mode = url.searchParams.get("mode") || "public";
  const id = url.searchParams.get("id");

  const filters = {
    category: url.searchParams.get("category") || undefined,
    minPrice: url.searchParams.has("minPrice") ? Number(url.searchParams.get("minPrice")) : undefined,
    maxPrice: url.searchParams.has("maxPrice") ? Number(url.searchParams.get("maxPrice")) : undefined,
  }

  switch (mode) {
    case "public":
      return fetchPublicMarketplaceItems(filters);
    case "user":
      return fetchUserMarketplaceItems(user.id);
    case "sold":
      return fetchUserSoldMarketplaceItems(user.id);
    case "cities":
      return fetchMarketplaceCities();
    case "pet-categories":
      return fetchMarketplacePetCategories();
    case "stats":
      return fetchUserMarketplaceStats(user.id);
    case "item":
      return fetchMarketplaceItemById({ id: id ?? undefined });
    case "favorites":
      return fetchFavorites(user.id);
    default:
      return fetchPublicMarketplaceItems(filters);
  }
}

export async function POST(req: NextRequest) {
  const user = await authenticateUser(req);
  if (user instanceof Response) {
    return new NextResponse(await user.text(), { status: user.status, headers: user.headers });
  }

  const url = new URL(req.url);
  const mode = url.searchParams.get("mode");

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return new NextResponse(
      JSON.stringify({ error: "JSON inválido" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (mode === "favorite") {
    return createFavorite(user.id, { itemId: payload.itemId });
  }

  return createMarketplaceItem(user.id, payload);
}

export async function PUT(req: NextRequest) {
  const user = await authenticateUser(req);
  if (user instanceof Response) return new NextResponse(await user.text(), { status: user.status, headers: user.headers });

  const url = new URL(req.url);
  const mode = url.searchParams.get("mode");
  const id = url.searchParams.get("id");
  if (mode !== "sold" || !id) {
    return NextResponse.json(
      { error: "Parámetros inválidos" },
      { status: 400 }
    );
  }

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { error: "JSON inválido" },
      { status: 400 }
    );
  }

  const params = {
    id,
    sold_price: payload.sold_price,
    sold_at: payload.sold_at,
    notes: payload.notes,
  };

  return markMarketplaceItemAsSold(user.id, params);
}

export async function DELETE(req: NextRequest) {
  const user = await authenticateUser(req);
  if (user instanceof Response) {
    return new NextResponse(await user.text(), {
      status: user.status,
      headers: user.headers,
    });
  }

  const url = new URL(req.url);
  const mode = url.searchParams.get("mode");
  const id = url.searchParams.get("id");

  if (mode === "favorites") {
    return deleteAllFavorites(user.id);
  }

  if (mode === "favorite" && id) {
    return deleteFavorite(user.id, { itemId: id });
  }

  if (mode === "delete" && id) {
    return deleteMarketplaceItem(user.id, { id });
  }

  return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
}

export async function PATCH(req: NextRequest) {
  const user = await authenticateUser(req);
  if (user instanceof Response) {
    return new NextResponse(await user.text(), {
      status:  user.status,
      headers: user.headers,
    });
  }

  const url = new URL(req.url);
  const mode = url.searchParams.get("mode");
  const id = url.searchParams.get("id");

  if (mode !== "update" || !id) {
    return NextResponse.json(
      { message: "Parámetros inválidos para actualización." },
      { status: 400 }
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { message: "JSON inválido." },
      { status: 400 }
    );
  }

  return updateMarketplaceItem(id, user.id, body);
}