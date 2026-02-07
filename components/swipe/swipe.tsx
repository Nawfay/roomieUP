"use client"

import React from "react"
import Link from "next/link"

import { useState, useRef, useCallback, useEffect } from "react"
import type { Profile } from "@/lib/swipe"
import { useFeed } from "@/hooks/use-feed"
import { useSwipe } from "@/hooks/use-swipe"

function RetroBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-[#FFF0D1] overflow-hidden">
      {/* Rainbow arcs top-right */}
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

      {/* Retro stripes bottom-left */}
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

function SwipeHint({ direction }: { direction: "up" | "down" }) {
  if (direction === "up") {
    return (
      <div className="absolute -top-16 left-0 right-0 flex flex-col items-start pl-2 pointer-events-none select-none">
        <span className="text-[#E8453C] font-bold text-sm uppercase tracking-wider">Swipe</span>
        <span className="font-serif text-[#E8453C] text-3xl font-bold italic -mt-1">Up!</span>
      </div>
    )
  }
  return (
    <div className="absolute -bottom-14 right-0 flex items-baseline gap-1.5 pr-2 pointer-events-none select-none">
      <span className="text-[#E8453C] font-bold text-xs uppercase tracking-wider">or</span>
      <span className="font-serif text-[#E8453C] text-3xl font-bold italic">Down</span>
    </div>
  )
}

interface ProfileCardProps {
  profile: any // API returns flexible user data
  onSwipe: (direction: "up" | "down") => void
}

function ProfileCard({ profile, onSwipe }: ProfileCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const startY = useRef(0)
  const currentY = useRef(0)
  const isDragging = useRef(false)
  const [offsetY, setOffsetY] = useState(0)
  const [swiping, setSwiping] = useState<"up" | "down" | null>(null)
  const [exiting, setExiting] = useState(false)

  const threshold = 100

  const handleStart = useCallback((y: number) => {
    isDragging.current = true
    startY.current = y
    currentY.current = y
  }, [])

  const handleMove = useCallback((y: number) => {
    if (!isDragging.current) return
    currentY.current = y
    const diff = currentY.current - startY.current
    setOffsetY(diff)
    if (diff < -30) setSwiping("up")
    else if (diff > 30) setSwiping("down")
    else setSwiping(null)
  }, [])

  const handleEnd = useCallback(() => {
    if (!isDragging.current) return
    isDragging.current = false

    if (offsetY < -threshold) {
      setExiting(true)
      setOffsetY(-600)
      setTimeout(() => onSwipe("up"), 300)
    } else if (offsetY > threshold) {
      setExiting(true)
      setOffsetY(600)
      setTimeout(() => onSwipe("down"), 300)
    } else {
      setOffsetY(0)
      setSwiping(null)
    }
  }, [offsetY, onSwipe])

  // Touch events
  const onTouchStart = useCallback((e: React.TouchEvent) => handleStart(e.touches[0].clientY), [handleStart])
  const onTouchMove = useCallback((e: React.TouchEvent) => handleMove(e.touches[0].clientY), [handleMove])
  const onTouchEnd = useCallback(() => handleEnd(), [handleEnd])

  // Mouse events
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    handleStart(e.clientY)
  }, [handleStart])

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientY)
    const onMouseUp = () => handleEnd()

    if (isDragging.current) {
      window.addEventListener("mousemove", onMouseMove)
      window.addEventListener("mouseup", onMouseUp)
    }

    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
    }
  }, [handleMove, handleEnd])

  // Re-attach listeners when dragging starts
  const onMouseDownWrapped = useCallback((e: React.MouseEvent) => {
    onMouseDown(e)
    const onMouseMove = (ev: MouseEvent) => handleMove(ev.clientY)
    const onMouseUp = () => {
      handleEnd()
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
    }
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
  }, [onMouseDown, handleMove, handleEnd])

  const rotation = offsetY * 0.02
  const opacity = exiting ? 0 : 1

  return (
    <div className="relative w-full max-w-[340px]">
      <SwipeHint direction="up" />
      <SwipeHint direction="down" />

      {/* Swipe feedback overlays */}
      {swiping === "up" && !exiting && (
        <div className="absolute inset-0 z-20 flex items-center justify-center rounded-3xl bg-green-500/20 border-4 border-green-400 pointer-events-none">
          <span className="text-green-500 font-bold text-2xl uppercase tracking-wider rotate-[-15deg]">Accept</span>
        </div>
      )}
      {swiping === "down" && !exiting && (
        <div className="absolute inset-0 z-20 flex items-center justify-center rounded-3xl bg-red-500/20 border-4 border-red-400 pointer-events-none">
          <span className="text-red-500 font-bold text-2xl uppercase tracking-wider rotate-[15deg]">Reject</span>
        </div>
      )}

      <div
        ref={cardRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDownWrapped}
        className="relative z-10 flex w-full flex-col items-center rounded-3xl border-4 border-[#F0A01E] bg-[#FFF8E1] px-5 pt-6 pb-5 shadow-2xl cursor-grab active:cursor-grabbing select-none"
        style={{
          transform: `translateY(${offsetY}px) rotate(${rotation}deg)`,
          opacity,
          transition: exiting ? "transform 0.3s ease-out, opacity 0.3s ease-out" : isDragging.current ? "none" : "transform 0.3s ease-out",
        }}
      >
        {/* Purple-bordered window with profile pic */}
        <div className="w-full rounded-xl border-[3px] border-[#9B4DCA] bg-[#FCEEE8] shadow-md overflow-hidden">
          {/* Window title bar */}
          <div className="flex items-center justify-end border-b border-[#9B4DCA]/30 px-3 py-2">
            <div className="flex gap-1.5">
              <div className="flex h-4 w-4 items-center justify-center rounded-sm border border-[#9B4DCA]/50 text-[#9B4DCA]">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><rect x="1" y="5" width="6" height="1" fill="currentColor"/></svg>
              </div>
              <div className="flex h-4 w-4 items-center justify-center rounded-sm border border-[#9B4DCA]/50 text-[#9B4DCA]">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><rect x="1" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1" fill="none"/></svg>
              </div>
              <div className="flex h-4 w-4 items-center justify-center rounded-sm border border-[#9B4DCA]/50 text-[#9B4DCA]">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><line x1="1" y1="1" x2="7" y2="7" stroke="currentColor" strokeWidth="1"/><line x1="7" y1="1" x2="1" y2="7" stroke="currentColor" strokeWidth="1"/></svg>
              </div>
            </div>
          </div>

          {/* Profile picture area */}
          <div className="flex items-center justify-center py-8 px-6">
            <div className="h-36 w-36 rounded-full border-4 border-[#E8453C] overflow-hidden bg-[#d4a59a]">
              <img
                src={profile.profileImage || profile.photoURL || profile.image || "/placeholder.svg"}
                alt={`${profile.displayName || profile.name}'s profile`}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Name, age, bio */}
        <div className="w-full mt-4 text-center">
          <h2 className="font-serif text-2xl font-bold text-foreground">
            {profile.displayName || profile.name}{profile.age ? `, ${profile.age}` : ''}
          </h2>
          <p className="mt-2 text-sm text-foreground/70 leading-relaxed px-2">
            {profile.bio || 'No bio yet'}
          </p>
        </div>

        {/* Retro stripes */}
        <div className="flex items-end gap-[3px] mt-5">
          <div className="h-8 w-2 rounded-full bg-[#E8453C]" />
          <div className="h-6 w-2 rounded-full bg-[#F0851E]" />
          <div className="h-5 w-2 rounded-full bg-[#F0A01E]" />
          <div className="h-4 w-1.5 rounded-full bg-[#F2C9D0]" />
          <div className="h-3 w-1.5 rounded-full bg-[#C4BFC6]" />
          <div className="h-5 w-2 rounded-full bg-[#E4BFC8]" />
          <div className="h-6 w-2 rounded-full bg-[#F0A01E]" />
        </div>
      </div>
    </div>
  )
}

