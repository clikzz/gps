"use client"

import { ReactNode, useEffect, useState } from "react"
import { useUserProfile } from "@/stores/userProfile"
import { useRouter } from "next/navigation"

export default function ForumLayout({ children }: { children: ReactNode }) {
  const setUser = useUserProfile((s) => s.setUser)
  const router  = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    fetch("/api/profile", { credentials: "include" })
      .then(async (res) => {
        if (res.ok) {
          const profile = await res.json()
          setUser(profile)
          setReady(true)
        } else if (res.status === 401) {
          router.push("/sign-in")
        }
      })
      .catch(console.error)
  }, [setUser, router])

  if (!ready) return null

  return <>{children}</>
}
