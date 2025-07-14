import { addHealthAlert } from "@/server/controllers/healthAlert.controller";
import { authenticateUser } from "@/server/middlewares/auth.middleware";

export async function POST(req: Request) {
  const user = await authenticateUser(req);
  if (user instanceof Response) return user;

  const data = await req.json();

  console.log("Received data in POST /api/health/alerts:", data.dose);

  if (!data) {
    return new Response(
      JSON.stringify({ error: "Falta {data} en la request" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return addHealthAlert(user.id, data.dose);
}