export function SwipeDiscover() {
  const { feed, loading, error, refresh } = useFeed(20)
  const { accept, reject, loading: swipeLoading } = useSwipe()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showMatchNotification, setShowMatchNotification] = useState(false)
  const [totalMatches, setTotalMatches] = useState(0)

  const handleSwipe = async (direction: "up" | "down") => {
    if (swipeLoading || !feed[currentIndex]) return

    const profile = feed[currentIndex]
    
    if (direction === "up") {
      const result = await accept(profile.id)
      if (result?.matched) {
        setTotalMatches(prev => prev + 1)
        setShowMatchNotification(true)
        setTimeout(() => setShowMatchNotification(false), 3000)
      }
    } else {
      await reject(profile.id)
    }
    
    setCurrentIndex(prev => prev + 1)
    
    // Refresh feed when running low
    if (currentIndex >= feed.length - 3) {
      refresh()
    }
  }

  // Loading state
  if (loading && feed.length === 0) {
    return (
      <main className="relative flex min-h-svh items-center justify-center p-4">
        <RetroBackground />
        <div className="relative z-10 w-full max-w-[340px] flex flex-col items-center rounded-3xl border-4 border-[#F0A01E] bg-[#FFF8E1] px-5 py-12 shadow-2xl text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#E8453C] border-t-transparent mb-4" />
          <p className="text-foreground/70">Loading profiles...</p>
        </div>
      </main>
    )
  }

  // Error state
  if (error) {
    return (
      <main className="relative flex min-h-svh items-center justify-center p-4">
        <RetroBackground />
        <div className="relative z-10 w-full max-w-[340px] flex flex-col items-center rounded-3xl border-4 border-[#F0A01E] bg-[#FFF8E1] px-5 py-12 shadow-2xl text-center">
          <h2 className="font-serif text-2xl font-bold text-[#E8453C] mb-3">Oops!</h2>
          <p className="text-foreground/70 mb-4">{error}</p>
          <button
            onClick={refresh}
            className="px-6 py-2 bg-[#E8453C] text-white rounded-full font-medium hover:bg-[#d63b32] transition-colors"
          >
            Try Again
          </button>
        </div>
      </main>
    )
  }

  // No more profiles
  if (currentIndex >= feed.length) {
    return (
      <main className="relative flex min-h-svh items-center justify-center p-4 pb-24">
        <RetroBackground />
        
        {/* Logo top-right */}
        <Link href="/lootbox" className="fixed top-4 right-4 z-30 hover:opacity-80 transition-opacity cursor-pointer">
          <img src="/Boxopen.svg" alt="Lootbox" width="48" height="48" />
        </Link>
        
        <div className="relative z-10 w-full max-w-[340px] flex flex-col items-center rounded-3xl border-4 border-[#F0A01E] bg-[#FFF8E1] px-5 py-12 shadow-2xl text-center">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-3">No More Profiles</h2>
          {totalMatches > 0 ? (
            <>
              <p className="text-foreground/70 mb-2 leading-relaxed">
                You matched with {totalMatches} {totalMatches === 1 ? "person" : "people"}!
              </p>
              <p className="text-foreground/50 text-sm mb-6">Check your messages to start chatting.</p>
              <Link
                href="/messages"
                className="px-6 py-2 bg-[#E8453C] text-white rounded-full font-medium hover:bg-[#d63b32] transition-colors mb-3"
              >
                View Matches
              </Link>
            </>
          ) : null}
          <button
            onClick={() => {
              setCurrentIndex(0)
              refresh()
            }}
            className="px-6 py-2 bg-[#F0A01E] text-white rounded-full font-medium hover:bg-[#e09519] transition-colors"
          >
            Refresh Feed
          </button>
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
              className="flex flex-col items-center gap-1 text-[#E8453C] transition-colors"
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

  const currentProfile = feed[currentIndex]

  return (
    <main className="relative flex min-h-svh items-center justify-center p-4 pb-24 overflow-hidden">
      <RetroBackground />
      
      {/* Logo top-right */}
      <Link href="/lootbox" className="fixed top-4 right-4 z-30 hover:opacity-80 transition-opacity cursor-pointer">
        <img src="/Boxopen.svg" alt="Lootbox" width="48" height="48" />
      </Link>

      {/* Match notification */}
      {showMatchNotification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg font-bold animate-bounce">
          🎉 It's a Match!
        </div>
      )}

      <ProfileCard
        key={currentProfile.id}
        profile={currentProfile}
        onSwipe={handleSwipe}
      />

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
            className="flex flex-col items-center gap-1 text-[#E8453C] transition-colors"
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
