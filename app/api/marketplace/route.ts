import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/server/middlewares/auth.middleware";
import {
  createMarketplaceItem,
  fetchPublicMarketplaceItems,
  fetchUserMarketplaceItems,
  fetchUserSoldMarketplaceItems,
  deleteMarketplaceItem,
  markMarketplaceItemAsSold,
} from "@/server/controllers/marketplace.controller";


export async function GET(req: NextRequest) {
  const user = await authenticateUser(req);
  if (user instanceof Response) return new NextResponse(await user.text(), { status: user.status, headers: user.headers });

  const mode = new URL(req.url).searchParams.get("mode") || "public";

  switch (mode) {
    case "public":
      const raw = await req.json().catch(() => ({}));
      return fetchPublicMarketplaceItems(raw);
    case "user":
      return fetchUserMarketplaceItems(user.id);
    case "sold":
      return fetchUserSoldMarketplaceItems(user.id);
    default:
      return fetchPublicMarketplaceItems(await req.json().catch(() => ({})));
  }
}

export async function POST(req: NextRequest) {
  const user = await authenticateUser(req);
  if (user instanceof Response) return new NextResponse(await user.text(), { status: user.status, headers: user.headers });

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return new NextResponse(
      JSON.stringify({ error: "JSON inválido" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
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
    return new NextResponse(
      JSON.stringify({ error: "Parámetros inválidos" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  return markMarketplaceItemAsSold(user.id, { id });
}

export async function DELETE(req: NextRequest) {
  const user = await authenticateUser(req);
  if (user instanceof Response) return new NextResponse(await user.text(), { status: user.status, headers: user.headers });

  const url = new URL(req.url);
  const mode = url.searchParams.get("mode");
  const id = url.searchParams.get("id");
  if (mode !== "delete" || !id) {
    return new NextResponse(
      JSON.stringify({ error: "Parámetros inválidos" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  return deleteMarketplaceItem(user.id, { id });
}
