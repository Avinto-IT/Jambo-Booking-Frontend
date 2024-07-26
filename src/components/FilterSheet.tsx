"use client"

import * as React from "react"

import { Filter } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet"
import { Button } from "./ui/button"



interface FilterValues {
  propertyType: string | null
  budgetRange: [number, number]
  bedrooms: number | null
  beds: number | null
  bathrooms: number | null
  facilities: string[]
}

const FilterSheet: React.FC = () => {
  const [filterValues, setFilterValues] = React.useState<FilterValues>({
    propertyType: null,
    budgetRange: [0, 500],
    bedrooms: null,
    beds: null,
    bathrooms: null,
    facilities: []
  });

  const handleFilterChange = (key: keyof FilterValues, value: any) => {
    setFilterValues(prevState => ({
      ...prevState,
      [key]: value
    }));
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2 p-2 border rounded">
          <Filter className="h-4 w-4" />
          <span>Show Filter</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Filter</SheetTitle>
          <SheetDescription>Use these filters to narrow down your search</SheetDescription>
        </SheetHeader>
        
        {/* Property Type */}
        <div className="my-4">
          <h3 className="font-semibold">Property Type</h3>
          {/* Add your Property Type filter components here */}
        </div>
        
        {/* Budget Range */}
        <div className="my-4">
          <h3 className="font-semibold">Budget Range</h3>
          {/* Add your Budget Range filter components here */}
        </div>
        
        {/* Room and Beds */}
        <div className="my-4">
          <h3 className="font-semibold">Room and Beds</h3>
          {/* Add your Room and Beds filter components here */}
        </div>
        
        {/* Facilities */}
        <div className="my-4">
          <h3 className="font-semibold">Facilities</h3>
          {/* Add your Facilities filter components here */}
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
