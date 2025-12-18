import { format } from "date-fns";

export const formatDashboardDate = (
  date: Date
): { day: string; date: string } => {
  return {
    day: format(date, "EEEE"), // "Tuesday"
    date: format(date, "MMM d, yyyy"), // "Dec 16, 2025"
  };
};

export const formatMealTime = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, "h:mm a"); // "8:30 AM"
};

export const isToday = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};
