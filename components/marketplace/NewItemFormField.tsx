"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"
import type { SelectOption } from "@/types/marketplace"

interface FormFieldWrapperProps {
  children: React.ReactNode
  label: string
  required?: boolean
  error?: string
}
const FormFieldWrapper: React.FC<FormFieldWrapperProps> = ({
  children, label, required = false, error,
}) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium">
      {label}{required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && <p className="text-sm text-destructive">{error}</p>}
  </div>
)

interface TextFieldProps {
  label: string
  placeholder?: string
  required?: boolean
  error?: string
  // los props que react-hook-form inyecta vía Controller
  value?: any
  onChange?: (...args: any[]) => void
  onBlur?: () => void
  type?: "text" | "number"
}
export const TextField: React.FC<TextFieldProps> = ({
  label, placeholder, required, error,
  value, onChange, onBlur, type = "text",
}) => (
  <FormFieldWrapper label={label} required={required} error={error}>
    <Input
      type={type}
      placeholder={placeholder}
      value={value ?? ""}
      onChange={(e) =>
        onChange?.(type === "number" ? parseFloat(e.target.value) : e.target.value)
      }
      onBlur={onBlur}
    />
  </FormFieldWrapper>
)

interface SelectFieldProps {
  label: string
  options: SelectOption[]
  required?: boolean
  error?: string
  value?: string
  onChange?: (v: string) => void
}
export const SelectField: React.FC<SelectFieldProps> = ({
  label, options, required, error, value, onChange,
}) => (
  <FormFieldWrapper label={label} required={required} error={error}>
    <Select value={value ?? ""} onValueChange={onChange}>
      <SelectTrigger><SelectValue placeholder="Selecciona…" /></SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  </FormFieldWrapper>
)

interface ImageUploadFieldProps {
  label: string
  imagePreview: string | null
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
}
export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label, imagePreview, onFileChange, error,
}) => (
  <FormFieldWrapper label={label} error={error}>
    <input
      type="file"
      accept="image/*"
      multiple
      onChange={onFileChange}
      className="file:rounded file:border file:px-2"
    />
    {imagePreview && (
      <img
        src={imagePreview!}
        alt="Preview"
        className="mt-2 h-24 w-24 object-cover rounded"
      />
    )}
  </FormFieldWrapper>
)