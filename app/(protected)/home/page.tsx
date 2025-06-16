"use client";

import { useEffect } from "react";
import { useUserProfile } from "@/stores/userProfile";
import useSWR from "swr";
import PetSelector from "../../../components/home/PetSelector";
import { useActivePet } from "@/stores/activePet";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const setUser = useUserProfile((state) => state.setUser);
  const user = useUserProfile((state) => state.user);
  const activePet = useActivePet((state) => state.activePet);
  const resetActivePet = useActivePet((state) => state.resetActivePet);

  const { data, error, isLoading } = useSWR("/api/profile", fetcher, {
    revalidateOnFocus: false,
  });

  useEffect(() => {
    if (data && !error) {
      setUser(data);
    }
  }, [data, error, setUser]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading profile</div>;

  return (
    <div>
      <h2 className="font-bold text-2xl mb-4">Tus detalles de usuario</h2>
      <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
        {JSON.stringify(user, null, 2)}
      </pre>

      {activePet && (
        <div>
          <h2 className="font-bold text-2xl mb-4">Tu mascota activa</h2>
          <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
            {JSON.stringify(activePet, null, 2)}
          </pre>
        </div>
      )}

      {!activePet && <PetSelector />}

      <button onClick={resetActivePet}>Cambiar mascota</button>
    </div>
  );
}
