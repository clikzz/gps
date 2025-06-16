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
import type { SelectOption } from "@/types/pet";

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
  type?: "text" | "date";
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

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      if (value === "") {
        field.handleChange(null);
      }

      const date = new Date(value);
      field.handleChange(isNaN(date.getTime()) ? null : date);
    } else {
      field.handleChange(null);
    }
  };

  const inputValue =
    field.state.value instanceof Date
      ? field.state.value.toISOString().split("T")[0]
      : field.state.value || "";

  return (
    <FormFieldWrapper label={label} required={required} error={errorMessage}>
      <Input
        type={type}
        placeholder={placeholder}
        onChange={
          type === "date"
            ? handleDateChange
            : (e) => field.handleChange(e.target.value)
        }
        value={inputValue}
        onBlur={field.handleBlur}
      />
    </FormFieldWrapper>
  );
};

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

interface CheckboxFieldProps {
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
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  field,
  label,
}) => {
  const errorMessage =
    Array.isArray(field.state.meta.errors) && field.state.meta.errors.length > 0
      ? typeof field.state.meta.errors[0] === "object" &&
        field.state.meta.errors[0] !== null
        ? (field.state.meta.errors[0] as { message?: string }).message
        : (field.state.meta.errors[0] as string)
      : undefined;

  return (
    <FormFieldWrapper label="" error={errorMessage}>
      <div className="flex flex-row items-center justify-center space-x-3 space-y-0">
        <input
          type="checkbox"
          checked={field.state.value ?? false}
          onChange={(e) => field.handleChange(e.target.checked)}
          onBlur={field.handleBlur}
          className="mt-1"
        />
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      </div>
    </FormFieldWrapper>
  );
};

interface ImageUploadFieldProps {
  label: string;
  imagePreview: string | null;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  imagePreview,
  onFileChange,
  error,
}) => (
  <FormFieldWrapper label={label} error={error}>
    <div className="flex items-center justify-center">
      <Input
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className="file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border-none"
      />
    </div>
    {imagePreview && (
      <div className="flex items-center justify-center">
        <img
          src={imagePreview}
          alt="Vista previa"
          className="w-16 h-16 object-cover rounded-lg border"
        />
      </div>
    )}
  </FormFieldWrapper>
);
