import prisma from '@/lib/db';
import { NewTimelineEntryPayload } from '@/types/timeline';

/**
 * Obtiene todas las entradas del timeline para una mascota específica.
 * @param petId - El ID de la mascota (como BigInt).
 * @returns Una lista de entradas del timeline, incluyendo sus fotos.
 */
export async function getTimelineEntriesByPetId(petId: bigint) {
  return await prisma.timelineEntries.findMany({
    where: { pet_id: petId },
    include: {
      TimelineEntryPhotos: true,
    },
    orderBy: {
      event_date: 'desc',
    },
  });
}

/**
 * Crea una nueva entrada en el timeline y sus fotos asociadas en una transacción.
 * Si algo falla, se revierte toda la operación para no dejar datos corruptos.
 * @param petId - El ID de la mascota.
 * @param userId - El ID del usuario que crea la entrada.
 * @param data - Los datos validados de la nueva entrada.
 * @returns La entrada del timeline recién creada, con sus fotos.
 */
export async function createTimelineEntry(petId: bigint, userId: string, data: NewTimelineEntryPayload) {
  // Usamos una transacción para asegurar la integridad de los datos.
  // O se crea la entrada Y las fotos, o no se crea nada.
  return await prisma.$transaction(async (tx) => {
    const newEntry = await tx.timelineEntries.create({
      data: {
        pet_id: petId,
        user_id: userId,
        title: data.title,
        description: data.description,
        event_date: new Date(data.eventDate),
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

    // Devolvemos la entrada completa con las fotos recién creadas.
    return tx.timelineEntries.findUniqueOrThrow({
      where: { id: newEntry.id },
      include: {
        TimelineEntryPhotos: true,
      },
    });
  });
}

/**
 * Obtiene el ID del dueño de una mascota para verificaciones de permisos.
 * @param petId - El ID de la mascota.
 * @returns El ID del usuario dueño o null si la mascota no existe.
 */
export async function getPetOwnerId(petId: bigint): Promise<string | null> {
  const pet = await prisma.pets.findUnique({
    where: { id: petId },
    select: { user_id: true },
  });
  return pet?.user_id ?? null;
}