"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { QUESTIONNAIRE_DATA, calculateTraitScores } from "@/lib/questionnaire"

const RATING_COLORS = ["#E8453C", "#F09A7E", "#C4BFC6", "#E4BFC8", "#F2C9D0"]
const RATING_LABELS = ["Very Unlikely", "Unlikely", "Neutral", "Likely", "Very Likely"]

function CheckeredBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <defs>
          <pattern id="checkerboard" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="50" height="50" x="0" y="0" fill="#E8453C" />
            <rect width="50" height="50" x="50" y="0" fill="#F0851E" />
            <rect width="50" height="50" x="0" y="50" fill="#F0A01E" />
            <rect width="50" height="50" x="50" y="50" fill="#D93B2B" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#checkerboard)" />
      </svg>
    </div>
  )
}

export function OnboardingQuiz() {
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [isComplete, setIsComplete] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const currentQuestion = QUESTIONNAIRE_DATA.questions[currentQuestionIndex]
  const selectedRating = answers[currentQuestion?.id] ?? null

  const handleRatingSelect = async (rating: number) => {
    const newAnswers = { ...answers, [currentQuestion.id]: rating }
    setAnswers(newAnswers)

    if (currentQuestionIndex < QUESTIONNAIRE_DATA.questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      }, 350)
    } else {
      // Last question - save to Firebase
      setTimeout(async () => {
        setIsSaving(true)
        const user = auth.currentUser
        
        if (user) {
          try {
            const traitScores = calculateTraitScores(newAnswers)
            
            // Save trait data
            await setDoc(doc(db, "traits", user.uid), {
              ...traitScores,
              userId: user.uid,
              completedAt: new Date().toISOString(),
            })
            
            // Update user profile to mark as complete
            await setDoc(doc(db, "users", user.uid), {
              profileComplete: false,
              onboardingComplete: true,
              updatedAt: new Date().toISOString(),
            }, { merge: true })
            
            setIsComplete(true)
          } catch (error) {
            console.error("Error saving data to Firebase:", error)
            alert("There was an error saving your data. Please try again.")
          } finally {
            setIsSaving(false)
          }
        } else {
          console.error("No user logged in")
          setIsSaving(false)
        }
      }, 350)
    }
  }

  return (
    <main className="relative flex min-h-svh items-center justify-center p-4">
      <CheckeredBackground />

      {/* Cream card */}
      <div className="relative z-10 flex w-full max-w-sm flex-col rounded-3xl border-4 border-[#F0A01E] bg-[#FFF8E1] px-5 py-6 shadow-2xl"
        style={{ minHeight: "min(85svh, 640px)" }}
      >
        {isSaving ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-3">Saving...</h2>
            <p className="text-foreground/70 mb-8 leading-relaxed px-2">
              Creating your profile
            </p>
          </div>
        ) : isComplete ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-3">All Set!</h2>
            <p className="text-foreground/70 mb-8 leading-relaxed px-2">
              Your profile has been created. Get ready to find your perfect roommate!
            </p>
            <button
              onClick={() => router.push("/bio")}
              className="w-full h-12 rounded-full bg-[#E8453C] text-[#FFF8E1] font-semibold hover:opacity-90 transition-opacity"
            >
              Continue
            </button>
          </div>
        ) : (
          <>
            {/* Purple-bordered window */}
            <div className="flex flex-1 flex-col rounded-xl border-[3px] border-[#9B4DCA] bg-[#FCEEE8] shadow-md overflow-hidden">
              {/* Window title bar */}
              <div className="flex items-center justify-end bg-[#FCEEE8] border-b border-[#9B4DCA]/30 px-3 py-2">
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

              {/* Question content */}
              <div className="flex flex-1 flex-col items-center justify-center px-5 py-6">
                {/* Progress */}
                <p className="text-xs font-medium text-foreground/50 mb-3">
                  {currentQuestionIndex + 1} / {QUESTIONNAIRE_DATA.questions.length}
                </p>
                <div className="w-full h-1 bg-[#9B4DCA]/15 rounded-full mb-6 overflow-hidden">
                  <div
                    className="h-full bg-[#9B4DCA] rounded-full transition-all duration-500"
                    style={{ width: `${((currentQuestionIndex + 1) / QUESTIONNAIRE_DATA.questions.length) * 100}%` }}
                  />
                </div>

                {/* Question text */}
                <p className="text-center font-serif text-base leading-relaxed text-foreground">
                  {currentQuestion.text}
                </p>
              </div>
            </div>

            {/* Rating circles */}
            <div className="flex items-center justify-center gap-3 pt-5 pb-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => handleRatingSelect(rating)}
                  aria-label={RATING_LABELS[rating - 1]}
                  className={`rounded-full transition-all duration-200 ${
                    selectedRating === rating
                      ? "ring-2 ring-foreground/70 ring-offset-2 ring-offset-[#FFF8E1] scale-110"
                      : "hover:scale-110"
                  } ${rating === 1 ? "h-11 w-11" : "h-9 w-9"}`}
                  style={{ backgroundColor: RATING_COLORS[rating - 1] }}
                />
              ))}
            </div>

            {/* Labels */}
            <div className="flex justify-between px-1 text-[10px] text-foreground/50">
              <span>Very Unlikely</span>
              <span>Very Likely</span>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
