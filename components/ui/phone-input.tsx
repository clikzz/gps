"use client"

import type React from "react"
import { useState, useEffect } from "react"
import ReactCountryFlag from "react-country-flag"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

const latinAmericanCountries = [
  { name: "Argentina", code: "AR", dialCode: "+54" },
  { name: "Bolivia", code: "BO", dialCode: "+591" },
  { name: "Brasil", code: "BR", dialCode: "+55" },
  { name: "Chile", code: "CL", dialCode: "+56" },
  { name: "Colombia", code: "CO", dialCode: "+57" },
  { name: "Costa Rica", code: "CR", dialCode: "+506" },
  { name: "Cuba", code: "CU", dialCode: "+53" },
  { name: "Ecuador", code: "EC", dialCode: "+593" },
  { name: "El Salvador", code: "SV", dialCode: "+503" },
  { name: "Guatemala", code: "GT", dialCode: "+502" },
  { name: "Honduras", code: "HN", dialCode: "+504" },
  { name: "México", code: "MX", dialCode: "+52" },
  { name: "Nicaragua", code: "NI", dialCode: "+505" },
  { name: "Panamá", code: "PA", dialCode: "+507" },
  { name: "Paraguay", code: "PY", dialCode: "+595" },
  { name: "Perú", code: "PE", dialCode: "+51" },
  { name: "República Dominicana", code: "DO", dialCode: "+1" },
  { name: "Uruguay", code: "UY", dialCode: "+598" },
  { name: "Venezuela", code: "VE", dialCode: "+58" },
]

interface PhoneInputProps {
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
}

export default function PhoneInput({
  value = "",
  onChange,
  placeholder = "123456789",
  required = false,
}: PhoneInputProps) {
  const getInitialCountry = () => {
    return (
      latinAmericanCountries.find((country) => value?.startsWith(country.dialCode)) ||
      latinAmericanCountries.find((country) => country.code === "CL")!
    )
  }

  const [selectedCountry, setSelectedCountry] = useState(getInitialCountry)

  useEffect(() => {
    setSelectedCountry(getInitialCountry())
  }, [value])

  const handleCountryChange = (country: (typeof latinAmericanCountries)[0]) => {
    setSelectedCountry(country)

    const phoneNumber = value?.startsWith(selectedCountry.dialCode)
      ? value.slice(selectedCountry.dialCode.length).trim()
      : value?.replace(/^\+\d+\s*/, "") || ""

    const newValue = country.dialCode + phoneNumber
    onChange(newValue)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phoneNumber = e.target.value.replace(/[^\d\s-]/g, "")
    onChange(selectedCountry.dialCode + phoneNumber.replace(/\s/g, ""))
  }

  const getCurrentPhoneNumber = () => {
    if (value?.startsWith(selectedCountry.dialCode)) {
      return value.slice(selectedCountry.dialCode.length).trim()
    }
    return value?.replace(/^\+\d+\s*/, "") || ""
  }

  return (
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            type="button"
            className="flex-shrink-0 w-[120px] flex items-center justify-between hover:bg-primary/5 hover:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
          >
            <div className="flex items-center space-x-2">
              <ReactCountryFlag
                countryCode={selectedCountry.code}
                svg
                style={{ width: "20px", height: "15px" }}
                title={selectedCountry.name}
              />
              <span className="font-medium text-sm text-foreground">{selectedCountry.dialCode}</span>
            </div>
            <ChevronDown className="w-4 h-4 text-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-h-[300px] overflow-y-auto w-[280px] border-none shadow-lg">
          {latinAmericanCountries.map((country) => (
            <DropdownMenuItem
              key={country.code}
              onSelect={() => handleCountryChange(country)}
              className="flex items-center cursor-pointer hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary transition-colors duration-200 py-3 px-3 rounded-md"
            >
              <ReactCountryFlag
                countryCode={country.code}
                svg
                style={{ width: "20px", height: "15px" }}
                className="mr-3"
                title={country.name}
              />
              <span className="flex-1 font-medium">{country.name}</span>
              <span className="ml-auto text-muted-foreground text-sm font-mono">{country.dialCode}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      <div className="h-6 w-px bg-border"></div>
      
      <div className="relative flex-1">
        <Input
          type="tel"
          value={getCurrentPhoneNumber()}
          onChange={handlePhoneChange}
          className="pl-3 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
          placeholder={placeholder}
          required={required}
          aria-label="Número de teléfono"
          inputMode="numeric"
          onKeyPress={(e) => {
            if (!/[0-9\s-]/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete") {
              e.preventDefault()
            }
          }}
        />
      </div>
    </div>
  )
}
