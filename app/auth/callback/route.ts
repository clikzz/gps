import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { assignBadge } from "@/server/services/badge.service";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;
  const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();

  if (code) {
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) console.error("Auth error:", error);

    const userId = session?.user.id;
    if (userId) {
      await assignBadge(userId, "WELCOME");
    }
  }


  if (redirectTo) {
    return NextResponse.redirect(`${origin}${redirectTo}`);
  }

  return NextResponse.redirect(`${origin}/home`);
}
