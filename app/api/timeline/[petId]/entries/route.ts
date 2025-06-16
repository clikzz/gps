import { NextRequest } from 'next/server';
import { authenticateUser } from '@/server/middlewares/auth.middleware';
import * as timelineController from '@/server/controllers/timeline.controller';


export async function GET(request: NextRequest, { params }: { params: any }) {
  const user = await authenticateUser(request);
  if (user instanceof Response) return user;

  const { petId } = await params;

  return timelineController.getEntries(user.id, petId);
}

export async function POST(request: NextRequest, { params }: { params: any }) {
  const user = await authenticateUser(request);
  if (user instanceof Response) return user;

  const { petId } = await params;
  const payload = await request.json();

  return timelineController.createEntry(user.id, petId, payload);
}
