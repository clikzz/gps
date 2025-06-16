import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/server/middlewares/authMiddleware";
import {
  reportMissingPet,
  fetchRecentMissingPets,
  fetchAllMissingPets,
  fetchMyMissingPets,
  fetchUserPets,
  reportPetFound
} from "@/server/controllers/find.controller";

/**
 * GET  /api/find?mode=recent → lista reportes del último mes
 *      /api/find?mode=all    → lista todos los reportes
 *      /api/find?mode=pets   → lista mascotas del usuario autenticado
 *      /api/find?mode=my     → lista reportes de mascotas desaparecidas del usuario autenticado
 */
export async function GET(req: NextRequest) {
  const user = await authenticateUser(req);
  if (user instanceof Response) {
    const body = await user.text();
    return new NextResponse(
      body, 
      { status: user.status, 
        headers: user.headers 
      });
  }

  const url = new URL(req.url);
  const mode = url.searchParams.get("mode") || "recent";

  if (mode === "all") {
    // /api/find?mode=all
    return fetchAllMissingPets();
  }

  if (mode === "pets") {
    // /api/find?mode=pets
    return fetchUserPets(user.id);
  }

  if (mode === "my") {
    // /api/find?mode=my
    return fetchMyMissingPets(user.id);
  }

  // /api/find?mode=recent
  return fetchRecentMissingPets();
}

/**
 * POST /api/find → crea un nuevo reporte
 */
export async function POST(req: NextRequest) {
  const user = await authenticateUser(req);
  if (user instanceof Response) {
    const body = await user.text();
    return new NextResponse(body, { status: user.status, headers: user.headers });
  }

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return new NextResponse(
      JSON.stringify({ error: "JSON inválido" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  return reportMissingPet(user.id, payload);
}

/**
 * PUT /api/find?mode=found&pet=123 → reporta una mascota encontrada
 */
export async function PUT(req: NextRequest) {
  const user = await authenticateUser(req);
  if (user instanceof Response) {
    const body = await user.text();
    return new NextResponse(body, { status: user.status, headers: user.headers });
  }

  const url = new URL(req.url);
  const mode = url.searchParams.get("mode");
  if (mode !== "found") {
    return new NextResponse(
      JSON.stringify({ error: "Modo no soportado" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const petIdRaw = url.searchParams.get("pet");
  const petId = petIdRaw ? parseInt(petIdRaw, 10) : NaN;
  if (isNaN(petId)) {
    return new NextResponse(
      JSON.stringify({ error: "pet_id inválido" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  return reportPetFound(user.id, petId);
}