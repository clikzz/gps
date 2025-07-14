"use client"

import type React from "react"
import type { FieldApi } from "@tanstack/react-form"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"

interface FormFieldWrapperProps {
  children: React.ReactNode
  label: string
  required?: boolean
  error?: string
}

export const FormFieldWrapper: React.FC<FormFieldWrapperProps> = ({ children, label, required = false, error }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {children}
    {error && <p className="text-sm font-medium text-destructive">{error}</p>}
  </div>
)

interface StarRatingFieldProps {
  field: FieldApi<any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any>
  label: string
  required?: boolean
}

export const StarRatingField: React.FC<StarRatingFieldProps> = ({ field, label, required = false }) => {
  const errorMessage =
    Array.isArray(field.state.meta.errors) && field.state.meta.errors.length > 0
      ? typeof field.state.meta.errors[0] === "object" && field.state.meta.errors[0] !== null
        ? (field.state.meta.errors[0] as { message?: string }).message
        : (field.state.meta.errors[0] as string)
      : undefined

  const rating = field.state.value || 0

  return (
    <FormFieldWrapper label={label} required={required} error={errorMessage}>
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-8 h-8 cursor-pointer transition-colors ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-yellow-300"
            }`}
            onClick={() => field.handleChange(star)}
          />
        ))}
      </div>
      {rating > 0 && (
        <p className="text-sm text-gray-600 mt-1">
          {rating} de 5 estrella{rating !== 1 ? "s" : ""}
        </p>
      )}
    </FormFieldWrapper>
  )
}

interface TextAreaFieldProps {
  field: FieldApi<any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any>
  label: string
  placeholder?: string
  required?: boolean
  maxLength?: number
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
  field,
  label,
  placeholder,
  required = false,
  maxLength = 500,
}) => {
  const errorMessage =
    Array.isArray(field.state.meta.errors) && field.state.meta.errors.length > 0
      ? typeof field.state.meta.errors[0] === "object" && field.state.meta.errors[0] !== null
        ? (field.state.meta.errors[0] as { message?: string }).message
        : (field.state.meta.errors[0] as string)
      : undefined

  const currentLength = field.state.value?.length || 0

  return (
    <FormFieldWrapper label={label} required={required} error={errorMessage}>
      <Textarea
        placeholder={placeholder}
        onChange={(e) => field.handleChange(e.target.value)}
        value={field.state.value || ""}
        onBlur={field.handleBlur}
        maxLength={maxLength}
        rows={4}
      />
      <p className="text-xs text-gray-500 mt-1">
        {currentLength}/{maxLength} caracteres
      </p>
    </FormFieldWrapper>
  )
}
