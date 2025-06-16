"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Upload, Save, Trash2, ArrowLeft, AlertCircle, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"

interface UserProfile {
  id: string
  name: string | null
  avatar_url: string | null
  email: string
  public_id: string | undefined
  menssageCount: number
}

export default function ProfileConfigPage() {
  const router = useRouter()

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState("")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  useEffect(() => {
    if (profile) {
      console.log("Profile loaded:", profile)
      setName(profile.name || "")
      setAvatarPreview(profile.avatar_url || "")
    }
  }, [profile])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const profileData = await response.json()

      if (profileData.error) {
        throw new Error(profileData.error)
      }

      console.log("Profile data received:", profileData)
      setProfile(profileData)
    } catch (error) {
      console.error("Error fetching profile:", error)
      setError(error instanceof Error ? error.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updatedData: Partial<UserProfile>) => {
    try {
      const updatePayload = {
        name: updatedData.name !== undefined ? updatedData.name : profile?.name,
        email: profile?.email || "",
        avatar_url: updatedData.avatar_url !== undefined ? updatedData.avatar_url : profile?.avatar_url,
      }

      console.log("Updating profile with:", updatePayload)

      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatePayload),
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const updatedProfile = await response.json()

      if (updatedProfile.error) {
        throw new Error(updatedProfile.error)
      }

      console.log("Profile updated:", updatedProfile)
      setProfile(updatedProfile)
      return true
    } catch (error) {
      console.error("Error updating profile:", error)
      setError(error instanceof Error ? error.message : "Error al actualizar perfil")
      return false
    }
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Por favor selecciona un archivo de imagen válido")
        return
      }

      if (file.size > 2 * 1024 * 1024) {
        alert("La imagen debe ser menor a 2MB")
        return
      }

      setAvatarFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveAvatar = async () => {
    if (!profile?.avatar_url) return

    setIsDeleting(true)
    try {
      const response = await fetch("/api/upload", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: profile.avatar_url,
        }),
      })

      if (response.ok) {
        setAvatarPreview("")
        setAvatarFile(null)
        const success = await updateProfile({ avatar_url: null })
        if (success) {
          alert("Avatar eliminado correctamente")
        }
      } else {
        throw new Error("Error al eliminar la imagen")
      }
    } catch (error) {
      console.error("Error removing avatar:", error)
      alert("Error al eliminar la imagen")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSave = async () => {
    if (!profile) return

    setIsLoading(true)
    try {
      let avatarUrl = profile.avatar_url

      if (avatarFile) {
        console.log("Uploading new avatar...")

        const formData = new FormData()
        formData.append("file", avatarFile)
        formData.append("type", "profile")

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json()
          avatarUrl = uploadResult.url
          console.log("Avatar uploaded:", uploadResult)

          if (profile.avatar_url && profile.avatar_url !== avatarUrl) {
            try {
              await fetch("/api/upload", {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  url: profile.avatar_url,
                }),
              })
              console.log("Old avatar deleted")
            } catch (error) {
              console.error("Error deleting old avatar:", error)
            }
          }
        } else {
          const errorData = await uploadResponse.json()
          throw new Error(errorData.error || "Error al subir la imagen")
        }
      }

      console.log("Updating profile...")
      const success = await updateProfile({
        name: name.trim() || null,
        avatar_url: avatarUrl,
      })

      if (success) {
        alert("Perfil actualizado correctamente")
        setAvatarFile(null)
      } else {
        throw new Error("Error al actualizar el perfil")
      }
    } catch (error) {
      console.error("Error in handleSave:", error)
      alert(error instanceof Error ? error.message : "Error al actualizar el perfil")
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

  if (!profile) {
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Configuración del Perfil</h1>
              <Button variant="outline" size="sm" onClick={fetchProfile}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Recargar
              </Button>
            </div>

            <div className="mb-4 p-3 bg-blue-50 rounded text-xs">
              <strong>Debug:</strong> ID: {profile.id}, Email: {profile.email}, Name: {profile.name || "null"}
            </div>

            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile">Perfil</TabsTrigger>
                <TabsTrigger value="badges">Insignias</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Foto de Perfil</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-24 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview || "/placeholder.svg"}
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
                        >
                          <Upload className="w-4 h-4" />
                          Subir Imagen
                        </Button>
                        {profile.avatar_url && (
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
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
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
                  <Input id="email" value={profile.email} disabled className="bg-muted" />
                </div>

                <Button onClick={handleSave} disabled={isLoading} className="w-full">
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
