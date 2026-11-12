export const isBrowser = typeof window === "object" && typeof document === "object";

export const isIOS = (): boolean =>
  typeof navigator !== "undefined" &&
  (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));

export const remplacerAncreSansNavigationNext = (ancre: string): string => {
  const url = new URL(window.location.href);
  url.hash = ancre;
  window.history.replaceState(window.history.state, "", url);
  return url.toString();
};
