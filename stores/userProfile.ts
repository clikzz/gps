import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Pet } from "@/types/pet";

type PhotoLog = { id: string; url: string };
type Forum = { id: string; title: string };
type Badge = { id: string; label: string };
type Review = { id: string; content: string };
type LostPet = { id: string; name: string };
type MarketplaceItem = { id: string; title: string };

type UserProfile = {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  name?: string;
  avatar_url?: string;
  Pets: Pet[];
  photoLogs: PhotoLog[];
  forums: Forum[];
  badges: Badge[];
  reviews: Review[];
  lostPets: LostPet[];
  marketplaceItems: MarketplaceItem[];
};

type UserProfileStore = {
  user: UserProfile | null;
  setUser: (user: UserProfile) => void;
  updateUserField: <K extends keyof UserProfile>(
    key: K,
    value: UserProfile[K]
  ) => void;
  resetUser: () => void;
};

export const useUserProfile = create<UserProfileStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      updateUserField: (key, value) =>
        set((state) =>
          state.user ? { user: { ...state.user, [key]: value } } : {}
        ),
      resetUser: () => set({ user: null }),
    }),
    {
      name: "user-profile-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
