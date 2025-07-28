"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useUserProfile } from "@/stores/userProfile";
import { useActivePet } from "@/stores/activePet";
import useSWR from "swr";
import PetSelector from "@/components/PetSelector";
import { translateSpecies } from "@/utils/translateSpecies";
import { getRandomPhraseBySpecies } from "@/utils/petPhrases";
import LoadingScreen from "@/components/LoadingScreen";
import { Heart } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const setUser = useUserProfile((s) => s.setUser);
  const user = useUserProfile((s) => s.user);
  const activePet = useActivePet((s) => s.activePet);
  const resetActivePet = useActivePet((s) => s.resetActivePet);
  // para cambiar la frase tierna cada vez que activePet cambia
  const [currentCutePhrase, setCurrentCutePhrase] = useState("");

  const { data, error, isLoading } = useSWR("/api/profile", fetcher, {
    revalidateOnFocus: false,
  });

  useEffect(() => {
    if (data && !error) {
      setUser(data);
    }
  }, [data, error, setUser]);

  useEffect(() => {
    if (activePet) {
      setCurrentCutePhrase(getRandomPhraseBySpecies(activePet.species));
    }
  }, [activePet]);

  if (isLoading) {
    return (
      <LoadingScreen
        title="Cargando"
        subtext="Obteniendo página de inicio..."
        icon={Home}
        accentIcon={Heart}
      />
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        Error al cargar la página de inicio.
      </div>
    );
  }

  if (!activePet) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <PetSelector opened={true} />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 lg:p-12">
      <Card className="w-full max-w-4xl p-6 md:p-8 lg:p-10 shadow-lg">
        <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-0">
          <div className="flex justify-center lg:justify-start">
            {" "}
            <Image
              key={activePet.photo_url || "default-image"}
              src={
                activePet.photo_url || "/placeholder.svg?height=400&width=400"
              }
              width={400}
              height={400}
              alt={`Foto de ${activePet.name}`}
              className="rounded-lg object-cover shadow-md transition-all duration-500 ease-in-out"
            />
          </div>

          <div className="flex flex-col justify-center space-y-6 text-center lg:text-left">
            <h2 className="text-xl font-semibold text-muted-foreground">
              ¡Bienvenido de nuevo, {user?.name || "Usuario"}!
            </h2>
            <h1
              key={activePet.name}
              className="text-4xl md:text-5xl font-bold tracking-tight transition-all duration-500 ease-in-out"
            >
              Conoce a <span className="text-primary">{activePet.name}</span>
            </h1>
            <p
              key={activePet.species}
              className="text-lg md:text-xl text-muted-foreground transition-all duration-500 ease-in-out"
            >
              Es un{" "}
              <span className="font-medium">
                {translateSpecies(activePet.species)}
              </span>
              .
            </p>
            <p
              key={currentCutePhrase}
              className="text-xl md:text-2xl font-semibold italic transition-all duration-500 ease-in-out"
            >
              "{currentCutePhrase}"
            </p>
            {activePet.date_of_birth && (
              <p className="text-sm text-muted-foreground">
                Nacido el{" "}
                {new Date(activePet.date_of_birth).toLocaleDateString("es-ES")}
              </p>
            )}

            <div className="pt-4">
              <Button onClick={resetActivePet} className="px-8 py-3 text-lg">
                Cambiar Mascota
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
