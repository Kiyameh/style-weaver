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
import { getThemeFromUrl, updateUrlWithTheme } from "@/utils/urlState";

interface ThemeContextType {
  currentTheme: Theme | null;

  // Color group management functions
  changeColorGroupName: (oldName: string, newName: string) => void;
  addColorToGroup: (groupName: string, isBrandColor?: boolean) => void;
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

  // Color group management functions (placeholder implementations)
  const changeColorGroupName = useCallback(
    (oldName: string, newName: string) => {
      // TODO: Implement color group name change
      console.log("changeColorGroupName:", { oldName, newName });
    },
    [],
  );

  const addColorToGroup = useCallback(
    (groupName: string, isBrandColor = false) => {
      // TODO: Implement adding color to group with consecutive number (200, 300, 400, 500)
      console.log("addColorToGroup:", { groupName, isBrandColor });
    },
    [],
  );

  const removeLastColorFromGroup = useCallback(
    (groupName: string, isBrandColor = false) => {
      // TODO: Implement removing last color from group
      console.log("removeLastColorFromGroup:", { groupName, isBrandColor });
    },
    [],
  );

  const addContentColorToGroup = useCallback((groupName: string) => {
    // TODO: Implement adding content color to group
    console.log("addContentColorToGroup:", { groupName });
  }, []);

  const removeContentColorFromGroup = useCallback((groupName: string) => {
    // TODO: Implement removing content color from group
    console.log("removeContentColorFromGroup:", { groupName });
  }, []);

  const removeColorGroup = useCallback(
    (groupName: string, isBrandColor = false) => {
      // TODO: Implement removing entire color group
      console.log("removeColorGroup:", { groupName, isBrandColor });
    },
    [],
  );

  const addNewColorGroup = useCallback(
    (groupName: string, isBrandColor = false) => {
      // TODO: Implement adding new color group
      console.log("addNewColorGroup:", { groupName, isBrandColor });
    },
    [],
  );

  // Individual color update functions
  const updateMainColor = useCallback(
    (
      colorGroup: keyof Theme["mainColors"],
      colorKey: string | number,
      newColor: Color,
    ) => {
      if (!currentTheme) return;

      const newTheme: Theme = {
        ...currentTheme,
        mainColors: {
          ...currentTheme.mainColors,
          [colorGroup]: {
            ...currentTheme.mainColors[colorGroup],
            [colorKey]: newColor,
          },
        },
      };

      updateTheme(newTheme);
    },
    [currentTheme, updateTheme],
  );

  const updateBrandColor = useCallback(
    (colorGroup: string, colorKey: string | number, newColor: Color) => {
      if (!currentTheme) return;

      const newTheme: Theme = {
        ...currentTheme,
        brandColors: {
          ...currentTheme.brandColors,
          [colorGroup]: {
            ...currentTheme.brandColors[colorGroup],
            [colorKey]: newColor,
          },
        },
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
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
