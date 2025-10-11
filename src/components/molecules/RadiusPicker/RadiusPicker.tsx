import CssRadiusInput, {
	type CssRadiusValue,
} from "@/components/atoms/CssRadiusInput";
import Popover from "@/components/atoms/Popover";
import s from "./RadiusPicker.module.css";

export const RadiusPicker = ({
	name,
	onChange,
	value,
	min,
	max,
	step,
}: {
	name?: string;
	onChange: (radius: CssRadiusValue) => void;
	value: CssRadiusValue;
	min?: number;
	max?: number;
	step?: number;
}) => {
	const radiusValue = `${value.value}${value.unit}`;

	return (
		<Popover
			trigger={
				<button
					type="button"
					className={s.trigger}
					style={{
						"--radius-value": radiusValue,
					} as React.CSSProperties}
					title={name}
					aria-label={`Select border radius ${name}`}
				>
					<div className={s.previewBox} />
				</button>
			}
		>
			<p className={s.name}>{name}</p>
			<CssRadiusInput
				onRadiusChange={onChange}
				value={value}
				min={min}
				max={max}
				step={step}
			/>
		</Popover>
	);
};
