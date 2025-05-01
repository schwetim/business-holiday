import { parseISO, addDays, format, differenceInDays } from 'date-fns';

/**
 * Parses an ISO date string into a Date object.
 * @param dateString The date string to parse.
 * @returns A Date object.
 */
export const parseDateString = (dateString: string): Date => {
  return parseISO(dateString);
};

/**
 * Adds or subtracts days from a Date object.
 * @param date The starting Date object.
 * @param days The number of days to add (positive) or subtract (negative).
 * @returns A new Date object.
 */
export const addSubtractDays = (date: Date, days: number): Date => {
  return addDays(date, days);
};

/**
 * Formats a Date object into an ISO string (YYYY-MM-DD).
 * @param date The Date object to format.
 * @returns An ISO date string.
 */
export const formatDateToISO = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

/**
 * Calculates the inclusive difference in days between two Date objects.
 * @param startDate The start Date object.
 * @param endDate The end Date object.
 * @returns The number of days (inclusive).
 */
export const calculateInclusiveDuration = (startDate: Date, endDate: Date): number => {
  // differenceInDays returns the number of full days between dates.
  // To make it inclusive, we add 1.
  return differenceInDays(endDate, startDate) + 1;
};

/**
 * Formats a date range for display.
 * @param start The start Date object.
 * @param end The end Date object.
 * @returns A formatted date range string (e.g., "Apr 27, 2025 - May 2, 2025").
 */
export const formatDisplayDateRange = (start: Date, end: Date): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return `${start.toLocaleDateString(undefined, options)} - ${end.toLocaleDateString(undefined, options)}`;
};

/**
 * Checks if a selected date range fully includes an event date range.
 * @param selectedStart The start Date of the selected range.
 * @param selectedEnd The end Date of the selected range.
 * @param eventStart The start Date of the event range.
 * @param eventEnd The end Date of the event range.
 * @returns True if the selected range includes the event range, false otherwise.
 */
export const isDateRangeValid = (selectedStart: Date, selectedEnd: Date, eventStart: Date, eventEnd: Date): boolean => {
  // The selected range is valid if its start is on or before the event start,
  // AND its end is on or after the event end.
  return selectedStart <= eventStart && selectedEnd >= eventEnd;
};
