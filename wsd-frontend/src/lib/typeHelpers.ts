export const getKeys = Object.keys as <T extends object>(obj: T) => Array<keyof T>

export type RecursivePartial<T> = { [P in keyof T]?: RecursivePartial<T[P]> }

export function forcedType<T>(obj: unknown): T {
  /**
   * This function is a type assertion function that allows you to assert
   * that a property of an object is of a certain type.
   */
  return obj as unknown as T
}
