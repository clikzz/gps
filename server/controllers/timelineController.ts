import { NextResponse } from 'next/server';
import * as timelineService from '@/server/services/timelineService';
import { NewTimelineEntrySchema } from '@/server/validations/timelineValidation';
import { TimelineEntryWithPhotos } from '@/app/types/timeline';


function serializeEntry(entry: TimelineEntryWithPhotos) {
  return {
    ...entry,
    id: entry.id.toString(),
    pet_id: entry.pet_id.toString(),

    Milestones: entry.Milestones.map(m => ({
      id: m.id,
      name: m.name,
      icon_url: m.icon_url,
    })),

    TimelineEntryPhotos: entry.TimelineEntryPhotos.map(p => ({
      ...p,
      id: p.id.toString(),
      timeline_entry_id: p.timeline_entry_id.toString(),
    })),
  };
}

export async function getEntries(userId: string, petIdStr: string) {
    try {
        const petId = BigInt(petIdStr);

        const ownerId = await timelineService.getPetOwnerId(petId);
        if (!ownerId) {
             return NextResponse.json({ error: 'Mascota no encontrada.' }, { status: 404 });
        }
        if (ownerId !== userId) {
            return NextResponse.json({ error: 'No autorizado para ver este timeline.' }, { status: 403 });
        }

        const entries = await timelineService.getTimelineEntriesByPetId(petId);
        const serializedEntries = entries.map(serializeEntry);

        return NextResponse.json(serializedEntries);

    } catch (error) {
        console.error(`[TimelineController] Error en getEntries:`, error);
        return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
    }
}

export async function createEntry(userId: string, petIdStr: string, payload: any) {
    try {
        const petId = BigInt(petIdStr);

        if (!await timelineService.getPetOwnerId(petId)) {
            return NextResponse.json({ error: 'Mascota no encontrada.' }, { status: 404 });
        }

        const validation = NewTimelineEntrySchema.safeParse(payload);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error.format() }, { status: 400 });
        }

        const newEntry = await timelineService.createTimelineEntry(petId, userId, validation.data);
        const serializedEntry = serializeEntry(newEntry);

        return NextResponse.json(serializedEntry, { status: 201 });

    } catch (error) {
        console.error(`[TimelineController] Error en createEntry:`, error);
        return NextResponse.json({ error: 'Error interno del servidor al crear la entrada.' }, { status: 500 });
    }
}