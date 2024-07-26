"use client"

import * as React from "react"

import { Filter } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet"
import { Button } from "./ui/button"
import { Slider } from "./ui/slider"
import { Input } from "./ui/input"



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
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              value={filterValues.budgetRange[0]}
              onChange={(e) => handleFilterChange('budgetRange', [Number(e.target.value), filterValues.budgetRange[1]])}
              className="w-24"
              min={100}
              max={1000}
            />
            <span>-</span>
            <Input
              type="number"
              value={filterValues.budgetRange[1]}
              onChange={(e) => handleFilterChange('budgetRange', [filterValues.budgetRange[0], Number(e.target.value)])}
              className="w-24"
              min={100}
              max={1000}
            />
          </div>
          {/* <Slider
            min={100}
            max={1000}
            value={filterValues.budgetRange}
            onValueChange={(value) => handleFilterChange('budgetRange', value as [number, number])}
            className="mt-4"
          >
            <Slider.Track className="relative bg-gray-200 h-2 rounded-full">
              <Slider.Range className="absolute bg-primary h-2 rounded-full" />
            </Slider.Track>
            <Slider.Thumb className="block w-4 h-4 bg-white border border-primary rounded-full shadow" />
            <Slider.Thumb className="block w-4 h-4 bg-white border border-primary rounded-full shadow" />
          </Slider> */}
          <div className="flex justify-between mt-2">
            <div className="tooltip">{`$${filterValues.budgetRange[0]}`}</div>
            <div className="tooltip">{`$${filterValues.budgetRange[1]}`}</div>
          </div>
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
