/*
  Add or edit subjects, chapters and questions here.

  correct = 0,1,2,3
*/
const STUDY_DATA = [
  {
    id: "math",
    name: "Mathematics",
    icon: "∑",
    description: "Practice arithmetic, algebra and geometry.",
    chapters: [
      {
        id: "number-system",
        name: "Number System",
        questions: [
          {
            q: "What is 15 × 4?",
            options: ["45", "50", "60", "75"],
            correct: 2,
            explanation: "15 × 4 = 60."
          },
          {
            q: "Which number is prime?",
            options: ["21", "29", "35", "39"],
            correct: 1,
            explanation: "29 has only two positive factors: 1 and 29."
          },
          {
            q: "What is the HCF of 12 and 18?",
            options: ["3", "6", "9", "12"],
            correct: 1,
            explanation: "The greatest common factor of 12 and 18 is 6."
          }
        ]
      },
      {
        id: "algebra",
        name: "Algebra",
        questions: [
          {
            q: "If x + 7 = 12, what is x?",
            options: ["3", "4", "5", "6"],
            correct: 2,
            explanation: "Subtract 7 from both sides: x = 5."
          },
          {
            q: "What is 3a + 2a?",
            options: ["5a", "6a", "5a²", "a"],
            correct: 0,
            explanation: "Like terms are added: 3a + 2a = 5a."
          }
        ]
      }
    ]
  },
  {
    id: "science",
    name: "Science",
    icon: "⚗",
    description: "Test your basics of physics, chemistry and biology.",
    chapters: [
      {
        id: "physics",
        name: "Physics Basics",
        questions: [
          {
            q: "What is the SI unit of force?",
            options: ["Joule", "Watt", "Newton", "Pascal"],
            correct: 2,
            explanation: "Force is measured in newtons (N)."
          },
          {
            q: "Which force pulls objects toward Earth?",
            options: ["Friction", "Gravity", "Magnetism", "Buoyancy"],
            correct: 1,
            explanation: "Earth's gravitational force attracts objects toward its center."
          }
        ]
      },
      {
        id: "biology",
        name: "Biology Basics",
        questions: [
          {
            q: "Which organ pumps blood around the human body?",
            options: ["Lung", "Kidney", "Heart", "Liver"],
            correct: 2,
            explanation: "The heart pumps blood through the circulatory system."
          }
        ]
      }
    ]
  },
  {
    id: "english",
    name: "English",
    icon: "A",
    description: "Practice grammar, vocabulary and sentence skills.",
    chapters: [
      {
        id: "grammar",
        name: "Grammar",
        questions: [
          {
            q: "Which word is a noun?",
            options: ["Quickly", "Beautiful", "Teacher", "Run"],
            correct: 2,
            explanation: "Teacher is a noun because it names a person."
          },
          {
            q: "Choose the correct sentence.",
            options: [
              "She go to school.",
              "She goes to school.",
              "She going school.",
              "She gone to school."
            ],
            correct: 1,
            explanation: "With 'she' in the simple present, 'goes' is correct."
          }
        ]
      }
    ]
  },
  {
    id: "gk",
    name: "General Knowledge",
    icon: "★",
    description: "Quick practice for everyday general knowledge.",
    chapters: [
      {
        id: "world",
        name: "World",
        questions: [
          {
            q: "What is the largest ocean on Earth?",
            options: ["Atlantic", "Indian", "Arctic", "Pacific"],
            correct: 3,
            explanation: "The Pacific Ocean is the largest ocean."
          },
          {
            q: "Which planet is known as the Red Planet?",
            options: ["Earth", "Mars", "Jupiter", "Venus"],
            correct: 1,
            explanation: "Mars appears reddish due to iron-rich minerals on its surface."
          }
        ]
      }
    ]
  }
];
