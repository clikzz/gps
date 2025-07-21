// app/api/forum/users/[userId]/badges/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  req: NextRequest,
  context: { params: { userId: string } }
) {
  const userId = context.params.userId;

  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: { selectedBadgeIds: true },
  });
  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  // convertimos strings a numbers y cargamos las badges
  const badgeIds = user.selectedBadgeIds.map((id) => Number(id)).filter(Boolean);
  const badges = badgeIds.length
    ? await prisma.badge.findMany({
        where: { id: { in: badgeIds } },
        select: { id: true, name: true, description: true, icon_url: true },
      })
    : [];

  // formateamos
  const payload = badges.map((b) => ({
    id: b.id,
    label: b.name,
    description: b.description,
    icon: b.icon_url,
  }));

  return NextResponse.json(payload);
}
