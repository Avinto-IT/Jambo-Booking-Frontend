"use client";
import { useEffect, useState } from "react";
import Select from "react-select";
interface Location {
  locationID: string;
  city: string;
  country: string;
  address: string;
  zipCode: string;
}

export default function Hero() {
  const [inputValue, setInputValue] = useState("");
  const [locations, setLocations] = useState<Location[]>([]);
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
    setLocationChange(selectedLocation?.locationID);
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
    locationChange
      ? (window.location.href = `/all-hotels/?id=${locationChange}`)
      : (window.location.href = "/all-hotels");
  };
  return (
    <section
      className="relative bg-cover 
      
       bg-blue-400 bg-center h-[70vh]"
      style={{ backgroundImage: "url('/images/hero.png')" }}
    >
      <div className="absolute inset-0 bg-black opacity-85"></div>
      <div className="relative z-0 flex flex-col items-center justify-center h-full text-center text-white px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Book Your Stay at Jambo Hotels
        </h1>
        <p className="max-w-7xl mb-8 w-full text-lg md:text-xl">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vitae
          bibendum varius dictumst consectetur non ullamcorper massa. Bibendum
          libero urna semper ornare. Lorem ipsum dolor sit amet, consectetur
          adipiscing elit. Vitae bibendum varius dictumst consectetur non
          ullamcorper massa. Bibendum libero urna semper ornare.
        </p>
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
              className="flex-1 rounded-lg bg-white text-black placeholder-gray-500 z-50"
            />
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
              // onClick={() => {
              //   locationChange
              //     ? (window.location.href = `/all-hotels/?id=${locationChange}`)
              //     : (window.location.href = "/all-hotels");
              // }}
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
