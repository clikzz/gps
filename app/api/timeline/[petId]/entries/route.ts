import { NextRequest } from 'next/server';
import { authenticateUser } from '@/server/middlewares/authMiddleware';
import * as timelineController from '@/server/controllers/timelineController';

/**
 * GET /api/timeline/[petId]/entries
 * Delega la obtención de entradas al controlador.
 */
export async function GET(request: NextRequest, { params }: { params: { petId: string } }) {
  // 1. Autenticar al usuario
  const user = await authenticateUser(request);
  if (user instanceof Response) return user;

  // 2. Delegar toda la lógica al controlador
  return timelineController.getEntries(user.id, params.petId);
}

/**
 * POST /api/timeline/[petId]/entries
 * Delega la creación de una nueva entrada al controlador.
 */
export async function POST(request: NextRequest, { params }: { params: { petId: string } }) {
  // 1. Autenticar al usuario
  const user = await authenticateUser(request);
  if (user instanceof Response) return user;

  // 2. Extraer el cuerpo de la petición
  const payload = await request.json();
  
  // 3. Delegar toda la lógica y el payload al controlador
  return timelineController.createEntry(user.id, params.petId, payload);
}