"use client";

import { useState, useEffect, useCallback } from "react";
import type { UserArticle } from "@/types/marketplace";

export function useUserArticles() {
  const [articles, setArticles] = useState<UserArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const [actRes, soldRes] = await Promise.all([
        fetch("/api/marketplace?mode=user"),
        fetch("/api/marketplace?mode=sold"),
      ]);
      const act  = await actRes.json() as UserArticle[];
      const sold = await soldRes.json() as UserArticle[];
      setArticles([...act, ...sold]);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

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

  return { articles, setArticles, loading, error, markAsSold, fetchArticles };
}