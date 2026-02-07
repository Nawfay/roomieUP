"use client"

import { useMatches } from "@/hooks/use-matches"

export default function MatchesPage() {
  const { matches, loading, error, refresh } = useMatches()

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FFF0D1] p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <h1 className="font-serif text-3xl font-bold text-[#E8453C] mb-6">Your Matches</h1>
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#E8453C] border-t-transparent" />
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#FFF0D1] p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <h1 className="font-serif text-3xl font-bold text-[#E8453C] mb-6">Your Matches</h1>
          <div className="bg-red-100 border-2 border-red-400 rounded-lg p-4 text-center">
            <p className="text-red-700">{error}</p>
            <button
              onClick={refresh}
              className="mt-4 px-6 py-2 bg-[#E8453C] text-white rounded-full font-medium hover:bg-[#d63b32] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#FFF0D1] p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <h1 className="font-serif text-3xl font-bold text-[#E8453C] mb-6">Your Matches</h1>
        
        {matches.length === 0 ? (
          <div className="bg-[#FFF8E1] border-2 border-[#F0A01E] rounded-lg p-8 text-center">
            <p className="text-foreground/70">No matches yet. Keep swiping!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => (
              <div
                key={match.matchId}
                className="bg-[#FFF8E1] border-2 border-[#F0A01E] rounded-lg p-4 flex items-center gap-4 hover:shadow-lg transition-shadow"
              >
                <img
                  src={match.user.photoURL || match.user.image || "/placeholder.svg"}
                  alt={match.user.displayName || match.user.name}
                  className="h-16 w-16 rounded-full border-2 border-[#E8453C] object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-serif text-xl font-bold text-foreground">
                    {match.user.displayName || match.user.name}
                  </h3>
                  <p className="text-sm text-foreground/70">
                    {match.user.bio || 'No bio'}
                  </p>
                </div>
                <button className="px-4 py-2 bg-[#E8453C] text-white rounded-full text-sm font-medium hover:bg-[#d63b32] transition-colors">
                  Message
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom navbar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[#FFF8E1] border-t-2 border-[#F0A01E] shadow-lg">
        <div className="flex items-center justify-around py-3 px-4 max-w-md mx-auto">
          <Link
            href="/messages"
            className="flex flex-col items-center gap-1 text-foreground/60 hover:text-foreground transition-colors"
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
            className="flex flex-col items-center gap-1 text-[#E8453C] transition-colors"
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
