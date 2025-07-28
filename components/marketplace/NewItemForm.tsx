"use client";

import React, { useRef, useState, useEffect } from "react";
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
import { Minimap } from "@/components/Minimap";
import LocationPicker, { LatLng } from "@/components/marketplace/LocationPicker";
import type { ItemCondition, ItemCategory, PetCategory } from "@prisma/client";
import { CATEGORY_OPTIONS, CONDITION_OPTIONS, PET_OPTIONS } from "@/types/marketplace";
import { CreateItemInput } from "@/server/validations/marketplace.validation";

interface NewItemFormProps {
  onSuccess?: () => void;
  initialData?: CreateItemInput;
}

export default function NewItemForm({ onSuccess, initialData }: NewItemFormProps) {
  const {
    form,
    onSubmit,
    isSubmitting,
    imageUpload,
    resetForm,
  } = useNewItemForm(onSuccess);

  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const [loc, setLoc] = useState<LatLng | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      resetForm(initialData);
      setPreviewUrls(initialData.photo_urls);
      setLoc({ lat: initialData.latitude, lng: initialData.longitude });
      console.log("Initial data set:", initialData);
    }
  }, [initialData, resetForm]);

  useEffect(() => {
    if (loc) {
      setValue("latitude", loc.lat, { shouldValidate: true });
      setValue("longitude", loc.lng, { shouldValidate: true });
    }
  }, [loc, setValue]);

  const handleFiles = (files: FileList) => {
    imageUpload.handleFileChange({ target: { files } } as any);
    const urls = Array.from(files).map((f) => URL.createObjectURL(f));
    setPreviewUrls(urls);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

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
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Tipo de mascota y Categoría */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Tipo de mascota *</Label>
              <Select
                defaultValue={initialData?.pet_category}
                onValueChange={(v: PetCategory) => setValue("pet_category", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tipo" />
                </SelectTrigger>
                <SelectContent>
                  {PET_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.pet_category && (
                <p className="text-sm text-destructive">{errors.pet_category.message}</p>
              )}
            </div>
            <div>
              <Label>Categoría *</Label>
              <Select
                defaultValue={initialData?.category}
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

          {/* Precio y Condición */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
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
            <div>
              <Label>Condición *</Label>
              <Select
                defaultValue={initialData?.condition}
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
          </div>

          {/* Ubicación */}
          <div className="space-y-1 flex flex-col">
            <Label>Ubicación *</Label>
            {loc && (
              <>
                <Minimap location={loc} height="200px" />
              </>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPickerOpen(true)}
            >
              <MapPin className="mr-2" />
              Marcar en el mapa
            </Button>
            {(errors.latitude || errors.longitude) && (
              <p className="text-sm text-destructive">
                Por favor marca la ubicación en el mapa.
              </p>
            )}
          </div>

          {/* Imágenes */}
          <div className="space-y-1">
            <Label>Fotos *</Label>
            <div 
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <Plus className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground mb-2">
                Arrastra tus fotos aquí o haz clic para seleccionar
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                Seleccionar fotos
              </Button>
              <div className="mt-4 flex flex-wrap gap-2">
                {previewUrls.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    className="h-24 w-24 object-cover rounded"
                  />
                ))}
              </div>
            </div>
            {errors.photo_urls && (
              <p className="text-sm text-destructive">
                {errors.photo_urls.message as string}
              </p>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
            />
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
        initial={loc ?? { lat: -36.82699, lng: -73.04977 }}
        onSelect={(coords) => {
          setLoc(coords);
          setPickerOpen(false);
        }}
        onClose={() => setPickerOpen(false)}
      />
    </Card>
  );
}
