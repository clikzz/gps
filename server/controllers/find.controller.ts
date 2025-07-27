import {
  createMissingPet,
  listRecentMissingPets,
  listAllMissingPets,
  findPetsByUser,
  listMyMissingPets,
  listOtherMissingPets,
  markPetAsFound,
  createFoundReport,
  listFoundReportsForUser,
  updateMissingPet,
  deleteMissingPet,
  rejectFoundReport
} from "@/server/services/find.service";
import { 
  reportMissingPetSchema,
  reportFoundSchema,
  editMissingPetSchema
} from "@/server/validations/find.validation";

export const reportMissingPet = async (reporterId: string, body: any) => {
  const parseResult = reportMissingPetSchema.safeParse(body);
  if (!parseResult.success) {
    const firstMessage = parseResult.error.errors[0]?.message ?? "Datos inválidos";
    return new Response(JSON.stringify({ error: firstMessage }), {
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
    const msg = err.message || "Error al crear reporte.";
    const status = msg.includes("Ya tienes un reporte activo") ? 409 : 500;
    return new Response(
      JSON.stringify({ error: msg }),
      { status, headers: { "Content-Type": "application/json" } }
    );
  }
};

export const editMissingPet = async (
  reporterId: string,
  reportId: number,
  body: any
) => {
  const parse = editMissingPetSchema.safeParse(body)
  if (!parse.success) {
    return new Response(
      JSON.stringify({ error: parse.error.errors[0]?.message }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    )
  }

  try {
    const rpt = await updateMissingPet(reportId, reporterId, parse.data)
    return new Response(JSON.stringify({ ok: true, report: rpt }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (e: any) {
    const msg = e.message.includes("No autorizado") ? 403 : 500
    return new Response(JSON.stringify({ error: e.message }), {
      status: msg,
      headers: { "Content-Type": "application/json" },
    })
  }
}

export const removeMissingPet = async (
  reporterId: string,
  reportId: number
) => {
  try {
    await deleteMissingPet(reportId, reporterId)
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (e: any) {
    const msg = e.message.includes("No autorizado") ? 403 : 500
    return new Response(JSON.stringify({ error: e.message }), {
      status: msg,
      headers: { "Content-Type": "application/json" },
    })
  }
}

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
    full_address: item.full_address,
    address: item.address,
    street: item.street,
    city: item.city,
    region: item.region,
    postcode: item.postcode,
    country: item.country,
    photo_urls: item.photo_urls,
    description: item.description,
    reported_at: item.reported_at.toISOString(),
    pet: {
      id: item.Pets.id.toString(),
      name: item.Pets.name || "Sin nombre",
      photo_url: item.Pets.photo_url ?? undefined,
      species: item.Pets.species || "Desconocido",
    },
    reporter: {
      id: item.users.id.toString(),
      name: item.users.name || "Desconocido",
      phone: item.users.phone || "No disponible",
      instagram: item.users.instagram || "No disponible",
      email: item.users.email || "No disponible",
    },
  }));

  return new Response(JSON.stringify(output), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const fetchRecentMissingPets = async () => {
  const list = await listRecentMissingPets();

  const output = list.map((item) => ({
    id: item.id.toString(),
    pet_id: item.pet_id.toString(),
    reporter_id: item.reporter_id.toString(),
    latitude: item.latitude,
    longitude: item.longitude,
    full_address: item.full_address,
    address: item.address,
    street: item.street,
    city: item.city,
    region: item.region,
    postcode: item.postcode,
    country: item.country,
    photo_urls: item.photo_urls,
    description: item.description,
    reported_at: item.reported_at.toISOString(),
    pet: {
      id: item.Pets.id.toString(),
      name: item.Pets.name || "Sin nombre",
      photo_url: item.Pets.photo_url,
      species: item.Pets.species || "Desconocido",
    },
    reporter: {
      id: item.users.id.toString(),
      name: item.users.name || "Desconocido",
      phone: item.users.phone || "No disponible",
      instagram: item.users.instagram || "No disponible",
      email: item.users.email || "No disponible",
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
    reported_at: item.reported_at.toISOString(),
    description: item.description,
    latitude: item.latitude,
    longitude: item.longitude,
    full_address: item.full_address,
    address: item.address,
    street: item.street,
    city: item.city,
    region: item.region,
    postcode: item.postcode,
    country: item.country,
    pet: {
      id: item.Pets.id.toString(),
      name: item.Pets.name || "Sin nombre",
      photo_url: item.Pets.photo_url,
      species: item.Pets.species || "Desconocido",
    },
    reporter: {
      id: item.users.id.toString(),
      name: item.users.name || "Desconocido",
      phone: item.users.phone || "No disponible",
      instagram: item.users.instagram || "No disponible",
      email: item.users.email || "No disponible",
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
    description: item.description,
    latitude: item.latitude,
    longitude: item.longitude,
    full_address: item.full_address,
    address: item.address,
    street: item.street,
    city: item.city,
    region: item.region,
    postcode: item.postcode,
    country: item.country,
    pet: {
      id: item.Pets.id.toString(),
      name: item.Pets.name || "Sin nombre",
      photo_url: item.Pets.photo_url,
      species: item.Pets.species || "Desconocido",
    },
    reporter: {
      id: item.users.id.toString(),
      name: item.users.name || "Desconocido",
      phone: item.users.phone || "No disponible",
      instagram: item.users.instagram || "No disponible",
      email: item.users.email || "No disponible",
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

export const reportFound = async (
  userId: string,
  body: any
) => {
  const parseResult = reportFoundSchema.safeParse(body);
  if (!parseResult.success) {
    return new Response(JSON.stringify({ error: parseResult.error.errors[0]?.message  }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { missingPetId, photo_urls, description, latitude, longitude } = parseResult.data;
  try {
    const rec = await createFoundReport(userId, missingPetId, {
        photo_urls,
        description,
        latitude,
        longitude,
      });
    
      const output = {
        id: rec.id.toString(),
        missingPetId: rec.missingPetId.toString(),
        helperId: rec.helperId.toString(),
        photo_urls: rec.photo_urls,
        description: rec.description,
        latitude: rec.latitude,
        longitude: rec.longitude,
        createdAt: rec.created_at.toISOString(),
      };

    return new Response(JSON.stringify(output), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: err.message || "Error interno" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

export const removeFoundReport = async (
  ownerId: string,
  foundId: number
) => {
  try {
    await rejectFoundReport(foundId, ownerId);
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: any) {
    const status = e.message.includes("No autorizado") ? 403 : 404;
    return new Response(JSON.stringify({ error: e.message }), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const fetchFoundReports = async (userId: string) => {
  const list = await listFoundReportsForUser(userId);

  const output = list.map((r) => ({
    id: r.id.toString(),
    missingPetId: r.missingPetId.toString(),
    ownerId: r.MissingPets.reporter_id.toString(),
    helper: {
      id: r.users.id.toString(),
      name: r.users.name || "Desconocido",
      phone: r.users.phone || "No disponible",
      instagram: r.users.instagram || "No disponible",
      email: r.users.email || "No disponible",
    },
    pet: {
      id: r.MissingPets.pet_id.toString(),
      name: r.MissingPets.Pets.name,
      photo_url: r.MissingPets.Pets.photo_url,
      species: r.MissingPets.Pets.species || "Desconocido",
    },
    description: r.description,
    latitude: r.latitude,
    longitude: r.longitude,
    full_address: r.full_address,
    address: r.address,
    street: r.street,
    city: r.city,
    region: r.region,
    postcode: r.postcode,
    country: r.country,
    reported_at: r.created_at.toISOString(),
    photo_urls: r.photo_urls,
  }));

  return new Response(JSON.stringify(output), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};