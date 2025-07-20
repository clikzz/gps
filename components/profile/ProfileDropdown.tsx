"use client";

import Link from "next/link";
import { LogOut, Settings, User } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOutAction } from "@/app/actions";
import { ProfilePreview } from "./ProfilePreview";
import { useUserProfile } from "@/stores/userProfile";
import { useActivePet } from "@/stores/activePet";

interface UserProfile {
  id: string;
  name: string | null;
  avatar_url: string | null;
  email: string;
  public_id: string | null;
  menssageCount: number;
  role: string;
}

interface ProfileDropdownProps {
  user: SupabaseUser;
  userProfile: UserProfile | null;
  onSignOut?: () => Promise<void>;
}

export function ProfileDropdown({
  user,
  userProfile,
  onSignOut,
}: ProfileDropdownProps) {
  const displayName = userProfile?.name || "Usuario";
  const displayEmail = user.email || "";
  const avatarUrl = userProfile?.avatar_url;
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { setUser, user: currentUser, updateUserField } = useUserProfile();

  useEffect(() => {
    if (isSigningOut || !user) return;

    if (userProfile && (!currentUser || currentUser.id !== userProfile.id)) {
      if (!currentUser) {
        setUser({
          id: userProfile.id,
          email: userProfile.email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          name: userProfile.name || undefined,
          avatar_url: userProfile.avatar_url || undefined,
          tag: userProfile.public_id || undefined,
          Pets: [],
          photoLogs: [],
          forums: [],
          badges: [],
          reviews: [],
          lostPets: [],
          marketplaceItems: [],
          role: "USER" as any,
          status: "ACTIVE" as any,
          menssageCount: userProfile.menssageCount,
          selectedBadgeIds: [],
        });
      } else {
        updateUserField("name", userProfile.name || undefined);
        updateUserField("avatar_url", userProfile.avatar_url || undefined);
        updateUserField("tag", userProfile.public_id || undefined);
        updateUserField("menssageCount", userProfile.menssageCount);
      }
    }
  }, [
    userProfile,
    setUser,
    updateUserField,
    currentUser?.id,
    isSigningOut,
    user,
  ]);

  const handleViewProfile = () => setIsPreviewOpen(true);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    if (onSignOut) {
      await onSignOut();
    } else {
      useUserProfile.getState().clearStorage();
      useActivePet.getState().clearStorage();
      await signOutAction();
    }
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={avatarUrl || ""} alt={displayName} />
              <AvatarFallback>
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{displayName}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {displayEmail}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleViewProfile}
            className="flex items-center cursor-pointer"
          >
            <User className="mr-2 h-4 w-4" />
            <span>Ver Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/profile" className="flex items-center cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Configuración</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isPreviewOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsPreviewOpen(false)}
            />
            <div className="relative z-10 w-full max-w-2xl">
              <ProfilePreview onClose={() => setIsPreviewOpen(false)} />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
