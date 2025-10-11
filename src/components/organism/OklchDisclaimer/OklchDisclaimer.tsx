import { ExternalLink, Paintbrush } from "lucide-react";
import s from "./OklchDisclaimer.module.css";

/**
 * OklchDisclaimer - Component that explains why OKLCH color space is used
 *
 * Displays a decorative disclaimer with a link to Evil Martians article
 * explaining the benefits of OKLCH over RGB/HSL.
 */
export const OklchDisclaimer = () => {
	return (
		<section className={s.disclaimer}>
			<div className={s.disclaimerContent}>
				<h4>
					<span>Why </span>
					<span>O</span>
					<span>k</span>
					<span>l</span>
					<span>c</span>
					<span>h</span>
					<span>?</span>
				</h4>
				<a
					href="https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl"
					target="_blank"
					rel="noopener"
				>
					Let's ask Evil Martians
					<ExternalLink size={14} />
				</a>
			</div>
			<Paintbrush
				size={100}
				className={s.disclaimerIcon}
				strokeWidth={1.5}
			/>
		</section>
	);
};
