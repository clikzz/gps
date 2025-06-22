"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

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
  required,
  error,
}) => (
  <FormFieldWrapper label={label} required={required} error={error}>
    <Input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </FormFieldWrapper>
);

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
}) => (
  <FormFieldWrapper label={label} required={required} error={error}>
    <Input
      type="date"
      value={value}
      onChange={e => onChange(e.target.value)}
      max={max}
    />
  </FormFieldWrapper>
);

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
      onChange={e => onChange(e.target.files)}
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
  required,
  error,
}) => (
  <FormFieldWrapper label={label} required={required} error={error}>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map(opt => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </FormFieldWrapper>
);


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
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </FormFieldWrapper>
);