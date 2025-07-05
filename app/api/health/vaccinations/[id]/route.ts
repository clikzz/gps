import { authenticateUser } from "@/server/middlewares/auth.middleware";
import {
  getVaccinationById,
  updateVaccinationById,
} from "@/server/services/vaccination.service";

export async function PUT(req: Request) {
  const user = await authenticateUser(req);
  if (user instanceof Response) return user;

  const vaccination = await req.json();
  const id = vaccination.id;

  if (!vaccination || !id) {
    return new Response(JSON.stringify({ error: "Invalid vaccination data" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  return updateVaccinationById(id, vaccination);
}

export async function GET(req: Request) {
  const user = await authenticateUser(req);
  if (user instanceof Response) return user;

  const id = parseInt(req.url.split("/").pop() || "");

  if (!id) {
    return new Response(JSON.stringify({ error: "Invalid vaccination ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  return getVaccinationById(id);
}

export async function DELETE(req: Request) {
  const user = await authenticateUser(req);
  if (user instanceof Response) return user;

  const url = new URL(req.url);
  const id = parseInt(url.pathname.split("/").pop() || "");

  if (!id) {
    return new Response(JSON.stringify({ error: "Invalid vaccination ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    await updateVaccinationById(id, { active: false });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting vaccination:", error);
    return new Response(
      JSON.stringify({ error: "Failed to delete vaccination" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
