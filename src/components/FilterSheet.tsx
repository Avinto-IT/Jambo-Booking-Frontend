import React from "react";
import { Filter } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Checkbox } from "./ui/checkbox";
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

export interface FilterValues {
  propertyType: string | null;
  budgetRange: [number, number];
  bedrooms: number | null;
  beds: number | null;
  bathrooms: number | null;
  facilities: string[];
}

interface FilterSheetProps {
  onFilterChange: (filterValues: FilterValues) => void;
  facilities: Record<string, string[]>;
  filterValues: FilterValues;
}

const FilterSheet: React.FC<FilterSheetProps> = ({
  onFilterChange,
  facilities,
  filterValues,
}) => {
  const initialFilterValues: FilterValues = {
    propertyType: null,
    budgetRange: [100, 5000],
    bedrooms: null,
    beds: null,
    bathrooms: null,
    facilities: [],
  };

  const handleFilterChange = (key: keyof FilterValues, value: any) => {
    const updatedFilterValues = {
      ...filterValues,
      [key]: value,
    };
    onFilterChange(updatedFilterValues);
  };

  const handleClearFilters = () => {
    onFilterChange(initialFilterValues);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center space-x-2 p-2 border rounded"
        >
          <Filter className="h-4 w-4" />
          <span>Show Filter</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Filter</SheetTitle>
          <SheetDescription>
            Use these filters to narrow down your search
          </SheetDescription>
        </SheetHeader>
        {/* Property Type */}
        <div className="my-4">
          <h3 className="font-semibold">Property Type</h3>
          {/* Add your Property Type filter components here */}
        </div>
        {/* Budget Range */}
        <div className="my-4">
          <h3 className="font-semibold">Budget Range</h3>

          <Slider
            min={100}
            max={5000}
            value={filterValues.budgetRange}
            onValueChange={(value) =>
              handleFilterChange("budgetRange", value as [number, number])
            }
            className="mt-16"
          />
          <div className="flex items-center space-x-2 mt-4">
            <div className="flex items-center justify-start p-2 w-1/2 h-12 border rounded-lg text-muted-foreground">
              ${filterValues.budgetRange[0]}
            </div>
            <span className="text-slate-400 px-4">-</span>
            <div className="flex items-center justify-start p-2 w-1/2 h-12 border rounded-lg text-muted-foreground">
              ${filterValues.budgetRange[1]}
            </div>
          </div>
        </div>
        {/* Room and Beds */}
        <div className="my-4">
          <h3 className="font-semibold">Room and Beds</h3>
          {/* Add your Room and Beds filter components here */}
        </div>
        {/* Facilities */}
        <div className="my-16">
          <h3 className="font-semibold">Facilities</h3>
          {Object.keys(facilities).map((category) => (
            <Collapsible key={category}>
              <CollapsibleTrigger asChild>
                <div className="my-4 p-4 border rounded-lg">
                  <div className="flex w-full justify-between items-center">
                    <h4 className="font-semibold">{category}</h4>
                    <Button variant="ghost">
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                  <CollapsibleContent>
                    <div className="grid grid-cols-2 gap-4 my-6">
                      {facilities[category].map((facility, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Checkbox
                            id={facility}
                            checked={filterValues.facilities.includes(facility)}
                            onCheckedChange={(checked) =>
                              handleFilterChange(
                                "facilities",
                                checked
                                  ? [...filterValues.facilities, facility]
                                  : filterValues.facilities.filter(
                                      (f) => f !== facility
                                    )
                              )
                            }
                          />
                          <label htmlFor={facility}>{facility}</label>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </div>
              </CollapsibleTrigger>
            </Collapsible>
          ))}
        </div>
        <SheetFooter>
          <Button
            className="px-4 py-2 bg-primary text-white rounded"
            onClick={() => console.log(filterValues)}
          >
            Apply Filters
          </Button>
          <Button
            variant="outline"
            className="px-4 py-2 border rounded"
            onClick={handleClearFilters}
          >
            Clear Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default FilterSheet;
