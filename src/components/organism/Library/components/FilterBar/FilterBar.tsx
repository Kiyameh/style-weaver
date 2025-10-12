import { Search } from "lucide-react";
import type { FilterBarProps } from "../../types";
import s from "./FilterBar.module.css";

const FilterBar = ({
  searchQuery,
  onSearchChange,
  ...props
}: FilterBarProps) => {
  return (
    <div {...props} className={s.searchContainer}>
      <Search size={18} className={s.searchIcon} aria-hidden="true" />
      <input
        type="text"
        className={s.searchInput}
        placeholder="Search themes by name, description, or project..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="Search themes"
      />
    </div>
  );
};

export default FilterBar;
