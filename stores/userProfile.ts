import { create } from "zustand";
import { Pet } from "@/types/pet";
import { Role } from ".prisma/client/default";
import { UserStatus } from ".prisma/client/default";

type PhotoLog = { id: string; url: string };
type Forum = { id: string; title: string };
export type Badge = { id: string; label: string; icon: string; description: string; key?: string };
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
};

type UserProfileStore = {
  user: UserProfile | null;
  setUser: (user: UserProfile) => void;
  updateUserField: <K extends keyof UserProfile>(
    key: K,
    value: UserProfile[K]
  ) => void;
  resetUser: () => void;
  setSelectedBadges: (ids: string[]) => void;
  clearUserStorage: () => void;
};

const createUserProfileStore = () => create<UserProfileStore>()(
  (set, get) => {
    const sortPets = (pets: Pet[]): Pet[] => {
      return [...pets].sort((a, b) => {
        if (a.active === false && b.active !== false) return 1;
        if (a.active !== false && b.active === false) return -1;
        return 0;
      });
    };

    const saveUserToStorage = (user: UserProfile) => {
      try {
        localStorage.setItem(
          `user-profile-storage-${user.id}`,
          JSON.stringify({ user })
        );
      } catch (error) {
        console.error('Error saving user to storage:', error);
      }
    };

    const removeUserFromStorage = (userId: string) => {
      try {
        localStorage.removeItem(`user-profile-storage-${userId}`);
      } catch (error) {
        console.error('Error removing user from storage:', error);
      }
    };

    return {
      user: null,

      setUser: (user) => {
        const sortedUser = user.Pets
          ? { ...user, Pets: sortPets(user.Pets) }
          : user;
        const currentUser = get().user;
        if (currentUser && currentUser.id !== user.id) {
          removeUserFromStorage(currentUser.id);
        }

        set({ user: sortedUser });
        saveUserToStorage(sortedUser);
      },

      updateUserField: (key, value) =>
        set((state) => {
          if (!state.user) return {};

          const updatedUser = key === "Pets"
            ? { ...state.user, Pets: sortPets(value as Pet[]) }
            : { ...state.user, [key]: value };

          saveUserToStorage(updatedUser);
          return { user: updatedUser };
        }),

      resetUser: () => {
        const currentUser = get().user;
        if (currentUser) {
          removeUserFromStorage(currentUser.id);
        }
        set({ user: null });
      },

      setSelectedBadges: (ids: string[]) =>
        set((state) => {
          if (!state.user) return {};

          const updatedUser = {
            ...state.user,
            selectedBadgeIds: ids,
          };

          saveUserToStorage(updatedUser);
          return { user: updatedUser };
        }),

      clearUserStorage: () => {
        const currentUser = get().user;
        if (currentUser) {
          removeUserFromStorage(currentUser.id);
        }
      },
    };
  }
);

export const useUserProfile = createUserProfileStore();
export const loadUserFromStorage = (userId: string) => {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(`user-profile-storage-${userId}`);
    if (stored) {
      const data = JSON.parse(stored);
      return data.user;
    }
  } catch (error) {
    console.error('Error loading user from storage:', error);
  }
  return null;
};

export const clearAllUserStorages = () => {
  if (typeof window === 'undefined') return;

  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('user-profile-storage-')) {
      localStorage.removeItem(key);
    }
  });
};

export const useSelectedBadges = () => {
  const user = useUserProfile(state => state.user);
  if (!user) return [];

  const badgesToSearch = user.unlockedBadges || user.badges || [];

  return (user.selectedBadgeIds || [])
    .map(id => badgesToSearch.find(badge => badge.id === id))
    .filter((badge): badge is NonNullable<typeof badge> => badge !== undefined)
    .slice(0, 3);
};
