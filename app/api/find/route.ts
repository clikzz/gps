import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/server/middlewares/auth.middleware";
import {
  reportMissingPet,
  fetchRecentMissingPets,
  fetchAllMissingPets,
  fetchMyMissingPets,
  fetchUserPets,
  reportPetFound,
  fetchOtherMissingPets
} from "@/server/controllers/find.controller";
import { report } from "process";

/**
 * GET  /api/find?mode=recent → lista reportes del último mes
 *      /api/find?mode=all    → lista todos los reportes
 *      /api/find?mode=pets   → lista mascotas del usuario autenticado
 *      /api/find?mode=my     → lista reportes de mascotas desaparecidas del usuario autenticado
 *      /api/find?mode=others → lista reportes de mascotas desaparecidas de otros usuarios
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
    default: return fetchRecentMissingPets();               // /api/find?mode=recent
  }

  // if (mode === "all") {
  //   // /api/find?mode=all
  //   return fetchAllMissingPets();
  // }

  // if (mode === "pets") {
  //   // /api/find?mode=pets
  //   return fetchUserPets(user.id);
  // }

  // if (mode === "my") {
  //   // /api/find?mode=my
  //   return fetchMyMissingPets(user.id);
  // }

  // if (mode === "others") {
  //   // /api/find?mode=others
  //   return fetchOtherMissingPets(user.id);
  // }

  // // /api/find?mode=recent
  // return fetchRecentMissingPets();
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
    case "found": return reportPetFound(user.id, payload);
    default: return reportMissingPet(user.id, payload);
  }
}

/**
 * PUT /api/find/found → marca una mascota como encontrada
 */
export async function PUT(req: NextRequest) {
  const user = await authenticateUser(req);
  if (user instanceof Response) return new NextResponse(await user.text(), { status: user.status, headers: user.headers });

  const url = new URL(req.url);
  const mode = url.searchParams.get("mode");
  const petIdRaw = url.searchParams.get("pet");

  if (mode !== "found" || !petIdRaw) {
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