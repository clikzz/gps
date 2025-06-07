"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface NewTopicFormProps {
  subforumSlug: string
  subforumId: number
}

export function NewTopicForm({ subforumSlug, subforumId }: NewTopicFormProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!title.trim() || !content.trim()) {
      setError("Todos los campos son obligatorios.")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/forum/topics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          subforumId,
          title: title.trim(),
          content: content.trim(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al crear el tema")
      }

      router.push(`/forum/subforum/${subforumSlug}`)
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error al crear el tema")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="border border-red-200 bg-red-50 text-red-700 px-4 py-3 rounded">{error}</div>}

      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          placeholder="Título de tu tema"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSubmitting}
          className="text-base"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Contenido</Label>
        <Textarea
          id="content"
          placeholder="Escribe el contenido de tu tema aquí..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={12}
          disabled={isSubmitting}
          className="text-base resize-none"
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/forum/subforum/${subforumSlug}`)}
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? "Creando..." : "Crear tema"}
        </Button>
      </div>
    </form>
  )
}
