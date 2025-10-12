import FakeDashboard from "./FakeDashboard";

export default FakeDashboard;
export type { FakeDashboardProps } from "./types";
export {
	getColorWithFallback,
	getRadiusWithFallback,
	getShadowWithFallback,
} from "./fallbackUtils";
export { useThemeStyles } from "./useThemeStyles";
