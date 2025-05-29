import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/server/middlewares/authMiddleware';
import { fetchRecentMissingPets } from '@/server/controllers/findMyPet.controller';

// GET /api/find-my-pet/recent
export async function GET(req: NextRequest) {
  const user = await authenticateUser(req);
  if (user instanceof Response) {
    const body = await user.text();
    return new NextResponse(body, { status: user.status, headers: user.headers });
  }

  return fetchRecentMissingPets();
}