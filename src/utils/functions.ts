import { format, parseISO } from "date-fns";

export function dateFormatter(
  dateInput: string | Date,
  dateFormat: string = "MMM d, yyyy"
): string {
  try {
    const date =
      typeof dateInput === "string" ? parseISO(dateInput) : dateInput;
    return format(date, dateFormat);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
}

export function calculateDaysBetweenDates(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const differenceInTime = end.getTime() - start.getTime();

  const differenceInDays = differenceInTime / (1000 * 3600 * 24);

  return differenceInDays;
}
