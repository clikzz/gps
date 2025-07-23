"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Heart, ChevronLeft, ChevronRight, Instagram, Phone, Mail } from "lucide-react";
import { getPetCategoryLabel, getItemCategoryLabel, getItemConditionLabel } from "@/types/translateLabels";
import type { Item } from "@/types/marketplace";
import { formatTimeAgo, formatPrice, extractYear } from "@/utils/format";

interface Props {
  item: Item;
  open: boolean;
  isFavorite: boolean;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
}

export function ProductDetailsDialog({ item, open, onClose, onToggleFavorite, isFavorite }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const petLabel = getPetCategoryLabel(item.pet_category);
  const categoryLabel = getItemCategoryLabel(item.category);
  const conditionLabel = getItemConditionLabel(item.condition);

  const prevImage = () => {
    setCurrentIndex((i) => Math.max(0, i - 1));
  };
  const nextImage = () => {
    setCurrentIndex((i) => Math.min(item.photo_urls.length - 1, i + 1));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{item.title}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Imagen */}
          <div className="space-y-3">
            <div className="relative">
              <Image
                src={item.photo_urls[currentIndex] || "/placeholder.svg"}
                alt={`${item.title} (${currentIndex + 1})`}
                width={400}
                height={400}
                className="w-full h-80 object-cover rounded-lg"
              />

              {/* Flechas de navegación */}
              {item.photo_urls.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80"
                    onClick={prevImage}
                    disabled={currentIndex === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80"
                    onClick={nextImage}
                    disabled={currentIndex === item.photo_urls.length - 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                    {currentIndex + 1} / {item.photo_urls.length}
                  </div>
                </>
              )}
            </div>

            {/* Miniaturas */}
            {item.photo_urls.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {item.photo_urls.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`
                      flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2
                      ${idx === currentIndex ? "border-primary" : "border-gray-200"}
                    `}
                  >
                    <Image
                      src={url}
                      alt={`Miniatura ${idx + 1}`}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Detalles */}
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-3xl font-bold text-primary">${formatPrice(item.price)}</p>
                <div className="flex gap-2 my-2">
                  <Badge variant="secondary">{petLabel}</Badge>
                  <Badge variant="outline">{categoryLabel}</Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onToggleFavorite(item.id)}
                  className="bg-background hover:bg-foreground/5"
                >
                <Heart
                  className={`h-4 w-4 transition-colors
                    ${isFavorite 
                      ? "text-secondary fill-secondary"
                      : "text-primary hover:text-secondary"
                    }`}
                />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {item.city ?? item.region ?? item.country}
              </div>
              <div>
                {formatTimeAgo(item.created_at)}
              </div>
            </div>

            {item.description && (
              <section>
                <h3 className="font-semibold mb-1">Descripción</h3>
                <p className="text-muted-foreground">{item.description}</p>
                <Badge variant="outline" className="mt-2">{conditionLabel}</Badge>
              </section>
            )}

            <section className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Vendedor</h3>

              {/* Header del vendedor */}
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={item.seller.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback className="text-lg">{item.seller.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <h4 className="font-semibold text-lg">{item.seller.name}</h4>
                  <p className="text-sm text-muted-foreground">Miembro desde {extractYear(item.seller.created_at)}</p>
                </div>
              </div>

              {/* Información de contacto */}
              <div className="mb-4">
                <h5 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Contacto</h5>

                <div className="grid grid-cols-1 mt-2">
                  {/* Email */}
                  <div className="flex items-center gap-3 rounded-lg">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full">
                      <Mail className="w-4 h-4 text-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.seller.email}</p>
                    </div>
                  </div>

                  {/* Teléfono */}
                  {item.seller.phone && (
                    <div className="flex items-center gap-3 rounded-lg">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full">
                        <Phone className="w-4 h-4 text-foreground" />
                      </div>
                      <div className="flex-1">
                      <p className="text-sm font-medium">{item.seller.phone}</p>
                    </div>
                  </div>
                  )}

                  {/* Instagram */}
                  {item.seller.instagram && (
                    <div className="flex items-center gap-3 rounded-lg">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full">
                        <Instagram className="w-4 h-4 text-foreground" />
                      </div>
                      <div className="flex-1">
                        <a href={`https://instagram.com/${item.seller.instagram.replace(/^@/, "")}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium">
                          {item.seller.instagram.replace(/^@/, "")}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}