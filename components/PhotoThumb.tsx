"use client"

import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"

interface PhotoThumbProps {
  url: string
  onRemove: (url: string) => void
  alt?: string
  size?: number
}

export default function PhotoThumb({
  url,
  onRemove,
  alt = "foto",
  size = 80,
}: PhotoThumbProps) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <img
        src={url}
        alt={alt}
        className="w-full h-full object-cover rounded"
      />
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="absolute -top-2 -right-2 bg-white/70"
        onClick={() => onRemove(url)}
      >
        <Trash className="w-4 h-4" />
      </Button>
    </div>
  )
}