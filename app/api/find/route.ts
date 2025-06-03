import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/server/middlewares/authMiddleware";
import {
  reportMissingPet,
  fetchRecentMissingPets,
  fetchAllMissingPets,
  fetchUserPets
} from "@/server/controllers/find.controller";

/**
 * GET  /api/find?mode=recent → lista reportes del último mes
 *      /api/find?mode=all    → lista todos los reportes
 *      /api/find?mode=pets   → lista mascotas del usuario autenticado
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

  const formData = await req.formData();

  const petIdRaw = formData.get('pet_id');
  const latRaw = formData.get('latitude');
  const lngRaw = formData.get('longitude');
  const descriptionRaw = formData.get('description');

  const pet_id = typeof petIdRaw === 'string' ? parseInt(petIdRaw, 10) : NaN;
  const latitude = typeof latRaw === 'string' ? parseFloat(latRaw) : NaN;
  const longitude = typeof lngRaw === 'string' ? parseFloat(lngRaw) : NaN;
  const description = typeof descriptionRaw === 'string' ? descriptionRaw : undefined;

  if (isNaN(pet_id) || isNaN(latitude) || isNaN(longitude)) {
    return new NextResponse(
      JSON.stringify({
        error: 'pet_id, latitude y longitude son obligatorios y deben ser números válidos',
      }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // por mientras
  const photo_url = null;

  const body = {
    pet_id,
    latitude,
    longitude,
    photo_url,
    description,
  };

  return reportMissingPet(user.id, body);
}