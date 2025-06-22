"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Calendar from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";

// Wrapper que muestra label, children y posible error
interface FormFieldWrapperProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}
export const FormFieldWrapper: React.FC<FormFieldWrapperProps> = ({
  label,
  required = false,
  error,
  children,
}) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && <p className="text-xs text-destructive">{error}</p>}
  </div>
);

// Campo de texto sencillo
interface TextFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}
export const TextField: React.FC<TextFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  required,
  error,
}) => (
  <FormFieldWrapper label={label} required={required} error={error}>
    <Input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </FormFieldWrapper>
);

// Convierte "YYYY-MM-DD" en Date local (mediodía local)
function parseLocalDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

// Campo de fecha con botón, pop-over y calendario
interface DateFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  max?: string;
  required?: boolean;
  error?: string;
}
export const DateField: React.FC<DateFieldProps> = ({
  label,
  value,
  onChange,
  max,
  required,
  error,
}) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Cierra el calendario al hacer clic fuera
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        open &&
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  // Convierte "YYYY-MM-DD" → "DD-MM-YYYY"
  const displayValue = value
    ? (() => {
        const [y, m, d] = value.split("-");
        return `${d.padStart(2, "0")}-${m.padStart(2, "0")}-${y}`;
      })()
    : "dd-mm-aaaa";

  return (
    <FormFieldWrapper label={label} required={required} error={error}>
      <div ref={wrapperRef} className="relative">
        <Button
          variant="outline"
          onClick={() => setOpen((o) => !o)}
          className="w-full justify-start"
          type="button"
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
          {displayValue}
        </Button>

        <div
          className={`absolute z-20 mt-2 transform transition ease-out duration-150 origin-top-right
            ${open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}
          `}
        >
          <Calendar
            initialDate={value ? parseLocalDate(value) : null}
            onDateSelect={(date) => {
              const iso = date.toISOString().split("T")[0];
              if (!max || iso <= max) {
                onChange(iso);
              }
              setOpen(false);
            }}
            selectedBgColorClass="bg-primary"
            maxDate={max ? parseLocalDate(max) : undefined}
          />
        </div>
      </div>
    </FormFieldWrapper>
  );
};

// Campo de archivos (fotos)
interface FileFieldProps {
  label: string;
  onChange: (files: FileList | null) => void;
  accept?: string;
  multiple?: boolean;
  error?: string;
}
export const FileField: React.FC<FileFieldProps> = ({
  label,
  onChange,
  accept = "image/jpeg, image/png",
  multiple = false,
  error,
}) => (
  <FormFieldWrapper label={label} error={error}>
    <Input
      type="file"
      accept={accept}
      multiple={multiple}
      onChange={(e) => onChange(e.target.files)}
      className="file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
    />
  </FormFieldWrapper>
);

// Selector sencillo
interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  error?: string;
}
export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  required,
  error,
}) => (
  <FormFieldWrapper label={label} required={required} error={error}>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </FormFieldWrapper>
);

// Área de texto
export const TextAreaField: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}> = ({ label, value, onChange, placeholder }) => (
  <FormFieldWrapper label={label}>
    <textarea
      rows={4}
      className="block w-full rounded border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </FormFieldWrapper>
);
