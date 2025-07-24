import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Pet } from "@/types/pet";
import { Role } from ".prisma/client/default";
import { UserStatus } from ".prisma/client/default";

type PhotoLog = { id: string; url: string };
type Forum = { id: string; title: string };
export type Badge = {
  id: string;
  label: string;
  icon: string;
  description: string;
};
type Review = { id: string; content: string };
type LostPet = { id: string; name: string };
type MarketplaceItem = { id: string; title: string };

export type UserProfile = {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  name?: string;
  avatar_url?: string;
  tag?: string;
  Pets: Pet[];
  photoLogs: PhotoLog[];
  forums: Forum[];
  badges: Badge[];
  unlockedBadges?: Badge[];
  lockedBadges?: Badge[];
  reviews: Review[];
  lostPets: LostPet[];
  marketplaceItems: MarketplaceItem[];
  role: Role;
  status: UserStatus;
  menssageCount: number;
  selectedBadgeIds: string[];
  instagram?: string;
  phone?: string;
};

type UserProfileStore = {
  user: UserProfile | null;
  setUser: (user: UserProfile) => void;
  updateUserField: <K extends keyof UserProfile>(
    key: K,
    value: UserProfile[K]
  ) => void;
  resetUser: () => void;
  clearStorage: () => void;

  setSelectedBadges: (ids: string[]) => void;
};

const createUserProfileStore = () => create<UserProfileStore>()(
  persist(
    (set) => {
      const sortPets = (pets: Pet[]): Pet[] => {
        return [...pets].sort((a, b) => {
          if (a.active === false && b.active !== false) return 1;
          if (a.active !== false && b.active === false) return -1;
          return 0;
        });
      };

      return {
        user: null,

        setUser: (user) => {
          const sortedUser = user.Pets
            ? { ...user, Pets: sortPets(user.Pets) }
            : user;

          set({ user: sortedUser });
        },

        updateUserField: (key, value) =>
          set((state) => {
            if (!state.user) return {};

            if (key === "Pets") {
              return {
                user: { ...state.user, Pets: sortPets(value as Pet[]) },
              };
            }

            return {
              user: {
                ...state.user,
                [key]: value,
              },
            };
          }),

        resetUser: () => set({ user: null }),

        clearStorage: () => {
          set({ user: null });
          localStorage.removeItem("user-profile-storage");
          setTimeout(() => {
            localStorage.removeItem("user-profile-storage");
          }, 50);
        },

        setSelectedBadges: (ids: string[]) =>
          set((state) => {
            if (!state.user) return {};
            return {
              user: {
                ...state.user,
                selectedBadgeIds: ids,
              },
            };
          }),
      };
    },
    {
      name: "user-profile-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);

export const useUserProfile = createUserProfileStore();

export const useSelectedBadges = () => {
  const user = useUserProfile(state => state.user);
  if (!user) return [];

  const badgesToSearch = user.unlockedBadges || user.badges || [];

  return (user.selectedBadgeIds || [])
    .map(id => badgesToSearch.find((badge: Badge) => badge.id === id))
    .filter((badge): badge is NonNullable<typeof badge> => badge !== undefined)
    .slice(0, 3);
};
