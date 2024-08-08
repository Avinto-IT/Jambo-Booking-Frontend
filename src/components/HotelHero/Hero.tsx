"use client";
import { useEffect, useState } from "react";
import Select from "react-select";
import { Button } from "../ui/button";
import { DateRange } from "react-day-picker";
import { format, addDays } from "date-fns";
import { HeroDatePicker } from "../HeroDatePicker";
import { useRouter } from "next/navigation"; // Import the useRouter hook

interface Location {
  locationID: string;
  city: string;
  country: string;
  address: string;
  zipCode: string;
}

interface HeroProps {
  title: string;
  startDate?: Date | null;
  endDate?: Date | null;
}

export default function Hero({ title = "", startDate, endDate }: HeroProps) {
  const [inputValue, setInputValue] = useState("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [locationChange, setLocationChange] = useState<string | undefined>(
    undefined
  );
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startDate || addDays(new Date(), 10),
    to: endDate || addDays(new Date(), 14),
  });
  const router = useRouter(); // Initialize the useRouter hook

  const handleDateChange = (newDate: DateRange | undefined) => {
    setDateRange(newDate);
  };

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch("/api/getLocation");
        const data = await response.json();
        setLocations(data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, []);

  const handleLocationChange = (selectedOption: any) => {
    const selectedLocation = locations.find(
      (location) => location.locationID === selectedOption.value
    );
    setLocationChange(selectedLocation?.city);
  };

  const handleInputChange = (newValue: any) => {
    setInputValue(newValue);
    if (inputValue) setLocationChange(inputValue);
  };

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      minHeight: "52px",
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      height: "52px",
      padding: "0 6px",
    }),
    input: (provided: any) => ({
      ...provided,
      margin: "0px",
    }),
    indicatorsContainer: (provided: any) => ({
      ...provided,
      height: "52px",
    }),
  };

  if (!locations) return <>Loading..</>;

  const handleSearchClick = () => {
    const params = new URLSearchParams();
    if (locationChange) {
      params.append("location", locationChange);
    }
    if (dateRange?.from) {
      params.append("checkin", format(dateRange.from, "yyyy-MM-dd"));
    }
    if (dateRange?.to) {
      params.append("checkout", format(dateRange.to, "yyyy-MM-dd"));
    }
    router.push(`/all-hotels/?${params.toString()}`);
  };

  return (
    <section
      className="relative bg-cover bg-blue-400 bg-center h-80"
      style={{ backgroundImage: "url('/images/hero.png')" }}
    >
      <div className="absolute inset-0 bg-black opacity-85"></div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">
          Searched Result For: {title}
        </h1>
        <div className="w-full max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Select
              instanceId="location-select"
              options={locations?.map((location) => ({
                value: location.locationID,
                label: `${location.city}, ${location.country}`,
              }))}
              onChange={handleLocationChange}
              onInputChange={handleInputChange}
              inputValue={inputValue}
              placeholder="Where are you planning to go..."
              styles={customStyles}
              className="flex-1 rounded-lg bg-white text-black placeholder-gray-500 z-50 max-w-[550px]"
            />
            <HeroDatePicker
              onDateChange={handleDateChange}
              from={dateRange?.from}
              to={dateRange?.to}
              alwaysOpen={false}
            />
            <Button
              className="h-14 w-32"
              onClick={() => {
                handleSearchClick();
              }}
            >
              Search
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
