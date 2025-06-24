import { NextResponse } from 'next/server';
import * as timelineService from '@/server/services/timeline.service';
import { NewTimelineEntrySchema } from '@/server/validations/timeline.validation';
import { TimelineEntryWithPhotos } from '@/types/timeline';
import { createClient } from '@/utils/supabase/server';

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

export async function getEntries(userId: string, petIdStr: string, request?: any) {
    try {
        const petId = BigInt(petIdStr);

        const ownerId = await timelineService.getPetOwnerId(petId);
        if (!ownerId) {
             return NextResponse.json({ error: 'Mascota no encontrada.' }, { status: 404 });
        }
        if (ownerId !== userId) {
            return NextResponse.json({ error: 'No autorizado para ver este timeline.' }, { status: 403 });
        }

        let searchParams;
        if (request?.nextUrl?.searchParams) {
            searchParams = request.nextUrl.searchParams;
        } else if (request?.url) {
            searchParams = new URL(request.url, process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000").searchParams;
        } else {
            searchParams = new URLSearchParams();
        }

        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const milestoneId = searchParams.get('milestoneId') || undefined;
        const skip = Number(searchParams.get('skip')) || 0;
        const take = Number(searchParams.get('take')) || 20;

        const { entries, total } = await timelineService.getTimelineEntriesByPetId(petId, {
            startDate,
            endDate,
            milestoneId,
            skip,
            take
        });

        const serializedEntries = entries.map(serializeEntry);

        return NextResponse.json({ entries: serializedEntries, total });

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

export async function deleteEntry(
  userId: string,
  petIdStr: string,
  entryId: string
) {
  try {
    const petId = BigInt(petIdStr);

    const ownerId = await timelineService.getPetOwnerId(petId);
    if (!ownerId) {
      return NextResponse.json({ error: 'Mascota no encontrada.' }, { status: 404 });
    }
    if (ownerId !== userId) {
      return NextResponse.json({ error: 'No autorizado para eliminar esta entrada.' }, { status: 403 });
    }

    let photoUrls: string[];
    try {
      photoUrls = await timelineService.deleteTimelineEntry(entryId);
    } catch (err) {
      console.error(`[TimelineController] Error en deleteTimelineEntry:`, err);
      return NextResponse.json({ error: 'Entrada de timeline no encontrada.' }, { status: 404 });
    }

    const supabase = await createClient();
    const bucket = 'images';
    const pathPrefix = `/storage/v1/object/public/${bucket}/`;
    const filePaths = photoUrls.reduce<string[]>((acc, url) => {
      const idx = url.indexOf(pathPrefix);
      if (idx !== -1) {
        acc.push(url.substring(idx + pathPrefix.length));
      }
      return acc;
    }, []);

    if (filePaths.length > 0) {
      const { error: supError } = await supabase.storage.from(bucket).remove(filePaths);
      if (supError) {
        console.error(`[TimelineController] Error eliminando imágenes:`, supError);
      }
    }

    return NextResponse.json(
      { message: 'Entrada eliminada correctamente.' },
      { status: 200 }
    );

  } catch (error) {
    console.error(`[TimelineController] Error en deleteEntry:`, error);
    return NextResponse.json(
      { error: 'Error interno del servidor.' },
      { status: 500 }
    );
  }
}
