"use client";

import { useState, useEffect, useCallback } from "react";
import type { UserArticle } from "@/types/marketplace";

export function useUserArticles() {
  const [articles, setArticles] = useState<UserArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/marketplace?mode=user").then(r => r.json() as Promise<UserArticle[]>),
      fetch("/api/marketplace?mode=sold").then(r => r.json() as Promise<UserArticle[]>),
    ]).then(([act, sold]) => {
      setArticles([...act, ...sold]);
      setLoading(false);
    })
    .catch(e => setError((e as Error).message))
    .finally(() => setLoading(false));
  }, []);

  const markAsSold = useCallback(
    async (id: number, sold_price: number, sold_at: string, notes?: string) => {
      const res = await fetch(`/api/marketplace?mode=sold&id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sold_price: sold_price.toString(), sold_at: sold_at, notes }),
      });
      if (!res.ok) {
        throw new Error(`Error ${res.status}`);
      }
      setArticles((prev) =>
        prev.map((a) =>
          a.id === id
            ? { ...a, status: "SOLD", sold_price, sold_at, notes }
            : a
        )
      );
    },
    []
  );

  return { articles, loading, error, markAsSold };
}