"use client";

import { useState, useEffect } from "react";

export function useMarketplaceCities() {
  const [locations, setLocations] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/marketplace?mode=cities")
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data: { locations: Record<string, string[]> }) => {
        setLocations(data.locations);
      })
      .catch((err) => {
        console.error(err);
        setError("No se pudieron cargar las ubicaciones.");
      })
      .finally(() => setLoading(false));
  }, []);

  return { locations, loading, error };
}