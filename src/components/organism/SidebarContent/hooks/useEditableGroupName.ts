import { useState } from "react";

export function useEditableGroupName() {
  const [editingGroupName, setEditingGroupName] = useState<string | null>(null);
  const [tempGroupName, setTempGroupName] = useState<string>("");

  /**
   * Start editing a group name
   * @param groupName - Name of the group to edit
   */
  const startEditing = (groupName: string) => {
    setEditingGroupName(groupName);
    setTempGroupName(groupName);
  };

  /**
   * Cancel editing and reset state
   */
  const cancelEditing = () => {
    setEditingGroupName(null);
    setTempGroupName("");
  };

  /**
   * Check if a specific group is being edited
   * @param name - Group name to check
   * @returns True if the group is being edited
   */
  const isEditing = (name: string): boolean => editingGroupName === name;

  return {
    editingGroupName,
    tempGroupName,
    setTempGroupName,
    startEditing,
    cancelEditing,
    isEditing,
  };
}
