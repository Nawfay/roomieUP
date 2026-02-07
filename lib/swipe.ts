export interface Profile {
  id: string
  name: string
  age: number
  bio: string
  image: string
  traits: {
    cleanliness: number
    loudness: number
    niceness: number
    socialness: number
    organizedness: number
    bedtimeness: number
    budgetness: number
  }
}

export const FAKE_PROFILES: Profile[] = [
  {
    id: "1",
    name: "Alex",
    age: 24,
    bio: "Software engineer who loves cooking and hiking on weekends. Looking for a chill roommate who respects quiet hours.",
    image: "https://i.pravatar.cc/300?img=12",
    traits: {
      cleanliness: 18,
      loudness: 12,
      niceness: 22,
      socialness: 15,
      organizedness: 20,
      bedtimeness: 16,
      budgetness: 19,
    },
  },
  {
    id: "2",
    name: "Jordan",
    age: 22,
    bio: "Grad student studying architecture. Night owl who's usually at the library. Love plants and minimalist spaces.",
    image: "https://i.pravatar.cc/300?img=33",
    traits: {
      cleanliness: 22,
      loudness: 10,
      niceness: 20,
      socialness: 12,
      organizedness: 24,
      bedtimeness: 8,
      budgetness: 16,
    },
  },
  {
    id: "3",
    name: "Sam",
    age: 26,
    bio: "Freelance designer working from home. Love hosting game nights and trying new recipes. Early bird!",
    image: "https://i.pravatar.cc/300?img=45",
    traits: {
      cleanliness: 16,
      loudness: 20,
      niceness: 24,
      socialness: 25,
      organizedness: 18,
      bedtimeness: 22,
      budgetness: 15,
    },
  },
  {
    id: "4",
    name: "Taylor",
    age: 23,
    bio: "Marketing professional who travels for work. Clean, organized, and looking for someone responsible to share a space with.",
    image: "https://i.pravatar.cc/300?img=28",
    traits: {
      cleanliness: 25,
      loudness: 14,
      niceness: 21,
      socialness: 18,
      organizedness: 26,
      bedtimeness: 19,
      budgetness: 22,
    },
  },
  {
    id: "5",
    name: "Casey",
    age: 25,
    bio: "Yoga instructor and coffee enthusiast. Love a peaceful home environment and Sunday morning farmers markets.",
    image: "https://i.pravatar.cc/300?img=16",
    traits: {
      cleanliness: 20,
      loudness: 8,
      niceness: 26,
      socialness: 16,
      organizedness: 19,
      bedtimeness: 24,
      budgetness: 14,
    },
  },
  {
    id: "6",
    name: "Morgan",
    age: 27,
    bio: "Teacher who loves reading and baking. Looking for a friendly roommate who enjoys good conversations over tea.",
    image: "https://i.pravatar.cc/300?img=41",
    traits: {
      cleanliness: 19,
      loudness: 11,
      niceness: 25,
      socialness: 20,
      organizedness: 21,
      bedtimeness: 20,
      budgetness: 18,
    },
  },
  {
    id: "7",
    name: "Riley",
    age: 24,
    bio: "Musician and barista. Pretty laid back but always clean up after myself. Love having friends over on weekends.",
    image: "https://i.pravatar.cc/300?img=52",
    traits: {
      cleanliness: 17,
      loudness: 22,
      niceness: 23,
      socialness: 24,
      organizedness: 15,
      bedtimeness: 10,
      budgetness: 13,
    },
  },
  {
    id: "8",
    name: "Avery",
    age: 26,
    bio: "Data analyst who works 9-5. Enjoy quiet evenings with a good book or movie. Very budget-conscious and organized.",
    image: "https://i.pravatar.cc/300?img=8",
    traits: {
      cleanliness: 21,
      loudness: 9,
      niceness: 19,
      socialness: 11,
      organizedness: 25,
      bedtimeness: 21,
      budgetness: 26,
    },
  },
]
