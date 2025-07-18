import prisma from "@/lib/db";

export async function assignBadge(userId: string, badgeKey: string): Promise<boolean> {
  const badge = await prisma.badge.findUnique({ where: { key: badgeKey } });
  if (!badge) return false;
  const exists = await prisma.userBadge.findUnique({
    where: { userId_badgeId: { userId, badgeId: badge.id } },
  });
  if (exists) return false;
  await prisma.userBadge.create({
    data: { userId, badgeId: badge.id },
  });
  return true;
}
