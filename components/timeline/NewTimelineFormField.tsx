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
  required = false,
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


function parseLocalDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}


interface DateFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  max?: string;
}
export const DateField: React.FC<DateFieldProps> = ({
  label,
  value,
  onChange,
  max,
}) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

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

  const displayValue = value
    ? (() => {
        const [y, m, d] = value.split("-");
        return `${d.padStart(2, "0")}-${m.padStart(2, "0")}-${y}`;
      })()
    : "dd-mm-aaaa";

  return (
    <FormFieldWrapper label={label}>
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
  required = false,
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

interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}
export const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  error,
}) => (
  <FormFieldWrapper label={label} required={required} error={error}>
    <textarea
      rows={4}
      className="block w-full rounded border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </FormFieldWrapper>
);
