import { authenticateUser } from "@/server/middlewares/auth.middleware";
import {

  editHealthAlert,
  removeHealthAlert,
} from "@/server/controllers/healthAlert.controller";

export async function PUT(req: Request) {
  const user = await authenticateUser(req);
  if (user instanceof Response) return user;

  const data = await req.json();
  if (!data || !data.id) {
    return new Response(JSON.stringify({ error: "Falta {id} en la request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  return editHealthAlert(data.id, data);
}

export async function DELETE(req: Request) {
  const user = await authenticateUser(req);
  if (user instanceof Response) return user;

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return new Response(JSON.stringify({ error: "Falta {id} en la request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  return removeHealthAlert(parseInt(id));
}
