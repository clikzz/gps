import prisma from '@/lib/db';
import { NewTimelineEntryPayload, TimelineEntryWithPhotos } from '@/types/timeline';


export async function getTimelineEntriesByPetId(
  petId: bigint,
  filters?: {
    startDate?: string | null;
    endDate?: string | null;
    milestoneId?: string | null;
    skip?: number;
    take?: number;
  }
) {
  const where: any = { pet_id: petId };

  if (filters?.startDate) {
    where.event_date = { ...(where.event_date || {}), gte: new Date(filters.startDate) };
  }
  if (filters?.endDate) {
    where.event_date = { ...(where.event_date || {}), lte: new Date(filters.endDate) };
  }
  if (filters?.milestoneId) {
    where.Milestones = { some: { id: filters.milestoneId } };
  }

  const skip = typeof filters?.skip === "number" ? filters.skip : 0;
  const take = typeof filters?.take === "number" ? filters.take : 20;


  const [entries, total] = await Promise.all([
    prisma.timelineEntries.findMany({
      where,
      include: {
        TimelineEntryPhotos: true,
        Milestones: true,
      },
      orderBy: { event_date: 'desc' },
      skip,
      take,
    }),
    prisma.timelineEntries.count({ where }),
  ]);

  return { entries, total };
}


export async function createTimelineEntry(petId: bigint, userId: string, data: NewTimelineEntryPayload) {
  return await prisma.$transaction(async (tx) => {
    const newEntry = await tx.timelineEntries.create({
      data: {
        pet_id: petId,
        user_id: userId,
        title: data.title,
        description: data.description,
        event_date: new Date(data.eventDate),
        Milestones: data.milestoneIds?.length
          ? { connect: data.milestoneIds.map(id => ({ id })) }
          : undefined,
      },
    });

    const hasPhotos = data.photoUrls && data.photoUrls.length > 0;

    if (hasPhotos) {
      await tx.timelineEntryPhotos.createMany({
        data: (data.photoUrls ?? []).map((url, index) => ({
          timeline_entry_id: newEntry.id,
          photo_url: url,
          order: index + 1,
        })),
      });

      const alreadyHasFirstPhotoBadge = await tx.userBadge.findFirst({
        where: {
          userId: userId,
          badge: { key: "FIRST_PHOTO" },
        },
      });

      if (!alreadyHasFirstPhotoBadge) {
        const badge = await tx.badge.findUnique({
          where: { key: "FIRST_PHOTO" },
        });

        if (badge) {
          await tx.userBadge.create({
            data: {
              userId: userId,
              badgeId: badge.id,
              awardedAt: new Date(),
            },
          });
        }
      }
    }

    return tx.timelineEntries.findUniqueOrThrow({
      where: { id: newEntry.id },
      include: {
        TimelineEntryPhotos: true,
        Milestones: true,
      },
    });
  });
}



export async function getPetOwnerId(petId: bigint): Promise<string | null> {
  const pet = await prisma.pets.findUnique({
    where: { id: petId },
    select: { user_id: true },
  });
  return pet?.user_id ?? null;
}

export async function deleteTimelineEntry(entryId: string): Promise<string[]> {
  return await prisma.$transaction(async (tx) => {
    const entry = await tx.timelineEntries.findUnique({
      where: { id: entryId },
      include: { TimelineEntryPhotos: true },
    });
    if (!entry) {
      throw new Error('Entrada de timeline no encontrada');
    }

    const photoUrls = entry.TimelineEntryPhotos.map(photo => photo.photo_url);

    await tx.timelineEntryPhotos.deleteMany({
      where: { timeline_entry_id: entryId },
    });

    await tx.timelineEntries.delete({
      where: { id: entryId },
    });

    return photoUrls;
  });
}



export async function updateTimelineEntry(
  entryId: string,
  data: NewTimelineEntryPayload
): Promise<TimelineEntryWithPhotos> {
  return await prisma.$transaction(async (tx) => {

    const existing = await tx.timelineEntries.findUnique({
      where: { id: entryId },
      include: { TimelineEntryPhotos: true, Milestones: true },
    });
    if (!existing) {
      throw new Error('Entrada de timeline no encontrada');
    }

    await tx.timelineEntries.update({
      where: { id: entryId },
      data: {
        title: data.title,
        description: data.description,
        event_date: new Date(data.eventDate),
      },
    });

    await tx.timelineEntries.update({
      where: { id: entryId },
      data: {
        Milestones: {
          set: data.milestoneIds?.length
            ? data.milestoneIds.map(id => ({ id }))
            : [],
        },
      },
    });

    if (data.photoUrls && data.photoUrls.length > 0) {
      await tx.timelineEntryPhotos.deleteMany({
        where: { timeline_entry_id: entryId },
      });
      
      await tx.timelineEntryPhotos.createMany({
        data: data.photoUrls.map((url, idx) => ({
          timeline_entry_id: entryId,
          photo_url: url,
          order: idx + 1,
        })),
      });
    }

    return tx.timelineEntries.findUniqueOrThrow({
      where: { id: entryId },
      include: { TimelineEntryPhotos: true, Milestones: true },
    });
  });
}