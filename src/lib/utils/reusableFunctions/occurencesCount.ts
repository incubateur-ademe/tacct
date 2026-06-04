import { GenericObject } from '@/app/(main)/types';

export const CountOcc = <T extends GenericObject>(arr: T[], item: keyof T) => {
  if (Array.isArray(arr)) {
    return arr?.reduce(
      (prev, curr) => {
        const key = String(curr[item]);
        prev[key] = ++prev[key] || 1;
        return prev;
      },
      {} as Record<string, number>
    );
  } else {
    return {};
  }
};

export const CountOccByIndex = <T extends GenericObject>(
  arr: T[],
  byIndex: string,
  item: keyof T
) => {
  const newArray: T[] = [];
  const arraySortedByIndex = arr
    ? [...new Set(arr.map((it) => it[byIndex]))].toSorted()
    : [''];
  arraySortedByIndex?.forEach((date) => {
    const elementByDate = arr?.filter((el) => el[byIndex] === date);
    const elementByTypes = CountOcc(elementByDate, item);
    const elementToPush = {
      indexName: date,
      ...elementByTypes
    };
    newArray.push(elementToPush as unknown as T);
  });
  return newArray;
};
