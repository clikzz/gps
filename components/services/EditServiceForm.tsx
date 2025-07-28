"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { useEditServiceForm } from "@/hooks/useEditServiceForm"
import { TextField, MultiSelectField, PhoneField } from "@/components/services/ServiceFormField"
import { CATEGORY_OPTIONS } from "@/types/service"
import { Save, MapPin, Loader2 } from "lucide-react"
import { Service } from "@/types/service"

interface EditServiceFormProps {
  service: Service
  selectedServiceLocation: { lat: number; lng: number } | null
  isSelectingLocation: boolean
  onCancelLocationSelection: () => void
  onServiceUpdated: () => void
}

const EditServiceForm: React.FC<EditServiceFormProps> = ({
  service,
  selectedServiceLocation,
  isSelectingLocation,
  onCancelLocationSelection,
  onServiceUpdated,
}) => {
  const serviceForm = useEditServiceForm({
    service,
    onSuccess: () => {
      onServiceUpdated()
    },
  })

  React.useEffect(() => {
    if (selectedServiceLocation) {
      serviceForm.form.setFieldValue("latitude", selectedServiceLocation.lat)
      serviceForm.form.setFieldValue("longitude", selectedServiceLocation.lng)
    }
  }, [selectedServiceLocation, serviceForm.form])

  if (isSelectingLocation) {
    return (
      <div className="text-center py-8 space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <MapPin className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Selecciona nueva ubicación</h3>
          <p className="text-sm text-gray-600 mb-4">Haz clic en el mapa para cambiar la ubicación de tu servicio</p>
          <div className="flex items-center justify-center space-x-2 text-sm text-blue-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Esperando selección en el mapa...</span>
          </div>
        </div>
        <p className="text-xs text-gray-500">Puedes minimizar este panel para ver mejor el mapa</p>
      </div>
    )
  }

  const currentLocation = selectedServiceLocation || { lat: service.latitude, lng: service.longitude }

  return (
    <div className="space-y-4">
      {/* Mostrar ubicación - estilo minimalista */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <MapPin className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm font-medium text-blue-800">
            {selectedServiceLocation ? "Nueva ubicación" : "Ubicación actual"}
          </span>
        </div>
        <p className="text-xs text-gray-600">
          {selectedServiceLocation ? "Se actualizará la ubicación" : "Ubicación del servicio"}
        </p>
        <div className="text-xs text-gray-500 font-mono">
          📍 {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
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
            <PhoneField
              field={field}
              label="Teléfono de contacto"
              placeholder="9 1234 5678"
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
              Actualizando servicio...
            </>
          ) : (
            <div className="flex items-center">
              <Save className="w-4 h-4 mr-2" />
              Guardar cambios
            </div>
          )}
        </Button>
      </form>
    </div>
  )
}

export default EditServiceForm
