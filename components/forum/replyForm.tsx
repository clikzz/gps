"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface ReplyFormProps {
  topicId: number
}

export function ReplyForm({ topicId }: ReplyFormProps) {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cooldown, setCooldown] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!content.trim()) {
      setError("El mensaje no puede estar vacío.")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/forum/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          topicId,
          content: content.trim(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al enviar la respuesta")
      }

      setContent("")
      setCooldown(true)

      setTimeout(() => {
        setCooldown(false)
      }, 120000)

      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error al enviar la respuesta")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="border rounded-lg p-6">
      <h3 className="font-medium mb-4 text-lg">Responder al tema</h3>

      {error && <div className="border border-red-200 bg-red-50 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="Escribe tu respuesta aquí..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
          disabled={isSubmitting || cooldown}
          className="text-base resize-none"
        />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            {cooldown && "Podrás publicar otro mensaje en 10 segundos."}
          </div>
          <Button type="submit" disabled={isSubmitting || cooldown} className="w-full sm:w-auto">
            {isSubmitting ? "Enviando..." : "Enviar respuesta"}
          </Button>
        </div>
      </form>
    </div>
  )
}
