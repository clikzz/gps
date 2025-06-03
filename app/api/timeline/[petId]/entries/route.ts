

import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/server/middlewares/authMiddleware';
import prisma from '@/lib/db';

interface NewTimelineEntryPayload {
  photoUrl: string;
  eventDate: string;
  description?: string;
  title?: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { petId: string } }
) {
  try {
    const user = await authenticateUser(request);
    if (user instanceof Response) {
      return user;
    }

    const { petId } = params;
    const payload: NewTimelineEntryPayload = await request.json();

    if (!payload.photoUrl || !payload.eventDate) {
      return NextResponse.json({ error: 'La URL de la foto y la fecha del evento son requeridas.' }, { status: 400 });
    }
    const parsedEventDate = new Date(payload.eventDate);
    if (isNaN(parsedEventDate.getTime())) {
        return NextResponse.json({ error: 'La fecha del evento no es válida.' }, { status: 400 });
    }

    
    const petRecord = await prisma.pets.findUnique({
      where: {
        id: BigInt(petId) 
      },
      select: {
        user_id: true 
      }
    });

    if (!petRecord) {
      return NextResponse.json({ error: 'Mascota no encontrada.' }, { status: 404 });
    }
    if (petRecord.user_id !== user.id) {
      return NextResponse.json({ error: 'No autorizado para añadir una entrada a esta mascota.' }, { status: 403 });
    }

    const newEntryWithDetails = await prisma.$transaction(async (tx) => {
      
      const newTimelineEntry = await tx.timelineEntries.create({
        data: {
          user_id: user.id,
          pet_id: BigInt(petId),
          title: payload.title,
          description: payload.description,
          event_date: parsedEventDate,
          
        },
      });

      
      await tx.timelineEntryPhotos.create({
        data: {
          timeline_entry_id: newTimelineEntry.id, 
          photo_url: payload.photoUrl,
          order: 1, 
        },
      });

      
      return tx.timelineEntries.findUnique({
        where: { id: newTimelineEntry.id },
        include: {
          TimelineEntryPhotos: true, 
        },
      });
    });

    if (!newEntryWithDetails) {
        throw new Error("La transacción no devolvió un resultado consistente.");
    }

    
    const responseData = {
      ...newEntryWithDetails,
      pet_id: newEntryWithDetails.pet_id.toString(), 
      
      TimelineEntryPhotos: newEntryWithDetails.TimelineEntryPhotos.map(photo => ({
        ...photo,
        
      })),
    };

    return NextResponse.json(responseData, { status: 201 }); 

  } catch (error: any) {
    console.error(`Error en API POST /api/timeline/${params.petId}/entries:`, error); 
    let errorMessage = 'Error interno del servidor al crear la entrada del timeline.';
    let errorStatus = 500;

    if (error.message.includes('autorizado') || error.message.includes('Mascota no encontrada')) {
        errorStatus = error.message.includes('autorizado') ? 403 : 404;
        errorMessage = error.message;
    } else if (error.message.includes('requeridas') || error.message.includes('válida')) {
        errorStatus = 400;
        errorMessage = error.message;
    } else if (error.code === 'P2002' && error.meta?.target) {
        errorMessage = `Error: Ya existe una entrada con estos datos únicos (${(error.meta.target as string[]).join(', ')}).`;
        errorStatus = 409;
    } else if (error.code) { // Otros errores de Prisma
        errorMessage = `Error de base de datos (código: ${error.code}): ${error.message}`;
    }
    

    return NextResponse.json({ error: errorMessage }, { status: errorStatus });
  }
}

export async function GET(
    request: NextRequest,
    { params }: { params: { petId: string } }
  ) {
    try {
      
      const user = await authenticateUser(request);
      if (user instanceof Response) {
        return user;
      }
  
      const { petId } = params;
  
      
      const petRecord = await prisma.pets.findUnique({
        where: { id: BigInt(petId) },
        select: { user_id: true }
      });
  
      if (!petRecord) {
        return NextResponse.json({ error: 'Mascota no encontrada.' }, { status: 404 });
      }
      
  
      
      const timelineEntries = await prisma.timelineEntries.findMany({
        where: {
          pet_id: BigInt(petId),
          
        },
        include: {
          TimelineEntryPhotos: true,
          
        },
        orderBy: {
          event_date: 'desc',
        },
      });
  
      
      const serializedEntries = timelineEntries.map(entry => ({
        ...entry,
        pet_id: entry.pet_id.toString(),
        
      }));
  
      return NextResponse.json(serializedEntries, { status: 200 });
  
    } catch (error: any) {
      console.error(`Error en API GET /api/timeline/${params.petId}/entries:`, error);
      
      return NextResponse.json({ error: 'Error interno del servidor al obtener las entradas del timeline.' }, { status: 500 });
    }
  }