"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { vaccinationSchema } from "@/server/validations/vaccination.validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Loader2 } from "lucide-react";
import { useActivePet } from "@/stores/activePet";
import { useHealth } from "@/stores/health";
import { useState } from "react";
import type { z } from "zod";

type VaccinationFormData = z.infer<typeof vaccinationSchema>;

interface AddVaccinationFormProps {
  onSuccess?: () => void;
  initialData?: Partial<VaccinationFormData>;
  isEditing?: boolean;
}

const vaccineTypes = [
  { value: "rabies", label: "Rabia" },
  { value: "distemper", label: "Moquillo" },
  { value: "parvovirus", label: "Parvovirus" },
  { value: "leptospirosis", label: "Leptospirosis" },
  { value: "bordetella", label: "Bordetella" },
  { value: "other", label: "Otra" },
] as const;

export function AddVaccinationForm({
  onSuccess,
  initialData,
  isEditing = false,
}: AddVaccinationFormProps) {
  const activePet = useActivePet((state) => state.activePet);
  const { addVaccination, updateVaccination } = useHealth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<VaccinationFormData>({
    resolver: zodResolver(vaccinationSchema),
    defaultValues: {
      name: initialData?.name || "",
      type: initialData?.type || undefined,
      application_date: initialData?.application_date
        ? new Date(initialData.application_date)
        : new Date(),
      next_dose_date: initialData?.next_dose_date
        ? new Date(initialData.next_dose_date)
        : undefined,
      notes: initialData?.notes || "",
      active: initialData?.active ?? true,
    },
  });

  const onSubmit = async (data: VaccinationFormData) => {
    if (!activePet?.id) {
      console.error("No active pet selected");
      return;
    }

    setIsSubmitting(true);
    try {
      const vaccinationData = {
        ...data,
        pet_id: activePet.id.toString(),
        id: initialData?.id,
      };

      if (isEditing && initialData?.id) {
        await updateVaccination(vaccinationData);
      } else {
        await addVaccination(vaccinationData);
      }

      reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error saving vaccination:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre de la Vacuna *</Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="Ej: Vacuna Triple, Antirrábica..."
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Tipo de Vacuna</Label>
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value ?? ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo de vacuna" />
              </SelectTrigger>
              <SelectContent>
                {vaccineTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.type && (
          <p className="text-sm text-destructive">{errors.type.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Fecha de Aplicación *</Label>
        <Controller
          control={control}
          name="application_date"
          render={({ field }) => (
            <DatePicker
              value={field.value}
              onChange={field.onChange}
              placeholder="Seleccionar fecha"
            />
          )}
        />
        {errors.application_date && (
          <p className="text-sm text-destructive">
            {errors.application_date.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Próxima Dosis</Label>
        <Controller
          control={control}
          name="next_dose_date"
          render={({ field }) => (
            <DatePicker
              value={field.value ?? undefined}
              onChange={field.onChange}
              placeholder="Seleccionar fecha (opcional)"
            />
          )}
        />
        {errors.next_dose_date && (
          <p className="text-sm text-destructive">
            {errors.next_dose_date.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notas</Label>
        <Textarea
          id="notes"
          {...register("notes")}
          placeholder="Notas adicionales sobre la vacuna..."
          rows={3}
        />
        {errors.notes && (
          <p className="text-sm text-destructive">{errors.notes.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isEditing ? "Actualizar Vacuna" : "Agregar Vacuna"}
      </Button>
    </form>
  );
}
