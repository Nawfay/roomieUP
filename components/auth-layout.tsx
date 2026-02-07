import React from "react"
import { RetroBackground } from "@/components/retro-background"

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative flex min-h-svh items-center justify-center bg-background px-4 py-12">
      <RetroBackground />
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <h1 className="font-serif text-5xl font-bold italic tracking-tight text-accent">
            RoomieUP!
          </h1>
        </div>
        {children}
      </div>
    </main>
  )
}
