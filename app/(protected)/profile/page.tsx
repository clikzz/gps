"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, Trash2, AlertCircle, RefreshCw, User, Award, Camera, Phone } from "lucide-react"
import { useProfileImageUpload } from "@/hooks/useProfileImageUpload"
import { toast } from "sonner"
import { useUserProfile } from "@/stores/userProfile"
import LoadingScreen from "@/components/LoadingScreen";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function ProfileConfigPage() {
  const router = useRouter()
  const { user, setUser, setSelectedBadges } = useUserProfile()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [instagram, setInstagram] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedBadgeIds, setSelectedBadgeIds] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("profile")
  const [showChangeAvatarAlert, setShowChangeAvatarAlert] = useState(false)
  const [showDeleteAvatarConfirm, setShowDeleteAvatarConfirm] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const {
    selectedFile,
    isUploading: isUploadingAvatar,
    imagePreview,
    handleFileChange,
    uploadImage,
    resetImage,
    setImagePreview,
  } = useProfileImageUpload()

  useEffect(() => {
    fetchProfile()
  }, [])

  useEffect(() => {
    if (user) {
      setName(user.name || "")
      const initialPhone = user.phone ? user.phone : "+569"
      setPhone(initialPhone)
      const initialInstagram = user.instagram ? user.instagram : "@"
      setInstagram(initialInstagram)
      setSelectedBadgeIds(user.selectedBadgeIds || [])
      if (!selectedFile) {
        setImagePreview(null)
      }
    }
  }, [user, setImagePreview, selectedFile])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/profile", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`)
      const profileData = await response.json()
      setUser(profileData)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error desconocido")
      toast.error(error instanceof Error ? error.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updatedData: Partial<typeof user>) => {
    try {
      const updatePayload = {
        name: updatedData?.name !== undefined ? updatedData?.name : user?.name,
        email: user?.email || "",
        avatar_url: updatedData?.avatar_url !== undefined ? updatedData?.avatar_url : user?.avatar_url,
        selectedBadgeIds:
          updatedData?.selectedBadgeIds !== undefined ? updatedData?.selectedBadgeIds : user?.selectedBadgeIds,
        phone: updatedData?.phone !== undefined ? updatedData?.phone : user?.phone,
        instagram: updatedData?.instagram !== undefined ? updatedData?.instagram : user?.instagram,
      }
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload),
      })
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`)
      const updatedProfile = await response.json()
      setUser(updatedProfile)
      return true
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error al actualizar perfil")
      toast.error(error instanceof Error ? error.message : "Error al actualizar perfil")
      return false
    }
  }

  const handleRemoveAvatar = async () => {
    setShowDeleteAvatarConfirm(true) 
  }

  const confirmRemoveAvatar = async () => {
    if (!user?.avatar_url || user.avatar_url.includes("defaultpfp.png")) return
    
    setIsDeleting(true)
    try {
      const response = await fetch("/api/upload", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: user.avatar_url,
        }),
      })

      if (!response.ok) {
        throw new Error("Error al eliminar la imagen del storage")
      }
      resetImage()
      const success = await updateProfile({ avatar_url: null as any })
      if (success) {
        toast.success("Avatar eliminado correctamente")
      }
    } catch (error) {
      toast.error("Error al eliminar la imagen")
    } finally {
      setIsDeleting(false)
      setShowDeleteAvatarConfirm(false) 
    }
  }

  const handleBadgeToggle = async (badgeId: string) => {
    const newSelectedBadgeIds = selectedBadgeIds.includes(badgeId)
      ? selectedBadgeIds.filter((id) => id !== badgeId)
      : selectedBadgeIds.length < 3
        ? [...selectedBadgeIds, badgeId]
        : (() => {
            toast.warning("Solo puedes seleccionar máximo 3 insignias")
            return selectedBadgeIds
          })()

    if (newSelectedBadgeIds !== selectedBadgeIds) {
      setSelectedBadgeIds(newSelectedBadgeIds)
      try {
        const success = await updateProfile({
          selectedBadgeIds: newSelectedBadgeIds,
        })

        if (success) {
          setSelectedBadges(newSelectedBadgeIds)
          toast.success("Insignias actualizadas")
        }
      } catch (error) {
        setSelectedBadgeIds(selectedBadgeIds)
        toast.error("Error al actualizar insignias")
      }
    }
  }

  const handleSave = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      let avatarUrl = user.avatar_url

      if (selectedFile) {
        const uploadResult = await uploadImage()
        if (uploadResult.url) {
          avatarUrl = uploadResult.url
          if (user.avatar_url && user.avatar_url !== avatarUrl && !user.avatar_url.includes("defaultpfp.png")) {
            try {
              await fetch("/api/upload", {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  url: user.avatar_url,
                }),
              })
            } catch {}
          }
        } else {
          throw new Error(uploadResult.error || "Error al subir la imagen")
        }
      }

      const success = await updateProfile({
        name: name.trim() || undefined,
        avatar_url: avatarUrl,
        selectedBadgeIds: selectedBadgeIds,
        phone: phone.trim() || undefined,
        instagram: instagram.trim() || undefined,
      })

      if (success) {
        setSelectedBadges(selectedBadgeIds)
        toast.success("Perfil actualizado correctamente")
        resetImage()
        fetchProfile()
      } else {
        throw new Error("Error al actualizar el perfil")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al actualizar el perfil")
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return (
      <LoadingScreen 
        title="Cargando perfil" 
        subtext="Preparando tu información" 
        icon={User} 
        />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-destructive mb-3">Error al cargar el perfil</h2>
          <p className="text-sm text-muted-foreground mb-6 p-3 bg-muted rounded-md">{error}</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={fetchProfile} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reintentar
            </Button>
            <Button onClick={() => router.push("/")} variant="default">
              Volver al inicio
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold text-destructive mb-4">No se pudo cargar el perfil</h2>
          <Button onClick={fetchProfile}>Reintentar</Button>
        </Card>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <Card className="lg:w-64 flex-shrink-0 p-4 lg:p-0 lg:border-none lg:shadow-none">
            <nav className="space-y-2 lg:sticky lg:top-8">
              <Button
                variant={activeTab === "profile" ? "default" : "ghost"}
                onClick={() => setActiveTab("profile")}
                className="w-full justify-start gap-3 px-4 py-3 text-base"
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Editar perfil</span>
              </Button>
              <Button
                variant={activeTab === "badges" ? "default" : "ghost"}
                onClick={() => setActiveTab("badges")}
                className="w-full justify-start gap-3 px-4 py-3 text-base"
              >
                <Award className="w-5 h-5" />
                <span className="font-medium">Insignias</span>
              </Button>
              <Button
                variant={activeTab === "social" ? "default" : "ghost"}
                onClick={() => setActiveTab("social")}
                className="w-full justify-start gap-3 px-4 py-3 text-base"
              >
                <Phone className="w-5 h-5" />
                <span className="font-medium">Social</span>
              </Button>
            </nav>
          </Card>

          {/* Main content */}
          <div className="flex-1 max-w-3xl mx-auto lg:mx-0">
            {activeTab === "profile" && (
              <Card>
                <CardHeader>
                  <CardTitle>Editar Perfil</CardTitle>
                  <CardDescription>Actualiza tu nombre y foto de perfil.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Avatar */}
                  <div className="flex flex-col items-center text-center space-y-6">
                    <div className="relative group">
                      <Avatar className="w-32 h-32 sm:w-40 sm:h-40 border-2 border-primary/20 shadow-lg">
                        <AvatarImage
                          src={
                            imagePreview ||
                            user.avatar_url ||
                            "/placeholder.svg?height=160&width=160&query=default profile picture" ||
                            "/placeholder.svg"
                          }
                          alt="Profile"
                          className="object-cover"
                        />
                        <AvatarFallback>
                          {user.name ? (
                            user.name.charAt(0).toUpperCase()
                          ) : (
                            <User className="w-1/2 h-1/2 text-muted-foreground" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <AlertDialog open={showChangeAvatarAlert} onOpenChange={setShowChangeAvatarAlert}>
                        <AlertDialogTrigger asChild>
                          <button
                            disabled={isUploadingAvatar}
                            className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                            aria-label="Cambiar foto de perfil"
                          >
                            <Camera className="w-8 h-8" />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Deseas cambiar tu foto de perfil?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Recuerda que solo se permiten formatos JPG y PNG, con un tamaño máximo de 2MB.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => fileInputRef.current?.click()}>
                              Continuar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>

                    {user.avatar_url && !user.avatar_url.includes("defaultpfp.png") && (
                      <AlertDialog open={showDeleteAvatarConfirm} onOpenChange={setShowDeleteAvatarConfirm}>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            onClick={handleRemoveAvatar} 
                            disabled={isDeleting}
                            className="gap-2 bg-transparent"
                          >
                            <Trash2 className="w-4 h-4" />
                            {isDeleting ? "Eliminando..." : "Eliminar foto"}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro de eliminar tu foto de perfil?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Tu foto de perfil será eliminada permanentemente.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmRemoveAvatar}>Eliminar</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>

                  {/* Formulario */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">
                        Nombre
                      </Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Tu nombre a mostrar"
                        maxLength={50}
                        className="h-12 text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email
                      </Label>
                      <Input id="email" value={user.email} disabled className="bg-muted h-12 text-base" />
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-6 justify-center items-center">
                    <Button
                      onClick={handleSave}
                      disabled={isLoading || isUploadingAvatar}
                      className="px-8 h-12 text-base font-medium"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isLoading ? "Actualizando..." : "Actualizar Perfil"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "badges" && (
              <Card>
                <CardHeader>
                  <CardTitle>Selecciona tus insignias</CardTitle>
                  <CardDescription>
                    Puedes seleccionar hasta 3 insignias que se mostrarán en el foro. 
                    Seleccionadas:{" "}
                    <span className="font-medium">{selectedBadgeIds.length}/3</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Insignias Desbloqueadas */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      🏆 <span>Insignias Desbloqueadas</span>
                    </h3>
                    {user.unlockedBadges?.length === 0 || !user.unlockedBadges ? (
                      <div className="text-center py-12 bg-muted/20 rounded-xl">
                        <p className="text-muted-foreground">No tienes insignias desbloqueadas aún.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {user.unlockedBadges.map((badge: any) => {
                          const isSelected = selectedBadgeIds.includes(badge.id)
                          return (
                            <div
                              key={badge.id}
                              className={`
                                relative cursor-pointer transition-all duration-200 group
                                ${isSelected ? "scale-105" : "hover:scale-105"}
                              `}
                              onClick={() => handleBadgeToggle(badge.id)}
                            >
                              <div
                                className={`
                                  text-center p-4 border-2 rounded-xl transition-all
                                  ${
                                    isSelected
                                      ? "border-primary bg-primary/5 shadow-lg"
                                      : "border-border bg-background hover:border-primary/50 hover:bg-muted/30"
                                  }
                                `}
                              >
                                <img
                                  src={badge.icon || "/placeholder.svg?height=48&width=48&query=badge icon"}
                                  alt={badge.label}
                                  title={badge.description || badge.label}
                                  className="w-12 h-12 mx-auto mb-2"
                                />
                                <div className="text-sm font-medium mb-1">{badge.label}</div>
                                {badge.description && (
                                  <div className="text-xs text-muted-foreground">{badge.description}</div>
                                )}
                              </div>
                              {isSelected && (
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg">
                                  <span className="text-primary-foreground text-xs font-bold">✓</span>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  {/* Insignias por Desbloquear */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      🔒 <span className="text-muted-foreground">Insignias por Desbloquear</span>
                    </h3>
                    {user.lockedBadges?.length === 0 || !user.lockedBadges ? (
                      <div className="text-center py-12 bg-muted/20 rounded-xl">
                        <p className="text-muted-foreground">
                          ¡Felicidades! Has desbloqueado todas las insignias disponibles.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {user.lockedBadges.map((badge: any) => (
                          <div key={badge.id} className="text-center p-4 border-2 border-muted rounded-xl bg-muted/20">
                            <div className="relative mb-2">
                              <img
                                src={badge.icon || "/placeholder.svg?height=48&width=48&query=locked badge icon"}
                                alt={badge.label}
                                title={badge.description || badge.label}
                                className="w-12 h-12 mx-auto grayscale opacity-50"
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-6 h-6 bg-muted-foreground rounded-full flex items-center justify-center">
                                  <span className="text-background text-xs">🔒</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground mb-1">{badge.label}</div>
                            {badge.description && (
                              <div className="text-xs text-muted-foreground/70">{badge.description}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "social" && (
              <Card>
                <CardHeader>
                  <CardTitle>Información Social</CardTitle>
                  <CardDescription>
                    Añade tu número de teléfono y tu usuario de Instagram para que otros puedan contactarte.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">
                        Número de Teléfono
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          let value = e.target.value
                          if (!value.startsWith("+569")) {
                            value = "+569" + value.replace(/[^0-9]/g, "").substring(4)
                          } else {
                            const prefix = "+569"
                            const digits = value.substring(prefix.length).replace(/[^0-9]/g, "")
                            value = prefix + digits
                          }
                          if (value.length > 12) {
                            value = value.substring(0, 12)
                          }
                          setPhone(value)
                        }}
                        placeholder="Ej: +569 1234 5678"
                        maxLength={12}
                        className="h-12 text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instagram" className="text-sm font-medium">
                        Usuario de Instagram
                      </Label>
                      <div className="relative">
                        <Input
                          id="instagram"
                          type="text"
                          value={instagram}
                          onChange={(e) => {
                            let value = e.target.value
                            if (!value.startsWith("@")) {
                              value = "@" + value.replace(/^@/, "")
                            }
                            setInstagram(value)
                          }}
                          placeholder="Ej: tu_usuario"
                          maxLength={30}
                          className="h-12 text-base"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 pt-6 justify-center items-center">
                    <Button onClick={handleSave} disabled={isLoading} className="px-8 h-12 text-base font-medium">
                      <Save className="w-4 h-4 mr-2" />
                      {isLoading ? "Guardando..." : "Guardar Cambios"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
