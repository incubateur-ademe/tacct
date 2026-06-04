export const Sum = (arr: number[]) => {
  return arr.reduce(function (a, b) {
    return a + b;
  }, 0);
};

export const SumWithNullHandling = (arr: (number | null)[]): number | null => {
  const allNull = arr.every((value) => value === null);

  if (allNull) {
    return null;
  }

  return arr.reduce((a: number, b) => {
    return a + (b ?? 0);
  }, 0);
};

export const addWithNullHandling = (
  ...values: (number | null)[]
): number | null => {
  const allNull = values.every((value) => value === null);

  if (allNull) {
    return null;
  }

  return values.reduce((sum: number, value) => sum + (value ?? 0), 0);
};
