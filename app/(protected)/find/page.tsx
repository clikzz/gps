'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import FindMap from '@/components/find/FindMap'
import RequestLocation from '@/components/find/RequestLocation'
import { useLocationStore } from '@/stores/location'

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
      <div className="flex items-center justify-center h-full px-4">
        <div className="w-full max-w-md">
          <RequestLocation onLocationReady={handleLocationReady}/>
        </div>
      </div>
    )
  }

  const mapPortal = (
    <div className="fixed inset-0 top-[64px] z-30">
      <FindMap />
    </div>
  )
  return mounted ? createPortal(mapPortal, document.body) : null
}