"use client";

import { useState, useEffect, useMemo } from "react";
import type { Item } from "@/types/marketplace";

export function useMarketplace() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [city, setCity] = useState("all");
  const [petCats, setPetCats] = useState<string[]>([]);
  const [artCats, setArtCats] = useState<string[]>([]);
  const [condition, setCondition] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [sortBy, setSortBy] = useState<"recent" | "price-low" | "price-high" | "name">("recent");

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch("/api/marketplace?mode=public")
      .then((r) => r.json())
      .then((data: Item[]) => setItems(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredAndSorted = useMemo(() => {
    const filtered = items.filter((p) => {
      if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (city !== "all" && p.city !== city) return false;
      if (petCats.length && !petCats.includes(p.category)) return false;
      if (artCats.length && !artCats.includes(p.category)) return false;
      const price = Number(p.price);
      if (price < priceRange[0] || price > priceRange[1]) return false;
      if (condition && p.condition !== condition) return false;
      return true;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
          return a.title.localeCompare(b.title);
        case "recent":
        default:
          return 0;
      }
    });
  }, [items, search, city, petCats, artCats, priceRange, condition, sortBy]);

  const clearFilters = () => {
    setSearch("");
    setCity("all");
    setPetCats([]);
    setArtCats([]);
    setPriceRange([0, 100000]);
    setCondition("");
    setSortBy("recent");
  };

  return {
    items: filteredAndSorted,
    loading,
    error,
    filters: { search, city, petCats, artCats, priceRange, condition, sortBy },
    setters: { setSearch, setCity, setPetCats, setArtCats, setPriceRange, setCondition, setSortBy },
    clearFilters,
  };
}