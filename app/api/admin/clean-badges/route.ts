import { authenticateUser } from "@/server/middlewares/auth.middleware";
import { getAllBadges } from "@/server/services/userprofile.service";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  const user = await authenticateUser(req);
  if (user instanceof Response) return user;

  try {
    const userRecord = await prisma.users.findUnique({
      where: { id: user.id },
      select: { role: true }
    });

    if (!userRecord || userRecord.role !== 'ADMIN') {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const allBadges = await getAllBadges();
    const validBadgeIds = allBadges.map(badge => badge.id.toString());

    const allUsers = await prisma.users.findMany({
      include: {
        userBadges: {
          include: { badge: true }
        }
      }
    });

    let cleanedUsers = 0;
    let totalInvalidBadges = 0;

    for (const userRecord of allUsers) {
      if (!userRecord.selectedBadgeIds || userRecord.selectedBadgeIds.length === 0) {
        continue;
      }

      const userUnlockedBadgeIds = userRecord.userBadges.map((ub: any) => ub.badge.id.toString());
      const currentSelected = userRecord.selectedBadgeIds;
      
      const validSelected = currentSelected.filter(badgeId => 
        userUnlockedBadgeIds.includes(badgeId)
      );

      if (validSelected.length !== currentSelected.length) {
        await prisma.users.update({
          where: { id: userRecord.id },
          data: { selectedBadgeIds: validSelected }
        });
        
        cleanedUsers++;
        totalInvalidBadges += (currentSelected.length - validSelected.length);
      }
    }

    return new Response(JSON.stringify({ 
      message: "Limpieza completada",
      cleanedUsers,
      totalInvalidBadges,
      totalUsersChecked: allUsers.filter(u => u.selectedBadgeIds && u.selectedBadgeIds.length > 0).length
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error en limpieza de badges:", error);
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
