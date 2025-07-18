"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DollarSign, MapPin, Plus } from "lucide-react";
import { useNewItemForm } from "@/hooks/marketplace/useNewItemForm";
import LocationPicker, { LatLng } from "@/components/marketplace/LocationPicker";
import type { ItemCondition, ItemCategory } from "@prisma/client";
import { CATEGORY_OPTIONS, CONDITION_OPTIONS } from "@/types/marketplace";

interface NewItemFormProps {
  onSuccess?: () => void;
}

export default function NewItemForm({ onSuccess }: NewItemFormProps) {
  const {
    form,
    onSubmit,
    isSubmitting,
    imageUpload,
  } = useNewItemForm(onSuccess);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const [loc, setLoc] = useState<LatLng | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    if (loc) {
      setValue("latitude", loc.lat, { shouldValidate: true });
      setValue("longitude", loc.lng, { shouldValidate: true });
    }
  }, [loc, setValue]);

  const condition = watch("condition");
  const category = watch("category");

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold">Vende tu producto</h2>
        <p className="text-muted-foreground">
          Completa la información de tu producto para publicarlo.
        </p>
      </CardHeader>

      <form onSubmit={onSubmit}>
        <CardContent className="space-y-6">
          {/* Título */}
          <div className="space-y-1">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Ej: Collar de cuero premium para perros"
            />
            {errors.title && (
              <p className="text-sm text-destructive">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Descripción */}
          <div className="space-y-1">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Describe tu producto…"
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Condición & Categoría */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Condición *</Label>
              <Select
                value={condition}
                onValueChange={(v: ItemCondition) => setValue("condition", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona condición" />
                </SelectTrigger>
                <SelectContent>
                  {CONDITION_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.condition && (
                <p className="text-sm text-destructive">
                  {errors.condition.message}
                </p>
              )}
            </div>
            <div>
              <Label>Categoría *</Label>
              <Select
                value={category}
                onValueChange={(v: ItemCategory) => setValue("category", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona categoría" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive">
                  {errors.category.message}
                </p>
              )}
            </div>
          </div>

          {/* Precio */}
          <div className="space-y-1">
            <Label htmlFor="price">Precio *</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="price"
                type="number"
                {...register("price", { valueAsNumber: true })}
                className="pl-10"
              />
            </div>
            {errors.price && (
              <p className="text-sm text-destructive">
                {errors.price.message}
              </p>
            )}
          </div>

          {/* Ubicación */}
          <div className="space-y-1">
            <Label>Ubicación *</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPickerOpen(true)}
            >
              <MapPin className="mr-2" />
              Marcar en el mapa
            </Button>
            {loc && (
              <p className="text-sm text-muted-foreground">
                Lat: {loc.lat.toFixed(4)}, Lng: {loc.lng.toFixed(4)}
              </p>
            )}
            {(errors.latitude || errors.longitude) && (
              <p className="text-sm text-destructive">
                Por favor marca la ubicación en el mapa.
              </p>
            )}
          </div>

          {/* Imágenes */}
          <div className="space-y-1">
            <Label>Fotos *</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <Plus className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground mb-2">
                Arrastra tus fotos aquí o haz clic para seleccionar
              </p>
              <Button
                variant="outline"
                onClick={imageUpload.handleFileChange as any}
              >
                Seleccionar fotos
              </Button>
              {imageUpload.imagePreview && (
                <img
                  src={imageUpload.imagePreview}
                  className="mt-4 h-32 mx-auto object-cover rounded"
                />
              )}
            </div>
            {errors.photo_urls && (
              <p className="text-sm text-destructive">
                {errors.photo_urls.message as string}
              </p>
            )}
          </div>
        </CardContent>

        <Separator />

        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSubmitting || imageUpload.isUploading}
          >
            {imageUpload.isUploading
              ? "Subiendo imagen..."
              : isSubmitting
              ? "Publicando..."
              : "Publicar producto"}
          </Button>
        </CardFooter>
      </form>

      {/* LocationPicker */}
      <LocationPicker
        open={pickerOpen}
        initial={loc ?? { lat: 0, lng: 0 }}
        onSelect={(coords) => {
          setLoc(coords);
          setPickerOpen(false);
        }}
        onClose={() => setPickerOpen(false)}
      />
    </Card>
  );
}
