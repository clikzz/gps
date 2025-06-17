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
  const { user, setUser } = useUserProfile()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
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
      setImagePreview(user.avatar_url || "")
    }
  }, [user, setImagePreview])

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
    if (!user?.avatar_url) return

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

      if (response.ok) {
        resetImage()
        const success = await updateProfile({ avatar_url: undefined })
        if (success) {
          toast.success("Avatar eliminado correctamente")
        }
      } else {
        throw new Error("Error al eliminar la imagen")
      }
    } catch (error) {
      toast.error("Error al eliminar la imagen")
    } finally {
      setIsDeleting(false)
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
          if (user.avatar_url && user.avatar_url !== avatarUrl) {
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
      })

      if (success) {
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
              <Button variant="outline" size="sm" onClick={fetchProfile} className="ml-5">
                <RefreshCw className="w-4 h-4 mr-2" />
                Recargar
              </Button>
              <Button variant="outline" size="sm" onClick={() => router.back()} className="ml-5">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
            </div>

            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile">Perfil</TabsTrigger>
                <TabsTrigger value="badges">Insignias</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Foto de Perfil</Label>
                  <div className="w-full flex justify-center">
                    <div className="flex items-center gap-4">
                      <div className="w-32 h-32 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                        {imagePreview ? (
                          <img
                            src={imagePreview || "/placeholder.svg"}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl">👤</span>
                        )}
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
                          {user.avatar_url && (
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

              <TabsContent value="badges" className="space-y-4 mt-6">
                <div>
                  <Label className="text-base font-semibold">Insignias</Label>
                  <p className="text-sm text-muted-foreground mt-1">Las insignias estarán disponibles próximamente</p>
                </div>

                <Card className="p-8 text-center">
                  <div className="text-4xl mb-4">🏆</div>
                  <h3 className="text-lg font-semibold mb-2">Insignias en Desarrollo</h3>
                  <p className="text-muted-foreground">
                    El sistema de insignias estará disponible próximamente. Aquí podrás seleccionar hasta 6 insignias
                    para mostrar en tu perfil.
                  </p>
                </Card>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  )
}
