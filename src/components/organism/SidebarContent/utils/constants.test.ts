import { describe, expect, it } from "vitest";
import {
	DEFAULT_LIGHTNESS_INCREMENT,
	MAX_GROUP_NAME_LENGTH,
	MAX_VARIANTS,
	MIN_VARIANTS,
} from "./constants";

describe("constants", () => {
	describe("DEFAULT_LIGHTNESS_INCREMENT", () => {
		it("should be a positive number", () => {
			expect(DEFAULT_LIGHTNESS_INCREMENT).toBeGreaterThan(0);
		});

		it("should be 0.2", () => {
			expect(DEFAULT_LIGHTNESS_INCREMENT).toBe(0.2);
		});
	});

	describe("MAX_VARIANTS", () => {
		it("should be a positive number", () => {
			expect(MAX_VARIANTS).toBeGreaterThan(0);
		});

		it("should be greater than MIN_VARIANTS", () => {
			expect(MAX_VARIANTS).toBeGreaterThan(MIN_VARIANTS);
		});

		it("should be 10", () => {
			expect(MAX_VARIANTS).toBe(10);
		});
	});

	describe("MIN_VARIANTS", () => {
		it("should be a positive number", () => {
			expect(MIN_VARIANTS).toBeGreaterThan(0);
		});

		it("should be 1", () => {
			expect(MIN_VARIANTS).toBe(1);
		});
	});

	describe("MAX_GROUP_NAME_LENGTH", () => {
		it("should be a positive number", () => {
			expect(MAX_GROUP_NAME_LENGTH).toBeGreaterThan(0);
		});

		it("should be 14", () => {
			expect(MAX_GROUP_NAME_LENGTH).toBe(14);
		});
	});
});
