"use client";

import { useEffect, useState } from "react";

import Select from "react-select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
interface Location {
  locationID: string;
  city: string;
  country: string;
  address: string;
  zipCode: string;
}
interface HeroProp {
  title: string | any;
}
const Hero: React.FC<HeroProp> = ({ title }) => {
  const [inputValue, setInputValue] = useState("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [error, setError] = useState("");
  const [locationChange, setLocationChange] = useState<string | undefined>(
    undefined
  );

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
      minHeight: "52px", // Adjust this value to match the height of other input fields
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
    if (locationChange)
      locationChange
        ? (window.location.href = `/all-hotels/?id=${locationChange}`)
        : (window.location.href = "/all-hotels");
    else setError("Enter a destination to start searching.");
  };
  return (
    <section
      className="relative bg-cover z-50 
      
       bg-blue-400 bg-center h-80"
      style={{ backgroundImage: "url('/images/head/Header_Image.svg')" }}
    >
      <div className="absolute inset-0 bg-[#020617] opacity-85"></div>
      <div className="relative z-0 flex flex-col items-center justify-center h-full text-center text-white px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">
          Searched Result For: {title}
        </h1>

        <div className="w-full max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <div className="w-full">
              <Select
                instanceId="location-select"
                options={locations.map((location) => ({
                  value: location.locationID,
                  label: `${location.city}, ${location.country}`,
                }))}
                required={true}
                onChange={handleLocationChange}
                onInputChange={handleInputChange}
                inputValue={inputValue}
                placeholder="Where are you planning to go..."
                styles={customStyles}
                className="flex-1 rounded-lg bg-white text-black placeholder-gray-500 z-50"
                onFocus={() => setError("")}
              />

              {error && (
                <div className="absolute flex items-center left-40 w-fit text-white text-sm py-1 px-2 rounded-sm  bg-red-800 border-none h-fit">
                  <AlertCircle className="h-4" />
                  Enter a destination to start searching.
                </div>
              )}
            </div>
            <input
              type="text"
              placeholder="Checkin Date"
              className="p-4 rounded-lg bg-white text-black placeholder-gray-500"
            />
            <input
              type="text"
              placeholder="Checkout Date"
              className="p-4 rounded-lg bg-white text-black placeholder-gray-500"
            />
            <button
              className="p-4 bg-blue-600 text-white rounded-lg"
              onClick={() => {
                handleSearchClick();
              }}
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Hero;
