"use client";

import { useState, useEffect } from "react";

export function useMarketplaceCities() {
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/marketplace?mode=cities")
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data: { cities: string[] } | string[]) => {
        setCities(Array.isArray(data) ? data : data.cities);
      })
      .catch((err) => {
        console.error(err);
        setError("No se pudieron cargar las ciudades");
      })
      .finally(() => setLoading(false));
  }, []);

  return { cities, loading, error };
}