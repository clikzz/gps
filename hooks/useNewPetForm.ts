import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { useUserProfile } from "@/stores/userProfile";
import { petSchema } from "@/server/validations/pets.validation";
import { newPetFormSchema, type NewPetFormInput, type Pet } from "@/types/pet";

interface UseNewPetFormProps {
  onSuccess?: (pet: Pet) => void;
  uploadImage: () => Promise<{ url: string | null; error?: string }>;
  resetImage: () => void;
}

export const useNewPetForm = ({
  onSuccess,
  uploadImage,
  resetImage,
}: UseNewPetFormProps) => {
  const form = useForm({
    defaultValues: {
      name: "",
      species: "other",
      active: true,
      date_of_adoption: undefined,
      date_of_birth: undefined,
      fixed: false,
      sex: "unknown",
      photo_url: "",
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
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) {
        console.log(response);

        const error = await response.json();
        console.log("Error creating pet:", error);

        toast.error(error.error || "Error al crear la mascota");
        return;
      }

      const newPet = (await response.json()) as Pet;

      await updateUserPets(newPet);

      form.reset();
      resetImage();

      toast.success("Mascota creada con éxito");
      onSuccess?.(newPet);
    } catch (error) {
      console.error("Error creating pet:", error);

      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Error inesperado al crear la mascota");
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
      Pets: [...user.Pets, newPet],
    };

    useUserProfile.setState({ user: updatedUser });
  };

  return {
    form,
    isSubmitting: form.state.isSubmitting,
  };
};
