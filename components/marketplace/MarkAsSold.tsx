"use client";

import { useState, useEffect } from "react";
import { DollarSign, Calendar } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input }  from "@/components/ui/input";
import { Label }  from "@/components/ui/label";
import { Textarea }from "@/components/ui/textarea";
import {
  Select, SelectTrigger, SelectValue,
  SelectContent, SelectItem
} from "@/components/ui/select";
import type { UserArticle } from "@/types/marketplace";

interface Props {
  article: UserArticle | null;
  onClose:  () => void;
  onConfirm: (
    articleId: number,
    soldPrice: number,
    soldDate: string,
    notes?: string
  ) => void;
}

export function MarkAsSoldModal({ article, onClose, onConfirm }: Props) {
  const [soldPrice, setSoldPrice] = useState("");
  const [soldDate,  setSoldDate]  = useState<"today"|"yesterday"|"custom">("today");
  const [customDate, setCustomDate] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (article) {
      setSoldPrice(article.price.toString());
      setSoldDate("today");
      setCustomDate("");
      setNotes("");
    }
  }, [article]);

  if (!article) return null;

  const handleClose = () => {
    onClose();
  };

  const handleConfirm = async () => {
    if (!soldPrice || isNaN(+soldPrice)) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    let finalDate = soldDate === "custom" ? customDate :
                    soldDate === "today"  ? new Date().toISOString() :
                    soldDate === "yesterday"
                      ? new Date(Date.now() - 864e5).toISOString()
                      : new Date().toISOString();
    onConfirm(article.id, +soldPrice, finalDate, notes);
    setIsLoading(false);
    onClose();
  };

  return (
    <Dialog open={!!article} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Marcar como vendido</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* info producto */}
          <div className="p-3 rounded-lg bg-muted/20">
            <h4 className="font-medium text-sm mb-1">{article.title}</h4>
            <p className="text-sm text-muted-foreground">
              Precio original: ${article.price.toLocaleString()}
            </p>
          </div>
          {/* precio venta */}
          <div className="space-y-2">
            <Label htmlFor="sold-price">Precio de venta *</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="sold-price" type="number" placeholder="0"
                className="pl-10"
                value={soldPrice}
                onChange={e => setSoldPrice(e.target.value)}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Ingresa el precio final por el que vendiste el producto
            </p>
          </div>
          {/* fecha venta */}
          <div className="space-y-2">
            <Label>Fecha de venta *</Label>
            <Select value={soldDate} onValueChange={v => setSoldDate(v as any)}>
              <SelectTrigger><SelectValue/></SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hoy</SelectItem>
                <SelectItem value="yesterday">Ayer</SelectItem>
                <SelectItem value="custom">Fecha personalizada</SelectItem>
              </SelectContent>
            </Select>
            {soldDate === "custom" && (
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date" className="pl-10"
                  value={customDate}
                  onChange={e => setCustomDate(e.target.value)}
                />
              </div>
            )}
          </div>
          {/* notas */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea
              id="notes" rows={3} placeholder="Ej: Entregado en persona..."
              value={notes} onChange={e => setNotes(e.target.value)}
            />
          </div>
          {/* resumen ganancia */}
          {soldPrice && !isNaN(+soldPrice) && (
            <div className="p-3 rounded-lg border">
              <div className="flex justify-between items-center">
                <span className={`text-sm font-medium ${
                    +soldPrice >= article.price ? "text-primary" : "text-secondary"
                  }`}>Diferencia:</span>
                <span className={`text-sm font-bold ${
                    +soldPrice >= article.price ? "text-primary" : "text-secondary"
                  }`}>
                  {(+soldPrice - article.price >= 0 ? "+" : "-")}
                  ${Math.abs(+soldPrice - article.price).toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!soldPrice || isNaN(+soldPrice) || isLoading}
            variant="default"
          >
            {isLoading ? "Guardando..." : "Marcar como vendido"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
