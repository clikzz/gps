import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/server/middlewares/auth.middleware";
import {
  reportMissingPet,
  fetchRecentMissingPets,
  fetchAllMissingPets,
  fetchMyMissingPets,
  fetchUserPets,
  reportPetFound,
  fetchOtherMissingPets,
  reportFound,
  fetchFoundReports
} from "@/server/controllers/find.controller";

/**
 * GET  /api/find?mode=recent → lista reportes del último mes
 *      /api/find?mode=all    → lista todos los reportes
 *      /api/find?mode=pets   → lista mascotas del usuario autenticado
 *      /api/find?mode=my     → lista reportes de mascotas desaparecidas del usuario autenticado
 *      /api/find?mode=others → lista reportes de mascotas desaparecidas de otros usuarios
 *      /api/find?mode=found  → lista reportes de mascotas encontradas
 */
export async function GET(req: NextRequest) {
  const user = await authenticateUser(req);
  if (user instanceof Response) return new NextResponse(await user.text(), { status: user.status, headers: user.headers });

  const mode = new URL(req.url).searchParams.get("mode") || "recent";

  switch (mode) {
    case "all": return fetchAllMissingPets();               // /api/find?mode=all
    case "pets": return fetchUserPets(user.id);             // /api/find?mode=pets
    case "my": return fetchMyMissingPets(user.id);          // /api/find?mode=my
    case "others": return fetchOtherMissingPets(user.id);   // /api/find?mode=others
    case "found": return fetchFoundReports(user.id);        // /api/find?mode=found
    default: return fetchRecentMissingPets();               // /api/find?mode=recent
  }
}

/**
 * POST /api/find → crea un nuevo reporte
 *      /api/find?mode=found → reporta una mascota de otro usuario como encontrada
 */
export async function POST(req: NextRequest) {
  const user = await authenticateUser(req);
  if (user instanceof Response) return new NextResponse(await user.text(), { status: user.status, headers: user.headers });

  const mode = new URL(req.url).searchParams.get("mode");

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return new NextResponse(JSON.stringify({ error: "JSON inválido" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  switch (mode) {
    case "found": return reportFound(user.id, payload);
    default: return reportMissingPet(user.id, payload);
  }
}

/**
 * PUT /api/find/resolved → marca una mascota propia como encontrada
 */
export async function PUT(req: NextRequest) {
  const user = await authenticateUser(req);
  if (user instanceof Response) return new NextResponse(await user.text(), { status: user.status, headers: user.headers });

  const url = new URL(req.url);
  const mode = url.searchParams.get("mode");
  const petIdRaw = url.searchParams.get("pet");

  if (mode !== "resolved" || !petIdRaw) {
    return new NextResponse(
      JSON.stringify({ error: "Parámetros inválidos" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const petId = parseInt(petIdRaw, 10);
  if (isNaN(petId)) {
    return new NextResponse(
      JSON.stringify({ error: "pet debe ser un número" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  return reportPetFound(user.id, petId);
}