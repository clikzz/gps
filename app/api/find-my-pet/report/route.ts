import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/server/middlewares/authMiddleware";
import {  reportMissingPet } from "@/server/controllers/findMyPet.controller";

// POST /api/find-my-pet/report
export async function POST(req: NextRequest) {
  const user = await authenticateUser(req);
  if (user instanceof Response) {
    const body = await user.text();
    return new NextResponse(body, { status: user.status, headers: user.headers });
  }

  const body = await req.json();

  return reportMissingPet(user.id, body);
}