"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Settings, User, X } from "lucide-react"
import { Badge } from "./Badge"
import { useRouter } from "next/navigation"
import { useUserProfile } from "@/stores/userProfile"

interface ProfilePreviewProps {
  onClose: () => void
}

export function ProfilePreview({ onClose }: ProfilePreviewProps) {
  const router = useRouter()
  const { user } = useUserProfile()
  const menssageCount = useUserProfile(state => state.user?.menssageCount ?? 0)

  if (!user) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
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

  // insignias de ejemplo
  const exampleBadges = [
    { id: "1", name: "Trofeo", icon: "🏆", description: "Usuario destacado" },
    { id: "2", name: "Vip", icon: "⭐", description: "Miembro VIP" },
    { id: "3", name: "Objetivo", icon: "🎯", description: "Buen participante" },
    { id: "4", name: "Pet", icon: "🐕", description: "Pet Lover" },
    { id: "5", name: "Vaquero", icon: "🤠", description: "yolorejiju" },
    { id: "6", name: "Angry", icon: "🤬", description: "Professional Hater" },
  ]

  const handleSettings = () => {
    onClose()
    router.push("/profile")
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5" />
          <h2 className="text-xl font-bold">
            {displayName} {tag && <span className="text-muted-foreground">{tag}</span>}
          </h2>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={handleSettings}>
            <Settings className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex gap-6 items-center">          <div className="flex-shrink-0">
            <div className="w-32 h-32 border-2 border-dashed border-border rounded-lg flex items-center justify-center overflow-hidden bg-muted">
              <img
                src={user.avatar_url || "/placeholder.svg"}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Insignias</h3>
            <div className="grid grid-cols-3 gap-3">
              {exampleBadges.map((badge) => (
                <Badge key={badge.id} name={badge.name} icon={badge.icon} description={badge.description} />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Insignias de ejemplo</p>
          </div>
        </div>
        <div className="pt-4 border-t">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Puntuación de logros:</div>
              <div className="text-2xl font-bold">1500</div>
            </CardContent>
          </Card>
        </div>

        <div className="pt-4 border-t space-y-2">
          <div className="text-sm">
            <span className="font-medium">Email:</span>
            <span className="text-muted-foreground ml-2">{user.email}</span>
          </div>
          <div className="text-sm">
            <span className="font-medium">Mensajes:</span>
            <span className="text-muted-foreground ml-2">{user.menssageCount.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
