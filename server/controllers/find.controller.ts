import {
  createMissingPet,
  listRecentMissingPets,
  listAllMissingPets,
  findPetsByUser,
  listMyMissingPets,
  listOtherMissingPets,
  markPetAsFound
} from "@/server/services/find.service";
import { Prisma } from "@prisma/client";
import { reportMissingPetSchema } from "@/server/validations/find.validation";

export const reportMissingPet = async (reporterId: string, body: any) => {
  const parseResult = reportMissingPetSchema.safeParse(body);
  if (!parseResult.success) {
    const formatted = parseResult.error.format();
    return new Response(JSON.stringify({ error: formatted }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  const {
    pet_id,
    latitude,
    longitude,
    photo_urls = [],
    description,
  } = parseResult.data;

  try {
    const missing = await createMissingPet(reporterId, {
      pet_id,
      latitude,
      longitude,
      photo_urls,
      description,
    }); 

    const output = {
      ...missing,
      id: missing.id.toString(),
      pet_id: missing.pet_id.toString(),
      reporter_id: missing.reporter_id.toString(),
    };

    return new Response(JSON.stringify(output), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002" &&
      Array.isArray(err.meta?.target) &&
      err.meta?.target.includes("pet_id") &&
      err.meta?.target.includes("reporter_id")
    ) {
      return new Response(
        JSON.stringify({
          error: "Ya has reportado esta mascota anteriormente.",
        }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }

    console.error(err);
    return new Response(JSON.stringify({ error: "Error al crear reporte." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const reportPetFound = async (
  userId: string,
  petId: number
) => {
  const ok = await markPetAsFound(petId, userId)
  if (!ok) {
    return new Response(
      JSON.stringify({ error: "No tienes permiso o mascota no existe" }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    )
  }
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
};

export const fetchAllMissingPets = async () => {
  const list = await listAllMissingPets();

  const output = list.map((item) => ({
    id: item.id.toString(),
    pet_id: item.pet_id.toString(),
    reporter_id: item.reporter_id.toString(),
    latitude: item.latitude,
    longitude: item.longitude,
    photo_urls: item.photo_urls,
    description: item.description,
    reported_at: item.reported_at.toISOString(),
    pet: {
      id: item.Pets.id.toString(),
      name: item.Pets.name || "Sin nombre",
      photo_url: item.Pets.photo_url ?? undefined,
    },
    reporter: {
      id: item.users.id.toString(),
      name: item.users.name || "Desconocido",
    },
  }));

  return new Response(JSON.stringify(output), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const fetchRecentMissingPets = async () => {
  const list = await listRecentMissingPets();

  console.log(list);

  const output = list.map((item) => ({
    id: item.id.toString(),
    pet_id: item.pet_id.toString(),
    reporter_id: item.reporter_id.toString(),
    latitude: item.latitude,
    longitude: item.longitude,
    photo_urls: item.photo_urls,
    description: item.description,
    reported_at: item.reported_at.toISOString(),
    pet: {
      id: item.Pets.id.toString(),
      name: item.Pets.name || "Sin nombre",
      photo_url: item.Pets.photo_url,
    },
    reporter: {
      id: item.users.id.toString(),
      name: item.users.name || "Desconocido",
    },
  }));

  return new Response(JSON.stringify(output), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const fetchMyMissingPets = async (userId: string) => {
  const list = await listMyMissingPets(userId);
  const output = list.map((item) => ({
    id: item.id.toString(),
    pet_id: item.pet_id.toString(),
    reporter_id: item.reporter_id.toString(),
    pet: {
      id: item.Pets.id.toString(),
      name: item.Pets.name || "Sin nombre",
      photo_url: item.Pets.photo_url,
    },
    reporter: {
      id: item.users.id.toString(),
      name: item.users.name || "Desconocido",
    },
  }));
  return new Response(JSON.stringify(output), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const fetchOtherMissingPets = async (userId: string) => {
  const list = await listOtherMissingPets(userId);

  const output = list.map((item) => ({
    id: item.id.toString(),
    pet_id: item.pet_id.toString(),
    reporter_id: item.reporter_id.toString(),
    latitude: item.latitude,
    longitude: item.longitude,
    pet: {
      id: item.Pets.id.toString(),
      name: item.Pets.name || "Sin nombre",
      photo_url: item.Pets.photo_url,
    },
    reporter: {
      id: item.users.id.toString(),
      name: item.users.name || "Desconocido",
    },
    reported_at: item.reported_at.toISOString(),
  }));
  return new Response(JSON.stringify(output), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const fetchUserPets = async (userId: string) => {
  const pets = await findPetsByUser(userId);

  const output = pets.map((pet) => ({
    id: pet.id.toString(),
    name: pet.name || "Sin nombre",
    photo_url: pet.photo_url,
  }));

  return new Response(JSON.stringify(output), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
