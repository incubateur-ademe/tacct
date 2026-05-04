export const MinuteToHours = (minutes: number) => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  if (minutes % 60 === 0) {
    return `${minutes / 60} h`;
  }
  return `${Math.floor(minutes / 60)} h ${minutes % 60} min`;
};
