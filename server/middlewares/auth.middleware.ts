import { createClient } from "@/utils/supabase/server";
import { createServerClient } from "@supabase/ssr";

export const authenticateUser = async (req: Request) => {
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

  return user;
};
