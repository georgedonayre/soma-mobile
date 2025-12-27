// src/utils/quoteManager.ts
import { Quote, quotes } from "@/src/config/quotes";

/**
 * Get a random quote
 */
export const getRandomQuote = (): Quote => {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
};

/**
 * Get quote of the day (same quote throughout the day)
 * Uses date as seed for consistent daily quote
 */
export const getQuoteOfTheDay = (): Quote => {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );

  // Use day of year as seed for consistent daily quote
  const index = dayOfYear % quotes.length;
  return quotes[index];
};

/**
 * Get quote by category
 */
export const getQuoteByCategory = (category: string): Quote => {
  const filtered = quotes.filter((q) => q.category === category);
  if (filtered.length === 0) return getRandomQuote();

  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
};

/**
 * Get all available categories
 */
export const getCategories = (): string[] => {
  const categories = quotes
    .map((q) => q.category)
    .filter((cat): cat is string => Boolean(cat));
  return [...new Set(categories)];
};

/**
 * Search quotes by text
 */
export const searchQuotes = (searchTerm: string): Quote[] => {
  const term = searchTerm.toLowerCase();
  return quotes.filter(
    (q) =>
      q.text.toLowerCase().includes(term) ||
      q.author.toLowerCase().includes(term)
  );
};
