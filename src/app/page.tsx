"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";


import { useEffect, useState } from "react";

interface Hotel {
  hotelID: string;
  name: string;
  address: string;
  locationID: string;
  facilities: {
    name: string;
    comment: string;
    subFacilities: string[];
  }[];
  description: string;
  houseRules: { [key: string]: boolean };
  imageLinks: string[];
  primaryImageLink: string;
  isRunning: boolean;
  rooms: {
    [key: string]: {
      type: string;
      price: number;
      capacity: string;
      bed: {
        bedType: string;
        numberOfBeds: string;
      };
      amenities: { [key: string]: boolean };
    };
  };
  discount: number;
}

interface Location {
  locationID: string;
  city: string;
  country: string;
}

export default function Home() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch("/api/getHotels");
        const data = await response.json();
        setHotels(data);
      } catch (error) {
        console.log("Error fetching hotels:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch("/api/getLocation");
        const data = await response.json();
        setLocations(data);
      } catch (error) {
        console.log("Error fetching locations:", error);
      }
    };
    fetchLocations();
  }, []);

  return (
    <div className="bg-slate-50">
      <section>
        <MaxWidthWrapper className="pb-24 pt-10 lg:grid lg:grid-cols-3 sm;pb-32 lg:gap-x-0 xl:gap-x-8 lg:pt-24 xl:pt-32 lg:pb-52 ">
          <div className="col-span-2 px-6 lg:px-0 lg:pt-4">
            <div className="relative mx-auto text-center lg:text-left flex flex-col items-center lg:items-start">
              <div className="absolute w-28 left-0 -top-20 hidden lg:block">
                <span className="w-full text-3xl">LOGO</span>
              </div>
              <h1 className="relative w-fit tracking-tight text-balance font-bold !leading-tight text-gray-900 text-5xl md:text-6xl lg:text-7xl">
                Hotel Booking App
      
              </h1>
            </div>
            <a href="/login" className="underline text-blue-700">
              Login Page
            </a>
          </div>
         
          <ul>
            <h1 className="text-2xl font-semibold"> Locations </h1>
            {locations.map((location) => (
              <li key={location.locationID}>
                {location.city}, {location.country}
              </li>
            ))}
          </ul>
          </MaxWidthWrapper>
      </section>
      <div className="p-10">
        <h1>List of Hotels</h1>
        <ul className="flex flex-col gap-y-5">
          {hotels.map((hotel, index) => (
            <li
              key={hotel.hotelID}
              className="flex flex-col bg-red-50 border p-4"
            >
              {index + 1}
              <h2>Name: {hotel.name}</h2>
              <h2>Address: {hotel.address}</h2>
              <h2>Description: {hotel.description}</h2>
              <h2>Discount: {hotel.discount}</h2>
              <ul>
                <h2 className="font-semibold">Facilities</h2>
                {hotel.facilities.map((facility, facilityIndex) => (
                  <li key={facilityIndex} className="pl-3">
                    <div className="font-bold">{facility.name}</div>
                    <div>Comment: {facility.comment}</div>
                    <ul>
                      {facility.subFacilities.map(
                        (subFacility, subFacilityIndex) => (
                          <li key={subFacilityIndex} className="pl-3">
                            {subFacility}
                          </li>
                        )
                      )}
                    </ul>
                  </li>
                ))}
              </ul>
              <ul>
                <h2 className="font-semibold">House Rules</h2>
                {Object.entries(hotel.houseRules).map(([rule, value]) => (
                  <li key={rule} className="pl-3">
                    {rule}: {value ? "Yes" : "No"}
                  </li>
                ))}
              </ul>
              <ul>
                <h2 className="font-semibold">Rooms</h2>
                {Object.entries(hotel.rooms).map(([roomType, roomDetails]) => (
                  <li key={roomType} className="pl-3">
                    <h3 className="font-bold text-lg">
                      Room Type: {roomDetails.type}
                    </h3>
                    <p>Price: {Number(roomDetails.price).toFixed(2)}</p>
                    <p>Capacity: {roomDetails.capacity}</p>
                    <p>Bed Type: {roomDetails.bed.bedType}</p>
                    <p>Number of Beds: {roomDetails.bed.numberOfBeds}</p>
                    <ul>
                      <h4 className="font-semibold">Room Amenities</h4>
                      {roomDetails.amenities.map((amenity, index) => {
                        console.log(amenity);
                        return (
                          <li key={index} className="pl-3">
                            {amenity}
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                ))}
              </ul>
              <ul>
                <h2 className="font-semibold">Image Links: </h2>
                {hotel.imageLinks.map((link) => (
                  <li key={link} className="pl-3">
                    {link}
                  </li>
                ))}
              </ul>
              <h2>Primary Link: {hotel.primaryImageLink}</h2>
            </li>
          
          ))}
        </ul>
      </div>
   
    </div>
  );
}
