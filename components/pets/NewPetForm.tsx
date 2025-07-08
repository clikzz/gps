"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useImageUpload } from "@/hooks/usePetImageUpload";
import { useNewPetForm } from "@/hooks/useNewPetForm";
import {
  TextField,
  SelectField,
  CheckboxField,
  ImageUploadField,
} from "@/components/pets/PetFormField";
import { SPECIES_OPTIONS, SEX_OPTIONS } from "@/types/pet";

interface NewPetFormProps {
  onSuccess?: () => void;
}

const NewPetForm: React.FC<NewPetFormProps> = ({ onSuccess }) => {
  const imageUpload = useImageUpload();

  const petForm = useNewPetForm({
    uploadImage: imageUpload.uploadImage,
    resetImage: imageUpload.resetImage,
    onSuccess,
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        petForm.form.handleSubmit();
      }}
      className="w-full"
    >
      <div className="space-y-4">
        {/* Nombre */}
        <petForm.form.Field name="name">
          {(field) => (
            <TextField
              field={field}
              label="Nombre"
              placeholder="Nombre de la mascota"
              required
            />
          )}
        </petForm.form.Field>

        {/* Especie */}
        <petForm.form.Field name="species">
          {(field) => (
            <SelectField
              field={field}
              label="Tipo de mascota"
              placeholder="Selecciona un tipo de mascota"
              options={SPECIES_OPTIONS}
              required
            />
          )}
        </petForm.form.Field>

        {/* Imagen */}
        <ImageUploadField
          label="Foto de la mascota"
          imagePreview={imageUpload.imagePreview}
          onFileChange={imageUpload.handleFileChange}
        />

        {/* Fecha de adopción */}
        <petForm.form.Field name="date_of_adoption">
          {(field) => (
            <TextField field={field} label="Fecha de adopción" type="date" />
          )}
        </petForm.form.Field>

        {/* Fecha de nacimiento */}
        <petForm.form.Field name="date_of_birth">
          {(field) => (
            <TextField field={field} label="Fecha de nacimiento" type="date" />
          )}
        </petForm.form.Field>

        {/* Sexo */}
        <petForm.form.Field name="sex">
          {(field) => (
            <SelectField
              field={field}
              label="Sexo"
              placeholder="Selecciona el sexo"
              options={SEX_OPTIONS}
            />
          )}
        </petForm.form.Field>

        {/* Esterilizado */}
        <petForm.form.Field name="fixed">
          {(field) => (
            <CheckboxField field={field} label="¿Está esterilizado?" />
          )}
        </petForm.form.Field>
      </div>

      <Button
        type="submit"
        className="w-full mt-6"
        disabled={petForm.isSubmitting || imageUpload.isUploading}
      >
        {imageUpload.isUploading
          ? "Subiendo imagen..."
          : petForm.isSubmitting
            ? "Creando mascota..."
            : "Crear mascota"}
      </Button>
    </form>
  );
};

export default NewPetForm;
