// src/data/quotes.ts
export interface Quote {
  text: string;
  author: string;
  category?: string; // optional: motivation, fitness, nutrition, mindset
}

export const quotes: Quote[] = [
  {
    text: "Success is the sum of small efforts repeated day in and day out.",
    author: "Robert Collier",
    category: "motivation",
  },
  {
    text: "The only bad workout is the one that didn't happen.",
    author: "Unknown",
    category: "fitness",
  },
  {
    text: "Take care of your body. It's the only place you have to live.",
    author: "Jim Rohn",
    category: "health",
  },
  {
    text: "You don't have to be extreme, just consistent.",
    author: "Unknown",
    category: "motivation",
  },
  {
    text: "The groundwork of all happiness is health.",
    author: "Leigh Hunt",
    category: "health",
  },
  {
    text: "Strive for progress, not perfection.",
    author: "Unknown",
    category: "mindset",
  },
  {
    text: "Your body can stand almost anything. It's your mind you have to convince.",
    author: "Unknown",
    category: "fitness",
  },
  {
    text: "Eat to nourish your body, not to feed your emotions.",
    author: "Unknown",
    category: "nutrition",
  },
  {
    text: "A year from now you'll wish you had started today.",
    author: "Karen Lamb",
    category: "motivation",
  },
  {
    text: "Small daily improvements over time lead to stunning results.",
    author: "Robin Sharma",
    category: "motivation",
  },
];
