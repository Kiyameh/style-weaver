"use client";

import type Color from "colorjs.io";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import DEFAULT_THEME from "@/themes/default";
import type { Theme } from "@/types/Theme";
import {
  addColorToGroup as addColorToGroupUtil,
  addContentColor as addContentColorUtil,
  createColorGroup as createColorGroupUtil,
  removeColorGroup as removeColorGroupUtil,
  removeContentColor as removeContentColorUtil,
  removeLastColorFromGroup as removeLastColorFromGroupUtil,
  renameColorGroup as renameColorGroupUtil,
  updateBrandColor as updateBrandColorUtil,
  updateMainColor as updateMainColorUtil,
} from "@/utils/theme-management";
import { getThemeFromUrl, updateUrlWithTheme } from "@/utils/url-persistence";

interface ThemeContextType {
  currentTheme: Theme | null;

  // Color group management functions
  changeColorGroupName: (oldName: string, newName: string) => void;
  addColorToGroup: (groupName: string, isBrandColor?: boolean, lightnessIncrement?: number) => void;
  removeLastColorFromGroup: (groupName: string, isBrandColor?: boolean) => void;
  addContentColorToGroup: (groupName: string) => void;
  removeContentColorFromGroup: (groupName: string) => void;
  removeColorGroup: (groupName: string, isBrandColor?: boolean) => void;
  addNewColorGroup: (groupName: string, isBrandColor?: boolean) => void;

  // Individual color update functions
  updateMainColor: (
    colorGroup: keyof Theme["mainColors"],
    colorKey: string | number,
    newColor: Color,
  ) => void;
  updateBrandColor: (
    colorGroup: string,
    colorKey: string | number,
    newColor: Color,
  ) => void;

  // Radius and shadow update functions
  updateRadius: (key: string, value: string) => void;
  updateShadow: (key: string, value: string) => void;
  removeRadius: (key: string) => void;
  removeShadow: (key: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize theme from URL or default
  useEffect(() => {
    const urlTheme = getThemeFromUrl();
    if (urlTheme) {
      setCurrentTheme(urlTheme);
    } else {
      setCurrentTheme(DEFAULT_THEME);
      updateUrlWithTheme(DEFAULT_THEME);
    }
  }, []);

  // Debounced URL update function
  const debouncedUpdateUrl = useCallback((theme: Theme) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      updateUrlWithTheme(theme);
    }, 2000);
  }, []);

  // Update theme and URL with debounce
  const updateTheme = useCallback(
    (newTheme: Theme) => {
      setCurrentTheme(newTheme);
      debouncedUpdateUrl(newTheme);
    },
    [debouncedUpdateUrl],
  );

  // Color group management functions
  const changeColorGroupName = useCallback(
    (oldName: string, newName: string) => {
      if (!currentTheme) return;

      const newTheme = renameColorGroupUtil(currentTheme, oldName, newName);
      if (newTheme !== currentTheme) {
        updateTheme(newTheme);
      }
    },
    [currentTheme, updateTheme],
  );

  const addColorToGroup = useCallback(
    (groupName: string, isBrandColor = false, lightnessIncrement = 0.2) => {
      if (!currentTheme) return;

      const newTheme = addColorToGroupUtil(
        currentTheme,
        groupName,
        isBrandColor,
        lightnessIncrement,
      );
      if (newTheme !== currentTheme) {
        updateTheme(newTheme);
      }
    },
    [currentTheme, updateTheme],
  );

  const removeLastColorFromGroup = useCallback(
    (groupName: string, isBrandColor = false) => {
      if (!currentTheme) return;

      const newTheme = removeLastColorFromGroupUtil(
        currentTheme,
        groupName,
        isBrandColor,
      );
      if (newTheme !== currentTheme) {
        updateTheme(newTheme);
      }
    },
    [currentTheme, updateTheme],
  );

  const addContentColorToGroup = useCallback(
    (groupName: string) => {
      if (!currentTheme) return;

      const newTheme = addContentColorUtil(currentTheme, groupName);
      if (newTheme !== currentTheme) {
        updateTheme(newTheme);
      }
    },
    [currentTheme, updateTheme],
  );

  const removeContentColorFromGroup = useCallback(
    (groupName: string) => {
      if (!currentTheme) return;

      const newTheme = removeContentColorUtil(currentTheme, groupName);
      if (newTheme !== currentTheme) {
        updateTheme(newTheme);
      }
    },
    [currentTheme, updateTheme],
  );

  const removeColorGroup = useCallback(
    (groupName: string, isBrandColor = false) => {
      if (!currentTheme) return;

      const newTheme = removeColorGroupUtil(
        currentTheme,
        groupName,
        isBrandColor,
      );
      if (newTheme !== currentTheme) {
        updateTheme(newTheme);
      }
    },
    [currentTheme, updateTheme],
  );

  const addNewColorGroup = useCallback(
    (groupName: string, isBrandColor = false) => {
      if (!currentTheme) return;

      const newTheme = createColorGroupUtil(
        currentTheme,
        groupName,
        isBrandColor,
      );
      if (newTheme !== currentTheme) {
        updateTheme(newTheme);
      }
    },
    [currentTheme, updateTheme],
  );

  // Individual color update functions
  const updateMainColor = useCallback(
    (
      colorGroup: keyof Theme["mainColors"],
      colorKey: string | number,
      newColor: Color,
    ) => {
      if (!currentTheme) return;

      const newTheme = updateMainColorUtil(
        currentTheme,
        colorGroup,
        colorKey,
        newColor,
      );
      updateTheme(newTheme);
    },
    [currentTheme, updateTheme],
  );

  const updateBrandColor = useCallback(
    (colorGroup: string, colorKey: string | number, newColor: Color) => {
      if (!currentTheme) return;

      const newTheme = updateBrandColorUtil(
        currentTheme,
        colorGroup,
        colorKey,
        newColor,
      );
      updateTheme(newTheme);
    },
    [currentTheme, updateTheme],
  );

  // Radius and shadow update functions
  const updateRadius = useCallback(
    (key: string, value: string) => {
      if (!currentTheme) return;

      const newTheme = {
        ...currentTheme,
        radius: {
          ...currentTheme.radius,
          [key]: value,
        },
      };
      updateTheme(newTheme);
    },
    [currentTheme, updateTheme],
  );

  const updateShadow = useCallback(
    (key: string, value: string) => {
      if (!currentTheme) return;

      const newTheme = {
        ...currentTheme,
        shadows: {
          ...currentTheme.shadows,
          [key]: value,
        },
      };
      updateTheme(newTheme);
    },
    [currentTheme, updateTheme],
  );

  const removeRadius = useCallback(
    (key: string) => {
      if (!currentTheme) return;

      const { [key]: _, ...restRadius } = currentTheme.radius;
      const newTheme = {
        ...currentTheme,
        radius: restRadius,
      };
      updateTheme(newTheme);
    },
    [currentTheme, updateTheme],
  );

  const removeShadow = useCallback(
    (key: string) => {
      if (!currentTheme) return;

      const { [key]: _, ...restShadows } = currentTheme.shadows;
      const newTheme = {
        ...currentTheme,
        shadows: restShadows,
      };
      updateTheme(newTheme);
    },
    [currentTheme, updateTheme],
  );

  const contextValue: ThemeContextType = {
    currentTheme,
    changeColorGroupName,
    addColorToGroup,
    removeLastColorFromGroup,
    addContentColorToGroup,
    removeContentColorFromGroup,
    removeColorGroup,
    addNewColorGroup,
    updateMainColor,
    updateBrandColor,
    updateRadius,
    updateShadow,
    removeRadius,
    removeShadow,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
