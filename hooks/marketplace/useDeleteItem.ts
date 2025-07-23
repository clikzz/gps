"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";

export function useDeleteItem() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string|null>(null);

  const deleteItem = useCallback(async (id: number) => {
    setIsDeleting(true);
    setError(null);
    const res = await fetch(`/api/marketplace?mode=delete&id=${id}`, { method: "DELETE" });
    if (!res.ok) {
      const { error: msg } = await res.json();
      throw new Error(msg || `Error ${res.status}`);
    }
    toast.success("Artículo eliminado");
  }, []);

  return { deleteItem, isDeleting, error };
}