import { numberWithSpacesRegex } from "../regex";

export const Round = (value: number, precision: number) => {
  const multiplier = Math.pow(10, precision || 0);
  const result = numberWithSpacesRegex(Math.round(value * multiplier) / multiplier);
  return result
};
