"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Settings, User, X, Phone, Instagram } from "lucide-react" 
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
    <Card className="w-full max-w-md mx-auto overflow-hidden">
      <CardHeader className="relative flex flex-col items-center justify-center p-6 pb-4 bg-muted/20">
        <div className="absolute top-3 right-3 flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSettings}
            className="text-muted-foreground hover:text-primary"
          >
            <Settings className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-muted-foreground hover:text-destructive">
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/30 shadow-md mb-3">
          {user.avatar_url ? (
            <img src={user.avatar_url || "/placeholder.svg"} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <User className="w-10 h-10 text-muted-foreground" />
            </div>
          )}
        </div>
        <h2 className="text-xl font-bold text-center truncate max-w-[calc(100%-2rem)]">
          <span className="truncate">{displayName}</span>
          {tag && <span className="text-muted-foreground text-sm ml-1">{tag}</span>}
        </h2>
        {user.email && (
          <p className="text-sm text-muted-foreground truncate max-w-[calc(100%-2rem)]" title={user.email}>
            {user.email}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-5 px-6 py-6">

        {(user.phone || user.instagram) && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Social</h3>
            <div className="flex flex-col gap-2">
              {user.phone && (
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{user.phone}</span>
                </div>
              )}
              {user.instagram && (
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <Instagram className="w-4 h-4 text-muted-foreground" />
                  <span>{user.instagram}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Insignias</h3>
          {selectedBadges.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-2">
              {selectedBadges.map((badge) => (
                <div key={badge.id} className="group">
                  <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-muted/50 hover:bg-muted transition-colors border border-border">
                    <img
                      src={badge.icon || "/placeholder.svg"}
                      alt={badge.label}
                      title={badge.label}
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 border border-dashed border-muted-foreground/30 rounded-lg bg-muted/10">
              <div className="w-12 h-12 mx-auto flex items-center justify-center mb-2">
                <User className="w-6 h-6 text-muted-foreground/50" />
              </div>
              <p className="text-xs text-muted-foreground mb-1">Sin insignias seleccionadas</p>
              <p className="text-xs text-muted-foreground/70">Ve a configuración para añadir algunas</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
