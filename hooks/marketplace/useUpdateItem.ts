"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { updateItemSchema } from "@/server/validations/marketplace.validation"
import type { EditableItem } from "@/types/marketplace";

export function useUpdateItem() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateItem = useCallback(
    async (id: string, data: Partial<EditableItem>): Promise<EditableItem> => { 
      setIsUpdating(true);
      setError(null);

      try {
        const res = await fetch(
          `/api/marketplace?mode=update&id=${encodeURIComponent(id)}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }
        );
        const body = await res.json().catch(() => null);

        if (!res.ok) {
          const msg = body?.message || `Error ${res.status}`;
          throw new Error(msg);
        }

        const updated: EditableItem = {
          ...body,
          created_at: body.created_at,
          updated_at: body.updated_at,
        };

        toast.success("Artículo actualizado correctamente");
        return updated;
      } catch (e: any) {
        const msg = e.message || "Error actualizando el artículo";
        setError(msg);
        toast.error(msg);
        throw e;
      } finally {
        setIsUpdating(false);
      }
    },
    []
  );

  return { updateItem, isUpdating, error };
}