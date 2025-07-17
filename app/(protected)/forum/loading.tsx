"use client"
import React from "react"
import { PawPrint } from "lucide-react"
import LoadingScreen from "@/components/LoadingScreen"

export default function Loading() {
  return (
    <LoadingScreen
      title="Cargando foro"
      subtext="Obteniendo categorías y subforos"
      icon={PawPrint}
    />
  )
}
