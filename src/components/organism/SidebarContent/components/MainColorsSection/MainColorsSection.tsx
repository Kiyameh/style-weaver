import type Color from "colorjs.io";
import { ColorPicker } from "@/components/molecules/ColorPicker/ColorPicker";
import { useTheme } from "@/contexts/ThemeContext";
import type { Theme } from "@/types/Theme";
import {
	DEFAULT_LIGHTNESS_INCREMENT,
	getNumericVariantCount,
	sortColorsWithContentFirst,
} from "../../utils";
import s from "./MainColorsSection.module.css";

export const MainColorsSection = () => {
	const {
		currentTheme,
		updateMainColor,
		addColorToGroup,
		removeLastColorFromGroup,
	} = useTheme();

	if (!currentTheme) return null;

	const createMainColorChangeHandler = (
		colorGroup: keyof Theme["mainColors"],
		colorKey: string | number,
	) => {
		return (newColor: Color) => updateMainColor(colorGroup, colorKey, newColor);
	};

	const handleVariantAdd = (groupName: string) => {
		addColorToGroup(groupName, false, DEFAULT_LIGHTNESS_INCREMENT);
	};

	const handleVariantRemove = (groupName: string) => {
		removeLastColorFromGroup(groupName, false);
	};

	return (
		<section className={s.section}>
			<h3>Main Colors</h3>
			{Object.entries(currentTheme.mainColors).map(([colorGroup, colors]) => {
				const numericCount = getNumericVariantCount(Object.keys(colors));

				return (
					<div key={colorGroup}>
						<header className={s.groupHeader}>
							<h4>{colorGroup}</h4>
							<div className={s.variantControl}>
								<button
									type="button"
									onClick={() => {
										if (numericCount > 1) {
											handleVariantRemove(colorGroup);
										}
									}}
									disabled={numericCount <= 1}
								>
									-
								</button>
								<span>{numericCount} Variants</span>
								<button
									type="button"
									onClick={() => handleVariantAdd(colorGroup)}
									disabled={numericCount >= 10}
								>
									+
								</button>
							</div>
						</header>
						<div className={s.colorGroup}>
							{sortColorsWithContentFirst(
								Object.entries(colors as Record<string, Color>),
							).map(([colorKey, color]) => (
								<ColorPicker
									key={`${colorGroup}-${colorKey}`}
									name={`${colorGroup}-${colorKey}`}
									onChange={createMainColorChangeHandler(
										colorGroup as keyof Theme["mainColors"],
										colorKey,
									)}
									value={color}
									background={currentTheme.mainColors.surface["100"]}
									mode={colorGroup as "surface" | "content" | "border"}
								/>
							))}
						</div>
					</div>
				);
			})}
		</section>
	);
};
