import { NextRequest } from 'next/server';
import { authenticateUser } from '@/server/middlewares/auth.middleware';
import * as timelineController from '@/server/controllers/timeline.controller';

export async function GET(
  request: NextRequest,
  { params }: { params: any }
) {
  const user = await authenticateUser(request);
  if (user instanceof Response) return user;

  // Esperamos params antes de usarlo
  const { petId } = await params;

  // Pasamos `request` para que el controlador lea los filtros (searchParams)
  return timelineController.getEntries(user.id, petId, request);
}

export async function POST(
  request: NextRequest,
  { params }: { params: any }
) {
  const user = await authenticateUser(request);
  if (user instanceof Response) return user;

  // Await params aquí también
  const { petId } = await params;
  const payload = await request.json();

  // --- INICIO NORMALIZACIÓN DE FECHA A MEDIANOCHE UTC ---
  if (payload.eventDate) {
    try {
      const dateObj = new Date(payload.eventDate);
      if (!isNaN(dateObj.getTime())) {
        const normalized = new Date(
          Date.UTC(
            dateObj.getUTCFullYear(),
            dateObj.getUTCMonth(),
            dateObj.getUTCDate()
          )
        ).toISOString();
        payload.eventDate = normalized;
      }
    } catch {
      // Si falla, dejamos payload.eventDate sin cambios
    }
  }
  // --- FIN NORMALIZACIÓN DE FECHA ---

  return timelineController.createEntry(user.id, petId, payload);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: any }
) {
  const user = await authenticateUser(request);
  if (user instanceof Response) return user;

  // Await params aquí también
  const { petId } = await params;

  const url = new URL(request.url);
  const entryId = url.searchParams.get("id");
  if (!entryId) {
    return new Response(
      JSON.stringify({ error: "Invalid entry ID" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return timelineController.deleteEntry(user.id, petId, entryId);
}
