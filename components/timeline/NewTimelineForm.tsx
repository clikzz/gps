"use client"

import React, { useState, useRef, useMemo, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useMilestones } from "@/hooks/timeline/useMilestones"
import { useTimelineImageUpload } from "@/hooks/timeline/useTimelineImageUpload"
import { useNewTimelineEntry } from "@/hooks/timeline/useNewTimelineEntry"
import { useUpdateTimelineEntry } from "@/hooks/timeline/useUpdateTimelineEntry"
import type { TimelineEntryWithPhotos } from "@/types/timeline"
import { FormFieldWrapper, TextField, DateField, TextAreaField } from "@/components/timeline/NewTimelineFormField"
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core"
import { SortableContext, useSortable, arrayMove, rectSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { MapPin, Heart, Calendar, Users, Gift } from "lucide-react"

function FileField({
  label,
  onChange,
  multiple = false,
  accept,
  error,
  selectedCount = 0,
  maxFiles = 5,
}: {
  label: string
  onChange: (files: FileList | null) => void
  multiple?: boolean
  accept?: string
  error?: string
  selectedCount?: number
  maxFiles?: number
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isOpening, setIsOpening] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOpening(false)
    onChange(e.target.files)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isOpening) return
    setIsOpening(true)
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.click()
      }
      setTimeout(() => setIsOpening(false), 1000)
    }, 50)
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">{label}</label>
      <div className="relative">
        <input
          ref={inputRef}
          type="file"
          onChange={handleFileChange}
          multiple={multiple}
          accept={accept}
          className="sr-only"
          onClick={(e) => e.stopPropagation()}
        />
        <button
          type="button"
          onClick={handleButtonClick}
          disabled={isOpening}
          className={cn(
            "flex items-center justify-center w-full px-4 py-2 border border-input rounded-md cursor-pointer transition-colors",
            "hover:bg-accent hover:text-accent-foreground",
            "focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-destructive",
          )}
        >
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="text-primary font-medium">
              {isOpening
                ? "Abriendo..."
                : selectedCount > 0
                  ? `${selectedCount} archivo${selectedCount !== 1 ? "s" : ""} seleccionado${selectedCount !== 1 ? "s" : ""}`
                  : "Elegir archivos"}
            </span>
            <span className="text-muted-foreground text-sm">
              ({selectedCount}/{maxFiles})
            </span>
          </div>
        </button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

const SortablePhoto = React.memo(function SortablePhoto({
  id,
  file,
  index,
  onRemove,
}: {
  id: string
  file: File
  index: number
  onRemove: (idx: number) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: "100%",
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="relative">
      <img
        src={URL.createObjectURL(file) || "/placeholder.svg"}
        alt={`Foto ${index + 1}`}
        className="w-full h-20 object-cover rounded border"
      />
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => onRemove(index)}
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
      >
        ×
      </button>
    </div>
  )
})

