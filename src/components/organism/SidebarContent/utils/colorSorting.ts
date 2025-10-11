/**
 * Checks if a key is the "content" key
 * @param key - Key to check
 * @returns True if key is "content"
 */
export function isContentKey(key: string): boolean {
  return key === "content";
}

/**
 * Sorts color entries with "content" always first
 * @param entries - Array of [key, value] entries
 * @returns Sorted array with "content" first
 */
export function sortColorsWithContentFirst<T>(
  entries: [string, T][],
): [string, T][] {
  return entries.sort(([keyA], [keyB]) => {
    // "content" always comes first
    if (keyA === "content") return -1;
    if (keyB === "content") return 1;
    // Otherwise maintain original order
    return 0;
  });
}

/**
 * Gets the count of numeric variants (excluding "content")
 * @param keys - Array of keys
 * @returns Count of numeric keys
 */
export function getNumericVariantCount(keys: string[]): number {
  return keys.filter((key) => !Number.isNaN(Number(key))).length;
}
