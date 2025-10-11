import { useTheme } from "@/contexts/ThemeContext";
import { BrandColorsSection } from "./components/BrandColorsSection";
import { MainColorsSection } from "./components/MainColorsSection";
import { RadiusSection } from "./components/RadiusSection";
import { ShadowsSection } from "./components/ShadowsSection";

/**
 * SidebarContent - Main sidebar component that orchestrates all theme editing sections
 *
 * This component has been refactored into smaller, focused subcomponents:
 * - MainColorsSection: Handles surface, content, and border colors
 * - BrandColorsSection: Handles brand colors with editable names and content variants
 * - RadiusSection: Handles border radius variants
 * - ShadowsSection: Handles box shadow variants
 *
 * All business logic has been extracted to utility functions in the ./utils folder
 */
const SidebarContent = () => {
  const { currentTheme } = useTheme();

  if (!currentTheme) return null;

  return (
    <>
      <MainColorsSection />
      <BrandColorsSection />
      <RadiusSection />
      <ShadowsSection />
    </>
  );
};

export default SidebarContent;
