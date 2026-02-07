"use client"

import { useState } from "react"
import Link from "next/link"

export function SignupForm() {
  const [studentEmail, setStudentEmail] = useState("")
  const [studentNumber, setStudentNumber] = useState("")

  return (
    <div className="rounded-2xl border border-border/30 bg-transparent p-8">
      <div className="mb-8 text-center">
        <h2 className="font-serif text-4xl font-bold text-foreground">Sign Up</h2>
        <p className="mt-2 text-sm text-foreground/70">
          {"Already have an account? "}
          <Link href="/" className="font-semibold text-primary hover:underline">
            Log In
          </Link>
        </p>
      </div>

      <form className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="studentEmail" className="text-sm font-medium text-foreground">
            Student Email
          </label>
          <input
            id="studentEmail"
            type="email"
            placeholder="your.email@student.edu"
            value={studentEmail}
            onChange={(e) => setStudentEmail(e.target.value)}
            className="h-11 rounded-lg border border-white/30 bg-white/60 px-4 text-foreground placeholder:text-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="studentNumber" className="text-sm font-medium text-foreground">
            Student Number
          </label>
          <input
            id="studentNumber"
            type="text"
            placeholder="e.g., 123456789"
            value={studentNumber}
            onChange={(e) => setStudentNumber(e.target.value)}
            className="h-11 rounded-lg border border-white/30 bg-white/60 px-4 text-foreground placeholder:text-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <button
          type="button"
          disabled={!studentEmail || !studentNumber}
          className="w-full h-12 rounded-full bg-white/70 text-foreground font-semibold text-base shadow-md hover:bg-white/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
          aria-label="Sign up with Google"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Sign up with Google
        </button>
      </form>
    </div>
  )
}
