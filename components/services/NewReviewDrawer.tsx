"use client"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import NewReviewForm from "./NewReviewForm"
import { Star } from "lucide-react"

interface NewReviewDrawerProps {
  serviceId: string
  serviceName: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onReviewCreated: () => void
}

export function NewReviewDrawer({ serviceId, serviceName, open, onOpenChange, onReviewCreated }: NewReviewDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader className="flex flex-col items-center justify-center">
            <DrawerTitle className="text-center">Dejar Reseña</DrawerTitle>
            <DrawerDescription className="text-center">Comparte tu experiencia con {serviceName}</DrawerDescription>
          </DrawerHeader>
          <div className="overflow-y-auto max-h-[60vh] px-4">
            <NewReviewForm serviceId={serviceId} serviceName={serviceName} onReviewCreated={onReviewCreated} />
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline" className="w-full bg-transparent">
                Cancelar
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
