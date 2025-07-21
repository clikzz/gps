"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Settings, User, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useUserProfile, useSelectedBadges } from "@/stores/userProfile"

interface ProfilePreviewProps {
  onClose: () => void
}

export function ProfilePreview({ onClose }: ProfilePreviewProps) {
  const router = useRouter()
  const { user } = useUserProfile()
  const selectedBadges = useSelectedBadges()

  if (!user) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <div className="text-xl font-bold mb-4">Error al cargar perfil</div>
          <Button onClick={onClose} variant="outline">
            Cerrar
          </Button>
        </CardContent>
      </Card>
    )
  }

  const displayName = user.name || (user.email ? user.email.split("@")[0] : "Usuario")
  const tag = user.tag ? `#${user.tag}` : ""

  const handleSettings = () => {
    onClose()
    router.push("/profile")
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <User className="w-4 h-4 flex-shrink-0" />
          <h2 className="text-lg font-bold truncate">
            <span className="truncate">{displayName}</span>
            {tag && <span className="text-muted-foreground text-sm ml-1">{tag}</span>}
          </h2>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          <Button variant="ghost" size="sm" onClick={handleSettings}>
            <Settings className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 px-6 pb-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 border-2 border-dashed border-border rounded-lg flex items-center justify-center overflow-hidden bg-muted">
            {user.avatar_url ? (
              <img src={user.avatar_url || "/placeholder.svg"} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-muted-foreground" />
            )}
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Insignias</h3>

          {selectedBadges.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-2 max-w-[240px] mx-auto">
              {selectedBadges.map((badge) => (
                <div key={badge.id} className="group">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <img
                      src={badge.icon || "/placeholder.svg"}
                      alt={badge.label}
                      title={badge.label}
                      className="w-6 h-6 object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-4">
              <div className="w-12 h-12 mx-auto border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center mb-2">
                <User className="w-5 h-5 text-muted-foreground/50" />
              </div>
              <p className="text-xs text-muted-foreground mb-1">Sin insignias</p>
              <p className="text-xs text-muted-foreground/70">Ve a configuración</p>
            </div>
          )}
        </div>

        <div className="pt-3 border-t space-y-2">
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Email</div>
            <div className="text-sm font-medium truncate" title={user.email}>
              {user.email}
            </div>
          </div>
          <div className="text-center">
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
