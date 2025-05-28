import { createMissingPet, listRecentMissingPets, listAllMissingPets } from "@/server/services/findMyPet.service";

export const reportMissingPet = async (
  reporterId: string,
  body: any
) => {
  const { pet_id, latitude, longitude, photo_url, description } = body;

  // validaciones
  if (
    typeof pet_id !== "number" ||
    typeof latitude !== "number" ||
    typeof longitude !== "number" ||
    typeof photo_url !== "string"
  ) {
    return new Response(
      JSON.stringify({ error: "Campos inválidos en el cuerpo de la petición" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const missing = await createMissingPet(reporterId, {
    pet_id,
    latitude,
    longitude,
    photo_url,
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