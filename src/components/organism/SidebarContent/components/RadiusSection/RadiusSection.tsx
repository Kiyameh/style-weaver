import { RadiusPicker } from "@/components/molecules/RadiusPicker";
import { useTheme } from "@/contexts/ThemeContext";
import {
  formatRadiusValue,
  generateNextKey,
  getKeysToRemove,
  parseRadiusString,
  SIZE_KEYS,
} from "../../utils";
import s from "./RadiusSection.module.css";

export const RadiusSection = () => {
  const { currentTheme, updateRadius, removeRadius } = useTheme();

  if (!currentTheme) return null;

  const handleRadiusVariantAdd = () => {
    const currentKeys = Object.keys(currentTheme.radius);
    const nextKey = generateNextKey(currentKeys, SIZE_KEYS);

    // Get default value from last variant or use default
    const defaultValue =
      currentKeys.length > 0
        ? currentTheme.radius[currentKeys[currentKeys.length - 1]]
        : "0.5rem";

    updateRadius(nextKey, defaultValue);
  };

  const handleRadiusVariantRemove = () => {
    const currentKeys = Object.keys(currentTheme.radius);
    const keysToRemove = getKeysToRemove(currentKeys, currentKeys.length - 1);

    keysToRemove.forEach((key) => {
      removeRadius(key);
    });
  };

  const createRadiusChangeHandler = (key: string) => {
    return (newRadius: ReturnType<typeof parseRadiusString>) => {
      const radiusString = formatRadiusValue(newRadius);
      updateRadius(key, radiusString);
    };
  };

  const currentCount = Object.keys(currentTheme.radius).length;

  return (
    <section className={s.section}>
      <header className={s.groupHeader}>
        <h3>Border Radius</h3>
        <div className={s.variantControl}>
          <button
            type="button"
            onClick={handleRadiusVariantRemove}
            disabled={currentCount <= 1}
          >
            -
          </button>
          <span>{currentCount} Variants</span>
          <button
            type="button"
            onClick={handleRadiusVariantAdd}
            disabled={currentCount >= 10}
          >
            +
          </button>
        </div>
      </header>
      <div className={s.colorGroup}>
        {Object.entries(currentTheme.radius).map(([key, radiusStr]) => (
          <RadiusPicker
            key={key}
            name={`radius-${key}`}
            value={parseRadiusString(radiusStr)}
            onChange={createRadiusChangeHandler(key)}
          />
        ))}
      </div>
    </section>
  );
};
