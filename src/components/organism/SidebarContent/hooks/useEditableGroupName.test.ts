import { renderHook, act } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useEditableGroupName } from "./useEditableGroupName";

describe("useEditableGroupName", () => {
	describe("Initial State", () => {
		it("should initialize with null editingGroupName", () => {
			const { result } = renderHook(() => useEditableGroupName());

			expect(result.current.editingGroupName).toBeNull();
		});

		it("should initialize with empty tempGroupName", () => {
			const { result } = renderHook(() => useEditableGroupName());

			expect(result.current.tempGroupName).toBe("");
		});

		it("should not be editing any group initially", () => {
			const { result } = renderHook(() => useEditableGroupName());

			expect(result.current.isEditing("primary")).toBe(false);
			expect(result.current.isEditing("secondary")).toBe(false);
		});
	});

	describe("startEditing", () => {
		it("should set editingGroupName to the provided name", () => {
			const { result } = renderHook(() => useEditableGroupName());

			act(() => {
				result.current.startEditing("primary");
			});

			expect(result.current.editingGroupName).toBe("primary");
		});

		it("should set tempGroupName to the provided name", () => {
			const { result } = renderHook(() => useEditableGroupName());

			act(() => {
				result.current.startEditing("primary");
			});

			expect(result.current.tempGroupName).toBe("primary");
		});

		it("should make isEditing return true for the edited group", () => {
			const { result } = renderHook(() => useEditableGroupName());

			act(() => {
				result.current.startEditing("primary");
			});

			expect(result.current.isEditing("primary")).toBe(true);
		});

		it("should make isEditing return false for other groups", () => {
			const { result } = renderHook(() => useEditableGroupName());

			act(() => {
				result.current.startEditing("primary");
			});

			expect(result.current.isEditing("secondary")).toBe(false);
		});

		it("should allow switching between different groups", () => {
			const { result } = renderHook(() => useEditableGroupName());

			act(() => {
				result.current.startEditing("primary");
			});

			expect(result.current.isEditing("primary")).toBe(true);

			act(() => {
				result.current.startEditing("secondary");
			});

			expect(result.current.isEditing("primary")).toBe(false);
			expect(result.current.isEditing("secondary")).toBe(true);
			expect(result.current.tempGroupName).toBe("secondary");
		});
	});

	describe("cancelEditing", () => {
		it("should reset editingGroupName to null", () => {
			const { result } = renderHook(() => useEditableGroupName());

			act(() => {
				result.current.startEditing("primary");
			});

			act(() => {
				result.current.cancelEditing();
			});

			expect(result.current.editingGroupName).toBeNull();
		});

		it("should reset tempGroupName to empty string", () => {
			const { result } = renderHook(() => useEditableGroupName());

			act(() => {
				result.current.startEditing("primary");
			});

			act(() => {
				result.current.cancelEditing();
			});

			expect(result.current.tempGroupName).toBe("");
		});

		it("should make isEditing return false for all groups", () => {
			const { result } = renderHook(() => useEditableGroupName());

			act(() => {
				result.current.startEditing("primary");
			});

			act(() => {
				result.current.cancelEditing();
			});

			expect(result.current.isEditing("primary")).toBe(false);
			expect(result.current.isEditing("secondary")).toBe(false);
		});
	});

	describe("setTempGroupName", () => {
		it("should update tempGroupName", () => {
			const { result } = renderHook(() => useEditableGroupName());

			act(() => {
				result.current.startEditing("primary");
			});

			act(() => {
				result.current.setTempGroupName("brand");
			});

			expect(result.current.tempGroupName).toBe("brand");
		});

		it("should not affect editingGroupName", () => {
			const { result } = renderHook(() => useEditableGroupName());

			act(() => {
				result.current.startEditing("primary");
			});

			act(() => {
				result.current.setTempGroupName("brand");
			});

			expect(result.current.editingGroupName).toBe("primary");
		});

		it("should allow empty string", () => {
			const { result } = renderHook(() => useEditableGroupName());

			act(() => {
				result.current.startEditing("primary");
			});

			act(() => {
				result.current.setTempGroupName("");
			});

			expect(result.current.tempGroupName).toBe("");
		});
	});

	describe("isEditing", () => {
		it("should return true only for the currently editing group", () => {
			const { result } = renderHook(() => useEditableGroupName());

			act(() => {
				result.current.startEditing("primary");
			});

			expect(result.current.isEditing("primary")).toBe(true);
			expect(result.current.isEditing("secondary")).toBe(false);
			expect(result.current.isEditing("accent")).toBe(false);
		});

		it("should handle case-sensitive names", () => {
			const { result } = renderHook(() => useEditableGroupName());

			act(() => {
				result.current.startEditing("Primary");
			});

			expect(result.current.isEditing("Primary")).toBe(true);
			expect(result.current.isEditing("primary")).toBe(false);
		});
	});

	describe("Edge Cases", () => {
		it("should handle empty string as group name", () => {
			const { result } = renderHook(() => useEditableGroupName());

			act(() => {
				result.current.startEditing("");
			});

			expect(result.current.editingGroupName).toBe("");
			expect(result.current.tempGroupName).toBe("");
			expect(result.current.isEditing("")).toBe(true);
		});

		it("should handle special characters in group name", () => {
			const { result } = renderHook(() => useEditableGroupName());

			act(() => {
				result.current.startEditing("group-name_123");
			});

			expect(result.current.editingGroupName).toBe("group-name_123");
			expect(result.current.isEditing("group-name_123")).toBe(true);
		});

		it("should handle multiple cancel calls", () => {
			const { result } = renderHook(() => useEditableGroupName());

			act(() => {
				result.current.startEditing("primary");
			});

			act(() => {
				result.current.cancelEditing();
				result.current.cancelEditing();
			});

			expect(result.current.editingGroupName).toBeNull();
			expect(result.current.tempGroupName).toBe("");
		});
	});
});
