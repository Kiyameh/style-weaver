/**
 * Standard size keys for variants (sm, md, lg, xl, 2xl, etc.)
 */
export const SIZE_KEYS = [
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
  "5xl",
  "6xl",
  "7xl",
];

/**
 * Generates the next size key based on the last key
 * @param lastKey - The last key in the sequence
 * @param sizeKeys - Array of size keys to use
 * @returns Next size key
 */
export function getNextSizeKey(
  lastKey: string,
  sizeKeys: string[] = SIZE_KEYS,
): string {
  const lastIndex = sizeKeys.indexOf(lastKey);

  if (lastIndex >= 0 && lastIndex < sizeKeys.length - 1) {
    return sizeKeys[lastIndex + 1];
  }

  // If we've used all predefined keys, generate 8xl, 9xl, 10xl...
  const xlMatch = lastKey.match(/^(\d+)xl$/);
  if (xlMatch) {
    // biome-ignore lint/correctness/useParseIntRadix: <valid>
    const num = parseInt(xlMatch[1]);
    return `${num + 1}xl`;
  }

  return "8xl";
}

/**
 * Generates the next key for a variant based on current keys
 * @param currentKeys - Array of current keys
 * @param sizeKeys - Array of size keys to use
 * @returns Next key to use
 */
export function generateNextKey(
  currentKeys: string[],
  sizeKeys: string[] = SIZE_KEYS,
): string {
  if (currentKeys.length === 0) {
    return "sm";
  }

  const lastKey = currentKeys[currentKeys.length - 1];
  return getNextSizeKey(lastKey, sizeKeys);
}
