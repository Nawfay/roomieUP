"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Pencil, ImagePlus, Camera } from "lucide-react"
import { doc, setDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { auth, db, storage } from "@/lib/firebase"
import { CheckeredBackground } from "@/components/bio/checkered-bg"

export function BioProfile() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [bio, setBio] = useState("")
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null)
  const [isEditingBio, setIsEditingBio] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfileImageFile(file)
      const reader = new FileReader()
      reader.onload = (ev) => {
        setProfileImage(ev.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const completionPercent = [name, age, bio, profileImage].filter(Boolean).length * 25

  const handleSave = async () => {
    if (!name || !age) return

    setIsSaving(true)
    const user = auth.currentUser

    if (user) {
      try {
        let profileImageUrl = ""

        // Upload image to Firebase Storage if one was selected
        if (profileImageFile) {
          const imageRef = ref(storage, `profile-images/${user.uid}`)
          await uploadBytes(imageRef, profileImageFile)
          profileImageUrl = await getDownloadURL(imageRef)
        }

        // Save bio data and mark profile as complete
        await setDoc(doc(db, "users", user.uid), {
          name,
          age: parseInt(age),
          bio: bio || "",
          profileImage: profileImageUrl,
          profileComplete: true,
          updatedAt: new Date().toISOString(),
        }, { merge: true })

        router.push("/discover")
      } catch (error) {
        console.error("Error saving bio data:", error)
        alert("There was an error saving your profile. Please try again.")
      } finally {
        setIsSaving(false)
      }
    } else {
      console.error("No user logged in")
      setIsSaving(false)
    }
  }

  return (
    <main className="relative flex min-h-svh flex-col items-center justify-start p-3 pt-6 pb-6">
      <CheckeredBackground />

      {/* Cream card */}
      <div className="relative z-10 flex w-full max-w-[360px] flex-1 flex-col items-center rounded-3xl border-4 border-[#F0A01E] bg-[#FFF8E1] px-4 pt-8 pb-5 shadow-2xl">
        {/* Profile picture */}
        <div className="relative mb-3 shrink-0">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative h-20 w-20 rounded-full border-4 border-[#E8453C] bg-[#FCEEE8] overflow-hidden flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
          >
            {profileImage ? (
              <img src={profileImage || "/placeholder.svg"} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <Camera className="h-7 w-7 text-[#E8453C]/50" />
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            aria-label="Upload profile picture"
          />
        </div>

        {/* Progress badge */}
        <div className="mb-3 shrink-0 rounded-full bg-[#E8453C] px-3 py-0.5">
          <span className="text-[11px] font-semibold text-[#FFF8E1]">{completionPercent}% complete</span>
        </div>

        {/* Name and age inputs */}
        <div className="flex items-baseline justify-center gap-1 mb-4 shrink-0">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-32 bg-transparent text-center font-serif text-xl font-bold text-foreground placeholder:text-foreground/30 focus:outline-none border-b-2 border-dashed border-foreground/20 focus:border-[#E8453C] transition-colors"
          />
          <span className="text-lg text-foreground/40">,</span>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Age"
            className="w-14 bg-transparent text-center font-serif text-xl font-bold text-foreground placeholder:text-foreground/30 focus:outline-none border-b-2 border-dashed border-foreground/20 focus:border-[#E8453C] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>

        {/* Action buttons row - no settings */}
        <div className="flex items-center justify-center gap-10 mb-4 shrink-0">
          <button
            type="button"
            onClick={() => setIsEditingBio(true)}
            className="flex flex-col items-center gap-1 text-foreground/60 hover:text-foreground transition-colors"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FCEEE8] border border-[#F0A01E]/30">
              <Pencil className="h-3.5 w-3.5" />
            </div>
            <span className="text-[10px] font-medium">Edit profile</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center gap-1 text-foreground/60 hover:text-foreground transition-colors"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FCEEE8] border border-[#F0A01E]/30">
              <ImagePlus className="h-3.5 w-3.5" />
            </div>
            <span className="text-[10px] font-medium">Add media</span>
          </button>
        </div>

        {/* Bio area */}
        <div className="w-full flex-1 flex flex-col min-h-0">
          {isEditingBio || !bio ? (
            <div className="flex flex-1 flex-col min-h-0">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                onBlur={() => { if (bio) setIsEditingBio(false) }}
                placeholder="Write a little about yourself..."
                maxLength={300}
                autoFocus={isEditingBio}
                className="flex-1 w-full resize-none rounded-xl bg-[#FCEEE8] border border-[#F0A01E]/30 p-3 text-sm text-foreground leading-relaxed placeholder:text-foreground/30 focus:outline-none focus:border-[#E8453C] transition-colors min-h-[80px]"
              />
              <p className="text-right text-[10px] text-foreground/40 mt-1">{bio.length}/300</p>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditingBio(true)}
              className="flex-1 w-full rounded-xl bg-[#FCEEE8] border border-[#F0A01E]/30 p-3 text-left"
            >
              <p className="text-sm text-foreground leading-relaxed">{bio}</p>
            </button>
          )}
        </div>

        {/* Save button */}
        <button
          type="button"
          onClick={handleSave}
          disabled={!name || !age || isSaving}
          className="mt-4 shrink-0 flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground text-[#FFF8E1] shadow-lg hover:opacity-90 disabled:opacity-40 transition-opacity"
        >
          {isSaving ? (
            <span className="text-xs">...</span>
          ) : (
            <Pencil className="h-4 w-4" />
          )}
        </button>

        {/* Retro stripes */}
        <div className="flex items-end gap-[3px] mt-4 shrink-0">
          <div className="h-10 w-2.5 rounded-full bg-[#E8453C]" />
          <div className="h-8 w-2.5 rounded-full bg-[#F0851E]" />
          <div className="h-6 w-2.5 rounded-full bg-[#F0A01E]" />
          <div className="h-5 w-1.5 rounded-full bg-[#F2C9D0]" />
          <div className="h-4 w-1.5 rounded-full bg-[#C4BFC6]" />
          <div className="h-6 w-2.5 rounded-full bg-[#E4BFC8]" />
          <div className="h-8 w-2.5 rounded-full bg-[#F0A01E]" />
        </div>
      </div>
    </main>
  )
}
