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

export async function deleteTimelineEntry(entryId: string): Promise<string[]> {
  return await prisma.$transaction(async (tx) => {
    // 1. Obtener la entrada con sus fotos
    const entry = await tx.timelineEntries.findUnique({
      where: { id: entryId },
      include: { TimelineEntryPhotos: true },
    });
    if (!entry) {
      throw new Error('Entrada de timeline no encontrada');
    }

    // 2. Recoger URLs antes de borrar
    const photoUrls = entry.TimelineEntryPhotos.map(photo => photo.photo_url);

    // 3. Borrar registros de photos
    await tx.timelineEntryPhotos.deleteMany({
      where: { timeline_entry_id: entryId },
    });

    // 4. Borrar la entrada
    await tx.timelineEntries.delete({
      where: { id: entryId },
    });

    // 5. Devolver las URLs para que el controller las procese
    return photoUrls;
  });
}