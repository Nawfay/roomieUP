"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { CheckeredBackground } from "@/components/bio/checkered-bg"

const PRIZES = [
  { label: "5 Scrolls", description: "Use them to see more profiles!" },
  { label: "1 Month Free Rent", description: "Your landlord will love this!" },
  { label: "10 Super Likes", description: "Stand out to potential roommates!" },
  { label: "Premium for 1 Week", description: "Unlock all features!" },
  { label: "4 Scrolls", description: "Use them to see more profiles!" },
  { label: "Free Pizza Night", description: "Bond with your new roommate!" },
  { label: "10 Scrolls", description: "Scroll to your heart's content!" },
  { label: "Moving Day Helper", description: "A friend for move-in day!" },
]

function getRandomPrize() {
  return PRIZES[Math.floor(Math.random() * PRIZES.length)]
}

export function Lootbox() {
  const router = useRouter()
  const [isOpened, setIsOpened] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [prize, setPrize] = useState<{ label: string; description: string } | null>(null)

  const handleOpen = useCallback(() => {
    if (isOpened || isAnimating) return
    setIsAnimating(true)

    // Shake animation then open
    setTimeout(() => {
      setIsOpened(true)
      setPrize(getRandomPrize())
      setIsAnimating(false)
    }, 800)
  }, [isOpened, isAnimating])

  const handleReset = useCallback(() => {
    setIsOpened(false)
    setPrize(null)
  }, [])

  return (
    <main className="relative flex min-h-svh flex-col items-center justify-start p-3 pt-6 pb-6">
      <CheckeredBackground />

      {/* Cream card */}
      <div className="relative z-10 flex w-full max-w-[360px] flex-1 flex-col items-center rounded-3xl border-4 border-[#F0A01E] bg-[#FFF8E1] px-4 pt-4 pb-5 shadow-2xl overflow-hidden">

        {/* Back button */}
        <button
          type="button"
          onClick={() => router.back()}
          className="self-start mb-2 flex items-center gap-1 text-[#E8453C] hover:opacity-70 transition-opacity"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="text-sm font-semibold">Back</span>
        </button>

        {/* Prize reveal area */}
        {isOpened && prize && (
          <div className="flex flex-col items-center justify-center text-center mb-4 animate-in fade-in zoom-in duration-500">
            <div className="rounded-full bg-[#F0A01E]/20 p-4 mb-3">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#E8453C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <p className="text-xs font-medium tracking-widest uppercase text-[#E8453C]/70 mb-1">You won</p>
            <h2 className="font-serif text-3xl font-bold text-[#E8453C] mb-1">{prize.label}</h2>
            <p className="text-sm text-foreground/60 leading-relaxed px-4">{prize.description}</p>
          </div>
        )}

        {/* Box image */}
        <div className="flex flex-1 items-center justify-center w-full">
          <div
            className={`relative w-full max-w-[280px] transition-transform duration-300 ${
              isAnimating ? "animate-shake" : ""
            } ${isOpened ? "scale-100" : "scale-90"}`}
          >
            {isOpened ? (
              <img
                src="/Boxopen.svg"
                alt="Opened lootbox with golden light"
                className="w-full h-auto"
                draggable={false}
              />
            ) : (
              <img
                src="/Boxclose.svg"
                alt="Closed lootbox"
                className="w-full h-auto"
                draggable={false}
              />
            )}
          </div>
        </div>

        {/* Button */}
        <div className="w-full px-2 pb-2 pt-4 shrink-0">
          {isOpened ? (
            <button
              type="button"
              onClick={handleReset}
              className="w-full h-14 rounded-2xl bg-[#F0A01E] text-[#FFF8E1] font-serif text-xl font-bold shadow-lg hover:opacity-90 active:scale-95 transition-all border-b-4 border-[#D48A10]"
            >
              Open Another
            </button>
          ) : (
            <button
              type="button"
              onClick={handleOpen}
              disabled={isAnimating}
              className="w-full h-14 rounded-2xl bg-[#F0A01E] text-[#FFF8E1] font-serif text-xl font-bold shadow-lg hover:opacity-90 active:scale-95 transition-all border-b-4 border-[#D48A10] disabled:opacity-70"
            >
              {isAnimating ? "Opening..." : "Open Lootbox"}
            </button>
          )}
        </div>
      </div>

      {/* Shake animation keyframes */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          10% { transform: translateX(-8px) rotate(-3deg); }
          20% { transform: translateX(8px) rotate(3deg); }
          30% { transform: translateX(-10px) rotate(-4deg); }
          40% { transform: translateX(10px) rotate(4deg); }
          50% { transform: translateX(-12px) rotate(-5deg); }
          60% { transform: translateX(12px) rotate(5deg); }
          70% { transform: translateX(-8px) rotate(-3deg); }
          80% { transform: translateX(8px) rotate(3deg); }
          90% { transform: translateX(-4px) rotate(-1deg); }
        }
        .animate-shake {
          animation: shake 0.8s ease-in-out;
        }
      `}</style>
    </main>
  )
}
