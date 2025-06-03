import { createMissingPet, listRecentMissingPets, listAllMissingPets, findPetsByUser } from "@/server/services/find.service";

export const reportMissingPet = async (
  reporterId: string,
  body: any
) => {
  const { pet_id, latitude, longitude, photo_url, description } = body;

  // validaciones
  if (
    typeof pet_id !== "number" ||
    typeof latitude !== "number" ||
    typeof longitude !== "number"
  ) {
    return new Response(
      JSON.stringify({ error: "Campos inválidos en el cuerpo de la petición" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (
    photo_url !== undefined &&
    photo_url !== null &&
    typeof photo_url !== "string"
  ) {
    return new Response(
      JSON.stringify({ error: "photo_url debe ser un string si se envía" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (description !== undefined && typeof description !== "string") {
    return new Response(
      JSON.stringify({ error: "description debe ser un string si se envía" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const missing = await createMissingPet(reporterId, {
    pet_id,
    latitude,
    longitude,
    photo_url: photo_url ?? null,
    description,
  });

  const output = {
    ...missing,
    id: missing.id.toString(),
    pet_id: missing.pet_id.toString(),
    reporter_id: missing.reporter_id.toString()
  };

  return new Response(JSON.stringify(output), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
};

export const fetchAllMissingPets = async () => {
  const list = await listAllMissingPets();

  const output = list.map((item) => ({
    ...item,
    id: item.id.toString(),
    pet_id: item.pet_id.toString(),
    reporter_id: item.reporter_id.toString(),
    pet: {
      ...item.pet,
      id: item.pet.id.toString(),
    },
    reporter: {
      ...item.reporter,
      id: item.reporter.id.toString(),
      name: item.reporter.name || "Desconocido",
    },
  }));

  return new Response(JSON.stringify(output), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export const fetchRecentMissingPets = async () => {
  const list = await listRecentMissingPets();

  const output = list.map((item) => ({
    ...item,
    id: item.id.toString(),
    pet_id: item.pet_id.toString(),
    reporter_id: item.reporter_id.toString(),
    pet: {
      ...item.pet,
      id: item.pet.id.toString(),
    },
    reporter: {
      ...item.reporter,
      id: item.reporter.id.toString(),
      name: item.reporter.name || "Desconocido",
    },
  }));

  return new Response(JSON.stringify(output), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const fetchUserPets = async (userId: string) => {
  const pets = await findPetsByUser(userId);

  const output = pets.map((pet) => ({
    ...pet,
    id: pet.id.toString(),
    name: pet.name || "Sin nombre",
  }));

  return new Response(JSON.stringify(output), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}