"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Settings, LogOut, ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { ProfilePreview } from "./ProfilePreview"
import { signOutAction } from "@/app/actions"

interface UserProfile {
  id: string
  name: string | null
  avatar_url: string | null
  email: string
  public_id: string | undefined
  menssageCount: number
}

interface ProfileDropdownProps {
  user: UserProfile
}

export function ProfileDropdown({ user: initialUser }: ProfileDropdownProps) {
  const router = useRouter()
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCompleteProfile()
  }, [])

  const fetchCompleteProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/profile")

      if (response.ok) {
        const profileData = await response.json()
        if (!profileData.error) {
          setProfile(profileData)
        } else {
          setProfile(initialUser)
        }
      } else {
        setProfile(initialUser)
      }
    } catch (error) {
      console.error("Error fetching complete profile:", error)
      setProfile(initialUser)
    } finally {
      setLoading(false)
    }
  }

  const currentProfile = profile || initialUser

  const displayName = currentProfile?.name || (currentProfile?.email ? currentProfile.email.split("@")[0] : "Usuario")

  const handleViewProfile = () => {
    if (currentProfile) {
      setIsPreviewOpen(true)
    }
  }

  const handleSettings = () => {
    router.push("/profile")
  }

  const handleSignOut = async () => {
    await signOutAction()
  }

  if (!currentProfile) {
    return (
      <Button variant="ghost" className="flex items-center gap-2 h-auto p-2">
        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
          <span className="text-sm font-medium text-slate-600">?</span>
        </div>
        <div className="flex flex-col items-start">
          <span className="text-sm font-medium">Cargando...</span>
        </div>
      </Button>
    )
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 h-auto p-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
              {currentProfile.avatar_url ? (
                <img
                  src={currentProfile.avatar_url || "/placeholder.svg"}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm font-medium text-slate-600">{displayName.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">Hola, {loading ? "..." : displayName}</span>
              <span className="text-xs text-muted-foreground">{currentProfile.email}</span>
            </div>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={handleViewProfile}>
            <User className="w-4 h-4 mr-2" />
            Ver Perfil
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleSettings}>
            <Settings className="w-4 h-4 mr-2" />
            Configurar Perfil
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isPreviewOpen && currentProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsPreviewOpen(false)} />
          <div className="relative z-10">
            <ProfilePreview user={currentProfile} onClose={() => setIsPreviewOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}
