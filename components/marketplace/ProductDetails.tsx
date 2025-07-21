"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { getPetCategoryLabel, getItemCategoryLabel, getItemConditionLabel } from "@/types/translateLabels";
import type { Item } from "@/types/marketplace";
import { formatTimeAgo } from "@/utils/formatTime";

interface Props {
  item: Item;
  open: boolean;
  onClose: () => void;
  onToggleFav: (id: string) => void;
}

export function ProductDetailsDialog({ item, open, onClose, onToggleFav }: Props) {
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
          <div className="space-y-4">
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
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-3xl font-bold text-primary">${item.price.toLocaleString()}</p>
                <div className="flex gap-2 my-2">
                  <Badge variant="secondary">{petLabel}</Badge>
                  <Badge variant="outline">{categoryLabel}</Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onToggleFav(item.id)}
                >
                  <Heart className={`h-4 w-4 ${/* fav para despues */ ""}`} />
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
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={item.seller.avatar_url} alt={item.seller.name} />
                  <AvatarFallback>{item.seller.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{item.seller.name}</p>
                  <p className="text-sm text-muted-foreground">{item.seller.email}</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}