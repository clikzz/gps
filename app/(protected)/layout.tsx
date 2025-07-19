import type React from "react";
import { createClient } from "@/utils/supabase/server";
import { fetchUserProfile } from "@/server/controllers/userprofile.controller";
import ProtectedNavbar from "../../components/protected-navbar";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userProfile = null;

  if (user) {
    try {
      const profileResponse = await fetchUserProfile(user.id);
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        userProfile = profileData;
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      userProfile = {
        id: user.id,
        name: null,
        avatar_url: null,
        email: user.email || "",
        public_id: null,
        menssageCount: 0,
      };
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ProtectedNavbar user={user} userProfile={userProfile} />
      <main className="flex-1 pb-20 md:pb-0 mt-8 p-4">{children}</main>
    </div>
  );
}
