"use client";

import * as React from "react";

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
import { Input } from "./ui/input";

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
}

const FilterSheet: React.FC<FilterSheetProps> = ({ onFilterChange }) => {
  const [filterValues, setFilterValues] = React.useState<FilterValues>({
    propertyType: null,
    budgetRange: [100, 5000],
    bedrooms: null,
    beds: null,
    bathrooms: null,
    facilities: [],
  });

  const handleFilterChange = (key: keyof FilterValues, value: any) => {
    const updatedFilterValues = {
      ...filterValues,
      [key]: value,
    };
    setFilterValues(updatedFilterValues);
    onFilterChange(updatedFilterValues);
  };

  React.useEffect(() => {
    onFilterChange(filterValues);
  }, []);

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

          {/* <div className="flex justify-between mt-2">
            <div className="tooltip">{`$${filterValues.budgetRange[0]}`}</div>
            <div className="tooltip">{`$${filterValues.budgetRange[1]}`}</div>
          </div> */}
        </div>

        {/* Room and Beds */}
        <div className="my-4">
          <h3 className="font-semibold">Room and Beds</h3>
          {/* Add your Room and Beds filter components here */}
        </div>

        {/* Facilities */}
        <div className="my-16">
          <h3 className="font-semibold">Facilities</h3>
          {/* Add your Facilities filter components here */}
          <div className="border rounded-lg my-6 p-6">asdasd</div>
        </div>

        <SheetFooter>
          <Button
            className="px-4 py-2 bg-primary text-white rounded"
            onClick={() => console.log(filterValues)}
          >
            Apply Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default FilterSheet;
