
/**
 * Stub to trick eslint.
 * @deprecated
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Any = any;


export type OmitStartsWith<T, K extends string> = {
  [Key in keyof T as Key extends `${K}${string}` ? never : Key]: T[Key];
};
