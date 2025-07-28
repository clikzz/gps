'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import FindMap from '@/components/find/FindMap'
import RequestLocation from '@/components/find/RequestLocation'
import { useLocationStore } from '@/stores/location'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function FindPage() {
  const { setPosition } = useLocationStore()
  const [ready, setReady] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLocationReady = (loc: { lat: number; lng: number }) => {
    setPosition({
      latitude: loc.lat,
      longitude: loc.lng,
      timestamp: Date.now(),
    })
    setReady(true)
  }

  if (!ready) {
    return (
      <div className="flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Permitir Ubicación</CardTitle>
            <CardDescription className="text-center">
              Encuentra mascotas perdidas cerca de tu ubicación
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <RequestLocation onLocationReady={handleLocationReady} />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const mapPortal = (
    <div className="fixed left-0 right-0 z-30 top-0 md:top-16 bottom-0">
      <FindMap />
    </div>
  )
  return mounted ? createPortal(mapPortal, document.body) : null
}