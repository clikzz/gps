"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { Plus, DollarSign, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useUpdateItem } from "@/hooks/marketplace/useUpdateItem"
import type { UserArticle } from "@/types/marketplace"
import { CATEGORY_OPTIONS, PET_OPTIONS, CONDITION_OPTIONS } from "@/types/marketplace"
import { getPetCategoryLabel, getItemCategoryLabel, getItemConditionLabel, getItemStatusLabel } from "@/types/translateLabels";
import LocationPicker, { LatLng } from "@/components/marketplace/LocationPicker"

interface EditArticleModalProps {
  article: UserArticle | null
  onClose: () => void
  onSaved: (updated: UserArticle) => void
}

export function EditArticleModal({ article, onClose, onSaved }: EditArticleModalProps) {
  const { updateItem, isUpdating } = useUpdateItem()
  const [form, setForm] = useState<UserArticle | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)

  useEffect(() => {
    if (article) {
      setForm(article)
    }
  }, [article])

  if (!article || !form) return null;

  const itemStatusLabel = getItemStatusLabel(article.status);

  const handleChange = <K extends keyof UserArticle>(key: K, value: UserArticle[K]) => {
    setForm(prev => prev ? ({ ...prev, [key]: value }) : null);
  };

  const handleSave = async () => {
    const { id, ...payload } = form!;
    const updated = await updateItem((id as string | number).toString(), payload);
    onSaved(updated as UserArticle);
    onClose();
  };

  return (
    <Dialog open={!!article} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar artículo</DialogTitle>
          <div className="flex gap-2 mt-2">
            <Badge>{itemStatusLabel}</Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={form.title ?? ""}
              onChange={e => handleChange('title', e.target.value)}
            />
          </div>

          {/* Price */}
          <div>
            <Label htmlFor="price">Precio</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4" />
              <Input
                id="price"
                type="number"
                value={form.price ?? 0}
                onChange={e => handleChange('price', Number(e.target.value))}
                className="pl-10"
              />
            </div>
          </div>

          {/* Pet Category */}
          <div>
            <Label>Tipo de mascota</Label>
            <Select
              value={form.pet_category!}
              onValueChange={v => handleChange('pet_category', v as any)}>
              <SelectTrigger><SelectValue/></SelectTrigger>
              <SelectContent>
                {PET_OPTIONS.map(o => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Article Category */}
          <div>
            <Label>Categoría</Label>
            <Select
              value={form.category!}
              onValueChange={v => handleChange('category', v as any)}>
              <SelectTrigger><SelectValue/></SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map(o => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Condition */}
          <div>
            <Label>Condición</Label>
            <Select
              value={form.condition!}
              onValueChange={v => handleChange('condition', v as any)}>
              <SelectTrigger><SelectValue/></SelectTrigger>
              <SelectContent>
                {CONDITION_OPTIONS.map(o => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location Picker */}
          <div>
            <Label>Ubicación</Label>
            <LocationPicker
              open={pickerOpen}
              initial={{ lat: form.latitude ?? 0, lng: form.longitude ?? 0 }}
              onSelect={coords => {
                handleChange('latitude', coords.lat)
                handleChange('longitude', coords.lng)
                setPickerOpen(false)
              }}
              onClose={() => setPickerOpen(false)}
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={form.description ?? ''}
              onChange={e => handleChange('description', e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose} disabled={isUpdating}>Cancelar</Button>
          <Button onClick={handleSave} disabled={isUpdating}>{isUpdating ? 'Guardando…' : 'Guardar cambios'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}