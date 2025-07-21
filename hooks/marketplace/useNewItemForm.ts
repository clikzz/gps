"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { reverseGeocode } from "@/utils/geocode"
import { createItemSchema, type CreateItemInput } from "@/server/validations/marketplace.validation"
import { useImageUpload } from "@/hooks/marketplace/useItemImageUpload"
import { useEffect, useRef } from "react"

export function useNewItemForm(
  onSuccess?: () => void,
  initialData?: CreateItemInput,
  repostId?: number | null
) {
  const imageUpload = useImageUpload()

  const form = useForm<CreateItemInput>({
    resolver: zodResolver(createItemSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "FOOD",
      condition: "NEW",
      price: 0,
      photo_urls: [],
      latitude: 0,
      longitude: 0,
      city: undefined,
      region: undefined,
      country: undefined,
    },
  })

  const { reset } = form;
  const lastRepostId = useRef<number | null>(null);

  useEffect(() => {
    if (
      initialData != null &&
      repostId != null &&
      repostId !== lastRepostId.current
    ) {
      reset(initialData);
      imageUpload.resetImage();
      form.setValue("photo_urls", initialData.photo_urls);
      lastRepostId.current = repostId;
    }
  }, [initialData, repostId, reset, imageUpload]);

  const onSubmit = form.handleSubmit(async (value) => {
    console.log("Submitting new item:", value)
    try {
      const up = await imageUpload.uploadImages()
      if (up.error) {
        toast.error(up.error)
        return
      }
      if (up.urls.length > 0) {
        value.photo_urls = up.urls
      } else {
        const existing = form.getValues("photo_urls")
        value.photo_urls = Array.isArray(existing) ? existing : []
      }

      const { city, region, country } = await reverseGeocode(
        value.latitude,
        value.longitude
      )
      value.city = city
      value.region = region
      value.country = country

      const res = await fetch("/api/marketplace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Error al publicar")
      }

      toast.success("Artículo publicado")
      form.reset()
      imageUpload.resetImage()
      onSuccess?.()
    } catch (e: any) {
      toast.error(e.message || "Error inesperado")
    }
  })

  return {
    form,
    onSubmit,
    isSubmitting: form.formState.isSubmitting || imageUpload.isUploading,
    imageUpload,
    resetForm: reset,
  }
}