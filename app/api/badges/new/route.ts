import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/server/middlewares/auth.middleware";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
  const authOrResp = await authenticateUser(req);

  if (authOrResp instanceof Response) {
    return authOrResp;
  }

  const userId = authOrResp.id;

  const sinceParam = req.nextUrl.searchParams.get("since");
  let sinceDate: Date;
  try {
    sinceDate = sinceParam ? new Date(sinceParam) : new Date(0);
  } catch {
    return NextResponse.json({ error: "since inválido" }, { status: 400 });
  }

  const newUserBadges = await prisma.userBadge.findMany({
    where: {
      userId,
      awardedAt: { gt: sinceDate },
    },
    include: {
      badge: {
        select: { key: true, name: true, description: true, icon_url: true },
      },
    },
    orderBy: { awardedAt: "asc" },
  });

  const payload = newUserBadges.map((ub) => ({
    id: ub.id,
    key: ub.badge.key,
    title: ub.badge.name,
    description: ub.badge.description ?? "",
    image: ub.badge.icon_url ?? "",
    awardedAt: ub.awardedAt.toISOString(),
  }));

  return NextResponse.json(payload);
}
