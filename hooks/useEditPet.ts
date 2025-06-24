import { useUserProfile } from "@/stores/userProfile";
import { useActivePet } from "@/stores/activePet";
import { toast } from "sonner";
import { Pet } from "@/types/pet";

export const handleDeletePhoto = async (pet: Pet) => {
  const user = useUserProfile.getState().user;
  try {
    const response = await fetch(`/api/upload/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: pet.photo_url,
      }),
    });

    if (!response.ok) {
      toast.error("Error al eliminar la foto de la mascota");
      return;
    }
    const responseDB = await fetch(`/api/pets`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...pet,
        photo_url: null,
      }),
    });
    if (!responseDB.ok) {
      toast.error("Error al actualizar la mascota después de eliminar la foto");
      return;
    }
    const updatedPet = await responseDB.json();
    if (user) {
      const updatedPets = user.Pets.map((p) =>
        p.id === pet.id ? updatedPet : p
      );
      useUserProfile.getState().setUser({ ...user, Pets: updatedPets });
    }
    pet.photo_url = null;
    toast.success("Foto de la mascota eliminada correctamente");
  } catch (error) {
    toast.error("Error al eliminar la foto de la mascota");
  }
};

export const handleSoftDelete = async (pet: Pet) => {
  const user = useUserProfile.getState().user;
  if (!user) {
    return;
  }
  try {
    const response = await fetch(`/api/pets?id=${pet.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const updatedPets = user.Pets.filter((p) => p.id !== pet.id);
      useUserProfile.getState().setUser({ ...user, Pets: updatedPets });
      if (useActivePet.getState().activePet?.id === pet.id) {
        const activePet = updatedPets[0];
        if (!activePet) {
          useActivePet.getState().resetActivePet();
          return;
        }
      }
      toast.success("Mascota eliminada correctamente");
    } else {
      toast.error("Error al eliminar la mascota");
    }
  } catch (error) {
    toast.error("Error al eliminar la mascota");
  }
};

export const handleDisablePet = async (pet: Pet) => {
  const user = useUserProfile.getState().user;
  if (!user) {
    toast.error("Usuario no autenticado");
    return;
  }
  try {
    const response = await fetch(`/api/pets`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...pet,
        active: false,
      }),
    });

    if (response.ok) {
      const updatedPet = await response.json();
      const updatedPets = user.Pets.map((p) =>
        p.id === pet.id ? updatedPet : p
      );
      useUserProfile.getState().setUser({ ...user, Pets: updatedPets });
      toast.success("Mascota deshabilitada correctamente");
    } else {
      toast.error("Error al deshabilitar la mascota");
    }
  } catch (error) {
    toast.error("Error al deshabilitar la mascota");
  }
};

export const handleEnablePet = async (pet: Pet) => {
  const user = useUserProfile.getState().user;
  if (!user) {
    toast.error("Usuario no autenticado");
    return;
  }
  try {
    const response = await fetch(`/api/pets`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...pet,
        active: true,
      }),
    });

    if (response.ok) {
      const updatedPet = await response.json();
      const updatedPets = user.Pets.map((p) =>
        p.id === pet.id ? updatedPet : p
      );
      useUserProfile.getState().setUser({ ...user, Pets: updatedPets });
      toast.success("Mascota habilitada correctamente");
    } else {
      toast.error("Error al habilitar la mascota");
    }
  } catch (error) {
    toast.error("Error al habilitar la mascota");
  }
};
