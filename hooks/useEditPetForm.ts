import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { useUserProfile } from "@/stores/userProfile";
import { petSchema } from "@/server/validations/pets.validation";
import { newPetFormSchema, type NewPetFormInput, type Pet } from "@/types/pet";

interface UseEditPetFormProps {
  onSuccess?: (pet: Pet) => void;
  uploadImage: () => Promise<{ url: string | null; error?: string }>;
  resetImage: () => void;
  pet: Pet;
}

export const useEditPetForm = ({
  onSuccess,
  uploadImage,
  resetImage,
  pet,
}: UseEditPetFormProps) => {
  const form = useForm({
    defaultValues: {
      id: pet.id,
      name: pet.name,
      species: pet.species,
      active: pet.active,
      date_of_adoption: pet.date_of_adoption
        ? pet.date_of_adoption instanceof Date
          ? pet.date_of_adoption
          : new Date(pet.date_of_adoption)
        : undefined,
      date_of_birth: pet.date_of_birth
        ? pet.date_of_birth instanceof Date
          ? pet.date_of_birth
          : new Date(pet.date_of_birth)
        : undefined,
      fixed: pet.fixed,
      sex: pet.sex,
      photo_url: pet.photo_url,
    } as NewPetFormInput,
    onSubmit: async ({ value }) => {
      await handleSubmit(value);
    },
    validators: {
      onChange: newPetFormSchema,
    },
  });

  const handleSubmit = async (values: NewPetFormInput) => {
    try {
      let photoUrl = values.photo_url || "";

      const { url: uploadedUrl, error } = await uploadImage();
      if (error) {
        return;
      }

      if (uploadedUrl) {
        photoUrl = uploadedUrl;
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
        active: values.active ?? true,
        fixed: values.fixed ?? false,
        is_lost: false,
      };

      const validatedData = petSchema.parse(formattedValues);

      const response = await fetch("/api/pets", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message || "Error al editar la mascota");
        return;
      }

      const newPet = (await response.json()) as Pet;

      await updateUserPets(newPet);

      form.reset();
      resetImage();

      toast.success("Mascota editada con éxito");
      onSuccess?.(newPet);
    } catch (error) {
      console.error("Error editing pet:", error);

      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Error inesperado al editar la mascota");
      }
    }
  };

  const updateUserPets = async (newPet: Pet) => {
    const user = useUserProfile.getState().user;

    if (!user) {
      toast.error("Usuario no encontrado");
      throw new Error("Usuario no encontrado");
    }

    const updatedUser = {
      ...user,
      pets: user.pets.map((pet) => (pet.id === newPet.id ? newPet : pet)),
    };

    useUserProfile.setState({ user: updatedUser });
  };

  return {
    form,
    isSubmitting: form.state.isSubmitting,
  };
};
