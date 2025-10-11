/**
 * Gets the keys that should be removed when reducing variant count
 * @param currentKeys - Array of current keys
 * @param targetCount - Target number of variants
 * @returns Array of keys to remove
 */
export function getKeysToRemove(
  currentKeys: string[],
  targetCount: number,
): string[] {
  return currentKeys.slice(targetCount);
}

/**
 * Calculates the difference between current and target variant count
 * @param currentCount - Current number of variants
 * @param targetCount - Target number of variants
 * @returns Difference (positive = add, negative = remove)
 */
export function calculateVariantDiff(
  currentCount: number,
  targetCount: number,
): number {
  return targetCount - currentCount;
}

/**
 * Validates if a target count is within allowed limits
 * @param targetCount - Target number of variants
 * @param maxVariants - Maximum allowed variants
 * @param minVariants - Minimum allowed variants
 * @returns True if valid
 */
export function isValidVariantCount(
  targetCount: number,
  maxVariants: number = 10,
  minVariants: number = 1,
): boolean {
  return targetCount >= minVariants && targetCount <= maxVariants;
}
