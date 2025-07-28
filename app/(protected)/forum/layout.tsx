"use client"

import { ReactNode, useEffect, useState } from "react"
import { useUserProfile } from "@/stores/userProfile"
import { useRouter, usePathname } from "next/navigation"
import { BadgeListenerProvider } from "@/components/BadgeListenerProvider"

export default function ForumLayout({ children }: { children: ReactNode }) {
  const setUser = useUserProfile((s) => s.setUser)
  const user = useUserProfile((s) => s.user)
  const path = usePathname()
  const router = useRouter()
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

  useEffect(() => {
    if (!ready) return

    if (!path?.startsWith("/forum")) return

    if (user?.status === "BANNED" || user?.status === "SUSPENDED") {
      if (path !== "/forum/banned") {
        router.replace("/forum/banned")
      }
    }
  }, [ready, user?.status, path, router])

  if (!ready) return null

  return (
    <BadgeListenerProvider>
      {children}
    </BadgeListenerProvider>
  )
}
