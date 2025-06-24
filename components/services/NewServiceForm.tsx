"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { useNewServiceForm } from "@/hooks/useNewServiceForm"
import { TextField, SelectField, CATEGORY_OPTIONS } from "@/components/services/NewServiceFormField"

interface NewServiceFormProps {
  onSuccess?: () => void
}

const NewServiceForm: React.FC<NewServiceFormProps> = ({ onSuccess }) => {
  const serviceForm = useNewServiceForm({
    onSuccess,
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        serviceForm.form.handleSubmit()
      }}
      className="w-full space-y-4"
    >
      {/* Nombre del servicio */}
      <serviceForm.form.Field name="name">
        {(field) => (
          <TextField field={field} label="Nombre del servicio" placeholder="Ej: Veterinaria Patitas Felices" required />
        )}
      </serviceForm.form.Field>

      {/* Categoría */}
      <serviceForm.form.Field name="category">
        {(field) => (
          <SelectField
            field={field}
            label="Categoría"
            placeholder="Selecciona una categoría"
            options={CATEGORY_OPTIONS}
            required
          />
        )}
      </serviceForm.form.Field>

      {/* Descripción */}
      <serviceForm.form.Field name="description">
        {(field) => (
          <TextField
            field={field}
            label="Descripción"
            placeholder="Describe brevemente el servicio que ofreces..."
            required
          />
        )}
      </serviceForm.form.Field>

      {/* Coordenadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <serviceForm.form.Field name="latitude">
          {(field) => <TextField field={field} label="Latitud" placeholder="Ej: -34.6037" type="number" required />}
        </serviceForm.form.Field>

        <serviceForm.form.Field name="longitude">
          {(field) => <TextField field={field} label="Longitud" placeholder="Ej: -58.3816" type="number" required />}
        </serviceForm.form.Field>
      </div>

      <Button type="submit" className="w-full" disabled={serviceForm.isSubmitting}>
        {serviceForm.isSubmitting ? "Creando servicio..." : "Crear servicio"}
      </Button>
    </form>
  )
}

export default NewServiceForm
