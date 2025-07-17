"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Upload, Save, Trash2, ArrowLeft, AlertCircle, RefreshCw } from "lucide-react"
import { useProfileImageUpload } from "@/hooks/useProfileImageUpload"
import { toast } from "sonner"
import { useUserProfile } from "@/stores/userProfile"

export default function ProfileConfigPage() {
  const router = useRouter()
  const { user, setUser, setSelectedBadges } = useUserProfile()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedBadgeIds, setSelectedBadgeIds] = useState<string[]>([])
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
        selectedBadgeIds: updatedData?.selectedBadgeIds !== undefined ? updatedData?.selectedBadgeIds : user?.selectedBadgeIds,
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
    }
  }

  const handleBadgeToggle = async (badgeId: string) => {
    const newSelectedBadgeIds = selectedBadgeIds.includes(badgeId)
      ? selectedBadgeIds.filter(id => id !== badgeId)
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
            } catch { }
          }
        } else {
          throw new Error(uploadResult.error || "Error al subir la imagen")
        }
      }

      const success = await updateProfile({
        name: name.trim() || undefined,
        avatar_url: avatarUrl,
        selectedBadgeIds: selectedBadgeIds,
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="text-lg">Cargando perfil...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <div className="text-lg text-red-600 mb-2">Error al cargar el perfil</div>
          <div className="text-sm text-gray-600 mb-4 p-3 bg-gray-100 rounded">{error}</div>
          <div className="flex gap-2 justify-center">
            <Button onClick={fetchProfile} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reintentar
            </Button>
            <Button onClick={() => router.push("/")} variant="default">
              Volver al inicio
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-4">No se pudo cargar el perfil</div>
          <Button onClick={fetchProfile}>Reintentar</Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Configuración del Perfil</h1>
              <div className="flex items-center gap-3 ml-8">
                <Button variant="outline" size="sm" onClick={fetchProfile}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Recargar
                </Button>
                <Button variant="outline" size="sm" onClick={() => router.back()}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver
                </Button>
              </div>
            </div>

            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile">Perfil</TabsTrigger>
                <TabsTrigger value="badges">Insignias</TabsTrigger>
              </TabsList>

              <div className="mt-6 min-h-[480px]">
                <TabsContent value="profile" className="space-y-6 m-0 h-full">
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Foto de Perfil</Label>
                    <div className="w-full flex justify-center">
                      <div className="flex items-center gap-4">
                        <div className="w-32 h-32 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                          <img
                            src={imagePreview || user.avatar_url || "/placeholder.svg"}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => fileInputRef.current?.click()}
                              className="flex items-center gap-2"
                              disabled={isUploadingAvatar}
                            >
                              <Upload className="w-4 h-4" />
                              {isUploadingAvatar ? "Subiendo..." : "Subir Imagen"}
                            </Button>
                            {user.avatar_url && !user.avatar_url.includes("defaultpfp.png") && (
                              <Button
                                type="button"
                                variant="outline"
                                onClick={handleRemoveAvatar}
                                disabled={isDeleting}
                                className="flex items-center gap-2 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                                {isDeleting ? "Eliminando..." : "Eliminar"}
                              </Button>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">JPG, PNG o GIF. Máximo 2MB.</p>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre a Mostrar</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ingresa tu nombre a mostrar en el foro"
                      maxLength={50}
                    />
                    <p className="text-xs text-muted-foreground">Este será tu nombre visible en el foro</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={user.email} disabled className="bg-muted" />
                  </div>

                  <Button onClick={handleSave} disabled={isLoading || isUploadingAvatar} className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                </TabsContent>

                <TabsContent value="badges" className="space-y-4">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Selecciona tus insignias</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Puedes seleccionar hasta 3 insignias que se mostrarán en tu perfil público.
                        Seleccionadas: {selectedBadgeIds.length}/3
                      </p>
                      {user.badges.length === 0 ? (
                        <p>No tienes insignias disponibles aún.</p>
                      ) : (
                        <div className="grid grid-cols-3 gap-4">
                          {user.badges.map((badge) => {
                            const isSelected = selectedBadgeIds.includes(badge.id)
                            return (
                              <div
                                key={badge.id}
                                className={`
                                  relative cursor-pointer transition-all duration-200
                                  ${isSelected ? "scale-105" : "hover:scale-105"}
                                `}
                                onClick={() => handleBadgeToggle(badge.id)}
                              >
                                <div className="text-center">
                                  <img
                                    src={badge.icon}
                                    alt={badge.label}
                                    title={badge.label}
                                    className="w-12 h-12 mx-auto"
                                  />
                                  <div className="text-sm mt-1">{badge.label}</div>
                                </div>
                                {isSelected && (
                                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">✓</span>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>

                    {selectedBadgeIds.length > 0 && (
                      <div>
                        <h4 className="text-md font-semibold mb-3">Vista previa de insignias seleccionadas</h4>
                        <div className="flex gap-3 p-4 bg-muted rounded-lg">
                          {selectedBadgeIds.map((badgeId) => {
                            const badge = user.badges.find(b => b.id === badgeId)
                            if (!badge) return null
                            return (
                              <div key={badge.id} className="text-center">
                                <img
                                  src={badge.icon}
                                  alt={badge.label}
                                  title={badge.label}
                                  className="w-8 h-8 mx-auto"
                                />
                                <div className="text-xs mt-1">{badge.label}</div>
                              </div>
                            )
                          })}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Así se verán en tu perfil público
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>

              </div>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  )
}
