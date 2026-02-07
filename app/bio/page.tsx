"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { BioProfile } from "@/components/bio/bio-profile"

export default function BioPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [showBio, setShowBio] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/signup")
        return
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid))
        const userData = userDoc.data()

        if (userData?.profileComplete) {
          // Already completed everything, go to discover
          router.push("/discover")
        } else if (!userData?.onboardingComplete) {
          // Haven't completed quiz yet, go back to onboarding
          router.push("/onboard")
        } else {
          // Quiz done, show bio form
          setShowBio(true)
        }
      } catch (error) {
        console.error("Error checking profile status:", error)
        router.push("/onboard")
      } finally {
        setIsLoading(false)
      }
    })

    return () => unsubscribe()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-foreground/70">Loading...</p>
      </div>
    )
  }

  if (!showBio) {
    return null
  }

  return <BioProfile />
}
