import { DateTime } from "luxon";
export const calculateDifferent = (date: string) => {
  const diff = DateTime.now().setZone("utc").diff(DateTime.fromISO(date));
  const days = diff.as("days");
  const hours = diff.as("hours");
  const minutes = diff.as("minutes");

  let output = "قبل ";

  if (days >= 1) {
    output += `${Math.floor(days)} يوم `;
  }

  if (hours >= 1 && days < 1) {
    output += `${Math.floor(hours)} ساعة `;
  }

  if (minutes < 60 && days < 1) {
    output += `${Math.floor(minutes)} دقيقة `;
  }
  return output.trim();
};