function MilestoneSection({
  title,
  icon: Icon,
  milestones,
  selectedMilestones,
  onToggleMilestone,
  maxSelections,
}: {
  title: string
  icon: React.ComponentType<{ className?: string }>
  milestones: Array<{ id: string; name: string }>
  selectedMilestones: string[]
  onToggleMilestone: (id: string) => void
  maxSelections: number
}) {
  if (milestones.length === 0) return null

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
      </div>
      <div className="flex flex-wrap gap-2">
        {milestones.map((milestone) => {
          const isSelected = selectedMilestones.includes(milestone.id)
          const canSelect = isSelected || selectedMilestones.length < maxSelections

          return (
            <button
              key={milestone.id}
              type="button"
              onClick={() => canSelect && onToggleMilestone(milestone.id)}
              disabled={!canSelect}
              className={cn(
                "px-3 py-2 text-sm border rounded-lg transition-all duration-200",
                "hover:shadow-sm focus:ring-2 focus:ring-ring focus:ring-offset-1",
                isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : canSelect
                    ? "bg-background border-input hover:bg-accent hover:text-accent-foreground"
                    : "bg-muted text-muted-foreground border-muted cursor-not-allowed opacity-60",
              )}
            >
              {milestone.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}

interface NewTimelineFormProps {
  petId: string
  onSuccess?: () => void
  mode?: "create" | "edit"
  initialValues?: TimelineEntryWithPhotos
  submitButtonText?: string
}

export default function NewTimelineForm({
  petId,
  onSuccess,
  mode = "create",
  initialValues,
  submitButtonText,
}: NewTimelineFormProps) {
  function getTodayLocalISO() {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const day = String(now.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  function parseEventDateToLocal(input: string | Date): string {
    if (typeof input === "string") {
      const [y, m, d] = input.split("T")[0].split("-").map(Number)
      const localDate = new Date(y, m - 1, d)
      const year = localDate.getFullYear()
      const month = String(localDate.getMonth() + 1).padStart(2, "0")
      const day = String(localDate.getDate()).padStart(2, "0")
      return `${year}-${month}-${day}`
    } else {
      const year = input.getFullYear()
      const month = String(input.getMonth() + 1).padStart(2, "0")
      const day = String(input.getDate()).padStart(2, "0")
      return `${year}-${month}-${day}`
    }
  }

  const today = getTodayLocalISO()
  const isEditMode = mode === "edit"

  const { milestones } = useMilestones()
  const { isUploading, uploadTimelinePhotos } = useTimelineImageUpload()
  const { isSubmitting: isCreating, createEntry } = useNewTimelineEntry(petId)
  const { isSubmitting: isUpdating, updateEntry } = useUpdateTimelineEntry(petId)

  const formRef = useRef<HTMLFormElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [eventDate, setEventDate] = useState(today)
  const [selectedMilestones, setSelectedMilestones] = useState<string[]>([])
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([])
  const [errors, setErrors] = useState<{
    title?: string
    description?: string
    photos?: string
  }>({})

  const TITLE_MAX = 50
  const DESC_MAX = 200
  const PHOTOS_MAX = 5
  const MAX_MILESTONES = 4

  const sensors = useSensors(useSensor(PointerSensor))
  const isSubmitting = isCreating || isUpdating
  const photoIds = useMemo(() => selectedPhotos.map((f) => `${f.name}-${f.lastModified}`), [selectedPhotos])

  const milestonesSections = useMemo(() => {
    if (!milestones || milestones.length === 0) return []


    const sections = [
      {
        title: "Lugares",
        icon: MapPin,
        milestoneIds: ["1", "2", "3", "4", "5"],
      },
      {
        title: "Cuidado y Salud",
        icon: Heart,
        milestoneIds: ["6", "7", "8", "9"],
      },
      {
        title: "Celebraciones y Fechas",
        icon: Calendar,
        milestoneIds: ["10", "11", "12", "13", "14", "15"], 
      },
      {
        title: "Personas y Relaciones",
        icon: Users,
        milestoneIds: ["16", "17"], 
      },
      {
        title: "Objetos, Logros y Novedades",
        icon: Gift,
        milestoneIds: ["18", "19", "20"], 
      },
    ]

    return sections.map((section) => ({
      ...section,
      milestones: section.milestoneIds
        .map((id) => milestones.find((m) => m.id === id))
        .filter((milestone) => milestone !== undefined) 
        .map((milestone) => milestone!), 
    }))
  }, [milestones])

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (over && active.id !== over.id) {
        const oldIndex = photoIds.indexOf(active.id as string)
        const newIndex = photoIds.indexOf(over.id as string)
        setSelectedPhotos((photos) => arrayMove(photos, oldIndex, newIndex))
      }
    },
    [photoIds],
  )

  const toggleMilestone = (id: string) =>
    setSelectedMilestones((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < MAX_MILESTONES ? [...prev, id] : prev,
    )

  const handleFileChange = (files: FileList | null) => {
    if (!files) {
      setSelectedPhotos([])
      return
    }
    const picked = Array.from(files).slice(0, PHOTOS_MAX)
    setSelectedPhotos(picked)
  }

  const handleRemovePhoto = useCallback((idx: number) => {
    setSelectedPhotos((prev) => prev.filter((_, i) => i !== idx))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (!title.trim()) {
      setErrors({ title: "El título es obligatorio." })
      formRef.current?.scrollIntoView({ behavior: "smooth" })
      return
    }

    if (!description.trim() && selectedPhotos.length === 0 && !isEditMode) {
      setErrors({ description: "Agrega una descripción o al menos una foto." })
      formRef.current?.scrollIntoView({ behavior: "smooth" })
      return
    }

    const localDate = new Date(eventDate + "T00:00:00")
    const utcDateString = new Date(
      Date.UTC(localDate.getFullYear(), localDate.getMonth(), localDate.getDate()),
    ).toISOString()

    try {
      if (isEditMode && initialValues) {
        await updateEntry({
          entryId: initialValues.id,
          title: title.trim(),
          description: description.trim() || undefined,
          eventDate: utcDateString,
          photos: selectedPhotos.length > 0 ? (selectedPhotos as unknown as FileList) : undefined,
          milestoneIds: selectedMilestones,
        })
      } else {
        await createEntry({
          title: title.trim(),
          description: description.trim() || undefined,
          eventDate: utcDateString,
          photos: selectedPhotos as unknown as FileList,
          milestoneIds: selectedMilestones,
        })
      }

      onSuccess?.()
      if (!isEditMode) {
        setTitle("")
        setDescription("")
        setEventDate(today)
        setSelectedMilestones([])
        setSelectedPhotos([])
      }
      setErrors({})
    } catch (error) {
      console.error("Error al guardar:", error)
    }
  }

  useEffect(() => {
    if (isEditMode && initialValues) {
      setTitle(initialValues.title ?? "")
      setDescription(initialValues.description ?? "")
      const localDateString = parseEventDateToLocal(initialValues.event_date)
      setEventDate(localDateString)
      setSelectedMilestones(initialValues.Milestones?.map((m) => m.id) ?? [])
      setSelectedPhotos([])
    }
  }, [isEditMode, initialValues])

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      <div className="relative">
        <TextField
          label="Título"
          value={title}
          onChange={(v) => {
            if (v.length <= TITLE_MAX) setTitle(v)
          }}
          placeholder="Ej: Primer paseo"
          error={errors.title}
        />
        <p className="absolute top-2 right-2 text-xs text-muted-foreground">
          {title.length}/{TITLE_MAX}
        </p>
      </div>

      <DateField label="Fecha del evento" value={eventDate} onChange={setEventDate} max={today} />

      <div className="relative">
        <TextAreaField
          label="Descripción"
          value={description}
          onChange={(v) => {
            if (v.length <= DESC_MAX) setDescription(v)
          }}
          placeholder="Describe este momento..."
          error={errors.description}
        />
        <p className="absolute top-2 right-2 text-xs text-muted-foreground">
          {description.length}/{DESC_MAX}
        </p>
      </div>

      {!isEditMode && (
        <>
          <div className="relative">
            <FileField
              label="Fotos (máx. 5)"
              onChange={handleFileChange}
              multiple
              accept="image/jpeg, image/png"
              error={errors.photos}
              selectedCount={selectedPhotos.length}
              maxFiles={PHOTOS_MAX}
            />
            <p className="absolute top-2 right-2 text-xs text-muted-foreground">
              {selectedPhotos.length}/{PHOTOS_MAX}
            </p>
          </div>

          {selectedPhotos.length > 0 && (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={photoIds} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                  {selectedPhotos.map((file, idx) => (
                    <SortablePhoto
                      key={photoIds[idx]}
                      id={photoIds[idx]}
                      file={file}
                      index={idx}
                      onRemove={handleRemovePhoto}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </>
      )}

      <FormFieldWrapper label={`Hitos (máx. ${MAX_MILESTONES})`}>
        <div className="space-y-4 mt-2">
          {selectedMilestones.length > 0 && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-2">
                Seleccionados ({selectedMilestones.length}/{MAX_MILESTONES}):
              </p>
              <div className="flex flex-wrap gap-1">
                {selectedMilestones.map((id) => {
                  const milestone = milestones.find((m) => m.id === id)
                  return milestone ? (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground text-xs rounded-md"
                    >
                      {milestone.name}
                      <button
                        type="button"
                        onClick={() => toggleMilestone(id)}
                        className="hover:bg-primary-foreground/20 rounded-full p-0.5"
                      >
                        ×
                      </button>
                    </span>
                  ) : null
                })}
              </div>
            </div>
          )}

          {milestonesSections.map((section) => (
            <MilestoneSection
              key={section.title}
              title={section.title}
              icon={section.icon}
              milestones={section.milestones}
              selectedMilestones={selectedMilestones}
              onToggleMilestone={toggleMilestone}
              maxSelections={MAX_MILESTONES}
            />
          ))}
        </div>
      </FormFieldWrapper>

      <Button type="submit" className="w-full mt-6" disabled={isSubmitting || isUploading}>
        {isUploading
          ? "Subiendo fotos..."
          : isSubmitting
            ? isEditMode
              ? "Guardando cambios..."
              : "Guardando..."
            : isEditMode
              ? "Guardar cambios"
              : "Guardar Recuerdo"}
      </Button>
    </form>
  )
}
