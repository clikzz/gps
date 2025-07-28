"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Menu,
  MoreHorizontal,
  HelpCircle,
  PawPrint,
  Clock,
  Search,
  HeartPulse,
  MessageSquare,
  Store
} from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger, 
} from "@/components/ui/dropdown-menu";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetTitle, 
} from "@/components/ui/sheet";
import { ProfileDropdown } from "./profile/ProfileDropdown";
import { ThemeSwitcher } from "./theme-switcher";
import { signOutAction } from "@/app/actions";
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

interface ProtectedNavbarProps {
  user: SupabaseUser | null;
  userProfile: UserProfile | null;
}

export default function ProtectedNavbar({ 
  user, 
  userProfile 
}: ProtectedNavbarProps) {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("home");
  const [isMoreActive, setIsMoreActive] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const mainNavItems = [
    { id: "home", label: "Home", icon: Home, href: "/home" },
    { id: "pets", label: "Mascotas", icon: PawPrint, href: "/pets" },
    { id: "timeline", label: "Timeline", icon: Clock, href: "/timeline" },
  ];

  const moreNavItems = [
    { id: "forum", label: "Foro", icon: MessageSquare, href: "/forum" },
    { id: "find", label: "Encontrar", icon: Search, href: "/find" },
    { id: "services", label: "Servicios", icon: HelpCircle, href: "/services" },
    { id: "health", label: "Salud", icon: HeartPulse, href: "/health" },
    { id: "marketplace", label: "Marketplace", icon: Store, href: "/marketplace" },
  ];

  useEffect(() => {
    let foundMain = false
    for (const item of mainNavItems) {
      if (pathname.startsWith(item.href)) {
        setActiveTab(item.id)
        setIsMoreActive(false)
        foundMain = true
        break
      }
    }

    if (!foundMain) {
      let foundMore = false
      for (const item of moreNavItems) {
        if (pathname.startsWith(item.href)) {
          setActiveTab("") 
          setIsMoreActive(true)
          foundMore = true
          break
        }
      }
      if (!foundMore) {
        setActiveTab("") 
        setIsMoreActive(false)
      }
    }
  }, [pathname, mainNavItems, moreNavItems]) 

  const handleSignOut = async () => {
    setIsSigningOut(true);
    useUserProfile.getState().clearStorage();
    useActivePet.getState().clearStorage();

    await signOutAction();
  };

  const AuthSection = () => {
    if (!user) {
      return (
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <Button asChild size="sm" variant="outline">
            <Link href="/sign-in">Iniciar sesión</Link>
          </Button>
          <Button asChild size="sm" variant="default">
            <Link href="/sign-up">Registrarse</Link>
          </Button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <ThemeSwitcher />
        <ProfileDropdown 
          user={user} 
          userProfile={userProfile} 
          onSignOut={handleSignOut} 
          />
      </div>
    );
  };

  const MobileAuthSection = () => {
    if (!user) {
      return (
        <div className="space-y-3 pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Tema</span>
            <ThemeSwitcher />
          </div>
          <Button 
            asChild 
            size="sm" 
            variant="outline" 
            className="w-full bg-transparent"
            >
            <Link href="/sign-in">Iniciar sesión</Link>
          </Button>
          <Button asChild size="sm" variant="default" className="w-full">
            <Link href="/sign-up">Registrarse</Link>
          </Button>
        </div>
      );
    }

    return (
      <div className="pt-4 border-t space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Tema</span>
          <ThemeSwitcher />
        </div>
        <Link href="/profile" className="block">
          <div className="flex items-center gap-3 p-2 hover:bg-muted rounded-md transition-colors cursor-pointer">
            <Avatar className="w-8 h-8">
              <AvatarImage src={userProfile?.avatar_url || ""} alt={userProfile?.name || "Usuario"} />
              <AvatarFallback>
                {userProfile?.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {userProfile?.name || "Usuario"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </div>
        </Link>
        <Button 
          size="sm" 
          variant="outline" 
          className="w-full bg-transparent" 
          onClick={handleSignOut}
          >
          Cerrar sesión
        </Button>
      </div>
    );
  };

  return (
    <>
      <nav className="hidden md:flex items-center justify-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="flex items-center">
            <Link href="/home" className="text-xl font-bold">
              Mi App
            </Link>
          </div>

          <div className="flex items-center space-x-1">
            {mainNavItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                size="sm"
                asChild
              >
                <Link href={item.href} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </Button>
            ))}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={isMoreActive ? "default" : "ghost"} 
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <MoreHorizontal className="h-4 w-4" />
                  Más
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {moreNavItems.map((item) => (
                  <DropdownMenuItem key={item.id} asChild>
                    <Link
                      href={item.href}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="flex items-center">
            <AuthSection />
          </div>
        </div>
      </nav>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="flex items-center justify-around p-2">
          {mainNavItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              size="sm"
              asChild
              className="flex flex-col gap-1 h-auto py-2 px-3"
            >
              <Link href={item.href}>
                <item.icon className="h-5 w-5" />
                <span className="text-xs">{item.label}</span>
              </Link>
            </Button>
          ))}
          
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant={isMoreActive ? "default" : "ghost"} 
                size="sm"
                className="flex flex-col gap-1 h-auto py-2 px-3"
              >
                <Menu className="h-5 w-5" />
                <span className="text-xs">Más</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-auto">
              <SheetTitle>Más opciones</SheetTitle>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  {moreNavItems.map((item) => (
                    <Button
                      key={item.id}
                      variant={pathname.startsWith(item.href) ? "default" : "ghost"} 
                      asChild
                      className="justify-start gap-3 h-12"
                    >
                      <Link href={item.href}>
                        <item.icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    </Button>
                  ))}
                </div>

                <MobileAuthSection />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </>
  );
}
