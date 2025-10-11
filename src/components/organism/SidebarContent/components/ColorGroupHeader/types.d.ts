export interface ColorGroupHeaderProps {
  /** Name of the color group */
  groupName: string;

  /** Current number of variants */
  currentCount: number;

  /** Maximum number of variants allowed */
  maxVariants?: number;

  /** Minimum number of variants allowed */
  minVariants?: number;

  /** Callback when adding a variant */
  onVariantAdd: () => void;

  /** Callback when removing a variant */
  onVariantRemove: () => void;

  /** Callback when the group name changes (optional) */
  onNameChange?: (newName: string) => void;

  /** Whether the group name is editable */
  editable?: boolean;

  /** Whether to show the content checkbox */
  showContentCheckbox?: boolean;

  /** Whether the group has a content variant */
  hasContent?: boolean;

  /** Callback when content checkbox is toggled */
  onContentToggle?: (checked: boolean) => void;

  /** Whether the group is currently being edited */
  isEditing?: boolean;

  /** Callback when edit mode starts */
  onEditStart?: () => void;

  /** Temporary name while editing */
  tempName?: string;

  /** Callback when temp name changes */
  onTempNameChange?: (name: string) => void;
}
