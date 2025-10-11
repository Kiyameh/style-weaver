import { ShadowPicker } from "@/components/molecules/ShadowPicker";
import { useTheme } from "@/contexts/ThemeContext";
import {
  formatShadowValue,
  generateNextKey,
  getKeysToRemove,
  parseShadowString,
  SIZE_KEYS,
} from "../../utils";
import s from "./ShadowsSection.module.css";

export const ShadowsSection = () => {
  const { currentTheme, updateShadow, removeShadow } = useTheme();

  if (!currentTheme) return null;

  const handleShadowVariantAdd = () => {
    const currentKeys = Object.keys(currentTheme.shadows);
    const nextKey = generateNextKey(currentKeys, SIZE_KEYS);

    // Get default value from last variant or use default
    const defaultValue =
      currentKeys.length > 0
        ? currentTheme.shadows[currentKeys[currentKeys.length - 1]]
        : "0 2px 4px oklch(0 0 0 / 0.1)";

    updateShadow(nextKey, defaultValue);
  };

  const handleShadowVariantRemove = () => {
    const currentKeys = Object.keys(currentTheme.shadows);
    const keysToRemove = getKeysToRemove(currentKeys, currentKeys.length - 1);

    keysToRemove.forEach((key) => {
      removeShadow(key);
    });
  };

  const createShadowChangeHandler = (key: string) => {
    return (newShadow: ReturnType<typeof parseShadowString>) => {
      const shadowString = formatShadowValue(newShadow);
      updateShadow(key, shadowString);
    };
  };

  const currentCount = Object.keys(currentTheme.shadows).length;

  return (
    <section className={s.section}>
      <header className={s.groupHeader}>
        <h3>Box Shadows</h3>
        <div className={s.variantControl}>
          <button
            type="button"
            onClick={handleShadowVariantRemove}
            disabled={currentCount <= 1}
          >
            -
          </button>
          <span>{currentCount} Variants</span>
          <button
            type="button"
            onClick={handleShadowVariantAdd}
            disabled={currentCount >= 10}
          >
            +
          </button>
        </div>
      </header>
      <div className={s.colorGroup}>
        {Object.entries(currentTheme.shadows).map(([key, shadowStr]) => (
          <ShadowPicker
            key={key}
            name={key}
            value={parseShadowString(shadowStr)}
            onChange={createShadowChangeHandler(key)}
          />
        ))}
      </div>
    </section>
  );
};
