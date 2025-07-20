"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { useNewServiceForm } from "@/hooks/useNewServiceForm"
import { TextField, MultiSelectField, CATEGORY_OPTIONS } from "@/components/services/ServiceFormField"
import { Check, MapPin, Loader2 } from "lucide-react"

interface NewServiceFormProps {
  userLocation: { lat: number; lng: number }
  selectedServiceLocation: { lat: number; lng: number } | null
  isSelectingLocation: boolean
  onCancelLocationSelection: () => void
  onServiceCreated: () => void
}

const NewServiceForm: React.FC<NewServiceFormProps> = ({
  userLocation,
  selectedServiceLocation,
  isSelectingLocation,
  onCancelLocationSelection,
  onServiceCreated,
}) => {
  const serviceForm = useNewServiceForm({
    onSuccess: () => {
      onServiceCreated()
    },
  })

  React.useEffect(() => {
    if (selectedServiceLocation) {
      serviceForm.form.setFieldValue("latitude", selectedServiceLocation.lat.toString())
      serviceForm.form.setFieldValue("longitude", selectedServiceLocation.lng.toString())
    }
  }, [selectedServiceLocation, serviceForm.form])

  if (isSelectingLocation || !selectedServiceLocation) {
    return (
      <div className="text-center py-8 space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <MapPin className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-medium text-secondary mb-2">Selecciona la ubicación</h3>
          <p className="text-sm text-gray-600 mb-4">
            Haz clic en el mapa principal para marcar donde se encuentra tu servicio
          </p>
          {isSelectingLocation && (
            <div className="flex items-center justify-center space-x-2 text-sm text-primary">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Esperando selección en el mapa...</span>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500">Puedes minimizar este panel para ver mejor el mapa</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Mostrar ubicación seleccionada - estilo minimalista */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <span className="text-sm font-medium text-green-800">Ubicación confirmada</span>
        </div>
        <p className="text-xs text-gray-600">Tu servicio se ubicará aquí</p>
        <div className="text-xs text-muted-foreground font-mono">
          {selectedServiceLocation.lat.toFixed(6)}, {selectedServiceLocation.lng.toFixed(6)}
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          serviceForm.form.handleSubmit()
        }}
        className="space-y-4"
      >
        {/* Nombre del servicio */}
        <serviceForm.form.Field name="name">
          {(field) => (
            <TextField
              field={field}
              label="Nombre del servicio"
              placeholder="Ej: Veterinaria Patitas Felices"
              required
            />
          )}
        </serviceForm.form.Field>

        {/* Categorías múltiples */}
        <serviceForm.form.Field name="categories">
          {(field) => (
            <MultiSelectField
              field={field}
              label="Categorías del servicio"
              options={CATEGORY_OPTIONS}
              required
              maxSelections={3}
            />
          )}
        </serviceForm.form.Field>

        {/* Teléfono */}
        <serviceForm.form.Field name="phone">
          {(field) => (
            <TextField
              field={field}
              label="Teléfono de contacto"
              placeholder="Ej: +56 9 1234 5678"
              type="tel"
              required
            />
          )}
        </serviceForm.form.Field>

        {/* Descripción */}
        <serviceForm.form.Field name="description">
          {(field) => (
            <TextField
              field={field}
              label="Descripción del servicio"
              placeholder="Describe brevemente lo que ofreces..."
              required
            />
          )}
        </serviceForm.form.Field>

        <Button type="submit" className="w-full" disabled={serviceForm.isSubmitting}>
          {serviceForm.isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Creando servicio...
            </>
          ) : (
            <div className="flex items-center">
              <Check className="w-4 h-4 mr-2" />
              Crear servicio
            </div>
          )}
        </Button>
      </form>
    </div>
  )
}

export default NewServiceForm
