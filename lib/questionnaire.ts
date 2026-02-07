export const QUESTIONNAIRE_DATA = {
  scale: {
    min: 1,
    max: 5,
    labels: {
      "1": "Very Unlikely",
      "2": "Unlikely",
      "3": "Neutral",
      "4": "Likely",
      "5": "Very Likely",
    },
  },
  questions: [
    {
      id: "Q1",
      text: "You notice shared spaces getting messy and no one has said anything. How likely are you to clean and suggest a simple system to keep it tidy?",
      traits: {
        cleanliness: 0.9,
        organizedness: 0.7,
        niceness: 0.4,
      },
    },
    {
      id: "Q2",
      text: "It's late and your roommate is sleeping. How likely are you to keep noise to a minimum (headphones, low volume, quiet movement)?",
      traits: {
        loudness: 1.0,
        bedtimeness: 0.7,
        niceness: 0.4,
      },
    },
    {
      id: "Q3",
      text: "Your roommate wants to have friends over. How likely are you to be okay with it while calmly setting any boundaries you have?",
      traits: {
        socialness: 0.9,
        loudness: 0.5,
        niceness: 0.5,
      },
    },
    {
      id: "Q4",
      text: "You and your roommate are managing rent, bills, and shared purchases. How likely are you to track expenses and stick to agreed budgets?",
      traits: {
        budgetness: 1.0,
        organizedness: 0.6,
        niceness: 0.4,
      },
    },
    {
      id: "Q5",
      text: "You tend to be awake late. How likely are you to adjust your routine so it doesn't disturb your roommate?",
      traits: {
        bedtimeness: 0.8,
        loudness: 0.6,
        socialness: 0.4,
      },
    },
    {
      id: "Q6",
      text: "Shared supplies are running low (toilet paper, cleaning products). How likely are you to replace them without being reminded?",
      traits: {
        cleanliness: 0.6,
        budgetness: 0.6,
        organizedness: 0.6,
      },
    },
    {
      id: "Q7",
      text: "A disagreement comes up about how the apartment should be run. How likely are you to compromise and find a middle ground?",
      traits: {
        niceness: 1.0,
        socialness: 0.6,
        organizedness: 0.3,
      },
    },
  ],
  traits: [
    "cleanliness",
    "loudness",
    "niceness",
    "socialness",
    "organizedness",
    "bedtimeness",
    "budgetness",
  ],
}

export type TraitScores = Record<string, number>

export function calculateTraitScores(
  answers: Record<string, number>
): TraitScores {
  const scores: TraitScores = {}

  // Initialize all traits to 0
  QUESTIONNAIRE_DATA.traits.forEach((trait) => {
    scores[trait] = 0
  })

  // Calculate scores based on answers
  QUESTIONNAIRE_DATA.questions.forEach((question) => {
    const answerValue = answers[question.id] || 0
    Object.entries(question.traits).forEach(([trait, weight]) => {
      scores[trait] += answerValue * weight
    })
  })

  return scores
}
