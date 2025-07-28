"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { reverseGeocode } from "@/utils/geocode";
import { updateItemSchema } from "@/server/validations/marketplace.validation";
import type { EditableItem, UpdateItemPayload } from "@/types/marketplace";

export function useUpdateItem() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateItem = useCallback(
    async (
      id: string | number,
      data: UpdateItemPayload
    ): Promise<EditableItem> => {
      setIsUpdating(true);
      setError(null);

      let payload = { ...data };
      if (payload.latitude != null && payload.longitude != null) {
        const { city, region, country } = await reverseGeocode(
          payload.latitude,
          payload.longitude
        );
        payload = { ...payload, city, region, country };
      }

      const parsed = updateItemSchema.safeParse({
        id: String(id),
        ...payload,
      });
      if (!parsed.success) {
        const msg = parsed.error.errors.map((e) => e.message).join(", ");
        toast.error(msg);
        throw new Error(msg);
      }

      const res = await fetch(
        `/api/marketplace?mode=update&id=${encodeURIComponent(String(id))}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const body = await res.json();
      if (!res.ok) {
        throw new Error(body?.error || `Error ${res.status}`);
      }

      const updated: EditableItem = {
        id: String(id),
        status: body.status,
        ...payload,
        updated_at: new Date(body.updated_at),
      };

      toast.success("Artículo actualizado correctamente");
      return updated;
    },
    []
  );

  return { updateItem, isUpdating, error };
}
