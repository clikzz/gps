import React from "react";
import { FieldApi } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormFieldWrapperProps {
  children: React.ReactNode;
  label: string;
  required?: boolean;
  error?: string;
}

export const FormFieldWrapper: React.FC<FormFieldWrapperProps> = ({
  children,
  label,
  required = false,
  error,
}) => (
  <div className="space-y-2">
    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {children}
    {error && <p className="text-sm font-medium text-destructive">{error}</p>}
  </div>
);

interface TextFieldProps {
  field: FieldApi<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >;
  label: string;
  placeholder?: string;
  required?: boolean;
  type?: "text" | "number";
}

export const TextField: React.FC<TextFieldProps> = ({
  field,
  label,
  placeholder,
  required = false,
  type = "text",
}) => {
  const errorMessage =
    Array.isArray(field.state.meta.errors) && field.state.meta.errors.length > 0
      ? typeof field.state.meta.errors[0] === "object" &&
        field.state.meta.errors[0] !== null
        ? (field.state.meta.errors[0] as { message?: string }).message
        : (field.state.meta.errors[0] as string)
      : undefined;

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
  );
};

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  field: FieldApi<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >;
  label: string;
  placeholder?: string;
  options: SelectOption[];
  required?: boolean;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  field,
  label,
  placeholder,
  options,
  required = false,
}) => {
  const errorMessage =
    Array.isArray(field.state.meta.errors) && field.state.meta.errors.length > 0
      ? typeof field.state.meta.errors[0] === "object" &&
        field.state.meta.errors[0] !== null
        ? (field.state.meta.errors[0] as { message?: string }).message
        : (field.state.meta.errors[0] as string)
      : undefined;

  return (
    <FormFieldWrapper label={label} required={required} error={errorMessage}>
      <Select
        value={field.state.value ?? ""}
        onValueChange={field.handleChange}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormFieldWrapper>
  );
};

// Opciones para categorías de servicios
export const CATEGORY_OPTIONS: SelectOption[] = [
  { value: "veterinaria", label: "Veterinaria" },
  { value: "peluqueria", label: "Peluquería" },
  { value: "tienda", label: "Tienda de mascotas" },
  { value: "guarderia", label: "Guardería" },
  { value: "adiestramiento", label: "Centro de adiestramiento" },
  { value: "adopcion", label: "Centro de adopción" },
  { value: "otro", label: "Otro" },
];
