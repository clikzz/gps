"use client"

import React from "react"
import type { FieldApi } from "@tanstack/react-form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import PhoneInput from "@/components/ui/phone-input"

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

interface TextFieldProps {
  field: FieldApi<any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any>
  label: string
  placeholder?: string
  required?: boolean
  type?: "text" | "number" | "tel"
}

export const TextField: React.FC<TextFieldProps> = ({ field, label, placeholder, required = false, type = "text" }) => {
  const errorMessage =
    Array.isArray(field.state.meta.errors) && field.state.meta.errors.length > 0
      ? typeof field.state.meta.errors[0] === "object" && field.state.meta.errors[0] !== null
        ? (field.state.meta.errors[0] as { message?: string }).message
        : (field.state.meta.errors[0] as string)
      : undefined

  return (
    <FormFieldWrapper label={label} required={required} error={errorMessage}>
      <Input
        type={type}
        placeholder={placeholder}
        onChange={(e) => field.handleChange(e.target.value)}
        value={field.state.value || ""}
        onBlur={field.handleBlur}
        step={type === "number" ? "any" : undefined}
      />
    </FormFieldWrapper>
  )
}

interface PhoneFieldProps {
  field: FieldApi<any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any>
  label: string
  placeholder?: string
  required?: boolean
}

export const PhoneField: React.FC<PhoneFieldProps> = ({ field, label, placeholder = "Número de teléfono", required = false }) => {
  const errorMessage =
    Array.isArray(field.state.meta.errors) && field.state.meta.errors.length > 0
      ? typeof field.state.meta.errors[0] === "object" && field.state.meta.errors[0] !== null
        ? (field.state.meta.errors[0] as { message?: string }).message
        : (field.state.meta.errors[0] as string)
      : undefined

  return (
    <FormFieldWrapper label={label} required={required} error={errorMessage}>
      <PhoneInput
        value={field.state.value || ""}
        onChange={field.handleChange}
        placeholder={placeholder}
        required={required}
      />
    </FormFieldWrapper>
  )
}

interface SelectOption {
  value: string
  label: string
  emoji?: string
}

interface SelectFieldProps {
  field: FieldApi<any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any>
  label: string
  placeholder?: string
  options: SelectOption[]
  required?: boolean
}

export const SelectField: React.FC<SelectFieldProps> = ({ field, label, placeholder, options, required = false }) => {
  const errorMessage =
    Array.isArray(field.state.meta.errors) && field.state.meta.errors.length > 0
      ? typeof field.state.meta.errors[0] === "object" && field.state.meta.errors[0] !== null
        ? (field.state.meta.errors[0] as { message?: string }).message
        : (field.state.meta.errors[0] as string)
      : undefined

  return (
    <FormFieldWrapper label={label} required={required} error={errorMessage}>
      <Select value={field.state.value ?? ""} onValueChange={field.handleChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className="cursor-pointer hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary transition-colors duration-200"
            >
              <div className="flex items-center space-x-2">
                {option.emoji && <span>{option.emoji}</span>}
                <span>{option.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormFieldWrapper>
  )
}

interface MultiSelectFieldProps {
  field: FieldApi<any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any>
  label: string
  placeholder?: string
  options: SelectOption[]
  required?: boolean
  maxSelections?: number
}

export const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
  field,
  label,
  placeholder = "Selecciona categorías...",
  options,
  required = false,
  maxSelections = 3,
}) => {
  const selectedValues = field.state.value || []

  const errorMessage =
    Array.isArray(field.state.meta.errors) && field.state.meta.errors.length > 0
      ? typeof field.state.meta.errors[0] === "object" && field.state.meta.errors[0] !== null
        ? (field.state.meta.errors[0] as { message?: string }).message
        : (field.state.meta.errors[0] as string)
      : undefined

  const toggleCategory = (value: string) => {
    const isSelected = selectedValues.includes(value)

    if (isSelected) {
      field.handleChange(selectedValues.filter((v: string) => v !== value))
    } else {
      if (selectedValues.length < maxSelections) {
        field.handleChange([...selectedValues, value])
      }
    }
  }

  const removeCategory = (value: string) => {
    field.handleChange(selectedValues.filter((v: string) => v !== value))
  }

  const availableOptions = options.filter((option) => !selectedValues.includes(option.value))

  return (
    <FormFieldWrapper label={label} required={required} error={errorMessage}>
      <div className="space-y-3">
        {/* Categorías seleccionadas */}
        {selectedValues.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedValues.map((value: string) => {
              const option = options.find((opt) => opt.value === value)
              return (
                <Badge
                  key={value}
                  variant="secondary"
                  className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors duration-200"
                >
                  {option?.emoji && <span className="text-sm">{option.emoji}</span>}
                  <span className="text-sm font-medium">{option?.label}</span>
                  <button
                    type="button"
                    onClick={() => removeCategory(value)}
                    className="ml-1 hover:bg-primary/30 rounded-full w-4 h-4 flex items-center justify-center transition-colors duration-200"
                    title="Eliminar categoría"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )
            })}
          </div>
        )}

        {/* Selector para agregar más categorías */}
        {selectedValues.length < maxSelections && availableOptions.length > 0 && (
          <div className="relative">
            <Select
              onValueChange={(value) => {
                toggleCategory(value)
              }}
              value=""
            >
              <SelectTrigger className="border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">
                    {selectedValues.length === 0
                      ? placeholder
                      : `Agregar categoría (${selectedValues.length}/${maxSelections})`}
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent>
                {availableOptions.map((option) => (
                  <SelectItem 
                    key={option.value} 
                    value={option.value}
                    className="cursor-pointer hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-2">
                      {option.emoji && <span>{option.emoji}</span>}
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Información de estado */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            {selectedValues.length === 0
              ? "Selecciona al menos una categoría"
              : `${selectedValues.length} de ${maxSelections} categorías seleccionadas`}
          </span>
          {selectedValues.length === maxSelections && (
            <span className="text-gray-600 font-medium">Máximo alcanzado</span>
          )}
        </div>
      </div>
    </FormFieldWrapper>
  )
}
