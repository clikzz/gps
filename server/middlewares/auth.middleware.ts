import { createClient } from "@/utils/supabase/server";
import { createServerClient } from "@supabase/ssr";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import prisma from "@/lib/db";


export interface AuthUser extends SupabaseUser {
  role: "USER" | "MODERATOR" | "ADMIN";
}

export const authenticateUser = async (req: Request): Promise<AuthUser | Response> => {
  const authHeader = req.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7)
    : null;

  let supabase;

  if (bearerToken) {
    supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return [];
          },
          setAll() {
          },
        },
        global: {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        },
      }
    );
  } else {
    supabase = await createClient();
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const profile = await prisma.users.findUnique({
    where: { id: user.id },
    select: { role: true },
  });

  if (!profile) {
    return new Response(
      JSON.stringify({ error: "Usuario no registrado en el foro" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  return {
    ...user,
    role: profile.role,
  };
};

export function ensureModerator(user: AuthUser) {
  if (user.role !== "MODERATOR" && user.role !== "ADMIN") {
    throw new Error("FORBIDDEN_MODERATOR");
  }
}

export function ensureAdmin(user: AuthUser) {
  if (user.role !== "ADMIN") {
    throw new Error("FORBIDDEN_ADMIN");
  }
}
