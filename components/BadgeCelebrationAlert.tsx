"use client"

import { useEffect, useState } from "react"
import { Trophy, Star, Sparkles, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BadgeCelebrationAlertProps {
  isVisible: boolean
  badgeTitle: string
  badgeDescription: string
  badgeImage?: string
  onClose: () => void
}

export default function BadgeCelebrationAlert({
  isVisible,
  badgeTitle,
  badgeDescription,
  badgeImage,
  onClose,
}: BadgeCelebrationAlertProps) {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setShowContent(true), 100)

      const autoCloseTimer = setTimeout(() => {
        handleClose()
      }, 5000)

      return () => {
        clearTimeout(timer)
        clearTimeout(autoCloseTimer)
      }
    } else {
      setShowContent(false)
    }
  }, [isVisible])

  const handleClose = () => {
    setShowContent(false)
    setTimeout(() => onClose(), 300)
  }

  if (!isVisible) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-all duration-300 ${
        showContent ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute animate-bounce text-primary ${
              i % 4 === 0 ? "text-2xl" : i % 4 === 1 ? "text-xl" : i % 4 === 2 ? "text-lg" : "text-base"
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random() * 2}s`,
            }}
          >
            {i % 3 === 0 ? "✨" : i % 3 === 1 ? "🎉" : "⭐"}
          </div>
        ))}
      </div>

      <div
        className={`relative bg-background border rounded-3xl p-8 max-w-md w-full mx-4 text-center shadow-2xl transform transition-all duration-500 ${
          showContent ? "scale-100 rotate-0" : "scale-50 rotate-12"
        }`}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="absolute inset-0 rounded-3xl bg-primary/10 animate-pulse" />
        <div className="relative z-10">
          <div className="mb-6">
            <div className="flex justify-center items-center gap-2 mb-2">
              <Sparkles className="h-6 w-6 text-primary animate-spin" />
              <h1 className="text-2xl font-bold text-primary">¡FELICIDADES!</h1>
              <Sparkles className="h-6 w-6 text-primary animate-spin" style={{ animationDirection: "reverse" }} />
            </div>
            <p className="text-lg font-semibold text-foreground">¡Ganaste una insignia!</p>
          </div>

          <div className="mb-6 relative">
            <div className="w-32 h-32 mx-auto relative">
              <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping" />
              <div className="absolute inset-2 rounded-full border-2 border-primary/40 animate-pulse" />
              <div className="relative w-full h-full bg-secondary rounded-full flex items-center justify-center shadow-2xl transform animate-bounce">
                {badgeImage ? (
                  <img src={badgeImage || "/placeholder.svg"} alt={badgeTitle} className="w-20 h-20 object-contain" />
                ) : (
                  <Trophy className="h-16 w-16 text-primary-foreground drop-shadow-lg" />
                )}
              </div>
              <Star className="absolute -top-2 -right-2 h-6 w-6 text-primary animate-spin" />
              <Star
                className="absolute -bottom-2 -left-2 h-4 w-4 text-primary/80 animate-spin"
                style={{ animationDirection: "reverse" }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">{badgeTitle}</h2>
            <p className="text-muted-foreground">{badgeDescription}</p>
          </div>
          <div className="mt-6">
            <div className="w-full bg-muted rounded-full h-1 overflow-hidden">
              <div
                className="h-full bg-primary rounded-full animate-pulse"
                style={{
                  animation: "shrink 5s linear forwards",
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Se cerrará automáticamente</p>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  )
}
