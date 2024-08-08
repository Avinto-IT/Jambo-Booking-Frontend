import React from "react";
import { X } from "lucide-react";
import { FilterValues } from "@/components/FilterSheet";

interface FilterChipsProps {
  filterValues: FilterValues;
  onRemoveFilter: (filterValue: string) => void;
}

const FilterChips: React.FC<FilterChipsProps> = ({
  filterValues,
  onRemoveFilter,
}) => {
  const renderChip = (
    label: string,
    value: string,
    onRemove: (value: string) => void
  ) => (
    <div
      key={value}
      className="flex items-center space-x-2 border border-primary rounded-full px-4 py-2 mb-2 bg-[#EFF6FF] cursor-pointer"
      onClick={() => onRemove(value)}
    >
      <span className="font-medium text-primary">{label}</span>
      <X className="h-6 w-6 text-primary" />
    </div>
  );

  return (
    <div className="flex flex-wrap gap-2">
      {filterValues.facilities.map((facility) =>
        renderChip(facility, facility, onRemoveFilter)
      )}
      {/* Add more chips for other filters if needed */}
    </div>
  );
};

export default FilterChips;
