"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNewItemForm } from "@/hooks/useNewItemForm";
import {
  TextField,
  SelectField,
  ImageUploadField,
} from "@/components/marketplace/NewItemFormField";
import { Controller } from "react-hook-form";
import { ItemCategory, ItemCondition } from "@prisma/client";
import LocationPicker, { LatLng } from "@/components/marketplace/LocationPicker";

const CATEGORY_OPTIONS = [
  { label: "Comida", value: ItemCategory.FOOD },
  { label: "Juguetes", value: ItemCategory.TOYS },
  { label: "Camas", value: ItemCategory.BEDDING },
  { label: "Paseo", value: ItemCategory.WALK_WEAR },
  { label: "Salud", value: ItemCategory.HEALTH_GROOM },
  { label: "Viajes", value: ItemCategory.TRAVEL },
  { label: "Otros", value: ItemCategory.OTHER },
];
const CONDITION_OPTIONS = [
  { label: "Nuevo", value: ItemCondition.NEW },
  { label: "Usado", value: ItemCondition.USED },
];

export default function NewItemForm() {
  const { form, onSubmit, isSubmitting, imageUpload } = useNewItemForm();
  const [loc, setLoc] = useState<LatLng | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    if (loc) {
      form.setValue("latitude", loc.lat);
      form.setValue("longitude", loc.lng);
    }
  }, [loc, form]);

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Título */}
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <TextField
              label="Título"
              required
              placeholder="Título del artículo"
              {...field}
              error={fieldState.error?.message}
            />
          )}
        />

        {/* Descripción */}
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <TextField
              label="Descripción"
              placeholder="Detalles…"
              {...field}
              error={fieldState.error?.message}
            />
          )}
        />

        {/* Categoría */}
        <Controller
          name="category"
          control={form.control}
          render={({ field, fieldState }) => (
            <SelectField
              label="Categoría"
              required
              options={CATEGORY_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />

        {/* Condición */}
        <Controller
          name="condition"
          control={form.control}
          render={({ field, fieldState }) => (
            <SelectField
              label="Condición"
              required
              options={CONDITION_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />

        {/* Precio */}
        <Controller
          name="price"
          control={form.control}
          render={({ field, fieldState }) => (
            <TextField
              label="Precio"
              type="number"
              required
              {...field}
              error={fieldState.error?.message}
            />
          )}
        />

        {/* Ubicación */}
        <div className="space-y-1">
          <label className="block text-sm font-medium">Ubicación</label>
          <Button size="sm" onClick={() => setPickerOpen(true)}>
            Marcar en el mapa
          </Button>
          {loc && (
            <p className="mt-1 text-sm">
              Lat: {loc.lat.toFixed(4)}, Lng: {loc.lng.toFixed(4)}
            </p>
          )}
          {form.formState.errors.latitude && (
            <p className="text-sm text-destructive">
              {form.formState.errors.latitude.message}
            </p>
          )}
        </div>

        {/* Imágenes */}
        <ImageUploadField
          label="Fotos"
          imagePreview={imageUpload.imagePreview}
          onFileChange={imageUpload.handleFileChange}
          error={form.formState.errors.photo_urls?.message}
        />

        <Button
          type="submit"
          className="w-full mt-6"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Publicando…" : "Publicar artículo"}
        </Button>
      </form>

      {/* Picker de mapa */}
      <LocationPicker
        open={pickerOpen}
        initial={loc ?? { lat: 0, lng: 0 }}
        onSelect={(coords) => {
          setLoc(coords);
          setPickerOpen(false);
        }}
        onClose={() => setPickerOpen(false)}
      />
    </>
  );
}