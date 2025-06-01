/**
 * Formats a date string for display.
 * Ensures the date is treated as local by appending T00:00:00 if no time component is present.
 * @param dateString The date string to format (expected as YYYY-MM-DD).
 * @param formatPreset The preset for formatting.
 *                     'short': e.g., 01/15/2023 (en-US) or 15/01/2023 (en-GB)
 *                     'long': e.g., January 15, 2023 (en-US) or 15 January 2023 (en-GB)
 *                     'monthYearOnly': e.g., Jan 2023 (en-US) or Jan 2023 (en-GB)
 *                     'dayMonth': e.g., 15 Jan (en-US) or 15 Jan (en-GB)
 *                     'dayMonthShort': e.g., Jan 15 (FinTrack style for charts)
 *                     'shortWithYear': e.g., Jan 01, 2023 (en-US) or 01 Jan 2023 (en-GB)
 *                     'shortMonthOnly': e.g., Jan (en-US)
 * @returns The formatted date string.
 */
export const formatDisplayDate = (
  dateString: string,
  formatPreset: 'short' | 'long' | 'monthYearOnly' | 'dayMonth' | 'dayMonthShort' | 'shortWithYear' | 'shortMonthOnly'
): string => {
  // Ensure the date string is treated as local time if only date is provided
  // Safari and Firefox can interpret YYYY-MM-DD as UTC, so append time if not present.
  const adjustedDateString = dateString.includes('T') ? dateString : `${dateString}T00:00:00`;
  const date = new Date(adjustedDateString);

  switch (formatPreset) {
    case 'short':
      return date.toLocaleDateString(undefined, { // Use browser's default locale
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    case 'long':
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    case 'monthYearOnly':
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
      });
    case 'dayMonth': // e.g., 15 Jan
      return date.toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
      });
    case 'dayMonthShort': // e.g., Jan 15 (FinTrack chart style)
       return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    case 'shortWithYear':
      return date.toLocaleDateString(undefined, { // Use browser's default locale
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    case 'shortMonthOnly':
      return date.toLocaleDateString('en-US', { // 'en-US' to ensure "Jan", "Feb", etc.
        month: 'short',
      });
    default:
      // Fallback to a common format or throw error
      return date.toLocaleDateString('en-CA'); // YYYY-MM-DD as a default
  }
};
