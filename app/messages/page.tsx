"use client"

import { useMatches } from "@/hooks/use-matches"
import Link from "next/link"

function RetroBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-[#FFF0D1] overflow-hidden">
      <svg
        className="absolute -top-10 -right-10 w-72 h-72 md:w-96 md:h-96"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M400 0 C400 220.9 220.9 400 0 400" stroke="#E8453C" strokeWidth="40" fill="none" />
        <path d="M400 0 C400 190 190 400 -30 400" stroke="#F0851E" strokeWidth="35" fill="none" opacity="0.9" />
        <path d="M400 0 C400 160 160 400 -60 400" stroke="#F0A01E" strokeWidth="30" fill="none" opacity="0.85" />
        <path d="M400 0 C400 130 130 400 -90 400" stroke="#F2C9D0" strokeWidth="25" fill="none" opacity="0.7" />
      </svg>

      <div className="absolute bottom-0 left-4 flex items-end gap-1 pb-4">
        <div className="h-28 w-4 rounded-t-full bg-[#E8453C]" />
        <div className="h-24 w-4 rounded-t-full bg-[#F0851E]" />
        <div className="h-20 w-4 rounded-t-full bg-[#F0A01E]" />
        <div className="h-14 w-2 rounded-t-full bg-[#F2C9D0]" />
        <div className="h-12 w-2 rounded-t-full bg-[#C4BFC6]" />
      </div>
    </div>
  )
}

export default function MessagesPage() {
  const { matches, loading, error, refresh } = useMatches()

  return (
    <main className="relative min-h-svh pb-20">
      <RetroBackground />
      
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#FFF8E1] border-b-2 border-[#F0A01E] shadow-md">
        <div className="flex items-center justify-between px-4 py-4">
          <h1 className="font-serif text-2xl font-bold text-[#E8453C]">Messages</h1>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="8" width="24" height="20" rx="3" fill="#FFF8E1" stroke="#E8453C" strokeWidth="2"/>
            <path d="M4 12 L16 4 L28 12" fill="#F0A01E" stroke="#E8453C" strokeWidth="2" strokeLinejoin="round"/>
            <circle cx="16" cy="18" r="3" fill="#E8453C"/>
            <rect x="15" y="20" width="2" height="4" rx="1" fill="#E8453C"/>
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 py-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#E8453C] border-t-transparent" />
          </div>
        ) : error ? (
          <div className="bg-[#FFF8E1] border-2 border-[#E8453C] rounded-2xl p-6 text-center">
            <p className="text-foreground/70 mb-4">{error}</p>
            <button
              onClick={refresh}
              className="px-6 py-2 bg-[#E8453C] text-white rounded-full font-medium hover:bg-[#d63b32] transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : matches.length === 0 ? (
          <div className="bg-[#FFF8E1] border-2 border-[#F0A01E] rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">💬</div>
            <h2 className="font-serif text-xl font-bold text-foreground mb-2">No Matches Yet</h2>
            <p className="text-foreground/70 text-sm mb-4">
              Start swiping to find your perfect roommate!
            </p>
            <Link
              href="/discover"
              className="inline-block px-6 py-2 bg-[#E8453C] text-white rounded-full font-medium hover:bg-[#d63b32] transition-colors"
            >
              Go to Discover
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {matches.map((match) => (
              <Link
                key={match.matchId}
                href={`/messages/${match.matchId}`}
                className="w-full bg-[#FFF8E1] border-2 border-[#F0A01E] rounded-2xl p-4 flex items-center gap-4 hover:shadow-lg transition-shadow active:scale-[0.98]"
              >
                <div className="relative">
                  <img
                    src={match.user.profileImage || match.user.photoURL || match.user.image || "/placeholder.svg"}
                    alt={match.user.displayName || match.user.name}
                    className="h-14 w-14 rounded-full border-2 border-[#E8453C] object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-[#FFF8E1]" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-serif text-lg font-bold text-foreground">
                    {match.user.displayName || match.user.name}
                  </h3>
                  <p className="text-sm text-foreground/50">
                    Tap to start chatting
                  </p>
                </div>
                <svg className="h-6 w-6 text-[#E8453C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Bottom navbar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[#FFF8E1] border-t-2 border-[#F0A01E] shadow-lg">
        <div className="flex items-center justify-around py-3 px-4 max-w-md mx-auto">
          <Link
            href="/messages"
            className="flex flex-col items-center gap-1 text-[#E8453C] transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span className="text-[10px] font-medium">Messages</span>
          </Link>

          <Link
            href="/discover"
            className="flex flex-col items-center gap-1 text-foreground/60 hover:text-foreground transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[10px] font-medium">Discover</span>
          </Link>

          <Link
            href="/bio"
            className="flex flex-col items-center gap-1 text-foreground/60 hover:text-foreground transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-[10px] font-medium">Profile</span>
          </Link>
        </div>
      </nav>
    </main>
  )
}
