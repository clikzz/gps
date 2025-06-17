import Link from "next/link"
import { Button } from "./ui/button"
import { createClient } from "@/utils/supabase/server"
import { ProfileDropdown } from "./profile/ProfileDropdown"
import { fetchUserProfile } from "@/server/controllers/userprofile.controller"

export default async function AuthButton() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="flex gap-2">
        <Button asChild size="sm" variant={"outline"}>
          <Link href="/sign-in">Iniciar sesión</Link>
        </Button>
        <Button asChild size="sm" variant={"default"}>
          <Link href="/sign-up">Registrarse</Link>
        </Button>
      </div>
    )
  }

  let userProfile = null
  try {
    const profileResponse = await fetchUserProfile(user.id)
    if (profileResponse.ok) {
      const profileData = await profileResponse.json()
      userProfile = profileData
    }
  } catch (error) {
    console.error("Error fetching user profile:", error)
    userProfile = {
      id: user.id,
      name: null,
      avatar_url: null,
      email: user.email || "",
      public_id: null,
      menssageCount: 0,
    }
  }

  return <ProfileDropdown/>
}
