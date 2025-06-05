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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useUserProfile } from "@/stores/userProfile";
import { useState } from "react";
import { petSchema } from "@/server/validations/petsValidation";

const FormSchema = petSchema.omit({
  id: true,
  user_id: true,
});

const NewPetForm = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      species: "other",
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
      console.log("Error creating pet:", error);

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

  // Opciones para los selects
  const speciesOptions = [
    { value: "dog", label: "Perro" },
    { value: "cat", label: "Gato" },
    { value: "rabbit", label: "Conejo" },
    { value: "hamster", label: "Hámster" },
    { value: "turtle", label: "Tortuga" },
    { value: "bird", label: "Ave" },
    { value: "fish", label: "Pez" },
    { value: "guineaPig", label: "Cobaya" },
    { value: "ferret", label: "Hurón" },
    { value: "mouse", label: "Ratón" },
    { value: "chinchilla", label: "Chinchilla" },
    { value: "hedgehog", label: "Erizo" },
    { value: "snake", label: "Serpiente" },
    { value: "frog", label: "Rana" },
    { value: "lizard", label: "Lagarto" },
    { value: "other", label: "Otro" },
  ];

  const sexOptions = [
    { value: "male", label: "Macho" },
    { value: "female", label: "Hembra" },
    { value: "unknown", label: "Desconocido" },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Nombre <span className="text-red-500">(*)</span>
                </FormLabel>
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
                <FormLabel>
                  Tipo de mascota <span className="text-red-500">(*)</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un tipo de mascota" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {speciesOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>Foto de la mascota</FormLabel>
            <FormControl className="flex items-center justify-center">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className=" file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border-none"
              />
            </FormControl>
            {imagePreview && (
              <div className="flex items-center justify-center">
                <img
                  src={imagePreview}
                  alt="Vista previa"
                  className="w-16 h-16 object-cover rounded-lg border"
                />
              </div>
            )}
            <FormMessage />
          </FormItem>

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
            name="sex"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sexo</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el sexo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sexOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fixed"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-center space-x-3 space-y-0">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="mt-1"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>¿Está esterilizado?</FormLabel>
                </div>
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
