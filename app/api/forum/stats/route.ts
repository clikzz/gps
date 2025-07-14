import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  const totalTopics = await prisma.topics.count();
  const totalMessages = await prisma.posts.count();

  return NextResponse.json({ totalTopics, totalMessages });
}
