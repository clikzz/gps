import prisma from '@/lib/db';
import { NewTimelineEntryPayload } from '@/types/timeline';


export async function getTimelineEntriesByPetId(petId: bigint) {
  return await prisma.timelineEntries.findMany({
    where: { pet_id: petId },
    include: {
      TimelineEntryPhotos: true,
      Milestones: true,       
    },
    orderBy: { event_date: 'desc' },
  });
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

    if (data.photoUrls && data.photoUrls.length > 0) {
      await tx.timelineEntryPhotos.createMany({
        data: data.photoUrls.map((url, index) => ({
          timeline_entry_id: newEntry.id,
          photo_url: url,
          order: index + 1,
        })),
      });
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