import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/server/middlewares/auth.middleware';
import * as timelineController from '@/server/controllers/timeline.controller';
import { updateEntry } from '@/server/controllers/timeline.controller';

export async function GET(
  request: NextRequest,
  { params }: { params: any }
) {
  const user = await authenticateUser(request);
  if (user instanceof Response) return user;

  const { petId } = await params;

  return timelineController.getEntries(user.id, petId, request);
}

export async function POST(
  request: NextRequest,
  { params }: { params: any }
) {
  const user = await authenticateUser(request);
  if (user instanceof Response) return user;

  const { petId } = await params;
  const payload = await request.json();

  if (payload.eventDate) {
    try {
      const dateObj = new Date(payload.eventDate);
      if (!isNaN(dateObj.getTime())) {
        const normalized = new Date(
          Date.UTC(
            dateObj.getUTCFullYear(),
            dateObj.getUTCMonth(),
            dateObj.getUTCDate()
          )
        ).toISOString();
        payload.eventDate = normalized;
      }
    } catch {
    }
  }


  return timelineController.createEntry(user.id, petId, payload);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: any }
) {
  const user = await authenticateUser(request);
  if (user instanceof Response) return user;

  const { petId } = await params;

  const url = new URL(request.url);
  const entryId = url.searchParams.get("id");
  if (!entryId) {
    return new Response(
      JSON.stringify({ error: "Invalid entry ID" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return timelineController.deleteEntry(user.id, petId, entryId);
}


export async function PUT(request: NextRequest, { params }: { params: any }) {
  const user = await authenticateUser(request)
  if (user instanceof Response) return user

  const { petId } = await params
  const url = new URL(request.url)
  const entryId = url.searchParams.get("id")

  if (!entryId) {
    return NextResponse.json({ error: "Falta el parámetro `id` en la query." }, { status: 400 })
  }

  const payload = await request.json()
  const updated = await updateEntry(user.id, petId, entryId, payload)
  return NextResponse.json(updated, { status: 200 })
}
