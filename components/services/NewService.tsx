"use client"

import type React from "react"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Type, FileText, Tag, X, PawPrint } from "lucide-react"

export default function NewService({
  onServiceAdded,
  onCancel,
}: {
  onServiceAdded?: () => void
  onCancel?: () => void
}) {
  const [formData, setFormData] = useState({
    name: "",
    latitude: "",
    longitude: "",
    description: "",
    category: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, category: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          latitude: Number.parseFloat(formData.latitude),
          longitude: Number.parseFloat(formData.longitude),
        }),
      })

      if (res.ok) {
        toast.success("Servicio agregado con éxito")
        setFormData({ name: "", latitude: "", longitude: "", description: "", category: "" })
        onServiceAdded?.()
      } else {
        toast.error("Error al agregar servicio")
      }
    } catch (error) {
      toast.error("Error al conectar con el servidor")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PawPrint className="h-6 w-6" />
            <div>
              <CardTitle>Nuevo Servicio para Mascotas</CardTitle>
              <CardDescription className="text-purple-100">Agrega un nuevo servicio al mapa</CardDescription>
            </div>
          </div>
          {onCancel && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onCancel}
              className="text-white hover:bg-purple-700 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <Type className="h-4 w-4 text-purple-600" />
              Nombre del servicio
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="Ej: Veterinaria Patitas Felices"
              value={formData.name}
              onChange={handleChange}
              required
              className="border-purple-200 focus-visible:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-purple-600" />
                Latitud
              </Label>
              <Input
                id="latitude"
                name="latitude"
                type="number"
                step="any"
                placeholder="Ej: -34.6037"
                value={formData.latitude}
                onChange={handleChange}
                required
                className="border-purple-200 focus-visible:ring-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-purple-600" />
                Longitud
              </Label>
              <Input
                id="longitude"
                name="longitude"
                type="number"
                step="any"
                placeholder="Ej: -58.3816"
                value={formData.longitude}
                onChange={handleChange}
                required
                className="border-purple-200 focus-visible:ring-purple-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-purple-600" />
              Categoría
            </Label>
            <Select value={formData.category} onValueChange={handleSelectChange} required>
              <SelectTrigger className="border-purple-200 focus:ring-purple-500">
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="veterinaria">Veterinaria</SelectItem>
                <SelectItem value="peluqueria">Peluquería</SelectItem>
                <SelectItem value="tienda">Tienda de mascotas</SelectItem>
                <SelectItem value="guarderia">Guardería</SelectItem>
                <SelectItem value="adiestramiento">Centro de adiestramiento</SelectItem>
                <SelectItem value="adopcion">Centro de adopción</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-purple-600" />
              Descripción
            </Label>
            <Input
              id="description"
              name="description"
              placeholder="Describe brevemente el servicio que ofreces..."
              value={formData.description}
              onChange={handleChange}
              required
              className="border-purple-200 focus-visible:ring-purple-500"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3 border-t pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar Servicio"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
