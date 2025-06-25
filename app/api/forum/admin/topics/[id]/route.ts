import { NextResponse } from "next/server";
import { authenticateUser } from "@/server/middlewares/auth.middleware";
import {
  updateOwnTopic,
  deleteOwnTopic,
  deleteAnyTopic
} from "@/server/services/forum.service";
import { editTopicSchema } from "@/server/validations/forum.validation";

export async function PATCH(req: Request) {
  const auth = await authenticateUser(req);
  if (auth instanceof Response) return auth;

  const topicId = Number(new URL(req.url).pathname.split("/").pop());
  if (isNaN(topicId)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  const { title } = editTopicSchema.parse(await req.json());

  const result = await updateOwnTopic(auth.id, topicId, title);
  if (result.count === 0) {
    return NextResponse.json({ error: "No tienes permiso o tema no existe" }, { status: 403 });
  }
  return NextResponse.json(null, { status: 204 });
}

export async function DELETE(req: Request) {
  const auth = await authenticateUser(req);
  if (auth instanceof Response) return auth;

  const topicId = Number(new URL(req.url).pathname.split("/").pop());
  if (isNaN(topicId)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  if (auth.role === "ADMIN") {
    await deleteAnyTopic(topicId);
    return NextResponse.json(null, { status: 204 });
  }

  const result = await deleteOwnTopic(auth.id, topicId);
  if (result.count === 0) {
    return NextResponse.json({ error: "No tienes permiso o tema no existe" }, { status: 403 });
  }
  return NextResponse.json(null, { status: 204 });
}
