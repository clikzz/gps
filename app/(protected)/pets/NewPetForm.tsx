"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useUserProfile } from "@/stores/userProfile";
import { useState } from "react";

const FormSchema = z.object({
  name: z.string().min(2).max(15),
  species: z.enum([
    "dog",
    "cat",
    "rabbit",
    "hamster",
    "turtle",
    "bird",
    "other",
  ]),
  active: z.boolean().optional(),
  date_of_adoption: z
    .string()
    .optional()
    .refine((date) => {
      if (!date) return true;
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime());
    }, "Invalid date format"),
  date_of_birth: z
    .string()
    .optional()
    .refine((date) => {
      if (!date) return true;
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime());
    }, "Invalid date format"),
  fixed: z.boolean().optional(),
  sex: z.enum(["male", "female", "unknown"]).optional(),
  photo_url: z.string().optional(),
});

const NewPetForm = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      species: "dog",
      active: true,
      date_of_adoption: "",
      date_of_birth: "",
      fixed: false,
      sex: "unknown",
      photo_url: "",
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Por favor selecciona un archivo de imagen válido");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("La imagen debe ser menor a 5MB");
        return;
      }

      setSelectedFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!selectedFile) return null;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("type", "pet");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al subir la imagen");
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error al subir la imagen");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    let photoUrl = values.photo_url || "";

    if (selectedFile) {
      const uploadedUrl = await uploadImage();
      if (uploadedUrl) {
        photoUrl = uploadedUrl;
      } else {
        return;
      }
    }

    const formattedValues = {
      ...values,
      photo_url: photoUrl,
      date_of_adoption: values.date_of_adoption
        ? new Date(values.date_of_adoption)
        : undefined,
      date_of_birth: values.date_of_birth
        ? new Date(values.date_of_birth)
        : undefined,
    };

    const response = await fetch("/api/pets", {
      method: "POST",
      body: JSON.stringify(formattedValues),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      toast.error(error.message);
      return;
    }

    const data = await response.json();
    const user = useUserProfile.getState().user;
    if (!user) {
      toast.error("Usuario no encontrado");
      return;
    }

    const updatedUser = {
      ...user,
      pets: [...user.pets, data],
    };
    useUserProfile.setState({ user: updatedUser });
    toast.success("Mascota creada con éxito");

    form.reset();
    setSelectedFile(null);
    setImagePreview(null);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="species"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de mascota</FormLabel>
                <FormControl>
                  <Input placeholder="Tipo de mascota" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>Foto de la mascota</FormLabel>
            <FormControl>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </FormControl>
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Vista previa"
                  className="w-32 h-32 object-cover rounded-lg border"
                />
              </div>
            )}
            <FormMessage />
          </FormItem>

          <FormField
            control={form.control}
            name="photo_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>O ingresa URL de la foto manualmente</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://ejemplo.com/imagen.jpg"
                    {...field}
                    disabled={!!selectedFile}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date_of_adoption"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de adopción</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date_of_birth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de nacimiento</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fixed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>¿Está esterilizado?</FormLabel>
                <FormControl>
                  <Input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sex"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sexo</FormLabel>
                <FormControl>
                  <Input placeholder="Sexo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button className="w-full mt-6" type="submit" disabled={isUploading}>
          {isUploading ? "Subiendo imagen..." : "Crear mascota"}
        </Button>
      </form>
    </Form>
  );
};

export default NewPetForm;
