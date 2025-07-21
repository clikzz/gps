"use client";

import { useState, useEffect } from "react";
import type { PetCategory } from "@prisma/client";

export function useMarketplacePetCategories() {
  const [categories, setCategories] = useState<PetCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        const res = await fetch("/api/marketplace?mode=pet-categories", {
          signal: ctrl.signal,
        });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const json = await res.json();
        const arr = Array.isArray(json.categories) ? json.categories : [];
        setCategories(arr);
      } catch (err: any) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, []);

  return { categories, loading, error } as const;
}